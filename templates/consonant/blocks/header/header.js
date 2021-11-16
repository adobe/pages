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

export default function decorate($block) {
  const $otherCells = Array.from($block.querySelectorAll(':scope > div:not(:first-of-type)'));
  $otherCells.forEach(($cell) => {
    if ($cell) {
      insertAfter($cell, $block);
    }
  });
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
  $headerTag.classList.add('appear');
  const $headerLeft = $block.querySelector(':scope > div');
  $headerLeft.classList.add('header-left');
  const $headerRight = document.createElement('div');
  $headerRight.classList.add('header-right');
  const $lastCell = $block.querySelector(':scope > div > div:last-of-type:not(:first-of-type)');
  if ($lastCell) {
    $block.append($headerRight);
    $headerRight.append($lastCell);
  }
  $headerLeft.insertAdjacentHTML('afterbegin', '<button class="header-hamburger" aria-expanded="false" aria-haspopup="true" aria-label="Navigation menu" tabindex="1" role="button" type="button"></button>');
}
