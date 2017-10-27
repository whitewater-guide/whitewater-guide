import * as React from 'react';
import { Column } from 'react-virtualized';
import { BooleanColumn } from '../../../components';
import { ResourcesListCard } from '../../../layout';
import { RegionsListProps } from './types';

export class RegionsList extends React.PureComponent<RegionsListProps> {
  onRegionClick = (id: string) => console.log(id);

  render() {
    return (
      <ResourcesListCard
        list={this.props.regions.nodes}
        onResourceClick={this.onRegionClick}
        resourceType="region"
        deleteHandle={this.props.removeRegion}
      >
        <Column width={200} label="Name" dataKey="name" />
        <Column width={100} label="Rivers" dataKey="riversCount" />
        <Column width={100} label="Sections" dataKey="sectionsCount" />
        <BooleanColumn width={50} label="Visible" dataKey="hidden" iconFalse="visibility" />
      </ResourcesListCard>
    );
  }
}
