import { FC } from 'react';
import { Column, ColumnProps } from 'react-virtualized';

class _EditorColumn extends Column {}

export const EditorColumn = _EditorColumn as unknown as FC<ColumnProps>;
