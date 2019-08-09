import { createStyles, WithStyles, withStyles } from '@material-ui/core/styles';
import { formatDate } from '@whitewater-guide/clients';
import {
  NamedNode,
  SectionEditLogEntry,
  sectionName,
} from '@whitewater-guide/commons';
import parseISO from 'date-fns/parseISO';
import React from 'react';
import { Link } from 'react-router-dom';
import { Column, TableProps } from 'react-virtualized';
import {
  Clipboard,
  isEmptyRow,
  RegionFinder,
  Table,
  TableCellRenderer,
} from '../../components';
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

type TCR = TableCellRenderer<SectionEditLogEntry>;

type Props = OwnProps &
  WithStyles<typeof styles> &
  Omit<TableProps, 'rowGetter' | 'rowCount' | 'rowHeight' | 'headerHeight'>;

class HistoryTable extends React.PureComponent<Props> {
  renderCreatedAt: TCR = ({ rowData }) => {
    if (isEmptyRow(rowData)) {
      return null;
    }
    return formatDate(parseISO(rowData.createdAt), 'dd MMMM yyyy, H:mm');
  };

  renderSection: TCR = ({ rowData }) => {
    if (isEmptyRow(rowData)) {
      return null;
    }
    const { id, region } = rowData.section;
    return (
      <Link to={`/regions/${region.id}/sections/${id}#main`}>
        {sectionName(rowData.section)}
      </Link>
    );
  };

  renderRegion: TCR = ({ rowData }) => {
    if (isEmptyRow(rowData)) {
      return null;
    }
    const { region } = rowData.section;
    return <Link to={`/regions/${region.id}`}>{region.name}</Link>;
  };

  renderEditor: TCR = ({ rowData }) => {
    if (isEmptyRow(rowData)) {
      return null;
    }
    const { editor } = rowData;
    return (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <span>{`${editor.name}`}</span>
        <Clipboard text={editor.id} />
      </div>
    );
  };

  renderDiff: TCR = ({ rowData }) => {
    if (isEmptyRow(rowData)) {
      return null;
    }
    const { diff } = rowData;
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
