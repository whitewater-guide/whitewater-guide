import { expect } from 'detox';

beforeEach(async () => {
  await device.reloadReactNative();
});

it('should render by default', async () => {
  await expect(element(by.id('RegionCard1'))).toBeVisible();
});

it('should open and close offline download dialog', async () => {
  await element(
    by.id('download-button').withAncestor(by.id('RegionCard1')),
    // by.id('download-button'),
  ).tap();
  await expect(element(by.id('offline-dialog-title'))).toBeVisible();
  await element(by.label('cancel')).tap();
  await expect(element(by.id('offline-dialog-title'))).toNotExist();
});

it.each([
  ['faq', 'faq'],
  ['privacy_policy', 'privacyPolicy'],
  ['terms_and_conditions', 'termsOfService'],
])('should open %s screen and go back', async (fixture, label) => {
  await element(by.id('header-menu')).tap();
  await element(by.label(label)).tap();
  await expect(element(by.id(`webview-${fixture}`))).toBeVisible();
  await element(by.id('header-back')).tap();
  await expect(element(by.id('RegionCard1'))).toBeVisible();
});
