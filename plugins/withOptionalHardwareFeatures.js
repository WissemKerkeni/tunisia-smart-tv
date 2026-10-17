// Declares hardware features as optional so Play doesn't filter out devices
// without them (e.g. Ethernet-only Android TV boxes have no Wi-Fi).
// ACCESS_WIFI_STATE (from NetInfo) otherwise implies android.hardware.wifi as required.
const { withAndroidManifest } = require('expo/config-plugins');

const OPTIONAL_FEATURES = ['android.hardware.wifi'];

module.exports = function withOptionalHardwareFeatures(config) {
  return withAndroidManifest(config, (cfg) => {
    const manifest = cfg.modResults.manifest;
    manifest['uses-feature'] = manifest['uses-feature'] ?? [];
    for (const name of OPTIONAL_FEATURES) {
      const existing = manifest['uses-feature'].find((f) => f.$['android:name'] === name);
      if (existing) existing.$['android:required'] = 'false';
      else manifest['uses-feature'].push({ $: { 'android:name': name, 'android:required': 'false' } });
    }
    return cfg;
  });
};
