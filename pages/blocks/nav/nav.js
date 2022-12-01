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

import { loadLocalHeader, decorateIcons } from '../../../templates/default/default.js';

const productIcons = [
  'adobe',
  'characteranimator',
  'illustrator',
  'photoshopcamera',
  'adobelive',
  'indesign',
  'photoshopexpress',
  'aero',
  'creativecloud',
  'creativecloudwithtext',
  'lightroom-classic',
  'aftereffects',
  'lightroom',
  'dimension',
  'premiere',
  'behance',
  'experiencecloud',
  'modeler',
  'premiererush',
  'stock',
  'rush',
  'fresco',
  'xd',
  'character',
  'general',
  'photoshop',
];

/**
 * Try to determine a valid icon to use,
 * from the provided block data, and known existing icons.
 */
function getImageName(pAppName) {
  const appName = pAppName.toLowerCase();
  const parsedAppName = appName.split(' ').join('');
  let iconName = '';
  if (appName.includes('adobe')) {
    iconName = appName.split('adobe')[1];
  } else {
    for (const icon of productIcons) {
      if (icon === appName || icon === parsedAppName) {
        iconName = appName;
        break;
      }
    }
    iconName = iconName !== '' ? iconName : window.pages.product;
  }

  if (!iconName) {
    iconName = 'adobe';
  }

  return `/icons/${iconName.split(' ').join('')}.svg`;
}

async function styleNav($header) {
  await decorateIcons($header);
  const $appIcon = $header.querySelector(':scope span.icon') || $header.querySelector(':scope img.icon');
  if (!$appIcon) return;
  const appName = $header.querySelector(':scope a').innerHTML;
  $appIcon.setAttribute('alt', appName);
  const appNameLink = $header.querySelector(':scope a').getAttribute('href');
  const listItems = $header.querySelectorAll(':scope ul li');
  const $favicon = document.getElementById('favicon');
  const iconPath = getImageName(appName);

  if (iconPath && iconPath !== $favicon.href) {
    $favicon.href = iconPath;
  }

  let nav = '';
  let carrot = '';

  if (listItems) {
    if (listItems.length >= 1) {
      nav = $header.querySelector(':scope ul').outerHTML;
      carrot = `
        <div class="menu-carrot">
          <img src='/icons/carrot.svg'>
        </div>
      `;
    }
  }

  $header.innerHTML = `
    <div class="section-wrapper">
      <div class="nav">
        <div class="nav__section">
          <div class="app-name-and-icon">
            <div class="app-icon mobile">${$appIcon.outerHTML}</div>
            <div class="app-icon desktop">
              <a href="${appNameLink}" target="_blank">
                <img src="${iconPath}" alt="${appName}">
              </a>
            </div>
            <div class="app-name mobile">
              ${appName}
            </div>
            <div class="app-name desktop">
              <a href="${appNameLink}" target="_blank">${appName}</a>
            </div>
            ${carrot}
          </div>
        </div> 
        <nav>
          ${nav}
        </nav>
      </div>
    </div>
  `;

  const $navContainer = document.querySelector('.nav-container');
  if ($navContainer) {
    if ($navContainer.querySelector(':scope div').children.length === 0) {
      $navContainer.remove();
    }
  }
}

function mobileDropDown() {
  // event.preventDefault();
  const body = document.getElementsByTagName('body')[0];
  if (!body.classList.contains('nav-showing')) {
    body.classList.add('nav-showing');
  } else {
    body.classList.remove('nav-showing');
  }
}

/** @type {import('../block').BlockDecorator} */
export default async function decorate($block, _, doc) {
  await loadLocalHeader();

  const $header = doc.querySelector('header');
  await styleNav($header);

  const iconEl = doc.querySelector('.app-name-and-icon');
  if (iconEl) {
    iconEl.addEventListener('click', mobileDropDown);
  }

  doc.querySelector('header').classList.add('appear');
}
