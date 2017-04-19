import PropTypes from 'prop-types';
import Polyline from './Polyline';

export class SectionLine extends Polyline {

  static propTypes = {
    ...Polyline.propTypes,
    section: PropTypes.object.isRequired,
    selected: PropTypes.bool,
    onSectionSelected: PropTypes.func.isRequired,
  };

  static defaultProps = {
    selected: false,
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
    const { putIn, takeOut } = this.props.section;
    return [
      { lat: putIn.coordinates[1], lng: putIn.coordinates[0] },
      { lat: takeOut.coordinates[1], lng: takeOut.coordinates[0] },
    ];
  }

  getStyle() {
    const { selected, maps, zoom } = this.props;
    const color = selected ? 'red' : 'black';
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
