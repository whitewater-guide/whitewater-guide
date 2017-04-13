/**
 * Helper function to wrap error and refetch handlers of graphql containers and pass them down
 * Does not overwrite errors from other graphql containers. Instead, merges them.
 * @param errorPropName Name of grpahql container that caused error, it will be the key in errors object
 * @param mapProps Function to map props when no error is found
 */
export const wrapErrors = (errorPropName, mapProps) => (props) => {
  const { data: { error, refetch }, ownProps } = props;
  let errors = ownProps.errors || {};
  if (error) {
    errors = { ...errors, [errorPropName]: { error, refetch } };
  }
  return { ...mapProps(props), errors };
};
