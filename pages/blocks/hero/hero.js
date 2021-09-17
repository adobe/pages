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

/** @type {import("../block").BlockDecorator} */
export default async function decorate($block) {
  const heroRoot = $block.querySelector(':scope div');
  const heroParent = $block.parentNode.parentNode;
  const heroContent = heroRoot.querySelector('div:nth-child(2)').innerHTML;
  const videoEmbed = heroRoot.querySelector('div:first-of-type a').getAttribute('href');
  let videoPlaying = false;
  const videoPlaceholder = heroRoot.querySelector('div:first-of-type img').getAttribute('src');
  let videoBackgroundElement = '';

  if (heroRoot.childNodes.length === 3) {
    videoBackgroundElement = heroRoot.querySelector('div:nth-child(3) img').getAttribute('src');
  }

  heroParent.innerHTML = `
      <div>
        <div class="hero__inner">
          <div class="hero__content">
            ${heroContent}
          </div>
  
          <div class="video" style="background-image: url(${videoBackgroundElement})";>
            <div class="video-placeholder" style="background-image: url(${videoPlaceholder});">
              <div class="video-playbtn">
                <img src="/icons/playbutton.svg">
              </div>
  
              <video class="hero-video" src="${videoEmbed}" preload="metadata>
                <source src="${videoEmbed}" type="video/mpeg4">
              </video>
            </div>
          </div>
        </div>
      </div>
    `;

  function startVideo() {
    const heroVideo = document.querySelector('.hero-video');
    if (!videoPlaying) {
      heroVideo.style.display = 'block';
      heroVideo.setAttribute('controls', true);
      setTimeout(() => {
        heroVideo.play();
      });
    } else {
      setTimeout(() => {
        heroVideo.pause();
      });
    }
    videoPlaying = !videoPlaying;
  }
  document.querySelector('.video-placeholder').addEventListener('click', startVideo);
}
