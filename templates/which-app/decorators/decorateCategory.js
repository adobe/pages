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

export default function decorateCategory() {
  const centeredIntro = document.querySelector(
    '.centeredintro',
  );
  if (!centeredIntro) return;
  centeredIntro.classList.add('columns');

  const doubleVideo = document.querySelector('.doublevideo');
  doubleVideo.classList.add('columns');
  const videoLinks = doubleVideo.querySelectorAll('a');
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

  const taskSelector = document.querySelector('.taskselector');
  taskSelector.classList.add('columns');

  // wrap all but the first child in a div
  const taskSelectorChildrenWrapper = document.createElement('div');
  taskSelectorChildrenWrapper.classList.add('tasks');
  [...(taskSelector?.children || [])]
    .slice(1)
    .forEach((child) => {
      taskSelectorChildrenWrapper.appendChild(child);
      child.addEventListener('click', () => {
        const header = child.querySelector('div:last-child')?.innerHTML;
        const headerElement = document.getElementById(header?.toLowerCase().replace(/ /g, '-').replace(/,/g, ''));
        headerElement?.scrollIntoView({ behavior: 'smooth' });
      });
    });
  taskSelector?.appendChild(taskSelectorChildrenWrapper);

  const categorySections = document.querySelectorAll(
    '.categorysection',
  );
  categorySections.forEach((categorySection) => {
    categorySection.classList.add('columns');
  });

  // decorate 2-image overlap revealers
  document.querySelectorAll('.categorysection > div > div > table > tbody > tr > td:nth-of-type(1) > picture:nth-of-type(2)').forEach((picture) => {
    const underlyingPicture = picture.previousElementSibling;
    picture.classList.add('overlaidpicture');
    const img = picture.querySelector('img');
    picture.style.setProperty('--offset', '.5');

    const setOffset = (e) => {
      const { offsetX } = e;
      const width = img.offsetWidth;
      let offsetPercent = offsetX / width;
      if (offsetPercent > 0.98) offsetPercent = 1;
      if (offsetPercent < 0.02) offsetPercent = 0;
      picture.style.setProperty('--offset', `${offsetPercent}`);
    };

    underlyingPicture.addEventListener('mousemove', setOffset);
    underlyingPicture.addEventListener('click', setOffset);
  });

  // decorate bottom areas of category sections
  const categorySectionBottoms = document.querySelectorAll('.categorysection > div > div > table > tbody > tr > td:nth-of-type(3)');
  categorySectionBottoms.forEach((categorySectionBottom) => {
    categorySectionBottom.classList.add('categorysectionbottom');

    const links = categorySectionBottom.querySelectorAll('td > a');
    links.forEach((link) => {
      link.classList.add('button');
    });

    categorySectionBottom.querySelectorAll('.categorysectionbottom td:nth-child(2)').forEach((td) => {
      const tr = td.parentElement;
      if (!tr.querySelector('td:nth-child(1) picture')) {
        tr.classList.add('photoless');
        const firstTd = tr.querySelector('td:nth-child(1)');
        const p = document.createElement('p');
        p.innerHTML = firstTd.innerHTML;
        firstTd.innerHTML = '';
        firstTd.appendChild(p);
        tr.querySelectorAll('td').forEach((subTd) => {
          const picture = subTd.querySelector('picture');
          if (!picture) return;
          const link = subTd.querySelector('a');
          // put picture inside link
          link.prepend(picture);
        });
      }
    });
  });
}
