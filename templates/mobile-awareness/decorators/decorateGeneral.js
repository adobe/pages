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
          { class: i === 0 ? 'cell' : cols[i] || 'cell' });
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
export function cleanUpUnnecessaryTags(root = document) {
  root.querySelectorAll('div').forEach((div) => {
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
  root.querySelectorAll('p').forEach((p) => {
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

function watchSlideIns() {
  function intersectCallback(changes) {
    changes.forEach((change) => {
      if (change.intersectionRatio > 0) change.target.classList.add('slide-active');
    });
  }
  const observer = new IntersectionObserver(intersectCallback, {
    root: null,
    rootMargin: '0px',
    threshold: 0.1,
  });

  document.querySelectorAll('.slide-in').forEach((slideEl) => {
    observer.observe(slideEl);
  });
}

function decorateGetLinks() {
  document.querySelectorAll('.get-links').forEach((getLinksEl) => {
    const getLinksType = [...getLinksEl.classList].find((e) => e !== 'get-links');
    if (getLinksType) {
      const getButtons = createTag('div', { class: 'get-buttons' });
      const textMe = createTag('div', { class: 'button primary no-mobile' });
      textMe.innerHTML = 'Text me a download link';
      const download = createTag('div', { class: 'button primary no-desktop' });
      download.innerHTML = 'Download';
      getButtons.appendChild(textMe);
      getButtons.appendChild(download);

      if (window.location.href.includes(`mobile-apps-in-your-plan/${getLinksType}`)) {
        getLinksEl.classList.add('one-line');
        textMe.classList.add('large');
        download.classList.add('large');
      } else {
        const learnMore = createTag('a', { class: 'button secondary', href: `/creativecloud/en/mobile-apps-in-your-plan/${getLinksType}` });
        learnMore.innerHTML = 'Learn more';
        getButtons.appendChild(learnMore);
      }

      getLinksEl.appendChild(getButtons);
    }
  });
}

function replaceIcons() {
  const replaces = [
    { from: '/icons/tablet.svg', to: '/icons/spectrum-icons-dark/DeviceTablet_18_N.svg' },
    { from: '/icons/phone.svg', to: '/icons/spectrum-icons-dark/DevicePhone_18_N.svg' },
  ];
  for (const type of replaces) {
    const els = document.querySelectorAll(`img[src="${type.from}"]`);
    for (const el of els) {
      el.src = type.to;
    }
  }
}

export default function decorateGeneral() {
  decorateTables();
  cleanUpEmptyPTags();
  cleanUpUnnecessaryTags();
  decorateResponsiveImageSwap();
  watchSlideIns();
  decorateGetLinks();
  replaceIcons();
}
