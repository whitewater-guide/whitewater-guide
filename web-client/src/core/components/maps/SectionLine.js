import PropTypes from 'prop-types';
import Polyline from './Polyline';
import { getSectionColor } from '../../../commons/features/sections';

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
    this.setupListeners(true);
  }

  componentDidUpdate(prevProps, prevState) {
    super.componentDidUpdate(prevProps, prevState);
    if (this.props.zoom !== prevProps.zoom || this.props.selected !== prevProps.selected) {
      this.line.setOptions(this.getStyle());
    }
  }

  componentWillUnmount() {
    super.componentWillUnmount();
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
    const { selected, maps, zoom, section } = this.props;
    const flows = section.flows || {};
    const levels = section.levels || {};
    const bindings = flows.lastValue ? flows : levels;
    const color = getSectionColor(bindings);
    return {
      geodesic: true,
      strokeColor: color,
      strokeOpacity: 1,
      strokeWeight: selected ? 6 : 4,
      icons: [{
        icon: {
          path: maps.SymbolPath.FORWARD_CLOSED_ARROW,
          scale: Math.min(3, zoom / 3),
        },
        offset: '100%',
      }],
    };
  }

  setupListeners = (on) => {
    if (on) {
      this.line.addListener('click', () => this.props.onSectionSelected(this.props.section));
    } else {
      this.props.maps.event.clearListeners(this.line, 'click');
    }
  };

}
