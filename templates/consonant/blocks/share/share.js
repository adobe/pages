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
  createTag,
} from '../../consonant.js';

// eslint-disable-next-line no-unused-vars
export default function decorate($block) {
  // Decorate social media icon list
  const $inlineSVGicons = Array.from($block.querySelectorAll('svg.icon'));
  $inlineSVGicons.forEach(($icon) => {
    const url = encodeURIComponent(window.location.href);
    let link = null;

    if ($icon.classList.contains('icon-facebook')) {
      link = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
    } else if ($icon.classList.contains('icon-linkedin')) {
      link = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
    } else if ($icon.classList.contains('icon-twitter')) {
      link = `https://twitter.com/share?&url=${url}`;
    } else if ($icon.classList.contains('icon-pinterest')) {
      link = `https://pinterest.com/pin/create/button/?url=${url}`;
    } else {
      $icon.remove();
    }

    let $c = $icon.parentElement;
    if ((isNodeName($c, 'a'))) {
      $c = $c.parentElement;
    }
    if (!isNodeName($c, 'p')) {
      const p = document.createElement('p');
      $c.appendChild(p);
      p.appendChild($icon);
      $c = p;
    }
    if ($c.children.length > 1) {
      $c.classList.add('icon-container');
      $icon.setAttribute('fill', 'currentColor');
    }

    if (link) {
      const $link = createTag('a', { target: '_blank', href: link });
      $link.addEventListener('click', () => {
        window.open($link.href, 'newwindow', 'width=600, height=400');
      });
      $icon.parentNode.replaceChild($link, $icon);
      $link.append($icon);
    }
  });

  const $pics = Array.from($block.querySelectorAll('picture'));
  $pics.forEach((pic) => {
    let $c = pic.parentElement;
    if ((isNodeName($c, 'a'))) {
      $c = $c.parentElement;
    }
    if (!isNodeName($c, 'p')) {
      const p = document.createElement('p');
      $c.appendChild(p);
      p.appendChild(pic);
      $c = p;
    }
    const contributorsPic = $c.parentElement;
    contributorsPic.classList.add('contributors-pic');
    if (!contributorsPic.parentElement.classList.contains('share')) {
      contributorsPic.parentElement.classList.add('contributors');
    }
  });
}
