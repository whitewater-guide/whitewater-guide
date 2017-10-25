import { CardHeader, CardMedia } from 'material-ui/Card';
import * as React from 'react';
import { AutoSizer, Dimensions } from 'react-virtualized';
import { Table, TableProps } from '../../components';
import { NamedNode } from '../../ww-commons';
import ListAdminFooter from './ListAdminFooter';

export class ResourcesList<DeleteHandle extends string, TResource extends NamedNode> extends
  React.PureComponent<TableProps<TResource>> {

  table = ({ width, height }: Dimensions) => {
    const CustomTable = Table as new () => Table<DeleteHandle, TResource>;
    return (
      <CustomTable
        {...this.props}
        width={width}
        height={height}
      >
        {this.props.children}
      </CustomTable>
    );
  };

  render() {
    const { list } = this.props;
    return(
      <div style={{ width: '100%', height: '100%' }} >
        <AutoSizer rowCount={list ? list.length : 0}>
          {this.table}
        </AutoSizer>
      </div>
    );
  }
}
