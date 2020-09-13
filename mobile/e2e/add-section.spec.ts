import { expect } from 'detox';

let INDEX = 0;

beforeEach(async () => {
  await device.reloadReactNative();
  INDEX = device.getPlatform() === 'ios' ? 1 : 0;
  await element(by.id('RegionCard0')).tap();
  await element(by.id('add-section-fab')).tap();
});

it('should navigate through add section tabs', async () => {
  await expect(element(by.id('name'))).toBeVisible();
  await expect(element(by.id('add-section-submit-btn'))).toBeVisible();
  await element(by.id('add-section-tab-attributes')).tap();
  await expect(element(by.id('distance'))).toBeVisible();
  await expect(element(by.id('add-section-submit-btn'))).toBeVisible();
  await element(by.id('add-section-tab-description')).tap();
  await expect(element(by.id('add-section-submit-btn'))).toBeVisible();
  await expect(element(by.id('description'))).toBeVisible();
  await element(by.id('add-section-tab-flows')).tap();
  await expect(element(by.id('header-back')).atIndex(INDEX)).toBeVisible();
  await expect(element(by.id('add-section-submit-btn'))).toBeVisible();
  await expect(element(by.id('season-numeric-picker'))).toBeVisible();
  await element(by.id('add-section-tab-photos')).tap();
  await expect(element(by.id('add-section-submit-btn'))).toBeVisible();
  await element(by.id('add-photo-btn')).tap();
  await expect(element(by.id('photo-picker'))).toBeVisible();
  await element(by.id('add-section-photo-done-btn')).tap();
  await element(by.id('header-back')).atIndex(INDEX).tap();
  await expect(element(by.id('region-map'))).toBeVisible();
});

it('should navigate to select river screen and back', async () => {
  await expect(element(by.id('header-back')).atIndex(INDEX)).toBeVisible();
  await element(by.id('river-placeholder')).tap();
  await expect(element(by.id('river-searchbar'))).toBeVisible();
  await element(by.id('header-back')).atIndex(INDEX).tap();
  await expect(element(by.id('add-section-submit-btn'))).toBeVisible();
});

it('should navigate to shape screen and back', async () => {
  await element(by.id('fake-putin-btn')).tap();
  await element(by.id('header-back')).atIndex(INDEX).tap();
  await element(by.id('fake-putin-btn')).tap();
  await expect(element(by.id('add-section-map')).atIndex(INDEX)).toBeVisible();
  await expect(element(by.id('pito-button-1'))).toBeVisible();
  await expect(element(by.id('add-section-shape-done-btn'))).toBeVisible();
  await element(by.id('shape-fab')).tap();
  await element(by.id('shape_0_1')).typeText('10');
  await element(by.id('shape_0_0')).typeText('10');
  await element(by.id('shape_1_1')).typeText('10');
  await element(by.id('shape_1_0')).typeText('10');
  await element(by.id('shape-submit')).tap();
  await expect(element(by.id('shape-submit'))).toBeNotVisible();
  await element(by.id('add-section-shape-done-btn')).tap();
  await expect(element(by.id('fake-putin-btn'))).toBeVisible();
});

it('should navigate to gauge selection screen and back', async () => {
  await element(by.id('add-section-tab-attributes')).tap();
  await element(by.id('add-section-tab-description')).tap();
  await element(by.id('add-section-tab-flows')).tap();
  await element(by.id('gauge-placeholder')).tap();
  await expect(element(by.id('gauge-searchbar'))).toBeVisible();
  await element(by.id('header-back')).atIndex(INDEX).tap();
  await expect(element(by.id('gauge-searchbar'))).toBeNotVisible();
});
