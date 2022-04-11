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
  isNodeName,
  transformLinkToAnimation,
  transformLinkToYoutubeEmbed,
} from '../../consonant.js';

function lazyDecorteVideoForColumn($column, $a) {
  if (!$a || (!$a.href.endsWith('.mp4') && !$a.href.startsWith('https://www.youtube.com/watch') && !$a.href.startsWith('https://youtu.be/'))) return;
  const decorateVideo = () => {
    if ($column.classList.contains('column-picture')) return;
    let video = null;
    if ($a.href.endsWith('.mp4')) {
      video = transformLinkToAnimation($a);
    } else if ($a.href.startsWith('https://www.youtube.com/watch') || $a.href.startsWith('https://youtu.be/')) {
      video = transformLinkToYoutubeEmbed($a);
    }
    $column.innerHTML = '';
    if (video) {
      $column.appendChild(video);
      $column.classList.add('column-picture');
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
      if (isNodeName($column.firstElementChild, 'picture') || isNodeName($column.firstElementChild.firstElementChild, 'picture')) {
        $column.classList.add('column-picture');
      }
      const $a = $column.querySelector('a');
      if ($a && $a.href.startsWith('https://') && $a.closest('.column').childNodes.length === 1) {
        lazyDecorteVideoForColumn($column, $a);
      }
    });
  });
}
