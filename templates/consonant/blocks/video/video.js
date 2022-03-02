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
  let autoplay = '';
  let loop = '';

  if ($block.classList.contains('full') && $block.classList.contains('width')) {
    $block.classList.remove('full', 'width');
    $block.classList.add('full-width');
  }

  const $a = $block.querySelector('a');

  if ($a.textContent.startsWith('https://')) {
    const url = new URL($a.href);
    const usp = new URLSearchParams(url.search);
    let embedHTML = '';
    let type = '';

    if ($a.href.startsWith('https://www.youtube.com/watch') || $a.href.startsWith('https://youtu.be/')) {
      let vid = usp.get('v');
      if (url.host === 'youtu.be') vid = url.pathname.substr(1);

      if ($block.classList.contains('autoplay')) {
        autoplay = '&amp;autoplay=1&amp;mute=1';
        loop = `&amp;loop=1&amp;playlist=${vid}`;
      }

      type = 'youtube';
      embedHTML = /* html */`
        <div style="left: 0; width: 100%; height: 0; position: relative; padding-bottom: 56.25%;">
          <iframe src="https://www.youtube.com/embed/${vid}?rel=0&amp;modestbranding=1&amp;playsinline=1&amp;autohide=1&amp;showinfo=0&amp;controls=1&amp;rel=0${autoplay}${loop}" frameBorder="0" style="border: 0; top: 0; left: 0; width: 100%; height: 100%; position: absolute;" allowfullscreen="" scrolling="no" allow="encrypted-media; accelerometer; gyroscope; picture-in-picture; autoplay" title="content from youtube" loading="lazy"></iframe>
        </div>
        `;
    } else if ($a.href.includes('tv.adobe.com')) {
      const $video = createTag('iframe', { src: $a.href, class: 'embed tv-adobe' });

      $a.parentElement.replaceChild($video, $a);
    }

    if (type) {
      const $embed = createTag('div', { class: `embed embed-oembed embed-${type}` });
      const $div = $a.closest('div');
      $embed.innerHTML = embedHTML;
      $div.parentElement.replaceChild($embed, $div);
    }
  }
}

export default function lazyDecorate(block) {
  const intersectHandler = (entries) => {
    const entry = entries[0];
    if (entry.isIntersecting) {
      if (entry.intersectionRatio >= 0.25) {
        const $block = entry.target;
        decorateVideoBlock($block);
      }
    }
  };

  const runObserver = () => {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: [0.0, 0.25],
    };

    const observer = new IntersectionObserver(intersectHandler, options);
    observer.observe(block);
  };

  if (document.readyState === 'complete') {
    runObserver();
  } else {
    window.addEventListener('load', () => {
      runObserver();
    });
  }
}
