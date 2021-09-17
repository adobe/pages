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

/* eslint-disable */

async function fetchSteps() {
  window.hlx.dependencies.push('steps.json');
  const resp = await fetch('steps.json');
  const json = await resp.json();
  return (Array.isArray(json) ? json : json.data);
}

const get_indexes = async () => {
  const currentIndex = window.location.search.split('?')[1].split('&')[0];
  console.log({ currentIndex });
  const data = await fetchSteps();
};

export default function decorate($el) {
  $el.innerHTML = `
<div class="must-haves">
  <div class="must-haves__inner">
    <h3 class="must-haves__title">Tutorials must-haves</h3>
    <p class="must-haves__copy">Follow along with the tutorial workflow on your desktop.</p>
    <div class="files-ete">
      <!-- Files here -->
    </div>
  </div>
</div>


<div class="more-content--ete">
  <h3 class="section-title--ete-more">Let's keep creating.</h3>
  <div class="more-content--ete-inner">
    <!-- mark up -->
  </div>

  <div class="see-all-tutorials--ete">
    <a href="https://pages.adobe.com/creativecloud/en/lr-and-ps-together/">Sea all tutorials</a>
  </div>
</div>`;

  get_indexes();
}
