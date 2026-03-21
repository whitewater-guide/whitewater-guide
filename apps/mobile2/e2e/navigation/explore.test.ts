import {
  expectScreen,
  navigateToRegion,
  tapHeaderBack,
  tapTab,
} from '../helpers/navigation';

const DEEP_LINK_PREFIX = 'https://app.whitewater.guide';

describe('Region & section navigation', () => {
  beforeAll(async () => {
    await device.launchApp({ newInstance: true });
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should navigate through region and section via taps', async () => {
    // Navigate to region from regions list
    await navigateToRegion();

    // Switch to sections tab
    await tapTab('REGION_SECTIONS_LIST');
    await expectScreen('REGION_SECTIONS_LIST');

    // Open filter and go back
    await element(by.id('mock:navigate:FILTER')).tap();
    await expectScreen('FILTER');
    await tapHeaderBack();
    await expectScreen('REGION_SECTIONS_LIST');

    // Navigate to section from sections list and go back
    await element(by.id('mock:navigate:SECTION_SCREEN')).tap();
    await expectScreen('SECTION_INFO');
    await tapHeaderBack();
    await expectScreen('REGION_SECTIONS_LIST');

    // Switch to info tab and visit sub-screens
    await tapTab('REGION_INFO');
    await expectScreen('REGION_INFO');

    await element(by.id('mock:navigate:WEB_VIEW')).tap();
    await expectScreen('WEB_VIEW');
    await tapHeaderBack();
    await expectScreen('REGION_INFO');

    await element(by.id('mock:navigate:LICENSE')).tap();
    await expectScreen('LICENSE');
    await tapHeaderBack();
    await expectScreen('REGION_INFO');

    await element(by.id('mock:navigate:PLAIN')).tap();
    await expectScreen('PLAIN');
    await tapHeaderBack();
    await expectScreen('REGION_INFO');

    // Switch back to map tab
    await tapTab('REGION_MAP');
    await expectScreen('REGION_MAP');

    // Navigate to section from map
    await element(by.id('mock:navigate:SECTION_SCREEN')).tap();
    await expectScreen('SECTION_INFO');

    // Explore all section tabs
    await tapTab('SECTION_MAP');
    await expectScreen('SECTION_MAP');

    await tapTab('SECTION_CHART');
    await expectScreen('SECTION_CHART');

    await tapTab('SECTION_MEDIA');
    await expectScreen('SECTION_MEDIA');

    await tapTab('SECTION_INFO');
    await expectScreen('SECTION_INFO');

    // Visit section sub-screens
    await element(by.id('mock:navigate:WEB_VIEW')).tap();
    await expectScreen('WEB_VIEW');
    await tapHeaderBack();
    await expectScreen('SECTION_INFO');

    await element(by.id('mock:navigate:LICENSE')).tap();
    await expectScreen('LICENSE');
    await tapHeaderBack();
    await expectScreen('SECTION_INFO');

    await element(by.id('mock:navigate:PLAIN')).tap();
    await expectScreen('PLAIN');
    await tapHeaderBack();
    await expectScreen('SECTION_INFO');

    // Navigate to region from section info
    await element(by.id('mock:navigate:REGION_STACK')).tap();
    await expectScreen('REGION_MAP');

    // Navigate back to regions list
    await tapHeaderBack();
    await expectScreen('REGIONS_LIST');
  });

  it('should deep link to region and explore tabs', async () => {
    await device.openURL({ url: `${DEEP_LINK_PREFIX}/region/xxx` });
    await expectScreen('REGION_MAP');

    // Explore region tabs
    await tapTab('REGION_SECTIONS_LIST');
    await expectScreen('REGION_SECTIONS_LIST');

    await tapTab('REGION_INFO');
    await expectScreen('REGION_INFO');

    await tapTab('REGION_MAP');
    await expectScreen('REGION_MAP');
  });

  it('should deep link to section and explore tabs', async () => {
    await device.openURL({ url: `${DEEP_LINK_PREFIX}/section/yyy` });
    await expectScreen('SECTION_INFO');

    // Explore section tabs
    await tapTab('SECTION_MAP');
    await expectScreen('SECTION_MAP');

    await tapTab('SECTION_CHART');
    await expectScreen('SECTION_CHART');

    await tapTab('SECTION_MEDIA');
    await expectScreen('SECTION_MEDIA');

    await tapTab('SECTION_INFO');
    await expectScreen('SECTION_INFO');

    // Visit a sub-screen from section
    await element(by.id('mock:navigate:LICENSE')).tap();
    await expectScreen('LICENSE');
    await tapHeaderBack();
    await expectScreen('SECTION_INFO');
  });
});
