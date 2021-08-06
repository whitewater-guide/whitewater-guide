import { createStyles, makeStyles } from '@material-ui/core/styles';
import React, { useCallback, useMemo, useState } from 'react';

import { Lightbox, LightboxItem } from '../../../components/lightbox';
import { ListedSuggestionFragment } from './listSuggestions.generated';

const useStyles = makeStyles(({ spacing }) =>
  createStyles({
    thumb: {
      height: 100,
      width: 100,
      marginRight: spacing(1),
      cursor: 'pointer',
    },
  }),
);

interface Props {
  suggestion: ListedSuggestionFragment;
}

const SuggestionThumb = React.memo<Props>(({ suggestion }) => {
  const { thumb } = suggestion;
  const classes = useStyles();
  const items: LightboxItem[] = useMemo(() => [suggestion], [suggestion]);
  const [currentModal, setCurrentModal] = useState<number | null>(null);
  const openModal = useCallback(() => setCurrentModal(0), [setCurrentModal]);
  const closeModal = useCallback(
    () => setCurrentModal(null),
    [setCurrentModal],
  );
  if (!thumb) {
    return null;
  }
  return (
    <>
      <img alt="" src={thumb} className={classes.thumb} onClick={openModal} />
      <Lightbox
        items={items}
        currentModal={currentModal}
        onClose={closeModal}
      />
    </>
  );
});

SuggestionThumb.displayName = 'SuggestionThumb';

export default SuggestionThumb;
