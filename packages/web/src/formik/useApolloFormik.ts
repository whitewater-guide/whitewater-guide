import type {
  MutationHookOptions,
  OperationVariables,
  QueryHookOptions,
} from '@apollo/client';
import { useMutation, useQuery } from '@apollo/client';
import { getValidationErrors } from '@whitewater-guide/clients';
import type { FormikHelpers } from 'formik';
import type { DocumentNode } from 'graphql';
import type { History } from 'history';
import isEmpty from 'lodash/isEmpty';
import { useCallback, useMemo, useRef } from 'react';
import { useHistory } from 'react-router';

export interface ApolloFormikOptions<
  QVars extends OperationVariables,
  QResult,
  FormData,
  MVars,
  MResult = any,
> {
  query: DocumentNode;
  queryOptions?: QueryHookOptions<QResult, QVars>;
  mutation: DocumentNode;
  mutationOptions?: MutationHookOptions<MResult, MVars>;
  queryToForm: (result: QResult | undefined) => FormData;
  formToMutation: (data: FormData) => MVars;
  onSuccess?: string | null | ((result?: MResult) => void);
}

export interface UseApolloFormik<QResult, FData> {
  loading: boolean;
  onSubmit: (values: FData, formikHelpers: FormikHelpers<FData>) => void;
  initialValues: FData | null;
  rawData?: QResult;
}

export function useApolloFormik<
  QVars extends OperationVariables,
  QResult,
  FData,
  MVars,
  MResult = any,
>(
  options: ApolloFormikOptions<QVars, QResult, FData, MVars, MResult>,
): UseApolloFormik<QResult, FData> {
  const { queryOptions, mutationOptions, onSuccess } = options;
  // Treat this options as immutable:
  const query = useRef(options.query);
  const mutation = useRef(options.mutation);
  const queryToForm = useRef(options.queryToForm);
  const formToMutation = useRef(options.formToMutation);

  const history: History = useHistory();

  const queryResult = useQuery<QResult, QVars>(query.current, {
    ...queryOptions,
    fetchPolicy: 'network-only',
  });

  const [mutate] = useMutation<MResult, MVars>(
    mutation.current,
    mutationOptions,
  );

  const onSubmitSuccess = useCallback(
    (mutationResult?: MResult) => {
      if (!onSuccess) {
        history.back();
      } else if (typeof onSuccess === 'string') {
        history.replace(onSuccess);
      } else if (typeof onSuccess === 'function') {
        onSuccess(mutationResult);
      }
    },
    [history, onSuccess],
  );

  const onSubmit = useCallback(
    (data: FData, formikHelpers: FormikHelpers<FData>) => {
      // Reset form error
      formikHelpers.setStatus({ success: false });
      return mutate({ variables: formToMutation.current(data) })
        .then((res: any) => {
          formikHelpers.setStatus({ success: true });
          onSubmitSuccess(res.data);
        })
        .catch((e) => {
          const validationErrors = getValidationErrors(e);
          formikHelpers.setErrors(validationErrors as any);
          // Not validation error but still error
          if (isEmpty(e)) {
            formikHelpers.setStatus({ success: false, error: e });
          }
        })
        .finally(() => {
          formikHelpers.setSubmitting(false);
        });
    },
    [onSubmitSuccess, mutate],
  );

  return useMemo(
    () => ({
      initialValues:
        !queryResult.loading && queryResult.data
          ? queryToForm.current(queryResult.data)
          : null,
      loading: queryResult.loading,
      rawData: queryResult.data,
      onSubmit,
    }),
    [queryResult, onSubmit],
  );
}
