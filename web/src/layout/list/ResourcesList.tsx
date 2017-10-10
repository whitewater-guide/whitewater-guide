import { upperFirst } from 'lodash';
import { CardHeader, CardMedia } from 'material-ui/Card';
import * as React from 'react';
import { AutoSizer, Dimensions } from 'react-virtualized';
import { Content, Table, TableProps } from '../../components';
import { NamedResource } from '../../ww-commons';
import ListAdminFooter from './ListAdminFooter';

export class ResourcesList<DeleteHandle extends string, TResource extends NamedResource> extends
  React.PureComponent<TableProps<DeleteHandle, TResource>> {

  table = ({ width, height }: Dimensions) => {
    const CustomTable = Table as new () => Table<DeleteHandle, TResource>;
    const props = this.props as TableProps<DeleteHandle, TResource>;
    return (
      <CustomTable
        {...props}
        width={width}
        height={height}
      >
        {this.props.children}
      </CustomTable>
    );
  };

  render() {
    const { resourceType, list } = this.props as TableProps<DeleteHandle, TResource>;
    return (
      <Content card>
        <CardHeader title={`${upperFirst(resourceType)}s list`} />
        <CardMedia style={{ height: '100%' }} mediaStyle={{ height: '100%' }}>
          <AutoSizer rowCount={list ? list.length : 0}>
            {this.table}
          </AutoSizer>
        </CardMedia>
        <ListAdminFooter resourceType={resourceType} />
      </Content>
    );
  }
}
