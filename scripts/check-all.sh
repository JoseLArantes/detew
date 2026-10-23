#!/usr/bin/env bash
# SPDX-License-Identifier: MIT
set -u

script_directory="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
portable_status=0
native_status=0

"$script_directory/check-portable.sh" || portable_status=$?
"$script_directory/check-native.sh" || native_status=$?

if [[ "$portable_status" -ne 0 ]]; then
  printf 'RESULT: FAIL (portable exit %s; native exit %s)\n' "$portable_status" "$native_status" >&2
  exit 1
fi
if [[ "$native_status" -eq 3 ]]; then
  printf 'RESULT: PORTABLE PASS; NATIVE UNAVAILABLE (exit 3)\n'
  exit 3
fi
if [[ "$native_status" -ne 0 ]]; then
  printf 'RESULT: PORTABLE PASS; NATIVE FAIL (exit %s)\n' "$native_status" >&2
  exit 1
fi

printf 'RESULT: PORTABLE PASS; NATIVE PASS\n'
