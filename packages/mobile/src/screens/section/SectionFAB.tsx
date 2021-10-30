import { CommonActions, useNavigation } from '@react-navigation/native';
import { useSection } from '@whitewater-guide/clients';
import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { FAB as FAButton } from 'react-native-paper';
import Config from 'react-native-ultimate-config';

import useFABAuth from '~/components/useFABAuth';
import { Screens } from '~/core/navigation';
import { useImagePicker, useLocalPhotos } from '~/features/uploads';
import { SectionScreenNavProp } from '~/screens/section/types';

interface Props {
  testID?: string;
}

export const SectionFAB: React.FC<Props> = ({ testID }) => {
  const fabState = useFABAuth();
  const { navigate, getParent } = useNavigation<SectionScreenNavProp>();
  const dispatch = getParent()?.dispatch;
  const section = useSection();
  const { t } = useTranslation();

  const { upload } = useLocalPhotos();

  const onImagePicker = useCallback(
    (localPhotoId: string) => {
      if (section?.id) {
        navigate(Screens.SUGGESTION, {
          sectionId: section.id,
          localPhotoId,
        });
      }
    },
    [navigate, section],
  );
  const onPickAndUpload = useImagePicker(upload, onImagePicker);

  const actions = useMemo(
    () => [
      {
        icon: 'pencil-plus',
        label: t('screens:section.fab.addSuggestion'),
        onPress: () => {
          if (section?.id) {
            navigate(Screens.SUGGESTION, { sectionId: section.id });
          }
        },
      },
      {
        icon: 'calendar-plus',
        label: t('screens:section.fab.addDescent'),
        onPress: () =>
          dispatch?.((navState: any) =>
            CommonActions.reset(
              section
                ? {
                    ...navState,
                    // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
                    index: navState.index + 1,
                    routes: [
                      ...navState.routes,
                      {
                        name: Screens.DESCENT_FORM,
                        params: {
                          formData: {
                            section: section,
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
                  }
                : navState,
            ),
          ),
      },
      {
        icon: 'image-plus',
        label: t('screens:section.fab.addPhoto'),
        onPress:
          Config.E2E_MODE === 'true'
            ? () => {
                if (section?.id) {
                  navigate(Screens.SUGGESTION, {
                    sectionId: section.id,
                    localPhotoId: 'foo',
                  });
                }
              }
            : onPickAndUpload,
      },
    ],
    [navigate, dispatch, section, onPickAndUpload, t],
  );

  if (!section) {
    return null;
  }

  return (
    <FAButton.Group
      testID={testID}
      icon="plus"
      actions={actions}
      visible
      {...fabState}
    />
  );
};

SectionFAB.displayName = 'SectionFAB';

export default SectionFAB;
