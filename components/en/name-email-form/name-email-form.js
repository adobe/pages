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

import { setupForm, readFormConfig } from '../../../pages/blocks/form/form.js';

/** @type {import("../../component").ComponentDecorator} */
export default function decorate(blockEl) {
  const config = readFormConfig(blockEl);
  blockEl.innerHtml = `<div class="form-container">
  <form id="name-email-form">
    <div class="input-el">
      <label for="firstname">First name </label>
      <input id="firstname" type="text" name="firstname" />
    </div>
    <div class="input-el">
      <label for="lastname">Last name </label>
      <input id="lastname" type="text" name="lastname" />
    </div>
    <div class="input-el">
      <label for="email">Email address
      <span><em>Existing Adobe users: please enter the email you use to login to Adobe.</em></span></label>

      <input type="email" name="email" id="email" class="emails" />
    <span class="emailerror hidden-default">Email fields must match.</span>
    </div>
    <div class="input-el">
      <label for="email2">Confirm email address </label>
      <input type="email" name="email2" id="email2" class="emails" />
    <span class="emailerror hidden-default">Email fields must match.</span>
    </div>
    <p class="legal-text">The Adobe family of companies may keep me informed with personalized emails about Adobe InDesign Online Copy Editing. See our <a href="https://www.adobe.com/privacy.html">Privacy Policy</a> for more details or to opt-out at any time.</p>

    <div class="submit-el">
      <input type="submit" value="Apply for early access"/>
    </div>
  </form>
</div>`;
  document.getElementsByTagName('body')[0].classList.add('has-name-email-form');
  setupForm({
    formId: 'name-email-form',
    config,
  });
}
