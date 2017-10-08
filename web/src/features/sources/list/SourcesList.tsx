import * as React from 'react';
import { Column } from 'react-virtualized';
import { WithDeleteMutation } from '../../../apollo';
import { BooleanColumn } from '../../../components';
import { ResourcesList } from '../../../layout';
import { WithSourcesList } from '../../../ww-clients/features/sources';

type Props = WithSourcesList & WithDeleteMutation<'removeSource'>;

export default class SourcesList extends React.PureComponent<Props> {
  onSourceClick = (id: string) => console.log(id);

  render() {
    return (
      <ResourcesList
        list={this.props.sources.list}
        onResourceClick={this.onSourceClick}
        resourceType="source"
        deleteHandle={this.props.removeSource}
      >
        <Column width={200} label="Name" dataKey="name" />
        <Column width={100} label="Harvest mode" dataKey="harvestMode" />
        <BooleanColumn width={50} label="Enabled" dataKey="enabled" iconFalse="remove" iconTrue="checkmark" />
      </ResourcesList>
    );
  }
}
