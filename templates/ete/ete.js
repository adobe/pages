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
  replaceEmbeds,
  initializeNamespaces,
  insertFooter,

} from '../default/default.js';
import { hashPathOf } from '../../pages/scripts/static-media.js';

async function fetchSteps() {
  window.hlx.dependencies.push('steps.json');
  const resp = await fetch('steps.json');
  const json = await resp.json();
  return Array.isArray(json) ? json : json.data;
}

function getThumbnail(step) {
  let thumbnail = step.Thumbnail;
  if (!thumbnail) {
    if (step.Video.startsWith('https://www.youtube.com')) {
      const yturl = new URL(step.Video);
      const vid = yturl.searchParams.get('v');
      thumbnail = `https://img.youtube.com/vi/${vid}/0.jpg`;
    }
  }
  return thumbnail;
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
        segment += /* html */`
          <div class="section-title">
            ${currentHeader}
          </div>
          <div class="category-steps">`;
      }
      segment += /* html */`
        <div class="card" onclick="window.location='step?${i + 1}'">
          <div class='img' style="background-image: url(${await hashPathOf(`/static/ete/hero-posters/${getThumbnail(step)}`)})">
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
            <div class="icons">
              <div class="icons__item">
                <img src="/icons/${step.Product_icon_1.toLowerCase()}.svg">
              </div>
              <div class="icons__item">
                <img src="/icons/${step.Product_icon_2.toLowerCase()}.svg">
              </div>
            </div>
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
    const addToCategory = (await Promise.all(stepProms)).join('');
    $sectionTitles.innerHTML = '';
    $steps.innerHTML = addToCategory;
  }
}

function decorateNav() {
  if (document.querySelector('header img')) {
    const svg = document.querySelector('header img');
    const svgWithCarrot = document.createElement('div');
    svgWithCarrot.classList.add('nav-logo');

    svgWithCarrot.innerHTML = /* html */`
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
      const productName = document
        .querySelector('header .section-wrapper')
        .children[1].querySelector('p');
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

function playVideo() {
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

  hashPathOf(`/static/twp3/background-elements/${currentStep.Background_element}`).then((src) => {
    $video.style.backgroundImage = `url(${src})`;
  });
  hashPathOf(`/static/ete/hero-posters/${currentStep.Thumbnail}`).then((src) => {
    $video.setAttribute('data-bg', src);
  });

  // fill content section

  const $h1 = document.querySelector('main .content > h1');
  let title = currentStep.Title;
  if (currentStep.Heading) title = currentStep.Heading;
  // title=title.split(`\n`).join('<br>');
  title = title.split('&nbsp;').join('<br>');
  $h1.innerHTML = `${title}`;

  const iconParent = document.createElement('div');
  iconParent.setAttribute('class', 'icons_parent');
  iconParent.innerHTML = /* html */`
    <div class="icons_parent__item">
      <img src="/icons/${currentStep.Product_icon_1.toLowerCase()}.svg">
    </div>
    <div class="icons_parent__item">
      <img src="/icons/${currentStep.Product_icon_2.toLowerCase()}.svg">
    </div>
  `;

  document.querySelector('main .content').prepend(iconParent);
  document.querySelector('.content p').innerHTML = currentStep.Single_page_description;

  document.title = currentStep.Title;
  if (currentStep['Practice File']) {
    document
      .querySelector('main .content>p>a')
      .setAttribute('href', currentStep['Practice File']);
    document
      .querySelector('main .content>p>a').classList.add('video-trigger-btn');
  }

  if (currentStep.Video.startsWith('https://images-tv.adobe.com')) {
    $video.innerHTML = /* html */`
      <div class="video"><div id="placeholder" class="button">
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
      </video>
    </div>`;
    hashPathOf(`/static/ete/hero-posters/${currentStep.Thumbnail}`).then((src) => {
      $video.firstElementChild.style.backgroundImage = `url(${src})`;
    });
    $video.firstElementChild.addEventListener('click', () => playVideo());
  }

  if (currentStep.Video.startsWith('https://www.youtube.com/')) {
    const yturl = new URL(currentStep.Video);
    const vid = yturl.searchParams.get('v');
    $video.innerHTML = /* html */`
      <div style="left: 0; width: 100%; height: 0; position: relative; padding-bottom: 56.25%;">
        <iframe src="https://www.youtube.com/embed/${vid}?rel=0" style="border: 0; top: 0; left: 0; width: 100%; height: 100%; position: absolute;" allowfullscreen scrolling="no" allow="encrypted-media; accelerometer; gyroscope; picture-in-picture"></iframe>
      </div>`;
  }

  function scrollPage(event) {
    event.preventDefault();
    const videooffSet = document.querySelector('.video').offsetTop - 50;
    window.scroll({ top: videooffSet, behavior: 'smooth' });
    document.querySelector('.button').click();
  }

  document.querySelector('.video-trigger-btn').addEventListener('click', scrollPage);

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

  const segments = skills.map((skill) => /* html */`
      <div class="skill">
        <img src="/icons/you-will-learn/${skill.icon}.svg">
        <p>${skill.title} <a href="${skill.linkHref}" target="_blank"> ${skill.linkText}</a></p>
      </div>`);

  const $skillsTitle = document.querySelector('.learn h2');
  $skills.innerHTML = segments.join('');
  $learn.appendChild($skills);
  $skills.prepend($skillsTitle);

  // fill up next
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
    // TODO: remove these repeated loops?
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

window.addEventListener('resize', debounce(() => {
  // run resize events
  cardHeightEqualizer('.card-content');
}, 250));

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
    $behanceLogo: $bio.querySelectorAll('img')[1].getAttribute('src'),
    $link: $bio.querySelector('a:last-of-type').getAttribute('href'),
  };

  $bio.innerHTML = /* html */`
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
}

export default async function decoratePage() {
  initializeNamespaces();
  insertFooter();
  if (window.pages.product) {
    document.getElementById('favicon').href = `/icons/${window.pages.product.replaceAll('-', '')}.svg`;
  }
  await replaceEmbeds();

  document.title = document.title.split('<br>').join(' ');

  addDefaultClass('main>div');
  decorateTables();
  await loadLocalHeader();
  wrapSections('header>div');
  externalLinks('header');
  externalLinks('footer');
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
  // appearMain();
  externalLinks('main .section-wrapper:last-of-type');
  cardHeightEqualizer('.card-content');
  appearMain();
}
