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

function background($block, color) {
  const $sectionWrapper = $block.closest('.section-metadata-container');
  $sectionWrapper.style.backgroundColor = color;

  // Removes unwanted margin from colorful blocks to avoid the extra white space:
  const noMarginBlocks = ['marquee', 'separator'];
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

export default function decorate($block) {
  const $rows = Array.from($block.children);
  $rows.forEach(($row) => {
    const $cells = Array.from($row.children);
    if ($cells[0] && $cells[1]) {
      const meta = $cells[0].innerText;
      const value = $cells[1].innerText;
      if ((/background/gi).test(meta)) {
        background($block, value);
      }
    }
  });
  $block.remove();
}
