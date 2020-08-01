import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import { MediaKind } from '@whitewater-guide/commons';
import React from 'react';
import { LocalPhoto } from '../../../../utils/files';
import MediaFormActions from './MediaFormActions';
import MediaFormTitle from './MediaFormTitle';
import NonPhotoForm from './NonPhotoForm';
import PhotoForm from './PhotoForm';

interface Props {
  open: boolean;
  prefix?: string;
  kind?: MediaKind;
  onCancel: () => void;
  onSubmit: () => any;
  localPhoto?: LocalPhoto;
}

const MediaDialog: React.FC<Props> = React.memo((props) => {
  const { open, prefix, kind, localPhoto, onCancel, onSubmit } = props;
  return (
    <Dialog open={open} disableBackdropClick={true} maxWidth="xl">
      <MediaFormTitle prefix={prefix} />
      <DialogContent>
        {kind === MediaKind.photo ? (
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
