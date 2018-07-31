/* tslint:disable:only-arrow-functions */
/* tslint:disable:no-invalid-this */
const MONTHS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];

const actual = require.requireActual('moment');

const mock = function moment() {
  const instance = actual();
  return {
    ...instance,
    month(this: any, num: number): any {
      this.value = MONTHS[num];
      return this;
    },
    format(this: any): any {
      return this.value;
    },
  };
};

export = Object.assign(mock, actual);
