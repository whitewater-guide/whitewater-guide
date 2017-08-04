const MONTHS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];

export default function moment() {
  return {

    month(num) {
      this.value = MONTHS[num];
      return this;
    },

    format() {
      return this.value;
    },
  };
}
