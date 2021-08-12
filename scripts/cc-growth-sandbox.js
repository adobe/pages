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

function createHeroElement($element) {
  const hero = $element;
  if (!$element) return;
  const heroBackground = hero.querySelector('img').getAttribute('src');
  const heroContent = hero.querySelector('.header');

  hero.innerHTML = `
      <div class="hero">
        <div class="inner hero__inner">
          ${heroContent.innerHTML}
        </div>
        <div class="hero-background" style="background-image: url(${heroBackground});">
        </div>
      </div>
    `;
}

if (document.readyState === 'loading') {
  window.addEventListener('DOMContentLoaded', () => {
    createHeroElement(document.querySelectorAll('.title')[0]);
  });
} else {
  createHeroElement(document.querySelectorAll('.title')[0]);
}
