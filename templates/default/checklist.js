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

// import { debounce } from '../../scripts.js';
/* global debounce */

const videoParent = document.querySelector('.clvideo > div');
let hasPlayed = false;

function setTranscript(index) {
  const transcripts = document.querySelectorAll('.transcript > div');
  transcripts.forEach((el) => {
    el.style.display = 'none';
  });
  const newIndex = (index === 1 || index === 2) ? 0 : index - 2;
  transcripts[newIndex].style.display = 'block';
}

function timeTracker() {
  const svg = `
  <svg id="Single_icon" data-name="Single icon" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 30 30">
    <g id="Placement_Area" data-name="Placement Area" fill="red" stroke="rgba(0,0,0,0)" stroke-width="1" opacity="0">
      <rect width="30" height="30" stroke="none"/>
      <rect x="0.5" y="0.5" width="29" height="29" fill="none"/>
    </g>
    <circle id="White_background" data-name="White background" cx="15" cy="15" r="15" fill="#fff"/>
    <g id="Icon">
      <g id="Canvas" fill="#747474" stroke="#747474" stroke-width="1" opacity="0">
        <rect width="30" height="30" stroke="none"/>
        <rect x="0.5" y="0.5" width="29" height="29" fill="none"/>
      </g>
      <path id="Path_104098" data-name="Path 104098" d="M15,1A14,14,0,1,0,29,15,14,14,0,0,0,15,1Zm9.333,7.945L13.266,23.173a1.055,1.055,0,0,1-.766.4h-.064a1.05,1.05,0,0,1-.743-.307L4.882,16.451a1.05,1.05,0,0,1,0-1.485l0,0L6.042,13.8a1.05,1.05,0,0,1,1.485,0l0,0,4.671,4.68,9.2-11.82a1.05,1.05,0,0,1,1.473-.185l0,0,1.273.995a1.05,1.05,0,0,1,.185,1.47Z" fill="#33ab84"/>
    </g>
  </svg>
  `;

  let checker;
  if (hasPlayed) {
    const runChecker = () => {
      const timelineItems = document.querySelectorAll('.checklist-steps:nth-of-type(2) .checklist-info .step-info div:last-of-type');
      timelineItems.forEach((item) => {
        if (item.getAttribute('data-time') <= document.querySelector('.cl-video-el').currentTime) {
          item.closest('.checklist-info').classList.add('complete');
          item.closest('.checklist-info').querySelector('.step-count').innerHTML = svg;
          setTranscript(item.closest('.checklist-info').getAttribute('data-index'));
        }
      });
    };
    document.querySelector('.cl-video-el').addEventListener('play', () => {
      checker = setInterval(runChecker, 1000);
    });
  }
  document.querySelector('.cl-video-el').addEventListener('pause', () => {
    clearInterval(checker);
  });
}

function layoutSetUp() {
  const videoEl = videoParent.querySelector('div:first-of-type');
  const backgroundImage = videoEl.querySelectorAll('img')[0];
  const productBg = videoEl.querySelectorAll('img')[1];
  const videlSrc = videoEl.querySelector('a').getAttribute('href');
  const transcript = document.querySelector('.transcript');
  backgroundImage.remove();
  productBg.remove();
  const video = `
    <div class="video-parent" style="background-image: url(${productBg.getAttribute('src')});">
      <div class="video-iframe" style="background-image: url(${backgroundImage.getAttribute('src')})" ;>
      <div id="ply-btn" class="button">
        <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 55 55">
          <defs>
            <style>
              .cls-1 {
                fill: #fff;
              }
    
              .cls-2 {
                fill: #1473e6;
              }
            </style>
          </defs>
          <g id="gallery_design_playbutton_mobile" transform="translate(-441 -643)">
            <rect id="Rectangle_147685" data-name="Rectangle 147685" class="cls-1" width="27" height="36" transform="translate(457.545 652)"></rect>
            <path id="Ellipse_1" data-name="Ellipse 1" class="cls-2" d="M27.5,55A27.507,27.507,0,0,1,16.8,2.161,27.507,27.507,0,0,1,38.2,52.839,27.328,27.328,0,0,1,27.5,55ZM20.479,14.043l-.586,26.915L42.713,27.5,20.479,14.043Z" transform="translate(441 643)"></path>
          </g>
        </svg>
    
        </div>
        <video class="cl-video-el" preload="metadata" src="${videlSrc}">
          <source src="${videlSrc}" type="video/mpeg4">
        </video>
      </div>
    
    </div>
  `;
  videoEl.innerHTML = video;
  document.querySelector('.clvideo > div > div:last-of-type').innerHTML = transcript.outerHTML;
  document.querySelector('.transcript-container').remove();

  function runVideo() {
    if (!hasPlayed) {
      document.querySelector('.cl-video-el').style.display = 'block';
      document.querySelector('.cl-video-el').setAttribute('controls', true);
      document.querySelector('.cl-video-el').play();
      document.querySelector('.video-iframe').style.backgroundImage = 'url()';
      document.querySelector('#ply-btn').remove();
      hasPlayed = true;
      timeTracker();
    }
  }
  document.querySelector('.video-iframe').addEventListener('click', runVideo);
}

