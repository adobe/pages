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
  addDefaultClass,
  appearMain,
  classify,
  createTag,
  debounce,
  decorateTables,
  externalLinks,
  loadLocalHeader,
} from '../default/default.js';
import { hashPathOf } from '../../pages/scripts/static-media.js';

async function fetchSteps() {
  window.hlx.dependencies.push('steps.json');
  const resp = await fetch('steps.json');
  const json = await resp.json();
  return Array.isArray(json) ? json : json.data;
}

async function imageUrlFetcher(image) {
  let url = '';
  if (image.includes('https:') || image.includes('http:')) {
    url = image;
  } else {
    url = await hashPathOf(`/static/lr-ps/hero-posters/${image}`);
  }
  return url;
}

async function createNextStepsComponent(steps, currentIndex) {
  // removing the markup that's being added
  // by the 'lr-ps-show-more' component
  if (document.querySelectorAll('.more-content--ete').length >= 1) {
    document.querySelectorAll('.more-content--ete')[0].remove();
  }

  const lastContainer = document.querySelector('main .default:last-of-type');
  const nextStepsTitle = lastContainer.querySelector('h5').innerText;
  const nextStepsCta = lastContainer.querySelector('a');

  const scratchRandomGdoc = document.querySelector('main .default:nth-child(4)');
  document.querySelector('.must-haves__title').innerText = scratchRandomGdoc.querySelector('h1').innerText;
  document.querySelector('.must-haves__copy').innerText = scratchRandomGdoc.querySelector('p').innerText;
  scratchRandomGdoc.remove();

  // Checking indexes
  // If you're on the first step (0)
  // It will just grab the next step
  // (else) if you're on the last index (steps.length - 1)
  // It will just grab the previous step
  // (else) will grab both the previous and next steps index
  const nextSteps = [];
  const urls = [];
  let moreContentElement = '';
  if (currentIndex === 0) {
    nextSteps.push(steps[currentIndex + 1]);
    urls.push(currentIndex + 2);
  } else if (currentIndex === steps.length - 1) {
    nextSteps.push(steps[currentIndex]);
    urls.push(currentIndex);
  } else {
    nextSteps.push(steps[currentIndex - 1]);
    nextSteps.push(steps[currentIndex + 1]);
    urls.push(currentIndex);
    urls.push(currentIndex + 2);
  }

  // iterating through all the collected steps
  // and creating the markup
  const ps = nextSteps.map(async (nextStep, index) => `
      <a class="more-content--ete-item" href="step?${urls[index]}">
        <div class="more-content--ete-image">
          <div style="position: relative;">
            <img src="${await imageUrlFetcher(nextStep.Thumbnail)}">
          </div>
        </div>
        <div class="more-content--ete-details">
          <h4>${nextStep.Title.split('&nbsp;').join('')}</h4>
          <p>${nextStep.Description}</p>
        </div>
      </a>
    `);
  moreContentElement = (await Promise.all(ps)).join('');

  lastContainer.innerHTML = `
    <div class="more-content--ete">
      <h3 class="section-title--ete-more">${nextStepsTitle}</h3>
      <div class="more-content--ete-inner">
        ${moreContentElement}
      </div>
      <div class="see-all-tutorials--ete">
        <a href="${nextStepsCta.getAttribute('href')}">${nextStepsCta.innerText}</a>
      </div>
    </div>
  `;
}

function wrapSections(element) {
  document.querySelectorAll(element).forEach(($div) => {
    const $wrapper = createTag('div', { class: 'section-wrapper' });
    $div.parentNode.appendChild($wrapper);
    $wrapper.appendChild($div);
  });
}

