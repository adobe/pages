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

import {
  addDefaultClass,
  appearMain,
  classify,
  createTag,
  externalLinks,
  loadLocalHeader,
  replaceEmbeds,
  decorateIcons,
} from '../default/default.js';
import { hashPathOf, setBackgroundImage } from '../../pages/scripts/static-media.js';

function toClassName(name) {
  return (name.toLowerCase().replace(/[^0-9a-z]/gi, '-'));
}

function turnTableSectionIntoCards($table, cols) {
  const $rows = $table.querySelectorAll('tbody tr');
  const $cards = createTag('div', { class: `cards ${cols.join('-')}` });
  $rows.forEach(($tr) => {
    const $card = createTag('div', { class: 'card' });
    $tr.querySelectorAll('td').forEach(($td, i) => {
      const $div = createTag('div', { class: cols[i] });
      const $a = $td.querySelector('a[href]');
      if ($a && $a.getAttribute('href').startsWith('https://www.youtube.com/')) {
        const yturl = new URL($a.getAttribute('href'));
        const vid = yturl.searchParams.get('v');
        $div.innerHTML = `<div class="video-thumb" style="background-image:url(https://img.youtube.com/vi/${vid}/0.jpg)"><svg xmlns="http://www.w3.org/2000/svg" width="731" height="731" viewBox="0 0 731 731">
                <g id="Group_23" data-name="Group 23" transform="translate(-551 -551)">
                    <circle id="Ellipse_14" data-name="Ellipse 14" cx="365.5" cy="365.5" r="365.5" transform="translate(551 551)" fill="#1473e6"/>
                    <path id="Polygon_3" data-name="Polygon 3" d="M87.5,0,175,152H0Z" transform="translate(992.5 829.5) rotate(90)" fill="#fff"/>
                </g>
                </svg>
                </div>`;
        $div.addEventListener('click', () => {
          $div.innerHTML = `<div style="left: 0; width: 100%; height: 0; position: relative; padding-bottom: 56.25%;"><iframe src="https://www.youtube.com/embed/${vid}?rel=0&autoplay=1" style="border: 0; top: 0; left: 0; width: 100%; height: 100%; position: absolute;" allowfullscreen scrolling="no" allow="autoplay; encrypted-media; accelerometer; gyroscope; picture-in-picture"></iframe></div>`;
        });
      } else {
        $div.innerHTML = $td.innerHTML;
      }
      $card.append($div);
      const $click = `window.location='${$a.getAttribute('href')}'`;
      $card.setAttribute('onClick', $click);
    });
    $cards.append($card);
  });
  return ($cards);
}

function decorateTables() {
  document.querySelectorAll('main div>table').forEach(($table) => {
    const $cols = $table.querySelectorAll('thead tr th');
    const cols = Array.from($cols).map((e) => toClassName(e.innerHTML));
    const $rows = $table.querySelectorAll('tbody tr');
    let $div = {};

    if (cols.length === 1 && $rows.length === 1) {
      $div = createTag('div', { class: `${cols[0]}` });
      $div.innerHTML = $rows[0].querySelector('td').innerHTML;
    } else {
      $div = turnTableSectionIntoCards($table, cols);
    }
    $table.parentNode.replaceChild($div, $table);
  });
}

async function fetchSteps() {
  const resp = await fetch('steps.json');
  const json = await resp.json();
  window.hlx.dependencies.push('steps.json');
  return (Array.isArray(json) ? json : json.data);
}

function getThumbnail(step) {
  let thumbnail = `${step.Image}?format=pjpeg`;
  if (!thumbnail) {
    thumbnail = 'https://images-tv.adobe.com/avp/vr/536052e8-270f-49cd-a193-9eff1b9c9cb3/f770c63f-af98-43a1-be0b-005dedfca145/a92ecbe3_960x540.jpg';
  }
  return (thumbnail);
}

function addNavCarrot() {
  if (document.querySelector('header svg') || document.querySelector('header img')) {
    const svg = document.querySelector('header svg') || document.querySelector('header img');
    const svgWithCarrot = document.createElement('div');
    svgWithCarrot.classList.add('nav-logo');

    if (document.querySelector('header ul')) {
      svgWithCarrot.innerHTML = `
        <span class="product-icon">
          ${svg.outerHTML}
        </span>

        <span class="carrot">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" class="feather feather-chevron-down"><polyline points="6 9 12 15 18 9"></polyline></svg>
        </span>
        `;
    } else {
      svgWithCarrot.innerHTML = `
        <span class="product-icon">
          ${svg.outerHTML}
        </span>
        `;
    }
    svg.remove();
    document.querySelector('header div')
      .prepend(svgWithCarrot);
    document.querySelector('header').classList.add('default-nav');

    if (document.querySelector('header .section-wrapper p')) {
      const productName = document.querySelector('header .section-wrapper p');
      document.querySelector('.product-icon').appendChild(productName);
    }
  }
}

async function insertSteps() {
  const $steps = document.querySelector('main div.steps');
  if ($steps) {
    $steps.classList.add('cards');
    const steps = await fetchSteps();
    let html = '';
    steps.forEach((step, i) => {
      let stepPrefix;
      const number = parseInt(i, 10) + 1;
      if (number === steps.length) {
        stepPrefix = `${number}. Wrapping up: `;
      } else if (number === 1) {
        stepPrefix = `${number}. Intro: `;
      } else {
        stepPrefix = `${number}. `;
      }
      html += `
      <div class="card index-steps" onclick="window.location='step?${i + 1}'">
        <div class='img' style="background-image: url(${getThumbnail(step)}); background-size: cover;">
      </div>
        <div class='text'>
          <div>
            <h3>${stepPrefix}${step.Title}</h3>
          </div>
        </div>
      </div>
      `;
    });
    $steps.innerHTML = html;
  }
}

