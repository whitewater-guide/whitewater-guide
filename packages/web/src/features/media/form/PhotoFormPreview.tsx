import CircularProgress from 'material-ui/CircularProgress';
import React from 'react';
import { Styles } from '../../../styles';

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
    maxWidth: 360,
    maxHeight: 360,
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

const PhotoFormPreview: React.StatelessComponent<Props> = ({ url, preview, loading }) => (
  <div style={styles.previewWrapper}>
    <img src={preview || url} style={styles.preview} />
    {
      loading &&
      (
        <div style={styles.shade}>
          <CircularProgress />
        </div>
      )
    }
  </div>
);

export default PhotoFormPreview;
