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

/* eslint-disable import/no-cycle */

import {
  createTag,
  toClassName,
} from './default.js';

export function setExternalLinks() {
  if (!document.querySelectorAll('main a')) return;
  const links = document.querySelectorAll('main a');
  links.forEach(($a) => {
    const hasExternalLink = $a.innerText.includes('[!]');
    if (hasExternalLink) {
      $a.innerText = $a.innerText.split('[!]')[0];
      $a.setAttribute('target', '_blank');
    }
  });
}

export function equalizer($element) {
  if (document.querySelector($element)) {
    if (document.querySelectorAll($element)[0].className.includes('callout')) {
      const callOutParents = document.querySelectorAll('.callout-container');
      callOutParents.forEach(($callouts) => {
        let titleHeight = 0;
        let copyHeight = 0;
        const $cardItems = $callouts.querySelectorAll('.callout > div div:last-of-type');

        // reset applied on resizing
        $cardItems.forEach(($row) => {
          const title = $row.querySelector('h3');
          const copy = $row.querySelector('p:first-of-type');
          title.style.height = '';
          copy.style.height = '';
        });

        // collects tallest heights of elements per row
        $cardItems.forEach((item) => {
          const title = item.querySelector('h3');
          const copy = item.querySelector('p:first-of-type');

          if (title.offsetHeight > titleHeight) {
            titleHeight = title.offsetHeight;
          }

          if (copy.offsetHeight >= copyHeight) {
            copyHeight = copy.offsetHeight;
          }
        });

        // Applies styles to each row (tallest title and copy)
        $cardItems.forEach(($row) => {
          const title = $row.querySelector('h3');
          const copy = $row.querySelector('p:first-of-type');

          title.style.height = `${titleHeight}px`;
          copy.style.height = `${copyHeight}px`;
        });
      });
    }
  }
}

export function decorateNextStep() {
  const root = document.querySelector('.next');
  const link = root.querySelector('div:first-of-type a').getAttribute('href');
  const thumbnail = root.querySelector('div:first-of-type img').getAttribute('src');
  const content = root.querySelector('div:nth-child(2)').innerHTML;
  const background = root.querySelector('div:nth-child(3) img').getAttribute('src');

  root.innerHTML = '';

  root.innerHTML = /* html */`
    <a href="${link}" class="next-element-container">
      <div class="next-bg-element" style="background-image: url(${background});">
        <div class="next-img-element" style="background-image: url(${thumbnail});"></div>
      </div>
      <div class="next-content">
        ${content}
      </div>
    </a>
  `;
}

export function decorateEmbeds() {
  document.querySelectorAll('a[href]').forEach(($a) => {
    if ($a.textContent.startsWith('https://')) {
      const url = new URL($a.href);
      const usp = new URLSearchParams(url.search);
      let embedHTML = '';
      let type = '';

      if ($a.href.startsWith('https://www.youtube.com/watch') || $a.href.startsWith('https://youtu.be/')) {
        let vid = usp.get('v');
        if (url.host === 'youtu.be') vid = url.pathname.substr(1);

        type = 'youtube';
        embedHTML = /* html */`
          <div style="left: 0; width: 100%; height: 0; position: relative; padding-bottom: 56.25%;">
            <iframe src="https://www.youtube.com/embed/${vid}?rel=0&amp;v=${vid}" frameBorder="0" style="border: 0; top: 0; left: 0; width: 100%; height: 100%; position: absolute;" allowfullscreen="" scrolling="no" allow="encrypted-media; accelerometer; gyroscope; picture-in-picture" title="content from youtube" loading="lazy"></iframe>
          </div>
        `;
      }

      if (type) {
        const $embed = createTag('div', { class: `embed embed-oembed embed-${type}` });
        const $div = $a.closest('div');
        $embed.innerHTML = embedHTML;
        $div.parentElement.replaceChild($embed, $div);
      }
    }
  });
}

export function linkInNewTab($el) {
  const links = $el.querySelectorAll('a');
  links.forEach(($link) => {
    $link.setAttribute('target', '_blank');
  });
}

export function tableToDivs($table, cols) {
  const $rows = $table.querySelectorAll('tbody tr');
  const $cards = createTag('div', { class: `${cols.join('-')}` });
  $rows.forEach(($tr) => {
    const $card = createTag('div');
    $tr.querySelectorAll('td').forEach(($td, i) => {
      const $div = createTag('div', cols.length > 1 ? { class: cols[i] } : {});
      $div.innerHTML = $td.innerHTML;
      $card.append($div);
    });
    $cards.append($card);
  });
  return ($cards);
}

export function decorateTables() {
  document.querySelectorAll('main div>table').forEach(($table) => {
    const $cols = $table.querySelectorAll('thead tr th');
    const cols = Array.from($cols).map((e) => toClassName(e.innerHTML)).filter((e) => (!!e));
    // const $rows = $table.querySelectorAll('tbody tr');
    let $div = {};

    $div = tableToDivs($table, cols);
    $table.parentNode.replaceChild($div, $table);
  });
}

export function decorateButtons() {
  document.querySelectorAll('main a').forEach(($a) => {
    const $up = $a.parentElement;
    const $twoup = $a.parentElement.parentElement;
    const $threeup = $a.parentElement.parentElement?.parentElement;
    if ($up.childNodes.length === 1 && $up.tagName.toUpperCase() === 'P') {
      $a.className = 'button secondary';
    }
    if ($up.childNodes.length === 1 && $up.tagName.toUpperCase() === 'STRONG'
      && $twoup.childNodes.length === 1 && $twoup.tagName.toUpperCase() === 'P') {
      $a.className = 'button primary';
    }
    if ($up.childNodes.length === 1 && ['STRONG', 'EM'].includes($up.tagName.toUpperCase())
    && $twoup.childNodes.length === 1 && ['STRONG', 'EM'].includes($twoup.tagName.toUpperCase())
    && $threeup.childNodes.length === 1 && $threeup.tagName.toUpperCase() === 'P') {
      $a.className = 'button primary large';
    }
  });
}

export function wrapSections(element) {
  document.querySelectorAll(element).forEach(($div) => {
    const $wrapper = createTag('div', { class: 'section-wrapper' });
    $div.parentNode.appendChild($wrapper);
    $wrapper.appendChild($div);
  });
}

export function decorateVideoBlocks() {
  document.querySelectorAll('main .video a[href]').forEach(($a) => {
    const videoLink = $a.href;
    let $video = $a;
    if (videoLink.includes('tv.adobe.com')) {
      $video = createTag('iframe', { src: videoLink, class: 'embed tv-adobe' });
    }
    $a.parentElement.replaceChild($video, $a);
  });
}
