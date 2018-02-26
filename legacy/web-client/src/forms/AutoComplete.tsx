import { get } from 'lodash';
import MUIAutoComplete from 'material-ui/AutoComplete';
import * as React from 'react';
import { NamedNode } from '../ww-commons';
import { FieldProps } from './types';

const DATA_SOURCE_CONFIG = { text: 'name', value: 'id' };

interface Props {
  name: string;
  title: string;
  disabled?: boolean;
  dataSource: any[];
  field: FieldProps<NamedNode>;
  openOnFocus: boolean;
}

type AutoCompleteStatic = React.PureComponent<Props> & { NEW_ITEM: string };

export class AutoComplete extends AutoCompleteStatic {

  onChange = (event: any, index: any, value: any) => {
    this.props.field.onChange(value);
  };

  onNewRequest = (value: any, index: number) => {
    if (index >= 0) {
      const item = this.props.dataSource[index];
      this.props.field.onChange({ id: item.id, name: item.name });
    } else {
      this.props.field.onChange({ id: AutoComplete.NEW_ITEM, name: value });
    }
  };

  onUpdateInput = (input: string) => {
    this.props.field.onChange({ id: AutoComplete.NEW_ITEM, name: input });
  };

  render() {
    return (
      <MUIAutoComplete
        fullWidth
        dataSource={this.props.dataSource}
        dataSourceConfig={DATA_SOURCE_CONFIG}
        disabled={this.props.disabled}
        errorText={this.props.field.error}
        floatingLabelText={this.props.title}
        hintText={this.props.title}
        searchText={get(this.props, 'field.value.name', '')}
        onNewRequest={this.onNewRequest}
        onUpdateInput={this.onUpdateInput}
        openOnFocus={this.props.openOnFocus}
        filter={MUIAutoComplete.caseInsensitiveFilter}
      />
    );
  }
}

AutoComplete.NEW_ITEM = '@@new';
