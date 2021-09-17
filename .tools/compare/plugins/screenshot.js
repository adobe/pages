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

import captureWebsite from 'capture-website';

/**
 * Type aliases
 *
 * @typedef {import('capture-website').Options} ScreenshotOptions
 * @typedef {import('./plugin').ComparePlugin} Plugin
 * @typedef {import('./plugin').PluginContext} PluginContext
 */

/**
 * Capture and write a screenshot.
 *
 * @param {PluginContext} ctx
 * @param {string} pageName - The page name, ie. "blog"
 * @param {string} versionName - The page version name, ie. base.html
 * @param {string} url
 * @param {ScreenshotOptions} [options]
 * @returns {Promise<void>}
 */
async function captureScreenshot(ctx, pageName, versionName, url, options = {}) {
  /** @type {ScreenshotOptions} */
  const opts = { type: 'png', ...options };

  return captureWebsite.buffer(url, {
    ...opts,
    // @ts-ignore
    _browser: ctx.browser,
    _keepAlive: true,
  }).then((buf) => {
    const filename = `${pageName}/${ctx.name}/${versionName}.${opts.type}`;
    ctx.info('Emitting file ', filename);
    return ctx.emitFile(filename, buf);
  });
}

/**
 * Capture screenshots.
 *
 * @param {ScreenshotOptions} [options]
 * @returns {Plugin}
 */
export default function screenshot(options) {
  return {
    name: 'screenshot',
    async run(input) {
      this.debug('run()');
      let proms = [];
      for (const [pageName, page] of Object.entries(input)) {
        for (const [versionName, url] of Object.entries(page)) {
          proms.push(captureScreenshot(this, pageName, versionName, url, options));
          if (proms.length > 4) {
            // batch 5 concurrency
            // eslint-disable-next-line no-await-in-loop
            await Promise.all(proms);
            proms = [];
          }
        }
      }
    },
  };
}
