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

// import {
//   addDefaultClass,
//   appearMain,
//   createTag,
//   externalLinks,
//   loadLocalHeader,
// } from '../../scripts.js';
/* global addDefaultClass, appearMain, createTag, externalLinks, loadLocalHeader */

// NOTE: lots of this looks reused from scripts/twp...js

async function fetchSteps() {
  window.hlx.dependencies.push('steps.json');
  const resp = await fetch('steps.json');
  const json = await resp.json();
  return (Array.isArray(json) ? json : json.data);
}

function decorateFooter() {
  const createFooterWave = document.createElement('div');
  createFooterWave.className = 'footer-wave';
  createFooterWave.innerHTML = `
    <img src="${window.location.origin}/templates/ai-scientist/assets/footer-wave.svg"/>
  `;
  document.querySelector('main .default:last-of-type').append(createFooterWave);
}

// 07/14/21 Max commented out, unused
// function addNavCarrot() {
//   if (document.querySelector('header svg') || document.querySelector('header img')) {
//     const svg = document.querySelector('header svg') || document.querySelector('header img');
//     const svgWithCarrot = document.createElement('div');
//     svgWithCarrot.classList.add('nav-logo');

//     svgWithCarrot.innerHTML = `
//       <span class="product-icon">
//           ${svg.outerHTML}
//       </span>

//       <span class="carrot">
//           <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" class="feather feather-chevron-down"><polyline points="6 9 12 15 18 9"></polyline></svg>
//       </span>
//       `;
//     svg.remove();
//     document.querySelector('header div')
//       .prepend(svgWithCarrot);
//     document.querySelector('header').classList.add('default-nav');

//     if (document.querySelector('header .section-wrapper p')) {
//       const productName = document.querySelector('header .section-wrapper')
//         .children[1].querySelector('p');
//       document.querySelector('.product-icon').appendChild(productName);
//     }
//   }
// }

const iconCleanup = ($string) => {
  const original = $string.split('\n');
  let type = '';
  if (document.getElementsByTagName('body')[0].classList.contains('home')) {
    original.forEach((iconSet) => {
      if (iconSet.split('-')[1] != null) {
        type += `
          <div class="great_for_icon_set">
            <img src="${window.location.origin}/templates/ai-scientist/assets/${iconSet.split('-')[1].trim().toLowerCase()}.svg">
          </div>
        `;
      }
    });
  } else {
    original.forEach((iconSet) => {
      if (iconSet.split('-')[1] != null) {
        type += `
          <li class="great_for_icon_set">
            <span>
              <img src="${window.location.origin}/templates/ai-scientist/assets/${iconSet.split('-')[1].trim().toLowerCase()}.svg">
            </span>
            <span>${iconSet.split('-')[0].trim()}</span>
          </li>
        `;
      }
    });
  }
  return type;
};

async function insertSteps() {
  const $steps = document.querySelector('main div.steps');
  if ($steps) {
    const steps = await fetchSteps();
    console.table(steps);
    let $stepItem = '';

    steps.forEach((step, index) => {
      const icons = iconCleanup(step.Great_for);
      $stepItem += `
          <div class="steps__item">
            <div class="steps__item--inner flex">
              <div class="steps__for">
                <span>${step.Duration}</span>
                <span class="spacer">|</span>
                <span>${step.Great_for_title}</span>
              </div>
              <div class="steps__for-icons flex">
                ${icons}
              </div>
            </div>
            <a href="step?${index + 1}" class="steps__image">
              <img src="${step.Thumbnail}"/>
            </a>

            <div class="steps__item--inner content">
              <h2>${step.Title}</h2>
              <p>${step.Description}</p>
              <a href="step?${index + 1}">${step.CTA}</a>
            </div>
          </div>
        `;
    });

    $steps.innerHTML = $stepItem;
  }
}

function styleTimeline($string) {
  const cleanup = $string.split('\n');
  let li = '';
  cleanup.forEach((listItem) => {
    li += `<li>${listItem}</li>`;
  });
  return li;
}

function videoStyle($videoUrl) {
  const video = `
  <div class="video__wrapper">
    <div class="video__element">
      <video src="${$videoUrl.Video}">
        <source src="${$videoUrl.Video}">
      </video>
      <button class="video__play-button">
        <svg xmlns="http://www.w3.org/2000/svg" width="78.092" height="78.092" viewBox="0 0 78.092 78.092">
          <path id="Path_1" data-name="Path 1" d="M41.1,2.05A39.046,39.046,0,1,0,80.142,41.1,39.046,39.046,0,0,0,41.1,2.05ZM61.761,42.787,32.239,60.12a3.924,3.924,0,0,1-2.08.6h-2.8A1.962,1.962,0,0,1,25.4,58.755V23.437a1.962,1.962,0,0,1,1.962-1.962h2.8a3.924,3.924,0,0,1,2.08.6L61.761,39.4a1.962,1.962,0,0,1,0,3.383Z" transform="translate(-2.05 -2.05)" fill="#4e86ff"/>
        </svg>
      </button>
    </div>
    <div class="video-info-single">
      <span><strong>${$videoUrl.Title}</strong></span>
      <span class="spacer">|</span>
      <span>${$videoUrl.Duration}</span>
    </div>
    <ul class="video-timeline">
      ${styleTimeline($videoUrl.Video_timeline)}
    </ul>
  </div>
  `;
  return video;
}

