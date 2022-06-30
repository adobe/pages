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

import { decorateForm, readFormComponentConfig } from '../../../pages/blocks/form/form.js';
import {
  hideElements,
  makeLogger,
  showElements,
} from '../../../templates/default/default.js';

const lgr = makeLogger('components:en:form');

/** @type {import('../../component').ComponentDecorator} */
export default async function decorate($component) {
  const formId = 'wg-form';
  // Hide sheet, thank you, footer while loading
  hideElements('.form-container');

  const config = readFormComponentConfig($component);
  lgr.debug('config', config);
  await decorateForm($component, formId, config);

  showElements('.form-container');
}
