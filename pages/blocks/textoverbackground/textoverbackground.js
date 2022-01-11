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

export default async function textOverBackground($block) {
  if (!$block) return;
  const backgroundColumn = $block.querySelector('div').childNodes[1];

  const setBackground = ($typeOfBackground) => {
    const parent = $block.closest('.section-wrapper');
    if ($typeOfBackground.includes('#')) {
      parent.style.backgroundColor = $typeOfBackground;
      parent.classList.add('has-background-color');
    } else {
      const picture = document.createElement('picture');
      picture.innerHTML = $typeOfBackground;
      // parent.style.backgroundImage = `url(${$typeOfBackground})`;

      parent.appendChild(picture);
      parent.classList.add('has-background-image');
    }
  };

  if (backgroundColumn.querySelector('img')) {
    setBackground(backgroundColumn.querySelector('picture').innerHTML);
    backgroundColumn.remove();
  } else if (backgroundColumn.childNodes.length === 1) {
    if (backgroundColumn.innerText.includes('#')) {
      setBackground(backgroundColumn.innerText);
      backgroundColumn.remove();
    } else {
      console.warn('Your background column needs to be either a #hex value or include an image');
    }
  } else {
    console.warn('Your background column needs to be either a #hex value or include an image');
  }
}
textOverBackground();
