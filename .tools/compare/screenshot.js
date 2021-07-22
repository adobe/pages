// @ts-check

import captureWebsite from 'capture-website';
// set infinite listeners, since this spawns several
process.setMaxListeners(0);

/**
 * @typedef {import('capture-website').Options} ScreenshotOptions
 * @property 
 */

/**
 * Capture and write a screenshot.
 * 
 * @param {import('./context').Context} ctx 
 * @param {string} rootUrl 
 * @param {string} path 
 * @param {ScreenshotOptions} [options]
 * @returns {Promise<void>}
 */
async function captureScreenshot(ctx, rootUrl, fileSuffix, path, options = {}) {
  const url = `${rootUrl}${path}`;

  const opts = Object.assign({
    fullPage: true,
    delay: 3
  }, options);

  return captureWebsite.buffer(url, opts).then(buf => {
    let filename = path.replace(/\//g, '-');
    if(filename.startsWith('-')) filename = filename.substr(1);
    if(filename.endsWith('-')) filename = filename.substr(0, filename.length-1);
    filename += fileSuffix;
    filename += '.png';

    return ctx.writeStepData(filename, buf);
  })
}

/**
 * Capture screenshots of the page on each site.
 * Write them to their respective directories in /comparisons/
 * 
 * @param {import('./context').Context} ctx 
 * @param {string} path
 * @param {ScreenshotOptions} [options]
 */
export default async function captureScreenshots(ctx, path, options) {
  return Promise.all([
    captureScreenshot(ctx, ctx.rootUrlBase, `.${ctx.baseOwner}.${ctx.baseBranch}`, path, options), 
    captureScreenshot(ctx, ctx.rootUrlCurrent, `.${ctx.currentOwner}.${ctx.currentBranch}`, path, options)
  ]);
}