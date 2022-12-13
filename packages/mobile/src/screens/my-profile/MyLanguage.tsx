import { MutationFunction } from '@apollo/client';
import { MyProfileFragment } from '@whitewater-guide/schema';
import identity from 'lodash/identity';
import memoize from 'lodash/memoize';
import React from 'react';
import { useTranslation } from 'react-i18next';

import RadioDialog from '~/components/radio-dialog';
import { LANGUAGE_NAMES, SUPPORTED_LANGUAGES } from '~/i18n';

import {
  UpdateProfileMutation,
  UpdateProfileMutationVariables,
  useUpdateProfileMutation,
} from './updateProfile.generated';

const labelExtractor = (code: string) => LANGUAGE_NAMES[code];

interface Props {
  me: MyProfileFragment;
}

const getChangeHandler = memoize(
  (
      mutate: MutationFunction<
        UpdateProfileMutation,
        UpdateProfileMutationVariables
      >,
      me: MyProfileFragment,
    ) =>
    (language: string) => {
      mutate({
        variables: { user: { language } },
        optimisticResponse: {
          __typename: 'Mutation',
          updateProfile: {
            __typename: 'User',
            id: me.id,
            language,
          },
        },
      }).catch(() => {
        // ignore
      });
    },
);

const MyLanguage: React.FC<Props> = React.memo(({ me }) => {
  const { t } = useTranslation();
  const [mutate] = useUpdateProfileMutation();
  return (
    <RadioDialog
      handleTitle={t('screens:myprofile.language')}
      cancelLabel={t('commons:cancel')}
      value={me.language || 'en'}
      options={SUPPORTED_LANGUAGES}
      onChange={getChangeHandler(mutate, me)}
      keyExtractor={identity}
      labelExtractor={labelExtractor}
    />
  );
});

MyLanguage.displayName = 'MyLanguage';

export default MyLanguage;
