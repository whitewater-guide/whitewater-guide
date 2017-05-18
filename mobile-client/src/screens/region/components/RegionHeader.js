import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import HeaderTitle from 'react-navigation/src/views/HeaderTitle';
import { gql } from 'react-apollo';
import { propType } from 'graphql-anywhere';
import { updatesectionSearchTerms } from '../../../core/actions';
import { currentSectionSearchTerms } from '../../../core/selectors';
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

const RegionHeader = ({ region, searchString, onSearch }) => (
  <SearchBar searchString={searchString} onChange={onSearch} >
    <HeaderTitle style={styles.title}>{region.name}</HeaderTitle>
  </SearchBar>
);

RegionHeader.propTypes = {
  region: propType(nameFragment).isRequired,
  searchString: PropTypes.string.isRequired,
  onSearch: PropTypes.func.isRequired,
};

export default compose(
  withFragment({
    fragment: nameFragment,
    idFromProps: ({ regionId }) => `Region:${regionId}`,
    propName: 'region',
  }),
  connect(
    state => ({ searchString: currentSectionSearchTerms(state).searchString }),
    { onSearch: searchString => updatesectionSearchTerms({ searchString }) },
  ),
)(RegionHeader);
