import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import clipboard from 'clipboard-copy';
import React, { useCallback } from 'react';

interface Props {
  text?: string;
}

export const Clipboard: React.FC<Props> = ({ text }) => {
  const onClick = useCallback(() => {
    if (text) {
      clipboard(text).catch(() => {});
    }
  }, [text]);
  return (
    <IconButton onClick={onClick} color="secondary">
      <Icon>file_copy</Icon>
    </IconButton>
  );
};
