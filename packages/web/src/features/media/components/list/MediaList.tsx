import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Icon from '@material-ui/core/Icon';
import { MediaKind } from '@whitewater-guide/schema';
import groupBy from 'lodash/groupBy';
import React, { useCallback, useMemo, useState } from 'react';

import { ConfirmationDialog } from '../../../../components';
import { Lightbox } from '../../../../components/lightbox';
import { Row } from '../../../../layout/details';
import type { LocalPhoto } from '../../../../utils/files';
import BlogsList from './BlogsList';
import GridGallery from './GridGallery';
import type { ListedMedia } from './types';

interface Props {
  editable: boolean;
  media?: ListedMedia[];

  onRemove: (index: number) => void;
  onEdit: (index: number) => void;
  onAdd: (kind: MediaKind, file?: LocalPhoto) => void;
}

const MediaList = React.memo<Props>((props) => {
  const { editable, media, onRemove, onEdit, onAdd } = props;
  const [currentModal, setCurrentModal] = useState<number | null>(null);
  const [pendingRemoval, setPendingRemoval] = useState<ListedMedia | null>(
    null,
  );

  const grouped = useMemo(() => {
    const existingMedia = media?.filter((m) => !m.deleted);
    const {
      photo = [],
      video = [],
      blog = [],
    } = groupBy(existingMedia, 'kind');
    const photoAndVideo = [...photo, ...video];
    return { photo, video, blog, photoAndVideo };
  }, [media]);

  const onAddBlog = useCallback(() => onAdd(MediaKind.Blog), [onAdd]);

  const handleEdit = useCallback(
    (item: ListedMedia) => {
      if (media) {
        onEdit(media.indexOf(item));
      }
    },
    [media, onEdit],
  );

  const onPhotoClick = useCallback(
    (item: ListedMedia, index: number) => {
      setCurrentModal(index);
    },
    [setCurrentModal],
  );

  const onVideoClick = useCallback(
    (item: ListedMedia, index: number) => {
      setCurrentModal(grouped.photo.length + index);
    },
    [setCurrentModal, grouped],
  );

  const onCloseLightbox = useCallback(() => {
    setCurrentModal(null);
  }, [setCurrentModal]);

  const onRequestRemove = useCallback(
    (item: ListedMedia) => setPendingRemoval(item),
    [setPendingRemoval],
  );

  const onCancelRemove = useCallback(
    () => setPendingRemoval(null),
    [setPendingRemoval],
  );

  const onConfirmRemove = useCallback(() => {
    if (pendingRemoval && media) {
      onRemove(media.indexOf(pendingRemoval));
      setPendingRemoval(null);
    }
  }, [pendingRemoval, setPendingRemoval, media, onRemove]);

  return (
    <>
      <Row>
        <Grid item>
          <h2>Photos</h2>
        </Grid>
      </Row>
      <Row>
        <Grid item sm={12}>
          <GridGallery
            editable={editable}
            kind={MediaKind.Photo}
            media={grouped.photo}
            onThumbClick={onPhotoClick}
            onAdd={onAdd}
            onEdit={handleEdit}
            onRemove={onRequestRemove}
          />
        </Grid>
      </Row>
      <Row>
        <Grid item>
          <h2>Videos</h2>
        </Grid>
      </Row>
      <Row>
        <Grid item sm={12}>
          <GridGallery
            editable={editable}
            kind={MediaKind.Video}
            media={grouped.video}
            onThumbClick={onVideoClick}
            onAdd={onAdd}
            onEdit={handleEdit}
            onRemove={onRequestRemove}
          />
        </Grid>
      </Row>
      <Row>
        <Grid item>
          <h2>
            Blogs
            {editable && (
              <Button onClick={onAddBlog}>
                <Icon>add</Icon>
                Add
              </Button>
            )}
          </h2>
        </Grid>
      </Row>
      <Row>
        <Grid item xs={6}>
          <BlogsList
            editable={editable}
            media={grouped.blog}
            onEdit={handleEdit}
            onRemove={onRequestRemove}
          />
        </Grid>
      </Row>
      <Lightbox
        items={grouped.photoAndVideo}
        currentModal={currentModal}
        onClose={onCloseLightbox}
      />
      {!!pendingRemoval && (
        <ConfirmationDialog
          title="Delete media?"
          description="Are you sure to delete this media?"
          onCancel={onCancelRemove}
          onConfirm={onConfirmRemove}
        />
      )}
    </>
  );
});

MediaList.displayName = 'MediaList';

export default MediaList;
