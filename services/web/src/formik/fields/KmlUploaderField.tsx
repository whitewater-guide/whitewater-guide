import React from 'react';
import { KmlUploader } from '../../components';
import { useFakeHandlers } from '../utils';

interface Props {
  name: string;
}

export const KmlUploaderField: React.FC<Props> = React.memo(({ name }) => {
  const { onChange } = useFakeHandlers(name);
  return <KmlUploader onUpload={onChange} />;
});

KmlUploaderField.displayName = 'KmlUploaderField';
