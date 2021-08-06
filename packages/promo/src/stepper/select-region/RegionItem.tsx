import MenuItem from '@material-ui/core/MenuItem';
import { NamedNode } from '@whitewater-guide/schema';
import React from 'react';

interface Props {
  highlightedIndex: number | null;
  index: number;
  itemProps: any;
  selectedItem: NamedNode | null;
  region: NamedNode;
}

const RegionItem: React.FC<Props> = ({
  region,
  index,
  itemProps,
  highlightedIndex,
  selectedItem,
}) => {
  const isHighlighted = highlightedIndex === index;
  const isSelected = selectedItem && selectedItem.id === region.id;

  return (
    <MenuItem
      {...itemProps}
      selected={isHighlighted}
      component="div"
      style={{
        fontWeight: isSelected ? 500 : 400,
      }}
    >
      {region.name}
    </MenuItem>
  );
};

export default RegionItem;