function dropDownMenu() {
  const $header = document.querySelector('header');

  if (window.outerWidth >= 768) return;

  if ($header.querySelector('ul')) {
    if (!$header.classList.contains('nav-showing')) {
      $header.querySelector('ul').style.display = 'flex';
      $header.classList.add('nav-showing');
    } else {
      $header.querySelector('ul').style.display = 'none';
      $header.classList.remove('nav-showing');
    }
  }
}

async function decorateStep() {
  document.body.classList.add('step');
  classify('main>div:first-of-type', 'context');
  classify('main>div:nth-of-type(2)', 'text');
  classify('main>div:nth-of-type(3)', 'tut-nav');

  const $context = document.querySelector('.context');
  const $text = document.querySelector('.text');
  const $tutnav = document.querySelector('.tut-nav');
  const $main = document.querySelector('main');
  const $container = document.createElement('div');
  $container.setAttribute('class', 'container');

  $main.appendChild($container);

  const $image = document.createElement('div');
  $container.appendChild($image);
  $image.setAttribute('class', 'image');
  const $placeholder = document.createElement('img');
  $image.appendChild($placeholder);
  // TODO: make the placeholder an svg
  // OR, even better, make it css and loaded with the template
  hashPathOf('/static/lightroom-classic/gif-placeholder.png').then((href) => {
    $placeholder.setAttribute('src', href);
  });

  // $main.setAttribute('class', 'appear');
  const $content = document.createElement('div');
  $container.appendChild($content);
  $content.setAttribute('class', 'content');
  $content.appendChild($context);
  $content.appendChild($text);

  // const $upnext=document.querySelector('a[');

  // const $video=createTag('div', {class: 'video-wrapper'});
  // $content.appendChild($video);

  const stepIndex = (+window.location.search.substring(1).split('&')[0]) - 1;

  // redirect to step 1, if no step index specified.
  if(stepIndex < 0) {
    window.location = window.location.origin + window.location.pathname + '?1';
  }

  const steps = await fetchSteps();
  const currentStep = steps[stepIndex];

  // fill content section

  const $h1 = document.querySelector('main .text h1');

  const $desc = document.querySelector('main .text p');
  $desc.remove();

  const $descHolder = document.createElement('div');
  const $textContent = document.querySelector('main .text div');
  $textContent.appendChild($descHolder);

  $text.appendChild($tutnav);

  let title = currentStep.Title;
  let end;
  let metadata;
  let trimmedDesc;

  const description = currentStep.Description.toString();
  if (description.indexOf('•') > 0) {
    if (description.indexOf('minutes') > 0) {
      end = parseInt(description.indexOf('minutes'), 10) + 7;
      metadata = `<h3>${description.slice(0, end)}</h3>`;
      trimmedDesc = description.slice(end);
    } else if (description.indexOf('minute') > 0) {
      end = parseInt(description.indexOf('minute'), 10) + 6;
      metadata = `<h3>${description.slice(0, end)}</h3>`;
      trimmedDesc = description.slice(end);
    } else {
      metadata = '';
      trimmedDesc = description;
    }
  } else {
    metadata = '';
    trimmedDesc = description;
  }

  if (currentStep['Sub Title']) {
    metadata = `<h3>${currentStep['Sub Title']}</h3>`;
  }

  // const image = currentStep.thumbnail;
  if (currentStep.Heading) title = currentStep.Heading;
  // title=title.split(`\n`).join('<br>');
  $h1.innerHTML = title;
  $h1.id = '';

  trimmedDesc = trimmedDesc.trim();
  const descContent = metadata + trimmedDesc.split(/[.?!;]/).filter((sentence) => sentence).map((sentence) => `<p>${sentence}.</p>`).join('');
  $descHolder.innerHTML = descContent;

  const $img = document.createElement('img');
  $image.appendChild($img);
  $img.setAttribute('src', currentStep.Image);

  document.title = currentStep.Title;
}

function wrapSections(element) {
  document.querySelectorAll(element).forEach(($div) => {
    const $wrapper = createTag('div', { class: 'section-wrapper' });
    $div.parentNode.appendChild($wrapper);
    $wrapper.appendChild($div);
  });
}

async function decorateHome() {
  document.body.classList.add('home');
  document.querySelectorAll('main p').forEach(($e) => {
    const inner = $e.innerHTML.toLowerCase().trim();
    if (inner === '&lt;steps&gt;' || inner === '\\<steps></steps>') {
      $e.parentNode.classList.add('steps');
      $e.parentNode.innerHTML = '';
    }
  });
  await insertSteps();
}

export default async function decoratePage() {
  replaceEmbeds();
  addDefaultClass('main>div');
  setBackgroundImage('body.step', '/static/lightroom-classic/progress-circle.gif');

  await loadLocalHeader();

  externalLinks('header');
  externalLinks('footer');
  wrapSections('header>div, main>div');
  await decorateIcons();
  // nav style/dropdown
  addNavCarrot();
  decorateTables();
  
  //    wrapSections('main>div');

  if (document.querySelector('.nav-logo')) {
    document.querySelector('.nav-logo').addEventListener('click', dropDownMenu);
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
    await decorateHome();
  }

  if (pageType === 'step') {
    await decorateStep();
  }

  window.pages.decorated = true;
  document.body.classList.add('loaded');
  appearMain();
}
