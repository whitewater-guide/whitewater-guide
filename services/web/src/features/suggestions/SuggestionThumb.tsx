import { createStyles, makeStyles } from '@material-ui/core/styles';
import { Media, MediaKind } from '@whitewater-guide/commons';
import React, { useCallback, useMemo, useState } from 'react';
import { Lightbox } from '../../components/lightbox';
import { ListedSuggestion } from './listSuggestions.query';

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
  suggestion: ListedSuggestion;
}

const SuggestionThumb: React.FC<Props> = React.memo(({ suggestion }) => {
  const { thumb } = suggestion;
  const classes = useStyles();
  const fakeMedia: Media[] = useMemo(
    () => [
      {
        id: suggestion.id,
        thumb: suggestion.thumb,
        image: suggestion.image,
        copyright: suggestion.copyright,
        description: suggestion.description,
        resolution: suggestion.resolution,
        kind: MediaKind.photo,
      } as any,
    ],
    [suggestion],
  );
  const [currentModal, setCurrentModal] = useState<number | null>(null);
  const openModal = useCallback(() => setCurrentModal(0), [setCurrentModal]);
  const closeModal = useCallback(() => setCurrentModal(null), [
    setCurrentModal,
  ]);
  if (!thumb) {
    return null;
  }
  return (
    <React.Fragment>
      <img src={thumb} className={classes.thumb} onClick={openModal} />
      <Lightbox
        media={fakeMedia}
        currentModal={currentModal}
        onClose={closeModal}
      />
    </React.Fragment>
  );
});

SuggestionThumb.displayName = 'SuggestionThumb';

export default SuggestionThumb;
