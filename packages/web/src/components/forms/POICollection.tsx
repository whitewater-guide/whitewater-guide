import FontIcon from 'material-ui/FontIcon';
import RaisedButton from 'material-ui/RaisedButton';
import React from 'react';
import { BaseFieldArrayProps, FieldArray, GenericFieldArray, WrappedFieldArrayProps } from 'redux-form';
import { Omit } from 'type-zoo';
import { Styles } from '../../styles';
import { Coordinate, Point, PointInput as PointInputType } from '../../ww-commons';
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
  addButton: {
    display: 'flex',
    flexDirection: 'column',
    margin: 4,
    marginTop: 8,
    marginBottom: 8,
    minWidth: 360,
  },
};

export interface POICollectionProps {
  mapDialog?: boolean;
  mapBounds: Coordinate[] | null;
}

type Props = POICollectionProps & WrappedFieldArrayProps<PointInputType>;

class POICollectionComponent extends React.PureComponent<Props> {
  onAdd = () => {
    const { fields } = this.props;
    fields.push({
      id: null,
      name: null,
      description: null,
      kind: 'other',
      coordinates: null,
    });
  };

  render() {
    const { fields, meta, mapDialog, mapBounds } = this.props;
    return (
      <div style={styles.container}>
        {
          fields.map((name, index) => (
            <PointInput
              key={index}
              name={name}
              index={index}
              mapDialog={mapDialog}
              mapBounds={mapBounds}
              fields={fields}
            />
          ))}
            <RaisedButton
              style={styles.addButton}
              fullWidth
              label="Add"
              onClick={this.onAdd}
              icon={<FontIcon className="material-icons" style={styles.icon}>add</FontIcon>}
            />
      </div>
    );
  }
}

type FieldArrayProps = BaseFieldArrayProps<POICollectionProps> & POICollectionProps;

const CustomField = FieldArray as new () => GenericFieldArray<Partial<Point>, POICollectionProps>;

export const POICollection: React.StatelessComponent<Omit<FieldArrayProps, 'component'>> = props => {
  return (
    <CustomField {...props} component={POICollectionComponent as any} />
  );
};
