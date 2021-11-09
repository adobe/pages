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

function decorateButtons(linkNodeList) {
  let i;
  for (i = 0; i < linkNodeList.length; i += 1) {
    const isSecondLink = (i === 0 && linkNodeList.length > 1);
    const modClass = isSecondLink ? 'secondary' : 'primary';
    linkNodeList[i].classList.add('button', modClass);
    linkNodeList[i].parentElement.classList.add('button-container');
  }
}

export default function decorate($block) {
  const bg = $block.querySelector(':scope > div:first-of-type > div');
  bg.classList.add('background');
  const bgImg = bg.querySelector(':scope img');
  if (!bgImg) {
    bg.style.display = 'none';
    const bgColor = bg.textContent;
    $block.style.background = bgColor;
  }
  const content = $block.querySelector(':scope > div:last-of-type');
  content.classList.add('container');
  content.querySelector(':scope > div:first-of-type').classList.add('marquee-column');
  content.querySelector(':scope > div:last-of-type').classList.add('marquee-column');
  const picElement = content.querySelector(':scope picture');
  if (picElement) {
    picElement.parentElement.classList.add('marquee-image');
  }
  const ctasLeft = content.querySelectorAll(':scope > div:first-of-type a');
  decorateButtons(ctasLeft);
  const ctasRight = content.querySelectorAll(':scope > div:last-of-type a');
  decorateButtons(ctasRight);
}
