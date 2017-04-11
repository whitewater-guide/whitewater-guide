import React from 'react';
import { MapBase } from '../../commons/features/maps';
import { Map, SectionLine } from '../../core/components/maps';

function renderSection(section, isSelected, selectSection) {
  return (
    <SectionLine
      onClick={selectSection}
      key={section._id}
      origin={section.putIn}
      destination={section.takeOut}
      color={isSelected ? 'red' : undefined}
    />
  );
}

export default MapBase(Map, renderSection, () => null);
