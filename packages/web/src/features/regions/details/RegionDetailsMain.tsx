import * as React from 'react';
import * as ReactMarkdown from 'react-markdown';
import { Styles } from '../../../styles';
import { stringifySeason } from '../../../ww-clients/utils';
import { Region } from '../../../ww-commons/features/regions';

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
  region: Region;
}

const RegionDetailsMain: React.StatelessComponent<Props> = ({ region }) => (
  <div style={styles.wrapper}>
    <div style={styles.row}>
      <div style={styles.title}>Name</div>
      <div>{region.name}</div>
    </div>
    <div style={styles.row}>
      <div style={styles.title}>Season</div>
      <div>{stringifySeason(region.seasonNumeric)}</div>
    </div>
    <div style={styles.row}>
      <div style={styles.title}>Description</div>
      <ReactMarkdown source={region.description || ''} />
    </div>
  </div>
);

export default RegionDetailsMain;
