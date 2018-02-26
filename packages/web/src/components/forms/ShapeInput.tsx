import { isEmpty } from 'lodash';
import * as React from 'react';
import { BaseFieldArrayProps, FieldArray, GenericFieldArray, WrappedFieldArrayProps } from 'redux-form';
import { Styles } from '../../styles';
import { computeDistanceBetween } from '../../ww-clients/utils';
import { Coordinate3d } from '../../ww-commons';
import { LatLonAltInput, LLAArrayField } from './LatLonAltInput';

const styles: Styles = {
  container: {
    height: '100%',
  },
};

type Props = WrappedFieldArrayProps<Coordinate3d>;

class ShapeInputComponent extends React.Component<Props> {

  renderLineLength = () => {
    const points = this.props.fields.getAll() || [];
    let distance = 0;
    for (let i = 1; i < points.length; i += 1) {
      distance += computeDistanceBetween(points[i - 1], points[i]);
    }
    return (
      <div>
        <strong>Distance:</strong> {`${distance.toFixed(3)} km`}
      </div>
    );
  };

  onAdd = (value: Coordinate3d) => {
    this.props.fields.push(value);
  };

  render() {
    const { fields } = this.props;
    return (
      <div style={styles.container}>
        { this.renderLineLength() }
        {
          fields.map((name, index) => (
            <LLAArrayField key={index} name={name} index={index} fields={fields} />
          ))
        }
        <LatLonAltInput isNew key={`new${fields.length}`} onAdd={this.onAdd} />
      </div>
    );
  }
}

type FieldArrayProps = BaseFieldArrayProps;

export const ShapeInput: React.StatelessComponent<FieldArrayProps> = props => {
  const CustomField = FieldArray as new () => GenericFieldArray<Coordinate3d>;
  return (
    <CustomField {...props} component={ShapeInputComponent} />
  );
};
