import { upperFirst } from 'lodash';
import { CardMedia } from 'material-ui/Card';
import React from 'react';
import { AutoSizer, Dimensions } from 'react-virtualized';
import { Content, Table, TableProps } from '../../components';
import { EditorLanguagePicker } from '../../components/language';
import { NamedNode } from '../../ww-commons';
import { AdminFooter } from '../AdminFooter';
import { CardHeader } from '../CardHeader';

type OuterProps<TResource extends NamedNode> = TableProps<TResource>;

type InnerProps<TResource extends NamedNode> = OuterProps<TResource>;

export class ResourcesListCard<DeleteHandle extends string, TResource extends NamedNode> extends
  React.PureComponent<InnerProps<TResource>> {

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
    return (
      <Content card>
        <CardHeader title={`${upperFirst(resourceType)}s list`}>
          <EditorLanguagePicker />
        </CardHeader>
        <CardMedia style={{ height: '100%' }} mediaStyle={{ height: '100%' }}>
          <AutoSizer rowCount={list ? list.length : 0}>
            {this.table}
          </AutoSizer>
        </CardMedia>
        <AdminFooter add />
      </Content>
    );
  }
}
