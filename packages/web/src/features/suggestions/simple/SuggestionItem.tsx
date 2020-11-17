import { createStyles, makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import React, { useCallback, useLayoutEffect, useRef, useState } from 'react';

import { ListedSuggestion } from './listSuggestions.query';
import LongDescriptionDialog from './LongDescriptionDialog';
import SuggestionThumb from './SuggestionThumb';

const useStyles = makeStyles(() =>
  createStyles({
    container: {
      display: 'flex',
      flex: 1,
    },
    descriptionWrapper: {
      display: 'flex',
      flex: 1,
    },
    description: {
      padding: 0,
      flex: 1,
      overflow: 'hidden',
      whiteSpace: 'normal',
      height: 100,
    },
    overflowing: {
      cursor: 'pointer',
    },
  }),
);

interface Props {
  suggestion: ListedSuggestion;
}

const SuggestionItem = React.memo(({ suggestion }: Props) => {
  const { description }: ListedSuggestion = suggestion;
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const closeDialog = useCallback(() => setDialogOpen(false), [setDialogOpen]);
  const openDialog = useCallback(() => setDialogOpen(true), [setDialogOpen]);
  const descriptionEl = useRef<HTMLDivElement | null>(null);
  const classes = useStyles();
  useLayoutEffect(() => {
    const el = descriptionEl.current!;
    setIsOverflowing(
      el.offsetHeight < el.scrollHeight || el.offsetWidth < el.scrollWidth,
    );
  }, [suggestion]);

  return (
    <div className={classes.container}>
      <SuggestionThumb suggestion={suggestion} />
      <div
        className={clsx(
          classes.descriptionWrapper,
          isOverflowing && classes.overflowing,
        )}
        onClick={isOverflowing ? openDialog : undefined}
      >
        <div className={classes.description} ref={descriptionEl}>
          {description}
        </div>
      </div>
      {isOverflowing && (
        <LongDescriptionDialog
          description={description || ''}
          open={dialogOpen}
          onClose={closeDialog}
        />
      )}
    </div>
  );
});

SuggestionItem.displayName = 'SuggestionItem';

export default SuggestionItem;
