import { getSectionContentBounds, useSection } from '@whitewater-guide/clients';
import React, { useMemo } from 'react';

import { Map } from '~/components/map';
import { Screen } from '~/components/Screen';

import { SectionMapNavProps } from './types';

const SectionMapScreen: React.FC<SectionMapNavProps> = () => {
  const section = useSection();
  const initialBounds = useMemo(() => getSectionContentBounds(section.node), [
    section,
  ]);
  const pois = useMemo(() => {
    if (!section.node) {
      return [];
    }

    const result = [...section.node.pois];
    const gauge = section.node.gauge && section.node.gauge.location;
    if (gauge) {
      const gaugePt = { ...gauge, name: `Gauge ${gauge.name}` };
      result.push(gaugePt);
    }
    return result;
  }, [section]);
  return (
    <Screen>
      {section.node && initialBounds && (
        <Map
          sections={[section.node]}
          initialBounds={initialBounds}
          pois={pois}
          detailed={true}
          testID="section-map"
        />
      )}
    </Screen>
  );
};

export default SectionMapScreen;
