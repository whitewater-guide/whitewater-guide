import { expect } from 'detox';

beforeEach(async () => {
  await device.reloadReactNative();
  await device.enableSynchronization();
  await element(by.id('RegionCard1')).tap();
  // tab view is designed this way
  await element(by.id('region-tab-list'))
    .atIndex(0)
    .tap();
  await element(by.id('SectionsListItem0')).tap();
});

it('should navigate back to region', async () => {
  await expect(element(by.label('commons:difficulty'))).toBeVisible();
  await expect(element(by.label('section:info.title'))).toBeVisible();
  await expect(element(by.id('section-info-fab'))).toBeVisible();
  await element(by.id('header-back')).tap();
  await expect(element(by.id('SectionsListItem0'))).toBeVisible();
});

it('should navigate between tabs', async () => {
  // Map
  await element(by.id('section-tab-map'))
    .atIndex(0)
    .tap();
  await expect(element(by.type('RCTMGLMapView'))).toBeVisible();
  await expect(element(by.id('header-back'))).toBeVisible();
  // guide
  await element(by.id('section-tab-guide'))
    .atIndex(0)
    .tap();
  await expect(element(by.id('header-back'))).toBeVisible();
  await expect(element(by.id('section-info-menu-button'))).toBeVisible();
  await expect(element(by.label('section:guide.noData'))).toBeVisible(); // TODO: case with data
  await expect(element(by.id('section-guide-fab'))).toBeVisible();
  // media
  await element(by.id('section-tab-media'))
    .atIndex(0)
    .tap();
  await expect(element(by.id('header-back'))).toBeVisible();
  await expect(element(by.label('section:media.photo'))).toBeVisible();
  await expect(element(by.id('suggest-media-fab'))).toBeVisible();
  // Chart
  // victory creates infinite loop that detox doesn't like
  // Workaround is to disable synchronization
  // https://github.com/FormidableLabs/victory/issues/1499
  await device.disableSynchronization();
  await element(by.id('section-tab-chart'))
    .atIndex(0)
    .tap();
  await waitFor(element(by.id('no-chart-container')))
    .toBeVisible()
    .withTimeout(2000); // TODO: case with chart
  await waitFor(element(by.id('header-back')))
    .toBeVisible()
    .withTimeout(2000);
  // back to region from non-default tab
  await element(by.id('header-back')).tap();
  await waitFor(element(by.id('SectionsListItem0')))
    .toBeVisible()
    .withTimeout(2000);
});
