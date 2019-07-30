import { createStyles, WithStyles, withStyles } from '@material-ui/core/styles';
import {
  NamedNode,
  Section,
  SectionEditLogEntry,
  sectionName,
} from '@whitewater-guide/commons';
import moment from 'moment';
import React from 'react';
import { Link } from 'react-router-dom';
import { Column, TableCellRenderer, TableProps } from 'react-virtualized';
import { Clipboard, RegionFinder, Table } from '../../components';
import { UserFinder } from '../users';
import { DiffButton } from './DiffButton';

const styles = createStyles({
  input: {
    width: '100%',
  },
});

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
  WithStyles<typeof styles> &
  Omit<TableProps, 'rowGetter' | 'rowCount' | 'rowHeight' | 'headerHeight'>;

class HistoryTable extends React.PureComponent<Props> {
  renderCreatedAt: TableCellRenderer = ({ rowData: { createdAt } }) =>
    moment(createdAt).format('DD MMMM YYYY, HH:mm');

  renderSection: TableCellRenderer = ({ rowData: { section } }) => {
    const { id, region } = section as Section;
    return (
      <Link to={`/regions/${region.id}/sections/${id}#main`}>
        {sectionName(section)}
      </Link>
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
        <Clipboard text={editor.id} />
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
      value={this.props.user}
      onChange={this.props.onUserChange}
      editorsOnly={true}
      allowNull={true}
      className={this.props.classes.input}
    />
  );

  renderRegionHeader = () => (
    <RegionFinder
      className={this.props.classes.input}
      value={this.props.region}
      onChange={this.props.onRegionChange}
      allowNull={true}
    />
  );

  render(): React.ReactNode {
    const { history, registerChild, onRowsRendered } = this.props;
    return (
      <Table ref={registerChild} data={history} onRowsRendered={onRowsRendered}>
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
          className="centered"
          headerClassName="centered"
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

export default withStyles(styles)(HistoryTable);
