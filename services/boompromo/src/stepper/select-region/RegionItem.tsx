import MenuItem from '@material-ui/core/MenuItem';
import React from 'react';
import { NamedNode } from '@whitewater-guide/commons';

interface Props {
  highlightedIndex: number | null;
  index: number;
  itemProps: object;
  selectedItem: NamedNode | null;
  region: NamedNode;
}

const RegionItem: React.SFC<Props> = ({
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
