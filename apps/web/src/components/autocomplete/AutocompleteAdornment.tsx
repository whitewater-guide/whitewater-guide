import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import type { NamedNode } from '@whitewater-guide/schema';
import React from 'react';

interface Props {
  value: NamedNode | null;
  allowNull?: boolean;
  isOpen: boolean;
  clearSelection: () => void;
  openMenu: () => void;
  closeMenu: () => void;
}

const AutocompleteAdornment: React.FC<Props> = ({
  value,
  allowNull,
  isOpen,
  clearSelection,
  openMenu,
  closeMenu,
}) => {
  const icon = isOpen
    ? 'arrow_drop_up'
    : allowNull && value
    ? 'clear'
    : 'arrow_drop_down';
  const onClick = isOpen
    ? closeMenu
    : allowNull && value
    ? clearSelection
    : openMenu;

  return (
    <InputAdornment position="end">
      <IconButton
        disableFocusRipple
        disableRipple
        disableTouchRipple
        size="small"
        edge="end"
        onClick={onClick}
      >
        <Icon>{icon}</Icon>
      </IconButton>
    </InputAdornment>
  );
};

AutocompleteAdornment.displayName = 'AutocompleteAdornment';

export default AutocompleteAdornment;
