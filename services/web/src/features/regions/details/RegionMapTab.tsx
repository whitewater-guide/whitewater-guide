import { Gauge, Point, Region, Section } from '@whitewater-guide/commons';
import gql from 'graphql-tag';
import React, { useEffect, useMemo, useState } from 'react';
import { useLazyQuery } from 'react-apollo';
import { Map } from '../../../components/maps';
import GaugesMapSwitch from './GaugesMapSwitch';

const GAUGES_QUERY = gql`
  query regionGauges($regionId: ID) {
    gauges(filter: { regionId: $regionId }) {
      nodes {
        id
        name
        location {
          id
          kind
          name
          coordinates
        }
      }
    }
  }
`;

interface Props {
  region: Region;
  sections: Section[];
}

const RegionMapTab: React.FC<Props> = ({ region, sections }) => {
  const [showGauges, setShowGauges] = useState(false);
  const [fetchGauges, { data, called }] = useLazyQuery(GAUGES_QUERY, {
    variables: { regionId: region.id },
  });

  useEffect(() => {
    if (showGauges && !called) {
      fetchGauges();
    }
  }, [fetchGauges, called, showGauges]);

  const pois = useMemo(() => {
    const gauges = (data?.gauges?.nodes || [])
      .map((g: Gauge) => g.location)
      .filter((p: Point) => !!p);
    return [...region.pois, ...(showGauges ? gauges : [])];
  }, [region, data, showGauges]);

  return (
    <Map
      detailed={false}
      sections={sections}
      initialBounds={region.bounds}
      pois={pois}
      controls={[
        <GaugesMapSwitch
          key="gauges_switch"
          position={3}
          enabled={showGauges}
          setEnabled={setShowGauges}
        />,
      ]}
    />
  );
};

export default RegionMapTab;
