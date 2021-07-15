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
//   createTag,
//   addDefaultClass,
//   decorateTables,
//   loadLocalHeader,
//   appearMain,
//   debounce,
// } from '../scripts.js';
/* global createTag, addDefaultClass, decorateTables, loadLocalHeader, appearMain, debounce */

async function submitSheetForm($form, sheetid, thankyou) {
  const formsink = 'https://script.google.com/macros/s/AKfycbxWFwI-qExw0Tg_LJvdisSYODFw35m3L8M5HdumPOufmArmRIEh/exec';
  const searchParams = new URLSearchParams(`?sheet-id=${sheetid}`);
  if ($form.reportValidity()) {
    $form.querySelectorAll('.form-field').forEach(($f) => {
      if ($f.getAttribute('type') === 'radio') {
        if ($f.checked) searchParams.append($f.name, $f.value);
      } else {
        searchParams.append($f.name, $f.value);
      }
    });
    const resp = await fetch(`${formsink}?${searchParams.toString()}`);
    const json = await resp.json();
    if (json.status === 'ok') {
      window.location = thankyou;
    } else {
      alert('Form Submission failed.');
      console.log(`form submission error: ${json.description}`);
    }
  }
}

function createButtonCta(element) {
  if (!document.querySelectorAll(element).length > 0) return;
  const button = document.querySelectorAll(element);
  button.forEach(($link) => {
    if ($link.innerText.includes('[cta')) {
      const ctaStrings = $link.innerText.split('[')[1].split(']')[0];
      console.log(ctaStrings);
      $link.setAttribute('class', `button ${ctaStrings}`);
      // eslint-disable-next-line prefer-destructuring
      $link.innerText = $link.innerText.split('[')[0];
    }
  });
}

// html output for form fields
function getFieldHTML(name, type, options, attributes) {
  let html = `<label for="${name}">${name} ${attributes.mandatory ? '*' : ''}</label><br>`;
  const r = attributes.mandatory ? 'required' : '';
  const ph = attributes.placeholder ? ` placeholder="${attributes.placeholder}"` : '';

  if (type === 'text') {
    html += `<input class="form-field" type="text" id="${name}" name="${name}" ${r} ${ph}><br>`;
  }

  if (type === 'textarea') {
    html += `<textarea class="form-field" id="${name}" name="${name}" rows=${attributes.rows} ${r} ${ph}>`;
  }

  if (type === 'radio') {
    options.forEach((o) => {
      html += `<input class="form-field" type="radio" id="${name}" name="${name}" value="${o}" ${r}>
            <label for="${name}">${o}</label><br>`;
    });
  }
  return (html);
}

// decorate a google sheets submitted form section

function decorateForm() {
  const sheetqs = 'main a[href^="https://docs.google.com/spreadsheets/"]';
  document.querySelectorAll(sheetqs).forEach(($a) => {
    const sheetid = $a.getAttribute('href').split('/')[5];
    const $div = $a.parentNode.parentNode;
    let thankyou = '';
    $div.classList.add('form');
    const $form = createTag('form');

    $div.querySelectorAll('a').forEach(($diva) => {
      if ($diva.innerHTML.toLowerCase().trim() === 'thank you') {
        thankyou = $diva.getAttribute('href');
        $diva.parentNode.remove();
      }
    });
    $a.addEventListener('click', (e) => {
      e.preventDefault();
      submitSheetForm($form, sheetid, thankyou);
    });

    $div.querySelectorAll(':scope > p').forEach(($f) => {
      const $anchor = $f.querySelector('a');
      const $placeholder = $f.querySelector('em');

      if (!$anchor) {
        const formfield = $f.firstChild.textContent;
        const attributes = {};
        if (formfield.indexOf('*')) attributes.mandatory = true;
        let type = 'text';
        const options = [];
        const name = formfield.split('*')[0].trim();

        if ($f.nextElementSibling) {
          $f.nextElementSibling.querySelectorAll('li').forEach(($li) => {
            options.push($li.innerHTML);
          });
          if (options.length > 0) {
            $f.nextElementSibling.remove();
            type = 'radio';
          }
        }

        if (formfield.indexOf('[') > 0) {
          const descriptor = formfield.match(/\[(.*?)\]/)[1].toLowerCase().trim();
          if (descriptor.endsWith('lines')) {
            type = 'textarea';
            attributes.rows = descriptor.split(' ')[0];
          } else {
            type = descriptor;
          }
        }

        if ($placeholder) {
          attributes.placeholder = $placeholder.textContent;
        }

        $f.innerHTML = getFieldHTML(name, type, options, attributes);
      }
      $form.appendChild($f);
    });
    $div.appendChild($form);
  });
}

function wrapSections(element) {
  document.querySelectorAll(element).forEach(($div) => {
    const $wrapper = createTag('div', { class: 'section-wrapper' });
    $div.parentNode.appendChild($wrapper);
    $wrapper.appendChild($div);
  });
}