function decorateHero() {
  const svg = document.createElement('div');
  svg.className = 'hero-banner';
  const svgPath = `${window.location.origin}/templates/ai-scientist/assets/hero.svg`;

  svg.innerHTML = `<img src="${svgPath}">`;
  // svg.innerHTML = `./assets/hero.svg`

  document.querySelector('.hero .container').prepend(svg);
}

async function decorateStep() {
  document.body.classList.add('step');
  document.querySelector('main .default:first-of-type').classList.add('hero');
  decorateHero();

  const $intro = document.querySelector('main .default:nth-child(1)');
  const $iconSet = document.querySelector('main .default:nth-child(2)');
  const $stepTwo = document.querySelector('main .default:nth-child(3)');
  const $stepThree = document.querySelector('main .default:nth-child(4)');

  $iconSet.className = 'icon-set';
  $stepTwo.className = 'step-two';
  $stepThree.className = 'step-three';

  const stepIndex = (+window.location.search.substring(1).split('&')[0]) - 1;
  const steps = await fetchSteps();
  // const nextVideo = '';
  // const nextVideoIndex = stepIndex + 1;
  const currentStep = steps[stepIndex];

  console.table(currentStep);

  if (currentStep.Practice_file.length > 1) {
    $stepTwo.querySelector('a').setAttribute('href', currentStep.Practice_file);
    $stepTwo.querySelector('a').setAttribute('target', '_blank');
  } else {
    $stepTwo.innerHTML = '';
    $stepTwo.style.padding = '0px';
  }

  // hero
  $intro.querySelector('h1').innerText = currentStep.Title;
  $intro.querySelector('p').innerText = currentStep.Description;

  // icon section
  $iconSet.querySelector('p').remove();
  const createIconRow = document.createElement('ul');
  createIconRow.className = 'topic_icons';
  createIconRow.innerHTML = iconCleanup(currentStep.Great_for);
  $iconSet.querySelector('.container').append(createIconRow);

  // step two - video section
  const videoElement = document.createElement('div');
  videoElement.className = 'step-video';
  videoElement.innerHTML = videoStyle(currentStep);
  $stepThree.querySelector('.container').append(videoElement);

  const nav = $stepThree.querySelector('ul');
  nav.className = 'mini-nav';
  $stepThree.querySelector('ul').remove();

  console.log(stepIndex);
  // 07/14/21 Max commented out, unused
  // if (stepIndex === 0) {
  // }

  document.querySelector('.video__wrapper').append(nav);

  if (stepIndex === 0) {
    document.querySelector('.mini-nav li:last-of-type').remove();
  } else {
    document.querySelector('.mini-nav li:last-of-type a').setAttribute('href', `step?${stepIndex}`);
    document.querySelector('.mini-nav li:last-of-type a').innerText = steps[stepIndex - 1].Title;
  }

  if (stepIndex + 1 < steps.length) {
    document.querySelector('.mini-nav li:nth-child(1) a').setAttribute('href', `step?${stepIndex + 2}`);
    document.querySelector('.mini-nav li:nth-child(1) a').innerText = steps[stepIndex + 1].Title;
  } else {
    document.querySelector('.mini-nav li:nth-child(1)').remove();
  }

  // get oriented
  // set up video section on homepage
  const $videoCard = document.querySelector('main .default:nth-child(5) .container');
  document.querySelector('main .default:nth-child(5)').classList.add('video_card');
  const $videoUrl = $videoCard.querySelector('a');
  $videoUrl.parentElement.remove();
  const $videoContent = $videoCard.innerHTML;
  $videoCard.innerHTML = '';

  $videoCard.innerHTML = `
    <div class="video__wrapper">
      <div class="video__element">
        <video src="${$videoUrl.getAttribute('href')}">
          <source src="${$videoUrl.getAttribute('href')}">
          </video>
          <button class="video__play-button">
            <svg xmlns="http://www.w3.org/2000/svg" width="78.092" height="78.092" viewBox="0 0 78.092 78.092">
              <path id="Path_1" data-name="Path 1" d="M41.1,2.05A39.046,39.046,0,1,0,80.142,41.1,39.046,39.046,0,0,0,41.1,2.05ZM61.761,42.787,32.239,60.12a3.924,3.924,0,0,1-2.08.6h-2.8A1.962,1.962,0,0,1,25.4,58.755V23.437a1.962,1.962,0,0,1,1.962-1.962h2.8a3.924,3.924,0,0,1,2.08.6L61.761,39.4a1.962,1.962,0,0,1,0,3.383Z" transform="translate(-2.05 -2.05)" fill="#4e86ff"/>
            </svg>
        
          </button>

      </div>
      <div class="video__content">
        ${$videoContent}
      </div>
    </div>
  
  `;

  console.log(document.querySelectorAll('.video__play-button').length, 'hello');
  const buttons = document.querySelectorAll('.video__play-button');

  buttons.forEach((btn) => {
    btn.addEventListener('click', (event) => {
      event.currentTarget.closest('.video__element').querySelector('video').play();
      event.currentTarget.closest('.video__element').querySelector('video').setAttribute('controls', true);
      event.currentTarget.remove();
    });
  });

  // style footer
  decorateFooter();
}

