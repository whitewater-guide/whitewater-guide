import * as React from 'react';
import { Column } from 'react-virtualized';
import { WithDeleteMutation } from '../../../apollo';
import { BooleanColumn } from '../../../components';
import { ResourcesList } from '../../../layout';
import { WithRegionsList } from '../../../ww-clients/features/regions';

type Props = WithRegionsList & WithDeleteMutation<'removeRegion'>;

export class RegionsList extends React.PureComponent<Props> {
  onRegionClick = (id: string) => console.log(id);

  render() {
    return (
      <ResourcesList
        list={this.props.regions.list}
        onResourceClick={this.onRegionClick}
        resourceType="region"
        deleteHandle={this.props.removeRegion}
      >
        <Column width={200} label="Name" dataKey="name" />
        <Column width={100} label="Rivers" dataKey="riversCount" />
        <Column width={100} label="Sections" dataKey="sectionsCount" />
        <BooleanColumn width={50} label="Visible" dataKey="hidden" iconFalse="visibility" />
      </ResourcesList>
    );
  }
}
