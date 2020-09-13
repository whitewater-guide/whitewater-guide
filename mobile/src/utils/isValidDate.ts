const isValidDate = (d: any) => {
  return d instanceof Date && !isNaN(d as any);
};

export default isValidDate;
