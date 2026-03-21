import Chip from '@material-ui/core/Chip';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import type { NamedNode } from '@whitewater-guide/schema';
import React, { useCallback } from 'react';

const useStyles = makeStyles((theme) =>
  createStyles({
    chip: {
      margin: theme.spacing(0.5, 0.25),
    },
  }),
);

interface Props {
  values: NamedNode[];
  onDelete: (id: string) => void;
}

const ChipsAdornment: React.FC<Props> = ({ values, onDelete }) => {
  const classes = useStyles();
  const handleDelete = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (e: any) => {
      onDelete(e.target.closest('.MuiChip-root ').id);
    },
    [onDelete],
  );
  return (
    <>
      {(values || []).map((item) => (
        <Chip
          id={item.id}
          key={item.id}
          tabIndex={-1}
          label={item.name}
          className={classes.chip}
          onDelete={handleDelete}
        />
      ))}
    </>
  );
};

ChipsAdornment.displayName = 'ChipsAdornment';

export default ChipsAdornment;
