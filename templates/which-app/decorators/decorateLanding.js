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

export default function decorateLanding() {
  const introSection = document.querySelector(
    '.landingintrosection',
  );
  if (!introSection) return;
  introSection.classList.add('columns');

  const videoLinks = introSection.querySelectorAll('a');
  videoLinks.forEach((link) => {
    const imgElement = link.querySelector('img');
    imgElement?.removeAttribute('width');
    imgElement?.removeAttribute('height');

    link.addEventListener('click', (e) => {
      e.preventDefault();
      const videoElement = document.createElement('video');
      videoElement.setAttribute('controls', true);
      videoElement.setAttribute('autoplay', true);
      videoElement.setAttribute('src', link.getAttribute('href'));
      link.parentElement.replaceChild(videoElement, link);
    });
  });

  const categoryHeader = document.querySelector(
    '.landingcategoryheader',
  );
  categoryHeader.classList.add('columns');
  // flattenDom(introSection, 1)

  const categories = document.querySelectorAll(
    '.landingcategories > div',
  );
  const initialPathMinusHashAndTrailingSlash = window.location.pathname
    .replace(/\/$/, '')
    .replace(/#.*$/, '');
  categories.forEach((category) => {
    const headerContent = category.querySelector('h1')?.innerHTML;
    category.addEventListener('click', () => {
      window.location.href = `${initialPathMinusHashAndTrailingSlash}/${headerContent
        .toLowerCase()
        .replace(/ /g, '')}`;
    });
  });
}
