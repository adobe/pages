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
  content.querySelector(':scope > div:first-of-type').classList.add('marquee-column');
  content.querySelector(':scope > div:last-of-type').classList.add('marquee-column');
  content.querySelector(':scope picture').parentElement.classList.add('image');

  const ctasLeft = content.querySelectorAll(':scope > div:first-of-type a');
  let i;
  for (i = 0; i < ctasLeft.length; i += 1) {
    const isSecondLink = (i === 0 && ctasLeft.length > 1);
    const modClass = isSecondLink ? 'secondary' : 'primary';
    ctasLeft[i].classList.add('button', modClass);
    if (isDark && isSecondLink) {
      ctasLeft[i].classList.add('over-background');
    }
  }

  const ctasRight = content.querySelectorAll(':scope > div:last-of-type a');
  let n;
  for (n = 0; n < ctasRight.length; n += 1) {
    const isSecondLink = (n === 0 && ctasRight.length > 1);
    const modClass = isSecondLink ? 'secondary' : 'primary';
    ctasRight[n].classList.add('button', modClass);
    if (isDark && isSecondLink) {
      ctasRight[n].classList.add('over-background');
    }
  }
};

export default init;
