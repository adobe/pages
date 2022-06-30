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

import decorateFormBlock from '../../../pages/blocks/form/form.js';

/** @type {import('../../component').ComponentDecorator} */
export default function decorate(blockEl) {
  blockEl.innerHTML = `
<div class="wg-form-container form-container">
  <form id="wg-form">
    <div class="wg-form-loader">
      <div class="wg-form-loader__indicator"></div>  
    <div>
  </form>
</div>`;

  function clearButtons() {
    const formType = document.querySelectorAll('main p');
    const buttons = document.querySelectorAll('main p a');

    formType.forEach((text) => {
      if (text.textContent.includes('<Form:') || text.textContent.includes('<form:')) {
        text.style.opacity = 0;
      }
    });

    buttons.forEach((a) => {
      if (a.getAttribute('href').includes('https://adobe.sharepoint.com') || a.getAttribute('href').includes('thank-you') || a.getAttribute('href').includes('thankyou')) {
        a.style.opacity = 0;
      }
    });
  }

  clearButtons();

  async function instructor() {
    await decorateFormBlock(blockEl);
  }

  instructor();
}
