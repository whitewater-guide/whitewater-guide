import { branch, renderComponent, withProps } from 'recompose';
import _ from 'lodash';

const defaultErrorMessage = 'Cannot load data';

/**
 * Renders error component when passed props with non-empty graphql errors object
 * To be used together with grpahqlContainers and wrapErrors
 * @param errorComponent Component to render error
 * @param errorMessage Error message to display
 */
export default (errorComponent, errorMessage = defaultErrorMessage) => branch(
  props => !_.isEmpty(props.errors),
  renderComponent(withProps({ errorMessage })(errorComponent)),
);
