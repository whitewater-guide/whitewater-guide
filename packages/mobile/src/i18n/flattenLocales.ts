const flattenLocales = (tree: object, prefix = '') =>
  Object.entries(tree).reduce(
    (accumulator, [key, value]) => {
      if (typeof value === 'string') {
        return { ...accumulator, [prefix + key]: value };
      }
      return { ...accumulator, ...flattenLocales(value, `${prefix}${key}.`)};
    },
    {},
  );

export default flattenLocales;
