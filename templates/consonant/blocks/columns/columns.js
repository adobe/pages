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
  const $rows = Array.from($block.children);
  let numberOfColumns = 0;
  if ($rows[0]) {
    numberOfColumns = $rows[0].children.length;
  }
  if (numberOfColumns > 0) {
    $block.classList.add(`col-${numberOfColumns}-columns`);
  }

  $rows.forEach(($row) => {
    const $columns = Array.from($row.children);
    $columns.forEach(($column) => {
      $column.classList.add('column');
      const $pics = $column.querySelectorAll(':scope picture');
      $column.querySelectorAll(':scope p:empty').forEach(($p) => $p.remove());
      if ($pics.length === 1 && $pics[0].parentElement.tagName === 'P') {
        const $parentDiv = $pics[0].closest('div');
        const $parentParagraph = $pics[0].parentNode;
        $parentDiv.insertBefore($pics[0], $parentParagraph);
      }
      if ($column.firstElementChild.tagName === 'PICTURE') {
        $column.classList.add('column-picture');
      }
    });
  });
}
