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

export default function navLayout() {
  const $header = document.querySelector('header');
  const $headerContent = {
    productType: $header.querySelector('p').innerHTML,
    nav: $header.querySelector('ul').outerHTML,
  };
  return (
    `<div class="tutorial-nav">
      <div>
        ${$headerContent.productType}
        <button>
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
      <div>
        ${$headerContent.nav}
      </div>
    </div>`
  );
}

export const navHandler = () => {
  const button = document.querySelector('.tutorial-nav button');

  function toggleNav() {
    document.querySelector('header').classList.toggle('nav-showing');
  }

  if (button) {
    button.addEventListener('click', toggleNav);
  }
};
