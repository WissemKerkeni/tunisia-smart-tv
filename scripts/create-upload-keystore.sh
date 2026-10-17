#!/usr/bin/env bash
# Create the Play upload key ONCE. keytool asks for the passwords interactively.
# Keep the keystore and its passwords somewhere safe and OUTSIDE the repo: losing them
# means asking Play support for an upload-key reset.
# Usage: bash scripts/create-upload-keystore.sh [path]   (default: ~/.tunisietv/upload.p12)
set -euo pipefail

OUT="${1:-$HOME/.tunisietv/upload.p12}"
if [ -e "$OUT" ]; then echo "$OUT already exists; not overwriting." >&2; exit 1; fi
mkdir -p "$(dirname "$OUT")"

keytool -genkeypair -v -storetype PKCS12 -keystore "$OUT" -alias tunisietv-upload \
  -keyalg RSA -keysize 2048 -validity 10000

echo "Created $OUT (alias tunisietv-upload). Set TUNISIETV_UPLOAD_STORE_FILE=$OUT"
