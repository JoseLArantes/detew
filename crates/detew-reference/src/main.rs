#![forbid(unsafe_code)]

fn main() {
    println!(
        "Detew {:?} scaffold only; no network filtering is active.",
        detew_policy::domain::BootstrapStage::DevelopmentOnly
    );
}
