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

function generateVideo() {
  if (!document.querySelector('.iframe')) return;
  const videos = document.querySelectorAll('.iframe > div a');
  videos.forEach((video) => {
    const videoParent = video.closest('div');
    videoParent.innerHTML = `
      <iframe src="${video.getAttribute('href')}" frameborder="0" id="video"></iframe>
      `;
  });

  const base = document.createElement('base');
  base.target = '_parent';
  document.getElementsByTagName('head')[0].appendChild(base);
  document.querySelector('.iframe > div > div').classList.add('iframe-parent');
}

function setUpTimeline() {
  if (!document.querySelector('.missiontimeline-container')) return;
  // let timelineCount = 0;
  let timelineGroup = '';
  const timelineParent = document.querySelector('.missiontimeline');
  const timelineItems = document.querySelectorAll('.missiontimeline > div');
  const timelineWrapper = document.createElement('div');
  timelineWrapper.classList.add('timeline-items');

  timelineItems.forEach((item, index) => {
    if (index < timelineItems.length - 1) {
      item.firstChild.parentElement.className = `checklist-item ${item.firstChild.innerText.toLowerCase()}`;
      item.firstChild.remove();
      timelineGroup += item.outerHTML;
      // timelineCount = index + 1;
      item.remove();
    }
  });

  timelineWrapper.innerHTML = timelineGroup;
  timelineParent.prepend(timelineWrapper);

  timelineWrapper.querySelectorAll('a').forEach((link) => {
    link.setAttribute('target', '_blank');
  });
}

function setUpControllers() {
  const items = document.querySelectorAll('.iframecontrol > div');
  let element;

  items.forEach(($row) => {
    const type = $row.querySelector('div:first-of-type').innerText;
    let link = '';

    if ($row.querySelector('a')) {
      link = $row.querySelector('a').getAttribute('href');
    }

    if (type === 'previous') {
      element = document.createElement('div');
      element.className = 'btn previous';
      element.innerHTML = `
        <a href="${link}">
          <span>
            <svg xmlns="http://www.w3.org/2000/svg" width="53" height="63" viewBox="0 0 53 63">
              <path id="Polygon_1" data-name="Polygon 1" d="M27.2,7.232a5,5,0,0,1,8.6,0L58.51,45.445A5,5,0,0,1,54.212,53H8.788a5,5,0,0,1-4.3-7.555Z" transform="translate(0 63) rotate(-90)" fill="#3a0001"/>
            </svg>
          </span>
        </a>
      `;
    } else {
      element = document.createElement('div');
      element.className = 'btn next';
      element.innerHTML = `
        <a href="${link}">
          <span>
            <svg xmlns="http://www.w3.org/2000/svg" width="53" height="63" viewBox="0 0 53 63">
            <path id="Polygon_1" data-name="Polygon 1" d="M27.2,7.232a5,5,0,0,1,8.6,0L58.51,45.445A5,5,0,0,1,54.212,53H8.788a5,5,0,0,1-4.3-7.555Z" transform="translate(53) rotate(90)" fill="#3a0001"/>
          </svg>
          
          
          </span>
        </a>
      `;
    }
    document.querySelector('.iframe-parent').appendChild(element);
  });
  document.querySelector('.iframecontrol-container').remove();
}

setUpTimeline();
generateVideo();
if (document.querySelector('.iframecontrol')) {
  setUpControllers();
}
