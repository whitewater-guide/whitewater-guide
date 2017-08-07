/* tslint:disable:only-arrow-functions */
/* tslint:disable:no-invalid-this */
const MONTHS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];

export = function moment() {
  return {

    month(this: any, num: number): any {
      this.value = MONTHS[num];
      return this;
    },

    format(this: any, ): any {
      return this.value;
    },
  };
};
