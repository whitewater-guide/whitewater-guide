import React from 'react';
import { StyleSheet } from 'react-native';
import HeaderTitle from 'react-navigation/src/views/HeaderTitle';
import { gql } from 'react-apollo';
import { propType } from 'graphql-anywhere';
import { SearchBar } from '../../../components';
import { withFragment } from '../../../commons/core';

const nameFragment = gql`
  fragment RegionName on Region {
    _id
    name
  }
`;

const styles = StyleSheet.create({
  title: {
    flex: 1,
  },
});

const RegionHeader = ({ region }) => (
  <SearchBar>
    <HeaderTitle style={styles.title}>{region.name}</HeaderTitle>
  </SearchBar>
);

RegionHeader.propTypes = {
  region: propType(nameFragment).isRequired,
};

export default withFragment({
  fragment: nameFragment,
  idFromProps: ({ regionId }) => `Region:${regionId}`,
  propName: 'region',
})(RegionHeader);
