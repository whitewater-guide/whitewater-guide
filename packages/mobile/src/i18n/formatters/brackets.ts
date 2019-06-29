import i18next from 'i18next';

const brackets: i18next.FormatFunction = (value) => {
  const trimmed = value ? value.toString().trim() : value;
  return trimmed ? `(${value})` : '';
};

export default brackets;
