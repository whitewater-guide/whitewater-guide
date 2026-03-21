/**
 * Sign out via My Profile screen.
 * Assumes authenticated and on a screen with header menu.
 * Ends on REGIONS_LIST.
 */
export async function signOut(): Promise<void> {
  await element(by.id('header:menu')).tap();
  await element(by.id('drawer:my-profile')).tap();
  await element(by.id('my-profile:sign-out')).tap();
}

/**
 * Sign in via drawer → AUTH_MAIN → AUTH_SIGN_IN → submit.
 * Assumes anonymous and on a screen with header menu.
 * Ends on REGIONS_LIST.
 */
export async function signIn(): Promise<void> {
  await element(by.id('header:menu')).tap();
  await element(by.id('drawer:sign-in')).tap();
  await element(by.id('auth:sign-in')).tap();
  await element(by.id('auth:submit-sign-in')).tap();
}
