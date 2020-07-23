import { Formik } from 'formik';
import React, { useContext } from 'react';
import Loading from '~/components/Loading';
import { Screen, ScreenProps } from '~/components/Screen';
import { DescentFormData, DescentFormNavProps } from './types';
import useGetDescent from './useGetDescent';
import useUpsertDescent from './useUpsertDescent';

const DescentFormContext = React.createContext<boolean>(true);

export const DescentFormProvider: React.FC<DescentFormNavProps> = ({
  route,
  children,
}) => {
  const { initialData, loading } = useGetDescent(route.params);
  const upsertDescent = useUpsertDescent();
  return (
    <DescentFormContext.Provider value={loading}>
      <Formik<Partial<DescentFormData>>
        initialValues={initialData}
        enableReinitialize={true}
        onSubmit={upsertDescent}
      >
        {children}
      </Formik>
    </DescentFormContext.Provider>
  );
};

export const DescentFormScreen: React.FC<ScreenProps> = ({
  children,
  ...props
}) => {
  const loading = useContext(DescentFormContext);
  return <Screen {...props}>{loading ? <Loading /> : children}</Screen>;
};
