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
  const $cards = Array.from($block.children);
  let numberOfCards = 0;
  if ($cards[0]) {
    numberOfCards = $cards[0].children.length;
  }
  if (numberOfCards > 0) {
    $block.classList.add(`col-${numberOfCards}-cards`);
  }
  const $pics = $block.querySelectorAll(':scope picture');
  $block.querySelectorAll(':scope p:empty').forEach(($p) => $p.remove());
  if ($pics.length === 1 && $pics[0].parentElement.tagName === 'P') {
    const $parentDiv = $pics[0].closest('div');
    const $parentParagraph = $pics[0].parentNode;
    $parentDiv.insertBefore($pics[0], $parentParagraph);
  }
  let overlay = false;
  if ($block.classList.contains('overlay')) {
    overlay = true;
  }
  $cards.forEach(($card) => {
    $card.classList.add('card');
    const $cells = Array.from($card.children);
    let hasPic;
    let hasLink;
    $cells.forEach(($e, cell) => {
      const $cardLink = $e.querySelector(':scope a:first-child:last-child');
      if (cell === 0) {
        const pic = $e.querySelector(':scope picture');
        if (pic) {
          $e.classList.add('card-picture');
          hasPic = true;
        } else {
          $e.classList.add('card-text');
        }
      } else if (cell === 1) {
        if (!hasPic && $cardLink) {
          $e.classList.add('card-text');
          $e.classList.add('card-link');
          hasLink = true;
        } else {
          $e.classList.add('card-text');
        }
      } else if (cell === 2) {
        if ($cardLink && !hasLink) {
          $e.classList.add('card-text');
          $e.classList.add('card-link');
          hasLink = true;
        } else {
          $e.remove();
        }
      }
    });
    if (hasLink) {
      const $cardLink = $card.querySelector(':scope .card-link a');
      if ($cardLink) {
        $cardLink.classList.add('card-container-link');
        $cardLink.innerText = '';
        $card.appendChild($cardLink);
        $cells.forEach((div) => {
          $cardLink.append(div);
        });
        $card.querySelector(':scope .card-link').remove();
      }
    }
    if (overlay) {
      const div = document.createElement('div');
      div.classList.add('card-overlay');
      $card.appendChild(div);
    }
  });
}
