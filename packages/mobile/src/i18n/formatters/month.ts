import i18next from 'i18next';
import moment from 'moment';

const month: i18next.FormatFunction = (value) =>
  moment()
    .month(value)
    .format('DD MMMM')
    .split(' ')[1];

export default month;
