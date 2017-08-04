import PT from 'prop-types';
import React from 'react';
import { SectionPropType } from '../sections';

export const PropTypes = {
  /**
   * Initial bounds set by user
   */
  initialBounds: PT.arrayOf(PT.arrayOf(PT.number)),
  /**
   * Bounds of region or section
   */
  contentBounds: PT.arrayOf(PT.arrayOf(PT.number)),
  sections: PT.arrayOf(SectionPropType),
  selectedSectionId: PT.string,
  onSectionSelected: PT.func,
  pois: PT.array,
  selectedPOIId: PT.string,
  onPOISelected: PT.func,
  useSectionShapes: PT.bool,
};

export const DefaultProps = {
  initialBounds: null,
  contentBounds: null,
  pois: [],
  sections: [],
  selectedSectionId: null,
  selectedPOIId: null,
  useSectionShapes: false,
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
      const { onSectionSelected, selectedSectionId, useSectionShapes } = this.props;
      const { zoom } = this.state;
      return (
        <SectionComponent
          useSectionShapes={useSectionShapes}
          key={section._id}
          section={section}
          selected={selectedSectionId === section._id}
          onSectionSelected={onSectionSelected}
          zoom={zoom}
        />
      );
    };

    renderPOI = (poi) => {
      const { onPOISelected, selectedPOIId } = this.props;
      const { zoom } = this.state;
      return (
        <POIComponent
          key={poi._id}
          poi={poi}
          selected={selectedPOIId === poi._id}
          onPOISelected={onPOISelected}
          zoom={zoom}
        />
      );
    };

    render() {
      const { initialBounds, contentBounds, sections, pois, ...props } = this.props;
      return (
        <MapComponent initialBounds={initialBounds} contentBounds={contentBounds} onZoom={this.onZoom} {...props}>
          { sections.map(this.renderSection) }
          { pois.map(this.renderPOI) }
        </MapComponent>
      );
    }
  }

  return MapBase;
};
