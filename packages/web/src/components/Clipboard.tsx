import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import clipboard from 'clipboard-copy';
import React, { useCallback } from 'react';

interface Clickable {
  onClick: React.MouseEventHandler;
}

interface Props {
  text?: string;
  onCopy?: (e: React.MouseEvent, text: string) => void;
  children?: React.ReactElement<Clickable>;
}

export const Clipboard: React.FC<Props> = ({ text, onCopy, children }) => {
  const onClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (text) {
        clipboard(text).catch(() => {
          // ignore, we cannot do anything about it
        });
        onCopy?.(e, text);
      }
    },
    [text, onCopy],
  );

  return children ? (
    React.cloneElement(React.Children.only(children), { onClick })
  ) : (
    <IconButton onClick={onClick}>
      <Icon>file_copy</Icon>
    </IconButton>
  );
};

Clipboard.displayName = 'Clipboard';
