import React from 'react';
import PropTypes from 'prop-types';
import { DrawingMap } from '../components';

export default class DrawingMapField extends React.Component {
  static propTypes = {
    field: PropTypes.shape({
      value: PropTypes.any,
      error: PropTypes.string,
      onChange: PropTypes.func,
    }),
    drawingMode: PropTypes.oneOf(['marker', 'polyline', 'polygon']).isRequired,
    bounds: PropTypes.object,
  };

  onChange = points => this.props.field.onChange(points);

  render() {
    const { drawingMode, bounds } = this.props;
    return (
      <div style={{ width: '100%', height: '100%' }}>
        <DrawingMap
          drawingMode={drawingMode}
          bounds={bounds}
          initialPoints={this.props.field.value}
          onChange={this.onChange}
        />
      </div>
    );
  }
}
