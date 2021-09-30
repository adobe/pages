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

const headerwithlockup = ($header) => {
  const header = $header.querySelector('.headerwithlockup div');

  let hasIconWithText = null;
  let hasListItems = null;

  const $firstChild = header.querySelector('div:first-of-type');
  const $lastChild = header.querySelector('div:last-of-type');

  if ($firstChild && $firstChild.childElementCount > 1) {
    $firstChild.classList.add('has-text');
    hasIconWithText = true;
  }

  if (header.querySelector('div:last-of-type').childElementCount === 0) {
    header.querySelector('div:last-of-type').remove();
  } else if (!$lastChild.querySelector('ul')) {
    header.querySelector('div:last-of-type').remove();
    console.error('You need an UL (list item) in the right block');
  } else {
    hasListItems = true;
    header.classList.add('has-nav');
    if (hasIconWithText) header.classList.add('align-center');
  }

  if (hasListItems) {
    const mobileBtn = document.createElement('button');
    mobileBtn.innerText = 'menu';
    mobileBtn.classList.add('menu-button');
    mobileBtn.innerHTML = `
      <span class="sr-only">Menu</span>
      <span></span>
      <span></span>
      <span></span>
    `;
    $firstChild.appendChild(mobileBtn);
    mobileBtn.addEventListener('click', () => {
      document.querySelector('.headerwithlockup-container').classList.toggle('menu-showing');
    });
  }
};
export default headerwithlockup;
