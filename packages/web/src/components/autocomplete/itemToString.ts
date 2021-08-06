import { NamedNode } from '@whitewater-guide/schema';

const itemToString = (item: NamedNode | null) => (item ? item.name : '');

export default itemToString;
