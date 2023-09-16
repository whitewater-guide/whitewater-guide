import { promises } from 'fs';
import { template } from 'lodash';
import mjml2html from 'mjml';

import config from '../../config';
import { resolveRelative } from '../../utils/index';
import type { MailType } from '../types';

const { readFile } = promises;

const TEMPLATES = new Map<MailType, (data: any) => string>();

export const render = async (type: MailType, data: any): Promise<string> => {
  let renderer = TEMPLATES.get(type);
  if (!renderer) {
    const mjmlFile = resolveRelative(__dirname, `${type}.mjml`);
    const mjmlRaw = await readFile(mjmlFile, { encoding: 'utf8' });
    const { html, errors } = mjml2html(mjmlRaw, {
      minify: config.NODE_ENV === 'production',
      filePath: mjmlFile,
    });
    if (errors.length) {
      throw new Error(errors[0].message);
    }
    renderer = template(html);
    TEMPLATES.set(type, renderer);
  }
  if (!renderer) {
    throw new Error(`template ${type} not found`);
  }
  return renderer(data);
};
