import { expect } from 'detox';

beforeEach(async () => {
  await device.reloadReactNative();
  await element(by.id('RegionCard0')).tap();
  await element(by.id('add-section-fab')).tap();
});

it('should navigate through add section tabs', async () => {
  await expect(element(by.id('name'))).toBeVisible();
  await expect(element(by.label('COMMONS:CREATE'))).toBeVisible();
  await element(by.label('screens:addSection.tabs.attributes'))
    .atIndex(1)
    .tap();
  await expect(element(by.id('distance'))).toBeVisible();
  await expect(element(by.label('COMMONS:CREATE'))).toBeVisible();
  await element(by.label('screens:addSection.tabs.description'))
    .atIndex(1)
    .tap();
  await expect(element(by.label('COMMONS:CREATE'))).toBeVisible();
  await expect(element(by.id('description'))).toBeVisible();
  await element(by.label('screens:addSection.tabs.flows'))
    .atIndex(1)
    .tap();
  await expect(element(by.id('header-back'))).toBeVisible();
  await expect(element(by.label('COMMONS:CREATE'))).toBeVisible();
  await expect(element(by.label('commons:season'))).toBeVisible();
  await element(by.label('screens:addSection.tabs.photos'))
    .atIndex(1)
    .tap();
  await expect(element(by.label('COMMONS:CREATE'))).toBeVisible();
  await element(by.id('add-photo-btn')).tap();
  await expect(
    element(by.label('components:photoPicker.placeholder')),
  ).toBeVisible();
  await element(by.label('COMMONS:DONE')).tap();
  await element(by.id('header-back')).tap();
  await expect(element(by.type('RCTMGLMapView'))).toBeVisible();
});

it('should navigate to select river screen and back', async () => {
  await element(by.id('river-placeholder')).tap();
  await expect(element(by.id('river-searchbar'))).toBeVisible();
  await element(by.id('header-back')).tap();
  await expect(element(by.label('COMMONS:CREATE'))).toBeVisible();
});

it('should navigate to shape screen and back', async () => {
  await element(by.id('fake-putin-btn')).tap();
  await element(by.id('header-back')).tap();
  await element(by.id('fake-putin-btn')).tap();
  await expect(element(by.type('RCTMGLMapView'))).toBeVisible();
  await expect(element(by.id('pito-button-1'))).toBeVisible();
  await expect(element(by.label('COMMONS:DONE'))).toBeVisible();
  await element(by.id('shape-fab')).tap();
  await element(by.id('shape_0_1')).typeText('10');
  await element(by.id('shape_0_0')).typeText('10');
  await element(by.id('shape_1_1')).typeText('10');
  await element(by.id('shape_1_0')).typeText('10');
  await element(by.id('shape-submit')).tap();
  await expect(element(by.id('shape-submit'))).toBeNotVisible();
  await element(by.label('COMMONS:DONE')).tap();
  await expect(element(by.id('fake-putin-btn'))).toBeVisible();
});

it('should navigate to gauge selection screen and back', async () => {
  await element(by.label('screens:addSection.tabs.attributes'))
    .atIndex(1)
    .tap();
  await element(by.label('screens:addSection.tabs.description'))
    .atIndex(1)
    .tap();
  await element(by.label('screens:addSection.tabs.flows'))
    .atIndex(1)
    .tap();
  await element(by.id('gauge-placeholder')).tap();
  await expect(element(by.id('gauge-searchbar'))).toBeVisible();
  await element(by.id('header-back')).tap();
  await expect(element(by.id('gauge-searchbar'))).toBeNotVisible();
});
