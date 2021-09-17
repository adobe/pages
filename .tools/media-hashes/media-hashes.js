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

import { fetch, reset as resetContext } from '@adobe/helix-fetch';
import { JSDOM } from 'jsdom';
import { spawn } from 'child_process';
import { join } from 'path';

/**
 * @typedef {Object} MediaHashmapOptions
 * @property {'json' | 'csv' | 'tsv' | 'ssv'} [format='ssv'] - json or comma/tab/space separated
 * @property {boolean} [copy=false] - copy to clipboard, mac only
 */

/**
 * Parse dom string into map of filename -> hash
 * @param {string} str
 * @param {string} basePath
 * @returns {Record<string,string>}
 */
function parseMediaTable(str, basePath) {
  /** @type {Record<string,string>} */
  const mapped = {};
  const dom = new JSDOM(str);

  const tableBody = dom.window.document.querySelector('.static-media > div > div > table > tbody');
  if (!tableBody) return mapped;

  const rows = tableBody.querySelectorAll('tr');
  rows.forEach((row) => {
    const [keyCell, valCell] = Array.from(row.children);
    if (!keyCell || !valCell) return;

    const keyEl = keyCell.querySelector('p');
    const valEl = valCell.querySelector('p > picture > source');
    if (!keyEl || !valEl) return;

    const key = join(basePath, keyEl.innerHTML);
    const value = valEl.getAttribute('srcset').split('?')[0];

    mapped[key.trim()] = value.trim();
  });
  return mapped;
}

/**
 * Transform to csv if needed.
 *
 * @param {Record<string,string>} mapObj
 * @param {MediaHashmapOptions} opts
 * @returns {any}
 */
function transform(mapObj, opts) {
  if (opts.format === 'json') {
    return mapObj;
  }

  const delim = opts.format === 'csv' ? ',' : '\t';

  return Object.entries(mapObj).map(([k, v]) => `${k}${delim}${v}`).join('\n');
}

/**
 * Copy something to clipboard, works on osx
 * @param {string} cp - string or data to copy
 * @returns {string}
 */
function osxClipboard(cp) {
  const proc = spawn('pbcopy');
  proc.stdin.write(cp);
  proc.stdin.end();
  return cp;
}

/**
 * Provided with a path to a doc that contains a table with 2 columns: filename and asset
 * This fetches the doc as html and returns a JSON object mapping filename -> asset hash
 * @param {string} path
 * @param {MediaHashmapOptions} options
 * @returns {Promise<Record<string,string>>}
 */
export default function fetchMediaHashmap(path, options = {}) {
  const opts = { ...options };
  if (!opts.format) opts.format = 'tsv';

  const p = path.startsWith('/') ? path.substr(1) : path;
  const url = `https://main--pages--adobe.hlx3.page/${p}`;
  return fetch(url, { method: 'GET' }).then((res) => {
    if (!res.ok) {
      throw res;
    }
    return res.text();
  })
    .then((t) => parseMediaTable(t, path))
    .then((o) => transform(o, opts))
    .then((o) => (opts.copy ? osxClipboard(o) : o))
    .catch((e) => {
      console.error('Failed to fetch: ', e);
    })
    .finally(resetContext);
}
