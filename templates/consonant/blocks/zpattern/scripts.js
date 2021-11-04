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
const init = (element) => {
  // create the tabs list container div
  const container = element.querySelector(':scope > div:first-of-type');
  container.classList.add('container');
  const rowIds = element.querySelectorAll(':scope > div:first-of-type > div');
  // create the products container div
  const dv = document.createElement('div');
  dv.classList.add('river-flow');

  rowIds.forEach((id, i) => {
    id.remove();
    const assocIdContent = document.getElementsByClassName(id.textContent)[0];
    if (assocIdContent && container) {
      const rowClassList = (i % 2 === 0) ? 'row-normal' : 'row-reverse';
      assocIdContent.classList.add('flow-content', rowClassList);
      dv.append(assocIdContent);
    }
  });
  container.append(dv);
};

export default init;