function setupCheckList() {
  const checklist = document.querySelector('.checklist').outerHTML;
  const checkListParent = document.createElement('div');
  checkListParent.className = 'checklist-timeline';
  checkListParent.innerHTML = checklist;
  document.querySelector('.clvideo-container > div').appendChild(checkListParent);
  document.querySelector('.checklist-container').remove();
}

function createCheckListLayout() {
  const checklistElements = document.querySelectorAll('.checklist > div');
  let wrapper = '';
  checklistElements.forEach((checklist, index) => {
    if (index === 0) {
      wrapper += `
        <div class="checklist-steps">
          <div class="checklist-info">
            <div class="step-count"><span class="step-index"><svg xmlns="http://www.w3.org/2000/svg" width="18.4" height="16.655" viewBox="0 0 18.4 16.655"><path d="M10,19V14h4v5a1,1,0,0,0,1,1h3a1,1,0,0,0,1-1V12h1.7a.5.5,0,0,0,.33-.87L12.67,3.6a1.008,1.008,0,0,0-1.34,0L2.97,11.13A.5.5,0,0,0,3.3,12H5v7a1,1,0,0,0,1,1H9A1,1,0,0,0,10,19Z" transform="translate(-2.802 -3.345)" fill="#505050"/></svg></span></div>
            <div class="step-info">${checklist.innerHTML}</div>
          </div>
        </div>
        <div class="checklist-steps">
        `;
    }

    if (index >= 1 && index < checklistElements.length - 1) {
      const html = `
      <div class="checklist-info" data-index=${index}>
        <div class="step-count"><span class="step-index">${index}</span></div>
        <div class="step-info">${checklist.innerHTML}</div>
      </div>`;
      checklist.innerHTML = html;
      wrapper += html;
    } else if (index >= 1 && index <= checklistElements.length) {
      const html = `
      <div class="get-help">
        <div class="get-help-info">${checklist.innerHTML}</div>
      </div>`;
      checklist.innerHTML = html;
      wrapper += html;
    }

    if (index >= checklistElements.length - 2) {
      wrapper += '</div>';
    }
  });

  const launchInLr = document.createElement('div');
  launchInLr.classList.add('checklist-steps');
  launchInLr.innerHTML = `
    <div class="checklist-info">
      <div class="step-count">
        <span class="step-index" style="margin-top: 4px;">
          <svg id="Single_icon" data-name="Single icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18">
            <g id="Placement_Area" data-name="Placement Area" fill="#505050" stroke="rgba(0,0,0,0)" stroke-width="1" opacity="0">
              <rect width="18" height="18" stroke="none"/>
              <rect x="0.5" y="0.5" width="17" height="17" fill="none"/>
            </g>
            <g id="Icon">
              <g id="Canvas" fill="#505050" stroke="#747474" stroke-width="1" opacity="0">
                <rect width="18" height="18" stroke="none"/>
                <rect x="0.5" y="0.5" width="17" height="17" fill="none"/>
              </g>
              <path id="Path_104095" data-name="Path 104095" d="M17.489.189A17.364,17.364,0,0,0,4.793,11a.261.261,0,0,0,.062.273l1.876,1.875A.261.261,0,0,0,7,13.207,17.214,17.214,0,0,0,17.809.509a.272.272,0,0,0-.32-.321Z" fill="#505050"/>
              <path id="Path_104096" data-name="Path 104096" d="M3.9,9.574H.45a.262.262,0,0,1-.23-.391C1.01,7.8,3.96,3.26,8.424,3.26,7.388,4.3,3.981,8.785,3.9,9.574Z" fill="#505050"/>
              <path id="Path_104097" data-name="Path 104097" d="M8.424,14.1v3.454a.262.262,0,0,0,.389.23c1.376-.777,5.924-3.688,5.924-8.209C13.7,10.61,9.213,14.017,8.424,14.1Z" fill="#505050"/>
            </g>
          </svg>
        </span>
      </div>
      <div class="step-info">
        <div>Great job!</div>
        <div data-time="Launch in Lightroom" style="margin-top: 0; padding-bottom: 0;">
          &nbsp;
        </div>
      </div>
    </div>
  `;
  document.querySelector('.checklist').innerHTML = wrapper;
  document.querySelectorAll('.checklist-steps a').forEach((link) => {
    link.setAttribute('target', '_blank');
  });
  document.querySelector('.get-help').insertAdjacentHTML('beforebegin', launchInLr.outerHTML);

  // const buttonLink = document
  //   .querySelector('.checklist-steps a:first-of-type')
  //   .getAttribute('href');
  // document.querySelector('.launch-btn').setAttribute('href', buttonLink)
}

