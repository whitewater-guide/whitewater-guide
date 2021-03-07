import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import { useRegion } from '@whitewater-guide/clients';
import { ROOT_LICENSE } from '@whitewater-guide/commons';
import React from 'react';

import { Row, Title } from '../../../layout/details';

const RegionDetailsLicense: React.FC = () => {
  const region = useRegion();
  const license = region?.node?.license ?? ROOT_LICENSE;
  const { url, name } = license;
  const copyright = region?.node?.copyright;

  return (
    <Box overflow="auto" width={1} height={1} padding={1}>
      <Grid container={true}>
        <Row>
          <Title>Copyright</Title>
          <Grid item={true}>{copyright}</Grid>
        </Row>
        <Row>
          <Title>License</Title>
          <Grid item={true}>
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
