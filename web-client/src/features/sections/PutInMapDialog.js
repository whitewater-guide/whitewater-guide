import PropTypes from 'prop-types';
import React from 'react';
import { SelectPointsDialog } from '../../core/forms';
import { isValidLat, isValidLng } from '../../commons/utils/GeoUtils';
import _ from 'lodash';

export default class PutInMapDialog extends React.Component {
  static propTypes = {
    ...SelectPointsDialog.propTypes,
  };

  static contextTypes = {
    formData: PropTypes.object,
    formErrors: PropTypes.object,
    formFieldChangeHandler: PropTypes.func,
  };

  render() {
    const initialPoints = [];
    const putInLat = _.get(this.context.formData, 'putIn.coordinates.1');
    const putInLng = _.get(this.context.formData, 'putIn.coordinates.0');
    const takeOutLat = _.get(this.context.formData, 'takeOut.coordinates.1');
    const takeOutLng = _.get(this.context.formData, 'takeOut.coordinates.0');

    if (isValidLat(putInLat) && isValidLng(putInLng)) {
      initialPoints.push([putInLng, putInLat]);
      if (isValidLat(takeOutLat) && isValidLng(takeOutLng)) {
        initialPoints.push([takeOutLng, takeOutLat]);
      }
    }
    return (
      <SelectPointsDialog
        {...this.props}
        initialPoints={initialPoints}
        onSubmit={this.onSubmit}
      />
    );
  }

  onSubmit = (points) => {
    //Not very efficient, because causes 4 state changes instead of one
    if (points.length > 0) {
      let fields = {
        "putIn.coordinates.0": points[0][0],
        "putIn.coordinates.1": points[0][1],
      };
      if (points.length > 1) {
        fields["takeOut.coordinates.0"] = points[1][0];
        fields["takeOut.coordinates.1"] = points[1][1];
      }
      this.context.formFieldChangeHandler(fields);
    }
    if (this.props.onSubmit)
      this.props.onSubmit(points);
  };

}
