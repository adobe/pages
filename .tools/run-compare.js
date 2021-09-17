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

// @ts-check

import * as path from 'path';
import { cwd } from 'process';
import { rm } from 'fs/promises';
import { fileURLToPath } from 'url';
import screenshot from './compare/plugins/screenshot.js';
// import lighthouse from './compare/plugins/lighthouse.js';
import { compare } from './compare/index.js';
import { getStdOutFrom } from './util.js';
import pagelist from './pagelist.js';

// @ts-ignore
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// TODO: could be parameterized
const CURRENT_DOMAIN = 'hlx3.page';

// if defined, uses this for base URL construction
const BASE_ROOT_URL = 'https://pages.adobe.com';
// if root URL not defined, use branch and domain
// to construct base to compare against
const BASE_BRANCH = 'master';
const BASE_DOMAIN = 'hlx.page';

// root directory of output
const ROOT_DIR = '.comparisons';

/**
 * Make inputs object
 *
 * @param {string[]} routes
 * @param {string} currentDomain
 * @param {string} repoName
 * @param {string} currentOwner
 * @param {string} currentBranch
 * @param {string} [baseRootUrl] - If not defined, all 3 proceeding arguments must be defined
 * @param {string} [baseDomain]
 * @param {string} [baseOwner]
 * @param {string} [baseBranch]
 *
 * @returns {import('./compare/index.js').CompareInput}
 */
function makeInputs(
  routes,
  repoName,
  currentDomain,
  currentOwner,
  currentBranch,
  baseRootUrl,
  baseDomain,
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
      return `https://${currentBranch}--${repoName}--${currentOwner}.${currentDomain}/${route}`;
    }
    return baseRootUrl ? `${baseRootUrl}/${route}` : `https://${baseBranch}--${repoName}--${baseOwner}.${baseDomain}/${route}`;
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

(async () => {
  // TODO: get these from CLI params
  const baseDomain = BASE_DOMAIN;
  const baseOwner = 'adobe';
  const baseBranch = BASE_BRANCH;
  const baseRootUrl = BASE_ROOT_URL;

  const repoName = 'pages';
  const rootDir = path.resolve(cwd(), ROOT_DIR);

  // TODO: parse current branch and owner from the .git directory
  const currentDomain = CURRENT_DOMAIN;
  const currentOwner = 'adobe';
  const currentBranch = await getStdOutFrom('git branch --show-current');

  const input = makeInputs(
    pagelist,
    repoName,
    currentDomain,
    currentOwner,
    currentBranch,
    baseRootUrl,
    baseDomain,
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
      screenshot({
        fullPage: true,
        delay: 15,
        timeout: 260,
        removeElements: ['#onetrust-banner-sdk'],
        launchOptions: {
          userDataDir,
        },
      }),
      // lighthouse(),
    ],
  };

  await compare(compareOptions);
  await rm(userDataDir, { recursive: true, force: true });
})();
