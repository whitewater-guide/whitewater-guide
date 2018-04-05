import FontIcon from 'material-ui/FontIcon';
import React from 'react';
import { Link } from 'react-router-dom';
import { Index, TableCellProps, TableProps as VTableProps } from 'react-virtualized';
import { NamedNode, ResourceType } from '../../ww-commons';
import { DeleteButton } from '../DeleteButton';
import { EditorColumn } from './EditorColumn';
import { RawTable } from './RawTable';

export type TableProps<TResource extends NamedNode> =
  Partial<VTableProps> &
  {
    list: TResource[];
    onResourceClick: (id: string) => void;
    resourceType: ResourceType;
    deleteHandle: (id: string) => void;
    customSettingsLink?: (row: TResource) => string;
    renderExtraAdminActions?: (row: TResource) => React.ReactElement<any>;
    adminColumnWidth?: number;
    adminColumnGrow?: number;
  };

export class Table<DeleteHandle extends string, TResource extends NamedNode>
  extends React.PureComponent<TableProps<TResource>> {

  rowGetter = ({ index }: Index) => this.props.list[index];

  onRowClick = ({ index }: Index) => this.props.onResourceClick(this.props.list[index].id);

  stopPropagation = (event: React.SyntheticEvent<any>) => event.stopPropagation();

  renderEditorActions = (props: TableCellProps) => {
    const { customSettingsLink, resourceType, renderExtraAdminActions } = this.props;
    const id = props.rowData.id;
    const settings = customSettingsLink ? customSettingsLink(props.rowData) : `/${resourceType}s/${id}/settings`;
    const extras = renderExtraAdminActions ? renderExtraAdminActions(props.rowData) : undefined;
    return (
      <div onClick={this.stopPropagation} style={{ height: '100%', overflowY: 'hidden' }}>
        <Link to={settings}>
          <FontIcon className="material-icons">mode_edit</FontIcon>
        </Link>
        <DeleteButton id={id} deleteHandler={this.props.deleteHandle} />
        {extras}
      </div>
    );
  };

  render() {
    const { list, children, adminColumnWidth = 100, adminColumnGrow = 0.0, ...props } = this.props;
    return (
      <RawTable
        {...props as any}
        headerHeight={52}
        rowHeight={48}
        rowCount={list.length}
        rowGetter={this.rowGetter}
        onRowClick={this.onRowClick}
      >
        {children}
        <EditorColumn
          width={adminColumnWidth}
          flexGrow={adminColumnGrow}
          label="Actions"
          dataKey="actions"
          cellRenderer={this.renderEditorActions}
        />
      </RawTable>
    );
  }

}
