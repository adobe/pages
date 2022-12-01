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

import {
  decorateMain,
  loadBlocks,
} from '../../consonant.js';

import { decorateIcons } from '../../../default/default.js';

export default async function decorate(block) {
  const ref = block.textContent.trim();
  const path = new URL(ref, window.location.href).pathname.split('.')[0];
  const resp = await fetch(`${path}.plain.html`);
  if (resp.ok) {
    const main = document.createElement('main');
    main.innerHTML = await resp.text();
    decorateIcons(main);
    decorateMain(main);
    await loadBlocks(main);
    const blockSection = block.closest('.section-wrapper');
    const fragmentSection = main.querySelector(':scope .section-wrapper');
    while (fragmentSection && fragmentSection.firstElementChild) {
      blockSection.insertBefore(fragmentSection.firstElementChild, block.closest('.fragment-wrapper'));
    }
    blockSection.classList.add(...[...blockSection.querySelectorAll('.block')].map((bl) => `${bl.dataset.blockName}-container`));
  }
  block.closest('.fragment-container > div:first-of-type').remove();
}
