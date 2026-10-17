#!/usr/bin/env bash
# Build a local release APK for one variant: phone | tv
# Usage: bash scripts/build-apk.sh phone|tv
#   ABIS=arm64-v8a            CPU architectures to compile (default per variant, see below)
#   SKIP_PREBUILD=1           reuse the existing android/ (only if it was generated for the same variant)
#   TEST_STREAMS=0            leave out the QA test streams (included by default in these QA APKs)
# Output: dist-apk/tunisietv-<variant>-release.apk
# Signed with the upload key when TUNISIETV_UPLOAD_* are set (see scripts/build-aab.sh), else the debug key.
set -euo pipefail

VARIANT="${1:?usage: build-apk.sh phone|tv}"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

export ANDROID_HOME="${ANDROID_HOME:-$LOCALAPPDATA/Android/Sdk}"

if [ "$VARIANT" = "tv" ]; then
  export EXPO_TV=1
  # Many Android TV boxes still run 32-bit ARM userspace; x86_64 for the TV emulator.
  DEFAULT_ABIS="armeabi-v7a,arm64-v8a,x86_64"
else
  unset EXPO_TV
  DEFAULT_ABIS="arm64-v8a"
fi
ABIS="${ABIS:-$DEFAULT_ABIS}"
export TUNISIETV_TEST_STREAMS="${TEST_STREAMS:-1}"

# android/ is generated (CNG) and gitignored; --clean regenerates it for this variant.
if [ "${SKIP_PREBUILD:-0}" != "1" ]; then
  npx expo prebuild --platform android --clean --no-install
fi

# Longer HTTP timeouts: dependency downloads time out on slow connections with the defaults.
(cd android && ./gradlew assembleRelease --console=plain \
  -PreactNativeArchitectures="$ABIS" \
  -Dorg.gradle.internal.http.connectionTimeout=180000 \
  -Dorg.gradle.internal.http.socketTimeout=180000 \
  -Dorg.gradle.internal.repository.max.retries=6)

mkdir -p dist-apk
cp android/app/build/outputs/apk/release/app-release.apk "dist-apk/tunisietv-$VARIANT-release.apk"
echo "Built dist-apk/tunisietv-$VARIANT-release.apk ($ABIS)"
