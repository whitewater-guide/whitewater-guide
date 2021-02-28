import { Source } from '@whitewater-guide/commons';
import React from 'react';

import { Styles } from '../../../styles';

const styles: Styles = {
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    padding: 16,
  },
  row: {
    display: 'flex',
    fontSize: 18,
    paddingTop: 8,
    paddingBottom: 8,
  },
  title: {
    fontWeight: 'bold',
    width: 130,
    minWidth: 130,
  },
};

interface Props {
  source: Source;
}

const SourceDetailsMain: React.StatelessComponent<Props> = ({ source }) => (
  <div style={styles.wrapper}>
    <div style={styles.row}>
      <div style={styles.title}>Name</div>
      <div>{source.name}</div>
    </div>
    <div style={styles.row}>
      <div style={styles.title}>Regions</div>
      <div>{source.regions?.nodes?.map((node) => node.name).join(', ')}</div>
    </div>
    <div style={styles.row}>
      <div style={styles.title}>URL</div>
      <div>{source.url}</div>
    </div>
    <div style={styles.row}>
      <div style={styles.title}>Script</div>
      <div>{source.script}</div>
    </div>
    <div style={styles.row}>
      <div style={styles.title}>Cron</div>
      <div>{source.cron}</div>
    </div>
    <div style={styles.row}>
      <div style={styles.title}>Enabled</div>
      <div>{source.enabled ? 'true' : 'false'}</div>
    </div>
  </div>
);

export default SourceDetailsMain;
