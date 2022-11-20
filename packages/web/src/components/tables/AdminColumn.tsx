import { FC } from 'react';
import { Column, ColumnProps } from 'react-virtualized';

class _AdminColumn extends Column {}

export const AdminColumn = _AdminColumn as unknown as FC<ColumnProps>;
