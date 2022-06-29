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

/* eslint-disable no-continue */

import {
  hideElements,
  readBlockConfig,
  showElements,
  toClassName,
  makeLogger,
  createTag,
  insertContentEmbed,
} from '../../../templates/default/default.js';

const lgr = makeLogger('blocks:form');
const DEFAULT_BASE_URL = 'https://main--pages-forms--adobe.hlx.live';

/**
 * Setup form elements and actions
 *
 * @param {import('./index.d.ts').SetupFormOptions} opts
 */
export function setupForm({
  doc,
  formId,
  config,
  containerClass = 'form-container',
  preValidation = () => true,
  element,
}) {
  if (!config) {
    // eslint-disable-next-line no-use-before-define, no-param-reassign
    config = readFormConfig(element ?? document);
  }

  const { sheet, redirect } = config;
  const $formContainer = doc.querySelector(`.${containerClass}`);
  const $form = doc.getElementById(formId);

  const emails = doc.getElementsByClassName('emails');
  if (emails.length) {
  // legacy email checker
    for (let i = 0; i < emails.length; i += 1) {
      emails[i].addEventListener('change', () => {
        const email1 = doc.getElementById('email');
        const email2 = doc.getElementById('email2');
        const elements = doc.getElementsByClassName('emailerror');
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
    $emails.forEach(($email) => {
      $email.addEventListener('change', () => {
        const match = $emails.every(($e) => $emails[0].value === $e.value);
        const validity = match ? '' : 'Email fields must match.';
        $emails.forEach(($e) => {
          $e.setCustomValidity(validity);
          if (validity) $e.reportValidity();
        });
      });
    });
  }

  // $formContainer.parentElement.querySelectorAll('a').forEach(($a) => {
  //   if ($a.textContent.toLowerCase() === 'sheet') {
  //     sheet = $a.href;
  //     sheet = sheet.replace('%5C','') //temp fix for escaped &
  //     $a.parentElement.remove();
  //   }
  //   if ($a.textContent.toLowerCase() === 'thank you') {
  //     thankyou = $a.href;
  //     $a.parentElement.remove();
  //   }
  // });

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

  async function submit(baseURL = DEFAULT_BASE_URL, counter) {
    preValidation({ formEl: $form });
    if (!$form.reportValidity()) {
      return false;
    }
    if (!sheet) {
      console.error('No sheet path/url configured.');
      return false;
    }

    /** @type {string} */
    let path;
    if (sheet.startsWith('http://') || sheet.startsWith('https://')) {
      const url = new URL(sheet);
      path = url.searchParams.get('file');
      if (!path) {
        path = url.pathname;
        const spl = path.split('CCGrowthHelixContent/Shared%20Documents');
        path = spl[1] || spl[0];
      }
    } else {
      path = sheet;
    }

    if (path.endsWith('.json') || path.endsWith('.xlsx')) {
      path = path.substring(0, path.length - 5);
    }

    if (!path.startsWith('/')) {
      path = `/${path}`;
    }
    if (!path.startsWith('/formsink/')) {
      path = `/formsink${path}`;
    }

    lgr.debug('form submission path: ', path);

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

    const url = `${baseURL}${path}`;
    lgr.debug('form submission url: ', url);

    const body = { data: values };

    const resp = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    const text = await resp.text();

    console.debug(values[0].value, `${counter}`, resp.status, text, body);
    return resp.status;
  }

  $form.addEventListener('submit', async (evt) => {
    evt.preventDefault();
    if (await submit()) {
      window.location = redirect;
    }
  });

  async function loadtest() {
    const NUM_POSTS = 50;
    const OFFSET = 0;
    for (let i = 1; i <= NUM_POSTS; i += 1) {
      randomize();
      // eslint-disable-next-line no-await-in-loop
      const status = await submit(DEFAULT_BASE_URL, i + OFFSET);
      if (status === 429) {
        console.debug('sleeping for 5 seconds');
        // eslint-disable-next-line no-await-in-loop
        await sleep(5000);
        i -= 1;
      }
    }
  }

  async function setup() {
    const testUrl = new URL(window.location.href).searchParams.get('testUrl');
    if (testUrl) {
      await submit(testUrl, 0);
    } else {
      console.error('no test url configured');
    }
  }

  if (window.location.hash === '#formtools' && !doc.getElementById('formtools')) {
    const createButton = (text, onClick) => {
      const $btn = doc.createElement('button');
      $btn.addEventListener('click', onClick);
      $btn.append(doc.createTextNode(text));
      return $btn;
    };
    const $tools = doc.createElement('div');
    $tools.setAttribute('id', 'formtools');
    $tools.append(createButton('Randomize', randomize));
    $tools.append(createButton('Load Test', loadtest));
    $tools.append(createButton('Setup / Test', setup));
    $formContainer.append($tools);
  }
}

/**
   * @param {string} label
   * label = string of form input
   */
function inputSettings(label) {
  const visibleLabel = label;
  let cleanLabel = label;
  cleanLabel = label.indexOf(' ') >= 0 ? label.split(' ').join('-').toLowerCase() : label.toLowerCase();
  cleanLabel = label.indexOf('-*') >= 0 ? label.split('*')[0] : label;
  cleanLabel = label.indexOf('-(') >= 0 ? label.split('(')[0] : label;
  const settings = {
    label: visibleLabel,
    label_clean: cleanLabel,
    required: visibleLabel.indexOf('*') >= 0 ? 'required' : '',
  };
  return settings;
}

function csvOrLinesToArray(input) {
  if (input.includes('\n')) {
    return input.split('\n').map((o) => o.trim());
  } else {
    return input.split(',').map((o) => o.trim());
  }
}

function hideConditionals($form, $inputs, formData) {
  const values = $inputs.map(($i) => {
    if (($i.type === 'checkbox' || $i.type === 'radio') && !$i.checked) return null;
    return $i.value;
  });
  formData.forEach((item) => {
    if (item.show_if) {
      const showIfValues = csvOrLinesToArray(item.show_if);
      let match = false;
      showIfValues.forEach((val) => {
        if (values.includes(val)) match = true;
      });

      const qs = '.radio-el, .select-el, .input-el, .text-el, .redirect-el, .info-el';
      const $div = $form.querySelector(`[name="${item.name}"]`).closest(qs);
      if (!$div) return;
      if (match) {
        $div.classList.remove('hidden');
      } else {
        $div.classList.add('hidden');
      }

      // if it's a redirect, hide or show progress/submit button
      if (item.type === 'redirect') {
        const $pg = $form.querySelector('.progress-indicator-group');
        if (!$pg) return;

        if (match) {
          $pg.classList.add('hidden');
        } else {
          $pg.classList.remove('hidden');
        }
      }
    }
  });
}

/**
 * Create form elements from data.
 * @param {import('./index.d.ts').CreateFormOptions} opts
 */
function createForm({
  doc,
  formEl,
  formId,
  formData,
  hasPageBreak,
}) {
  let formField = '';
  let formSubmitPresent = false;
  let progressLabel = '';

  formData.forEach((item, index) => {
    const setup = inputSettings(item.label);
    const name = item.name ? item.name : setup.label_clean;
    const required = item.required ? item.required : setup.required;
    const description = hasPageBreak && item.description.length > 0 ? `<span class="description-title">${item.description}</span>` : '';

    if (item.type === 'indicator') {
      progressLabel = item.label;
    }

    let placeholder = !!item.placeholder;

    if (placeholder) {
      if (item.placeholder.length > 3) {
        placeholder = `${item.placeholder}`;
      } else {
        placeholder = '';
      }
    } else {
      placeholder = '';
    }

    if (index === 0 && hasPageBreak) {
      formField += `
        <div class="slide-form-container">
          <div class="slide-form-item active">
              `;
    }

    // INPUT TEXT || EMAIL
    if (item.type === 'text' || item.type === 'email') {
      formField += `
        <div class="input-el question ${required ? 'is-required' : ''}">
          <div class="title-el">
            <label class="label-title" for="${name}">${setup.label}</label>
            ${description}
          </div>
          <input type="${item.type}" name="${name}" placeholder="${placeholder}" ${required}/>
        </div>
        `;
    }

    // RADIO INPUTS
    if (item.type.includes('radio')) {
      const optionsAll = csvOrLinesToArray(item.options);
      let radioOption = '';

      optionsAll.forEach((option) => {
        const cleanOptionName = toClassName(option);
        const id = `${name}-${cleanOptionName}`;
        const value = option.replace('"', '');
        /* html */
        radioOption += `
          <div class="radio-option">
            <input type="radio" id="${id}" name="${name}" tabindex="0" value="${value}" ${required}/>
            <label for="${id}">${option}</label>
          </div>
        `;
      });
      /* html */
      formField += `
          <div class="radio-el question is-${required}">
            <div class="title-el">
              <span class="label-title">${item.label}</span>
              ${description}
            </div>
            <div class="radio-options-parent">
              ${radioOption}
            </div>
          </div>
        `;
    }

    // REDIRECT
    // adds button to redirect elsewhere
    if (item.type === 'redirect') {
      /* html */
      formField += `
        <div class="redirect-el" name="${name}">
          <a class="form-redirect" href="${item.redirect_to}">${item.label}</a>
        </div>
      `;
    }

    // INFO
    if (item.type === 'info') {
      /* html */
      formField += `
          <div class="info-el" name="${name}">
            <div class="title-el">
              <span class="label-title">${item.description}</span>
            </div>
          </div>
        `;
    }

    // CHECKBOXES
    if (item.type === 'checkbox') {
      const checkboxOptions = csvOrLinesToArray(item.options);
      let options = '';
      checkboxOptions.forEach((option) => {
        const cleanOptionName = toClassName(option);
        const id = `${name}-${cleanOptionName}`;
        const value = option.replace('"', '');
        /* html */
        options += `
            <div class="radio-option">
              <input type="checkbox" 
                id="${id}" 
                name="${name}"
                value="${value}"
              />
              <label for="${id}">${option}</label>
            </div>
          
          `;
      });
      /* html */
      formField += `
          <div class="input-el checkboxes ${required} question is-${required}">
            <div class="title-el">
              <span class="label-title">${item.label}</span>
              ${description}
            </div>
            ${options}
          </div>
        `;
    }

    // SELECT
    if (item.type === 'select') {
      const selectOptions = csvOrLinesToArray(item.options);
      let options = '';
      selectOptions.forEach((option) => {
        /* html */
        options += `
            <option tabindex="0">${option}</option>
          `;
      });
      /* html */
      formField += `
          <div class="select-el question is-${required}">
            <div class="title-el">
              <label class="label-title" for="${name}">${item.label}</label>
              ${description}  
            </div>
            <select name="${name}" id="${name}">
              ${options}
            </select>
          </div>
        `;
    }

    // TEXTAREA
    if (item.type === 'textarea') {
      /* html */
      formField += `
          <div class="text-el question is-${required}">
            <div class="title-el">
              <label class="label-title" for="${name}">${item.label}</label>
              ${description}
            </div>
            <textarea
              name="${name}"
              cols="30"
              rows="5"
              placeholder="${placeholder}"
              ${required}
            ></textarea>
          </div>
        `;
    }

    // TEXTAREA
    if (item.type === 'title') {
      /* html */
      formField += `
          <div class="text-el question is-${required}">
            <div class="title-el">
              <label class="label-title" for="${name}">${item.label}</label>
              ${description}
            </div>
            <hr>
          </div>
        `;
    }

    if (item.type === 'page-break' && hasPageBreak) {
      formField += '</div> <div class=\'slide-form-item\'>';
    }

    if (index === formData.length - 1 && hasPageBreak) {
      formField += '</div></div>';
    }

    // Submit Button
    if (item.type === 'submit' && !hasPageBreak) {
      /* html */
      formField += `
          <div class="submit-el">
            <button type="submit">${item.label}</button>
          </div>
        `;
      formSubmitPresent = true;
    }

    // if element has include, insert it lazily
    if (item.include) {
      window.hlx.dependencies.push(item.include);

      setTimeout(() => {
        const el = formEl.querySelector(`[name="${item.name}"]`);
        if (!el) return;

        const include = createTag('div');
        const parent = el.parentElement;
        const label = parent.querySelector(':scope label');

        if (label) {
          // insert after label
          label.insertAdjacentElement('afterend', include);
        } else {
          // or as first item
          const first = parent.firstElementChild;
          first.insertAdjacentElement('beforebegin', include);
        }

        insertContentEmbed(include, { path: `${item.include}.plain.html`, basename: item.include });
      });
    }
  });

  if (!formSubmitPresent && !hasPageBreak) {
    /* html */
    formField += `
      <div class="submit-el">
        <button type="submit">Submit</button>
      </div>`;
  }
  formEl.innerHTML = formField;

  if (hasPageBreak) {
    const slidePanelParent = doc.createElement('div');
    const buttonParent = doc.createElement('div');
    buttonParent.className = 'panel button-panel';
    slidePanelParent.className = 'panel progress-indicator-group';

    /* html */
    slidePanelParent.innerHTML = `
        <div class="panel__item panel-tab" tabindex="0">
          <div class="indicator">
            <div class="progress-label">
              <div class="progress-name">
                ${progressLabel}
              </div>
              <div class="indicator-crumb">
                <span class="indicator-current">Page 1</span>
                <span>/</span>
                <span class="indicator-total">0</span>
              </div>
            </div>
            <div class="progress-indicator">
              <span></span>
            </div>  
          </div>
        </div>`;
    /* html */
    buttonParent.innerHTML = `
        <div class="panel__item">
          <div class="form-sliders-btns">
            <button class="slide-btn prev" type="button">Back</button>
            <button class="slide-btn next" type="button">Next</button>
            <button type="submit" class="submit" style='display: none;'>Submit</button>
          </div>
        </div>
        `;

    formEl.append(slidePanelParent);
    slidePanelParent.appendChild(buttonParent);
  }

  // show_if
  const showIfTypes = ['select', 'input[type=radio]', 'input[type=checkbox]'];
  const qs = showIfTypes.map((t) => `#${formId} ${t}`).join(',');
  const $inputs = Array.from(doc.querySelectorAll(qs));
  $inputs.forEach(($input) => {
    $input.addEventListener('change', () => {
      hideConditionals(formEl, $inputs, formData);
    });
  });
  hideConditionals(formEl, $inputs, formData);
}

function customValidate({ formEl }) {
  const qs = '.radio-el.hidden, .select-el.hidden, .input-el.hidden';
  const $hiddenEls = formEl.querySelectorAll(qs);
  $hiddenEls.forEach(($div) => {
    $div.querySelectorAll('[required]').forEach(($r) => {
      $r.removeAttribute('required');
    });
  });

  const $requiredCheckboxes = formEl.querySelectorAll('.checkboxes.required');
  $requiredCheckboxes.forEach(($div) => {
    if (!$div.classList.contains('hidden') && !$div.querySelector('input:checked')) {
      // needs to be filled in
      $div.querySelector('input[type=checkbox]').setCustomValidity('Please select at least one checkbox.');
    } else {
      $div.querySelector('input[type=checkbox]').setCustomValidity('');
    }
  });
}

async function fetchFormData(definition) {
  const resp = await fetch(`${definition}.json`);
  const json = await resp.json();
  window.hlx.dependencies.push(`${definition}.json`);
  lgr.debug('formData', json);
  return json;
}

/**
 * Reads a form config from a component.
 *
 * @param {HTMLElement} $block
 * @returns {import('./index').FormConfig}
 */
export function readFormComponentConfig($component) {
  let config = {};
  const $commonRoot = $component.parentNode;
  $commonRoot.querySelectorAll(':scope p').forEach(($p) => {
    let name;
    let value;
    const text = $p.textContent.toLowerCase();
    if (text.includes('<form:')) {
      // <form: TYPE>
      name = 'form-definition';
      value = text.split('<form: ')[1].split('>')[0].trim();
    } else {
      // <a href=URL>Sheet OR Thank You</a>
      const $a = $p.querySelector(':scope>a');
      if ($a) {
        name = toClassName(text);
        value = $a.href;
      }
    }
    config[name] = value;
    $p.remove();
  });

  config = {
    sheet: config['form-data-submission'] || config.sheet,
    redirect: config['form-redirect'] || config['thank-you'] || 'thank-you',
    definition: config['form-definition'] || 'default',
  };

  lgr.debug('readConfig:component', config);

  return config;
}

/**
 * Reads a form config from a block table.
 *
 * @param {HTMLElement} $block
 * @returns {import('./index').FormConfig}
 */
export function readFormBlockConfig($block) {
  let config = readBlockConfig($block);

  config = {
    sheet: config['form-data-submission'] || config.sheet,
    redirect: config['form-redirect'] || config.redirect || config['thank-you'] || 'thank-you',
    definition: config['form-definition'] || config.redirect || 'default',
  };

  lgr.debug('readConfig:block', config);
  return config;
}

/**
 * Reads a form config.
 *
 * @param {HTMLElement} $block
 * @returns {import('./index').FormConfig}
 */
export function readFormConfig($block) {
  let config = readFormBlockConfig($block);
  if (!config.sheet) {
    config = readFormComponentConfig($block);
  }

  lgr.debug('readConfig', config);
  return config;
}

/**
 * Assign names to data entries that don't have names and that don't
 * contribute to submission data. These are used for enabling/disabling fields.
 */
function prepFormData(data) {
  const noDataFields = ['page-break', 'redirect', 'info'];
  const counts = {};
  for (const item of data) {
    if (item.name) {
      // valid
    } else if (item.type === 'page-break') {
      // ignore
    } else if (noDataFields.includes(item.type)) {
      // assign
      counts[item.type] ??= 0;
      counts[item.type] += 1;
      item.name = `${item.type}-${counts[item.type]}`;
    } else {
      // corrupt
      console.error('Invalid form data. Missing `name` on field: ', item);
    }
  }
  return data;
}

export async function decorateForm($block, formId, config) {
  /* html */
  $block.innerHTML = `
  <div class="wg-form-container form-container">
    <form id="wg-form">
      <div class="wg-form-loader">
        <div class="wg-form-loader__indicator"></div>
      <div>
    </form>
  </div>`;

  const formEl = document.getElementById(formId);
  const { definition } = config;
  let hasPageBreak = false;

  const formData = prepFormData((await fetchFormData(definition)).data);

  // check if slider
  for (const item of formData) {
    if (item.type === 'page-break') {
      hasPageBreak = true;
      $block.classList.add('slide-form');
      break;
    }
  }

  createForm({
    ...config,
    doc: document,
    formId,
    formEl,
    formData,
    hasPageBreak,
  });

  if (hasPageBreak) {
    await import('./slide-form.js');
  }

  setupForm({
    doc: document,
    formId,
    config,
    preValidation: customValidate,
  });
}

/** @type {import('../block.js').BlockDecorator} */
export default async function decorate($block) {
  const formId = 'wg-form';
  // Hide sheet, thank you, footer while loading
  hideElements('.form-container');

  const config = readFormConfig($block);
  await decorateForm($block, formId, config);

  showElements('.form-container');
}
