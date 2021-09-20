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
/* eslint-disable import/prefer-default-export */

import { exec } from 'child_process';

/**
 * Get stdout produced from executing some command.
 *
 * @param {string} cmd Command to execute
 */
export function getStdOutFrom(cmd) {
  return new Promise((resolve, reject) => {
    exec(cmd, (err, stdout, stderr) => {
      if (err) {
        reject(new Error(`Error executing command: ${cmd} \n ${err} \n ${stderr}`));
      }
      resolve(stdout ? stdout.trim() : '');
    });
  });
}

/**
 * Validate option and return if valid
 * @param {string} opt
 * @param {boolean} [required=true]
 * @param {string} [type='string']
 * @returns {any}
 */
export function getOpt(argv, opt, required = true, type = 'string') {
  const val = argv[opt];
  if (!required && val == null) {
    return val;
  }
  // eslint-disable-next-line valid-typeof
  if (typeof val !== type) {
    console.error(`Invalid param '${opt}'. Expected ${type}, got ${typeof val}.`);
    process.exit(1);
  }
  return val;
}
