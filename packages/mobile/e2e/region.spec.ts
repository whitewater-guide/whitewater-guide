import { expect } from 'detox';

beforeEach(async () => {
  await device.reloadReactNative();
  await element(by.id('RegionCard1')).tap();
});

it('should navigate back to regions list', async () => {
  await expect(element(by.id('RegionCard1'))).toBeNotVisible();
  await element(by.id('header-back')).tap();
  await expect(element(by.id('RegionCard1'))).toBeVisible();
});

it('should navigate between region tabs', async () => {
  await expect(element(by.type('RCTMGLMapView'))).toBeVisible();
  await expect(element(by.id('header-back'))).toBeVisible();
  await expect(element(by.id('add-section-fab'))).toBeVisible();
  // tab view is designed this way
  await element(by.id('region-tab-info'))
    .atIndex(0)
    .tap();
  await expect(element(by.id('region-info-menu-button'))).toBeVisible();
  await expect(element(by.id('header-back'))).toBeVisible();
  await expect(element(by.id('add-section-fab'))).toBeVisible();
  await element(by.id('region-tab-list'))
    .atIndex(0)
    .tap();
  await expect(element(by.id('SectionsListItem0'))).toBeVisible();
  await expect(element(by.id('header-back'))).toBeVisible();
  await expect(element(by.id('add-section-fab'))).toBeVisible();
});

it('should navigate to filter screen and back', async () => {
  await element(by.id('region-filter-btn')).tap();
  await expect(element(by.label('FILTER:SEARCH'))).toBeVisible();
  // back via header left button
  await element(by.id('header-back')).tap();
  await expect(element(by.label('region:map.title'))).toBeVisible();
  // back via reset filter button
  await element(by.id('region-filter-btn')).tap();
  await element(by.label('FILTER:RESET')).tap();
  // back via search button
  await element(by.id('region-filter-btn')).tap();
  await element(by.label('FILTER:SEARCH')).tap();
  await expect(element(by.label('region:map.title'))).toBeVisible();
});

// it('should open and close offline download dialog', async () => {
//   await element(
//     by.id('download-button').withAncestor(by.id('RegionCard1')),
//     // by.id('download-button'),
//   ).tap();
//   await expect(element(by.id('offline-dialog-title'))).toBeVisible();
//   await element(by.label('cancel')).tap();
//   await expect(element(by.id('offline-dialog-title'))).toNotExist();
// });

// it.each([
//   ['faq', 'faq'],
//   ['privacy_policy', 'privacyPolicy'],
//   ['terms_and_conditions', 'termsOfService'],
// ])('should open %s screen and go back', async (fixture, label) => {
//   await element(by.id('header-menu')).tap();
//   await element(by.label(label)).tap();
//   await expect(element(by.id(`webview-${fixture}`))).toBeVisible();
//   await element(by.id('header-back')).tap();
//   await expect(element(by.id('RegionCard1'))).toBeVisible();
// });
