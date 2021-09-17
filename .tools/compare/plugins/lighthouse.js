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

import lighthousesdk from 'lighthouse';
import chromeLauncher from 'chrome-launcher';

/**
 * @typedef {import('lighthouse/types/externs')} LH
 * @typedef {LH.Flags} LighthouseOptions
 * @property {'info'|'debug'|'error'} [logLevel]
 * @property {number} [port]
 */

/**
 * Type aliases
 * @typedef {import('./plugin').ComparePlugin} Plugin
 * @typedef {import('./plugin').PluginContext} PluginContext
 */

/**
 *
 * @param {PluginContext} ctx
 * @param {string} pageName - The page name, ie. "blog"
 * @param {string} versionName - The page version name, ie. base.html
 * @param {string} url
 * @param {LighthouseOptions} [options]
 * @returns {Promise<void>}
 */
async function captureLighthouse(ctx, pageName, versionName, url, chrome, options = {}) {
  /** @type {LighthouseOptions} */
  const defaults = {
    output: 'html',
    onlyCategories: ['performance'],
    port: chrome.port,
  };
  const opts = Object.assign(defaults, options);
  const result = await lighthousesdk(url, opts);
  // ctx.debug(`Lighthouse result for ${result.lhr.finalUrl}: `, result.lhr);

  const filename = `${pageName}/${ctx.name}/${versionName}.${opts.output}`;
  ctx.info('Emitting file ', filename);

  // don't wait for this to complete, the promise will resolved before Node exits
  ctx.emitFile(filename, result.report).catch((e) => ctx.error('[Lighthouse] Error writing report: ', e));
}

/**
 * Capture lighthouse reports.
 * Write them to their respective directories in /.comparisons/${now}/lighthouse
 *
 * @param {LighthouseOptions} [options]
 * @this {Context}
 * @returns {Plugin}
 */
export default function lighthouse(options) {
  return {
    name: 'lighthouse',
    async run(input) {
      this.debug('run()');

      const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless'] });
      for (const [pageName, page] of Object.entries(input)) {
        for (const [versionName, url] of Object.entries(page)) {
          // wait for each to complete
          // takes longer, but more accurate measurements
          // since we aren't bogging down the network.
          // eslint-disable-next-line no-await-in-loop
          await captureLighthouse(this, pageName, versionName, url, chrome, options);
        }
      }

      await chrome.kill();
    },
  };
}