async function insertSteps() {
  const $steps = document.querySelector('main div.steps');
  const $sectionTitles = document.querySelector('main div:nth-child(2)');

  if ($steps) {
    let count = -1;
    const steps = await fetchSteps();
    const stepProms = steps.map(async (step, i) => {
      let segment = '';
      if (i % 3 === 0) {
        count += 1;
        const headers = $sectionTitles.querySelectorAll('h3');
        let currentHeader = '';
        if (headers[count]) {
          currentHeader = headers[count].outerHTML;
        }
        segment += `<div class="section-title">${currentHeader}</div><div class="category-steps">`;
      }
      segment += `<div class="card" onclick="window.location='step?${i + 1}'">
                <div class='img' style="background-image: url(${await imageUrlFetcher(step.Thumbnail)})">
                  <svg xmlns="http://www.w3.org/2000/svg" width="55" height="55" viewBox="0 0 55 55">
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
                      <rect id="Rectangle_147685" data-name="Rectangle 147685" class="cls-1" width="27" height="36" transform="translate(457.545 652)"/>
                      <path id="Ellipse_1" data-name="Ellipse 1" class="cls-2" d="M27.5,55A27.507,27.507,0,0,1,16.8,2.161,27.507,27.507,0,0,1,38.2,52.839,27.328,27.328,0,0,1,27.5,55ZM20.479,14.043l-.586,26.915L42.713,27.5,20.479,14.043Z" transform="translate(441 643)"/>
                    </g>
                  </svg>
                </div>
                <div class='text'>
                    <div class="card-content"> 
                      <h4>${step.Title}</h4>
                      <p>${step.Description}</p>
                    </div>
                    <a href="step?${i + 1}">${step.CTA}</a>
                </div>
            </div>`;
      if (i === 2 || i === 5) {
        segment += '</div>';
      }
      return segment;
    });
    // let markup = `${addToCategory}`
    await Promise.all(stepProms).then((segments) => {
      const addToCategory = segments.join('');
      $sectionTitles.innerHTML = '';
      $steps.innerHTML = addToCategory;
    });
  }
}

function decorateNav() {
  if (document.querySelector('header img')) {
    const svg = document.querySelector('header img');
    const svgWithCarrot = document.createElement('div');
    svgWithCarrot.classList.add('nav-logo');

    svgWithCarrot.innerHTML = `
        <span class="product-icon">
            ${svg.outerHTML}
        </span>
  
        <span class="carrot">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="feather feather-chevron-down"><polyline points="6 9 12 15 18 9"></polyline></svg>
        </span>
        `;
    svg.remove();
    document.querySelector('header div').prepend(svgWithCarrot);
    document.querySelector('header').classList.add('default-nav');

    if (document.querySelector('header .section-wrapper p')) {
      const productName = document.querySelector('header .section-wrapper').children[1].querySelector('p');
      document.querySelector('.product-icon').appendChild(productName);
    }
  }
}

function dropDownMenu() {
  const $header = document.querySelector('header');

  if (window.outerWidth >= 768) return;

  if (!$header.classList.contains('nav-showing')) {
    $header.querySelector('ul').style.display = 'flex';
    $header.classList.add('nav-showing');
  } else {
    $header.querySelector('ul').style.display = 'none';
    $header.classList.remove('nav-showing');
  }
}

// eslint-disable-next-line import/prefer-default-export
export function playVideo() {
  document.getElementById('placeholder').classList.add('hidden');
  const $video = document.getElementById('video');
  $video.classList.remove('hidden');
  $video.classList.remove('hidden');
  $video.play();
  $video.setAttribute('controls', true);
}

