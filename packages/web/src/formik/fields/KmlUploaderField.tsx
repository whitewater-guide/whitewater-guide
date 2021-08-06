import React from 'react';

import { KmlUploader } from '../../components';
import { useFakeHandlers } from '../utils';

interface Props {
  name: string;
}

export const KmlUploaderField = React.memo<Props>(({ name }) => {
  const { onChange } = useFakeHandlers(name);
  return <KmlUploader onUpload={onChange} />;
});

KmlUploaderField.displayName = 'KmlUploaderField';
