import {
  expectScreen,
  tapDrawerItem,
  tapHeaderBack,
} from '../helpers/navigation';

const DEEP_LINK_PREFIX = 'https://app.whitewater.guide';

describe('Auth navigation', () => {
  beforeAll(async () => {
    await device.launchApp({ newInstance: true });
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should complete full auth lifecycle: sign out, gate, sign in', async () => {
    // Start authenticated (E2E default)
    // Open drawer and verify My Profile is visible
    await element(by.id('header:menu')).tap();
    await expect(element(by.id('drawer:my-profile'))).toBeVisible();

    // Tap My Profile
    await element(by.id('drawer:my-profile')).tap();
    await expectScreen('MY_PROFILE');

    // Sign out — resets to REGIONS_LIST
    await element(by.id('my-profile:sign-out')).tap();
    await expectScreen('REGIONS_LIST');

    // Open drawer — verify Sign In is visible, My Profile is gone
    await element(by.id('header:menu')).tap();
    await expect(element(by.id('drawer:sign-in'))).toBeVisible();

    // Logbook should redirect to auth when logged out
    await element(by.id('drawer:logbook')).tap();
    await expectScreen('AUTH_MAIN');

    // Back to regions
    await tapHeaderBack();
    await expectScreen('REGIONS_LIST');

    // Tap Sign In drawer item
    await tapDrawerItem('sign-in');
    await expectScreen('AUTH_MAIN');

    // Navigate to sign-in screen
    await element(by.id('auth:sign-in')).tap();
    await expectScreen('AUTH_SIGN_IN');

    // Navigate to forgot password and back
    await element(by.id('auth:forgot')).tap();
    await expectScreen('AUTH_FORGOT');
    await tapHeaderBack();
    await expectScreen('AUTH_SIGN_IN');

    // Back to auth main
    await tapHeaderBack();
    await expectScreen('AUTH_MAIN');

    // Navigate to register and back
    await element(by.id('auth:register')).tap();
    await expectScreen('AUTH_REGISTER');
    await tapHeaderBack();
    await expectScreen('AUTH_MAIN');

    // Sign in: go to sign-in screen and submit
    await element(by.id('auth:sign-in')).tap();
    await expectScreen('AUTH_SIGN_IN');
    await element(by.id('auth:submit-sign-in')).tap();
    await expectScreen('REGIONS_LIST');

    // Verify authenticated: My Profile should be visible
    await element(by.id('header:menu')).tap();
    await expect(element(by.id('drawer:my-profile'))).toBeVisible();

    // Tap My Profile
    await element(by.id('drawer:my-profile')).tap();
    await expectScreen('MY_PROFILE');

    // Back to regions
    await tapHeaderBack();
    await expectScreen('REGIONS_LIST');

    // Logbook should now go to logbook
    await tapDrawerItem('logbook');
    await expectScreen('LOGBOOK');
  });

  it('should deep link to auth reset', async () => {
    await device.openURL({ url: `${DEEP_LINK_PREFIX}/auth/reset/token123` });
    await expectScreen('AUTH_RESET');
  });
});
