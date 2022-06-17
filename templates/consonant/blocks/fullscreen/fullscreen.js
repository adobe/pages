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

  const bg = $block.querySelector(':scope > div:first-of-type');
  bg.classList.add('background');
  Array.from(bg.querySelectorAll('p')).forEach((p) => {
    p.classList.remove('button-container')
    if (p.childNodes.length === 0) p.remove();
  });
  Array.from(bg.querySelectorAll('a')).forEach((a) => a.classList.remove('button'));
  const backgroundOptions = []
  const children = Array.from(bg.querySelector(':scope > div').childNodes);
  children.forEach((el) => {
    if (el.nodeType === 1) {
      if (el.tagName.toLowerCase() === 'picture' || el.querySelector('picture')) {
        let background = el;
        if (el.tagName.toLowerCase() != 'picture') {
          background = el.querySelector('picture');
        }
        backgroundOptions.push({
          background: background,
          artistName: null
        });
      } else if (el.querySelector('a') && el.querySelector('a').href.includes('.mp4')) {
        backgroundOptions.push({
          background: el.querySelector('a'),
          artistName: null
        });
      } else {
        if (el && el.tagName.toLowerCase() !== 'picture' && !el.querySelector('picture')
            && !(el.querySelector('a') && el.querySelector('a').href.includes('.mp4')) && el.textContent) {
          backgroundOptions[backgroundOptions.length - 1].artistName = el;
        }
      }
    }
  });
  const randomBG = backgroundOptions[Math.floor(Math.random() * backgroundOptions.length)];
  let video = null;
  if (randomBG.background.tagName.toLowerCase() === 'a') video = transformLinkToAnimation(randomBG.background);
  bg.innerHTML = /* html */ `
    ${(video) ? video.outerHTML : randomBG.background.outerHTML}
    <div class="background-overlay"></div>
    <p>${randomBG.artistName.innerHTML}</p>
  `;
  const content = $block.querySelector(':scope > div:nth-of-type(2)');
  if (content) { content.classList.add('container'); }
  $block.classList.add('fullscreen--appear');
}
