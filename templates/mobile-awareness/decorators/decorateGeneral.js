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
  createTag,
  externalizeImageSources,
} from '../../../pages/scripts/scripts.js';

function parseClassName(s) {
  return s.trim().replace(/<[^>]*>/g, '').replace(/[\n\t\r]+/g, '-');
}

export function decorateTables() {
  [...document.querySelectorAll('main table')].reverse().forEach(($table) => {
    const $cols = $table.querySelectorAll('thead tr th');
    const cols = Array.from($cols).map((e) => parseClassName(e.innerHTML));
    const $div = createTag('div', { class: `${cols[0]}` });

    const $rows = $table.querySelectorAll('tbody tr');
    $rows.forEach(($tr) => {
      const $row = createTag('div', { class: 'row' });
      $tr.querySelectorAll('td').forEach(($td, i) => {
        const $cell = createTag('div',
          { class: i === 0 ? 'cell' : cols[i] });
        $cell.innerHTML = $td.innerHTML;
        externalizeImageSources($cell);
        $row.appendChild($cell);
      });
      $div.appendChild($row);
    });
    $table.parentNode.replaceChild($div, $table);
  });
}

export function decorateResponsiveImageSwap() {
  document.querySelectorAll('.responsive-image-swap').forEach((el) => {
    const finalEl = createTag('div', { class: 'responsive-image-swap' });

    const pictureEls = el.querySelectorAll('picture');
    pictureEls.forEach((pictureEl, index) => {
      if (index === 0) pictureEl.classList.add('no-mobile');
      else pictureEl.classList.add('no-desktop');
      finalEl.appendChild(pictureEl);
    });

    el.replaceWith(finalEl);
  });
}

function cleanUpEmptyPTags() {
  document.querySelectorAll('p').forEach((p) => {
    if (p.innerHTML.trim() === '') p.parentElement.removeChild(p);
  });
}
function cleanUpUnnecessaryTags() {
  document.querySelectorAll('div').forEach((div) => {
    const parent = div.parentElement;
    if (parent
      && (div.classList?.length === 0 || parent?.classList.length === 0)
      && div.parentNode.tagName === 'DIV') {
      div.classList.forEach((c) => parent.classList.add(c));
      const { childNodes } = div;
      parent.removeChild(div);
      parent.append(...childNodes);
    }
  });
  document.querySelectorAll('p').forEach((p) => {
    const parent = p.parentElement;
    if (parent
      && (p.classList?.length === 0 || parent?.classList.length === 0)
      && p.parentNode.tagName === 'DIV' && p.parentNode.childElementCount === 1) {
      p.classList.forEach((c) => parent.classList.add(c));
      const { childNodes } = p;
      parent.removeChild(p);
      parent.append(...childNodes);
    }
  });
}

export default function decorateGeneral() {
  decorateTables();
  cleanUpEmptyPTags();
  cleanUpUnnecessaryTags();
  decorateResponsiveImageSwap();
}
