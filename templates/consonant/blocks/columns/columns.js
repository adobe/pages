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
  transformLinkToAnimation,
  transformLinkToYoutubeEmbed,
} from '../../consonant.js';

function lazyDecorteVideoForColumn($column, $a) {
  if (!$a || (!$a.href.endsWith('.mp4') && !$a.href.startsWith('https://www.youtube.com/watch') && !$a.href.startsWith('https://youtu.be/'))) return;
  const decorateVideo = () => {
    if ($column.classList.contains('column-picture')) return;
    let youtube = null;
    let mp4 = null;
    if ($a.href.endsWith('.mp4')) {
      mp4 = transformLinkToAnimation($a);
    } else if ($a.href.startsWith('https://www.youtube.com/watch') || $a.href.startsWith('https://youtu.be/')) {
      youtube = transformLinkToYoutubeEmbed($a);
    }
    $column.innerHTML = '';
    if (youtube) {
      $column.classList.add('column-picture');
      $column.appendChild(youtube);
    } else if (mp4) {
      $column.classList.add('column-picture');
      const $row = $column.closest('.columns-row');
      const $cta = $row.querySelector('.button.accent') ?? $row.querySelector('.button');
      if ($cta) {
        const a = createTag('a', {
          href: $cta.href, title: $cta.title, target: $cta.target, rel: $cta.rel,
        });
        $column.appendChild(a);
        a.appendChild(mp4);
      } else {
        $column.appendChild(mp4);
      }
    }
  };
  const addIntersectionObserver = (block) => {
    const observer = (entries) => {
      const entry = entries[0];
      if (entry.isIntersecting) {
        if (entry.intersectionRatio >= 0.25) {
          decorateVideo();
        }
      }
    };
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: [0.0, 0.25],
    };
    const intersectionObserver = new IntersectionObserver(observer, options);
    intersectionObserver.observe(block);
  };
  if (document.readyState === 'complete') {
    addIntersectionObserver($column);
  } else {
    window.addEventListener('load', () => {
      addIntersectionObserver($column);
    });
  }
}

export default function decorate($block) {
  const $rows = Array.from($block.children);
  let numberOfColumns = 0;
  if ($rows[0]) {
    numberOfColumns = $rows[0].children.length;
  }
  if (numberOfColumns > 0) {
    $block.classList.add(`col-${numberOfColumns}-columns`);
  }
  $rows.forEach(($row) => {
    $row.classList.add('columns-row');
    const $columns = Array.from($row.children);
    $columns.forEach(($column) => {
      $column.classList.add('column');
      const $a = $column.querySelector('a');
      if ($a && $a.closest('.column').childNodes.length === 1 && ($a.href.endsWith('.mp4') || $a.href.startsWith('https://www.youtube.com/watch') || $a.href.startsWith('https://youtu.be/'))) {
        lazyDecorteVideoForColumn($column, $a);
      } else {
        const $pic = $column.querySelector('picture:first-child:last-child');
        if ($pic) {
          $column.classList.add('column-picture');
          const $cta = $row.querySelector('.button.accent') ?? $row.querySelector('.button');
          const $picParent = $pic.parentElement;
          $column.innerHTML = '';
          if ($picParent.tagName.toLowerCase() === 'a') {
            $column.appendChild($picParent);
            $picParent.appendChild($pic);
          } else if ($cta) {
            const a = createTag('a', {
              href: $cta.href, title: $cta.title, target: $cta.target, rel: $cta.rel,
            });
            $column.appendChild(a);
            a.appendChild($pic);
          } else {
            $column.appendChild($pic);
          }
        }
      }
    });
  });
}
