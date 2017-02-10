import React, {Component, PropTypes} from 'react';
import Page403Unauthorized from '../../Page403Unauthorized';
import gql from 'graphql-tag';
import {graphql} from 'react-apollo';
import {compose} from 'recompose';

const myProfile = gql`
  query myProfile {
    me {
      _id
      roles
    }
  }
`;

const container = compose(
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

export function withAdmin(redirectUnauthorized = false){
  return function wrapWithAdmin(Wrapped){
    class AdminWrapper extends Component {
      static propTypes = {
        admin: PropTypes.bool,
        adminLoading: PropTypes.bool,
      };

      render() {
        const {adminLoading, ...props} = this.props;
        if (adminLoading){
          return null;
        }
        else if (this.props.admin || !redirectUnauthorized){
          return (<Wrapped {...props}/>);
        }
        else {
          return (<Page403Unauthorized/>);
        }
      }
    }

    return container(AdminWrapper);
  }
}