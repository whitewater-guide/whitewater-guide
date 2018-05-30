import React from 'react';
import { Column, TableCellRenderer } from 'react-virtualized';
import { ClickBlocker, DeleteButton, IconLink } from '../../../components';
import { EditorColumn } from '../../../components/tables';
import { ResourcesList } from '../../../layout';
import { paths } from '../../../utils';
import AddSectionButton from './AddSectionButton';
import { RiversListProps } from './types';

const styles = {
  actions: {
    display: 'flex',
    alignItems: 'center',
  },
};

export default class RiversList extends React.PureComponent<RiversListProps> {
  onAdd = (href: string) => this.props.history.push(href);

  renderAltNames: TableCellRenderer = ({ rowData: { altNames } }) =>
    altNames ? altNames.join(', ') : '';

  renderNumSections: TableCellRenderer = ({ rowData: { sections: { count } } }) =>
    count;

  renderActions: TableCellRenderer = ({ rowData: { id: riverId } }) => {
    const { match: { params: { regionId } } } = this.props;
    const href = paths.to({ regionId, sectionId: 'new' }) + `?riverId=${riverId}`;
    return (
      <ClickBlocker style={styles.actions}>
        <IconLink to={paths.settings({ regionId, riverId })} icon="edit" />
        <DeleteButton id={riverId} deleteHandler={this.props.removeRiver} />
        <AddSectionButton onAdd={this.onAdd} href={href} />
      </ClickBlocker>
    );
  };

  render() {
    return (
      <ResourcesList list={this.props.rivers.nodes}>
        <Column width={200} flexGrow={1} label="Name" dataKey="name" />
        <Column
          width={200}
          flexGrow={1}
          label="Alternative names"
          dataKey="altNames"
          cellRenderer={this.renderAltNames}
        />
        <Column width={70} label="# Sections" dataKey="sections" cellRenderer={this.renderNumSections} />
        <EditorColumn width={250} label="Actions" dataKey="actions" cellRenderer={this.renderActions} />
      </ResourcesList>
    );
  }
}
