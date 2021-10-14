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
/* eslint-disable no-await-in-loop, import/no-extraneous-dependencies */

// @ts-ignore
import { fetch, reset as resetContext } from '@adobe/helix-fetch';
import path from 'path';
import glob from 'glob-promise';
import { cwd } from 'process';

const BATCH = 5; // # reqs to make per batch
const THROTTLE = 1000; // ms to wait between batches
// cloud to helix extension map
const EXT_MAP = {
  docx: 'md',
  xlsx: 'json',
  gsheet: 'json',
  gdoc: 'md',
};
const ENVS = ['preview', 'publish', 'code', 'live'];

/**
 * Get a promise that resolves in some duration
 * @param {number} duration
 * @returns
 */
function sleep(duration) {
  return new Promise((resolve) => {
    setTimeout(resolve, duration);
  });
}

/**
 * Transform a path that may end in a cloud format
 * into the corresponding transformed type.
 * @param {string} p
 * @returns {string}
 */
function cloudExtToHelix(p) {
  const ext = path.extname(p).substr(1);
  const newExt = EXT_MAP[ext];
  if (!newExt) return p;
  return `${p.substr(0, p.lastIndexOf('.'))}.${newExt}`;
}

/**
 * @param {import("./content-sync").LocalSyncOptions} opts
 * @returns {Promise<string[]>}
 */
async function getPaths(opts) {
  const { startDir: s = '.', glob: g = '**/*' } = opts;
  let paths = await glob(path.resolve(cwd(), opts.rootPath, s, g));

  // turn the paths into relative from opts.rootPath,
  // remove directories, transform extension if needed
  paths = paths.reduce((collector, p) => {
    const ext = path.extname(p);
    if (!ext) return collector;

    const newP = cloudExtToHelix(path.relative(opts.rootPath, p));
    collector.push(newP);
    return collector;
  }, []);

  return paths;
}

/**
 *
 * @param {import("./content-sync").LocalSyncOptions} options
 * @returns {import("./content-sync").LocalSync}
 */
// eslint-disable-next-line import/prefer-default-export
export function LocalSync(options) {
  const opts = { ...options };

  if (typeof opts !== 'object') {
    throw new Error('Invalid options');
  }
  ['rootPath', 'repo', 'owner'].forEach((o) => {
    if (typeof opts[o] !== 'string') {
      throw new Error(`${o} missing or invalid, expected string.`);
    }
  });
  if (!(ENVS.includes(opts.env))) {
    throw new Error(`Invalid env, must be one of: ${ENVS.join(', ')}`);
  }

  // clean up options
  if (!path.isAbsolute(opts.rootPath)) opts.rootPath = path.resolve(cwd(), opts.rootPath);
  opts.env = opts.env || 'preview';
  opts.branch = opts.branch || 'main';

  let running = true;
  let progressCbs = [];
  /** @type {import('./content-sync').FailedResponse[]} */
  const failed = [];
  /** @type {import('./content-sync').SuccessEntry[]} */
  const synced = [];
  /** @type {() => void} */
  let resolve;
  /** @type {(reason: string|Error) => void} */
  let reject;

  /** @type {import("./content-sync").LocalSync} */
  // @ts-ignore
  const prom = new Promise((res, rej) => {
    const cleanup = () => {
      running = false;
      progressCbs = [];
      resetContext();
    };

    resolve = () => {
      cleanup();
      res({ failed, synced });
    };

    reject = (reason) => {
      cleanup();
      /** @type {any} */
      const err = typeof reason === 'object' ? reason : new Error(reason);
      err.failed = failed;
      err.synced = synced;
      rej(err);
    };
  });
  prom.cancel = (reason) => {
    reject(reason || 'Aborted');
  };
  prom.onprogress = (cb) => {
    const ind = progressCbs.push(cb) - 1;
    return () => {
      delete progressCbs[ind];
    };
  };

  /**
   * Notify progress handlers
   * @param {number} c - complete
   * @param {number} t - total
   */
  function notifyProgress(c, t) {
    progressCbs.forEach((h) => {
      if (h) h.call(undefined, c, t);
    });
  }

  (async () => {
    const paths = await getPaths(opts);
    let proms = [];

    let i = 1;
    const len = paths.length;
    for (const p of paths) {
      if (!running) return;

      const url = `https://admin.hlx3.page/${opts.env}/${opts.owner}/${opts.repo}/${opts.branch}/${p}`;
      console.debug(`POST ${url}`);
      proms.push(
        fetch(url, { method: 'POST' }).then((res) => {
          if (!res.ok) {
            failed.push({
              path: p,
              status: res.status,
              url: res.url,
              headers: res.headers,
            });
          } else {
            synced.push({ path: p });
          }
        }).catch(reject),
      );

      if (proms.length >= BATCH) {
        await Promise.all(proms);
        notifyProgress(i, len);
        proms = [];
        await sleep(THROTTLE);
      }
      i += 1;
    }
    if (running) Promise.all(proms).then(resolve);
  })();

  // @ts-ignore
  return prom;
}
