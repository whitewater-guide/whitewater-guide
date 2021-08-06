import { getSectionContentBounds, useSection } from '@whitewater-guide/clients';
import React, { useMemo } from 'react';

import { Map } from '~/components/map';
import { Screen } from '~/components/Screen';

import { SectionMapNavProps } from './types';

const SectionMapScreen: React.FC<SectionMapNavProps> = () => {
  const section = useSection();
  const initialBounds = useMemo(
    () => getSectionContentBounds(section),
    [section],
  );
  const pois = useMemo(() => {
    if (!section) {
      return [];
    }

    const result = [...section.pois];
    const gauge = section.gauge?.location;
    if (gauge) {
      const gaugePt = { ...gauge, name: 'Gauge' };
      result.push(gaugePt);
    }
    return result;
  }, [section]);
  return (
    <Screen>
      {section && initialBounds && (
        <Map
          sections={[section]}
          initialBounds={initialBounds}
          pois={pois}
          detailed
          testID="section-map"
        />
      )}
    </Screen>
  );
};

export default SectionMapScreen;
