import { NamedNode } from '@whitewater-guide/commons';
import Downshift from 'downshift';
import React from 'react';
import NamedNodeAutocomplete from './NamedNodeAutocomplete';
import { FinderProps } from './types';

const nodeToString = (node: NamedNode | null) => (node ? node.name : '');

interface Props<QResult, QVars> extends FinderProps<QResult, QVars> {
  value: NamedNode | null;
  onChange: (value: NamedNode | null) => void;
}

export class NamedNodeFinder<QResult, QVars> extends React.PureComponent<
  Props<QResult, QVars>
> {
  render() {
    const { value, onChange, ...finderProps } = this.props;
    return (
      <Downshift
        onChange={onChange}
        selectedItem={value}
        itemToString={nodeToString}
      >
        {({
          inputValue,
          selectedItem,
          clearSelection,
          isOpen,
          openMenu,
          closeMenu,
          setState,
          selectItem,
        }) => (
          <div>
            <NamedNodeAutocomplete<QResult, QVars>
              {...finderProps}
              isOpen={isOpen}
              openMenu={openMenu}
              closeMenu={closeMenu}
              inputValue={inputValue}
              selectItem={selectItem}
              clearSelection={clearSelection}
              onUpdateInput={setState}
            />
          </div>
        )}
      </Downshift>
    );
  }
}
