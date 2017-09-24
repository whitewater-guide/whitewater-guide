import { Schema } from 'joi';
import { ApolloError, ChildProps } from 'react-apollo';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { ComponentEnhancer, compose, mapProps } from 'recompose';
import { ConfigProps, InjectedFormProps, reduxForm, SubmissionError } from 'redux-form';
import { withLoading } from '../withLoading';
import { validateInput } from './validateInput';

export interface FormContainerOptions<QueryResult, MutationResult, FormInput> {
  queryContainer: ComponentEnhancer<QueryResult, any>;
  mutationContainer: ComponentEnhancer<MutationResult, any>;
  formName: string;
  propName: string;
  backPath: string;
  deserializeForm: (data: any) => FormInput;
  serializeForm: (input: FormInput) => any;
  validationSchema: Schema;
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

  type MappedProps = ChildProps<QueryResult, MutationResult> & RouteComponentProps<any>;

  return compose(
    queryContainer,
    mutationContainer,
    withRouter,
    mapProps<FormProps, MappedProps>(({ [propName]: details, history, mutate }) => ({
      [propName]: details,
      initialValues: deserializeForm(details.data!),
      onSubmit: (input: FormInput) => {
        // Make it clear that we return promise
        return mutate!({ variables: { [propName]: serializeForm(input) } })
          .then(() => history.replace(backPath))
          .catch((e: ApolloError) => {
            throw new SubmissionError({ _error: e.message });
          });
      },
    })),
    withLoading<QueryResult>(({ [propName]: details }) => details.loading),
    reduxForm({
      form: formName,
      validate: validateInput(validationSchema),
    }),
    withLoading<InjectedFormProps>(props => props.submitting),
  );
};
