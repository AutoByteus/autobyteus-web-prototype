import { useAppFontSizeStore } from '~/stores/appFontSizeStore';
import { isMobileRemoteAccessRuntime } from '~/utils/remoteAccess/mobileRuntime';

/**
 * phone-baseline-refresh-279: the phone branch of the source's `plugins/06.appFontSize.client.ts`
 * (`origin/personal@f7b4d68711`, autobyteus-525). On the phone page the phone's Text size is the source of the app's
 * font metrics, chosen once before the app mounts. The desktop branch (the Display preset's `initialize()`) is left out,
 * so the desktop surfaces keep their accepted pin.
 */
export default defineNuxtPlugin(() => {
  if (!isMobileRemoteAccessRuntime()) return;
  useAppFontSizeStore().initializePhoneTextSize();
});
