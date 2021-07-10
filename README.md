# A frontend for the Taiwanese government AQI data

I want a simple frontend for it without all the bloat around other apps.

I also want it to be a standalone app, eventually.

This is my attempt.

## Capacitor

- Remember to unset `ANDROID_HOME` if it's set for some reason so that the SDK at `~/Android/sdk` is used.
- (Implying that the SDK is installed there. Do that with Android Studio.)
- Use `npx native-run android --list --verbose` to check where issues are coming from.
- Set `CAPACITOR_ANDROID_STUDIO_PATH=/opt/android-studio/bin/studio.sh` so that `npx cap open android` works.
