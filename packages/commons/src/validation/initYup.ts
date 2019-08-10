import * as yup from 'yup';
import { yupLocale } from './yupLocale';

const initYup = () => {
  yup.setLocale(yupLocale);
  yup.addMethod(yup.mixed, 'defined', function() {
    return this.test({
      name: 'is-defined',
      test(v) {
        return v === undefined
          ? this.createError({ path: this.path, message: 'yup:mixed.defined' })
          : true;
      },
    });
  });
};

initYup();
