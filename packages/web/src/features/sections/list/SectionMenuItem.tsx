import { ListItemIcon, Typography } from '@material-ui/core';
import Icon from '@material-ui/core/Icon';
import MenuItem from '@material-ui/core/MenuItem';
import React from 'react';
import { useHistory } from 'react-router-dom';

interface Props {
  icon?: string;
  label: string;
  to?: string;
  onClick?: (e: React.MouseEvent<any>) => void;
}

const SectionMenuItem = React.forwardRef(
  ({ icon, label, to, onClick }: Props, ref: any) => {
    const { push } = useHistory();
    const handleClick = (e: React.MouseEvent<any>) => {
      e.stopPropagation();
      if (to) {
        push(to);
      } else if (onClick) {
        onClick(e);
      }
    };
    return (
      <MenuItem onClick={handleClick} ref={ref}>
        {icon && (
          <ListItemIcon>
            <Icon>{icon}</Icon>
          </ListItemIcon>
        )}
        <Typography variant="inherit">{label}</Typography>
      </MenuItem>
    );
  },
);

SectionMenuItem.displayName = 'SectionMenuItem';

export default SectionMenuItem;
