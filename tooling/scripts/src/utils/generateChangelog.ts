import addStream from 'add-stream';
import conventionalChangelog from 'conventional-changelog';
import { createReadStream, createWriteStream } from 'fs';
import { readJsonSync, writeJsonSync } from 'fs-extra';
import { resolve } from 'path';
import simpleGit from 'simple-git/promise';
import stream from 'stream';
import tempfile from 'tempfile';
import { promisify } from 'util';
import { WWMeta } from './types';

const pipeline = promisify(stream.pipeline);

const TYPES: Record<string, string> = {
  feat: 'Features',
  fix: 'Bug Fixes',
  perf: 'Other',
  docs: 'Other',
  style: 'Other',
  refactor: 'Other',
  test: 'Other',
  build: 'Other',
  ci: 'Other',
};

const PRIORITIES = [TYPES.feat, TYPES.fix, 'Other'];

export const generateChangelog = async (path: string) => {
  if (!path) {
    throw new Error('Must provide initial hash and package directory');
  }
  const git = simpleGit();
  const currentHash = await git.revparse(['HEAD']);
  const pJsonPath = resolve(process.cwd(), path, 'package.json');
  const mJsonPath = resolve(process.cwd(), path, 'ww-meta.json');
  const changelogPath = resolve(process.cwd(), path, 'CHANGELOG.md');
  const meta: WWMeta = readJsonSync(mJsonPath);
  const pJson = readJsonSync(pJsonPath);
  const readStream = createReadStream(changelogPath);

  if (!meta.changelog) {
    throw new Error('ww-meta does not contain latest changelog hash');
  }

  const tmp = tempfile();

  await pipeline(
    conventionalChangelog(
      {
        preset: 'angular',
      },
      {
        version: pJson.version,
        host: 'https://github.com',
        owner: 'doomsower',
        repository: 'whitewater',
        previousTag: meta.changelog,
        currentTag: currentHash,
      },
      {
        from: meta.changelog,
        path: resolve(process.cwd(), path),
      },
      undefined,
      {
        transform: (commit: any) => {
          const type = TYPES[commit.type];
          if (!type) {
            return false;
          }
          commit.type = type;
          commit.scope = '';
          return commit;
        },
        groupBy: 'type',
        commitsSort: ['subject'],
        noteGroupsSort: 'title',
        commitGroupsSort: (a: any, b: any) => {
          const aInd = PRIORITIES.indexOf(a.title);
          const bInd = PRIORITIES.indexOf(b.title);
          return aInd - bInd;
        },
      },
    ),
    addStream(readStream),
    createWriteStream(tmp),
  );
  await pipeline(createReadStream(tmp), createWriteStream(changelogPath));
  await git.add(changelogPath);
  writeJsonSync(mJsonPath, { ...meta, changelog: currentHash }, { spaces: 2 });
};
