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
  const bg = element.querySelector(':scope > div:first-of-type > div');
  const isDark = element.classList.contains('dark');
  bg.classList.add('background');
  const bgImg = bg.querySelector(':scope img');
  if (!bgImg) {
    bg.style.display = 'none';
    const bgColor = bg.textContent;
    element.style.background = bgColor;
  }
  const content = element.querySelector(':scope > div:last-of-type');
  content.classList.add('container');
  content.querySelector(':scope > div:first-of-type').classList.add('text');
  content.querySelector(':scope > div:last-of-type').classList.add('image');

  const ctas = content.querySelectorAll(':scope > div:first-of-type a');
  let i;
  for (i = 0; i < ctas.length; i += 1) {
    const isSecondLink = (i === 0 && ctas.length > 1);
    const modClass = isSecondLink ? 'secondary' : 'primary';
    ctas[i].classList.add('button', modClass);
    if (isDark && isSecondLink) {
      ctas[i].classList.add('over-background');
    }
  }
};

export default init;
