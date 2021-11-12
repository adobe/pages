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
} from '../block-helpers.js';

export default function decorate($block) {
  const $background = $block.querySelector(':scope > div:first-of-type');
  const $sectionWrapper = $block.closest('.background-container');
  if ($background) {
    const color = $background.innerText;
    $sectionWrapper.style.backgroundColor = color;
  }
  const $otherCells = Array.from($block.querySelectorAll(':scope > div:not(:first-of-type)'));
  $otherCells.forEach(($cell) => {
    if ($cell) {
      insertAfter($cell, $block);
    }
  });
  $block.remove();

  // Removes unwanted margin from colorful blocks to avoid the extra white space:
  const noMarginBlocks = ['marquee', 'separator'];

  if ($background) {
    const $previousSection = $sectionWrapper.previousElementSibling;
    if ($previousSection) {
      const $lastChild = $previousSection.querySelector(':scope > div > :last-child');
      if ($lastChild) {
        noMarginBlocks.forEach((blockName) => {
          if ($lastChild.classList.contains(blockName)) {
            $previousSection.style.marginBottom = '0';
            $lastChild.style.marginBottom = '0';
            $sectionWrapper.style.marginTop = '0';
          }
        });
      }
    }
    const $nextSection = $sectionWrapper.nextElementSibling;
    if ($nextSection) {
      const $firstChild = $nextSection.querySelector(':scope > div > :first-child');
      if ($firstChild) {
        noMarginBlocks.forEach((blockName) => {
          if ($firstChild.classList.contains(blockName)) {
            $nextSection.style.marginTop = '0';
            $firstChild.style.marginTop = '0';
            $sectionWrapper.style.marginBottom = '0';
          }
        });
      }
    }
  }
}
