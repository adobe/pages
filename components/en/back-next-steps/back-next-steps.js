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
import useTranslations from '../../internal/tutorial-context-langs.js';

const lang = useTranslations();

async function fetchSteps() {
  const resp = await fetch('steps.json');
  const json = await resp.json();
  return (Array.isArray(json) ? json : json.data);
}

async function setData() {
  const steps = await fetchSteps();
  const currentIndex = parseInt(window.location.search.split('?')[1], 10);
  const nextLink = document.querySelector('#next-step');
  const backLink = document.querySelector('#back-step');
  const nextURL = `step?${currentIndex + 1}`;
  const backURL = `step?${currentIndex - 1}`;
  // console.log("steps length is " + steps.length)
  // console.log("currentindex is " + currentIndex)

  if (currentIndex !== 1 && currentIndex !== steps.length) {
    backLink.setAttribute('href', backURL);
    nextLink.setAttribute('href', nextURL);
  } else if (currentIndex === 1) {
    backLink.remove();
    nextLink.setAttribute('href', nextURL);
  } else if (currentIndex === steps.length && window.location.toString().indexOf('get-started') < 1) {
    backLink.setAttribute('href', backURL);
    backLink.innerHTML = lang[window.pages.locale].back;
    nextLink.setAttribute('href', 'https://creativecloud.adobe.com/apps/download/lightroom-classic');
    nextLink.innerHTML = lang[window.pages.locale].start;
  } else if (currentIndex === steps.length && window.location.toString().indexOf('get-started') > 0) {
    let advURL = window.location.toString().replace('get-started', 'dive-deep');
    advURL = advURL.replace(currentIndex, '1');
    backLink.setAttribute('href', advURL);
    backLink.innerHTML = 'Start intermediate tutorial';
    nextLink.setAttribute('href', 'https://creativecloud.adobe.com/apps/download/lightroom-classic');
    nextLink.innerHTML = lang[window.pages.locale].start;
  }
}

/** @type {import("../../component").ComponentDecorator} */
export default function decorate(blockEl) {
  blockEl.innerHTML = `
  <footer>
    <nav>
      <a class="button" id="back-step" href="./step?1">
        ${lang[window.pages.locale].back}
      </a>
      <a class="button action" id="next-step" href="./step?3">
        ${lang[window.pages.locale].next}
      </a>
    </nav>
  </footer>`;

  setData();
}
