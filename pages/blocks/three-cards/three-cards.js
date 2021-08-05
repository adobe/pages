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

/** @type {import("../block").BlockDecorator} */
export default function decorate(blockEl) {
  blockEl.innerHTML = '<div class="inner three-cards-lr"></div>';

  // const parentEl = document.querySelector('.three-cards-lr')
  // .parentElement.classList.add('image-third');
  const images = document.querySelectorAll('.image-third img');
  const markUp = `
  <a class="three-cards-lr__el" href="https://pages.adobe.com/creativecloud/en/photography-plan/photoshop/" target="_blank">
    <img src="${images[0].getAttribute('src')}">
    <div class="three-cards-lr__content">
      <h4>Learn Photoshop by doing</h4>
    </div>
  </a>
  <a class="three-cards-lr__el" href="https://pages.adobe.com/creativecloud/en/photography-plan/lightroom/" target="_blank">
    <img src="${images[1].getAttribute('src')}">
    <div class="three-cards-lr__content">
      <h4>Learn Lightroom by doing</h4>
    </div>
  </a>
  <a class="three-cards-lr__el" href="https://pages.adobe.com/creativecloud/en/photography-plan/ps-lr/" target="_blank">
    <img src="${images[2].getAttribute('src')}">
    <div class="three-cards-lr__content">
      <h4>Learn to use both apps together</h4>
    </div>
  </a>
  
  `;
  document.querySelector('.three-cards-lr').innerHTML = markUp;
  document.querySelector('.image-third p').remove();
}
