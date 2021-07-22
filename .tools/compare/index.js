// @ts-check

/**
 * Simple script to compare each page in pagelist.js
 * between currently checked out branch and BASE_BRANCH
 * and save some output to the directory `/.comparisons/${now}/${step}/`
 */

import pagelist from './pagelist.js';
import { getStdOutFrom } from './process.js';
import { Ctx } from './context.js';
import { mkdir } from 'fs/promises';
import * as path from 'path';
import { cwd } from 'process';

// TODO: could be parameterized
const DOMAIN = 'hlx.page';
// branch to compare current branch to
const BASE_BRANCH = 'master';
// root directory of output
const ROOT_DIR = '.comparisons';
// steps to run
const STEPS = ['screenshot'];


/**
 * Log error
 * 
 * @param {import('./context.js').Context} ctx
 * @param {any} err
 */
function logError(ctx, err) {
  console.error(`Error in ${ctx.step}: \n ${err} \n\n ${err.stack}`);
}

/**
 * Make output directory if not exist
 * Make subdirectory for current run if not exist
 * Make subdirectory for each step if not exist
 * 
 * @param {string} now - datetime string
 * @param {string[]} steps - steps to make subdirs for
 * @returns {Promise<any[]>}
 */
async function prepOutputDir(rootDir, now, steps) {
  await mkdir(`${rootDir}/${now}`, {recursive: true});
  return Promise.all(steps.map((s) => mkdir(`${rootDir}/${now}/${s}`)));
}


(async () => {
  const now = new Date().toISOString();

  // TODO: parameterize things
  const steps = STEPS;
  const domain = DOMAIN;
  const baseOwner = 'adobe';
  const baseBranch = BASE_BRANCH;
  const repoName = 'pages';
  const rootDir = path.resolve(cwd(), ROOT_DIR);

  // TODO: parse current branch and owner from the .git directory
  const currentOwner = 'adobe';
  const currentBranch = await getStdOutFrom('git branch --show-current');

  const ctx = Ctx(steps, now, rootDir, domain, repoName, baseOwner, baseBranch, currentOwner, currentBranch);

  await prepOutputDir(rootDir, now, steps);

  const proms = steps.map(async (stepName) => {
    const step = await import(`./${stepName}.js`);
    const stepCtx = ctx.withStep(stepName);

    return Promise.all(
      pagelist.map(pagePath => {
        return step.default(stepCtx, pagePath).catch((e) => logError(stepCtx, e));
      })
    );
  });

  await Promise.all(proms);
})();