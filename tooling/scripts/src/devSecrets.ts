import { parse } from 'dotenv';
import {
  closeSync,
  openSync,
  readdirSync,
  readFileSync,
  statSync,
  writeFileSync,
} from 'fs';
import JSZip from 'jszip';
import { basename, resolve } from 'path';
// @ts-ignore
import entropy from 'string-entropy';
import { info } from './utils';

// tslint:disable:no-console

const TOP_LEVEL_DIRS = ['config', 'packages', 'services', 'tooling'];

const listRecursive = (
  dir: string,
  envs: Map<string, object>,
  depth: number,
) => {
  const content = readdirSync(dir);
  for (const item of content) {
    const itemPath = resolve(dir, item);
    const stats = statSync(itemPath);
    if (
      stats.isFile() &&
      (item === '.env.development' || item === '.env.test')
    ) {
      envs.set(itemPath, parse(readFileSync(itemPath)));
    }
    if (stats.isDirectory() && depth > 0) {
      listRecursive(itemPath, envs, depth - 1);
    }
  }
};

const generateEmptiesRecursive = (dir: string, depth: number) => {
  const content = readdirSync(dir);
  for (const item of content) {
    const itemPath = resolve(dir, item);
    const stats = statSync(itemPath);
    if (stats.isFile() && item === '.env.development.secret') {
      const devLocal = resolve(dir, '.env.development.local');
      info(`Generated ${devLocal}`);
      closeSync(openSync(devLocal, 'w'));
    } else if (stats.isFile() && item === '.env.test.secret') {
      const testLocal = resolve(dir, '.env.test.local');
      info(`Generated ${testLocal}`);
      closeSync(openSync(testLocal, 'w'));
    } else if (stats.isDirectory() && depth > 0) {
      generateEmptiesRecursive(itemPath, depth - 1);
    }
  }
};

const WHITELIST_VALUES = ['http://', 'https://', 'localhost'];
const WHITELIST_KEYS = ['CORS_WHITELIST', 'FB_SECRET'];
const BLACKLIST_KEYS = [
  'MAILCHIMP_LIST_ID',
  'CADDY_TLS_EMAIL',
  'ADMINER_USERNAME',
  'ADMINER_PASSWORD',
  'SWITZERLAND_USER',
  'SWITZERLAND_PASSWORD',
];
const MAX_ENTROPY = 150;

const shouldWipe = (key: string, value = ''): boolean => {
  if (WHITELIST_VALUES.some((white) => value.indexOf(white) >= 0)) {
    return false;
  }
  if (BLACKLIST_KEYS.indexOf(key) >= 0) {
    return true;
  }
  if (entropy(value) > MAX_ENTROPY) {
    return WHITELIST_KEYS.indexOf(key) === -1;
  }
  return false;
};

const wipeSecrets = (filepath: string): string => {
  const env = parse(readFileSync(filepath, { encoding: 'utf8' }));
  let result = '';
  for (const [key, value] of Object.entries(env)) {
    let val = value;
    if (shouldWipe(key, value)) {
      val = '';
    }
    result = `${result}${key}=${val}\n`;
  }
  return result;
};

const zipRecursive = (dir: string, zip: JSZip, depth: number) => {
  const content = readdirSync(dir);
  const folder = zip.folder(basename(dir));
  for (const item of content) {
    const itemPath = resolve(dir, item);
    const stats = statSync(itemPath);
    if (
      stats.isFile() &&
      (item === '.env.development' || item === '.env.test')
    ) {
      folder.file(item + '.local', wipeSecrets(itemPath));
    }
    if (stats.isDirectory() && depth > 0) {
      zipRecursive(itemPath, folder, depth - 1);
    }
  }
};

// tslint:disable-next-line:no-unused-expression no-var-requires
require('yargs')
  .usage(
    `
    Utility to share secrets without gpg.
    
    Has two commands.
    
    If you have git secret gpg key, then after checking out from git, run 'gen-empty' command.
    It'll generate empty .env.development.local files. They are necessary, because docker fails when env file are missing.
    
    If you don't have git secret gpg key, then someone who has needs to generate zip archive with .env.development.local files and pass it to you.
    'zip' command is used to generate this archive. It'll wipe some secrets, but not all, see code above.
  `,
  )
  .command(
    ['gen-empty', '$0'],
    'generate empty .env.development.local files',
    {},
    () => {
      for (const tld of TOP_LEVEL_DIRS) {
        generateEmptiesRecursive(resolve(process.cwd(), tld), 1);
      }
    },
  )
  .command(
    'list',
    'lists all env variables in all .env.development files',
    {},
    () => {
      const allEnvs = new Map<string, object>();
      for (const tld of TOP_LEVEL_DIRS) {
        listRecursive(resolve(process.cwd(), tld), allEnvs, 1);
      }
      for (const [file, env] of allEnvs) {
        info(file);
        for (const [key, val] of Object.entries(env)) {
          info(`\t${key}=${val}\t${entropy(val)}`);
        }
      }
    },
  )
  .command(
    'zip',
    'generate zip archive with .env.development.local files',
    {},
    async () => {
      const zip = new JSZip();
      for (const tld of TOP_LEVEL_DIRS) {
        zipRecursive(resolve(process.cwd(), tld), zip, 1);
      }
      const buff = await zip.generateAsync({ type: 'nodebuffer' });
      writeFileSync(resolve(process.cwd(), 'secrets.zip'), buff);
    },
  )
  .help().argv;
