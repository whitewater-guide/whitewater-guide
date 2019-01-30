import { MapBody, MapProps } from '@whitewater-guide/clients';
import React from 'react';
import { Map, SectionLine } from '../../../../components/maps';

const RegionMapBody: React.ComponentType<MapProps> = MapBody(
  Map,
  SectionLine,
  () => null,
);

export default RegionMapBody;