function addState(evt) {
  const currentItem = evt.currentTarget;
  setTranscript(currentItem.closest('.checklist-info').getAttribute('data-index'));
  const currentParent = currentItem.closest('.checklist-steps .checklist-info');
  const svg = `
    <svg id="Single_icon" data-name="Single icon" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 30 30">
      <g id="Placement_Area" data-name="Placement Area" fill="red" stroke="rgba(0,0,0,0)" stroke-width="1" opacity="0">
        <rect width="30" height="30" stroke="none"/>
        <rect x="0.5" y="0.5" width="29" height="29" fill="none"/>
      </g>
      <circle id="White_background" data-name="White background" cx="15" cy="15" r="15" fill="#fff"/>
      <g id="Icon">
        <g id="Canvas" fill="#747474" stroke="#747474" stroke-width="1" opacity="0">
          <rect width="30" height="30" stroke="none"/>
          <rect x="0.5" y="0.5" width="29" height="29" fill="none"/>
        </g>
        <path id="Path_104098" data-name="Path 104098" d="M15,1A14,14,0,1,0,29,15,14,14,0,0,0,15,1Zm9.333,7.945L13.266,23.173a1.055,1.055,0,0,1-.766.4h-.064a1.05,1.05,0,0,1-.743-.307L4.882,16.451a1.05,1.05,0,0,1,0-1.485l0,0L6.042,13.8a1.05,1.05,0,0,1,1.485,0l0,0,4.671,4.68,9.2-11.82a1.05,1.05,0,0,1,1.473-.185l0,0,1.273.995a1.05,1.05,0,0,1,.185,1.47Z" fill="#33ab84"/>
      </g>
    </svg>
  `;

  if (currentItem.getAttribute('data-time') >= 1) {
    document.querySelector('.cl-video-el').style.display = 'block';
    document.querySelector('.cl-video-el').setAttribute('controls', true);
    document.querySelector('.cl-video-el').play();
    document.querySelector('.video-iframe').style.backgroundImage = 'url()';
    document.querySelector('.cl-video-el').currentTime = evt.currentTarget.getAttribute('data-time');
    if (!hasPlayed) {
      document.querySelector('#ply-btn').remove();
      hasPlayed = true;
      timeTracker();
    }
  } else {
    currentParent.classList.add('complete');
  }
  currentParent.querySelector('.step-count').innerHTML = svg;
}

function checklistStates() {
  // const timelineParents = document
  //  .querySelectorAll('.checklist-steps:last-of-type .checklist-info');
  const timelineItems = document.querySelectorAll('.checklist-steps .checklist-info .step-info > div:last-of-type');
  timelineItems.forEach((item) => {
    item.addEventListener('click', addState);
  });
}

function setHeroBackground() {
  if (document.querySelector('.clbackground img')) {
    const background = document.querySelector('.clbackground img').getAttribute('src');
    document.querySelector('.clbackground-container').remove();
    document.querySelector('.clvideo-container').style.backgroundImage = `url(${background})`;
  }
}

function setTimeAttribute() {
  const time = document.querySelectorAll('.checklist-steps .checklist-info .step-info > div:last-of-type strong');
  time.forEach((timeItem) => {
    timeItem.closest('.step-info > div:last-of-type').setAttribute('data-time', timeItem.innerText);
  });
  document.querySelector('.get-help a').setAttribute('target', '_blank');
}

function addPlayIcon() {
  const timeStamp = document.querySelectorAll('.checklist-steps:nth-child(2) .checklist-info .step-info div:last-of-type p:first-of-type');

  timeStamp.forEach((el) => {
    const newEl = document.createElement('span');
    newEl.innerHTML = `<svg id="Single_icon" data-name="Single icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 18 18">
    <g id="Placement_Area" data-name="Placement Area" fill="red" stroke="rgba(0,0,0,0)" stroke-width="1" opacity="0">
      <rect width="18" height="18" stroke="none"/>
      <rect x="0.5" y="0.5" width="17" height="17" fill="none"/>
    </g>
    <g id="Icon">
      <g id="Canvas" fill="#959595" stroke="#959595" stroke-width="1" opacity="0">
        <rect width="18" height="18" stroke="none"/>
        <rect x="0.5" y="0.5" width="17" height="17" fill="none"/>
      </g>
      <path id="Path_104090" data-name="Path 104090" d="M4.73,2H3.5a.5.5,0,0,0-.5.5v13a.5.5,0,0,0,.5.5H4.73a1,1,0,0,0,.5-.136L16.265,9.431a.5.5,0,0,0,0-.862L5.234,2.136A1,1,0,0,0,4.73,2Z" fill="#959595"/>
    </g>
  </svg>
  `;
    el.prepend(newEl);
  });
}

function setDynamicHeight() {
  const timeline = document.querySelector('.checklist-timeline');
  const timelineParent = document.querySelector('.clvideo-container');
  if (window.innerWidth >= 924) {
    document.querySelector('.next-container').style.marginTop = `${(timeline.clientHeight - timelineParent.offsetHeight) + 140}px`;
  } else {
    document.querySelector('.next-container').style.marginTop = `${0}px`;
  }
}

layoutSetUp();
setupCheckList();
createCheckListLayout();
checklistStates();
setHeroBackground();
setTimeAttribute();
addPlayIcon();

const resizer = debounce(() => {
  setDynamicHeight();
}, 1000);
window.addEventListener('resize', resizer);

setTimeout(() => {
  setDynamicHeight();
}, 1000);
