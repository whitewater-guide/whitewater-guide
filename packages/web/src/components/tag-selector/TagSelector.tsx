import { createStyles, makeStyles } from '@material-ui/core/styles';
import { Tag } from '@whitewater-guide/commons';
import React from 'react';

import TagChip from './TagChip';

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      display: 'flex',
      flexWrap: 'wrap',
      '& > *': {
        margin: theme.spacing(0.5),
      },
    },
  }),
);

interface Props {
  options: Tag[];
  value: Tag[];
  onChange: (value: Tag[]) => void;
}

export const TagSelector: React.FC<Props> = React.memo((props) => {
  const { options, value, onChange } = props;
  const classes = useStyles();
  return (
    <div className={classes.root}>
      {options.map((tag) => (
        <TagChip key={tag.id} tag={tag} selected={value} onChange={onChange} />
      ))}
    </div>
  );
});

TagSelector.displayName = 'TagSelector';
