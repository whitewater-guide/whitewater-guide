import React, {Component, PropTypes} from 'react';
import gql from 'graphql-tag';
import {graphql} from 'react-apollo';
import {compose} from 'recompose';
import {withRouter} from 'react-router';

const myProfile = gql`
  query myProfile {
    me {
      _id
      roles
    }
  }
`;

const container = compose(
  withRouter,
  graphql(
    myProfile,
    {
      options: () => ({notifyOnNetworkStatusChange: true}),
      props: ({data: {me, loading}}) => {
        const admin = me && me.roles.includes('admin');
        return {admin, adminLoading: loading};
      },
    }
  ),
);

/**
 * Provide admin boolean prop to wrapped component. Or renders 403 page if non-admins are not allowed.
 * @param redirectUnauthorized If true, non-admins will see 403 page instead of wrapped component
 * @returns Wrapped component
 */
export function withAdmin(redirectUnauthorized = false) {
  return function wrapWithAdmin(Wrapped) {
    class AdminWrapper extends Component {
      static propTypes = {
        admin: PropTypes.bool,
        adminLoading: PropTypes.bool,
        rouer: PropTypes.object,
      };

      render() {
        const {adminLoading, router, ...props} = this.props;
        if (adminLoading) {
          return null;
        }
        else if (this.props.admin || !redirectUnauthorized) {
          return (<Wrapped {...props}/>);
        }
        else {
          router.replace('/403');
          return null;
        }
      }
    }

    return container(AdminWrapper);
  }
}