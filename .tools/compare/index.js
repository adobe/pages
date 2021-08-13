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

/* eslint-disable import/no-extraneous-dependencies */

import puppeteer from 'puppeteer';
import { mkdir } from 'fs/promises';
import * as path from 'path';
import { cwd } from 'process';
import { Lifecycle } from './plugins/Lifecycle.js';

/**
 * Aliases
 * @typedef {import('./index').ComparePlugin} Plugin
 * @typedef {import('./index').CompareOptions} Options
 * @typedef {import('./index').CompareInput} Input
 * @typedef {import('./plugins/plugin').PluginContext} PluginContext
 */

/**
 * Make output directory if not exist
 * Make subdirectory for current run if not exist
 * Make subdirectory for each step if not exist
 *
 * @param {string} rootDir - Output root, resolved to absolute
 * @param {Input} input - Input object
 */
async function prepOutputDir(rootDir, input, plugins) {
  await mkdir(rootDir, { recursive: true });

  /** @type {Promise<void>[]} */
  const collector = [];

  Object.keys(input).reduce((proms, page) => {
    proms.concat(plugins.map((p) => {
      const pPath = path.resolve(rootDir, page, p.name);
      return mkdir(pPath, { recursive: true });
    }));
    return proms;
  }, collector);
  return Promise.all(collector);
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
 * @param {Options} options
 */
export async function compare(options) {
  const { output, input, plugins } = options;
  const rootDir = path.resolve(cwd(), output.root);

  await prepOutputDir(rootDir, input, plugins);

  const browser = await puppeteer.launch({});
  const lifecycle = new Lifecycle(options, rootDir, browser);

  for (const hook of Lifecycle.hooks) {
    // eslint-disable-next-line no-await-in-loop
    await lifecycle.executeHook(hook);
  }
}

export default compare;
