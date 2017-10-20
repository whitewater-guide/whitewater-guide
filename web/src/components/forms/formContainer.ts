import { DocumentNode } from 'graphql';
import { Schema } from 'joi';
import { memoize } from 'lodash';
import { ApolloError, ChildProps, graphql } from 'react-apollo';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { ComponentEnhancer, compose, mapProps, withProps } from 'recompose';
import { ConfigProps, InjectedFormProps, reduxForm, SubmissionError } from 'redux-form';
import { withLoading } from '../withLoading';
import { validateInput } from './validateInput';

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
   * The graphq queryContainer return data props
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
   * react-router will navigate to this path on successful form submission
   */
  backPath: string;
  /**
   * Convert graphql query result into something that can be feed to form (i.e. markdown -> draft.js)
   * Remove __typename here
   */
  deserializeForm: (data: any) => FormInput;
  /**
   * Convert form data into graphql mutation input (i.e. draft.js -> markdown string)
   * Remove __typename here
   */
  serializeForm: (input: FormInput) => any;
  /**
   * redux-form validation schema, works with form data (i.e. draft.js EditorState)
   */
  validationSchema: Schema;
}

export interface WithLanguage {
  language: string;
  onLanguageChange: (language: string) => void;
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
  } = options;

  type FormProps = Partial<ConfigProps<FormInput>>;

  type MappedProps = ChildProps<QueryResult, MutationResult> & RouteComponentProps<any> & WithLanguage;

  const deserialize = memoize(deserializeForm);

  return compose(
    withRouter,
    withProps<WithLanguage, RouteComponentProps<any>>(({ history }) => ({
      language: (new URLSearchParams(history.location.search)).get('language') || 'en',
      onLanguageChange: (language: string) => {
        const search = new URLSearchParams(history.location.search);
        search.set('language', language);
        history.replace({
          ...history.location,
          search: search.toString(),
        });
      },
    })),
    graphql(query, { options: { fetchPolicy: 'network-only' }, alias: `${formName}FormQuery` }),
    withLoading<ChildProps<any, any>>(({ data }) => data!.loading),
    graphql(mutation, { alias: `${formName}FormMutation` }),
    mapProps<FormProps, MappedProps>((props) => {
      const { data, history, mutate, language, onLanguageChange } = props;
      const value = (data as any)[propName] ||
        (typeof defaultValue === 'function' ? defaultValue(props) : defaultValue);
      return {
        language,
        onLanguageChange,
        data,
        initialValues: deserialize(value),
        onSubmit: (input: FormInput) => {
          // Make it clear that we return promise
          return mutate!({ variables: { [propName]: serializeForm(input), language } })
            .then(() => history.replace(backPath))
            .catch((e: ApolloError) => {
              throw new SubmissionError({ _error: e.message });
            });
        },
      };
    }),
    reduxForm({
      form: formName,
      validate: validateInput(validationSchema),
      enableReinitialize: true,
    }),
    withLoading<InjectedFormProps>(props => props.submitting),
  );
};
