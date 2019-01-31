import React from 'react';
import { SectionComponentProps } from '@whitewater-guide/clients';
import { getSectionColor } from '@whitewater-guide/clients';
import { MapElement } from './types';

const Line = google.maps.Polyline;
type Line = google.maps.Polyline;

type Props = SectionComponentProps & MapElement;

export class SectionLine extends React.PureComponent<Props> {
  line: Line | null = null;

  componentDidMount() {
    const { map } = this.props;
    this.line = new Line({ path: this.getPaths(), map, ...this.getStyle() });
    this.setupListeners(true);
  }

  componentDidUpdate(prevProps: Props) {
    if (
      this.line &&
      (this.props.zoom !== prevProps.zoom ||
        this.props.selected !== prevProps.selected)
    ) {
      this.line.setOptions(this.getStyle());
    }
  }

  componentWillUnmount() {
    if (this.line) {
      this.line.setMap(null);
    }
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
    const color = getSectionColor(section);
    return {
      geodesic: true,
      strokeColor: color,
      strokeOpacity: 1,
      strokeWeight: selected ? 6 : 4,
      icons: [
        {
          icon: {
            path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
            scale: Math.min(3, zoom / 3),
          },
          offset: '100%',
        },
      ],
    };
  }

  setupListeners = (on: boolean) => {
    if (!this.line) {
      return;
    }
    if (on) {
      this.line.addListener('click', () =>
        this.props.onSectionSelected(this.props.section),
      );
    } else {
      google.maps.event.clearListeners(this.line, 'click');
    }
  };

  render() {
    return null;
  }
}