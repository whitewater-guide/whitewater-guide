import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Column } from 'react-virtualized';
import { WithDeleteMutation } from '../../../apollo';
import { BooleanColumn } from '../../../components';
import { ResourcesListCard } from '../../../layout';
import { WithSourcesList } from '../../../ww-clients/features/sources';

type Props = WithSourcesList & WithDeleteMutation<'removeSource'> & RouteComponentProps<any>;

export default class SourcesList extends React.PureComponent<Props> {
  onSourceClick = (id: string) => this.props.history.push(`/sources/${id}`);

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
        <BooleanColumn width={50} label="Enabled" dataKey="enabled" iconTrue="done" />
      </ResourcesListCard>
    );
  }
}
