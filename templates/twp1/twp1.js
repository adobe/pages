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
/*
global
  addDefaultClass,
  appearMain,
  createTag,
  externalLinks,
  loadLocalHeader
*/

async function fetchSteps() {
  window.hlx.dependencies.push('steps.json');
  const resp = await fetch('steps.json');
  const json = await resp.json();
  return (Array.isArray(json) ? json : json.data);
}

// function getThumbnail(step) {
//   let thumbnail = step.Thumbnail;
//   if (!thumbnail) {
//     if (step.Video.startsWith('https://www.youtube.com')) {
//       const yturl = new URL(step.Video);
//       const vid = yturl.searchParams.get('v');
//       thumbnail = `https://img.youtube.com/vi/${vid}/0.jpg`;
//     }
//   }
//   return (thumbnail);
// }

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

// eslint-disable-next-line max-len
//     if (document.querySelector('header .section-wrapper').children[1].firstElementChild.nodeName === 'P') {
// eslint-disable-next-line max-len
//       const productName = document.querySelector('header .section-wrapper').children[1].querySelector('p');
//       document.querySelector('.product-icon').appendChild(productName);
//     }
//   }
// }

async function insertSteps() {
  const $steps = document.querySelector('main div.steps');
  if ($steps) {
    const steps = await fetchSteps();
    const stepsInner = document.createElement('div');
    stepsInner.classList.add('steps__inner');
    let stepItem = '';

    steps.forEach((step, index) => {
      console.log(index);
      stepItem += `
          <div class="steps__item">
            <a href="step?${index + 1}" class="steps__img">
              <img src="${step.Thumbnail}"/>
            </a>
            <div class="steps__info">
              <span>${step.Milestone}</span>
              <span>|</span>
              <span>${step.Duration}</span>
            </div>
            <h4>${step.Title}</h4>
            <hr>
            <p>${step.Description}</p>
            <a href="step?${index + 1}">${step.CTA_text}</a>
          </div>
        `;
    });

    stepsInner.innerHTML = stepItem;
    $steps.innerHTML = stepsInner.outerHTML;
  }
}

function decorateHero() {
  const heroBackground = document.querySelector('.hero img');
  const hasBackground = heroBackground ? heroBackground.closest('p').remove() : false;
  const heroContent = document.querySelector('.hero').innerHTML;

  document.querySelector('.hero').innerHTML = `
    <div class="hero__content-inner">
      <div class="hero__content">
        ${heroContent}
      </div>
    </div>
    
    <div class="hero__background" style="background-image: url(${hasBackground ? heroBackground.getAttribute('src') : ''});"></div>
  `;
}

