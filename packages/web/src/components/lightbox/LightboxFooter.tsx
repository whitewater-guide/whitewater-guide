import React from 'react';
import { Styles } from '../../styles';
import { Media } from '../../ww-commons';

const styles: Styles = {
  container: {
    bottom: 0,
    left: 0,
    right: 0,
    position: 'absolute',
    color: 'white',
    display: 'flex',
    padding: 20,
  },
  caption: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  copyright: {
    color: '#AAAAAA',
  },
};

interface Props {
  currentIndex: number;
  isFullscreen: boolean;
  isModal: boolean;
  currentView: Media;
  views: Media[];
}

const LightboxFooter: React.StatelessComponent<Props> = ({ currentIndex, currentView, views }) => {
  const total = views.length;
  return (
    <div style={styles.container}>
      <div style={styles.caption}>
        <span>{currentView.description}</span>
        <span style={styles.copyright}>{`© ${currentView.copyright}`}</span>
      </div>
      <span>{`${currentIndex + 1} / ${total}`}</span>
    </div>
  );
};

export default LightboxFooter;
