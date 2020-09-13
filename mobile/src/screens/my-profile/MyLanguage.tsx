import { User } from '@whitewater-guide/commons';
import identity from 'lodash/identity';
import memoize from 'lodash/memoize';
import React from 'react';
import { Mutation, MutationFunction } from 'react-apollo';
import { useTranslation } from 'react-i18next';

import RadioDialog from '~/components/radio-dialog';

import { LANGUAGE_NAMES, SUPPORTED_LANGUAGES } from '../../i18n';
import { Result, UPDATE_MY_PROFILE, Vars } from './updateProfile.mutation';

const labelExtractor = (code: string) => LANGUAGE_NAMES[code];

interface Props {
  me: User;
}

const getChangeHandler = memoize(
  (mutate: MutationFunction<Result, Vars>, me: User) => (language: string) => {
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
    }).catch(() => {});
  },
);

const MyLanguage: React.FC<Props> = React.memo(({ me }) => {
  const { t } = useTranslation();
  return (
    <Mutation<Result, Vars> mutation={UPDATE_MY_PROFILE}>
      {(mutate) => {
        return (
          <RadioDialog
            handleTitle={t('myProfile:language') as string}
            cancelLabel={t('commons:cancel') as string}
            value={me.language || 'en'}
            options={SUPPORTED_LANGUAGES}
            onChange={getChangeHandler(mutate, me)}
            keyExtractor={identity}
            labelExtractor={labelExtractor}
          />
        );
      }}
    </Mutation>
  );
});

MyLanguage.displayName = 'MyLanguage';

export default MyLanguage;
