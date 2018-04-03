import * as downshift from 'downshift';

declare module 'downshift' {
  interface Actions {
    setState: (state: Partial<downshift.StateChangeOptions>) => void;
  }
}
