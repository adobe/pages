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

/* eslint-disable import/prefer-default-export */

// TODO: Remove this, change to Promise.all in insertSteps()
// first need to ask about the done condition.
// Also, figure out the difference between each of the twp scripts, possibly share some code.
/* eslint-disable no-await-in-loop */

import {
  addDefaultClass,
  createTag,
  loadLocalHeader,
  classify,
  appearMain,
} from '../templates/default/default.js';

export function playVideo() {
  document.getElementById('placeholder').classList.add('hidden');
  const $video = document.getElementById('video');
  $video.classList.remove('hidden');
  $video.play();
}

function decorateVideoSections() {
  // videos
  document.querySelectorAll('main a[href^="https://images-tv.adobe.com/"]').forEach(($vlink) => {
    const $videoDiv = $vlink.closest('div');
    const href = $vlink.getAttribute('href');
    const imgSrc = $videoDiv.querySelector('img').getAttribute('src');
    $videoDiv.classList.add('video-section');

    const $videoText = createTag('div', { class: 'video-text' });

    Array.from($videoDiv.children).forEach(($e) => {
      if (!$e.querySelector('img')) {
        $videoText.append($e);
      }
    });

    $videoDiv.innerHTML = `<div class="video"><div id="placeholder" class="button">
            <svg xmlns="http://www.w3.org/2000/svg"><use href="/icons/twp3/play.svg#icon"></use></svg>
            </div>
            <video id='video' class="hidden" preload="metadata" src="${href}" tabindex="0">
            <source src="${href}" type="video/mpeg4">
            </video></div>`;
    $videoDiv.append($videoText);

    $videoDiv.firstElementChild.firstElementChild.style.backgroundImage = `url(${imgSrc})`;
    $videoDiv.firstElementChild.addEventListener('click', () => playVideo());
  });
}

async function insertSteps() {
  const $steps = document.querySelector('main div.steps');
  if ($steps) {
    let i = 1;
    let done = false;
    let html = '';
    do {
      const url = `step-${i}.plain.html`;
      const resp = await fetch(url);
      if (resp.status === 200) {
        window.hlx.dependencies.push(url);
        const text = await resp.text();
        const $html = createTag('div');
        $html.innerHTML = text;
        const $h1 = $html.querySelector('h1');
        const title = $h1 ? $h1.innerHTML : '';
        let desc = '';
        if (title) {
          const $p = $h1.nextElementSibling;
          if ($p) desc = $p.innerHTML;
        }
        const $h4 = $html.querySelector('h4');
        const duration = $h4 ? $h4.innerHTML.split('|')[1] : '';
        const $ul = $html.querySelector('div:first-of-type ul');
        const greatfor = $ul ? $ul.innerHTML : '';
        const $img = $html.querySelector('img');
        const src = $img ? $img.getAttribute('src') : '';

        html += `<div class="card" onclick="window.location='step-${i}'">
                <div class="card-header">
                    <span class="card-duration">${duration} | Great for</span>
                    <div class="card-greatfor"><ul>${greatfor}</ul></div>
                </div>
                <div class="card-img" style="background-image: url(${src})">
                <svg xmlns="http://www.w3.org/2000/svg" width="731" height="731" viewBox="0 0 731 731">
                <g id="Group_23" data-name="Group 23" transform="translate(-551 -551)">
                    <circle id="Ellipse_14" data-name="Ellipse 14" cx="365.5" cy="365.5" r="365.5" transform="translate(551 551)" fill="#1473e6"/>
                    <path id="Polygon_3" data-name="Polygon 3" d="M87.5,0,175,152H0Z" transform="translate(992.5 829.5) rotate(90)" fill="#fff"/>
                </g>
                </svg>
                </div>
                <div class="card-text">
                    <div><h4>${title}</h4>
                    <p>${desc}</p>
                    </div>
                    <a href="step-${i}">Watch now</a>
                </div>
                </div>`;
      } else {
        done = true;
      }
      i += 1;
    } while (!done);

    $steps.innerHTML = html;
  }
}

async function decoratePage() {
  addDefaultClass('main>div');

  await loadLocalHeader();

  // heading
  classify('main>div:nth-of-type(1)', 'header');
  classify('main>.header ul', 'roles');

  classify('main h3', 'gray', 1);

  decorateVideoSections();

  document.querySelectorAll('main p').forEach(($e) => {
    const inner = $e.innerHTML.toLowerCase().trim();
    if (inner === '&lt;steps&gt;' || inner === '\\<steps></steps>') {
      $e.parentNode.classList.add('steps');
      $e.parentNode.classList.remove('default');
      $e.parentNode.innerHTML = '';
    }
  });

  await insertSteps();

  window.pages.decorated = true;
  appearMain();
}

if (document.readyState === 'loading') {
  window.addEventListener('DOMContentLoaded', decoratePage);
} else {
  decoratePage();
}
