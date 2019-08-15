import Box from '@material-ui/core/Box';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import { createSafeValidator } from '@whitewater-guide/commons';
import { Formik, FormikConfig } from 'formik';
import React, { useMemo } from 'react';
import { EditorLanguagePicker } from '../components';
import { Card } from '../layout';
import FormikCardActions from './FormikCardActions';
import { UnsavedPrompt } from './helpers';
import { UseApolloFormik } from './useApolloFormik';

interface Props<QResult, FData> extends UseApolloFormik<QResult, FData> {
  header: string | { resourceType: string };
  children?: any;
  validationSchema?: FormikConfig<FData>['validationSchema'];
  validateOnChange?: FormikConfig<FData>['validateOnChange'];
  submitLabel?: string;
  extraActions?: React.ReactElement;
}

export function FormikCard<QResult, FData>(props: Props<QResult, FData>) {
  const {
    header,
    onSubmit,
    loading,
    initialValues,
    validationSchema,
    validateOnChange = process.env.NODE_ENV === 'production',
    extraActions,
    children,
  } = props;

  // TODO: cannot use validation scheme directly due to this https://github.com/jaredpalmer/formik/issues/1697
  // any is because validate function can return error (https://github.com/jaredpalmer/formik/blob/217a49e6243a41a318a8973d18a7e1535b7880d5/src/Formik.tsx#L168)
  const validate: any = useMemo(
    () => validationSchema && createSafeValidator(validationSchema),
    [],
  );

  const submitLabel =
    props.submitLabel ||
    (initialValues && (initialValues as any).id ? 'Update' : 'Create');
  const headerLabel =
    typeof header === 'string'
      ? header
      : initialValues && (initialValues as any).name
      ? `${(initialValues as any).name} settings`
      : `New ${header.resourceType}`;

  return (
    <Card loading={loading || !initialValues}>
      <Formik<FData>
        initialValues={initialValues!}
        onSubmit={onSubmit}
        validateOnChange={validateOnChange}
        validate={validate}
      >
        <React.Fragment>
          <UnsavedPrompt />
          <CardHeader title={headerLabel} action={<EditorLanguagePicker />} />
          <CardContent>
            <Box
              width={1}
              height={1}
              display="flex"
              flexDirection="column"
              overflow="hidden"
            >
              {children}
            </Box>
          </CardContent>
          <FormikCardActions
            loading={loading}
            submitLabel={submitLabel}
            extraActions={extraActions}
          />
        </React.Fragment>
      </Formik>
    </Card>
  );
}

FormikCard.displayName = 'FormikCard';
