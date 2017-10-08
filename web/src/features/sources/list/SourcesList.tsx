import { CardHeader, CardMedia } from 'material-ui/Card';
import * as React from 'react';
import { AutoSizer, Dimensions, Index } from 'react-virtualized';
import { WithDeleteMutation } from '../../../apollo';
import { Content } from '../../../layout';
import { WithSourcesList } from '../../../ww-clients/features/sources';
import SourcesListAdminFooter from './SourcesListAdminFooter';
import SourcesTable from './SourcesTable';

type Props = WithSourcesList & WithDeleteMutation<'removeSource'>;

export class SourcesList extends React.PureComponent<Props> {
  isRowLoaded = ({ index }: Index) => !!this.props.sources.list[index];

  onSourceClick = (id: string) => console.log(id);

  table = ({ width, height }: Dimensions) => {
    const { sources, removeSource } = this.props;
    const list = sources.list || [];
    return (
      <SourcesTable
        sources={list}
        onSourceClick={this.onSourceClick}
        removeSource={removeSource}
        width={width}
        height={height}
      />
    );
  };

  render() {
    const list = this.props.sources.list;
    return (
      <Content card>
        <CardHeader title="Sources list" />
        <CardMedia style={{ height: '100%' }} mediaStyle={{ height: '100%' }}>
          <AutoSizer rowCount={list ? list.length : 0}>
            {this.table}
          </AutoSizer>
        </CardMedia>
        <SourcesListAdminFooter />
      </Content>
    );
  }
}
