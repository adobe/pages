/*
 * Copyright 2022 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

import jsonSetUp from './jsonSetUp.js';
import createSideBar from './createSideBar.js';

const createGifArea = ($block, json) => {
  const $gifWrapper = document.createElement('div');
  $gifWrapper.className = 'gif-wrapper';
  let gifs = '';
  json.forEach((item) => {
    gifs += `<div class="gif"><img src="${item.gif}"/></div>`;
  });
  $gifWrapper.innerHTML = gifs;

  $block.append($gifWrapper);
};

export default async function quickActions($block) {
  const $blockChild = $block.childNodes;
  const json = await jsonSetUp($blockChild);
  $block.innerHTML = '';
  await createSideBar($block, json);
  await createGifArea($block, json);
}
