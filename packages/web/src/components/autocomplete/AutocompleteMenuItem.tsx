import MenuItem from '@material-ui/core/MenuItem';
import { NamedNode } from '@whitewater-guide/schema';
import React from 'react';

const defaultOptionToString = ({ name }: NamedNode) => name;

interface Props {
  option: NamedNode;
  index?: number;
  highlightedIndex: number | null;
  selectedItem: NamedNode | null;
  itemProps?: any;
  optionToString?: (option: NamedNode) => React.ReactElement;
}

const AutocompleteMenuItem: React.FC<Props> = (props) => {
  const {
    option,
    optionToString = defaultOptionToString,
    index,
    itemProps,
    highlightedIndex,
    selectedItem,
  } = props;
  const isHighlighted = highlightedIndex === index;
  const isSelected = selectedItem && selectedItem.id === option.id;

  return (
    <MenuItem
      {...itemProps}
      selected={isHighlighted}
      component="div"
      style={{
        fontWeight: isSelected ? 500 : 400,
      }}
    >
      {optionToString(option)}
    </MenuItem>
  );
};

AutocompleteMenuItem.displayName = 'AutocompleteMenuItem';

export default AutocompleteMenuItem;
