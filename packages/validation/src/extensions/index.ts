import * as yup from 'yup';

import cron from './cron';
import formula from './formula';
import https from './https';
import isoDate from './isoDate';
import jsonString from './jsonString';
import nonEmptyString from './nonEmptyString';
import slug from './slug';

yup.addMethod(yup.string, 'cron', cron);
yup.addMethod(yup.string, 'formula', formula);
yup.addMethod(yup.string, 'https', https);
yup.addMethod(yup.string, 'jsonString', jsonString);
yup.addMethod(yup.string, 'nonEmpty', nonEmptyString);
yup.addMethod(yup.string, 'slug', slug);
yup.addMethod(yup.string, 'isoDate', isoDate);
