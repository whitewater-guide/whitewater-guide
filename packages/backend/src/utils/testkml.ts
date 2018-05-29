import asTable from 'as-table';
import { parseKML } from './parseKML';

const parsed = parseKML('../migrations/005/norge.kml');
console.log(asTable(parsed));