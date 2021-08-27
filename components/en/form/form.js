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

import { decorateForm } from '../../../pages/blocks/form/form.js';
import {
  emit, hideElements, showElements, toClassName,
} from '../../../pages/scripts/scripts.js';

/**
 * Reads a form config, returns config & a promise.
 *
 * @param {HTMLElement} $block
 * @returns {import('../../../pages/blocks/form/index').FormConfig}
 */
function readFormConfig($component) {
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

  return config;
}

/** @type {import('../../component').ComponentDecorator} */
export default async function decorate($component) {
  const formId = 'wg-form';
  // Hide sheet, thank you, footer while loading
  hideElements('.form-container', 'footer');

  const config = readFormConfig($component);
  emit('components/en/form:config', config);
  await decorateForm($component, formId, config);

  showElements('.form-container', 'footer');
}
