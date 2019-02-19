import FlatButton from 'material-ui/FlatButton';
import React from 'react';
import { Column, TableCellRenderer } from 'react-virtualized';
import { ClickBlocker, DeleteButton, IconLink } from '../../../components';
import { EditorColumn } from '../../../components/tables';
import { ResourcesList } from '../../../layout';
import { paths } from '../../../utils';
import AddSectionButton from './AddSectionButton';
import ChangeRegionDialog from './ChangeRegionDialog';
import { RiversListProps } from './types';

const styles = {
  actions: {
    display: 'flex',
    alignItems: 'center',
  },
};

interface State {
  changeRegionDialogOpen: boolean;
  changeRegionDialogRiverId: string | null;
}

export default class RiversList extends React.PureComponent<
  RiversListProps,
  State
> {
  state: State = {
    changeRegionDialogOpen: false,
    changeRegionDialogRiverId: null,
  };

  onAdd = (href: string) => this.props.history.push(href);

  handleClose = () =>
    this.setState({
      changeRegionDialogOpen: false,
      changeRegionDialogRiverId: null,
    });

  handleOpen = (riverId: string) =>
    this.setState({
      changeRegionDialogOpen: true,
      changeRegionDialogRiverId: riverId,
    });

  renderAltNames: TableCellRenderer = ({ rowData: { altNames } }) =>
    altNames ? altNames.join(', ') : '';

  renderNumSections: TableCellRenderer = ({
    rowData: {
      sections: { count },
    },
  }) => count;

  renderActions: TableCellRenderer = ({ rowData: { id: riverId } }) => {
    const {
      match: {
        params: { regionId },
      },
    } = this.props;
    const href =
      paths.to({ regionId, sectionId: 'new' }) + `?riverId=${riverId}`;
    return (
      <ClickBlocker style={styles.actions}>
        <IconLink to={paths.settings({ regionId, riverId })} icon="edit" />
        <DeleteButton id={riverId} deleteHandler={this.props.removeRiver} />
        <AddSectionButton onAdd={this.onAdd} href={href} />
        <FlatButton
          key="open"
          label="change region"
          onClick={() => this.handleOpen(riverId)}
        />
      </ClickBlocker>
    );
  };

  render() {
    return (
      <div style={{ width: '100%', height: '100%' }}>
        <ChangeRegionDialog
          riverId={this.state.changeRegionDialogRiverId}
          dialogOpen={this.state.changeRegionDialogOpen}
          handleCancel={this.handleClose}
        />
        <ResourcesList list={this.props.rivers.nodes}>
          <Column width={200} flexGrow={1} label="Name" dataKey="name" />
          <Column
            width={200}
            flexGrow={1}
            label="Alternative names"
            dataKey="altNames"
            cellRenderer={this.renderAltNames}
          />
          <Column
            width={70}
            label="# Sections"
            dataKey="sections"
            cellRenderer={this.renderNumSections}
          />
          <EditorColumn
            width={400}
            label="Actions"
            dataKey="actions"
            cellRenderer={this.renderActions}
          />
        </ResourcesList>
      </div>
    );
  }
}
