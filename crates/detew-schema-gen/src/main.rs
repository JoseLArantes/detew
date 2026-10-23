#![forbid(unsafe_code)]

use std::env;
use std::error::Error;
use std::fs;
use std::path::PathBuf;

use detew_domain::BootstrapInfo;
use schemars::schema_for;
use serde_json::{Value, json};

fn main() -> Result<(), Box<dyn Error>> {
    let output = env::args_os()
        .nth(1)
        .map(PathBuf::from)
        .ok_or_else(|| std::io::Error::other("usage: detew-schema-gen <output-path>"))?;

    let mut schema = serde_json::to_value(schema_for!(BootstrapInfo))?;
    let schema_object = schema
        .as_object_mut()
        .ok_or_else(|| std::io::Error::other("generated schema root is not an object"))?;
    schema_object.insert(
        "$schema".to_owned(),
        json!("https://json-schema.org/draft/2020-12/schema"),
    );
    schema_object.insert("$id".to_owned(), json!("urn:detew:bootstrap-info:v1"));

    validate_schema_shape(&schema)?;
    let serialized = format!("{}\n", serde_json::to_string_pretty(&schema)?);
    fs::create_dir_all(
        output
            .parent()
            .ok_or_else(|| std::io::Error::other("output path needs a parent"))?,
    )?;
    fs::write(output, serialized)?;
    Ok(())
}

fn validate_schema_shape(schema: &Value) -> Result<(), Box<dyn Error>> {
    if schema["$schema"] != "https://json-schema.org/draft/2020-12/schema" {
        return Err(
            std::io::Error::other("schema dialect was not set to JSON Schema 2020-12").into(),
        );
    }
    if schema["type"] != "object" || schema["additionalProperties"] != false {
        return Err(std::io::Error::other("bootstrap schema must be a closed object").into());
    }
    Ok(())
}
