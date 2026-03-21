import type { FC } from 'react';
import type { ColumnProps } from 'react-virtualized';
import { Column } from 'react-virtualized';

class _EditorColumn extends Column {}

export const EditorColumn = _EditorColumn as unknown as FC<ColumnProps>;
