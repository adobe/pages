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

import {
  loadCSS,
  appearMain,
  insertFooter,
} from '../default/default.js';

import { wrapSections } from '../default/default-blocks.js';

import decorateNav from './decorators/decorateNav.js';
import decorateGeneral from './decorators/decorateGeneral.js'; //   loadURLParams, applyURLParams, externalLinks, fixLinksWithAmpersands,
import decorateLanding from './decorators/decorateLanding.js';
import decorateCategory from './decorators/decorateCategory.js';
// import setUpBranch from './scripts/branch.js';

export default async function decoratePage() {
  loadCSS('/templates/default/default.css', true, true);
  decorateNav();
  decorateGeneral();
  decorateLanding();
  decorateCategory();

  insertFooter();
  wrapSections('footer>div');

  // applyURLParams();
  // externalLinks();
  // setUpBranch();
  // fixLinksWithAmpersands();

  window.pages.decorated = true;
  appearMain();
  document.body.classList.add('loaded');
}
