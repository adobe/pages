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

function applyBackground($sectionWrapper, color) {
  $sectionWrapper.style.backgroundColor = color;
  $sectionWrapper.classList.add('background-container');
}

function applyTheme($sectionWrapper, theme) {
  if (theme === 'dark') {
    $sectionWrapper.classList.add('dark-theme');
  }
}

export default function decorate($block) {
  const $sectionWrapper = $block.closest('.section-metadata-container');
  $sectionWrapper.classList.remove('section-metadata-container');
  const $rows = Array.from($block.children);
  $rows.forEach(($row) => {
    const $cells = Array.from($row.children);
    if ($cells[0] && $cells[1]) {
      const meta = $cells[0].innerText || '';
      const value = $cells[1].innerText || '';
      if ((/background/gi).test(meta)) {
        applyBackground($sectionWrapper, value.trim().toLowerCase());
      }
      if ((/theme/gi).test(meta)) {
        applyTheme($sectionWrapper, value.trim().toLowerCase());
      }
    }
  });
  $block.remove();
}
