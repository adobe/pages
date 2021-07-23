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

// @ts-check

import screenshot from './compare/plugins/screenshot.js';
import lighthouse from './compare/plugins/lighthouse.js';
import { compare } from './compare/index.js';
import { getStdOutFrom } from './compare/process.js';
import * as path from 'path';
import { cwd } from 'process';
import pagelist from './pagelist.js';

// TODO: could be parameterized
const DOMAIN = 'hlx.page';
// branch to compare current branch to
const BASE_BRANCH = 'master';
// root directory of output
const ROOT_DIR = '.comparisons';

/**
 * Make inputs object
 * 
 * @param {string[]} routes 
 * @param {string} domain 
 * @param {string} repoName 
 * @param {string} currentOwner 
 * @param {string} currentBranch 
 * @param {string} baseOwner 
 * @param {string} baseBranch 
 * @returns {import('./compare/index.js').CompareInput}
 */
function makeInputs(routes, domain, repoName, currentOwner, currentBranch, baseOwner, baseBranch) {
  /**
   * 
   * @param {string} route 
   * @param {boolean} [isCurrent]
   * 
   * @returns {string}
   */
  const templateRoute = (route, isCurrent) => `https://${isCurrent ? currentBranch : baseBranch}--${repoName}--${isCurrent ? currentOwner : baseOwner}.${domain}/${route}`;

  return routes.reduce((prev, curr) => {
    let route = curr;
    if(route.startsWith('/')) route = route.substr(1);

    let pageName = route.replace(/\//g, '-');
    if(pageName.endsWith('-')) pageName = pageName.substr(0, pageName.length - 1);

    prev[pageName] = {
      current: templateRoute(route, true),
      base: templateRoute(route, false)
    }
    return prev;
  }, {});
}

(async () => {
  // TODO: get these from CLI params
  const domain = DOMAIN;
  const baseOwner = 'adobe';
  const baseBranch = BASE_BRANCH;
  const repoName = 'pages';
  const rootDir = path.resolve(cwd(), ROOT_DIR);

  // TODO: parse current branch and owner from the .git directory
  const currentOwner = 'adobe';
  const currentBranch = await getStdOutFrom('git branch --show-current');

  const input = makeInputs(pagelist, domain, repoName, currentOwner, currentBranch, baseOwner, baseBranch);

  console.log('input: ', input);

  /** @type {import('./compare/index.js').CompareOptions} */
  const compareOptions = {
    input,
    output: {
      root: rootDir
    },
    plugins: [
      screenshot({
        fullPage: true,
        delay: 20,
        timeout: 180,
        removeElements: ['#onetrust-banner-sdk']
      }),
      lighthouse()
    ]
  }

  await compare(compareOptions);

})();