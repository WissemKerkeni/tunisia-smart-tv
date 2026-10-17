// Signs release builds with the Play upload key when its environment variables
// are set, and with the template debug key otherwise (local QA builds only).
// Secrets never touch the repo or android/: Gradle reads them from the env.
//   TUNISIETV_UPLOAD_STORE_FILE      absolute path to the keystore (.p12) (keep it outside the repo)
//   TUNISIETV_UPLOAD_STORE_PASSWORD
//   TUNISIETV_UPLOAD_KEY_ALIAS
//   TUNISIETV_UPLOAD_KEY_PASSWORD
const { withAppBuildGradle } = require('expo/config-plugins');

const MARKER = '// tunisietv-release-signing';

const RELEASE_SIGNING_CONFIG = `
        release { ${MARKER}
            def uploadStore = System.getenv('TUNISIETV_UPLOAD_STORE_FILE')
            if (uploadStore) {
                storeFile file(uploadStore)
                storePassword System.getenv('TUNISIETV_UPLOAD_STORE_PASSWORD')
                keyAlias System.getenv('TUNISIETV_UPLOAD_KEY_ALIAS')
                keyPassword System.getenv('TUNISIETV_UPLOAD_KEY_PASSWORD')
            }
        }`;

module.exports = function withReleaseSigning(config) {
  return withAppBuildGradle(config, (cfg) => {
    let gradle = cfg.modResults.contents;
    if (gradle.includes(MARKER)) return cfg;

    // 1. The release *build type* uses the upload key when it is configured.
    //    (Done first, and anchored on buildTypes, so it can't match the signing config added below.)
    const releaseUsesDebug = /(buildTypes \{[\s\S]*?release \{[\s\S]*?)signingConfig signingConfigs\.debug/;
    if (!releaseUsesDebug.test(gradle)) throw new Error('withReleaseSigning: release signingConfig not found');
    gradle = gradle.replace(
      releaseUsesDebug,
      "$1signingConfig System.getenv('TUNISIETV_UPLOAD_STORE_FILE') ? signingConfigs.release : signingConfigs.debug",
    );

    // 2. Add the `release` signing config after the template's `debug` one.
    const debugConfig = /(signingConfigs \{\s*debug \{[^}]*\})/;
    if (!debugConfig.test(gradle)) throw new Error('withReleaseSigning: signingConfigs.debug not found');
    gradle = gradle.replace(debugConfig, `$1${RELEASE_SIGNING_CONFIG}`);

    cfg.modResults.contents = gradle;
    return cfg;
  });
};
