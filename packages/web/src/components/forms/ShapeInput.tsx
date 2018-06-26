import Divider from 'material-ui/Divider';
import IconButton from 'material-ui/IconButton';
import React from 'react';
import { BaseFieldArrayProps, FieldArray, GenericFieldArray, WrappedFieldArrayProps } from 'redux-form';
import { Styles } from '../../styles';
import { computeDistanceBetween } from '../../ww-clients/utils';
import { Coordinate3d } from '../../ww-commons';
import { LatLonAltInput, LLAArrayField } from './LatLonAltInput';

const styles: Styles = {
  container: {
    height: '100%',
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  lengthBlock: {
    flex: 1,
  },
  divider: {
    marginTop: 8,
    marginBottom: 8,
  },
};

type Props = WrappedFieldArrayProps<Coordinate3d>;

class ShapeInputComponent extends React.Component<Props> {

  renderLineLength = () => {
    const points = this.props.fields.getAll() || [];
    let distance = 0;
    for (let i = 1; i < points.length; i += 1) {
      try {
        distance += computeDistanceBetween(points[i - 1], points[i]);
      } catch (e) {}
    }
    return (
      <div style={styles.lengthBlock}>
        <strong>Distance:</strong> {`${distance.toFixed(3)} km`}
      </div>
    );
  };

  onAdd = (value: Coordinate3d) => {
    this.props.fields.push(value);
  };

  onSwap = () => {
    const { fields } = this.props;
    const len = fields.length;
    const half = Math.floor(len / 2);
    for (let i = 0; i < half; i++) {
      fields.swap(i, len - 1 - i);
    }
  };

  render() {
    const { fields } = this.props;
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          {this.renderLineLength()}
          <IconButton
            disabled={fields.length < 2}
            iconClassName="material-icons"
            onClick={this.onSwap}
            tooltip="Swap put-in and take-out"
          >
            swap_calls
          </IconButton>
        </div>
        <Divider style={styles.divider} />
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
