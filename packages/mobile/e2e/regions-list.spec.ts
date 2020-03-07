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
  await element(by.label('commons:cancel')).tap();
  await expect(element(by.id('offline-dialog-title'))).toNotExist();
});

it.each([
  ['faq', 'drawer:faq'],
  ['privacy_policy', 'commons:privacyPolicy'],
  ['terms_and_conditions', 'commons:termsOfService'],
])('should open %s screen and go back', async (fixture, label) => {
  await element(by.id('header-menu')).tap();
  await element(by.label(label)).tap();
  await expect(element(by.id(`webview-${fixture}`))).toBeVisible();
  await element(by.id('header-back')).tap();
  await expect(element(by.id('RegionCard1'))).toBeVisible();
});

it('should go to premium screen and back', async () => {
  await waitFor(element(by.id('premium-btn')))
    .toBeVisible()
    .whileElement(by.id('regions-list-flat-list'))
    .scroll(250, 'down');
  await expect(element(by.id('premium-btn'))).toBeVisible();
  await element(by.id('premium-btn')).tap();
  await expect(
    element(by.label('SCREENS:PURCHASE.BUY.CONFIRMBUTTON.BUY')),
  ).toBeVisible();
  await element(by.id('purchase-buy-close-btn')).tap();
  await element(by.id('premium-btn')).tap();
  await element(by.label('SCREENS:PURCHASE.BUY.CONFIRMBUTTON.BUY')).tap();
  await expect(element(by.label('SCREENS:AUTH.MAIN.SIGNIN'))).toBeVisible();
  await element(by.id('header-back')).tap();
  await element(by.id('purchase-buy-close-btn')).tap();
  await expect(element(by.id('premium-btn'))).toBeVisible();
});
