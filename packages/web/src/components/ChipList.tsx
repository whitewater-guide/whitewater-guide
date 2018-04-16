import intersectionBy from 'lodash/intersectionBy';
import MUIChipInput from 'material-ui-chip-input';
import React from 'react';
import { findDOMNode } from 'react-dom';
import EventListener, { withOptions } from 'react-event-listener';
import { NamedNode } from '../ww-commons';

const MAX_HEIGHT = 250;

const styles = {
  menu: {
    maxHeight: MAX_HEIGHT,
  },
};

export interface ChipListProps {
  options: NamedNode[];
  values: NamedNode[];
  onRequestAdd: (value: NamedNode) => void;
  onRequestDelete: (id: string) => void;
  title: string;
  errorText?: string;
}

interface Origin {
  horizontal: 'left' | 'right';
  vertical: 'top' | 'bottom';
}

interface State {
  direction: {
    anchorOrigin: Origin;
    targetOrigin: Origin;
  };
  open: boolean;
}

const DATA_SOURCE_CONFIG = { text: 'name', value: 'id' };

export class ChipList extends React.PureComponent<ChipListProps, State> {

  state: State = {
    direction: {
      anchorOrigin: { horizontal: 'left', vertical: 'bottom' },
      targetOrigin: { horizontal: 'left', vertical: 'top' },
    },
    open: false,
  };

  self: ChipList;

  onMount = (node: ChipList) => {
    if (node) {
      this.self = node;
      this.updateDirection();
    }
  };

  updateDirection = () => {
    const node = findDOMNode(this.self);
    if (!node) {
      return;
    }
    const rect = (node as Element).getBoundingClientRect();
    const bottom = window.innerHeight - rect.bottom;
    this.setState({
      direction: {
        anchorOrigin: { horizontal: 'left', vertical: bottom < MAX_HEIGHT ? 'top' : 'bottom' },
        targetOrigin: { horizontal: 'left', vertical: bottom < MAX_HEIGHT ? 'bottom' : 'top' },
      },
    });
  };

  onRequestAdd = (chip: NamedNode) => {
    const { options, onRequestAdd } = this.props;
    const fullNode = options.find(o => o.id === chip.id);
    onRequestAdd(fullNode!);
  };

  render() {
    const { values, options, onRequestDelete, errorText } = this.props;
    const value = intersectionBy(options, values, 'id');
    return (
      <div>
        <EventListener
          target="document"
          onScroll={withOptions(this.updateDirection, { passive: true, capture: true })}
          onResize={this.updateDirection}
        />
        <MUIChipInput
          ref={this.onMount}
          fullWidth
          openOnFocus
          value={value}
          dataSource={options}
          dataSourceConfig={DATA_SOURCE_CONFIG}
          errorText={errorText}
          onRequestAdd={this.onRequestAdd}
          onRequestDelete={onRequestDelete}
          floatingLabelText={this.props.title}
          hintText={this.props.title}
          menuStyle={styles.menu}
          {...this.state.direction}
        />
      </div>
    );
  }
}
