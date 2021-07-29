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

window.setupForm = ({
  formId,
  containerClass = 'form-container',
  preValidation = () => true,
}) => {
  const $formContainer = document.querySelector(`.${containerClass}`);
  const $form = document.getElementById(formId);

  const emails = document.getElementsByClassName('emails');
  if (emails.length) {
    // legacy email checker
    for (let i = 0, len = emails.length; i < len; i += 1) {
      emails[i].addEventListener('change', () => {
        const email1 = document.getElementById('email');
        const email2 = document.getElementById('email2');
        const elements = document.getElementsByClassName('emailerror');
        if (email1.value !== email2.value) {
          // this tells the form to fail validation
          email1.setCustomValidity('Email fields must match.');
          elements.forEach((elem) => {
            elem.classList.remove('revealed');
          });
        } else {
          email1.setCustomValidity('');
          email2.setCustomValidity('');
          elements.forEach((elem) => {
            elem.classList.remove('revealed');
          });
        }
      });
    }
  } else {
    const $emails = Array.from($form.querySelectorAll('input[name=email]'));
    $emails.forEach(($e) => {
      $e.addEventListener('change', () => {
        const match = $emails.every(($email) => $emails[0].value === $email.value);
        const validity = match ? '' : 'Email fields must match.';
        $emails.forEach(($email) => {
          $email.setCustomValidity(validity);
          if (validity) $email.reportValidity();
        });
      });
    });
  }

  let sheet;
  let thankyou;
  $formContainer.parentElement.querySelectorAll('a').forEach(($a) => {
    if ($a.textContent.toLowerCase() === 'sheet') {
      sheet = $a.href;
      sheet = sheet.replace('%5C', ''); // temp fix for escaped &
      $a.parentElement.remove();
    }
    if ($a.textContent.toLowerCase() === 'thank you') {
      thankyou = $a.href;
      $a.parentElement.remove();
    }
  });

  // default form urls
  const postURL = 'https://ccgrowth.servicebus.windows.net/formsink/messages';
  const postAuth = 'SharedAccessSignature sr=https%3A%2F%2Fccgrowth.servicebus.windows.net%2Fformsink%2Fmessages&sig=RFndMU%2FyHZrlchNBfHlIdulld4URAgUAQdAlqVLf1Bw%3D&se=1634259041&skn=send';
  const testURL = 'https://adobeioruntime.net/api/v1/web/helix-clients/ccgrowth/forms-handler@v1';

  // we validate the form ourselves. otherwise it would already validate on submit and we cannot
  // run the custom logic for the checkboxes.
  $form.setAttribute('novalidate', true);

  function sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }

  function randomString(min, max) {
    let len = Math.round(Math.random() * (max - min) + min);
    let s = '';
    while (len > 0) {
      s += String.fromCharCode(Math.random() * 26 + 97);
      len -= 1;
    }
    return s;
  }

  function randomize() {
    const email = `${randomString(4, 10)}@${randomString(4, 5)}.com`;
    const radios = {};
    $form.querySelectorAll('input, textarea').forEach(($f) => {
      if (!$f.name) {
        return;
      }
      if ($f.name === 'email' || $f.name === 'email2') {
        $f.value = email;
      }
      const type = $f.getAttribute('type');
      if (type === 'text') {
        $f.value = `${randomString(3, 10)} ${randomString(3, 10)}`;
      }
      if (type === 'radio') {
        if (!radios[$f.name]) {
          radios[$f.name] = true;
          const $els = $form.querySelectorAll(`input[name=${$f.name}]`);
          $els[Math.floor(Math.random() * $els.length)].checked = true;
        }
      }
      if (type === 'checkbox') {
        $f.checked = Math.random() > 0.5;
      }
    });
  }

  async function submit(uri = postURL, counter) {
    preValidation();
    if (!$form.reportValidity()) {
      return false;
    }
    if (!sheet) {
      console.error('No sheet url configured.');
      return false;
    }

    const values = [{
      name: 'timestamp',
      value: new Date().toISOString().replace(/[TZ]/g, ' ').split('.')[0].trim(),
    }];
    if (counter !== undefined) {
      values.push({
        name: 'counter',
        value: counter,
      });
    }
    $form.querySelectorAll('input, textarea, select').forEach(($f) => {
      if (!$f.name || $f.name === 'email2') {
        // skip email2
        return;
      }

      const type = $f.getAttribute('type');
      if ((type !== 'radio' && type !== 'checkbox') || $f.checked) {
        const existing = values.find((v) => v.name === $f.name);
        if (existing) {
          // add if not email confirmation
          if ($f.name !== 'email') {
            existing.value += `, ${$f.value}`;
          }
        } else {
          values.push({ name: $f.name, value: $f.value });
        }
      }
    });

    const body = { sheet, data: values };
    console.log('invoking', uri);

    const resp = await fetch(uri, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: postAuth,
      },
      body: JSON.stringify(body),
    });
    const text = await resp.text();

    console.log(values[0].value, `${counter}`, resp.status, text, body);
    return resp.status;
  }

  $form.addEventListener('submit', async (evt) => {
    evt.preventDefault();
    if (await submit()) {
      window.location = thankyou;
    }
  });

  async function loadtest() {
    const NUM_POSTS = 50;
    const OFFSET = 0;
    for (let i = 1; i <= NUM_POSTS; i += 1) {
      randomize();
      // This appears to rely on timing, so ignore await in loops
      // eslint-disable-next-line no-await-in-loop
      const status = await submit(postURL, i + OFFSET);
      if (status === 429) {
        console.log('sleeping for 5 seconds');
        // eslint-disable-next-line no-await-in-loop
        await sleep(5000);
        i -= 1;
      }
    }
  }

  async function setup() {
    if (testURL) {
      await submit(testURL, 0);
    } else {
      console.log('no test url configured');
    }
  }

  if (window.location.hash === '#formtools' && !document.getElementById('formtools')) {
    const createButton = (text, onClick) => {
      const $btn = document.createElement('button');
      $btn.addEventListener('click', onClick);
      $btn.append(document.createTextNode(text));
      return $btn;
    };
    const $tools = document.createElement('div');
    $tools.setAttribute('id', 'formtools');
    $tools.append(createButton('Randomize', randomize));
    $tools.append(createButton('Load Test', loadtest));
    $tools.append(createButton('Setup / Test', setup));
    $formContainer.append($tools);
  }
};
