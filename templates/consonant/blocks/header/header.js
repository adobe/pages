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
  externalLinks,
  makeLinksRelative,
} from '../../consonant.js';

function assignActives($headerLeftNav) {
  const $links = $headerLeftNav.querySelectorAll(':scope > div > ul > li');
  const { href } = window.location;

  if (href.includes('artisthub')) {
    // Hard-coded for artist-hub pages...
    let regex = /\/artisthub\/([^/]+)/g;
    if (href.includes('/drafts/artisthub-2.2')) {
      regex = /\/artisthub\/drafts\/artisthub-2.2\/([^/]+)/g;
    }
    const match = regex.exec(href);
    if (match && match.length > 1) {
      let page = '';
      switch (match[1]) {
        case 'get-started':
          page = 'Get Started';
          break;
        case 'learn':
          page = 'Learn';
          break;
        case 'get-inspired':
          page = 'Get Inspired';
          break;
        case 'advocates-program':
          page = 'Advocates Program';
          break;
        case 'community':
          page = 'Community';
          break;
        case 'support':
          page = 'Support';
          break;
        default:
          page = '';
      }
      $links.forEach(($li) => {
        const $a = $li.querySelector(':scope > a');
        if ($a) {
          const name = $a.textContent.trim();
          if (name === page) {
            $li.classList.add('active-page');
          }
        }
      });
    }
  }
}

function openMobileMenu() {
  // Opens the mobile menu
  document.body.classList.add('menu-open');
  const $hamburger = document.querySelector('.header-hamburger');
  $hamburger.setAttribute('aria-expanded', true);
}

function closeMobileMenu() {
  // Closes the mobile menu
  document.body.classList.remove('menu-open');
  const $hamburger = document.querySelector('.header-hamburger');
  $hamburger.setAttribute('aria-expanded', false);
}

function mobileMenuListeners($block) {
  const $header = document.querySelector('header');
  const $hamburger = $block.querySelector('.header-hamburger');
  const $nav = $block.querySelector('.header-left-top');

  // Toggle mobile menu if click on hamburger
  $hamburger.addEventListener('click', () => {
    if (document.body.classList.contains('menu-open')) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  });

  // Close mobile menu if press Escape key
  document.addEventListener('keydown', (event) => {
    if (event.code === 'Escape' && document.body.classList.contains('menu-open')) {
      closeMobileMenu();
    }
  });

  // Close mobile menu if click on the background
  const $backdrop = document.querySelector('.menu-open-background');
  $backdrop.addEventListener('click', () => {
    closeMobileMenu();
  });

  // Close mobile menu if they focus out
  $header.addEventListener('focusout', (e) => {
    if (!$header.contains(e.relatedTarget) && !$nav.contains(e.target)) {
      closeMobileMenu();
      $hamburger.focus();
    }
  });
}

function closeDropdown($dropdown) {
  const $chevron = $dropdown.querySelector('.chevron');
  $dropdown.classList.remove('dropdown-open');
  $chevron.setAttribute('aria-expanded', 'false');
}

function openDropdown($dropdown) {
  const $chevron = $dropdown.querySelector('.chevron');
  $dropdown.classList.add('dropdown-open');
  $chevron.setAttribute('aria-expanded', 'true');
}

function dropdownEvents($dropdown) {
  const $chevron = $dropdown.querySelector('.chevron');

  // Toggle dropdown if they click on chevron
  $chevron.addEventListener('click', () => {
    if (!$dropdown.classList.contains('dropdown-open')) {
      openDropdown($dropdown);
    } else {
      closeDropdown($dropdown);
    }
  });

  // Close dropdown if they focus out
  $dropdown.addEventListener('focusout', (e) => {
    if (!$dropdown.contains(e.relatedTarget) && !$chevron.contains(e.relatedTarget)
    && $dropdown !== e.relatedTarget && $chevron !== e.relatedTarget && e.relatedTarget !== null) {
      closeDropdown($dropdown);
    }
  });

  // Hover events
  $dropdown.addEventListener('mouseenter', () => {
    if (window.innerWidth > 900) {
      openDropdown($dropdown);
    }
  }, false);
  $dropdown.addEventListener('mouseleave', () => {
    if (window.innerWidth > 900) {
      closeDropdown($dropdown);
    }
  }, false);
}

