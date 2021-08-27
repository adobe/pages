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

/** @type {import("../../component").ComponentDecorator} */
export default function decorate(blockEl) {
  blockEl.innerHTML = `<div class="wg-form-container">
  <form id="wg-form">
    <div class="input-el">
      <label for="name"> First and Last Name </label>
      <input type="text" name="name" required/>
    </div>
    <div class="input-el">
      <label for="email"> Email Address </label>
      <input type="text" name="email" required/>
    </div>
    <div class="text-el">
      <label for="what-did-you-hope-to-accomplish">
        What did you hope to accomplish with the product(s) in the trial period?
      </label>
      <textarea
        name="what-did-you-hope-to-accomplish"
        cols="30"
        rows="5"
        required
      ></textarea>
    </div>
    <div class="radio-el">
      <span
        >Rate your trial experience on a scale of 1-5 (1=very bad and 5=very
        good). *
      </span>
      <div class="radio-options-parent">
        <div class="radio-option">
          <input type="radio" id="one" name="rating-trial" value="1" required/>
          <label for="one">1 - very bad</label>
        </div>
        <div class="radio-option">
          <input type="radio" id="two" name="rating-trial" value="2" required/>
          <label for="two">2 - bad</label>
        </div>
        <div class="radio-option">
          <input type="radio" id="three" name="rating-trial" value="3" required/>
          <label for="three">3 - neutral</label>
        </div>
        <div class="radio-option">
          <input type="radio" id="four" name="rating-trial" value="4" required/>
          <label for="four">4 - good</label>
        </div>
        <div class="radio-option">
          <input type="radio" id="five" name="rating-trial" value="5" required/>
          <label for="five">5 - very good</label>
        </div>
      </div>
    </div>
    <div class="text-el">
      <label for="Why-did-you-choose-the-above-rating">
        Why did you choose the above rating?
      </label>
      <textarea
        name="Why-did-you-choose-the-above-rating"
        cols="30"
        rows="5"
        required
      ></textarea>
    </div>

    <div class="submit-el">
      <button type="submit">Submit</button>
    </div>
  </form>
</div>`;

  function setupForm() {
    const $formContainer = document.querySelector('.wg-form-container');
    const $form = document.getElementById('wg-form');

    const formsink = 'https://prod-04.westus.logic.azure.com/workflows/208eda8502f5440b8c1ed29b8b1f52ae/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=OWEAdTTTpKL41to8EIElBqapHj5Chk6eapOjFZFz1YA';

    let sheet;
    let thankyou;
    $formContainer.parentElement.querySelectorAll('a').forEach(($a) => {
      if ($a.textContent.toLowerCase() === 'sheet') {
        sheet = $a.href;
        $a.parentElement.remove();
      }

      if ($a.textContent.toLowerCase() === 'thank you') {
        thankyou = $a.href;
        $a.parentElement.remove();
      }
    });

    const values = [{ name: 'timestamp', value: new Date().toISOString().replace(/[TZ]/g, ' ').split('.')[0].trim() }];

    $form.addEventListener('submit', async (evt) => {
      evt.preventDefault();
      if ($form.reportValidity()) {
        $form.querySelectorAll('input, textarea').forEach(($f) => {
          if (($f.getAttribute('type') !== 'radio') || $f.checked) {
            values.push({ name: $f.name, value: $f.value });
          }
        });

        const body = { sheet, data: values };
        const resp = await fetch(formsink, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body), // body data type must match "Content-Type" header
        });
        // eslint-disable-next-line no-unused-vars
        const text = await resp.text();
        window.location = thankyou;
      }

      return false;
    });
  }

  document.getElementsByTagName('body')[0].classList.add('has-wg-form');

  setupForm();
}
