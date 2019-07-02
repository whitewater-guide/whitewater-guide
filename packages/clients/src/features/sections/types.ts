export type FlowFormula = (x: number) => number;

export interface Formulas {
  levels: FlowFormula;
  flows: FlowFormula;
}

export enum SectionsStatus {
  LOADING,
  LOADING_UPDATES,
  READY,
}
