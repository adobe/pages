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

const createVideoMarkUp = (videoUrl) => (
  `
  <video preload="metadata" src="${videoUrl}" controls="true">
    <source src="${videoUrl}" type="video/mpeg4>
  </video> 
  `
);

const contentAsset = () => {
  const parent = document.querySelector('.videocontent div');
  const videoParent = parent.querySelector('div:last-of-type');

  videoParent.querySelectorAll('p').forEach(($el) => {
    if ($el.childNodes[0].nodeName === 'A') {
      const linkText = $el.childNodes[0].innerText.toLowerCase();
      if (linkText === 'video') {
        $el.innerHTML = createVideoMarkUp($el.childNodes[0].getAttribute('href'));
      }
    }
  });
};

export default contentAsset;
