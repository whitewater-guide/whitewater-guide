import { argv } from 'yargs';
import { generateChangelog } from './utils';

generateChangelog(argv.path as any);
