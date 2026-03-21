interface WithCount {
  count: number;
}

export const listResolvers = {
  nodes: (list: WithCount[]) => list,
  count: (list: WithCount[]) => (list.length ? Number(list[0].count) : 0),
};
