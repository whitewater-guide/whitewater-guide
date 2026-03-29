import { Screens } from '../../src/core/navigation';
import { expectScreen, navigateToRegion, tapTab } from '../helpers/navigation';

describe('FAB and add section navigation', () => {
  beforeAll(async () => {
    await device.launchApp({ newInstance: true });
  });

  it('should navigate FAB actions and add section tabs', async () => {
    // Navigate to region (user starts authenticated)
    await navigateToRegion();

    // FAB → Add Section
    await element(by.id('fab:main')).tap();
    await element(by.id('fab:add-section')).tap();
    await expectScreen(Screens.ADD_SECTION_MAIN);

    // Cycle add section tabs
    await tapTab('ADD_SECTION_ATTRIBUTES');
    await expectScreen(Screens.ADD_SECTION_ATTRIBUTES);

    await tapTab('ADD_SECTION_DESCRIPTION');
    await expectScreen(Screens.ADD_SECTION_DESCRIPTION);

    await tapTab('ADD_SECTION_FLOWS');
    await expectScreen(Screens.ADD_SECTION_FLOWS);

    await tapTab('ADD_SECTION_PHOTOS');
    await expectScreen(Screens.ADD_SECTION_PHOTOS);

    await tapTab('ADD_SECTION_MAIN');
    await expectScreen(Screens.ADD_SECTION_MAIN);
  });
});
