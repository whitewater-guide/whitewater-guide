import {
  NamedNode,
  Section,
  SectionEditLogEntry,
} from '@whitewater-guide/commons';
import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';
import moment from 'moment';
import React from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';

import { Link } from 'react-router-dom';
import {
  Column,
  Index,
  Table,
  TableCellRenderer,
  TableProps,
} from 'react-virtualized';
import { RegionFinder } from '../regions';
import { UserFinder } from '../users';
import { DiffButton } from './DiffButton';

interface OwnProps {
  history: SectionEditLogEntry[];
  user: NamedNode | null;
  onUserChange: (user: NamedNode | null) => void;
  region: NamedNode | null;
  onRegionChange: (region: NamedNode | null) => void;
  onDiffOpen: (diff: object | null) => void;
  registerChild: (registeredChild: any) => void;
}

type Props = OwnProps &
  Omit<TableProps, 'rowGetter' | 'rowCount' | 'rowHeight' | 'headerHeight'>;

class HistoryTable extends React.PureComponent<Props> {
  rowGetter = ({ index }: Index) => this.props.history[index];

  renderCreatedAt: TableCellRenderer = ({ rowData: { createdAt } }) =>
    moment(createdAt).format('DD MMMM YYYY, HH:mm');

  renderSection: TableCellRenderer = ({ rowData: { section } }) => {
    const { id, name, river, region } = section as Section;
    return (
      <Link
        to={`/regions/${region.id}/sections/${id}#main`}
      >{`${river.name} -- ${name}`}</Link>
    );
  };

  renderRegion: TableCellRenderer = ({ rowData: { section } }) => {
    const { region } = section as Section;
    return <Link to={`/regions/${region.id}`}>{region.name}</Link>;
  };

  renderEditor: TableCellRenderer = ({ rowData: { editor } }) => {
    return (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <span>{`${editor.name}`}</span>
        <CopyToClipboard text={editor.id}>
          <IconButton>
            <FontIcon className="material-icons">file_copy</FontIcon>
          </IconButton>
        </CopyToClipboard>
      </div>
    );
  };

  renderDiff: TableCellRenderer = ({ rowData: { diff } }) => {
    if (!diff) {
      return null;
    }
    return <DiffButton diff={diff} onDiffOpen={this.props.onDiffOpen} />;
  };

  renderEditorHeader = () => (
    <UserFinder
      user={this.props.user}
      onChange={this.props.onUserChange}
      editorsOnly={true}
      clearSelectionTitle="All editors"
    />
  );

  renderRegionHeader = () => (
    <RegionFinder
      region={this.props.region}
      onChange={this.props.onRegionChange}
      clearSelectionTitle="All regions"
    />
  );

  render(): React.ReactNode {
    const {
      history,
      user,
      onUserChange,
      region,
      onRegionChange,
      onDiffOpen,
      registerChild,
      ...tableProps
    } = this.props;
    return (
      <Table
        {...(tableProps as any)}
        ref={registerChild}
        rowGetter={this.rowGetter}
        rowCount={history.length}
        rowHeight={48}
        headerHeight={52}
      >
        <Column
          width={200}
          label="Date"
          dataKey="createdAt"
          cellRenderer={this.renderCreatedAt}
        />
        <Column
          width={300}
          label="Region"
          dataKey="region"
          cellRenderer={this.renderRegion}
          headerRenderer={this.renderRegionHeader}
        />
        <Column
          width={200}
          flexGrow={1}
          label="Section"
          dataKey="section"
          cellRenderer={this.renderSection}
        />
        <Column width={100} label="Action" dataKey="action" />
        <Column
          width={50}
          label="Diff"
          dataKey="diff"
          cellRenderer={this.renderDiff}
        />
        <Column
          width={300}
          label="Editor"
          dataKey="editor"
          cellRenderer={this.renderEditor}
          headerRenderer={this.renderEditorHeader}
        />
      </Table>
    );
  }
}

export default HistoryTable;
