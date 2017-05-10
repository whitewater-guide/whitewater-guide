import React from 'react';
import HeaderTitle from 'react-navigation/src/views/HeaderTitle';
import { gql } from 'react-apollo';
import { propType } from 'graphql-anywhere';
import { withFragment } from '../../../commons/core';

const nameFragment = gql`
  fragment RegionName on Region {
    _id
    name
  }
`;

const RegionHeader = ({ region: { name } }) => <HeaderTitle>{name}</HeaderTitle>;

RegionHeader.propTypes = {
  region: propType(nameFragment).isRequired,
};

export default withFragment({
  fragment: nameFragment,
  idFromProps: ({ regionId }) => `Region:${regionId}`,
  propName: 'region',
})(RegionHeader);
