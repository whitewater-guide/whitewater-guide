import { Screens } from '../../src/core/navigation';
import {
  expectScreen,
  tapDrawerItem,
  tapHeaderBack,
} from '../helpers/navigation';

describe('Drawer navigation', () => {
  beforeAll(async () => {
    await device.launchApp({ newInstance: true });
  });

  it('should navigate through all drawer items', async () => {
    // Navigate to Regions
    await tapDrawerItem('regions');
    await expectScreen(Screens.REGIONS_LIST);

    // Navigate to FAQ
    await tapDrawerItem('faq');
    await expectScreen(Screens.WEB_VIEW);

    // Verify back button returns to Regions
    await tapHeaderBack();
    await expectScreen(Screens.REGIONS_LIST);

    // Navigate through remaining drawer items
    await tapDrawerItem('backers');
    await expectScreen(Screens.WEB_VIEW);

    await tapHeaderBack();
    await tapDrawerItem('terms');
    await expectScreen(Screens.WEB_VIEW);

    await tapHeaderBack();
    await tapDrawerItem('privacy');
    await expectScreen(Screens.WEB_VIEW);
  });
});
