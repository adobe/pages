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

// import {
//   addDefaultClass,
//   appearMain,
//   createTag,
//   debounce,
//   decorateTables,
//   externalLinks,
//   loadLocalHeader,
// } from '../../scripts.js';
/*
global
  addDefaultClass,
  appearMain,
  createTag,
  debounce,
  decorateTables,
  externalLinks,
  loadLocalHeader
*/

function wrapSections(element) {
  document.querySelectorAll(element).forEach(($div) => {
    const $wrapper = createTag('div', { class: 'section-wrapper' });
    $div.parentNode.appendChild($wrapper);
    $wrapper.appendChild($div);
  });
}

function decorateNav() {
  if (document.querySelector('header img')) {
    console.log('nav initiated');
    const svg = document.querySelector('header img');
    const svgWithCarrot = document.createElement('div');
    svgWithCarrot.classList.add('nav-logo');

    svgWithCarrot.innerHTML = `
      <span class="product-icon">
          ${svg.outerHTML}
      </span>

      <span class="carrot">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="feather feather-chevron-down"><polyline points="6 9 12 15 18 9"></polyline></svg>
      </span>
      `;
    svg.remove();
    document.querySelector('header div').prepend(svgWithCarrot);
    document.querySelector('header').classList.add('default-nav');

    if (document.querySelector('header .section-wrapper p')) {
      const productName = document
        .querySelector('header .section-wrapper')
        .children[1].querySelector('p');
      document.querySelector('.product-icon').appendChild(productName);
    }
  }
}

function dropDownMenu() {
  const $header = document.querySelector('header');

  if (window.outerWidth >= 768) return;

  if (!$header.classList.contains('nav-showing')) {
    $header.querySelector('ul').style.display = 'flex';
    $header.classList.add('nav-showing');
  } else {
    $header.querySelector('ul').style.display = 'none';
    $header.classList.remove('nav-showing');
  }
}

// eslint-disable-next-line import/prefer-default-export
export function playVideo() {
  document.getElementById('placeholder').classList.add('hidden');
  const $video = document.getElementById('video');
  $video.classList.remove('hidden');
  $video.classList.remove('hidden');
  $video.play();
  $video.setAttribute('controls', true);
}

// set fixed height to cards to create a uniform UI
function cardHeightEqualizer($el) {
  let initialHeight = 0;
  const element = document.querySelectorAll($el);

  if (window.innerWidth >= 700 && element.length > 1) {
    element.forEach((cardEl) => {
      cardEl.style.height = 'auto';
    });

    element.forEach((cardText) => {
      if (initialHeight < cardText.offsetHeight) {
        initialHeight = cardText.offsetHeight;
      }
    });

    element.forEach((cardEl) => {
      cardEl.style.height = `${initialHeight}px`;
    });
  } else {
    element.forEach((cardEl) => {
      cardEl.style.height = 'auto';
    });
  }
}

window.addEventListener('resize', debounce(() => {
  // run resize events
  cardHeightEqualizer('.card-content');
}, 250));

function styleCards() {
  if (!document.getElementsByTagName('body')[0].classList.contains('inclusive')) {
    if (document.querySelector('.thank-you-cards-')) {
      document.querySelector('.thank-you-cards-').closest('.default').classList.add('thank-you-container');
      document.getElementsByTagName('body')[0].classList.add('smb-thank-you');
    }

    if (document.querySelector('form')) {
      document.getElementsByTagName('body')[0].classList.add('smb-form');
    }
  }
}

function setTabIndex() {
  const body = document.getElementsByTagName('body')[0];

  if (body.classList.contains('smb-form')) {
    const waitForForm = setInterval(() => {
      if (document.querySelector('form')) {
        setTimeout(() => {
          const elements = document.querySelectorAll('.card');
          elements.forEach((el) => {
            el.setAttribute('tabindex', 0);
          });
        }, 100);
        clearInterval(waitForForm);
      }
    }, 100);
  }

  if (body.classList.contains('smb-thank-you') && !body.classList.contains('smb-form')) {
    const elements = document.querySelectorAll('.card');

    elements.forEach((el) => {
      el.setAttribute('tabindex', 0);
    });
  }
}

async function decoratePage() {
  addDefaultClass('main>div');
  decorateTables();
  styleCards();
  await loadLocalHeader();
  wrapSections('header>div');
  externalLinks('header');
  externalLinks('footer');
  setTabIndex();

  // nav style/dropdown
  decorateNav();

  if (document.querySelector('.nav-logo')) {
    document.querySelector('.nav-logo').addEventListener('click', dropDownMenu);
  }

  window.pages.decorated = true;
  wrapSections('.home > main > div');
  appearMain();
}

if (document.readyState === 'loading') {
  window.addEventListener('DOMContentLoaded', decoratePage);
} else {
  decoratePage();
}
