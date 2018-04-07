import React from 'react';
import { ChipList } from '../../../../components';
import { Styles } from '../../../../styles';
import { NamedNode } from '../../../../ww-commons';
import { AddGroupProps } from './addRegionToGroup.mutation';
import { RegionGroupsQueryProps } from './regionGroups.query';
import { RemoverGroupProps } from './removeRegionFromGroup.mutation';

const styles: Styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  formBox: {
    flex: 1,
  },
};

type Props = RegionGroupsQueryProps & RemoverGroupProps & AddGroupProps;

export class RegionGroups extends React.PureComponent<Props> {

  onAdd = (group: NamedNode) => this.props.addGroup(group.id);

  onDelete = (groupId: string) => this.props.removeGroup(groupId);

  render() {
    const { regionGroups, allGroups } = this.props;
    return (
      <div style={styles.container}>
        <ChipList
          options={allGroups}
          values={regionGroups}
          onRequestAdd={this.onAdd}
          onRequestDelete={this.onDelete}
          title="Группы"
        />
      </div>
    );
  }
}
