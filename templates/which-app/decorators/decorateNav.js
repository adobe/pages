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

import { flattenDom } from '../scripts/general.js';

export default function decorateNav() {
  const nav = document.querySelector('.nav');
  nav.classList.add('columns');
  flattenDom(nav, 1);

  const initialPathMinusHashAndTrailingSlash = window.location.pathname
    .replace(/\/$/, '')
    .replace(/#.*$/, '')
    .replace(/which-app\/?.*$/, 'which-app');
  const navItems = document.querySelectorAll('li');
  navItems.forEach((navItem) => {
    const navItemContent = navItem.innerHTML;
    navItem.addEventListener('click', () => {
      window.location.href = `${initialPathMinusHashAndTrailingSlash}/${navItemContent
        .toLowerCase()
        .replace(/ /g, '')}`;
    });
  });

  document.addEventListener('scroll', () => {
    if (window.scrollY > 0) {
      nav.classList.add('nav-scrolled');
    } else {
      nav.classList.remove('nav-scrolled');
    }
  });
}
