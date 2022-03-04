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

import useTranslations from '../../internal/tutorial-context-langs.js';

const lang = useTranslations();

const { locale } = window.pages;

export default function decorate(blockEl) {
  blockEl.innerHTML = `
<header>
  <nav>
    <h3>Tutorial: <span id="tutorial-name"></span></h3>
    <p>
      ${lang[locale].stepAt}&nbsp;<span id="current-step"></span>&nbsp;${lang[locale].stepOf}&nbsp;<span id="total-steps"></span>&nbsp;•&nbsp;
      <a class="text-link" id="see-all-steps" href="./">
        ${lang[locale].seeAllSteps}
      </a>
    </p>
  </nav>
</header>`;
  async function fetchSteps() {
    const resp = await fetch('steps.json');
    const json = await resp.json();
    return (Array.isArray(json) ? json : json.data);
  }

  async function setData() {
    const steps = await fetchSteps();
    const currentIndex = parseInt(window.location.search.split('?')[1], 10);

    const $tutTitle = document.getElementById('tutorial-name');
    $tutTitle.innerHTML = steps[0].Title;

    const $currentStep = document.getElementById('current-step');
    $currentStep.innerHTML = currentIndex;

    const $totalSteps = document.getElementById('total-steps');
    $totalSteps.innerHTML = steps.length;
  }

  setData();
}
