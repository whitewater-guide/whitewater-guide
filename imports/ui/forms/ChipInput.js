import React, { Component, PropTypes } from 'react';
import MUIChipInput from 'material-ui-chip-input';
import Chip from 'material-ui/Chip';
import {blue300} from 'material-ui/styles/colors';
import _ from 'lodash';

class ChipInput extends Component {
  static propTypes = {
    name: PropTypes.string,
    title: PropTypes.string,
    options: PropTypes.array,
    field: PropTypes.shape({
      value: PropTypes.array,
      error: PropTypes.string,
      onChange: PropTypes.func,
    }),
    dataSourceConfig: PropTypes.object,
  };

  static defaultProps = {
    options: [],
    dataSourceConfig: {text: 'name', value: '_id'},
  };

  render() {
    const {field, options, dataSourceConfig} = this.props;
    //Value is array of strings, but must be array of objects from options
    let value = field.value === undefined ? [] : field.value;
    value = _.map(value, (chipValue) => {
      return _.find(options, {[dataSourceConfig.value]: chipValue});
    });
    value = _.compact(value);
    return (
      <MUIChipInput
        fullWidth={true}
        openOnFocus={true}
        value={value}
        dataSource={options}
        dataSourceConfig={dataSourceConfig}
        errorText={this.props.field.error}
        onRequestAdd={this.onRequestAdd}
        onRequestDelete={this.onRequestDelete}
        floatingLabelText={this.props.title}
        hintText={this.props.title}
      />
    );
  }

  onRequestAdd = (chip) => {
    let value = this.props.field.value || [];
    // console.log('On chip add', value, chip);
    const chipValue = chip[this.props.dataSourceConfig.value];
    if (chipValue)
      value = [...value, chipValue];
    this.props.field.onChange(value);
  };

  onRequestDelete = (chip) => {
    const {field: {value}} = this.props;
    // console.log('On chip delete', value, chip);
    this.props.field.onChange(
      _.filter(value, (item) => item !== chip)
    );
  };

}

export default ChipInput;