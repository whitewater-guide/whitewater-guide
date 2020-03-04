beforeEach(async () => {
  await device.reloadReactNative();
});

it('should render by default', async () => {
  await expect(element(by.id('RegionCard1'))).toBeVisible();
});
