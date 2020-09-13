import { CSSProperties } from 'react';

export interface Styles {
  [name: string]: CSSProperties & { [key: string]: any };
}
