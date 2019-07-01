export type FlowFormula = (x: number) => number;

export interface Formulas {
  levels: FlowFormula;
  flows: FlowFormula;
}
