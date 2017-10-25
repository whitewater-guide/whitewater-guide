import FontIcon from 'material-ui/FontIcon';
import * as React from 'react';
import { Link } from 'react-router-dom';
import { Index, TableCellProps, TableProps as VTableProps } from 'react-virtualized';
import { NamedNode, ResourceType } from '../../ww-commons';
import { DeleteButton } from '../DeleteButton';
import { AdminColumn } from './AdminColumn';
import { RawTable } from './RawTable';

export type TableProps<TResource extends NamedNode> =
  Partial<VTableProps> &
  {
    list: TResource[];
    onResourceClick: (id: string) => void;
    resourceType: ResourceType;
    deleteHandle: (id: string) => void;
    customSettingsLink?: (row: TResource) => string;
  };

export class Table<DeleteHandle extends string, TResource extends NamedNode>
  extends React.PureComponent<TableProps<TResource>> {

  rowGetter = ({ index }: Index) => this.props.list[index];

  onRowClick = ({ index }: Index) => this.props.onResourceClick(this.props.list[index].id);

  renderAdminActions = (props: TableCellProps) => {
    const { customSettingsLink, resourceType } = this.props;
    const id = props.rowData.id;
    const settings = customSettingsLink ? customSettingsLink(props.rowData) : `/${resourceType}s/${id}/settings`;
    return (
      <span onClick={(event) => event.stopPropagation()}>
        <Link to={settings}>
          <FontIcon className="material-icons">mode_edit</FontIcon>
        </Link>
        <DeleteButton id={id} deleteHandler={this.props.deleteHandle} />
      </span>
    );
  };

  render() {
    const { list, children, ...props } = this.props;
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
        <AdminColumn width={100} label="Actions" dataKey="actions" cellRenderer={this.renderAdminActions} />
      </RawTable>
    );
  }

}
