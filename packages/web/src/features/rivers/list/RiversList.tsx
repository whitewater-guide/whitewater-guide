import FlatButton from 'material-ui/FlatButton';
import FontIcon from 'material-ui/FontIcon';
import React from 'react';
import { Column, TableCellRenderer } from 'react-virtualized';
import { ClickBlocker, DeleteButton, IconLink } from '../../../components';
import { EditorColumn } from '../../../components/tables';
import { ResourcesList } from '../../../layout';
import { paths } from '../../../utils';
import { RiversListProps } from './types';

export default class RiversList extends React.PureComponent<RiversListProps> {

  renderAltNames: TableCellRenderer = ({ rowData: { altNames } }) =>
    altNames ? altNames.join(', ') : '';

  renderNumSections: TableCellRenderer = ({ rowData: { sections: { count } } }) =>
    count;

  renderActions: TableCellRenderer = ({ rowData: { id: riverId } }) => {
    const { history, match: { params: { regionId } } } = this.props;
    const href = history.createHref({
      pathname: paths.to({ regionId, sectionId: 'new' }),
      search: `?riverId=${riverId}`,
    });
    return (
      <ClickBlocker>
        <IconLink to={paths.settings({ regionId, riverId })} icon="edit" />
        <DeleteButton id={riverId} deleteHandler={this.props.removeRiver} />
        <FlatButton
          href={href}
          label="Add Section"
          icon={<FontIcon className="material-icons">add</FontIcon>}
          style={{ verticalAlign: 'sub' }}
        />
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
