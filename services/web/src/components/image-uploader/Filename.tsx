import React from 'react';
import { LocalPhoto } from '../../utils/files';

interface Props {
  value: LocalPhoto | null;
}

export const Filename: React.FC<Props> = ({ value }) => {
  const filename = value ? (value.file ? value.file.name : value.url) : '';
  return <span>{`File: ${filename || ''}`}</span>;
};

export default Filename;
