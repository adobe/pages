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

import { ContextFactory } from "./context.js";

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
   * @param {CompareOptions} options 
   * @param {string} rootDir
   */
  constructor(options, rootDir) {
    this.#factory = new ContextFactory(options, rootDir);
    this.#contexts = {};
  }

  /**
   * Get arguments array for lifecycle hook.
   * 
   * @param {PluginContext} ctx 
   * @param {string} hook 
   * @param {CompareOptions} options 
   * @returns {any[]}
   */
  argsForHook(ctx, hook, options) {
    switch(hook) {
      case 'run': return [options.input];
      default: return [];
    }
  }

  /**
   * Execute a lifecycle hook.
   * 
   * @param {string} hook
   * @param {CompareOptions} options 
   */
  async executeHook(hook, options) {
    for (let plugin of options.plugins) {
      if(hook in plugin) {
        let ctx = this.#contexts[plugin.name];
        if(!ctx) {
          ctx = this.#factory.makeContext(plugin);
          this.#contexts[plugin.name] = ctx;
        }
        await plugin[hook].call(ctx, ...this.argsForHook(ctx, hook, options));
      }
    }
  }
}