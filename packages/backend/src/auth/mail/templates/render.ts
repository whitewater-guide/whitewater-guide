import { promises } from 'fs';
import template from 'lodash/template';
import mjml2html from 'mjml';
import { resolve } from 'path';

import { MailType } from '../types';
const { readFile } = promises;

const TEMPLATES = new Map<MailType, (data: any) => string>();

export const render = async (type: MailType, data: any): Promise<string> => {
  let renderer = TEMPLATES.get(type);
  if (!renderer) {
    const mjmlFile = resolve(__dirname, `${type}.mjml`);
    const mjmlRaw = await readFile(mjmlFile, { encoding: 'utf8' });
    const { html, errors } = mjml2html(mjmlRaw, {
      minify: process.env.NODE_ENV === 'production',
      filePath: mjmlFile,
    });
    if (errors.length) {
      throw errors[0];
    }
    renderer = template(html);
    TEMPLATES.set(type, renderer);
  }
  if (!renderer) {
    throw new Error(`template ${type} not found`);
  }
  return renderer(data);
};
