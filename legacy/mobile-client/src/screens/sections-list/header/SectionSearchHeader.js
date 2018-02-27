import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import HeaderTitle from 'react-navigation/src/views/HeaderTitle';
import { gql } from 'react-apollo';
import { propType } from 'graphql-anywhere';
import { SearchBar } from '../../../components';
import { updateSearchTerms, searchTermsSelector } from '../../../commons/features/regions';
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

const SectionSearchHeader = ({ region, searchString, onSearch }) => (
  <SearchBar searchString={searchString} onChange={onSearch} >
    <HeaderTitle style={styles.title}>{region ? region.name : 'All sections'}</HeaderTitle>
  </SearchBar>
);

SectionSearchHeader.propTypes = {
  region: propType(nameFragment),
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
    (state, props) => ({ searchString: searchTermsSelector(state, props).searchTerms.searchString }),
    (dispatch, props) => ({
      onSearch: searchString => dispatch(updateSearchTerms(props.region._id, { searchString })),
    }),
  ),
)(SectionSearchHeader);