function decorateHeader($block) {
  // Move the header block to <header> and remove from <main>
  const $headerTag = document.querySelector('header');
  const $headerContainer = $block.parentElement.parentElement;
  $headerContainer.classList.remove('header-container');
  $block.classList.remove('block');
  const $nav = document.createElement('nav');
  $headerTag.append($nav);
  $nav.append($block);
  if ($headerContainer.firstElementChild.childElementCount === 0) {
    $headerContainer.remove();
  }
  // Divide the header into left and right
  const $headerLeft = $block.querySelector(':scope > div');
  $headerLeft.classList.add('header-left');
  const $headerRight = document.createElement('div');
  $headerRight.classList.add('header-right');
  const $lastCell = $block.querySelector(':scope > div > div:last-of-type:not(:first-of-type)');
  if ($lastCell) {
    $block.append($headerRight);
    $headerRight.append($lastCell);
  }
  // Move the nav elements into their own div
  const $navElements = Array.from($headerLeft.querySelectorAll(':scope > *'));
  const $headerLeftNav = document.createElement('div');
  $headerLeftNav.classList.add('header-left-nav');
  $headerLeft.append($headerLeftNav);
  $navElements.forEach(($e) => {
    $headerLeftNav.append($e);
  });
  // Assign active nav elements
  assignActives($headerLeftNav);
  // Get all the dropdown menus
  const $listItems = Array.from($headerLeft.querySelectorAll(':scope .header-left-nav li '));
  $listItems.forEach(($item) => {
    const $ul = $item.querySelector('ul');
    if ($ul) {
      $item.classList.add('has-dropdown');
      $ul.insertAdjacentHTML('beforebegin', '<button class="chevron" aria-expanded="false" aria-label="List" role="button" type="button"><svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="currentColor" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/></svg></button>');
      dropdownEvents($item);
      const $link = $item.querySelector(':scope > a');
      if ($link) {
        $item.classList.add('dropdown-has-link');
        if ($link.getAttribute('href') === '#') {
          // if the link is empty, treat it as if there's no link, less confusing for accessibility
          $link.setAttribute('tabIndex', '-1');
        }
      }
    }
  });
  // Move the icon logo outside of the 'header-left-nav' div so we can still see it on mobile
  const $headerLeftTop = document.createElement('div');
  $headerLeftTop.classList.add('header-left-top');
  $headerLeft.prepend($headerLeftTop);
  const $iconLogo = $headerLeftNav.querySelector(':scope > div > :first-child:not(ul)');
  if ($iconLogo) {
    $headerLeftTop.prepend($iconLogo);
  }
  // Add mobile menu hamburger button
  $headerLeftTop.insertAdjacentHTML('afterbegin', '<button class="header-hamburger" aria-expanded="false" aria-haspopup="true" aria-label="Navigation menu" role="button" type="button"></button>');
  // Add a background overlay for the open mobile menu
  const $backdrop = document.createElement('div');
  $backdrop.classList.add('menu-open-background');
  document.body.appendChild($backdrop);
  // Add mobile menu functionality
  mobileMenuListeners($block);
  // Show the header
  makeLinksRelative();
  externalLinks('header');
  $headerTag.classList.add('appear');
}

async function importHeader(doc) {
  let path = doc;
  const href = window.location.toString();
  if (href.includes('/drafts/')) {
    const match = href.match(/\/drafts\/([^/]+)\//);
    if (match) {
      path = `drafts/${match[1]}/${doc}`;
    } else {
      path = `drafts/${doc}`;
    }
  }

  let url = '';
  if (window.pages && window.pages.product && window.pages.locale) {
    url = `/${window.pages.product}/${window.pages.locale}/${path}.plain.html`;
  }
  if (window.pages && window.pages.product && window.pages.project) {
    url = `/${window.pages.product}/${window.pages.locale}/${window.pages.project}/${path}.plain.html`;
  }
  if (!window.pages && window.location.href.includes('stock/en/artisthub')) {
    url = `/stock/en/artisthub/${path}.plain.html`;
  }
  if (url) {
    const resp = await fetch(url);
    if (resp.status === 200) {
      const html = await resp.text();
      const inner = document.createElement('div');
      inner.innerHTML = html;
      document.querySelector('main').appendChild(inner);
      if (window.hlx && window.hlx.dependencies) window.hlx.dependencies.push(url);
      return inner;
    }
  }
  return null;
}

export default async function loadHeader($blockName) {
  const $inlineHeader = document.querySelector(`main div.${$blockName}`);
  if ($inlineHeader) {
    decorateHeader($inlineHeader);
  } else {
    await importHeader('header').then((response) => {
      if (response && response.nodeType) {
        const $importedHeader = response.querySelector(`main div.${$blockName}`);
        if ($importedHeader) {
          decorateHeader($importedHeader);
        }
      }
    });
  }
}
