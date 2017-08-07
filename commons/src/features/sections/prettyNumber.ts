export const prettyNumber = (value: number) => (value >= 1000 ? `${(value / 1000).toFixed(1)}k` : value.toFixed(2));
