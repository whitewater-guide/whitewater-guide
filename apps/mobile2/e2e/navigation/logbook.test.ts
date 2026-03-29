import { Screens } from '../../src/core/navigation';
import { expectScreen, tapDrawerItem } from '../helpers/navigation';

describe('Logbook and descent navigation', () => {
  beforeAll(async () => {
    await device.launchApp({ newInstance: true });
  });

  it('should navigate through logbook, descent, and descent form', async () => {
    // Navigate to logbook (user starts authenticated)
    await tapDrawerItem('logbook');
    await expectScreen(Screens.LOGBOOK);

    // Tap descent
    await element(by.id('mock:navigate:DESCENT')).tap();
    await expectScreen(Screens.DESCENT);

    // Tap Edit to open descent form
    await element(by.id('mock:navigate:DESCENT_FORM_EDIT')).tap();
    await expectScreen(Screens.DESCENT_FORM_SECTION);

    // Walk through form wizard
    await element(by.id('mock:navigate:DESCENT_FORM_DATE')).tap();
    await expectScreen(Screens.DESCENT_FORM_DATE);

    await element(by.id('mock:navigate:DESCENT_FORM_LEVEL')).tap();
    await expectScreen(Screens.DESCENT_FORM_LEVEL);

    await element(by.id('mock:navigate:DESCENT_FORM_COMMENT')).tap();
    await expectScreen(Screens.DESCENT_FORM_COMMENT);
  });
});
