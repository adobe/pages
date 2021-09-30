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
const header = document.querySelector('.headerwithlockup div');
let hasText = null;
let hasNav = null;

if (header.querySelector('div:first-of-type').childElementCount > 1) {
  header.querySelector('div:first-of-type').classList.add('has-text');
  hasText = true;
}

if (header.querySelector('div:last-of-type').childElementCount === 0) {
  header.querySelector('div:last-of-type').remove();
} else {
  hasNav = true;
  header.classList.add('has-nav');
  if (hasText) header.classList.add('align-center');
}

if (hasNav) {
  const mobileBtn = document.createElement('button');
  mobileBtn.innerText = 'menu';
  mobileBtn.classList.add('menu-button');

  mobileBtn.innerHTML = `
    <span class="sr-only">Menu</span>
    <span></span>
    <span></span>
    <span></span>
  `;
  header.querySelector('div:first-of-type').appendChild(mobileBtn);

  document.querySelector('.menu-button').addEventListener('click', () => {
    document.querySelector('.headerwithlockup-container').classList.toggle('menu-showing');
  });
}
