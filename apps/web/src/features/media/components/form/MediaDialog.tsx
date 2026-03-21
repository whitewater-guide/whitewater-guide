import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import { MediaKind } from '@whitewater-guide/schema';
import React from 'react';

import MediaFormActions from './MediaFormActions';
import MediaFormTitle from './MediaFormTitle';
import NonPhotoForm from './NonPhotoForm';
import PhotoForm from './PhotoForm';
import type { MediaDialogProps } from './types';

const MediaDialog = React.memo<MediaDialogProps>((props) => {
  const { open, prefix, kind, localPhoto, onCancel, onSubmit } = props;
  return (
    <Dialog open={open} disableBackdropClick maxWidth="xl">
      <MediaFormTitle prefix={prefix} />
      <DialogContent>
        {kind === MediaKind.Photo ? (
          <PhotoForm prefix={prefix} localPhoto={localPhoto} />
        ) : (
          <NonPhotoForm prefix={prefix} />
        )}
      </DialogContent>
      <MediaFormActions
        prefix={prefix}
        onCancel={onCancel}
        onSubmit={onSubmit}
      />
    </Dialog>
  );
});

MediaDialog.displayName = 'MediaDialog';

export default MediaDialog;
