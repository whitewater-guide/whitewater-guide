import {
  ListedSectionFragment,
  RegionDetailsFragment,
} from '@whitewater-guide/clients';
import { Point } from '@whitewater-guide/schema';
import React, { useEffect, useMemo, useState } from 'react';

import { Map } from '../../../components/maps';
import GaugesMapSwitch from './GaugesMapSwitch';
import {
  RegionGaugeFragment,
  useRegionGaugesLazyQuery,
} from './regionGauges.generated';

interface Props {
  region: RegionDetailsFragment;
  sections: ListedSectionFragment[];
}

const RegionMapTab: React.FC<Props> = ({ region, sections }) => {
  const [showGauges, setShowGauges] = useState(false);
  const [fetchGauges, { data, called }] = useRegionGaugesLazyQuery({
    variables: { regionId: region.id },
  });

  useEffect(() => {
    if (showGauges && !called) {
      fetchGauges();
    }
  }, [fetchGauges, called, showGauges]);

  const pois = useMemo(() => {
    const gauges = (data?.gauges?.nodes ?? [])
      .map((g: RegionGaugeFragment) => g.location)
      .filter((p): p is Point => !!p);
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
