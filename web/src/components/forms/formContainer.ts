import { Schema } from 'joi';
import { ChildProps } from 'react-apollo';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { ComponentEnhancer, compose, mapProps, withState } from 'recompose';
import { ConfigProps, InjectedFormProps, reduxForm } from 'redux-form';
import { withLoading } from '../withLoading';
import { validateInput } from './validateInput';

interface FormContainerOptions<QueryResult, MutationResult, FormInput> {
  detailsContainer: ComponentEnhancer<QueryResult, any>;
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
    detailsContainer,
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
    detailsContainer,
    mutationContainer,
    withRouter,
    withState('mutationState', 'setMutationState', { loading: false }),
    mapProps<FormProps, MappedProps>(({ [propName]: details, history, mutate }) => ({
      [propName]: details,
      initialValues: deserializeForm(details.data!),
      onSubmit: (input: FormInput) => {
        return mutate!({ variables: { [propName]: serializeForm(input) } }).then(() => history.replace(backPath));
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
