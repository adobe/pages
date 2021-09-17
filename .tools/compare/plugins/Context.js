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

import * as path from 'path';
import { writeFile } from 'fs/promises';

/**
 * Aliases
 * @typedef {import('..').CompareOptions} CompareOptions
 * @typedef {import('./plugin').ComparePlugin} Plugin
 * @typedef {import('..').PluginContext} Context
 */

export class ContextFactory {
  /**
   * @type {string}
   */
   #rootDir;

  /**
   * @type {string}
   */
  #startTime;

  /**
   * @type {any}
   */
  #browser;

  /**
   *
   * @param {CompareOptions} options
   * @param {string} rootDir
   * @param {any} browser
   */
  constructor(options, rootDir, browser) {
    this.#startTime = new Date().toISOString();
    this.#rootDir = rootDir;
    this.#browser = browser;
    this.options = options;
  }

  /**
   * Make plugin context for specific plugin.
   *
   * @param {Plugin} plugin - Plugin option entry
   * @returns {Context}
   */
  makeContext(plugin) {
    /**
     *
     * @param {string} filename
     * @param {string | Buffer} data
     * @returns {Promise<any>}
     */
    const emitFile = async (filename, data) => {
      writeFile(path.resolve(this.#rootDir, filename), data);
    };

    const loggerPrefix = `[${plugin.name}]`;
    return {
      options: this.options,
      startTime: this.#startTime,
      rootDir: this.#rootDir,
      name: plugin.name,
      emitFile,
      browser: this.#browser,
      log: console.log.bind(console, loggerPrefix),
      debug: console.debug.bind(console, loggerPrefix),
      error: console.error.bind(console, loggerPrefix),
      warn: console.warn.bind(console, loggerPrefix),
      info: console.info.bind(console, loggerPrefix),
    };
  }
}

export default ContextFactory;
