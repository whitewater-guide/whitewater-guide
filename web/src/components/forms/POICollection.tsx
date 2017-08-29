import FlatButton from 'material-ui/FlatButton';
import FontIcon from 'material-ui/FontIcon';
import * as React from 'react';
import { Gateway } from 'react-gateway';
import { BaseFieldArrayProps, FieldArray, GenericFieldArray, WrappedFieldArrayProps } from 'redux-form';
import { Styles } from '../../styles';
import { Coordinate, Point } from '../../ww-commons';
import { PointInput } from './PointInput';

const styles: Styles = {
  container: {
    height: '100%',
  },
  icon: {
    margin: 0,
    padding: 0,
    height: 'auto',
    width: 'auto',
  },
};

export interface POICollectionProps {
  mapDialog?: boolean;
  mapBounds?: Coordinate[];
  addButtonGateway?: string;
}

type Props = POICollectionProps & WrappedFieldArrayProps<Partial<Point>>;

class POICollectionComponent extends React.PureComponent<Props> {
  onAdd = () => {
    const { fields } = this.props;
    fields.push({
      name: '',
      description: '',
      kind: 'other',
    });
  };

  render() {
    const { fields, meta, mapDialog, mapBounds, addButtonGateway = 'footer' } = this.props;
    return (
      <div style={styles.container}>
        {
          fields.map((name, index) => (
            <PointInput key={index} name={name} index={index} mapDialog={mapDialog} mapBounds={mapBounds} />
          ))}
        <Gateway into={addButtonGateway}>
          <FlatButton
            label="Add"
            onClick={this.onAdd}
            icon={<FontIcon className="material-icons" style={styles.icon}>add</FontIcon>}
          />
        </Gateway>
      </div>
    );
  }
}

type FieldArrayProps = BaseFieldArrayProps<POICollectionProps> & POICollectionProps;

export const POICollection: React.StatelessComponent<FieldArrayProps> = props => {
  const CustomField = FieldArray as new () => GenericFieldArray<Partial<Point>, POICollectionProps>;
  return (
    <CustomField {...props} component={POICollectionComponent} />
  );
};
