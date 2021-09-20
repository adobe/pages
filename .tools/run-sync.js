/*
 * Copyright 2021 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

/* eslint-disable import/no-extraneous-dependencies, no-console */

import yargs from 'yargs';
import { LocalSync } from './content-sync/content-sync.js';
import { getOpt } from './util.js';

const { argv } = yargs(process.argv);

/**
 * @example
 * ```sh
 * npm run sync -- "/Volumes/GoogleDrive/My Drive/pages" \
 *  [--glob="*.*"] \
 *  [--branch="main"] \
 *  [--env="preview"] \
 *  [--owner="adobe"] \
 *  [--repo="pages"]
 * ```
 */

(() => {
  const startTime = Date.now();

  // positional
  const rootPath = argv._[2];
  if (typeof rootPath !== 'string') {
    console.error('Invalid root path.');
    process.exit(1);
  }

  // flags
  const repo = getOpt(argv, 'repo', false) || 'pages';
  const owner = getOpt(argv, 'owner', false) || 'adobe';
  const env = getOpt(argv, 'env', false, 'string') || 'preview';
  const startDir = getOpt(argv, 'startDir', false);
  const branch = getOpt(argv, 'branch', false);
  const glob = getOpt(argv, 'glob', false);
  const recursive = getOpt(argv, 'recursive', false, 'boolean');

  /** @type {import('./content-sync/content-sync.js').LocalSyncOptions} */
  const opts = {
    rootPath,
    repo,
    owner,
    startDir,
    branch,
    glob,
    recursive,
    env,
  };

  const sync = LocalSync(opts);

  sync.onprogress(() => {
    process.stdout.write('.');
  });

  return sync.then(({ failed, synced }) => {
    process.stdout.write('\n');
    const fLen = failed.length;
    const sLen = synced.length;

    if (failed && failed.length > 0) {
      console.error(`❌ ${fLen}/${sLen + fLen} requests failed: \n ${JSON.stringify(failed, undefined, 2)}`);
      process.exit(1);
    }

    const dur = Date.now() - startTime;
    console.log(`✨ Synced ${sLen} files in ${dur / 1000}s`);
  });
})();
