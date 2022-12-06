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
} from '../../default/default.js';
import { hoist, openModalLink, wrapContents } from '../scripts/scripts.js';

function parseClassName(s) {
  return s.trim().replace(/<[^>]*>/g, '').replace(/[\n\t\r]+/g, '-');
}

function addHeadElements() {
  document.title = 'Mobile Apps in Your Plan';
}

export function loadURLParams() {
  const params = new URLSearchParams(window.location.search);
  let plan = params.get('plan') || 'single-app';
  if (window.location.href.includes('/cpp')) plan = 'cpp';
  document.body.classList.add(plan);
}
export function applyURLParams() {
  const params = new URLSearchParams(window.location.search);
  let plan = params.get('plan') || 'single-app';
  if (window.location.href.includes('/cpp')) plan = 'cpp';

  document.querySelectorAll('a').forEach((a) => {
    if (a.href.includes('creativecloud')) {
      const url = new URL(a.href);
      if (/mobile-apps-in-your-plan\/?(cpp\/?)?$/g.exec(url.href)) return;
      url.searchParams.set('plan', plan);
      a.href = url.href;
    }
  });
}
export function externalLinks() {
  document.querySelectorAll('a').forEach((a) => {
    if (!a.href.includes('creativecloud/')) {
      a.setAttribute('target', '_blank');
    }
  });
}

export function fixLinksWithAmpersands() {
  document.querySelectorAll('a').forEach((a) => {
    a.href = a.href.replace(/&amp;/g, '&');
  });
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
      if (index === 0) {
        pictureEl.classList.add('no-mobile');
      } else {
        pictureEl.classList.add('no-desktop');
        pictureEl.classList.add('no-tablet');
      }
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
      && ((div.classList || []).length === 0 || (parent.classList || []).length === 0)
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
      && ((p.classList || []).length === 0 || (parent.classList || []).length === 0)
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
      const textMe = createTag('div', { class: 'button primary no-mobile no-tablet' });
      textMe.innerHTML = 'Text me a download link';
      openModalLink(textMe, getLinksType);

      const downloadUrls = {
        fresco: 'https://adobefresco.app.link/4EpABpE2ikb',
        'photoshop-on-ipad': 'https://adobephotoshop.app.link/oVUQwA21ikb',
        'photoshop-express': 'https://photoshopexpress.app.link/LG0AV3N1ikb',
        'lightroom-for-mobile': 'https://lightroom-web.app.link/e/WLDTTql1ikb',
      };
      const download = createTag('a', { class: 'button primary no-desktop' });
      if (getLinksType === 'photoshop-on-ipad') download.classList.add('no-mobile');
      download.innerHTML = 'Download';
      download.href = downloadUrls[getLinksType];
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

    const picture = getLinksEl.querySelector('picture');
    if (picture) {
      picture.parentElement.parentElement.classList.add('no-tablet');
      if (getLinksType !== 'photoshop-on-ipad') picture.parentElement.parentElement.classList.add('no-mobile');
    }
  });
}

function replaceIcons() {
  const replaces = [
    { from: 'icon-tablet', to: '/icons/spectrum-icons-dark/DeviceTablet_18_N.svg' },
    { from: 'icon-phone', to: '/icons/spectrum-icons-dark/DevicePhone_18_N.svg' },
  ];
  for (const type of replaces) {
    const els = document.querySelectorAll(`span.${type.from}`);
    for (const el of els) {
      const img = document.createElement('img');
      img.src = type.to;
      el.append(img);
    }
  }
}

function decorateModal() {
  document.querySelectorAll('.text-app-modal').forEach((el) => {
    const wrapper = wrapContents(el, { innerAttrs: { class: 'text-app-modal-contents' } });
    wrapper.classList.remove('text-app-modal');
    wrapper.classList.add('modal-wrapper');
    wrapContents(wrapper, { innerAttrs: { class: 'text-app-modal' } });

    hoist('picture', wrapper, true);
    cleanUpEmptyPTags(el);
    wrapContents(el, { innerAttrs: { class: 'text-app-modal-header' } });
    const h3 = el.querySelector('h3');
    const appName = h3 ? el.querySelector('h3').innerHTML.toLowerCase().replace(/\s/g, '-') : '';
    wrapper.parentElement.classList.add(appName);

    const close = createTag('div', { class: 'text-app-modal-close' });
    close.innerHTML = '&times;';
    close.addEventListener('click', () => {
      wrapper.parentElement.classList.remove('active');
    });
    wrapper.prepend(close);

    const explainer = createTag('div', { class: 'text-app-modal-explainer' });
    explainer.innerHTML = 'An SMS with a download link will be sent to the mobile number provided. Our texts are free, but your service provider may charge a usage fee. Adobe does not store or share this mobile number.';
    el.parentElement.appendChild(explainer);

    const form = createTag('form', { class: 'text-app-modal-form' });
    const label = createTag('label', { class: 'text-app-modal-label' });
    label.innerHTML = 'Phone number';
    const input = createTag('input', {
      class: 'text-app-modal-input', type: 'tel', name: 'phone', placeholder: '+1 (222) 333 4444',
    });
    const submit = createTag('input', { class: 'text-app-modal-submit button primary large', type: 'submit', value: 'Send Link' });
    form.appendChild(label);
    form.appendChild(input);
    form.appendChild(submit);
    el.parentElement.appendChild(form);
  });
}

export default function decorateGeneral() {
  addHeadElements();
  decorateTables();
  cleanUpEmptyPTags();
  cleanUpUnnecessaryTags();
  decorateResponsiveImageSwap();
  watchSlideIns();
  decorateGetLinks();
  replaceIcons();
  decorateModal();
}
