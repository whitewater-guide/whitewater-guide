import { Formik } from 'formik';
import React from 'react';
import { DescentFormData } from '~/screens/descent-form/types';
import { DescentFormProvider } from './DescentFormContext';
import DescentFormStack from './DescentFormStack';
import { DescentFormNavProps } from './types';
import useUpsertDescent from './useUpsertDescent';

// See DescentFormProvider for explanation
const empty = {};

const DescentFormScreen: React.FC<DescentFormNavProps> = (props) => {
  const upsertDescent = useUpsertDescent();
  return (
    <Formik<Partial<DescentFormData>>
      initialValues={empty}
      enableReinitialize={true}
      onSubmit={upsertDescent}
    >
      <DescentFormProvider {...props}>
        <DescentFormStack />
      </DescentFormProvider>
    </Formik>
  );
};

export default DescentFormScreen;
