#!/usr/bin/env bash
# SPDX-License-Identifier: MIT
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$repo_root"

expected_rust="rustc 1.99.1"
actual_rust="$(rustc --version)"
if [[ "$actual_rust" != "$expected_rust"* ]]; then
  printf 'FAIL: expected %s, found %s\n' "$expected_rust" "$actual_rust" >&2
  exit 1
fi

expected_node="v24.22.1"
actual_node="$(node --version)"
if [[ "$actual_node" != "$expected_node" ]]; then
  printf 'FAIL: expected Node %s, found %s\n' "$expected_node" "$actual_node" >&2
  exit 1
fi

expected_npm="11.19.1"
actual_npm="$(npm --version)"
if [[ "$actual_npm" != "$expected_npm" ]]; then
  printf 'FAIL: expected npm %s, found %s\n' "$expected_npm" "$actual_npm" >&2
  exit 1
fi

printf 'PASS: pinned portable tools (%s, %s, npm %s)\n' "$actual_rust" "$actual_node" "$actual_npm"
cargo fmt --all -- --check
cargo clippy --workspace --all-targets --all-features --locked -- -D warnings
cargo test --workspace --all-features --locked

cd "$repo_root/ui"
npm ci
# Validation must compare committed generated contracts without rewriting them.
npm run contracts:check
npm run check:boundaries
npm run check:fixtures
npm run typecheck
npm run lint
npm test
npm run build

printf 'PASS: all portable checks completed. Native checks remain a separate result.\n'
