import React from 'react';
import { connect } from 'react-redux';
import { compose, mapProps } from 'recompose';
import _ from 'lodash';
import { TabIcon } from '../../../components';
import { withFragment } from '../../../commons/core';
import { SectionFragments } from '../../../commons/features/sections';
import { currentScreenSelector } from '../../../utils';

export default compose(
  connect(currentScreenSelector),
  withFragment({
    fragment: SectionFragments.Media,
    fragmentName: 'SectionMedia',
    idFromProps: props => `Section:${_.get(props, 'params.sectionId')}`,
    propName: 'section',
  }),
  mapProps(({ section, tintColor, icon }) => ({ counter: section ? section.media.length : 0, tintColor, icon })),
)(TabIcon);
