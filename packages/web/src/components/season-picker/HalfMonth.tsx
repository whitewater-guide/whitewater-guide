import ButtonBase from '@material-ui/core/ButtonBase';
import Icon from '@material-ui/core/Icon';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import React, { useCallback } from 'react';

interface Props {
  index: number;
  value: number[];
  onToggle: (index: number) => void;
}

const useStyles = makeStyles(({ palette }: Theme) =>
  createStyles({
    root: ({ index, value }: Props) => {
      const selected = value.includes(index);
      const isLast = index === 23;
      const border = `1px solid ${palette.grey[400]}`;
      return {
        display: 'flex',
        boxSizing: 'border-box',
        flex: 1,
        flexShrink: 0,
        alignItems: 'center',
        justifyContent: 'center',
        height: 48,
        overflow: 'hidden',
        backgroundColor: selected ? palette.primary.main : undefined,
        borderBottom: border,
        borderLeft: border,
        borderRight: isLast ? border : undefined,
      };
    },
  }),
);

const HalfMonth = React.memo<Props>((props) => {
  const { index, value, onToggle } = props;
  const selected = value.includes(index);
  const classes = useStyles(props);
  const onClick = useCallback(() => onToggle(index), [index, onToggle]);
  return (
    <ButtonBase className={classes.root} onClick={onClick} focusRipple>
      <Icon color="action">
        {selected ? 'check_circle_outline' : 'radio_button_unchecked'}
      </Icon>
    </ButtonBase>
  );
});

HalfMonth.displayName = 'HalfMonth';

export default HalfMonth;