// set fixed height to cards to create a uniform UI
function cardHeightEqualizer($el) {
  let initialHeight = 0;
  const element = document.querySelectorAll($el);

  if (window.innerWidth >= 700 && element.length > 1) {
    element.forEach((cardEl) => {
      cardEl.style.height = 'auto';
    });

    element.forEach((cardText) => {
      if (initialHeight < cardText.offsetHeight) {
        initialHeight = cardText.offsetHeight;
      }
    });

    element.forEach((cardEl) => {
      cardEl.style.height = `${initialHeight}px`;
    });
  } else {
    element.forEach((cardEl) => {
      cardEl.style.height = 'auto';
    });
  }
}

function styleBackgrounds() {
  const backgrounds = document.querySelectorAll('.background');

  if (!backgrounds.length) return;

  backgrounds.forEach((background) => {
    if (!background.childNodes[0]) return;
    if (background.childNodes[0].nodeName === 'IMG') {
      const src = background.childNodes[0].getAttribute('src');
      background.style.backgroundImage = `url(${src})`;
      background.innerHTML = '';
    }
  });
}

window.addEventListener('resize', debounce(() => {
  // run resize events
  cardHeightEqualizer('.premiere .card .text');
}, 250));

function addNavCarrot() {
  if (document.querySelector('header img')) {
    const svg = document.querySelector('header img');
    const svgWithCarrot = document.createElement('div');
    svgWithCarrot.classList.add('nav-logo');

    svgWithCarrot.innerHTML = `
        <span class="product-icon">
            ${svg.outerHTML}
        </span>

        <span class="carrot">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="feather feather-chevron-down"><polyline points="6 9 12 15 18 9"></polyline></svg>
        </span>
        `;
    svg.remove();
    document.querySelector('header div')
      .prepend(svgWithCarrot);
    document.querySelector('header').classList.add('default-nav');

    if (document.querySelector('header .section-wrapper p')) {
      const productName = document.querySelector('header .section-wrapper').children[1].querySelector('p');
      document.querySelector('.product-icon').appendChild(productName);
    }
  }
}

function dropDownMenu() {
  const $header = document.querySelector('header');

  if (window.outerWidth >= 768) return;

  if (!$header.classList.contains('nav-showing')) {
    $header.querySelector('ul').style.display = 'flex';
    $header.classList.add('nav-showing');
  } else {
    $header.querySelector('ul').style.display = 'none';
    $header.classList.remove('nav-showing');
  }
}

function paramHelper() {
  if (!window.location.search) return;
  const queryType = new URLSearchParams(window.location.search);

  // Set Main Video
  // make sure video indicator is being requested
  const v = queryType.get('v');
  if (v) {
    const $cards = document.querySelectorAll('.cards .card');
    const $heroCard = $cards[v === 'last' ? $cards.length - 1 : +v - 1]; // ??
    $heroCard.className = 'main-video';
    $heroCard.parentNode.prepend($heroCard);
  }
}

function formatListCard($li) {
  const $p = $li.firstElementChild;
  let headhtml = '';
  let texthtml = '';
  Array.from($p.childNodes).forEach((node) => {
    if (node.nodeName === 'A') {
      const href = node.getAttribute('href');
      if (href.startsWith('https://www.youtube.com/')) {
        const yturl = new URL(href);
        const vid = yturl.searchParams.get('v');
        headhtml += `<div style="left: 0; width: 100%; height: 0; position: relative; padding-bottom: 56.25%;"><iframe src="https://www.youtube.com/embed/${vid}?rel=0" style="border: 0; top: 0; left: 0; width: 100%; height: 100%; position: absolute;" allowfullscreen scrolling="no" allow="encrypted-media; accelerometer; gyroscope; picture-in-picture"></iframe></div>`;
      } else {
        texthtml += `<a href=${node.getAttribute('href')}>${node.innerHTML}</a>`;
      }
    }
    if (node.nodeName === '#text') {
      texthtml += `<p>${node.textContent}</p>`;
    }
  });
  return (`<div class="card-image">${headhtml}</div><div class="card-text">${texthtml}</div>`);
}

function turnListSectionIntoCards() {
  document.querySelectorAll('main div>ul').forEach(($ul) => {
    if ($ul === $ul.parentNode.firstElementChild) {
      $ul.classList.add('cards');
      $ul.querySelectorAll('li').forEach(($li) => {
        $li.innerHTML = formatListCard($li);
      });
    }
  });
}

async function decoratePage() {
  addDefaultClass('main>div');
  turnListSectionIntoCards();
  decorateTables();
  wrapSections('main>div');
  decorateForm();
  await loadLocalHeader();
  wrapSections('header>div');
  wrapSections('footer>div');
  window.pages.decorated = true;
  paramHelper();
  appearMain();
  addNavCarrot();
  createButtonCta('main a');
  if (document.querySelector('.nav-logo')) {
    document.querySelector('.nav-logo').addEventListener('click', dropDownMenu);
  }
  styleBackgrounds();
  cardHeightEqualizer('.premiere .card .text');
}

if (document.readyState === 'loading') {
  window.addEventListener('DOMContentLoaded', decoratePage);
} else {
  decoratePage();
}
