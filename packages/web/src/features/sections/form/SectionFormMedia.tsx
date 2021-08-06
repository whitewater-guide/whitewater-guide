import { MediaInput, MediaKind } from '@whitewater-guide/schema';
import { useFormikContext } from 'formik';
import React, { Suspense, useCallback, useState } from 'react';

import { Loading } from '../../../components';
import { LocalPhoto } from '../../../utils/files';
import { LazyMediaDialog } from '../../media/components/form';
import { LazyMediaList } from '../../media/components/list';
import { SectionFormData } from './types';

const defaultValue: Omit<MediaInput, 'kind'> = {
  id: null,
  license: null,
  copyright: null,
  description: null,
  resolution: null,
  url: '',
  weight: null,
};

interface DialogState {
  index: number;
  photo?: LocalPhoto;
}

export const SectionFormMedia: React.FC = React.memo(() => {
  const [dialogState, setDialogState] = useState<DialogState>({ index: -1 });
  const { values, setFieldValue } = useFormikContext<SectionFormData>();
  const { media } = values;

  const closeDialog = useCallback(() => {
    const item = media[dialogState.index];
    if (item && !item.url) {
      const newMedia = media.slice();
      newMedia.splice(dialogState.index, 1);
      setFieldValue('media', newMedia);
    }
    setDialogState({ index: -1 });
  }, [setFieldValue, media, dialogState, setDialogState]);
  const openDialog = useCallback(
    (index: number) => setDialogState({ index }),
    [setDialogState],
  );

  const onAdd = useCallback(
    (kind: MediaKind, photo?: LocalPhoto) => {
      const index = media.length;
      setFieldValue(`media.${index}` as any, { ...defaultValue, kind });
      setDialogState({ index, photo });
    },
    [media, setFieldValue, setDialogState],
  );

  const onRemove = useCallback(
    (index: number) => {
      const newMedia = media.slice();
      newMedia.splice(index, 1);
      setFieldValue('media', newMedia);
    },
    [setFieldValue, media],
  );

  return (
    <>
      <Suspense fallback={<Loading />}>
        <LazyMediaList
          editable
          media={media}
          onAdd={onAdd}
          onEdit={openDialog}
          onRemove={onRemove}
        />
      </Suspense>
      <Suspense fallback={<Loading />}>
        <LazyMediaDialog
          open={dialogState.index >= 0}
          prefix={`media.${dialogState.index}.`}
          onSubmit={closeDialog}
          onCancel={closeDialog}
          kind={
            media[dialogState.index] ? media[dialogState.index].kind : undefined
          }
          localPhoto={dialogState.photo}
        />
      </Suspense>
    </>
  );
});

SectionFormMedia.displayName = 'SectionFormMedia';

export default SectionFormMedia;
