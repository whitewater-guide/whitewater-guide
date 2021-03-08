import { expect } from 'detox';

beforeEach(async () => {
  await device.reloadReactNative();
});

it('should render by default', async () => {
  await element(by.id('header-menu')).tap();
  await element(by.label('drawer:signIn')).tap();
  // main screen
  await expect(element(by.id('auth-main-local'))).toBeVisible();
  await expect(element(by.id('auth-main-signin'))).toBeVisible();
  // register
  await element(by.id('auth-main-local')).tap();
  await expect(element(by.label('SCREENS:AUTH.REGISTER.SUBMIT'))).toBeVisible();
  // back on main screen and then to login screen
  await element(by.id('header-back')).atIndex(0).tap();
  await element(by.id('auth-main-signin')).tap();
  // login via email screen
  await expect(element(by.label('SCREENS:AUTH.SIGNIN.REGISTER'))).toBeVisible();
  await expect(element(by.label('screens:auth.signin.forgot'))).toBeVisible();
  // forgot password screen
  await element(by.label('screens:auth.signin.forgot')).tap();
  await expect(element(by.label('SCREENS:AUTH.FORGOT.SUBMIT'))).toBeVisible();
  // back to home screen
  await element(by.id('header-back')).atIndex(0).tap();
  await element(by.id('header-back')).atIndex(0).tap();
  await element(by.id('header-back')).tap();
  await expect(element(by.id('RegionCard1'))).toBeVisible();
});

it('should handle password reset url from email', async () => {
  await device.launchApp({
    newInstance: true,
    url:
      'https://api.beta.whitewater.guide/auth/local/reset/callback?id=foo&token=bar',
  });
  await expect(element(by.label('screens:auth.reset.title'))).toBeVisible();
  await element(by.id('header-back')).atIndex(0).tap();
  await expect(element(by.id('RegionCard1'))).toBeVisible();
});
