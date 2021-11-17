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
  insertAfter,
} from '../../consonant.js';

function openMobileMenu() {
  // Opens the mobile menu
  document.querySelector('header').classList.add('menu-open');
  document.body.style.overflow = 'hidden';
}

function closeMobileMenu() {
  // Closes the mobile menu
  document.querySelector('header').classList.remove('menu-open');
  document.body.style.overflow = '';
}

function mobileMenuListeners($block) {
  const $header = document.querySelector('header');
  const $hamburger = $block.querySelector('.header-hamburger');

  // Toggle mobile menu if click on hamburger
  $hamburger.addEventListener('click', () => {
    if ($header.classList.contains('menu-open')) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  });

  // Close mobile menu if press Escape key
  document.addEventListener('keydown', (event) => {
    if (event.code === 'Escape' && $header.classList.contains('menu-open')) {
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
    if (!$header.contains(e.relatedTarget)) {
      closeMobileMenu();
    }
  });
}

export default function decorate($block) {
  // Anything below the 1st table row will not go into the header
  const $otherCells = Array.from($block.querySelectorAll(':scope > div:not(:first-of-type)'));
  $otherCells.forEach(($cell) => {
    if ($cell) {
      insertAfter($cell, $block);
    }
  });
  // Move the header block to <header> and remove from <main>
  const $headerTag = document.querySelector('header');
  const $headerContainer = $block.closest('.header-container');
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
  // Move the icon logo outside of the 'header-left-nav' div so we can still see it on mobile
  const $headerLeftTop = document.createElement('div');
  $headerLeftTop.classList.add('header-left-top');
  $headerLeft.prepend($headerLeftTop);
  const $iconLogo = $headerLeftNav.querySelector(':scope > div > :first-child:not(ul)');
  if ($iconLogo) {
    $headerLeftTop.prepend($iconLogo);
  }
  // Add mobile menu hamburger button
  $headerLeftTop.insertAdjacentHTML('afterbegin', '<button class="header-hamburger" aria-expanded="false" aria-haspopup="true" aria-label="Navigation menu" tabindex="1" role="button" type="button"></button>');
  // Add a background overlay for the open mobile menu
  const $backdrop = document.createElement('div');
  $backdrop.classList.add('menu-open-background');
  document.body.appendChild($backdrop);
  // Add mobile menu functionality
  mobileMenuListeners($block);
  // Show the header
  $headerTag.classList.add('appear');
}