function wrapSections(element) {
  document.querySelectorAll(element).forEach(($div) => {
    const $wrapper = createTag('div', { class: 'section-wrapper' });
    $div.parentNode.appendChild($wrapper);
    $wrapper.appendChild($div);
    $wrapper.firstElementChild.classList.add('container');
  });
}

async function decorateHome() {
  document.body.classList.add('home');

  document.querySelector('main .default:first-of-type').classList.add('hero');
  decorateHero();

  const $sectionTwo = document.querySelector('main .default:nth-child(2)');

  let li = '';

  // icon set up on homepage
  $sectionTwo.querySelectorAll('li').forEach((list) => {
    const iconTitle = list.innerText.split('-')[0];
    const iconType = list.innerText.split('-')[1].trim();
    li += `
      <li class="${iconType}">
        <span><img src="${window.location.origin}/templates/ai-scientist/assets/${iconType}.svg"></span>
        <span>${iconTitle}</span>
      </li>
    `;
  });

  $sectionTwo.querySelector('ul').innerHTML = li;
  $sectionTwo.querySelector('ul').className = 'topic_icons';

  // set up video section on homepage
  const $sectionThree = document.querySelector('main .default:nth-child(3) .container');
  const $videoUrl = $sectionThree.querySelector('a');
  $videoUrl.parentElement.remove();
  const $videoContent = $sectionThree.innerHTML;
  $sectionThree.innerHTML = '';

  $sectionThree.innerHTML = `
    <div class="video__wrapper">
      <div class="video__element">
        <video src="${$videoUrl.getAttribute('href')}">
          <source src="${$videoUrl.getAttribute('href')}">
          </video>
          <button class="video__play-button">
            <svg xmlns="http://www.w3.org/2000/svg" width="78.092" height="78.092" viewBox="0 0 78.092 78.092">
              <path id="Path_1" data-name="Path 1" d="M41.1,2.05A39.046,39.046,0,1,0,80.142,41.1,39.046,39.046,0,0,0,41.1,2.05ZM61.761,42.787,32.239,60.12a3.924,3.924,0,0,1-2.08.6h-2.8A1.962,1.962,0,0,1,25.4,58.755V23.437a1.962,1.962,0,0,1,1.962-1.962h2.8a3.924,3.924,0,0,1,2.08.6L61.761,39.4a1.962,1.962,0,0,1,0,3.383Z" transform="translate(-2.05 -2.05)" fill="#4e86ff"/>
            </svg>
        
          </button>

      </div>
      <div class="video__content">
        ${$videoContent}
      </div>
    </div>
  
  `;

  document.querySelector('.video__play-button').addEventListener('click', (event) => {
    document.querySelector('.video__element video').play();
    document.querySelector('.video__element video').setAttribute('controls', true);
    event.currentTarget.remove();
  });

  document.querySelectorAll('main p').forEach(($e) => {
    const inner = $e.innerHTML.toLowerCase().trim();
    if (inner === '&lt;steps&gt;' || inner === '\\<steps></steps>') {
      $e.parentNode.classList.add('steps');
      $e.parentNode.innerHTML = '';
    }
  });
  await insertSteps();

  decorateFooter();
}

async function decoratePage() {
  wrapSections('main>div');
  addDefaultClass('main>div');
  await loadLocalHeader();

  externalLinks('header');
  externalLinks('footer');
  wrapSections('header>div');

  let pageType;
  // find steps marker
  if (document.location.pathname.endsWith('/step')) {
    pageType = 'step';
  } else {
    pageType = 'home';
  }
  window.pages.pageType = pageType;

  if (pageType === 'home') {
    await decorateHome();
  }

  if (pageType === 'step') {
    await decorateStep();
  }

  window.pages.decorated = true;
  appearMain();

  document.body.classList.add(window.pages.locale);
}

if (document.readyState === 'loading') {
  window.addEventListener('DOMContentLoaded', decoratePage);
} else {
  decoratePage();
}
