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
function setUpBackground() {
  const blockEl = document.querySelector('.missionbg');
  const containerEl = document.querySelector('.missionbg-container');

  if (!blockEl || !containerEl) return;
  const mainEl = document.querySelector('main');
  if (blockEl.classList.contains('tall')) {
    mainEl.classList.add('tall-bg');
    containerEl.classList.add('tall');
  }

  if (blockEl.classList.contains('tallest')) {
    mainEl.classList.add('tallest-bg');
    containerEl.classList.add('tallest');
  }

  const backgroundImage = containerEl.querySelector('img').getAttribute('src');
  containerEl.style.backgroundImage = `url(${backgroundImage})`;
  containerEl.innerHTML = '';
}

setUpBackground();
