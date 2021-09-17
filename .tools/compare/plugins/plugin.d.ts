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

// eslint-disable-next-line import/no-cycle
import { CompareInput, CompareOptions } from '..';

export interface PluginContext {
  options: CompareOptions;
  startTime: string;
  name: string;
  rootDir: string;
  browser: any;
  emitFile(filename: string, data: Buffer | string | string[]): Promise<void>;
  log(...msgs: any[]): void;
  debug(...msgs: any[]): void;
  error(...msgs: any[]): void;
  info(...msgs: any[]): void;
  warn(...msgs: any[]): void;
}

export type StartHook = (this: PluginContext, options: CompareOptions) => any | Promise<any>;

export type RunHook = (this: PluginContext, input: CompareInput) => any | Promise<any>;

export interface ComparePluginHooks {
  start?: StartHook;
  run?: RunHook;
}

export interface ComparePlugin extends ComparePluginHooks {
  name: string;
}
