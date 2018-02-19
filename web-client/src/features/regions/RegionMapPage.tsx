import React from 'react';
import { connect } from 'react-redux';
import { compose, lifecycle } from 'recompose';
import { LoadingPlug } from '../../core/components';
import { ViewSection } from '../sections';
import { withRegion, RegionMapView, selectRegion } from '../../commons/features/regions';
import { withSectionsList } from '../../commons/features/sections';
import RegionMapLayout from './RegionMapLayout';
import MapOfRegionWeb from './MapOfRegionWeb';

export default compose(
  withRegion({ withBounds: true, withPOIs: false }),
  withSectionsList({ withGeo: true }),
  connect(undefined, { selectRegion }),
  lifecycle({
    componentDidMount() {
      this.props.selectRegion(this.props.regionId);
    },
  }),
)(RegionMapView(RegionMapLayout, MapOfRegionWeb, ViewSection, () => <div />, LoadingPlug));