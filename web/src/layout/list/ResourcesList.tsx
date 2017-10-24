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
    const { resourceType, list } = this.props;
    return [
      (
        <AutoSizer key="tableBody" rowCount={list ? list.length : 0}>
          {this.table}
        </AutoSizer>
      ),
      <ListAdminFooter key="tableFooter" resourceType={resourceType} />,
    ];
  }
}
