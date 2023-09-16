import { addMethod, string } from 'yup';

import cron from './cron';
import formula from './formula';
import https from './https';
import isoDate from './isoDate';
import jsonString from './jsonString';
import nonEmptyString from './nonEmptyString';
import slug from './slug';

addMethod(string, 'cron', cron);
addMethod(string, 'formula', formula);
addMethod(string, 'https', https);
addMethod(string, 'jsonString', jsonString);
addMethod(string, 'nonEmpty', nonEmptyString);
addMethod(string, 'slug', slug);
addMethod(string, 'isoDate', isoDate);
