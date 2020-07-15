import React, { useContext, useState } from 'react';
import useGetDescent from './useGetDescent';
import { DescentFormNavProps, DescentFormData } from './types';
import { Formik } from 'formik';
import useUpsertDescent from './useUpsertDescent';
import Loading from '~/components/Loading';
import { Screen, ScreenProps } from '~/components/Screen';
import { Section } from '@whitewater-guide/commons';

interface DescentFormContext {
  loading: boolean;
  upstreamSection: Section | null;
  setUpstreamSection: (value: Section | null) => void;
}

const DescentFormContext = React.createContext<DescentFormContext>({
  loading: true,
  upstreamSection: null,
  setUpstreamSection: () => {},
});

export const DescentFormProvider: React.FC<DescentFormNavProps> = ({
  route,
  children,
}) => {
  const { initialData, loading } = useGetDescent(route.params);
  const [upstreamSection, setUpstreamSection] = useState<Section | null>(null);
  const upsertDescent = useUpsertDescent();
  return (
    <DescentFormContext.Provider
      value={{ loading, upstreamSection, setUpstreamSection }}
    >
      <Formik<DescentFormData>
        initialValues={initialData}
        enableReinitialize={true}
        validateOnMount={true}
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
  const { loading } = useContext(DescentFormContext);
  return <Screen {...props}>{loading ? <Loading /> : children}</Screen>;
};

export const useUpstreamSection = () => {
  const { upstreamSection, setUpstreamSection } = useContext(
    DescentFormContext,
  );
  return { upstreamSection, setUpstreamSection };
};
