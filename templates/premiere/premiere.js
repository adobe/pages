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

// import { loadJSModule } from '../../scripts.js';
/* global loadJSModule */

function decorateYouTube() {
  const $vids = document.querySelectorAll('main div a[href^="https://www.youtube.com/"]');
  $vids.forEach(($a) => {
    const $div = $a.closest('div');
    const yturl = new URL($a.getAttribute('href'));
    const vid = yturl.searchParams.get('v');
    $a.parentNode.innerHTML = `<div class="video-thumb" style="background-image:url(https://img.youtube.com/vi/${vid}/0.jpg)"><svg xmlns="http://www.w3.org/2000/svg" width="731" height="731" viewBox="0 0 731 731">
        <g id="Group_23" data-name="Group 23" transform="translate(-551 -551)">
            <circle id="Ellipse_14" data-name="Ellipse 14" cx="365.5" cy="365.5" r="365.5" transform="translate(551 551)" fill="#1473e6"/>
            <path id="Polygon_3" data-name="Polygon 3" d="M87.5,0,175,152H0Z" transform="translate(992.5 829.5) rotate(90)" fill="#fff"/>
        </g>
        </svg>
        </div>`;
    $div.addEventListener('click', () => {
      $div.innerHTML = `<div style="left: 0; width: 100%; height: 0; position: relative; padding-bottom: 56.25%;"><iframe src="https://www.youtube.com/embed/${vid}?rel=0&autoplay=1" style="border: 0; top: 0; left: 0; width: 100%; height: 100%; position: absolute;" allowfullscreen scrolling="no" allow="autoplay; encrypted-media; accelerometer; gyroscope; picture-in-picture"></iframe></div>`;
    });
  });
}

function decorateVideoText() {
  const $blocks = document.querySelectorAll('div.video-text');
  $blocks.forEach(($block) => {
    $block.classList.add('cards');
    [...$block.children].forEach(($row) => {
      $row.classList.add('card');
      [...$row.children].forEach(($cell, i) => {
        const classNames = ['video', 'text'];
        $cell.classList.add(classNames[i]);
      });
    });
  });
}

decorateYouTube();
decorateVideoText();

loadJSModule('/scripts/default.js');
