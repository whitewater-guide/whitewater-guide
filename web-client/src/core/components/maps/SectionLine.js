import { PropTypes } from 'react';
import Polyline from './Polyline';

export class SectionLine extends Polyline {

  static propTypes = {
    ...Polyline.propTypes,
    onClick: PropTypes.func,
    color: PropTypes.string,
  };

  static defaultProps = {
    color: '#000000',
  };

  componentDidMount() {
    super.componentDidMount();
    this.setupListeners(this.props);
  }

  componentDidUpdate(prevProps, prevState) {
    super.componentDidUpdate(prevProps, prevState);
    this.setupListeners(this.props);
    if (this.props.zoom !== prevProps.zoom || this.props.color !== prevProps.color) {
      this.line.setOptions(this.getStyle());
    }
  }

  componentWillUnmount() {
    super.componentWillUnmount();
    this.setupListeners({});
  }

  getPaths() {
    const { origin, destination } = this.props;
    return [
      { lat: origin.coordinates[1], lng: origin.coordinates[0] },
      { lat: destination.coordinates[1], lng: destination.coordinates[0] },
    ];
  }

  getStyle() {
    const { color, maps, zoom } = this.props;
    return {
      geodesic: true,
      strokeColor: color,
      strokeOpacity: 1,
      strokeWeight: 4,
      icons: [{
        icon: {
          path: maps.SymbolPath.FORWARD_CLOSED_ARROW,
          scale: Math.min(3, zoom / 3),
        },
        offset: '100%',
      }],
    };
  }

  setupListeners = ({ onClick }) => {
    if (onClick) {
      this.line.addListener('click', onClick);
    } else {
      this.props.maps.event.clearListeners(this.line, 'click');
    }
  };

}
