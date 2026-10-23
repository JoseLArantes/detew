/* Generated from the Rust bootstrap fixture. Do not edit by hand. */

export type BootstrapStage = "development_only" | "not_enforcing";

/**
 * A deliberately small fixture for validating the Rust-to-schema-to-TypeScript
 * toolchain. It is not a runtime status API or an enforcement claim.
 */
export interface BootstrapInfo {
  component: string;
  stage: BootstrapStage;
}
