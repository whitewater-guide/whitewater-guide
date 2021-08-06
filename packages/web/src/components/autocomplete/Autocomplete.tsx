import { NamedNode } from '@whitewater-guide/schema';
import Downshift, { ControllerStateAndHelpers } from 'downshift';
import React from 'react';

import AutocompleteAdornment from './AutocompleteAdornment';
import AutocompleteInput from './AutocompleteInput';
import AutocompleteMenu from './AutocompleteMenu';
import AutocompleteMenuItem from './AutocompleteMenuItem';
import filterOptions from './filterOptions';
import itemToString from './itemToString';
import { AutocompleteProps } from './types';

export class Autocomplete<
  T extends NamedNode = NamedNode,
> extends React.PureComponent<AutocompleteProps<T>, { inputValue: string }> {
  private readonly _input = React.createRef<HTMLDivElement>();

  constructor(props: AutocompleteProps<T>) {
    super(props);
    this.state = {
      inputValue: itemToString(props.value) || props.inputValue || '',
    };
  }

  // enables controlled and uncontrolled input
  getInputValue = (state: { inputValue: string | null }) =>
    this.props.onInputValueChange
      ? this.props.inputValue || ''
      : state.inputValue;

  // enables controlled and uncontrolled input
  setInputValue = (inputValue: string) => {
    if (this.props.onInputValueChange) {
      this.props.onInputValueChange(inputValue);
    } else {
      this.setState({ inputValue });
    }
  };

  onChange = (selectedItem: T | null) => {
    // this method exists only to stop react from complaining
    // about second argument being passed to useState hook's setter
    this.props.onChange(selectedItem);
  };

  render() {
    const {
      label,
      placeholder,
      options,
      allowNull,
      filterOptions: filterOpts,
      menuProps,
      value,
      className,
    } = this.props;

    return (
      <Downshift
        selectedItem={value}
        onChange={this.onChange}
        itemToString={itemToString}
        inputValue={this.getInputValue(this.state)}
        onInputValueChange={this.setInputValue}
      >
        {({
          getInputProps,
          getItemProps,
          getLabelProps,
          highlightedIndex,
          inputValue,
          openMenu,
          closeMenu,
          clearSelection,
          isOpen,
        }: ControllerStateAndHelpers<NamedNode>) => {
          const { onBlur, onFocus, ...inputProps } = getInputProps({
            placeholder,
          });
          return (
            <div className={className}>
              <AutocompleteInput
                ref={this._input}
                label={label}
                fullWidth
                InputProps={{
                  onBlur,
                  onFocus,
                  endAdornment: (
                    <AutocompleteAdornment
                      value={value}
                      allowNull={allowNull}
                      isOpen={isOpen}
                      clearSelection={clearSelection}
                      openMenu={openMenu}
                      closeMenu={closeMenu}
                    />
                  ),
                }}
                InputLabelProps={getLabelProps({ shrink: true } as any)}
                {...(inputProps as any)}
              />

              <AutocompleteMenu
                isOpen={isOpen}
                anchorEl={this._input.current}
                {...menuProps}
              >
                {filterOptions(options, inputValue, filterOpts).map(
                  (item, index) => (
                    <AutocompleteMenuItem
                      key={item.id}
                      option={item}
                      optionToString={this.props.optionToString}
                      index={index}
                      highlightedIndex={highlightedIndex}
                      selectedItem={value}
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
