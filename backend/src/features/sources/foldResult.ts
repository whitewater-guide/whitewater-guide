const foldRegion = ({ regions, count, ...rest }: any) => ({
  ...rest,
  regions: {
    nodes: regions,
    count,
  },
});

const foldResult = (knexResult: any) =>
  Array.isArray(knexResult) ? knexResult.map(foldRegion) : foldRegion(knexResult);

export default foldResult;
