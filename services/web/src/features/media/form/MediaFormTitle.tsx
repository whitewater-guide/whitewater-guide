import DialogTitle from '@material-ui/core/DialogTitle';
import { MediaInput } from '@whitewater-guide/commons';
import { useFormikContext } from 'formik';
import capitalize from 'lodash/capitalize';
import React from 'react';

const MediaFormTitle: React.FC = React.memo(() => {
  const {
    initialValues: { url, kind },
  } = useFormikContext<MediaInput>();
  const title = url ? capitalize(`${kind} settings`) : `New ${kind}`;
  return <DialogTitle>{title}</DialogTitle>;
});

MediaFormTitle.displayName = 'MediaFormTitle';

export default MediaFormTitle;
