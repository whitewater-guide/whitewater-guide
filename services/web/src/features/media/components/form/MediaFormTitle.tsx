import DialogTitle from '@material-ui/core/DialogTitle';
import { getIn, useFormikContext } from 'formik';
import capitalize from 'lodash/capitalize';
import React from 'react';

interface Props {
  prefix?: string;
}

const MediaFormTitle: React.FC<Props> = React.memo(({ prefix = '' }) => {
  const { initialValues } = useFormikContext<any>();
  const url = getIn(initialValues, `${prefix}url`);
  const kind = getIn(initialValues, `${prefix}kind`);
  const title = url ? capitalize(`${kind} settings`) : `New ${kind}`;
  return <DialogTitle>{title}</DialogTitle>;
});

MediaFormTitle.displayName = 'MediaFormTitle';

export default MediaFormTitle;
