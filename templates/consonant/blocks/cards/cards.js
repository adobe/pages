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
  const $cards = Array.from($block.children);
  let numberOfCards = 0;
  if ($cards[0]) {
    numberOfCards = $cards.length;
  }
  if (numberOfCards > 0) {
    $block.classList.add(`col-${numberOfCards}-cards`);
  }
  const $pics = $block.querySelectorAll('picture');
  $block.querySelectorAll('p:empty').forEach(($p) => $p.remove());
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
    let hasLink = false;
    $cells.forEach(($cell, index) => {
      if (index === 0) {
        const pic = $cell.querySelector('picture');
        if (pic) {
          $cell.classList.add('card-picture');
        } else {
          const $a = $cell.querySelector('a');
          if ($a && $a.href.startsWith('https://') && $a.href.endsWith('.mp4')) {
            let video = null;
            video = transformLinkToAnimation($a);
            $cell.innerHTML = '';
            if (video) {
              $cell.appendChild(video);
              $cell.classList.add('card-picture');
            }
          } else {
            $cell.classList.add('card-text');
          }
        }
      } else if (index === 1) {
        $cell.classList.add('card-text');
      } else if (index === 2) {
        const $cardLink = $cell.querySelector('a');
        if ($cardLink) {
          $cell.classList.add('card-link');
          hasLink = true;
        }
      } else if (index === 3) {
        $cell.classList.add('card-banner');
      } else {
        $cell.remove();
      }
    });
    if (hasLink) {
      const $cardLink = $card.querySelector('.card-link a');
      if ($cardLink) {
        $cardLink.classList.remove('button');
        $cardLink.classList.add('card-container-link');
        $cardLink.innerText = '';
        $card.appendChild($cardLink);
        $cells.forEach((div) => {
          $cardLink.append(div);
        });
        $card.querySelector('.card-link').remove();
      }
    }
    if (overlay) {
      const div = document.createElement('div');
      div.classList.add('card-overlay');
      $card.appendChild(div);
    }
  });
}
