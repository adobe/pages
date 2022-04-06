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

import { createTag } from '../../default/default.js';
import {
  hoist, openModalLink, replaceTag, wrapContents,
} from '../scripts/scripts.js';

function decorateHero() {
  const existingEl = document.querySelector('.mobile-awareness-app-hero');
  if (!existingEl) return;
  let imageContainer = existingEl.querySelector('.responsive-image-swap');
  if (!imageContainer) imageContainer = existingEl.querySelector('picture');
  existingEl.removeChild(imageContainer);

  const overlay = wrapContents(existingEl, { innerAttrs: { class: 'section-wrapper' } });
  wrapContents(overlay, { innerAttrs: { class: 'app-hero-overlay' } });
  overlay.parentElement.appendChild(imageContainer);
}

function decorateSignInReminder() {
  const existingEl = document.querySelector('.mobile-awareness-app-sign-in-reminder');
  if (!existingEl) return;
  existingEl.classList.add('section-wrapper');

  const contentBox = wrapContents(existingEl, { innerAttrs: { class: 'gray-zone' } });
  hoist('picture', contentBox);

  wrapContents(existingEl, { innerAttrs: { class: 'content' } });
  const elements = contentBox.querySelectorAll('h2, p');
  const beforeHeader = [];
  for (const el of elements) {
    if (['H2', 'H1', 'H3'].includes(el.nodeName)) break;
    if (el.innerHTML) beforeHeader.push(el);
  }
  beforeHeader.forEach((el) => el.classList.add('image-caption'));
  contentBox.querySelectorAll('p').forEach((p) => {
    if (p.innerHTML.trim() === '') p.parentElement.removeChild(p);
  });
}

function decorateTutorialPrompt() {
  const existingEl = document.querySelector('.mobile-awareness-app-tutorial-prompt');
  if (!existingEl) return;
  existingEl.classList.add('section-wrapper');

  const linkRow = existingEl.querySelector('.row');
  const linkEls = linkRow.querySelectorAll(':scope > *');
  const links = [];
  for (const el of linkEls) {
    links.push(el.innerHTML);
  }
  linkRow.parentElement.removeChild(linkRow);

  const cardRow = existingEl.querySelector('.row');
  const cardEls = hoist('.row > *', cardRow, false, existingEl.querySelector('.tutorial-prompts'));
  cardRow.parentElement.removeChild(cardRow);

  cardEls.forEach((cardEl, index) => {
    cardEl.classList.add('tutorial-card');
    hoist('picture', cardEl, true);
    cardEl.querySelectorAll('p').forEach((p) => {
      if (p.innerHTML.trim() === '') p.parentElement.removeChild(p);
    });

    const url = links[index];
    if (url) {
      const newEl = replaceTag(cardEl, 'a');
      newEl.setAttribute('href', url);
    }
  });

  const link = createTag('span', { class: 'fake-link no-mobile no-tablet' });
  link.innerHTML = 'Text me a download link >';
  openModalLink(link, /.*\/([^/]*)\/?$/gi.exec(window.location.href.split('?')[0])[1]);

  existingEl.appendChild(link);
}

function decorateAppExtensibility() {
  const existingEl = document.querySelector('.mobile-awareness-app-extensibility');
  if (!existingEl) return;
  wrapContents(existingEl, { innerAttrs: { class: 'section-wrapper' } });
}

function decorateAppCta() {
  let existingEl = document.querySelector('.mobile-awareness-app-cta');
  if (!existingEl) return;
  const secondary = existingEl.querySelector('.grid-2');
  if (secondary) secondary.parentElement.removeChild(secondary);

  const imageContainers = existingEl.querySelectorAll('.mobile-awareness-app-cta > picture');
  const mainImage = imageContainers[imageContainers.length - 1];
  mainImage.parentElement.removeChild(mainImage);

  const wrapper = wrapContents(existingEl, { innerAttrs: { class: 'app-cta-content' } });
  wrapContents(wrapper, { innerAttrs: { class: 'section-wrapper' } });
  wrapper.appendChild(mainImage);

  // secondary
  if (!secondary) return;
  existingEl = document.querySelector('.mobile-awareness-app-cta');
  if (existingEl) existingEl.appendChild(secondary);
  const imageContainer = secondary.querySelector('picture');
  imageContainer.parentElement.removeChild(imageContainer);
  const w = wrapContents(secondary, { innerAttrs: { class: 'app-cta-content' } });
  wrapContents(w, { innerAttrs: { class: 'section-wrapper secondary' } });
  w.prepend(imageContainer);
}

function decorateAppInspiration() {
  const existingEl = document.querySelector('.mobile-awareness-app-inspiration');
  if (!existingEl) return;
  wrapContents(existingEl, { innerAttrs: { class: 'section-wrapper' } });

  // images also are links
  existingEl.querySelectorAll('.app-inspiration .row').forEach((inspirationEl) => {
    const link = inspirationEl.querySelector('a');
    const imageContainer = inspirationEl.querySelector('.cell');
    const newImageContainer = replaceTag(imageContainer, 'a');
    newImageContainer.href = link.href;
    newImageContainer.setAttribute('target', '_blank');
  });
}

function decorateAppOthers() {
  const existingEl = document.querySelector('.mobile-awareness-app-others');
  if (!existingEl) return;
  wrapContents(existingEl, { innerAttrs: { class: 'section-wrapper' } });
  hoist('.learn-card', document.querySelector('.learn-cards'), true);
  existingEl.querySelectorAll('.learn-card').forEach((cardEl) => {
    const cardType = [...cardEl.classList].find((e) => e !== 'learn-card');
    const header = cardEl.querySelector('h3');

    const learnMore = createTag('a', { class: 'button primary', href: `/creativecloud/en/mobile-apps-in-your-plan/${cardType}` });
    learnMore.innerHTML = 'Learn more';
    header.parentElement.appendChild(learnMore);

    hoist('picture', cardEl, true);
  });
}

export default function decorateAppPage() {
  decorateHero();
  decorateSignInReminder();
  decorateTutorialPrompt();
  decorateAppExtensibility();
  decorateAppCta();
  decorateAppInspiration();
  decorateAppOthers();
}
