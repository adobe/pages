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

export default function decorate($block) {
  const $sectionWrapper = $block.closest('.marquee-container');
  const bg = $block.querySelector(':scope > div:first-of-type > div');
  bg.classList.add('background');
  const bgImg = bg.querySelector(':scope img');
  // Set background to text value if there is no image:
  if (!bgImg) {
    bg.style.display = 'none';
    const bgColor = bg.textContent;
    $block.style.background = bgColor;
  }
  const content = $block.querySelector(':scope > div:nth-of-type(2)');
  content.classList.add('container');
  content.querySelector(':scope > div:first-of-type').classList.add('marquee-column');
  content.querySelector(':scope > div:last-of-type').classList.add('marquee-column');
  const picElement = content.querySelector(':scope picture');
  if (picElement) {
    picElement.parentElement.classList.add('marquee-image');
  }
  const caption = $block.querySelector(':scope > div:nth-of-type(3)');
  if (caption) {
    caption.classList.add('marquee-caption');
  }
  // Remove white space between section with background and marquee:
  const $previousSection = $sectionWrapper.previousElementSibling;
  if ($previousSection) {
    if ($previousSection.classList.contains('section-metadata-container')) {
      Array.from($previousSection.children).forEach(($row) => {
        const $cells = Array.from($row.children);
        if ($cells[0] && $cells[1] && (/background/gi).test($cells[0].innerText)) {
          $previousSection.classList.add('padding-bottom-L');
        }
      });
    }
  }
}
