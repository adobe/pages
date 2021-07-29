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

function canvasTest() {
  /** @type {HTMLCanvasElement} */
  const canvas = document.querySelector('#glCanvas');
  // Initialize the GL context
  const gl = canvas.getContext('webgl');
  const img = document.getElementById('corsImage');
  gl.drawImage(img, 0, 0);
}

/** @type {import("../block").BlockDecorator} */
export default function decorate($block, name, doc) {
  $block.innerHTML = `<div id="container" class="flexy">
    <svg id="icon" class="flexy"xmlns="http://www.w3.org/2000/svg" class="icon icon-notfound"><use href="/icons.svg#not-found"></use></svg>
    <div id="heading" class="flexy">welcome to pages.adobe.com</div>
    <div><canvas id="glCanvas" width="640" height="480"></canvas></div>
    <img src="https://blog.adobe.com/en/publish/2021/04/14/media_1d77a080a9c0518f610d1667f17ba529844aa391c.png?width=1200&format=pjpg&optimize=medium"></img>
    <div id="description" class="flexy">we will redirect you to one of our favorite landing pages<br></div>
  </div>`;

  const emojis = ['💯', '💥', '👌', '👏', '👾', '👽', '🤖', '🦾', '🕺'];
  const $links = doc.querySelectorAll('main > div > div > * > a[href]');
  const $description = doc.getElementById('description');

  function countdown() {
    const fun = emojis[Math.floor(Math.random() * emojis.length)];
    $description.innerHTML += fun;
    console.log($description.textContent);
    if ($description.innerHTML.split('<br>')[1].length > 20) {
      const url = new URL($links[Math.floor(Math.random() * $links.length)].href);
      const href = url.pathname + url.search;
      if (window.location.hostname === 'localhost') {
        $description.innerHTML = `<a href='${href}'>take me to a landing page</a>`;
      } else {
        // window.location.href = href;
      }
    } else {
      setTimeout(countdown, 300);
    }
  }

  canvasTest();
  countdown();
}
