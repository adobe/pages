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

const createVideoMarkUp = (videoAssets) => (
  `
    <div class="video">
      <div class="video_thumbnail" style="background-image: url(${videoAssets.thumbnail})"></div>
      <video preload="metadata" src="${videoAssets.video_url}" controls="true">
        <source src="${videoAssets.video_url}" type="video/mpeg4>
      </video>
    </div>
  `
);

/** @type {import("../block").BlockDecorator} */
export default async function decorate($block, _, doc) {
  const parent = $block.querySelector(':scope div');
  const videoParent = parent.querySelector('div:last-of-type');
  const videoAssets = {
    thumbnail: videoParent.querySelector('img').getAttribute('src'),
    video_url: videoParent.querySelector('a').getAttribute('href'),
  };
  videoParent.querySelector('p:first-of-type').innerHTML = createVideoMarkUp(videoAssets);

  doc.querySelector('.video_thumbnail').addEventListener('click', () => {
    doc.body.classList.add('video-showing');
    doc.querySelector('.video video').play();
  });
}
