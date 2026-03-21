import type { NamedNode } from '@whitewater-guide/schema';

import timezones from './timezone-names.json';

export const TIMEZONES: NamedNode[] = timezones.map((id) => ({ id, name: id }));
