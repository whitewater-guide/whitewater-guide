import { Schema } from 'joi';
import { memoize } from 'lodash';
import { ApolloError, ChildProps } from 'react-apollo';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { ComponentEnhancer, compose, mapProps, withProps } from 'recompose';
import { ConfigProps, InjectedFormProps, reduxForm, SubmissionError } from 'redux-form';
import { withLoading } from '../withLoading';
import { validateInput } from './validateInput';

export interface FormContainerOptions<QueryResult, MutationResult, FormInput> {
  /**
   * Graphql query enhancer
   */
  queryContainer: ComponentEnhancer<QueryResult, any>;
  /**
   * Graphql mutation enhancer
   */
  mutationContainer: ComponentEnhancer<MutationResult, any>;
  /**
   * redux-form form name
   */
  formName: string;
  /**
   * Name of the prop where queryContainer puts the result
   */
  propName: string;
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
    queryContainer,
    mutationContainer,
    propName,
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
    queryContainer,
    mutationContainer,
    mapProps<FormProps, MappedProps>((props) => {
      const { [propName]: details, history, mutate, language, onLanguageChange } = props;
      return {
        language,
        onLanguageChange,
        [propName]: details,
        initialValues: deserialize(details.data!),
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
    withLoading<QueryResult>(({ [propName]: details }) => details.loading),
    reduxForm({
      form: formName,
      validate: validateInput(validationSchema),
      enableReinitialize: true,
    }),
    withLoading<InjectedFormProps>(props => props.submitting),
  );
};
