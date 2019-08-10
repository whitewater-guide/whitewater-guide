import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import { stringifySeason, useRegion } from '@whitewater-guide/clients';
import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Row, Title } from '../../../layout/details';

const RegionDetailsMain: React.FC = () => {
  const { node } = useRegion();
  if (!node) {
    return null;
  }
  return (
    <Box overflow="auto" width={1} height={1} padding={1}>
      <Grid container={true}>
        <Row>
          <Title>Name</Title>
          <Grid item={true}>{node.name}</Grid>
        </Row>
        <Row>
          <Title>Season</Title>
          <Grid item={true}>{stringifySeason(node.seasonNumeric)}</Grid>
        </Row>
        <Row>
          <Grid item={true} xs={12}>
            <ReactMarkdown source={node.description || ''} />
          </Grid>
        </Row>
      </Grid>
    </Box>
  );
};

export default RegionDetailsMain;
