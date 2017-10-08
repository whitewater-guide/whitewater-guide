import * as React from 'react';
import { Column } from 'react-virtualized';
import { BooleanColumn, Table, TableProps } from '../../../components';
import { Region } from '../../../ww-commons/features/regions';

export type RegionsTableProps = TableProps<'removeRegion', Region>;

class RegionsTable extends React.PureComponent<RegionsTableProps> {

  render() {
    return (
      <Table
        {...this.props}
        entityName="region"
        deleteHandle="removeRegion"
      >
        <Column width={200} label="Name" dataKey="name" />
        <Column width={100} label="Rivers" dataKey="riversCount" />
        <Column width={100} label="Sections" dataKey="sectionsCount" />
        <BooleanColumn width={50} label="Visible" dataKey="hidden" iconFalse="visibility" />
      </Table>
    );
  }

}

export default RegionsTable;
