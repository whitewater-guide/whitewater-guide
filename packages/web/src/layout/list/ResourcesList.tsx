import * as React from 'react';
import { AutoSizer, Dimensions } from 'react-virtualized';
import { Table, TableProps } from '../../components';
import { emitter, POKE_TABLES } from '../../utils';
import { NamedNode } from '../../ww-commons';

export class ResourcesList<DeleteHandle extends string, TResource extends NamedNode> extends
  React.PureComponent<TableProps<TResource>> {

  autosizer: AutoSizer | null = null;

  table = ({ width, height }: Dimensions) => {
    const CustomTable = Table as new () => Table<DeleteHandle, TResource>;
    return (
      <CustomTable
        {...this.props}
        width={width}
        height={height}
      >
        {this.props.children}
      </CustomTable>
    );
  };

  componentDidMount() {
    // There is always one table rendered in UI, so one event is enough
    emitter.on(POKE_TABLES, this.pokeTable);
  }

  componentWillUnmount() {
    emitter.off(POKE_TABLES, this.pokeTable);
  }

  setRef = (ref: AutoSizer | null) => {
    this.autosizer = ref;
  };

  pokeTable = () => {
    if (this.autosizer) {
      this.autosizer.forceUpdate();
    }
  };

  render() {
    const { list } = this.props;
    return(
      <div style={{ width: '100%', height: '100%' }} >
        <AutoSizer rowCount={list ? list.length : 0} ref={this.setRef}>
          {this.table}
        </AutoSizer>
      </div>
    );
  }
}
