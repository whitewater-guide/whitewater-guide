import React from 'react';
import PropTypes from 'prop-types';
import update from 'immutability-helper';
import { DrawingMap } from '../components';
import DrawingMapSidebarPoint from './DrawingMapSidebarPoint';

const styles = {
  container: {
    display: 'flex',
    flex: 1,
    alignSelf: 'stretch',
    alignItems: 'stretch',
    flexDirection: 'row',
  },
  mapContainer: {
    flex: 1,
  },
  sidebar: {
    width: 240,
    padding: 8,
    overflowY: 'auto',
  },
};

const minPoints = {
  marker: 1,
  polyline: 2,
  polygon: 3,
};

export default class DrawingMapField extends React.Component {
  static propTypes = {
    field: PropTypes.shape({
      value: PropTypes.any,
      error: PropTypes.string,
      onChange: PropTypes.func,
    }),
    drawingMode: PropTypes.oneOf(['marker', 'polyline', 'polygon']).isRequired,
    bounds: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)),
  };

  onChange = points => this.props.field.onChange(points);

  onInput = (index, point) => {
    const { value, onChange } = this.props.field;
    const splice = [index, point ? 0 : 1];
    if (point) {
      splice.push(point);
    }
    onChange(update(value, { $splice: [splice] }));
  };

  renderPointInputs = (point, index) => {
    const points = this.props.field.value;
    const disableRemove = points.length <= minPoints[this.props.drawingMode];
    return (
      <DrawingMapSidebarPoint
        key={`point_${index}`}
        index={index}
        point={point}
        disableRemove={disableRemove}
        onChange={this.onInput}
      />
    );
  };

  render() {
    const { drawingMode, bounds } = this.props;
    const points = this.props.field.value || [];
    return (
      <div style={styles.container}>
        <div style={styles.mapContainer}>
          <div style={{ width: '100%', height: '100%' }}>
            <DrawingMap
              drawingMode={drawingMode}
              bounds={bounds}
              points={points}
              onChange={this.onChange}
            />
          </div>
        </div>
        <div style={styles.sidebar}>
          { points.map(this.renderPointInputs) }
          <DrawingMapSidebarPoint
            key={`point_${points.length}`}
            index={points.length}
            onChange={this.onInput}
            disableRemove={false}
          />
        </div>
      </div>
    );
  }
}
