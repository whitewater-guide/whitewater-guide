import { Formik } from 'formik';
import React from 'react';

import type {
  DescentFormData,
  DescentFormNavProps,
} from '~/screens/descent-form/types';

import { DescentFormProvider } from './DescentFormContext';
import DescentFormStack from './DescentFormStack';
import useUpsertDescent from './useUpsertDescent';

// See DescentFormProvider for explanation
const empty = {};

const DescentFormScreen: React.FC<DescentFormNavProps> = (props) => {
  const upsertDescent = useUpsertDescent();
  return (
    <Formik<Partial<DescentFormData>>
      initialValues={empty}
      enableReinitialize
      onSubmit={upsertDescent}
    >
      <DescentFormProvider {...props}>
        <DescentFormStack regionId={props.route.params?.regionId} />
      </DescentFormProvider>
    </Formik>
  );
};

export default DescentFormScreen;
