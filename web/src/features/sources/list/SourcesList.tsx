import * as React from 'react';
import { Column, TableCellRenderer } from 'react-virtualized';
import { MutationToggle } from '../../../components';
import { AdminColumn } from '../../../components/tables';
import { ResourcesListCard } from '../../../layout';
import { SourceListProps } from './types';

interface State {
  // Pure virtualized table escape hatch
  // https://github.com/bvaughn/react-virtualized#pure-components
  refresher: number;
}

export default class SourcesList extends React.PureComponent<SourceListProps, State> {
  state: State = { refresher: 0 };

  onSourceClick = (id: string) => this.props.history.push(`/sources/${id}`);

  toggleSource = async (id: string, enabled: boolean) => {
    await this.props.toggleSource(id, enabled);
    this.setState({ refresher: this.state.refresher + 1 });
  };

  renderEnabled: TableCellRenderer = ({ rowData: { id, enabled } }) => (
    <MutationToggle id={id} enabled={enabled} toggle={this.toggleSource} />
  );

  render() {
    return (
      <ResourcesListCard
        list={this.props.sources.nodes}
        onResourceClick={this.onSourceClick}
        resourceType="source"
        deleteHandle={this.props.removeSource}
        refresher={this.state.refresher}
      >
        <Column width={200} label="Name" dataKey="name" />
        <Column width={100} label="Harvest mode" dataKey="harvestMode" />
        <AdminColumn width={70} label="Enabled" dataKey="enabled" cellRenderer={this.renderEnabled} />
      </ResourcesListCard>
    );
  }
}
