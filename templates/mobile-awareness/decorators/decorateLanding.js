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
} from '../../default/default.js';

import { hoist, openModalLink, wrapContents } from '../scripts/scripts.js';

function decorateHero() {
  const existingEl = document.querySelector('.mobile-awareness-landing-hero');
  if (!existingEl) return;
  let imageContainer = existingEl.querySelector('.responsive-image-swap');
  if (!imageContainer) imageContainer = existingEl.querySelector('picture');
  existingEl.removeChild(imageContainer);

  const overlay = wrapContents(existingEl, { innerAttrs: { class: 'section-wrapper' } });
  wrapContents(overlay, { innerAttrs: { class: 'landing-hero-overlay' } });
  overlay.parentElement.appendChild(imageContainer);

  overlay.querySelectorAll('.button').forEach((b) => {
    b.innerHTML = b.innerHTML.replace(/<\/?p>/g, ' ');
    b.addEventListener('click', () => {
      document.querySelector('.mobile-awareness-landing-app-intro')
        .scrollIntoView({ behavior: 'smooth' });
    });
  });
}

function decorateAppIntros() {
  document.querySelectorAll('.mobile-awareness-landing-app-intro').forEach((introEl) => {
    introEl.querySelectorAll('.gray-zone').forEach((g) => {
      wrapContents(g, { innerAttrs: { class: 'section-wrapper' } });
    });

    introEl.querySelectorAll('.mobile-awareness-landing-inspiration')
      .forEach((i) => {
        i.classList.add('section-wrapper');
        i.querySelectorAll('.mobile-awareness-landing-inspiration-images').forEach((imageRow) => {
          imageRow.querySelectorAll('.row').forEach((image) => {
            const classes = image.querySelector('.class');
            if (classes && classes.innerHTML) {
              image.classList.add(...classes.innerHTML.split(' ').map((c) => c.trim()));
            }
            if (classes) image.removeChild(classes);
          });
        });
      });
  });

  wrapContents(document.querySelector('.mobile-awareness-landing-bottom'), { innerAttrs: { class: 'section-wrapper' } });

  document.querySelectorAll('.install-cards > .row > .cell > div').forEach((cardEl) => {
    const cardType = [...cardEl.classList].find((e) => e !== 'install-card');
    if (cardType) {
      hoist('.icon', cardEl, true);
      const mainImage = hoist('picture', cardEl, true)[0];
      mainImage.classList.add('install-card-image');

      const contents = createTag('div', { class: 'install-card-contents' });
      const textLabel = createTag('div', { class: 'install-card-text-label' });

      hoist('h3', cardEl, false, textLabel);
      hoist('p', cardEl, false, textLabel);
      contents.appendChild(textLabel);

      const getButtons = createTag('div', { class: 'install-card-buttons' });
      const textMe = createTag('div', { class: 'button primary no-mobile' });
      textMe.innerHTML = 'Text link';
      openModalLink(textMe, cardType);

      const download = createTag('div', { class: 'button primary no-desktop' });
      download.innerHTML = 'Download';
      const learnMore = createTag('a', { class: 'button secondary', href: `/creativecloud/en/mobile-apps-in-your-plan/${cardType}` });
      learnMore.innerHTML = 'Learn more';
      getButtons.appendChild(learnMore);
      getButtons.appendChild(textMe);
      getButtons.appendChild(download);

      contents.appendChild(getButtons);

      cardEl.appendChild(contents);
    }
  });
}

export default function decorateLanding() {
  decorateHero();
  decorateAppIntros();
}
