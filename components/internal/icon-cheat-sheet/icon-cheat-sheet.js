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
const url = `${window.location.origin}/icons/twp3/`;
const icons = [
  'adjust',
  'align',
  'arrange',
  'bandaid',
  'blend-modes',
  'brightness',
  'color-picker',
  'content-aware',
  'create',
  'crop',
  'curved',
  'distribute',
  'document',
  'draw',
  'dropshadow',
  'duplicate',
  'export',
  'find',
  'image',
  'images',
  'lasso',
  'layers',
  'light',
  'mask',
  'opentype',
  'organize',
  'patch-tool',
  'pen',
  'play',
  'quick',
  'renaming',
  'resize',
  'rotate',
  'select',
  'shadow-contrast',
  'spot-healing',
  'straighten',
  'style',
  'type',
  'shapes',
  'merge',
  'gradient',
  'freeform',
  'tracing',
  'pencil',
  'stroke',
  'swatches',
  'backgrounds',
  'bucket',
  'wheel',
];

function decorateIcons() {
  let iconItem = '';

  for (let i = 0; i < icons.length; i += 1) {
    iconItem += `
      <div class="icons__item">
        <img src="${url}${icons[i]}.svg">
        <input type="text" value="${icons[i]}">
      </div>
    `;
  }

  document.querySelector('.icons').innerHTML = iconItem;
  console.log(iconItem);
}

export default function decorate($el) {
  $el.innerHTML = `
<div class="icons">
  Loading Icons...
</div>`;
  decorateIcons();
}
