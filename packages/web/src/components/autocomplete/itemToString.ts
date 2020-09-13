import { NamedNode } from '@whitewater-guide/commons';

const itemToString = (item: NamedNode | null) => (item ? item.name : '');

export default itemToString;
