import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import clipboard from 'clipboard-copy';
import React, { useCallback } from 'react';

interface Clickable {
  onClick: React.MouseEventHandler<any>;
  ref?: any;
}

interface Props {
  text?: string;
  onCopy?: (e: React.MouseEvent<any>, text: string) => void;
  children?: React.ReactElement<Clickable>;
}

export const Clipboard = React.forwardRef(
  ({ text, onCopy, children }: Props, ref: any) => {
    const onClick = useCallback(
      (e: React.MouseEvent<any>) => {
        e.stopPropagation();
        if (text) {
          clipboard(text).catch(() => {});
          onCopy?.(e, text);
        }
      },
      [text, onCopy],
    );

    return children ? (
      React.cloneElement(React.Children.only(children), {
        onClick,
        ref,
      })
    ) : (
      <IconButton onClick={onClick} ref={ref}>
        <Icon>file_copy</Icon>
      </IconButton>
    );
  },
);
