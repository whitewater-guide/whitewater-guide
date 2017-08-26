import Paper from 'material-ui/Paper';
import * as React from 'react';
import { AutoSizer, Dimensions, Index } from 'react-virtualized';
import { Content } from '../../../layout';
import { WithRegionsList } from '../../../ww-clients/features/regions';
import RegionsTable from './RegionsTable';

export class RegionsList extends React.PureComponent<WithRegionsList> {
  isRowLoaded = ({ index }: Index) => !!this.props.regions.list[index];

  onRegionClick = (id: string) => console.log(id);

  table = ({ width, height }: Dimensions) => {
    const { regions } = this.props;
    const list = regions.list || [];
    return (
      <RegionsTable
        regions={list}
        onRegionClick={this.onRegionClick}
        width={width}
        height={height}
      />
    );
  };

  render() {
    const list = this.props.regions.list;
    return (
      <Content>
        <Paper style={{ flex: 1 }}>
          <AutoSizer rowCount={list ? list.length : 0}>
            {this.table}
          </AutoSizer>
        </Paper>
      </Content>
    );
  }
}
