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
  createTag,
} from '../../consonant.js';

function decorateVideoBlock($block) {
  let settings = '';
  let controls = '1';

  if ($block.classList.contains('full') && $block.classList.contains('width')) {
    $block.classList.remove('full', 'width');
    $block.classList.add('full-width');
  }

  if (($block.classList.contains('no') && $block.classList.contains('controls')) || $block.classList.contains('nocontrols')) {
    $block.classList.remove('no', 'controls', 'nocontrols');
    $block.classList.add('no-controls');
    controls = '0';
  }

  const $a = $block.querySelector('a');

  if ($a && $a.href.startsWith('https://')) {
    const url = new URL($a.href);
    const usp = new URLSearchParams(url.search);
    let embedHTML = '';
    let type = '';

    if ($a.href.startsWith('https://www.youtube.com/watch') || $a.href.startsWith('https://youtu.be/')) {
      let vid = usp.get('v');
      if (url.host === 'youtu.be') vid = url.pathname.substr(1);

      if ($block.classList.contains('autoplay') || controls === '0') {
        settings = `&amp;autoplay=1&amp;mute=1&amp;loop=1&amp;playlist=${vid}`;
      }

      type = 'youtube';
      embedHTML = /* html */`
        <div class="vid-wrapper">
          <iframe src="https://www.youtube.com/embed/${vid}?rel=0&amp;modestbranding=1&amp;playsinline=1&amp;autohide=1&amp;showinfo=0&amp;rel=0&amp;controls=${controls}${settings}" frameBorder="0" allowfullscreen="" scrolling="no" allow="encrypted-media; accelerometer; gyroscope; picture-in-picture; autoplay" title="content from youtube" loading="lazy"></iframe>
        </div>
        `;
    } else if ($a.href.endsWith('.mp4')) {
      let attrs = 'playsinline controls';
      if ($block.classList.contains('autoplay')) attrs = 'playsinline controls muted autoplay loop';
      if (controls === '0') attrs = 'playsinline controls="0" muted autoplay loop';

      type = 'mp4';
      embedHTML = /* html */`
        <div class="vid-wrapper">
          <video ${attrs} name="media"><source src="${$a.href}" type="video/mp4"></video>
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
}

function lazyIntersectHandler(entries) {
  const entry = entries[0];
  if (entry.isIntersecting) {
    if (entry.intersectionRatio >= 0.25) {
      const $block = entry.target;
      decorateVideoBlock($block);
    }
  }
}

function runLazyObserver($block) {
  const options = {
    root: null,
    rootMargin: '0px',
    threshold: [0.0, 0.25],
  };

  const observer = new IntersectionObserver(lazyIntersectHandler, options);
  observer.observe($block);
}

export default function lazyDecorate($block) {
  if (document.readyState === 'complete') {
    runLazyObserver($block);
  } else {
    window.addEventListener('load', () => {
      runLazyObserver($block);
    });
  }
}
