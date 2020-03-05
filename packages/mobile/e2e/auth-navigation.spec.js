beforeEach(async () => {
  await device.reloadReactNative();
});

it('should render by default', async () => {
  await element(by.id('header-menu')).tap();
  await element(by.label('signIn')).tap();
  // main screen
  await expect(element(by.id('auth-main-local'))).toBeVisible();
  await expect(element(by.id('auth-main-signin'))).toBeVisible();
  // register
  await element(by.id('auth-main-local')).tap();
  await expect(element(by.label('AUTH.REGISTER.SUBMIT'))).toBeVisible();
  // back on main screen and then to login screen
  await element(by.id('header-back')).tap();
  await element(by.id('auth-main-signin')).tap();
  // login via email screen
  await expect(element(by.label('AUTH.SIGNIN.REGISTER'))).toBeVisible();
  await expect(element(by.label('auth.signin.forgot'))).toBeVisible();
  // forgot password screen
  await element(by.label('auth.signin.forgot')).tap();
  await expect(element(by.label('AUTH.FORGOT.SUBMIT'))).toBeVisible();
  // back to home screen
  await element(by.id('header-back')).tap();
  await element(by.id('header-back')).tap();
  await element(by.id('header-back')).tap();
  await expect(element(by.id('RegionCard1'))).toBeVisible();
});

it('should handle password reset url from email', async () => {
  await device.launchApp({
    newInstance: true,
    url:
      'https://api.beta.whitewater.guide/auth/local/reset/callback?id=foo&token=bar',
  });
  await expect(element(by.label('auth.reset.title'))).toBeVisible();
  await element(by.id('header-back')).tap();
  await element(by.id('header-back')).tap();
  await expect(element(by.id('RegionCard1'))).toBeVisible();
});
