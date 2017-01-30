import React, { Component, PropTypes } from 'react';
import MUIAutoComplete from 'material-ui/AutoComplete';

export const NEW_ITEM = '@@new';

class AutoComplete extends Component {
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
        searchText={this.props.field.value.name}
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
      this.props.field.onChange({_id: NEW_ITEM, name: value});
    }
  };

  onUpdateInput = (input) => {
    this.props.field.onChange({_id: NEW_ITEM, name: input});
  };
}

export default AutoComplete;