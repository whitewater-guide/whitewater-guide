import type { FC } from 'react';
import type { ColumnProps } from 'react-virtualized';
import { Column } from 'react-virtualized';

class _AdminColumn extends Column {}

export const AdminColumn = _AdminColumn as unknown as FC<ColumnProps>;
