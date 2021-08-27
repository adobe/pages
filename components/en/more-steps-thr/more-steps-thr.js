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

async function fetchSteps() {
  const resp = await fetch('steps.json');
  const json = await resp.json();
  return (Array.isArray(json) ? json : json.data);
}

async function setData() {
  const steps = await fetchSteps();
  document.querySelector('main > div:last-of-type').classList.add('additional-cards');
  const currentIndex = window.location.search.split('?')[1];
  const parentElement = document.querySelector('.more-cards');
  let cards = '';
  for (let i = 0; i < steps.length; i += 1) {
    const url = `${window.location.href.split('?')[0]}?${i + 1}`;
    if (i !== currentIndex - 1 && i !== (parseInt(currentIndex - 1, 10) + 1) && i < 6) {
      cards += `
          <div class="more-cards__item">
              <a href="${url}">
                  <span class="more-cards__img">
                      <img src="${steps[i].Thumbnail}">
                  </span>

                  <span class="more-cards__details">
                      <h3>${steps[i].Title}</h3>
                      ${steps[i].Description}
                  </span>
              </a>
          </div>
          `;
    }
  }
  parentElement.innerHTML = cards;
}

/** @type {import("../../component").ComponentDecorator} */
export default async function decorate($block) {
  $block.innerHTML = '<div class="more-cards-container"><div class="more-cards"></div></div>';
  setData();
}
