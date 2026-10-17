#!/usr/bin/env bash
# Build a signed Play Store bundle for one variant: phone | tv
# Usage: TUNISIETV_VERSION_CODE=2 bash scripts/build-aab.sh phone|tv
# Requires the upload key (create it once with scripts/create-upload-keystore.sh):
#   TUNISIETV_UPLOAD_STORE_FILE, TUNISIETV_UPLOAD_STORE_PASSWORD,
#   TUNISIETV_UPLOAD_KEY_ALIAS, TUNISIETV_UPLOAD_KEY_PASSWORD
# Store builds never include the QA test streams.
# Output: dist-aab/tunisietv-<variant>-<versionCode>.aab
set -euo pipefail

VARIANT="${1:?usage: build-aab.sh phone|tv}"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

for v in TUNISIETV_UPLOAD_STORE_FILE TUNISIETV_UPLOAD_STORE_PASSWORD TUNISIETV_UPLOAD_KEY_ALIAS TUNISIETV_UPLOAD_KEY_PASSWORD TUNISIETV_VERSION_CODE; do
  if [ -z "${!v:-}" ]; then echo "Missing $v" >&2; exit 1; fi
done
if [ ! -f "$TUNISIETV_UPLOAD_STORE_FILE" ]; then echo "Keystore not found: $TUNISIETV_UPLOAD_STORE_FILE" >&2; exit 1; fi

export ANDROID_HOME="${ANDROID_HOME:-$LOCALAPPDATA/Android/Sdk}"
export TUNISIETV_TEST_STREAMS=0
if [ "$VARIANT" = "tv" ]; then export EXPO_TV=1; else unset EXPO_TV; fi

npx expo prebuild --platform android --clean --no-install

# All ABIs: Play delivers only the matching one to each device.
(cd android && ./gradlew bundleRelease --console=plain \
  -Dorg.gradle.internal.http.connectionTimeout=180000 \
  -Dorg.gradle.internal.http.socketTimeout=180000 \
  -Dorg.gradle.internal.repository.max.retries=6)

mkdir -p dist-aab
OUT="dist-aab/tunisietv-$VARIANT-$TUNISIETV_VERSION_CODE.aab"
cp android/app/build/outputs/bundle/release/app-release.aab "$OUT"
echo "Built $OUT"
