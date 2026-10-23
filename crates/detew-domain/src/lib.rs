#![forbid(unsafe_code)]

use schemars::JsonSchema;
use serde::{Deserialize, Serialize};

/// A deliberately small fixture for validating the Rust-to-schema-to-TypeScript
/// toolchain. It is not a runtime status API or an enforcement claim.
#[derive(Clone, Debug, Deserialize, Eq, JsonSchema, PartialEq, Serialize)]
#[serde(deny_unknown_fields)]
pub struct BootstrapInfo {
    pub component: String,
    pub stage: BootstrapStage,
}

#[derive(Clone, Copy, Debug, Deserialize, Eq, JsonSchema, PartialEq, Serialize)]
#[serde(rename_all = "snake_case")]
pub enum BootstrapStage {
    DevelopmentOnly,
    NotEnforcing,
}

#[cfg(test)]
mod tests {
    use super::{BootstrapInfo, BootstrapStage};

    #[test]
    fn bootstrap_fixture_round_trips() {
        let value = BootstrapInfo {
            component: "detew".to_owned(),
            stage: BootstrapStage::NotEnforcing,
        };

        let encoded = serde_json::to_string(&value).expect("serialize fixture");
        let decoded: BootstrapInfo = serde_json::from_str(&encoded).expect("deserialize fixture");

        assert_eq!(decoded, value);
    }

    #[test]
    fn unknown_fields_are_rejected() {
        let result = serde_json::from_str::<BootstrapInfo>(
            r#"{"component":"detew","stage":"not_enforcing","admin":true}"#,
        );

        assert!(result.is_err());
    }
}
