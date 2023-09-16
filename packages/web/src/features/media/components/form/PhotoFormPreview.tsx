import CircularProgress from '@material-ui/core/CircularProgress';
import React from 'react';

import { MediaImg } from '../../../../components';
import type { Styles } from '../../../../styles';
import type { LocalPhoto } from '../../../../utils/files';

const PREVIEW_SIZE = 360;

const styles: Styles = {
  previewWrapper: {
    position: 'relative',
    width: 400,
    height: 400,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  preview: {
    maxWidth: PREVIEW_SIZE,
    maxHeight: PREVIEW_SIZE,
  },
  shade: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.32)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
};

interface Props {
  url?: string;
  localPhoto?: LocalPhoto;
  loading: boolean;
}

const PhotoFormPreview: React.FC<Props> = ({ url, localPhoto, loading }) => (
  <div style={styles.previewWrapper}>
    <MediaImg src={localPhoto?.file?.preview ?? url} style={styles.preview} />
    {loading && (
      <div style={styles.shade}>
        <CircularProgress />
      </div>
    )}
  </div>
);

export default PhotoFormPreview;
