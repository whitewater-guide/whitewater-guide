import PT from 'prop-types';
import React from 'react';
import _ from 'lodash';
import { SectionPropType } from '../sections';

export const PropTypes = {
  bounds: PT.object,
  sections: PT.arrayOf(SectionPropType),
  selectedSection: SectionPropType,
  onSectionSelected: PT.func,
  pois: PT.array,
  selectedPOI: PT.object,
  onPOISelected: PT.func,
};

export const DefaultProps = {
  bounds: null,
  pois: [],
  sections: [],
  selectedSection: null,
  selectedPOI: null,
  onSectionSelected: () => {},
  onPOISelected: () => {},
};

export default (MapComponent, renderSection, renderPOI) => {
  class MapBase extends React.PureComponent {
    static propTypes = {
      ...PropTypes,
    };

    static defaultProps = {
      ...DefaultProps,
    };

    sectionRenderer = (section) => {
      const { onSectionSelected, selectedSection } = this.props;
      const selectSection = () => onSectionSelected(section);
      return renderSection(section, !!selectedSection && section._id === selectedSection._id, selectSection);
    };

    poiRenderer = (poi) => {
      const { onPOISelected, selectedPOI } = this.props;
      const selectPOI = () => onPOISelected(poi);
      return renderPOI(poi, !!selectedPOI && poi._id === selectedPOI._id, selectPOI);
    };

    render() {
      const { bounds, sections, pois, ...props } = this.props;
      return (
        <MapComponent initialBounds={bounds} {...props}>
          { sections.map(this.sectionRenderer) }
          { pois.map(this.poiRenderer) }
        </MapComponent>
      );
    }
  }

  return MapBase;
};
