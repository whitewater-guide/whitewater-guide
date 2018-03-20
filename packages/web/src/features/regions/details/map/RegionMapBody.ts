import React from 'react';
import { Map, SectionLine } from '../../../../components/maps';
import { MapBody, MapProps } from '../../../../ww-clients/features/maps';

const RegionMapBody: React.ComponentType<MapProps> = MapBody(Map, SectionLine, () => null);

export default RegionMapBody;
