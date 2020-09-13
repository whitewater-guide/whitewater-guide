import {
  CommonActions,
  useFocusEffect,
  useNavigation,
} from '@react-navigation/native';
import { useFormikContext } from 'formik';
import React, { useCallback, useContext, useRef } from 'react';

import Loading from '~/components/Loading';
import { Screen, ScreenProps } from '~/components/Screen';
import { RootStackParamsList, Screens } from '~/core/navigation';

import {
  DescentFormData,
  DescentFormNavProp,
  DescentFormNavProps,
} from './types';
import useInitialDescent from './useInitialDescent';

interface DescentFormContext {
  loading: boolean;
  formScreenKey: string;
}

const DescentFormContext = React.createContext<DescentFormContext>({
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
export const DescentFormProvider: React.FC<DescentFormNavProps> = ({
  route,
  children,
}) => {
  const loading = useInitialDescent(route.params);
  return (
    <DescentFormContext.Provider value={{ loading, formScreenKey: route.key }}>
      {children}
    </DescentFormContext.Provider>
  );
};

// This function duplicates formik state in navigation state, so that it can be hydrated/rehydrated
function useNavHydrateFormik(formScreenKey: string) {
  const { dispatch } = useNavigation<DescentFormNavProp>();
  const { values } = useFormikContext<Partial<DescentFormData>>();
  const valuesRef = useRef(values);
  valuesRef.current = values;
  const onFocusLost = useCallback(() => {
    return () => {
      const params: RootStackParamsList[Screens.DESCENT_FORM] = {
        formData: valuesRef.current,
      };
      dispatch({
        ...CommonActions.setParams(params),
        source: formScreenKey,
      });
    };
  }, [dispatch, valuesRef, formScreenKey]);

  useFocusEffect(onFocusLost);
}

export const DescentFormScreen: React.FC<ScreenProps> = ({
  children,
  ...props
}) => {
  const { loading, formScreenKey } = useContext(DescentFormContext);
  useNavHydrateFormik(formScreenKey);
  return <Screen {...props}>{loading ? <Loading /> : children}</Screen>;
};