async function decorateStep() {
  document.body.classList.add('step');
  classify('main>div:first-of-type', 'content');
  classify('main>div:nth-of-type(2)', 'learn');

  const $content = document.querySelector('.content');
  const $learn = document.querySelector('.learn');
  // const $progress = document.querySelector('.progress');

  const $video = createTag('div', { class: 'video-wrapper' });
  $content.appendChild($video);

  const stepIndex = +window.location.search.substring(1).split('&')[0] - 1;
  const steps = await fetchSteps();
  const currentStep = steps[stepIndex];

  const returnCorrectBg = async (url) => (url.includes('http') ? url : hashPathOf(`/static/twp3/background-elements/${currentStep.Background_element}`));
  $video.style.backgroundImage = `url(${await returnCorrectBg(currentStep.Background_element)})`;
  $video.setAttribute('data-bg', await imageUrlFetcher(currentStep.Thumbnail));

  // fill content section

  const $h1 = document.querySelector('main .content > h1');
  let title = currentStep.Title;
  if (currentStep.Heading) title = currentStep.Heading;
  title = title.split('\n').join('<br>');
  title = title.split('&nbsp;').join('<br>');
  $h1.innerHTML = `${title}`;

  const iconParent = document.createElement('div');
  iconParent.setAttribute('class', 'icons_parent');
  iconParent.innerHTML = `
    <div class="icons_parent__item"><img src="/icons/${currentStep.Product_icon_1.toLowerCase()}.svg"></div>
    <div class="icons_parent__item"><img src="/icons/${currentStep.Product_icon_2.toLowerCase()}.svg"></div>`;

  document.querySelector('main .content').prepend(iconParent);
  document.querySelector('.content p').innerHTML = currentStep.Single_page_description;

  document.title = currentStep.Title;
  if (currentStep['Practice File']) {
    if (currentStep['Practice File'] !== '#0') {
      document.querySelector('main .content>p>a').setAttribute('target', '_blank');
    } else {
      document.querySelector('main .content>p>a').classList.add('video-trigger-btn');
    }
    document.querySelector('main .content>p>a').setAttribute('href', currentStep['Practice File']);
  }

  if (currentStep.Video.startsWith('https://images-tv.adobe.com')) {
    $video.innerHTML = `<div class="video"><div id="placeholder" class="button">
        <svg xmlns="http://www.w3.org/2000/svg" width="55" height="55" viewBox="0 0 55 55">
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
            <rect id="Rectangle_147685" data-name="Rectangle 147685" class="cls-1" width="27" height="36" transform="translate(457.545 652)"/>
            <path id="Ellipse_1" data-name="Ellipse 1" class="cls-2" d="M27.5,55A27.507,27.507,0,0,1,16.8,2.161,27.507,27.507,0,0,1,38.2,52.839,27.328,27.328,0,0,1,27.5,55ZM20.479,14.043l-.586,26.915L42.713,27.5,20.479,14.043Z" transform="translate(441 643)"/>
          </g>
        </svg>
  
        </div>
        <video id='video' class="hidden" preload="metadata" src="${currentStep.Video}" tabindex="0">
        <source src="${currentStep.Video}" type="video/mpeg4">
        </video></div>`;
    // hashPathOf(`/static/lr-ps/hero-posters/${currentStep.Thumbnail}`).then((href) => {
    //   $video.firstElementChild.style.backgroundImage = `url(${href})`;
    // });
    document.querySelector('.video').style.backgroundImage = `url(${await imageUrlFetcher(currentStep.Thumbnail)})`;
    $video.firstElementChild.addEventListener('click', () => playVideo());
  }

  if (currentStep.Video.startsWith('https://www.youtube.com/')) {
    const yturl = new URL(currentStep.Video);
    const vid = yturl.searchParams.get('v');
    $video.innerHTML = `<div style="left: 0; width: 100%; height: 0; position: relative; padding-bottom: 56.25%;"><iframe src="https://www.youtube.com/embed/${vid}?rel=0" style="border: 0; top: 0; left: 0; width: 100%; height: 100%; position: absolute;" allowfullscreen scrolling="no" allow="encrypted-media; accelerometer; gyroscope; picture-in-picture"></iframe></div>`;
  }

  function scrollPage(event) {
    event.preventDefault();
    const videooffSet = document.querySelector('.video').offsetTop - 50;
    window.scroll({ top: videooffSet, behavior: 'smooth' });
    document.querySelector('.button').click();
  }
  if (currentStep['Practice File'] === '#0' && document.querySelector('.video-trigger-btn')) {
    document.querySelector('.video-trigger-btn').addEventListener('click', scrollPage);
  }

  // fill learn section

  const skills = [];

  while (currentStep[`Skill ${skills.length + 1}`]) {
    skills.push({
      title: currentStep[`Skill ${skills.length + 1}`],
      icon: currentStep[`Skill ${skills.length + 1} Icon`],
      linkText: currentStep[`Skill_${skills.length + 1}_link_text`],
      linkHref: currentStep[`Skill_${skills.length + 1}_link`],
    });
  }
  const $skills = createTag('div', { class: 'skills' });
  let html = '';

  skills.forEach((skill) => {
    html += `
      <div class="skill">
        <img src="/icons/${skill.icon}.svg">
        <p>${skill.title} <a href="${skill.linkHref}" target="_blank"> ${skill.linkText}</a></p>
  
      </div>`;
  });

  const $skillsTitle = document.querySelector('.learn h2');
  $skills.innerHTML = html;
  $learn.appendChild($skills);

  $skills.prepend($skillsTitle);

  createNextStepsComponent(steps, stepIndex);
}

