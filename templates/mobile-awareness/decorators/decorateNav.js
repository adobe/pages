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
  debounce,
} from '../../default/default.js';

export default function decorateNav() {
  const plan = document.body.classList.contains('cpp')
    ? 'cpp'
    : 'single-app';
  const navPlaceholderEl = document.querySelector(
    '.mobile-awareness-nav',
  );
  const navEl = createTag('nav', {
    class: 'mobile-awareness-nav',
  });
  const navLinkNames = [];
  if (plan === 'cpp') {
    navLinkNames.push(
      ...[
        {
          label: 'Photography Plan',
          path: 'cpp',
          mobileOnly: true,
        },
        {
          label: 'Lightroom for Mobile',
          path: 'lightroom-for-mobile',
        },
        {
          label: 'Photoshop on iPad',
          path: 'photoshop-on-ipad',
        },
        {
          label: 'Photoshop Express',
          path: 'photoshop-express',
        },
      ],
    );
  } else {
    navLinkNames.push(
      ...[
        {
          label: 'Photoshop',
          path: '',
          mobileOnly: true,
        },
        {
          label: 'Photoshop on iPad',
          path: 'photoshop-on-ipad',
        },
        { label: 'Fresco', path: 'fresco' },
        {
          label: 'Photoshop Express',
          path: 'photoshop-express',
        },
      ],
    );
  }
  const homeLink = {
    label: '',
    path: plan === 'cpp' ? 'cpp' : '',
  };
  const { href } = window.location;

  const links = navLinkNames
    .map(
      (link) => /* html */ `
    <a href="/creativecloud/en/mobile-apps-in-your-plan/${
  link.path
}" class="${
  // eslint-disable-next-line
  new RegExp(`/${link.path}/?(?:\\?.*)?$`, 'g').exec(href)
    ? 'current'
    : ''
} ${link.mobileOnly ? 'no-desktop' : ''}">
      <div class="textholder">
        <div>${link.label}</div>
        <div class="highlight"></div>
      </div>
    </a>
  `,
    )
    .join('');

  navEl.innerHTML = /* html */ `
  <div class="section-wrapper nav-elements">
    <div class="main-section">
      <div class="hamburger">
        <svg class="closed" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22">
          <rect id="Canvas" width="22" height="22" fill="#ff13dc" opacity="0"/>
          <rect id="Rectangle_146138" data-name="Rectangle 146138" width="14" height="2" rx="0.5" transform="translate(4 4.5)" fill="#6e6e6e"/>
          <rect id="Rectangle_146139" data-name="Rectangle 146139" width="14" height="2" rx="0.5" transform="translate(4 10)" fill="#6e6e6e"/>
          <rect id="Rectangle_146140" data-name="Rectangle 146140" width="14" height="2" rx="0.5" transform="translate(4 15.5)" fill="#6e6e6e"/>
        </svg>
        <svg class="open" xmlns="http://www.w3.org/2000/svg" width="14.743" height="14.743" viewBox="0 0 14.743 14.743">
          <g id="Group_72953" data-name="Group 72953" transform="translate(-47.293 -8.793)">
            <line id="Line_1" data-name="Line 1" x2="13.329" y2="13.329" transform="translate(48 9.5)" fill="none" stroke="#707070" stroke-width="2"/>
            <line id="Line_2" data-name="Line 2" y1="13.329" x2="13.329" transform="translate(48 9.5)" fill="none" stroke="#707070" stroke-width="2"/>
          </g>
        </svg>
      </div>
      <a href="/creativecloud/en/mobile-apps-in-your-plan/${
  homeLink.path || ''
}">
        <img class="icon icon-creativecloud" src="/icons/creativecloud.svg">
      </a>
      <div class="menu-open-divider"></div>
    </div>
    <div class="links">
      ${links}
    </div>
  </div>
  `;
  navPlaceholderEl.parentElement.replaceWith(navEl);

  const hamburger = navEl.querySelector('.hamburger');
  hamburger.addEventListener('click', () => {
    navEl.classList.toggle('open');
  });

  // add scroll listener for mobile
  let lastScrollTop = window.pageYOffset || document.documentElement.scrollTop;
  const scrollListener = debounce(
    () => {
      const st = window.pageYOffset
        || document.documentElement.scrollTop;
      if (st > 60) {
        navEl.classList.add('scrolled');
      } else navEl.classList.remove('scrolled');

      if (st > 60 && st > lastScrollTop) {
        navEl.classList.add('scrollingdown');
        navEl.classList.remove('open');
      } else {
        navEl.classList.remove('scrollingdown');
      }
      lastScrollTop = st <= 0 ? 0 : st;
    },
    10,
    true,
  );
  document.addEventListener('scroll', scrollListener);
}
