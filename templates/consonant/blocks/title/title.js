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
} from '../../consonant.js';

export default function decorate($block) {
  // Decorate social media icon list
  const $inlineSVGicons = Array.from($block.querySelectorAll('svg.icon'));
  $inlineSVGicons.forEach((icon) => {
    let $c = icon.parentElement;
    if ((isNodeName($c, 'a'))) {
      $c = $c.parentElement;
    }
    if (!isNodeName($c, 'p')) {
      const p = document.createElement('p');
      $c.appendChild(p);
      p.appendChild(icon);
      $c = p;
    }
    if ($c.children.length > 1) {
      $c.classList.add('icon-container');
      icon.setAttribute('fill', 'currentColor');
    }
  });
}
