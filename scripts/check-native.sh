#!/usr/bin/env bash
# SPDX-License-Identifier: MIT
set -euo pipefail

system="$(uname -s)"
if [[ "$system" != "FreeBSD" ]]; then
  printf 'UNAVAILABLE: native check requires the pinned FreeBSD/OPNsense lab; current system is %s.\n' "$system"
  exit 3
fi

printf 'UNAVAILABLE: native packet and OPNsense checks are not implemented in M00; no native pass is claimed.\n'
exit 3
