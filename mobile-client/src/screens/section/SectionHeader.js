import React from 'react';
import HeaderTitle from 'react-navigation/src/views/HeaderTitle';
import { propType } from 'graphql-anywhere';
import { withFragment } from '../../commons/core';
import { SectionFragments } from '../../commons/features/sections';

const SectionHeader = ({ section: { name, river } }) => (
  <HeaderTitle>{`${river.name} - ${name}`}</HeaderTitle>
);

SectionHeader.propTypes = {
  section: propType(SectionFragments.Name).isRequired,
};

export default withFragment({
  fragment: SectionFragments.Name,
  idFromProps: ({ sectionId }) => `Section:${sectionId}`,
  propName: 'section',
})(SectionHeader);
