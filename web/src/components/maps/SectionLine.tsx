import * as React from 'react';
import { getSectionColor } from '../../ww-clients/features/sections';
import { Section } from '../../ww-commons';
import Line = google.maps.Polyline;

interface Props {
  section: Section;
  selected?: boolean;
  onSectionSelected: (section: Section | null) => void;
  map: google.maps.Map;
  zoom: number;
}

export class SectionLine extends React.PureComponent<Props> {
  line: Line;

  componentDidMount() {
    const { map } = this.props;
    this.line = new Line({ path: this.getPaths(), map, ...this.getStyle() });
    this.setupListeners(true);
  }

  componentDidUpdate(prevProps: Props) {
    if (this.props.zoom !== prevProps.zoom || this.props.selected !== prevProps.selected) {
      this.line.setOptions(this.getStyle());
    }
  }

  componentWillUnmount() {
    this.line.setMap(null);
    this.setupListeners(false);
  }

  getPaths() {
    const { putIn, takeOut } = this.props.section;
    return [
      { lat: putIn.coordinates[1], lng: putIn.coordinates[0] },
      { lat: takeOut.coordinates[1], lng: takeOut.coordinates[0] },
    ];
  }

  getStyle() {
    const { selected, zoom, section } = this.props;
    const flows = section.flows;
    const levels = section.levels;
    const bindings = (flows && flows.lastValue) ? flows : levels;
    const color = getSectionColor(bindings || {});
    return {
      geodesic: true,
      strokeColor: color,
      strokeOpacity: 1,
      strokeWeight: selected ? 6 : 4,
      icons: [{
        icon: {
          path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
          scale: Math.min(3, zoom / 3),
        },
        offset: '100%',
      }],
    };
  }

  setupListeners = (on: boolean) => {
    if (on) {
      this.line.addListener('click', () => this.props.onSectionSelected(this.props.section));
    } else {
      google.maps.event.clearListeners(this.line, 'click');
    }
  };

  render() {
    return null;
  }

}
