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
} from '../../../pages/scripts/scripts.js';

function wrapContents(
  el,
  { outside, wrapperAttrs, innerAttrs } =
  { outside: false, wrapperAttrs: {}, innerAttrs: {} },
) {
  const wrapper = createTag('div', 'wrapper');
  el.replaceWith(wrapper);
  wrapper.appendChild(el);
  if (!outside) {
    wrapper.classList.add(...el.classList);
    el.classList = '';
  }
  for (const [key, value] of Object.entries(wrapperAttrs || {})) {
    wrapper.setAttribute(key, value);
  }
  for (const [key, value] of Object.entries(innerAttrs || {})) {
    el.setAttribute(key, value);
  }
  return wrapper;
}

function hoist(selector, parent, toTop, targetParent) {
  const all = parent.querySelectorAll(selector);
  if (!all) return false;
  return [...all].map((el) => {
    if (toTop) (targetParent || parent).prepend(el);
    else (targetParent || parent).appendChild(el);
    return el;
  });
}

// function replaceTag(el, tagName) {
//   const newEl = createTag(tagName);
//   const attrs = el.attributes;
//   for (let i = 0; i < attrs.length; i += 1) {
//     newEl.setAttribute(attrs[i].name, attrs[i].value);
//   }
//   newEl.append(...el.childNodes);
//   el.replaceWith(newEl);
//   return newEl;
// }

function decorateHero() {
  const existingEl = document.querySelector('.mobile-awareness-landing-hero');
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
              image.classList.add(...classes.innerHTML.split(' '));
            }
            if (classes) image.removeChild(classes);
          });
        });
      });

    introEl.querySelectorAll('.get-links').forEach((getLinksEl) => {
      const getLinksType = [...getLinksEl.classList].find((e) => e !== 'get-links');
      if (getLinksType) {
        const getButtons = createTag('div', { class: 'get-buttons' });
        const textMe = createTag('div', { class: 'button primary no-mobile' });
        textMe.innerHTML = 'Text me a download link';
        const download = createTag('div', { class: 'button primary no-desktop' });
        download.innerHTML = 'Download';
        const learnMore = createTag('a', { class: 'button secondary', href: `/creativecloud/en/mobile-apps-in-your-plan/${getLinksType}` });
        learnMore.innerHTML = 'Learn more';
        getButtons.appendChild(textMe);
        getButtons.appendChild(download);
        getButtons.appendChild(learnMore);
        getLinksEl.appendChild(getButtons);
      }
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

  function intersectCallback(changes) {
    console.log(changes);
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

export default function decorateLanding() {
  decorateHero();
  decorateAppIntros();
}
