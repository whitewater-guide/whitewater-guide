import { find, reject } from 'lodash';
import MUIChipInput from 'material-ui-chip-input';
import * as React from 'react';
import { findDOMNode } from 'react-dom';
import EventListener, { withOptions } from 'react-event-listener';
import { NamedResource } from '../ww-commons';
import { FieldProps } from './types';

const MAX_HEIGHT = 250;

const styles = {
  menu: {
    maxHeight: MAX_HEIGHT,
  },
};

interface Props {
  name: string;
  title: string;
  options: NamedResource[];
  field: FieldProps<NamedResource[]>;
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

export class ChipInput extends React.PureComponent<Props, State> {

  state: State = {
    direction: {
      anchorOrigin: { horizontal: 'left', vertical: 'bottom' },
      targetOrigin: { horizontal: 'left', vertical: 'top' },
    },
    open: false,
  };

  self: ChipInput;

  onMount = (node: ChipInput) => {
    if (node) {
      this.self = node;
      this.updateDirection();
    }
  };

  onRequestAdd = (chip: NamedResource) => {
    const value = this.props.field.value || [];
    this.props.field.onChange([...value, chip]);
  };

  onRequestDelete = (id: string) => {
    const { field: { value, onChange } } = this.props;
    // console.log('On chip delete', value, chip);
    onChange(reject(value, { id }));
  };

  updateDirection = () => {
    const rect = findDOMNode(this.self).getBoundingClientRect();
    const bottom = window.innerHeight - rect.bottom;
    this.setState({
      direction: {
        anchorOrigin: { horizontal: 'left', vertical: bottom < MAX_HEIGHT ? 'top' : 'bottom' },
        targetOrigin: { horizontal: 'left', vertical: bottom < MAX_HEIGHT ? 'bottom' : 'top' },
      },
    });
  };

  render() {
    const { field, options } = this.props;
    const value = find(options, { id: field.value.id });
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
          errorText={this.props.field.error}
          onRequestAdd={this.onRequestAdd}
          onRequestDelete={this.onRequestDelete}
          floatingLabelText={this.props.title}
          hintText={this.props.title}
          menuStyle={styles.menu}
          {...this.state.direction}
        />
      </div>
    );
  }
}
