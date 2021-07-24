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

/* global createTag, loadJSModule */

loadJSModule('/scripts/default.js');

function helpxInNewWindow() {
  document.querySelectorAll('main a[href]').forEach(($a) => {
    const url = $a.href;
    const $link = $a;
    if (url.includes('helpx')) {
      $link.setAttribute('target', '_blank');
    }
  });
}

function decorateVideoBlocks() {
  document.querySelectorAll('main .video a[href]').forEach(($a) => {
    const videoLink = $a.href;
    let $video = $a;
    if (videoLink.includes('tv.adobe.com')) {
      $video = createTag('iframe', { src: videoLink, class: 'embed tv-adobe' });
    }
    $a.parentElement.replaceChild($video, $a);
  });
}

window.addEventListener('load', () => document.body.classList.add('loaded'));

if (document.readyState === 'loading') {
  window.addEventListener('DOMContentLoaded', () => {
    helpxInNewWindow();
    decorateVideoBlocks();
  });
} else {
  helpxInNewWindow();
  decorateVideoBlocks();
}
