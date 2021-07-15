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

// import {
//   addDefaultClass,
//   appearMain,
//   externalLinks,
//   loadCSS,
//   loadLocalHeader,
// } from '../../scripts.js';
/* global addDefaultClass, appearMain, externalLinks, loadCSS, loadLocalHeader */

async function fetchSheet() {
  window.hlx.dependencies.push('content.json');
  const resp = await fetch('content.json');
  const json = await resp.json();
  return (Array.isArray(json) ? json : json.data);
}

// const properties = [];

function cardMarkUp(data) {
  let markup = '';
  console.log(data);
  data.forEach((row) => {
    markup += `
        <div>
            <div>
                <a href="https://adobe.com">
                    <img src="https://images-tv.adobe.com/mpcv3/d6deec15-277b-4e1c-b56a-a0fb9e4f3c11/c5e171b7-83db-4aab-b08e-8839aea8019e/34a0baadbb264f6e9d3d9591804c20cd_1595549517-960x540.jpg">
                </a>
            </div>
            <div>
                <h3>${row.Cards_Title}</h3>
                <p>${row.Cards_Copy}</p>
                <p><a href="https://adobe.com" class="button secondary">${row.Cards_Cta}</a></p>
            </div>
        </div>
        `;
  });
  return markup;
}

function columnMarkUp(data) {
  let markup = '';

  data.forEach((row) => {
    if (!row.Column_Title) return;
    let cta = '';
    console.log(row.Column_Has_Cta);
    if (row.Column_Has_Cta) {
      cta = `<p><strong><a href="${row.Column_Cta_link}" class="button primary">${row.Column_Cta_Text}</a></strong></p>`;
    } else {
      cta = '';
    }
    markup += `
            <div>
                <div><img src="${row.Column_Image}"></div>
                <div>
                    <h5>${row.Column_Title}</h5>
                    <p>${row.Column_Copy}</p>
                    ${cta}
                </div>
            </div>
        
        `;
  });
  return markup;
}

async function decorateHome() {
  const data = await fetchSheet();
  const children = document.querySelectorAll('main .default');
  children.forEach(($child) => {
    let containerType = '';
    if ($child.innerText.includes('[#')) {
      containerType = $child.innerText.split('[#')[1].split(']')[0];
      console.log(containerType);
      if (containerType === 'cards') {
        $child.classList.add('card-container');
        loadCSS('/styles/blocks/card.css');
        $child.innerHTML = `
                    <div>
                        <div class="card">${cardMarkUp(data)}</div>
                    </div>
                `;
      }

      if (containerType === 'column') {
        $child.classList.add('card-container');
        $child.classList.add('two');
        $child.innerHTML = `
                    <div class="columns-two columns two">
                        ${columnMarkUp(data)}
                    </div>
                `;
        loadCSS('/styles/blocks/columns.css');
      }
    }
  });
}

async function decoratePage() {
  addDefaultClass('main>div');

  await loadLocalHeader();
  externalLinks('header');
  externalLinks('footer');

  if (document.querySelector('.nav-logo')) {
    // 07/14/21 Max commented, undefined function
    // TODO: is it a global from somewhere?
    // document.querySelector('.nav-logo').addEventListener('click', dropDownMenu);
  }

  let pageType;
  // find steps marker
  if (document.location.pathname.endsWith('/step')) {
    pageType = 'step';
  } else {
    pageType = 'home';
  }

  window.pages.pageType = pageType;

  if (pageType === 'home') {
    // await decorateHome();
  }

  if (pageType === 'step') {
    // await decorateStep();
  }

  window.pages.decorated = true;
  appearMain();
  decorateHome();
}

if (document.readyState === 'loading') {
  window.addEventListener('DOMContentLoaded', decoratePage);
} else {
  decoratePage();
}
