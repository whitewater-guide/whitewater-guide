import { CommonActions, useNavigation } from '@react-navigation/native';
import { useSection } from '@whitewater-guide/clients';
import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { FAB } from 'react-native-paper';
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
  const {
    navigate,
    dangerouslyGetParent,
  } = useNavigation<SectionScreenNavProp>();
  const { dispatch } = dangerouslyGetParent();
  const { node } = useSection();
  const { t } = useTranslation();

  const { upload } = useLocalPhotos();
  const onImagePicker = useCallback(
    (localPhotoId: string) => {
      if (node) {
        navigate(Screens.SUGGESTION, {
          sectionId: node.id,
          localPhotoId,
        });
      }
    },
    [navigate, node],
  );
  const onPickAndUpload = useImagePicker(upload, onImagePicker);

  const actions = useMemo(
    () => [
      {
        icon: 'pencil-plus',
        label: t('screens:section.fab.addSuggestion'),
        onPress: () => {
          if (node) {
            navigate(Screens.SUGGESTION, { sectionId: node.id });
          }
        },
      },
      {
        icon: 'calendar-plus',
        label: t('screens:section.fab.addDescent'),
        onPress: () =>
          dispatch((navState: any) => {
            return CommonActions.reset(
              node
                ? {
                    ...navState,
                    index: navState.index + 1,
                    routes: [
                      ...navState.routes,
                      {
                        name: Screens.DESCENT_FORM,
                        params: {
                          formData: {
                            section: node,
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
            );
          }),
      },
      {
        icon: 'image-plus',
        label: t('screens:section.fab.addPhoto'),
        onPress:
          Config.E2E_MODE === 'true'
            ? () => {
                if (node) {
                  navigate(Screens.SUGGESTION, {
                    sectionId: node.id,
                    localPhotoId: 'foo',
                  });
                }
              }
            : onPickAndUpload,
      },
    ],
    [navigate, dispatch, node, onPickAndUpload, t],
  );
  return (
    <FAB.Group
      testID={testID}
      icon="plus"
      actions={actions}
      visible={true}
      {...fabState}
    />
  );
};

SectionFAB.displayName = 'SectionFAB';

export default SectionFAB;
