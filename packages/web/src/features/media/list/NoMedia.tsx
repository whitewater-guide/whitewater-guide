import FontIcon from 'material-ui/FontIcon';
import * as React from 'react';
import { Styles } from '../../../styles';
import { MediaKind } from '../../../ww-commons';
import { THUMB_HEIGHT } from './constants';

const styles: Styles = {
  dz: {
    width: THUMB_HEIGHT,
    height: THUMB_HEIGHT,
    boxSizing: 'border-box',
    borderRadius: 0,
    borderWidth: 4,
    borderColor: '#BBBBBB',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    display: 'flex',
    flexDirection: 'column',
    cursor: 'pointer',
    marginRight: 16,
    marginBottom: 16,
  },
  icon: {
    fontSize: 48,
  },
  text: {
    marginTop: 12,
    textAlign: 'center',
    color: '#BBBBBB',
  },
};

interface Props {
  kind: MediaKind;
}

const NoMedia: React.StatelessComponent<Props> = ({ kind }) => (
  <div style={styles.dz}>
    <FontIcon className="material-icons" style={styles.icon} color="#BBBBBB">collections</FontIcon>
    <span style={styles.text}>{`No ${kind}s for this section`}</span>
  </div>
);

export default NoMedia;
