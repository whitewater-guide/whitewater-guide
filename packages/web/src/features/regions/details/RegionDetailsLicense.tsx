import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import { ROOT_LICENSE, useRegion } from '@whitewater-guide/clients';
import React from 'react';

import { Row, Title } from '../../../layout/details';

const RegionDetailsLicense: React.FC = () => {
  const region = useRegion();
  const license = region?.license ?? ROOT_LICENSE;
  const { url, name } = license;
  const copyright = region?.copyright;

  return (
    <Box overflow="auto" width={1} height={1} padding={1}>
      <Grid container>
        <Row>
          <Title>Copyright</Title>
          <Grid item>{copyright}</Grid>
        </Row>
        <Row>
          <Title>License</Title>
          <Grid item>
            <span>Content in this region is available under </span>
            <b>
              {url ? (
                <a href={url} target="_blank" rel="noreferrer">
                  {name}
                </a>
              ) : (
                name
              )}
            </b>
            <span> unless stated otherwise</span>
          </Grid>
        </Row>
      </Grid>
    </Box>
  );
};

export default RegionDetailsLicense;
