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

import { loadLocalHeader } from '../../scripts/scripts.js';

function getImageName(appName) {
  let iconName = '';
  if (appName.toLowerCase().includes('adobe')) {
    iconName = appName.toLowerCase().split('adobe')[1];
  } else {
    iconName = appName.toLowerCase();
  }
  return `/icons/${iconName.split(' ').join('')}`;
}

function styleNav() {
  const parent = document.querySelector('header');
  const $appIcon = parent.querySelector('img');
  if (!$appIcon) return;
  const appIcon = $appIcon.src;
  const appName = parent.querySelector('a').innerHTML;
  const appNameLink = parent.querySelector('a').getAttribute('href');
  const listItems = parent.querySelectorAll('ul li');
  let nav = '';
  let carrot = '';

  if (listItems) {
    if (listItems.length >= 1) {
      nav = parent.querySelector('ul').outerHTML;
      carrot = `
        <div class="menu-carrot">
          <img src='/icons/carrot.svg'>
        </div>
      `;
    }
  }

  parent.innerHTML = `
    <div class="section-wrapper">
      <div class="nav">
        <div class="nav__section">
          <div class="app-name-and-icon">
            <div class="app-icon mobile"><img src="${appIcon}" alt="${appName}"></div>
            <div class="app-icon desktop">
              <a href="${appNameLink}" target="_blank">
                <img src="${getImageName(appName)}.svg" alt="${appName}">
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

  if (document.querySelector('.nav-container')) {
    const $nav = document.querySelector('.nav-container');
    if ($nav.querySelector('div').children.length === 0) {
      $nav.remove();
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

async function decorateNav() {
  await loadLocalHeader();
  styleNav();
  const navEl = document.querySelector('.nav');
  if (navEl) {
    const iconEl = document.querySelector('.app-name-and-icon');
    if (iconEl) {
      iconEl.addEventListener('click', mobileDropDown);
    }
  }
  document.querySelector('header').classList.add('appear');
  // loadCSS('/pages/blocks/nav/nav.css');
}

/** @type {import('../block').BlockDecorator} */
export default async function decorate($block) {
  await decorateNav($block);
}
