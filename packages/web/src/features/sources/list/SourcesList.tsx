import * as React from 'react';
import { Column, TableCellRenderer } from 'react-virtualized';
import { MutationToggle } from '../../../components';
import { AdminColumn } from '../../../components/tables';
import { ResourcesListCard } from '../../../layout';
import { emitter, POKE_TABLES } from '../../../utils';
import { SourceListProps } from './types';

export default class SourcesList extends React.PureComponent<SourceListProps> {

  onSourceClick = (id: string) => this.props.history.push(`/sources/${id}`);

  toggleSource = async (id: string, enabled: boolean) => {
    await this.props.toggleSource(id, enabled);
    emitter.emit(POKE_TABLES);
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
      >
        <Column width={200} label="Name" dataKey="name" />
        <Column width={100} label="Harvest mode" dataKey="harvestMode" />
        <AdminColumn width={70} label="Enabled" dataKey="enabled" cellRenderer={this.renderEnabled} />
      </ResourcesListCard>
    );
  }
}
