import PT from 'prop-types';
import React from 'react';
import { SectionPropType } from '../sections';

export const PropTypes = {
  bounds: PT.arrayOf(PT.arrayOf(PT.number)),
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

export default (MapComponent, SectionComponent, POIComponent) => {
  class MapBase extends React.PureComponent {
    static propTypes = {
      ...PropTypes,
    };

    static defaultProps = {
      ...DefaultProps,
    };

    state = {
      zoom: 1,
    };

    onZoom = zoom => this.setState({ zoom });

    renderSection = (section) => {
      const { onSectionSelected, selectedSection } = this.props;
      const { zoom } = this.state;
      return (
        <SectionComponent
          key={section._id}
          section={section}
          selected={selectedSection && selectedSection._id === section._id}
          onSectionSelected={onSectionSelected}
          zoom={zoom}
        />
      );
    };

    renderPOI = (poi) => {
      const { onPOISelected, selectedPOI } = this.props;
      const { zoom } = this.state;
      return (
        <POIComponent
          key={poi._id}
          poi={poi}
          selected={selectedPOI && selectedPOI._id === poi._id}
          onPOISelected={onPOISelected}
          zoom={zoom}
        />
      );
    };

    render() {
      const { bounds, sections, pois, ...props } = this.props;
      return (
        <MapComponent initialBounds={bounds} onZoom={this.onZoom} {...props}>
          { sections.map(this.renderSection) }
          { pois.map(this.renderPOI) }
        </MapComponent>
      );
    }
  }

  return MapBase;
};
