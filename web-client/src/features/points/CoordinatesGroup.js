import PropTypes from 'prop-types';
import React, { Component } from 'react';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import { get, isString, isNil, memoize, compact, map } from 'lodash';
import { set } from 'lodash/fp';
import { SelectPointsDialog } from '../../core/forms';
import { TextField } from '../../core/components';
import { POINames } from '../../commons/features/points';

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    minWidth: 360,
  },
  row: {
    display: 'flex',
    alignItems: 'center',
  },
  col: {
    display: 'flex',
    flex: 1,
  },
  textInput: {
    width: '100%',
    minWidth: 100,
  },
  deleted: {
    pointerEvents: 'none',
    opacity: 0.4,
  },
};

export class CoordinatesGroup extends Component {
  static propTypes = {
    title: PropTypes.string,
    detailed: PropTypes.bool,
    field: PropTypes.shape({
      value: PropTypes.any,
      error: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
      onChange: PropTypes.func,
    }),
    mapDialog: PropTypes.bool,
    mapButtonHandler: PropTypes.func,
    mapBounds: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)),
  };

  static defaultProps = {
    detailed: false,
    mapDialog: true,
  };

  constructor(props) {
    super(props);
    this.state = {
      dialogOpen: false,
    };
  }

  onChange = memoize(attribute => (e, value) => {
    const fieldValue = this.props.field.value;
    const newFieldValue = set(attribute, value, fieldValue);
    const emptyInput = v => isNil(v) || v === '';
    if (
      !this.props.detailed &&
      emptyInput(get(newFieldValue, 'coordinates.0')) &&
      emptyInput(get(newFieldValue, 'coordinates.1')) &&
      emptyInput(get(newFieldValue, 'coordinates.2'))
    ) {
      this.props.field.onChange(undefined);
    } else {
      this.props.field.onChange(newFieldValue);
    }
  });

  onKindChange = (e, i, kind) => this.onChange('kind')(e, kind);

  onDelete = () => {
    const value = this.props.field.value;
    this.props.field.onChange({ ...value, deleted: !value.deleted });
  };

  onCloseDialog = () => this.setState({ dialogOpen: false });

  onSubmitDialog = ([coordinates]) => {
    this.setState({ dialogOpen: false });
    this.onChange('coordinates')(null, coordinates);
  };

  mapButtonHandler = () => {
    if (this.props.mapButtonHandler) {
      this.props.mapButtonHandler();
    } else {
      this.setState({ dialogOpen: true });
    }
  };

  renderPointKind = (label, item) => <MenuItem key={item} value={item} primaryText={label} />;

  render() {
    const value = get(this, 'props.field.value', {});
    let errorString = '';// Global field error (for example, coordinate field is required), not rendered for now
    let errors = {};
    if (isString(this.props.field.error)) {
      errorString = this.props.field.error;
    } else {
      errors = this.props.field.error;
    }
    const dialogPoints = compact([get(value, 'coordinates')]);
    const delStyle = value.deleted ? { ...styles.deleted } : {};
    return (
      <div style={styles.container}>
        {this.props.title && <h3>{this.props.title}</h3>}
        { this.props.detailed &&
        <div style={styles.row}>
          <div style={{ ...styles.row, flex: 1, ...delStyle }}>
            <TextField
              fullWidth
              errorText={get(errors, 'name')}
              value={get(value, 'name', '')}
              onChange={this.onChange('name')}
              hintText="Name"
              floatingLabelText="Name"
            />
            <SelectField
              value={get(value, 'kind')}
              onChange={this.onKindChange}
              errorText={get(errors, 'kind')}
              floatingLabelText="Type"
            >
              {map(POINames, this.renderPointKind)}
            </SelectField>
          </div>
          <IconButton iconClassName="material-icons" onTouchTap={this.onDelete}>
            {value.deleted ? 'undo' : 'clear'}
          </IconButton>
        </div>
        }
        { this.props.detailed &&
        <div style={{ ...styles.row, flex: 1, ...delStyle }}>
          <TextField
            fullWidth
            multiLine
            errorText={get(errors, 'description')}
            value={get(value, 'description', '')}
            onChange={this.onChange('description')}
            hintText="Description"
            floatingLabelText="Description"
          />
        </div>
        }

        <div style={{ ...styles.row, flex: 1, ...delStyle }}>
          <div style={styles.col}>
            <TextField
              style={styles.textInput}
              type="number"
              errorText={get(errors, 'coordinates.1')}
              value={get(value, 'coordinates.1', '')}
              onChange={this.onChange('coordinates.1')}
              hintText="Latitude"
              floatingLabelText="Latitude"
            />
          </div>
          <div style={styles.col}>
            <TextField
              style={styles.textInput}
              type="number"
              errorText={get(errors, 'coordinates.0')}
              value={get(value, 'coordinates.0', '')}
              onChange={this.onChange('coordinates.0')}
              hintText="Longitude"
              floatingLabelText="Longitude"
            />
          </div>
          <div style={styles.col}>
            <TextField
              style={styles.textInput}
              type="number"
              errorText={get(errors, 'coordinates.2')}
              value={get(value, 'coordinates.2', '')}
              onChange={this.onChange('coordinates.2')}
              hintText="Altitude"
              floatingLabelText="Altitude"
            />
          </div>
          <div>
            {
              this.props.mapDialog &&
              <IconButton iconClassName="material-icons" onTouchTap={this.mapButtonHandler}>
                add_location
              </IconButton>
            }
            {
              this.state.dialogOpen &&
              <SelectPointsDialog
                drawingMode="Point"
                bounds={this.props.mapBounds}
                onClose={this.onCloseDialog}
                onSubmit={this.onSubmitDialog}
                points={dialogPoints}
              />
            }
          </div>
        </div>
      </div>
    );
  }

}
