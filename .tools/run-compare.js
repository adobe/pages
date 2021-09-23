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

/* eslint-disable no-underscore-dangle */

/* eslint-disable-next-line import/no-extraneous-dependencies */
import yargs from 'yargs';

// @ts-check
import * as path from 'path';
import { cwd } from 'process';
import { rm } from 'fs/promises';
import { fileURLToPath } from 'url';
import screenshot from './compare/plugins/screenshot.js';
import lighthouse from './compare/plugins/lighthouse.js';
import { compare } from './compare/index.js';
import { getOpt, getStdOutFrom } from './util.js';

const { argv } = yargs(process.argv);

// @ts-ignore
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DEFAULT_HOST = 'hlx3.page';
const DEFAULT_OWNER = 'adobe';
const DEFAULT_REPO = 'pages';

const DEFAULT_BASE_BRANCH = 'main';
const DEFAULT_OUTPUT_PATH = '.comparisons';
const DEFAULT_PAGELIST_PATH = path.resolve(__dirname, './pagelist.js');

const PLUGIN_LIST = ['screenshot', 'lighthouse']; // possible values for plugins
const DEFAULT_PLUGINS = 'screenshot'; // or 'screenshot,lighthouse'

/**
 * Make inputs object
 *
 * @param {string[]} routes
 * @param {string} repoName
 * @param {string} [currentRootUrl] - If not defined, all 3 proceeding arguments must be defined
 * @param {string} [currentHost]
 * @param {string} [currentOwner]
 * @param {string} [currentBranch]
 * @param {string} [baseRootUrl] - If not defined, all 3 proceeding arguments must be defined
 * @param {string} [baseHost]
 * @param {string} [baseOwner]
 * @param {string} [baseBranch]
 *
 * @returns {import('./compare/index.js').CompareInput}
 */
function makeInputs(
  routes,
  repoName,
  currentRootUrl,
  currentHost,
  currentOwner,
  currentBranch,
  baseRootUrl,
  baseHost,
  baseOwner,
  baseBranch,
) {
  /**
   *
   * @param {string} route
   * @param {boolean} [isCurrent]
   *
   * @returns {string}
   */
  const templateRoute = (route, isCurrent) => {
    if (isCurrent) {
      return currentRootUrl ? `${currentRootUrl}/${route}` : `https://${currentBranch}--${repoName}--${currentOwner}.${currentHost}/${route}`;
    }
    return baseRootUrl ? `${baseRootUrl}/${route}` : `https://${baseBranch}--${repoName}--${baseOwner}.${baseHost}/${route}`;
  };

  return routes.reduce((prev, curr) => {
    let route = curr;
    if (route.startsWith('/')) route = route.substr(1);

    let pageName = route.replace(/\//g, '--');
    if (pageName.endsWith('-')) pageName = pageName.substr(0, pageName.length - 1);

    prev[pageName] = {
      current: templateRoute(route, true),
      base: templateRoute(route, false),
    };
    return prev;
  }, {});
}

/**
 * @example
 * ```sh
 * npm run compare -- \
 *  [--baseHost="hlx3.page"] \
 *  [--baseOwner="adobe"] \
 *  [--baseBranch="main"] \
 *  [--baseRootUrl="https://my-outer-cdn.com"] \
 *  [--currentHost="hlx3.page"] \
 *  [--currentOwner="adobe"] \
 *  [--currentBranch="my-feature"]
 *  [--currentRootUrl="..."]
 *  [--repoName="pages"]
 *  [--output="./.comparisons"]
 *  [--pagelist="./.tools/pagelist.js"]
 *  [--page="/stock/en/advocates/index"]
 *  [--plugins="screenshot,lighthouse"]
 * ```
 */
(async () => {
  const baseHost = getOpt(argv, 'baseHost', false) || DEFAULT_HOST;
  const baseOwner = getOpt(argv, 'baseOwner', false) || DEFAULT_OWNER;
  const baseBranch = getOpt(argv, 'baseBranch', false) || DEFAULT_BASE_BRANCH;
  const baseRootUrl = getOpt(argv, 'baseRootUrl', false) || undefined;

  const currentHost = getOpt(argv, 'currentHost', false) || DEFAULT_HOST;
  const currentOwner = getOpt(argv, 'currentOwner', false) || DEFAULT_OWNER;
  const currentBranch = getOpt(argv, 'currentBranch', false) || await getStdOutFrom('git branch --show-current');
  const currentRootUrl = getOpt(argv, 'currentRootUrl', false) || undefined;

  const repoName = getOpt(argv, 'repo', false) || DEFAULT_REPO;

  const outputPath = getOpt(argv, 'output', false) || DEFAULT_OUTPUT_PATH;
  const rootDir = path.resolve(cwd(), outputPath);

  // Pages to run on, array of strings from a .js file or a single page as CLI arg
  let pagelistPath = getOpt(argv, 'pagelist', false) || DEFAULT_PAGELIST_PATH;
  const page = getOpt(argv, 'page', false) || undefined;
  let pagelist = [];
  if (typeof page === 'string') {
    // if using `page`, only run on that route
    pagelist = [page];
  } else {
    // otherwise import the pagelist
    pagelistPath = path.resolve(cwd(), pagelistPath);
    pagelist = (await import(pagelistPath)).default;
  }

  // Plugins to use, array of strings
  let plugins = getOpt(argv, 'plugins', false) || DEFAULT_PLUGINS;
  plugins = plugins.split(',').filter((p) => !!p).map((p) => p.trim().toLowerCase());
  plugins.forEach((p) => {
    if (!PLUGIN_LIST.includes(p)) {
      console.error('Invalid plugin: ', p);
      console.error('Possible plugins: ', PLUGIN_LIST);
      process.exit(1);
    }
  });

  const input = makeInputs(
    pagelist,
    repoName,
    currentRootUrl,
    currentHost,
    currentOwner,
    currentBranch,
    baseRootUrl,
    baseHost,
    baseOwner,
    baseBranch,
  );

  // console.debug('===== Input ===== \n'
  // + `${JSON.stringify(input, undefined, 2)} \n`
  // + '================');

  // @ts-ignore
  const userDataDir = path.resolve(__dirname, '.compare-env');

  /** @type {import('./compare/index.js').CompareOptions} */
  const compareOptions = {
    input,
    output: {
      root: rootDir,
    },
    plugins: [

      plugins.includes('screenshot') && screenshot({
        fullPage: true,
        delay: 15,
        timeout: 260,
        removeElements: ['#onetrust-banner-sdk'],
        launchOptions: {
          userDataDir,
        },
      }),

      plugins.includes('lighthouse') && lighthouse(),

    ].filter(Boolean),
  };

  await compare(compareOptions);
  await rm(userDataDir, { recursive: true, force: true });
})();
