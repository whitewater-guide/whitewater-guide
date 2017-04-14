import PropTypes from 'prop-types';
import React, { Component } from 'react';
import MUIAutoComplete from 'material-ui/AutoComplete';
import _ from 'lodash';

export class AutoComplete extends Component {
  static propTypes = {
    name: PropTypes.string,
    title: PropTypes.string,
    disabled: PropTypes.bool,
    dataSource: PropTypes.array.isRequired,
    field: PropTypes.shape({
      value: PropTypes.any,
      error: PropTypes.string,
      onChange: PropTypes.func,
    }),
    openOnFocus: PropTypes.bool,
  };

  static defaultProps = {
    disabled: false,
  };

  render() {
    return (
      <MUIAutoComplete
        fullWidth={true}
        dataSource={this.props.dataSource}
        dataSourceConfig={{text: 'name', value: '_id'}}
        disabled={this.props.disabled}
        errorText={this.props.field.error}
        floatingLabelText={this.props.title}
        hintText={this.props.title}
        searchText={_.get(this.props, 'field.value.name', '')}
        onNewRequest={this.onNewRequest}
        onUpdateInput={this.onUpdateInput}
        openOnFocus={this.props.openOnFocus}
        filter={MUIAutoComplete.caseInsensitiveFilter}
      />
    );
  }

  onChange = (event, index, value) => {
    this.props.field.onChange(value);
  };

  onNewRequest = (value, index) => {
    if (index >= 0){
      const item = this.props.dataSource[index];
      this.props.field.onChange({_id: item._id, name: item.name});
    }
    else {
      this.props.field.onChange({_id: AutoComplete.NEW_ITEM, name: value});
    }
  };

  onUpdateInput = (input) => {
    this.props.field.onChange({_id: AutoComplete.NEW_ITEM, name: input});
  };
}

AutoComplete.NEW_ITEM = '@@new';