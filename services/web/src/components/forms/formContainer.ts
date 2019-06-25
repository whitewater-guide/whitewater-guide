import { apolloErrorToString } from '@whitewater-guide/clients';
import { omitTypename } from '@whitewater-guide/commons';
import { ApolloError } from 'apollo-client';
import { DocumentNode } from 'graphql';
import isFunction from 'lodash/isFunction';
import memoize from 'lodash/memoize';
import { ChildProps, graphql, MutationOpts } from 'react-apollo';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { compose, mapProps } from 'recompose';
import {
  ConfigProps,
  InjectedFormProps,
  reduxForm,
  SubmissionError,
} from 'redux-form';
import { Kind } from 'superstruct';
import { withLoading } from '../withLoading';
import { validateInput } from './validation';

type NoVarsMutationOpts = Omit<MutationOpts, 'variables'>;

export interface FormContainerOptions<QueryResult, MutationResult, FormInput> {
  /**
   * Graphql query
   */
  query: DocumentNode;
  /**
   * Graphql mutation
   */
  mutation: DocumentNode;
  /**
   * redux-form form name
   */
  formName: string;
  /**
   * The graphql queryContainer return data props
   * data[propName] contains initial data for the form
   */
  propName: string;
  /**
   * Default value in (new blank item) in case when id is not found and query returns null
   * Or function to construct this value from props.
   * It will be deserialized as if it came from the backend
   */
  defaultValue: object | ((props: any) => object);
  /**
   * Part of paths that indicates list of things
   * e.g. for form paths '/sources/123/gauges/456/settings' or '/sources/123/gauges/new'
   * we want to navigate to '/sources/123/gauges' on successful form submission
   * In this set backPath to 'gauges'.
   * If undefined - default to propName in plural
   * If null - navigate back
   */
  backPath?: string | null;
  /**
   * Convert graphql query result into something that can be feed to form (i.e. markdown -> draft.js)
   */
  deserializeForm: (data: any) => FormInput;
  /**
   * Convert form data into graphql mutation input (i.e. draft.js -> markdown string)
   * Remove __typename here
   */
  serializeForm: (input: FormInput) => any;
  /**
   * redux-form validateInput schema, works with form data (i.e. draft.js EditorState)
   */
  validationSchema: Kind;
  /**
   * By default mutate will be called with two varibales:
   * [propName] = serializedForm
   * language = language
   * This object will be merged into variables as well
   */
  extraVariables?: object | ((props: any) => object);
  /**
   * Extra options for mutation, e.g. refetchQueries
   */
  mutationOptions?: NoVarsMutationOpts | ((props: any) => NoVarsMutationOpts);
}

export const formContainer = <QueryResult, MutationResult, FormInput>(
  options: FormContainerOptions<QueryResult, MutationResult, FormInput>,
) => {
  const {
    query,
    mutation,
    propName,
    defaultValue,
    backPath,
    deserializeForm,
    serializeForm,
    validationSchema,
    formName,
    extraVariables,
    mutationOptions = {},
  } = options;

  type FormProps = Partial<ConfigProps<FormInput>>;

  type MappedProps = ChildProps<QueryResult, MutationResult> &
    RouteComponentProps<any>;

  const deserialize = memoize(deserializeForm);

  return compose(
    withRouter,
    // graphql(query, { options: { fetchPolicy: 'network-only' }, alias: `${formName}FormQuery` }),
    // TODO: Use functional options because of this bug: https://github.com/apollographql/react-apollo/issues/1873
    graphql(query, {
      options: () => ({ fetchPolicy: 'network-only' }),
      alias: `${formName}FormQuery`,
      props: (props) => omitTypename(props),
    }),
    withLoading<ChildProps<any, any>>(({ data }) => data!.loading),
    graphql(mutation, { alias: `${formName}FormMutation` }),
    mapProps<FormProps, MappedProps>((props) => {
      const { data, history, match, mutate, location } = props;
      const value =
        (data as any)[propName] ||
        (isFunction(defaultValue) ? defaultValue(props) : defaultValue);
      const splitter = backPath || `${propName}s`;
      const path = location.pathname.split(splitter)[0] + splitter;
      const extraVars = isFunction(extraVariables)
        ? extraVariables(props)
        : extraVariables;
      const mutationOpts: MutationOpts = isFunction(mutationOptions)
        ? mutationOptions(props)
        : mutationOptions;
      return {
        data,
        history,
        match,
        location,
        initialValues: deserialize(value),
        onSubmit: (input: FormInput) => {
          // Make it clear that we return promise
          return mutate!({
            ...mutationOpts,
            variables: { [propName]: serializeForm(input), ...extraVars },
          })
            .then(() =>
              backPath === null ? history.goBack() : history.replace(path!),
            )
            .catch((e: ApolloError) => {
              throw new SubmissionError({ _error: apolloErrorToString(e) });
            });
        },
      };
    }),
    reduxForm({
      form: formName,
      validate: validateInput(validationSchema),
    }),
    withLoading<InjectedFormProps>((props) => props.submitting),
  );
};
