import React from 'react';
import { MapOfRegion } from '../../commons/features/regions';
import { Map, SectionLine } from '../../core/components/maps';

function renderSection(section, isSelected, selectSection) {
  return (
    <SectionLine
      onClick={selectSection}
      key={section._id}
      origin={section.putIn}
      destination={section.takeOut}
    />
  );
}

export default MapOfRegion(Map, renderSection, () => {});
