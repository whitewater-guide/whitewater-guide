import { NamedNode } from '@whitewater-guide/commons';
import memoize from 'lodash/memoize';
import AutoComplete from 'material-ui/AutoComplete';
import MenuItem from 'material-ui/MenuItem';
import React from 'react';
import { Query, QueryResult } from 'react-apollo';
import { FinderProps } from './types';

const DATA_SOURCE_CONFIG = { text: 'name', value: 'id' };

const LOADING_DATA_SOURCE = [
  {
    name: 'Loading',
    id: <MenuItem primaryText="Loading" />,
  },
];

const EMPTY_DATA_SOURCE = [
  {
    name: 'Nothing found',
    id: <MenuItem primaryText="Nothing found" />,
  },
];

interface Props<QResult, QVars> extends FinderProps<QResult, QVars> {
  isOpen: boolean;
  inputValue: string | null;
  onUpdateInput: (v: { inputValue: string }) => void;
  selectItem: (item: NamedNode) => void;
  clearSelection: () => void;
  closeMenu: () => void;
  openMenu: () => void;
}

class NamedNodeAutocomplete<QResult, QVars> extends React.PureComponent<
  Props<QResult, QVars>
> {
  getDataSource = memoize(
    (
      queryOrData: QueryResult<QResult, QVars> | NamedNode[],
      { clearSelectionTitle, getNodes }: Props<QResult, QVars>,
    ) => {
      let dataSource: any[] = [];
      if (Array.isArray(queryOrData)) {
        dataSource = queryOrData;
      } else {
        const { data, loading } = queryOrData;
        if (loading) {
          return LOADING_DATA_SOURCE;
        }
        const nodes = getNodes!(data);
        dataSource = nodes.length ? nodes : EMPTY_DATA_SOURCE;
      }
      if (clearSelectionTitle) {
        return [{ name: clearSelectionTitle, value: null }, ...dataSource];
      }
      return dataSource;
    },
  );

  filterFunction = (searchText: string, key: string) => {
    const { clearSelectionTitle, showListWhenInputIsEmpty } = this.props;
    return (
      (clearSelectionTitle !== undefined && key === clearSelectionTitle) ||
      ((searchText !== '' || !!showListWhenInputIsEmpty) &&
        key.toLowerCase().indexOf(searchText.toLowerCase()) !== -1)
    );
  };

  onNewRequest = (node: NamedNode, index: number) => {
    if (this.props.clearSelectionTitle && index === 0) {
      this.props.clearSelection();
      return;
    }
    if (index >= 0) {
      this.props.selectItem(node);
    }
  };

  onUpdateInput = (inputValue: string) =>
    this.props.onUpdateInput({ inputValue });

  onClose = () => this.props.closeMenu();

  onFocus = () => this.props.openMenu();

  renderAutocomplete = (
    dataSource: QueryResult<QResult, QVars> | NamedNode[],
  ) => {
    const {
      inputValue,
      isOpen,
      hintText = 'Select item',
      fullWidth,
    } = this.props;
    return (
      <AutoComplete
        hintText={hintText}
        searchText={inputValue || ''}
        filter={this.filterFunction}
        onUpdateInput={this.onUpdateInput}
        onNewRequest={this.onNewRequest}
        dataSourceConfig={DATA_SOURCE_CONFIG}
        dataSource={this.getDataSource(dataSource, this.props)}
        open={isOpen}
        onClose={this.onClose}
        onFocus={this.onFocus}
        fullWidth={fullWidth}
        listStyle={{ maxHeight: 300, overflow: 'auto' }}
      />
    );
  };

  render() {
    const {
      query,
      dataSource,
      getVariables,
      getNodes,
      inputValue,
    } = this.props;
    if (dataSource) {
      return this.renderAutocomplete(dataSource);
    }
    if (query && getVariables && getNodes) {
      const variables = getVariables(inputValue);
      return (
        <Query query={query} variables={variables}>
          {this.renderAutocomplete as any}
        </Query>
      );
    }
    throw new Error(
      'Either (query + getVariables + getNodes) or dataSource must be provided',
    );
  }
}

export default NamedNodeAutocomplete;
