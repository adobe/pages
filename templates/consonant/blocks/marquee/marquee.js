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
  transformLinkToAnimation,
} from '../../consonant.js';

export default function decorate($block) {
  const $pics = $block.querySelectorAll('picture');
  $pics.forEach((pic) => {
    if (pic.parentElement.tagName === 'P') {
      // unwrap single picture if wrapped in p tag
      const $parentDiv = pic.closest('div');
      const $parentParagraph = pic.parentNode;
      $parentDiv.insertBefore(pic, $parentParagraph);
    }
  });
  const $sectionWrapper = $block.closest('.marquee-container');
  const bg = $block.querySelector(':scope > div:first-of-type');
  bg.classList.add('background');
  Array.from(bg.querySelectorAll('p')).forEach((p) => p.classList.remove('button-container'));
  Array.from(bg.querySelectorAll('a')).forEach((a) => a.classList.remove('button'));
  let bgImg = bg.querySelector('picture');
  // Set background to text value if there is no image:
  if (!bgImg) {
    const $a = bg.querySelector('a');
    if ($a && $a.href.endsWith('.mp4')) {
      transformLinkToAnimation($a);
      bgImg = $a;
    } else {
      bg.style.background = bg.textContent;
      bg.innerHTML = '';
    }
  } else if (bgImg.parentElement.tagName.toLowerCase === 'p') {
    bgImg.parentElement.parentElement.appendChild(bgImg);
  }
  const content = $block.querySelector(':scope > div:nth-of-type(2)');
  if (content) {
    content.classList.add('container');
    const $cells = Array.from(content.children);
    $cells.forEach(($cell) => {
      $cell.classList.add('marquee-column');
      const picElement = $cell.querySelector('picture');
      if (picElement) {
        $cell.classList.add('marquee-image');
      }

      // remove empty p from empty columns
      const $emptyP = $cell.querySelector(':scope > p:first-child:last-child');
      if ($emptyP && $emptyP.childNodes.length === 0) $emptyP.remove();
    });
  } else {
    $block.classList.add('empty-content');
  }
  // Remove white space between section with background and marquee:
  const $previousSection = $sectionWrapper.previousElementSibling;
  if ($previousSection) {
    if ($previousSection.classList.contains('section-metadata-container')) {
      Array.from($previousSection.children).forEach(($row) => {
        const $prev = Array.from($row.children);
        if ($prev[0] && $prev[1] && (/background/gi).test($prev[0].innerText)) {
          $previousSection.classList.add('padding-bottom-L');
        }
      });
    }
  }
}
