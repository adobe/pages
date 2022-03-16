/*
 * Copyright 2022 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */
const createSideBar = ($block, json) => {
  const $sideBar = document.createElement('div');
  $sideBar.classList.add('sidebar');

  let sidebar = '';
  json.forEach((item) => {
    sidebar += `<div class="sidebar__item">${item.text}</div>`;
  });

  $sideBar.innerHTML = `${sidebar}<div class="indicator"><div class="indicator__el"></div></div>`;
  $block.appendChild($sideBar);
};

export default createSideBar;
