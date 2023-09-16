import parseISO from 'date-fns/parseISO';
import type { StringSchema } from 'yup';

export default function isoDate(this: StringSchema, errorMessage?: string) {
  return this.test({
    name: 'is-iso-date',
    exclusive: true,
    message: errorMessage ?? 'yup:string.isoDate',
    test(v) {
      // undefined and null values should be handled by following .required, .nullable, .etc
      // eslint-disable-next-line no-eq-null, eqeqeq
      if (v == null) {
        return true;
      }
      try {
        const date = parseISO(v);
        return date instanceof Date && isFinite(date as any);
      } catch {
        return false;
      }
    },
  });
}
