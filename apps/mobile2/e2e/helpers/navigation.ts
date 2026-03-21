/**
 * Shared Detox helpers for navigation E2E tests.
 */

/** Assert that a screen with the given name is currently visible. */
export async function expectScreen(screenName: string): Promise<void> {
  await expect(element(by.id(`screen:${screenName}`))).toBeVisible();
}

/** Open the drawer via the header menu button, then tap a drawer item. */
export async function tapDrawerItem(item: string): Promise<void> {
  await element(by.id('header:menu')).tap();
  await element(by.id(`drawer:${item}`)).tap();
}

/** Tap a tab identified by screen name. */
export async function tapTab(screenName: string): Promise<void> {
  await element(by.id(`tab:${screenName}`)).tap();
}

/** Tap the header back button. */
export async function tapHeaderBack(): Promise<void> {
  await element(by.id('header:back')).tap();
}

/** From REGIONS_LIST, navigate into a region. Ends at REGION_MAP. */
export async function navigateToRegion(): Promise<void> {
  await element(by.id('mock:navigate:REGION_STACK')).tap();
  await expectScreen('REGION_MAP');
}

/**
 * From REGIONS_LIST, navigate into a section (through a region).
 * Ends at SECTION_INFO (the initial tab).
 */
export async function navigateToSection(): Promise<void> {
  await navigateToRegion();
  await element(by.id('mock:navigate:SECTION_SCREEN')).tap();
  await expectScreen('SECTION_INFO');
}