async function decorateStep() {
  document.body.classList.add('step');

  const stepIndex = (+window.location.search.substring(1).split('&')[0]) - 1;
  const steps = await fetchSteps();
  let nextVideo = '';
  const nextVideoIndex = stepIndex + 1;

  if (stepIndex + 1 < steps.length) {
    nextVideo = `<a href="?${nextVideoIndex + 1}">${steps[nextVideoIndex].Title}</a> <span>|</span>`;
  } else {
    nextVideo = '';
  }
  // if(stepIndex)
  const currentStep = steps[stepIndex];
  document.querySelector('main .default:first-of-type').classList.add('hero');
  decorateHero();
  const $hero = document.querySelector('main .hero');
  const $step1 = document.querySelector('main .default:nth-child(2)');
  const $step2 = document.querySelector('main .default:nth-child(3)');
  const $step3 = document.querySelector('main .default:nth-child(4)');
  const lastRow = document.querySelector('main .default:last-of-type');

  // set up hero
  $hero.querySelector('h4').innerText = currentStep.Milestone;
  $hero.querySelector('h1').innerText = currentStep.Title;
  $hero.querySelector('p').innerText = currentStep.Single_page_description;

  let $stepOneLink = '';

  if (currentStep.Step_one_link) {
    if (currentStep.Step_one_link.includes('http')) {
      $stepOneLink = `${currentStep.Step_one_link}`;
    } else {
      $stepOneLink = `/templates/twp1/sample-images/${currentStep.Step_one_link}`;
    }
    $stepOneLink = `<a href="${$stepOneLink}" class="cta">${currentStep.Step_one_cta_text}</a>`;
  }

  // set up step 1
  if (currentStep.Step_one_title) {
    $step1.innerHTML = `
      <div class="default__container step-1">
        <div class="default__content center">
          <h3>${currentStep.Step_one_mini_title}</h3>
          <h2>${currentStep.Step_one_title}</h2>
          <p>${currentStep.Step_one_copy ? currentStep.Step_one_copy : ''}</p>
          ${$stepOneLink}
        </div>
      </div>
    `;
  } else {
    $step1.innerHTML = '';
    // TODO: figure out what this was supposed to do?
    // $step1.childElementCount < 1 ? $step1.style.padding = '0px' : '';
    if ($step1.childElementCount < 1) $step1.style.padding = '0px';
  }

  // set up step 2

  const timestampsAll = currentStep.Step_two_timestamp.split('\n');
  let timestamps = '';
  const timestampParent = document.createElement('ul');

  timestampsAll.forEach((time) => {
    if (time.length > 2) {
      timestamps += `<li>${time}</li>`;
    }
  });

  timestampParent.innerHTML = timestamps;

  $step2.innerHTML = `
  <div class="default__container step-2">
    <div class="default__content center">
      <h3>${currentStep.Step_two_mini_title}</h3>
      <h2>${currentStep.Step_two_title}</h2>
    </div>
    <div class="video">
      <video class="video__el" preload="metadata" src="${currentStep.Step_two_video}">
        <source src="${currentStep.Step_two_video}" type="video/mpeg4">
      </video>
      <button class="play-video">
      <svg xmlns="http://www.w3.org/2000/svg" width="40" height="51" viewBox="0 0 40 51">
        <path id="Polygon_1" data-name="Polygon 1" d="M25.5,0,51,40H0Z" transform="translate(40) rotate(90)" fill="#fff"/>
      </svg>
    
      </button>
    </div>
    <div class="default__content default__step-info">
      <h4>${currentStep.Title}
        <span>|</span>
        ${currentStep.Duration}
      </h3>
      <p>${currentStep.Description}</p>
    </div>
    <div class="default__following-along">
      <h5>${currentStep.Step_two_timestamp_title}</h5>
      ${timestampParent.outerHTML}

      <div class="milestones">
        <p class="milestone-of">${currentStep.Step_two_see_all_title}</p>
        <p class="milestones-links">
          ${currentStep.Next}:
          ${nextVideo}
          <a href="./">${currentStep.See_all}</a>
        </p>
      </div>
    </div>
    
  </div>
  `;

  let $stepThreeLink = '';

  if (currentStep.Step_three_link) {
    if (currentStep.Step_three_link.includes('http')) {
      $stepThreeLink = `${currentStep.Step_three_link}`;
    } else {
      $stepThreeLink = `/templates/twp1/practice-images/${currentStep.Step_one_link}`;
    }
    $stepThreeLink = `<a href="${$stepThreeLink}" class="cta">${currentStep.Step_three_cta_text}</a>`;
  }

  // step 3
  if (currentStep.Step_three_title) {
    $step3.innerHTML = `
    <div class="default__container step-3">
      <div class="default__content center">
        <h3>${currentStep.Step_three_mini_title}</h3>
        <h2>${currentStep.Step_three_title}</h2>
        <p>${currentStep.Step_three_copy ? currentStep.Step_three_copy : ''}</p>
        ${$stepThreeLink}
      </div>
    </div>
  `;
  } else {
    $step3.innerHTML = '';
    // TODO: same as above..
    // $step3.childElementCount < 1 ? $step_3.style.padding = '0px' : '';
    if ($step3.childElementCount < 1) $step3.style.padding = '0px';
  }

  // play video handler
  document.querySelector('.play-video').addEventListener('click', (event) => {
    document.querySelector('.video__el').play();
    document.querySelector('.video__el').setAttribute('controls', true);
    event.currentTarget.remove();
  });

  // style last row
  lastRow.firstElementChild.classList.add('row_title');
  const lastRowLinks = lastRow.querySelectorAll('a');
  const buttonGroup = document.createElement('div');
  buttonGroup.className = 'button_group';
  let links = '';

  lastRowLinks.forEach((link, index) => {
    link.closest('p').remove();
    const className = index >= 1 ? 'secondary' : 'cta';
    links += `<a target="_BLANK" href="${link.getAttribute('href')}" class="${className}">${link.innerText}</a>`;
  });

  buttonGroup.innerHTML = links;
  lastRow.append(buttonGroup);
}

function wrapSections(element) {
  document.querySelectorAll(element).forEach(($div) => {
    const $wrapper = createTag('div', { class: 'section-wrapper' });
    $div.parentNode.appendChild($wrapper);
    $wrapper.appendChild($div);
  });
}

async function decorateHome() {
  document.body.classList.add('home');

  document.querySelector('main .default:first-of-type').classList.add('hero');

  decorateHero();

  document.querySelectorAll('main p').forEach(($e) => {
    const inner = $e.innerHTML.toLowerCase().trim();
    if (inner === '&lt;steps&gt;' || inner === '\\<steps></steps>') {
      $e.parentNode.classList.add('steps');
      $e.parentNode.innerHTML = '';
    }
  });
  await insertSteps();

  const lastRow = document.querySelector('main .default:last-of-type');

  lastRow.firstElementChild.classList.add('row_title');
  const lastRowLinks = lastRow.querySelectorAll('a');
  const buttonGroup = document.createElement('div');
  buttonGroup.className = 'button_group';
  let links = '';

  lastRowLinks.forEach((link, index) => {
    link.closest('p').remove();
    const className = index >= 1 ? 'secondary' : 'cta';
    console.log(className);
    links += `<a target="_blank" href="${link.getAttribute('href')}" class="${className}">${link.innerText}</a>`;
  });

  buttonGroup.innerHTML = links;
  lastRow.append(buttonGroup);
}

async function decoratePage() {
  addDefaultClass('main>div');

  await loadLocalHeader();

  externalLinks('header');
  externalLinks('footer');
  wrapSections('header>div');
  // nav style/dropdown
  // addNavCarrot();

  // if(document.querySelector('.nav-logo')) {
  //   document.querySelector('.nav-logo').addEventListener('click', dropDownMenu)
  // }

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
}

if (document.readyState === 'loading') {
  window.addEventListener('DOMContentLoaded', decoratePage);
} else {
  decoratePage();
}
