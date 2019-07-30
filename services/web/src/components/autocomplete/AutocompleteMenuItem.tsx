import MenuItem from '@material-ui/core/MenuItem';
import { NamedNode } from '@whitewater-guide/commons';
import React from 'react';

interface Props {
  option: NamedNode;
  index?: number;
  highlightedIndex: number | null;
  selectedItem: NamedNode | null;
  itemProps?: any;
}

const AutocompleteMenuItem: React.FC<Props> = (props) => {
  const { option, index, itemProps, highlightedIndex, selectedItem } = props;
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
      {option.name}
    </MenuItem>
  );
};

AutocompleteMenuItem.displayName = 'AutocompleteMenuItem';

export default AutocompleteMenuItem;
