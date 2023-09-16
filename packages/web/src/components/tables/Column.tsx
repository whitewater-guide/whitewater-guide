import type { FC } from 'react';
import type { ColumnProps } from 'react-virtualized';
import { Column as _Column } from 'react-virtualized';

export const Column = _Column as unknown as FC<ColumnProps>;
