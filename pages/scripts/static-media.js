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

let pathmap;

export async function getMediaPathMap() {
  if (pathmap) return pathmap;
  return fetch('/static/pathmap.json')
    .then((resp) => resp.json())
    .then((j) => {
      pathmap = j.data.reduce((cltr, item) => {
        cltr[item.path] = item.hashpath;
        return cltr;
      }, {});
      return j;
    });
}

/**
 * Returns a media bus path if staticPath exists in
 * the path map (ie. `./media_<hash>.<ext>`)
 * @param {string} staticPath
 * @returns {string}
 */
export async function hashPathOf(staticPath) {
  const map = await getMediaPathMap();
  console.log('hashpath map: ', map);
  if (staticPath in map) {
    return map[staticPath];
  }
  return staticPath;
}

export async function setBackgroundImage(selector, href, parent = document) {
  const el = parent.querySelector(selector);
  if (!el) return;
  el.style.backgroundImage = `url(${hashPathOf(href)})`;
}
