import React, { PropTypes } from 'react';
import _ from 'lodash';
import { RegionPropType } from './propTypes';
import { SectionPropType } from '../sections';

export default (MapRoot, renderSection, renderPOI) => {
  class MapOfRegion extends React.PureComponent {
    static propTypes = {
      region: RegionPropType.isRequired,
      sections: PropTypes.arrayOf(SectionPropType).isRequired,
      onSectionSelected: PropTypes.func.isRequired,
      selectedSection: SectionPropType,
      selectedPOI: PropTypes.object,
      onPOISelected: PropTypes.func,
    };

    static defaultProps = {
      selectedSection: null,
      selectedPOI: null,
      onPOISelected: () => {},
    };

    sectionRenderer = (section) => {
      const { onSectionSelected, selectedSection } = this.props;
      const selectSection = () => onSectionSelected(section);
      return renderSection(section, !!selectedSection && section._id === selectedSection._id, selectSection);
    };

    poiRenderer = (poi) => {
      const { onPOISelected, selectedPOI } = this.props;
      return renderPOI(poi, !!selectedPOI && poi._id === selectedPOI._id, onPOISelected);
    };

    render() {
      const { region, sections, ...props } = this.props;
      const initialBounds =
        region && region.bounds && region.bounds.sw ?
        {
          sw: { lat: _.get(region, 'bounds.sw.1'), lng: _.get(region, 'bounds.sw.0') },
          ne: { lat: _.get(region, 'bounds.ne.1'), lng: _.get(region, 'bounds.ne.0') },
        } :
        null;
      return (
        <MapRoot initialBounds={initialBounds} {...props}>
          { sections.map(this.sectionRenderer) }
          { /* region.pois.map(this.poiRenderer) */ }
        </MapRoot>
      );
    }
  }

  return MapOfRegion;
};
