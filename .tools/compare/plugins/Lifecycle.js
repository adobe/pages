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

import { ContextFactory } from './Context.js';

/**
 * Aliases
 * @typedef {import("..").PluginContext} PluginContext
 * @typedef {import("./plugin").ComparePluginHooks} PluginHooks
 * @typedef {import("..").CompareOptions} CompareOptions
 */

export class Lifecycle {
  static hooks = ['start', 'run'];

  /**
   * @type {ContextFactory}
   */
  #factory;

  /**
   * @type {Record<string, PluginContext>}
   */
  #contexts;

  /**
   * @type {CompareOptions}
   */
  #options;

  /**
   * @type {any}
   */
  #browser;

  /**
   * @param {CompareOptions} options
   * @param {string} rootDir
   * @param {any} browser
   */
  constructor(options, rootDir, browser) {
    this.#options = options;
    this.#browser = browser;
    this.#factory = new ContextFactory(options, rootDir, browser);
    this.#contexts = {};
  }

  /**
   * Get arguments array for lifecycle hook.
   *
   * @param {PluginContext} ctx
   * @param {string} hook
   * @returns {any[]}
   */
  argsForHook(ctx, hook) {
    switch (hook) {
      case 'run': return [this.#options.input];
      default: return [];
    }
  }

  /**
   * Execute a lifecycle hook.
   *
   * @param {string} hook
   */
  async executeHook(hook) {
    for (const plugin of this.#options.plugins) {
      if (hook in plugin) {
        let ctx = this.#contexts[plugin.name];
        if (!ctx) {
          ctx = this.#factory.makeContext(plugin);
          this.#contexts[plugin.name] = ctx;
        }
        // eslint-disable-next-line no-await-in-loop
        await plugin[hook].call(ctx, ...this.argsForHook(ctx, hook));
      }
    }
  }
}

export default Lifecycle;
