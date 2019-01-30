import CircularProgress from 'material-ui/CircularProgress';
import React from 'react';
import { Styles } from '../../../styles';

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
  preview?: string;
  loading: boolean;
}

const PhotoFormPreview: React.StatelessComponent<Props> = ({
  url,
  preview,
  loading,
}) => {
  const src = `${
    process.env.REACT_APP_API_HOST
  }/images/${PREVIEW_SIZE},fit/media/${url}`;
  return (
    <div style={styles.previewWrapper}>
      <img src={preview || src} style={styles.preview} />
      {loading && (
        <div style={styles.shade}>
          <CircularProgress />
        </div>
      )}
    </div>
  );
};

export default PhotoFormPreview;
