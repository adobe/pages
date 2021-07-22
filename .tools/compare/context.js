// @ts-check

import * as path from 'path';
import { writeFile } from "fs/promises";
import { Stream } from 'stream';

/**
 * @typedef {Object} BaseContext
 * @property {string[]} steps - Steps to execute.
 * @property {string} rootDir - Output root directory.
 * @property {string} now - Datetime of current run.
 * @property {string} repoName - Repository name.
 * @property {string} baseOwner - Owner of base branch.
 * @property {string} baseBranch - Base branch to compare to, ie. target.
 * @property {string} currentOwner - Owner of base branch.
 * @property {string} currentBranch - Current branch to compare, ie. checked out.
 * @property {string} rootUrlBase - The root URL for base branch pages.
 * @property {string} rootUrlCurrent - The root URL for current branch pages.
 */

/**
 * @typedef {Object} NamedContext
 * @property {string} step - The step name
 * @property {() => string} getStepDir - Function to get resolved path to step output directory.
 * @property {(filename: string, data: string | ArrayBufferView) => void} writeStepData - Function to write data to step output directory.
 * 
 * @typedef {BaseContext & NamedContext} Context
*/

/**
 * @typedef {Object} UnnamedContext
 * @property {(step: string) => string} getStepDir - Function to get resolved path to step output directory.
 * @property {(step: string, filename: string, data: string | ArrayBufferView) => void} writeStepData - Function to write data to step output directory.
 * @property {(step: string) => Context} withStep - Returns context bound to step name.
 * 
 * @typedef {BaseContext & UnnamedContext} AnonContext
 */


 /**
  * Write data to step directory
  * @param {Partial<AnonContext>} ctx
  * @param {string} step 
  * @param {string} filename 
  * @param {string | Buffer | Stream} data 
  */
function writeStepData(ctx, step, filename, data) {
   return writeFile(path.resolve(ctx.getStepDir(step), filename), data);
 }

/**
 * Make a context object
 * 
 * @param {string[]} steps - Steps to execute.
 * @param {string} rootDir - Output root directory.
 * @param {string} now - Datetime of current run.
 * @param {string} baseOwner - Owner of base branch, ie. repo name.
 * @param {string} baseBranch - Base branch name
 * @param {string} currentOwner - Owner of current branch, ie. repo name.
 * @param {string} currentBranch - Current branch name
 *  
 * @returns {AnonContext}
 */
 export function Ctx(steps, now, rootDir, domain, repoName, baseOwner, baseBranch, currentOwner, currentBranch) {
  const anonCtx = {
    now,
    steps,
    rootDir,
    repoName,
    baseOwner,
    baseBranch,
    currentOwner,
    currentBranch,
    rootUrlBase: `https://${baseBranch}--${repoName}--${baseOwner}.${domain}`,
    rootUrlCurrent: `https://${currentBranch}--${repoName}--${currentOwner}.${domain}`
  };

  anonCtx.getStepDir = (step) => path.resolve(rootDir, now, step);
  anonCtx.writeStepData = (step, filename, data) => writeStepData(anonCtx, step, filename, data);
  anonCtx.withStep = (step) => {
    return {
      ...anonCtx,
      step,
      getStepDir: anonCtx.getStepDir.bind(undefined, step),
      writeStepData: anonCtx.writeStepData.bind(undefined, step),
      withStep: undefined
    }
  }
  // @ts-ignore
  return anonCtx;
}