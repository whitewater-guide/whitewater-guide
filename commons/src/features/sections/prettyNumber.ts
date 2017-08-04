export const prettyNumber = value => (value >= 1000 ? `${(value / 1000).toFixed(1)}k` : value.toFixed(2));
