export function makeLinearScale(
  dataDomain: [number, number],
  pixelRange: [number, number],
) {
  const [d0, d1] = dataDomain;
  const [p0, p1] = pixelRange;
  return (value: number) =>
    d1 === d0 ? p0 : p0 + ((value - d0) / (d1 - d0)) * (p1 - p0);
}
