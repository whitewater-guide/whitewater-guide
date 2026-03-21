import { expectScreen, tapDrawerItem } from '../helpers/navigation';

describe('Logbook and descent navigation', () => {
  beforeAll(async () => {
    await device.launchApp({ newInstance: true });
  });

  it('should navigate through logbook, descent, and descent form', async () => {
    // Navigate to logbook (user starts authenticated)
    await tapDrawerItem('logbook');
    await expectScreen('LOGBOOK');

    // Tap descent
    await element(by.id('mock:navigate:DESCENT')).tap();
    await expectScreen('DESCENT');

    // Tap Edit to open descent form
    await element(by.id('mock:navigate:DESCENT_FORM_EDIT')).tap();
    await expectScreen('DESCENT_FORM_SECTION');

    // Walk through form wizard
    await element(by.id('mock:navigate:DESCENT_FORM_DATE')).tap();
    await expectScreen('DESCENT_FORM_DATE');

    await element(by.id('mock:navigate:DESCENT_FORM_LEVEL')).tap();
    await expectScreen('DESCENT_FORM_LEVEL');

    await element(by.id('mock:navigate:DESCENT_FORM_COMMENT')).tap();
    await expectScreen('DESCENT_FORM_COMMENT');
  });
});
