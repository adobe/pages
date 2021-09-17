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

/* eslint-disable import/no-cycle, import/no-extraneous-dependencies */

import { PuppeteerNodeLaunchOptions } from 'puppeteer';
import { ComparePlugin } from './plugins/plugin';

export * from './plugins/plugin';

/**
 * CompareInput
 * Maps page name to an object mapping version name to URL.
 *
 * @example
 * ```
 * {
 *   home: {
 *     base: 'https://example.com/home',
 *     source: 'https://localhost:1337/home'
 *   },
 *   blog: {
 *     prod: 'https://example.com/blog',
 *     stage: 'https://example-stage.com/blog',
 *     dev: 'https://localhost:1337/blog'
 *   }
 * }
 * ```
 */
export type CompareInput = Record<string, Record<string, string>>;
/**
 * Output options
 */
export interface CompareOutput {
  root: string;
}
/**
 * Collected options object
 * This is the input to `compare()`
 */
export interface CompareOptions {
  plugins?: ComparePlugin[];
  input: CompareInput;
  output?: CompareOutput;
  launchOptions?: PuppeteerNodeLaunchOptions;
}

/**
* Main tool entrypoint.
*
* @example
* ```
* await compare({
*   plugins: [
*     lighthouse({
*       output: 'html'
*     })
*   ],
*   input: {
*     home: {
*       base: 'https://example.com/home',
*       source: 'https://localhost:1337/home'
*     },
*     blog: {
*       prod: 'https://example.com/blog',
*       stage: 'https://example-stage.com/blog',
*       dev: 'https://localhost:1337/blog'
*     }
*   },
*   output: {
*     root: './.compare'
*   }
* });
*
* // output tree
* ./.compare
* ├── blog
* │   └── lighthouse
* │       ├── base.html
* │       └── source.html
* └── home
*     └── lighthouse
*         ├── dev.html
*         ├── prod.html
*         └── stage.html
* ```
*
* @param {CompareOptions} options
*/
export declare async function compare(options);
