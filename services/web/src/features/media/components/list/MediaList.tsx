import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Icon from '@material-ui/core/Icon';
import { MediaKind } from '@whitewater-guide/commons';
import groupBy from 'lodash/groupBy';
import React, { useCallback, useMemo, useState } from 'react';
import { ConfirmationDialog } from '../../../../components';
import { Lightbox } from '../../../../components/lightbox';
import { Row } from '../../../../layout/details';
import { LocalPhoto } from '../../../../utils/files';
import BlogsList from './BlogsList';
import GridGallery from './GridGallery';
import { MediaOrInput } from './types';

interface Props {
  editable: boolean;
  media: MediaOrInput[];

  onRemove: (index: number) => void;
  onEdit: (index: number) => void;
  onAdd: (kind: MediaKind, file?: LocalPhoto) => void;
}

const MediaList: React.FC<Props> = React.memo((props) => {
  const { editable, media, onRemove, onEdit, onAdd } = props;
  const [currentModal, setCurrentModal] = useState<number | null>(null);
  const [pendingRemoval, setPendingRemoval] = useState<MediaOrInput | null>(
    null,
  );

  const grouped = useMemo(() => {
    const existingMedia = media.filter((m) => !m.deleted);
    const { photo = [], video = [], blog = [] } = groupBy(
      existingMedia,
      'kind',
    );
    const photoAndVideo = [...photo, ...video];
    return { photo, video, blog, photoAndVideo };
  }, [media]);

  const onAddBlog = useCallback(() => onAdd(MediaKind.blog), [onAdd]);

  const handleEdit = useCallback(
    (item: MediaOrInput) => {
      onEdit(media.indexOf(item));
    },
    [media, onEdit],
  );

  const onPhotoClick = useCallback(
    (item: MediaOrInput, index: number) => {
      setCurrentModal(index);
    },
    [setCurrentModal],
  );

  const onVideoClick = useCallback(
    (item: MediaOrInput, index: number) => {
      setCurrentModal(grouped.photo.length + index);
    },
    [setCurrentModal, grouped],
  );

  const onCloseLightbox = useCallback(() => {
    setCurrentModal(null);
  }, [setCurrentModal]);

  const onRequestRemove = useCallback(
    (item: MediaOrInput) => setPendingRemoval(item),
    [setPendingRemoval],
  );

  const onCancelRemove = useCallback(() => setPendingRemoval(null), [
    setPendingRemoval,
  ]);

  const onConfirmRemove = useCallback(() => {
    if (pendingRemoval) {
      onRemove(media.indexOf(pendingRemoval));
      setPendingRemoval(null);
    }
  }, [pendingRemoval, setPendingRemoval, media, onRemove]);

  return (
    <React.Fragment>
      <Row>
        <Grid item={true}>
          <h2>Photos</h2>
        </Grid>
      </Row>
      <Row>
        <Grid item={true} sm={12}>
          <GridGallery
            editable={editable}
            kind={MediaKind.photo}
            media={grouped.photo}
            onThumbClick={onPhotoClick}
            onAdd={onAdd}
            onEdit={handleEdit}
            onRemove={onRequestRemove}
          />
        </Grid>
      </Row>
      <Row>
        <Grid item={true}>
          <h2>Videos</h2>
        </Grid>
      </Row>
      <Row>
        <Grid item={true} sm={12}>
          <GridGallery
            editable={editable}
            kind={MediaKind.video}
            media={grouped.video}
            onThumbClick={onVideoClick}
            onAdd={onAdd}
            onEdit={handleEdit}
            onRemove={onRequestRemove}
          />
        </Grid>
      </Row>
      <Row>
        <Grid item={true}>
          <h2>
            {'Blogs'}
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
        <Grid item={true} xs={6}>
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
    </React.Fragment>
  );
});

MediaList.displayName = 'MediaList';

export default MediaList;
