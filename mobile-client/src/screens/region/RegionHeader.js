import React, { PropTypes } from 'react';
import { gql, graphql } from 'react-apollo';
import HeaderTitle from 'react-navigation/src/views/HeaderTitle';
import _ from 'lodash';

const RegionHeader = ({data}) => {
  return (<HeaderTitle>{_.get(data, 'region.name')}</HeaderTitle>);
};

const regionName = gql`
  query regionName($regionId: ID!) {
    region(_id: $regionId) {
      name
    }
  }
`;

export default graphql(
  regionName,
  { options: { fetchPolicy: 'cache-only' } },
)(RegionHeader);
