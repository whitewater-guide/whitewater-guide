const isValidDate = (d: any) => d instanceof Date && !isNaN(d as any);

export default isValidDate;
