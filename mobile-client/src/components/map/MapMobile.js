import { MapBase } from '../../commons/features/maps';
import renderSimpleSection from './renderSimpleSection';
import renderSimplePOI from './renderSimplePOI';
import Map from './Map';

export default MapBase(Map, renderSimpleSection, renderSimplePOI);
