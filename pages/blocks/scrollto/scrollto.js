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

function scrollWindow(e) {
  const scrollToLocation = e.currentTarget.getAttribute('data-id');
  const collectedYValue = document.querySelector(scrollToLocation).offsetTop;
  window.scrollTo({
    top: collectedYValue,
    left: 0,
    behavior: 'smooth',
  });
}

/** @type {import("../block").BlockDecorator} */
export default async function decorate($block, _, doc) {
  const scrollToElement = $block.querySelector(':scope > div div');
  const scrollToPosition = scrollToElement.innerText;
  scrollToElement.innerHTML = `
  <button class="scroll-btn" data-id="${scrollToPosition}">
    <svg id="Chevron" xmlns="http://www.w3.org/2000/svg" width="34.42" height="22.947" viewBox="0 0 34.42 22.947">
      <g id="Frame" fill="#f0f" stroke="rgba(0,0,0,0)" stroke-width="1" opacity="0">
        <rect width="34.42" height="22.947" stroke="none"/>
        <rect x="0.5" y="0.5" width="33.42" height="21.947" fill="none"/>
      </g>
      <path id="Shape" d="M34.4,3.592A3.086,3.086,0,0,0,32.635.744a2.732,2.732,0,0,0-3.132.664L17.21,14.587,4.916,1.409a2.743,2.743,0,0,0-4.067,0,3.238,3.238,0,0,0,0,4.357L15.172,21.109a2.737,2.737,0,0,0,4.059,0L33.553,5.766A3.188,3.188,0,0,0,34.4,3.592Z" transform="translate(0.003 0.22)" fill="#2c2c2c"/>
    </svg>
  </button>`;
  doc.querySelector('.scroll-btn').addEventListener('click', (e) => scrollWindow(e));
}
