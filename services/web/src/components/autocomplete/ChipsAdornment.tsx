import Chip from '@material-ui/core/Chip';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { NamedNode } from '@whitewater-guide/commons';
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
    (e: any) => {
      onDelete(e.target.closest('.MuiChip-root ').id);
    },
    [onDelete],
  );
  return (
    <React.Fragment>
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
    </React.Fragment>
  );
};

ChipsAdornment.displayName = 'ChipsAdornment';

export default ChipsAdornment;
