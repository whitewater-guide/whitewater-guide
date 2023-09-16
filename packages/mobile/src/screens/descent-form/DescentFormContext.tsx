import {
  CommonActions,
  useFocusEffect,
  useNavigation,
} from '@react-navigation/native';
import { useFormikContext } from 'formik';
import type { FC, PropsWithChildren } from 'react';
import React, { useCallback, useContext, useMemo, useRef } from 'react';

import Loading from '~/components/Loading';
import type { ScreenProps } from '~/components/Screen';
import { Screen } from '~/components/Screen';
import type { RootStackParamsList, Screens } from '~/core/navigation';

import type {
  DescentFormData,
  DescentFormNavProp,
  DescentFormNavProps,
} from './types';
import useInitialDescent from './useInitialDescent';

interface DescentFormContext {
  loading: boolean;
  formScreenKey: string;
}

const DescentFormCtx = React.createContext<DescentFormContext>({
  loading: true,
  formScreenKey: '',
});

/**
 * This solves following problem
 *
 * We want to persist multi-screen form state during hydration/regydration
 *
 * We cannot do it using formik because it's not hydrating
 *
 * So the workaround is:
 *   - Mount Formik with {} empty state ({})
 *   - Rehydrate nav state
 *   - On mount, query for descent or use rehydrated form state and set formik form value (see useInitialDescent)
 *   - On screen focus lost, copy formik value to nav state (see useNavHydrateFormik)
 */
export const DescentFormProvider: FC<
  PropsWithChildren<DescentFormNavProps>
> = ({ route: { key: formScreenKey, params }, children }) => {
  const loading = useInitialDescent(params);
  const value = useMemo<DescentFormContext>(
    () => ({ formScreenKey, loading }),
    [formScreenKey, loading],
  );
  return (
    <DescentFormCtx.Provider value={value}>{children}</DescentFormCtx.Provider>
  );
};

// This function duplicates formik state in navigation state, so that it can be hydrated/rehydrated
function useNavHydrateFormik(formScreenKey: string) {
  const { dispatch } = useNavigation<DescentFormNavProp>();
  const { values } = useFormikContext<Partial<DescentFormData>>();
  const valuesRef = useRef(values);
  valuesRef.current = values;
  const onFocusLost = useCallback(
    () => () => {
      const params: RootStackParamsList[Screens.DESCENT_FORM] = {
        formData: valuesRef.current,
      };
      dispatch({
        ...CommonActions.setParams(params),
        source: formScreenKey,
      });
    },
    [dispatch, valuesRef, formScreenKey],
  );

  useFocusEffect(onFocusLost);
}

export const DescentFormScreen: FC<PropsWithChildren<ScreenProps>> = ({
  children,
  ...props
}) => {
  const { loading, formScreenKey } = useContext(DescentFormCtx);
  useNavHydrateFormik(formScreenKey);
  return <Screen {...props}>{loading ? <Loading /> : children}</Screen>;
};
