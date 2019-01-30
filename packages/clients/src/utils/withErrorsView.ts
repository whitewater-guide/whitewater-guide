import isEmpty from 'lodash/isEmpty';
import { ComponentType } from 'react';
import { branch, renderComponent, withProps } from 'recompose';

const defaultErrorMessage = 'Cannot load data';

export interface WithErrors {
  errors?: any;
}

export interface WithErrorMessage {
  errorMessage: string;
}

/**
 * Renders error component when passed props with non-empty graphql errors object
 * To be used together with grpahqlContainers and wrapErrors
 * @param errorComponent Component to render error
 * @param errorMessage Error message to display
 */
export default <TOuter extends WithErrors>(
  errorComponent: ComponentType<WithErrorMessage>,
  errorMessage = defaultErrorMessage,
) =>
  branch<TOuter>(
    (props) => !isEmpty(props.errors),
    renderComponent(withProps({ errorMessage })(errorComponent)),
  );
