import { intersectionBy, reject } from 'lodash';
import MUIChipInput from 'material-ui-chip-input';
import * as React from 'react';
import { findDOMNode } from 'react-dom';
import EventListener, { withOptions } from 'react-event-listener';
import { BaseFieldProps, Field, GenericField, WrappedFieldProps } from 'redux-form';
import { NamedResource } from '../../ww-commons';

const MAX_HEIGHT = 250;

const styles = {
  menu: {
    maxHeight: MAX_HEIGHT,
  },
};

interface ChipInputProps {
  options: NamedResource[];
  title: string;
}

type Props = WrappedFieldProps & ChipInputProps;

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

class ChipInputComponent extends React.PureComponent<Props, State> {

  state: State = {
    direction: {
      anchorOrigin: { horizontal: 'left', vertical: 'bottom' },
      targetOrigin: { horizontal: 'left', vertical: 'top' },
    },
    open: false,
  };

  self: ChipInputComponent;

  onMount = (node: ChipInputComponent) => {
    if (node) {
      this.self = node;
      this.updateDirection();
    }
  };

  onRequestAdd = (chip: NamedResource) => {
    const value = this.props.input.value || [];
    this.props.input.onChange([...value, chip]);
  };

  onRequestDelete = (id: string) => {
    const { input: { value, onChange } } = this.props;
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
    const { input, options } = this.props;
    const value = intersectionBy(options, input.value, 'id');
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
          errorText={this.props.meta.error}
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

type FieldProps = BaseFieldProps<ChipInputProps> & ChipInputProps;

export const ChipInput: React.StatelessComponent<FieldProps> = props => {
  const CustomField = Field as new () => GenericField<ChipInputProps>;
  return (
    <CustomField {...props} component={ChipInputComponent} />
  );
};
