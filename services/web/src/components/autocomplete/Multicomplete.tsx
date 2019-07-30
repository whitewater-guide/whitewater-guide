import { NamedNode } from '@whitewater-guide/commons';
import Downshift from 'downshift';
import React from 'react';
import AutocompleteInput from './AutocompleteInput';
import AutocompleteMenu from './AutocompleteMenu';
import AutocompleteMenuItem from './AutocompleteMenuItem';
import ChipsAdornment from './ChipsAdornment';
import filterOptions from './filterOptions';
import itemToString from './itemToString';
import { MulticompleteProps } from './types';

interface State {
  inputValue: string;
}

export class Multicomplete<
  T extends NamedNode = NamedNode
> extends React.PureComponent<MulticompleteProps<T>, State> {
  readonly state: State = { inputValue: '' };

  private readonly _input = React.createRef<any>();

  onKeyDown = (event: React.KeyboardEvent) => {
    const { values, onDelete } = this.props;
    const { inputValue } = this.state;
    if (values.length && !inputValue.length && event.key === 'Backspace') {
      onDelete(values[values.length - 1].id);
    }
  };

  handleInputChange = (event: any) => {
    this.setState({ inputValue: event.target.value });
  };

  handleChange = (item: T) => {
    const dupe = this.props.values.find((v) => v.id === item.id);
    if (!dupe) {
      this.props.onAdd(item);
      this.setState({ inputValue: '' });
    }
  };

  render() {
    const {
      label,
      placeholder,
      options,
      values,
      onDelete,
      openOnFocus,
      filterOptions: filterOpts,
      menuProps,
      InputProps: OuterInputProps = {},
      InputLabelProps: OuterInputLabelProps = {},
    } = this.props;
    const { inputValue } = this.state;
    return (
      <Downshift
        inputValue={inputValue}
        onChange={this.handleChange}
        selectedItem={values}
        itemToString={itemToString}
      >
        {({
          getInputProps,
          getItemProps,
          getLabelProps,
          isOpen,
          highlightedIndex,
          openMenu,
        }) => {
          const { onBlur, onChange, onFocus, ...inputProps } = getInputProps({
            onKeyDown: this.onKeyDown,
            placeholder,
            onFocus: openOnFocus ? openMenu : undefined,
          });
          return (
            <div>
              <AutocompleteInput
                ref={this._input}
                fullWidth={true}
                label={label}
                InputProps={{
                  ...OuterInputProps,
                  startAdornment: (
                    <ChipsAdornment values={values} onDelete={onDelete} />
                  ),
                  onBlur: (event: any) => {
                    if (onBlur) {
                      onBlur(event);
                    }
                    if (OuterInputProps.onBlur) {
                      OuterInputProps.onBlur(event);
                    }
                  },
                  onFocus: (event: any) => {
                    if (onFocus) {
                      onFocus(event);
                    }
                    if (OuterInputProps.onFocus) {
                      OuterInputProps.onFocus(event);
                    }
                  },
                  onChange: (event) => {
                    this.handleInputChange(event);
                    onChange!(event as any);
                  },
                }}
                InputLabelProps={getLabelProps(OuterInputLabelProps)}
                {...(inputProps as any)}
              />
              <AutocompleteMenu
                isOpen={isOpen}
                anchorEl={this._input.current}
                matchInputWidth={true}
                {...menuProps}
              >
                {filterOptions(options, inputValue, filterOpts).map(
                  (item, index) => (
                    <AutocompleteMenuItem
                      key={item.id}
                      option={item}
                      index={index}
                      highlightedIndex={highlightedIndex}
                      selectedItem={null}
                      itemProps={getItemProps({ item })}
                    />
                  ),
                )}
              </AutocompleteMenu>
            </div>
          );
        }}
      </Downshift>
    );
  }
}
