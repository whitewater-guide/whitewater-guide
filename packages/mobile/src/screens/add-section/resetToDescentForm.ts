import { CommonActions, NavigationState } from '@react-navigation/native';
import { Section } from '@whitewater-guide/commons';
import { Screens } from '~/core/navigation';

export function resetToDescentForm(
  { index, routes, ...rest }: NavigationState,
  section?: Section | null,
) {
  const descentFormIndex = routes.findIndex(
    (r) => r.name === Screens.DESCENT_FORM,
  );
  if (descentFormIndex === -1 || !section) {
    return CommonActions.goBack();
  }

  const newState = {
    ...rest,
    index: descentFormIndex,
    routes: [
      ...routes.slice(0, descentFormIndex),
      {
        name: Screens.DESCENT_FORM,
        params: {
          formData: {
            section,
            startedAt: new Date().toISOString(),
            public: true,
          },
        },
        state: {
          index: 1,
          routes: [
            { name: Screens.DESCENT_FORM_SECTION },
            { name: Screens.DESCENT_FORM_DATE },
          ],
        },
      },
    ],
  };

  return CommonActions.reset(newState);
}
