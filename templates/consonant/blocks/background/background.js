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
  const $blocksNoBackgroundPadding = ['marquee', 'separator'];
  const $background = $block.querySelector(':scope > div:first-of-type');
  const $sectionWrapper = $block.closest('.section-wrapper');
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
  if ($background) {
    const $blockFirstChild = $sectionWrapper.querySelector(':scope > div > :first-child');
    const firstBlockNames = [];
    if ($blockFirstChild) {
      const firstBlockClassNamesString = $blockFirstChild.className;
      const firstBlockClassNames = firstBlockClassNamesString.split(' ');
      firstBlockClassNames.forEach((className) => {
        firstBlockNames.push(className);
      });
    }
    if (firstBlockNames.some((e) => $blocksNoBackgroundPadding.includes(e))) {
      $blockFirstChild.style.marginTop = '0';
      $sectionWrapper.style.paddingTop = '0';
    }
    const $blockLastChild = $sectionWrapper.querySelector(':scope > div > :last-child');
    const lastBlockNames = [];
    if ($blockLastChild) {
      const lastBlockClassNamesString = $blockLastChild.className;
      const lastBlockClassNames = lastBlockClassNamesString.split(' ');
      lastBlockClassNames.forEach((className) => {
        lastBlockNames.push(className);
      });
    }
    if (lastBlockNames.some((e) => $blocksNoBackgroundPadding.includes(e))) {
      $blockLastChild.style.marginBottom = '0';
      $sectionWrapper.style.paddingBottom = '0';
    }
  }
}