async function decorateHome() {
  document.body.classList.add('home');
  document.querySelectorAll('main p').forEach(($e) => {
    const inner = $e.innerHTML.toLowerCase().trim();
    if (inner === '&lt;steps&gt;' || inner === '\\<steps></steps>') {
      $e.parentNode.classList.add('steps');
      $e.parentNode.innerHTML = '';
    }
  });
  await insertSteps();
}

// set fixed height to cards to create a uniform UI
function cardHeightEqualizer($el) {
  let initialHeight = 0;
  const element = document.querySelectorAll($el);

  if (window.innerWidth >= 700 && element.length > 1) {
    element.forEach((cardEl) => {
      cardEl.style.height = 'auto';
    });

    element.forEach((cardText) => {
      if (initialHeight < cardText.offsetHeight) {
        initialHeight = cardText.offsetHeight;
      }
    });

    element.forEach((cardEl) => {
      cardEl.style.height = `${initialHeight}px`;
    });
  } else {
    element.forEach((cardEl) => {
      cardEl.style.height = 'auto';
    });
  }
}

function cleanUpBio() {
  if (!document.querySelector('.about-bio')) return;
  const $bio = document.querySelector('.about-bio');

  if (document.getElementsByTagName('body')[0].classList.contains('home')) {
    $bio.closest('.section-wrapper').classList.add('bio-section');
  }

  const bio = {
    $avatar: $bio.querySelectorAll('img')[0].getAttribute('src'),
    $name: $bio.querySelector('h2').innerText,
    $bioSummary: $bio.querySelector('h4').innerText,
    $behanceLogo: window.location.pathname.includes('sticker-mule') ? '' : $bio.querySelectorAll('img')[1].getAttribute('src'),
    $link: $bio.querySelector('a:last-of-type').getAttribute('href'),
  };

  $bio.innerHTML = `
        <div class="about-bio__inner">
          <div class="bio-image">
            <img src="${bio.$avatar}" alt="image of ${bio.$name}"/>
          </div>
          <div class="bio-content">
            <h4>${bio.$name}</h4>
            <a class="follow-link" href="${bio.$link}" target="_blank">
              <img src="${bio.$behanceLogo}" alt="Follow ${bio.$name} on Behance">
              <p>Follow Me</p>
            </a>
            <p class="bio">${bio.$bioSummary}</p>
          </div>
        </div>
    `;

  if (window.location.pathname.includes('sticker-mule') && document.querySelector('.bio-section')) {
    document.querySelector('.bio-section').remove();
  }
}

export default async function decoratePage() {
  addDefaultClass('main>div');
  decorateTables();
  await loadLocalHeader();
  wrapSections('header>div');
  // externalLinks('header');
  // externalLinks('footer');
  // nav style/dropdown
  decorateNav();

  if (document.querySelector('.nav-logo')) {
    document.querySelector('.nav-logo').addEventListener('click', dropDownMenu);
  }

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
    document.title = document.title.split('&nbsp;').join(' ');
    document.title = document.title.split('<br>').join(' ');
  }

  window.pages.decorated = true;
  wrapSections('.home > main > div');
  cleanUpBio();
  appearMain();
  externalLinks('main .section-wrapper:last-of-type');
  cardHeightEqualizer('.card-content');
}

window.addEventListener(
  'resize',
  debounce(() => {
    // run resize events
    cardHeightEqualizer('.card-content');
  }, 250),
);
