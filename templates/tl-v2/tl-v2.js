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
//   classify,
//   createTag,
//   debounce,
//   externalLinks,
//   loadLocalHeader,
// } from '../../scripts.js';
/*
global
  addDefaultClass,
  appearMain,
  classify,
  createTag,
  debounce,
  externalLinks,
  loadLocalHeader
*/

async function fetchSteps() {
  window.hlx.dependencies.push('steps.json');
  const resp = await fetch('steps.json');
  const json = await resp.json();
  return (Array.isArray(json) ? json : json.data);
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
  return (thumbnail);
}

function addNavCarrot() {
  if (document.querySelector('header svg') || document.querySelector('header img')) {
    const svg = document.querySelector('header svg') || document.querySelector('header img');
    const svgWithCarrot = document.createElement('div');
    svgWithCarrot.classList.add('nav-logo');

    svgWithCarrot.innerHTML = `
        <span class="product-icon">
            ${svg.outerHTML}
        </span>

        <span class="carrot">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" class="feather feather-chevron-down"><polyline points="6 9 12 15 18 9"></polyline></svg>
        </span>
        `;
    svg.remove();
    document.querySelector('header div')
      .prepend(svgWithCarrot);
    document.querySelector('header').classList.add('default-nav');

    if (document.querySelector('header .section-wrapper p')) {
      const productName = document.querySelector('header .section-wrapper').children[1].querySelector('p');
      document.querySelector('.product-icon').appendChild(productName);
    }
  }
}

async function insertSteps() {
  const $steps = document.querySelector('main div.steps');
  if ($steps) {
    const steps = await fetchSteps();
    if (steps[0].Category) {
      const titles = [];
      const stepGroups = [];
      let markup = '';
      steps.forEach((stepsType) => {
        if (!titles.includes(stepsType.Category)) {
          titles.push(stepsType.Category);
          stepGroups.push({
            Category: stepsType.Category,
            title: stepsType.Category_Title,
          });
        }
      });

      stepGroups.forEach((stepsNest) => {
        markup += `
                    <div class="row">
                        <div class="row-title">
                            <h3>${stepsNest.title}</h3>
                        </div>
                `;

        markup += '<div class="steps">';

        steps.forEach((step, i) => {
          if (step.Category === stepsNest.Category) {
            markup += `
                        <div class="card" onclick="window.location='step?${i + 1}'">
                    <div class='img' style="background-image: url(../../../static/ete/${step.Thumbnail})">
                    <svg xmlns="http://www.w3.org/2000/svg" width="731" height="731" viewBox="0 0 731 731">
                    <g id="Group_23" data-name="Group 23" transform="translate(-551 -551)">
                        <circle id="Ellipse_14" data-name="Ellipse 14" cx="365.5" cy="365.5" r="365.5" transform="translate(551 551)" fill="#1473e6"/>
                        <path id="Polygon_3" data-name="Polygon 3" d="M87.5,0,175,152H0Z" transform="translate(992.5 829.5) rotate(90)" fill="#fff"/>
                    </g>
                    </svg>
                    </div>
                    <div class='text'>
                        <div><h4>${step.Title.replace('\n', '<br>')}</h4>
                        <p>${step.Description.replace('\n', '<br>')}</p>
                        </div>
                        <a href="step?${i + 1}">${step.CTA}</a>
                    </div>
                </div>
                        
                        `;
          }
        });
        markup += '</div> </div>';
      });

      $steps.innerHTML = markup;
      // console.log(markup)
    } else {
      let html = '';
      steps.forEach((step, i) => {
        let setThumbnail;
        let miniThumbNails = '';

        if (step.show_icons_on_card) {
          miniThumbNails += `
                    <div class="icons">
                        <div class="icons__item">
                            <img src="../../../../icons/${step.Product_icon_1.toLowerCase()}.svg">
                        </div>
                        <div class="icons__item">
                            <img src="../../../../icons/${step.Product_icon_2.toLowerCase()}.svg">
                        </div>
                    </div>
                    
                    `;
        }

        if (step.Thumbnail.includes('http')) {
          setThumbnail = step.Thumbnail;
        } else {
          setThumbnail = ` ../../../../static/ete/hero-posters/${getThumbnail(step)}`;
        }
        html += `<div class="card" onclick="window.location='step?${i + 1}'">
                    <div class='img'>
                    <img src="${setThumbnail}">
                    <svg xmlns="http://www.w3.org/2000/svg" width="731" height="731" viewBox="0 0 731 731">
                    <g id="Group_23" data-name="Group 23" transform="translate(-551 -551)">
                        <circle id="Ellipse_14" data-name="Ellipse 14" cx="365.5" cy="365.5" r="365.5" transform="translate(551 551)" fill="#1473e6"/>
                        <path id="Polygon_3" data-name="Polygon 3" d="M87.5,0,175,152H0Z" transform="translate(992.5 829.5) rotate(90)" fill="#fff"/>
                    </g>
                    </svg>
                    </div>
                    <div class='text'>
                      ${miniThumbNails}
                      <div class="card-content"> 
                        <h4>${step.Title}</h4>
                        <p>${step.Description}</p>
                      </div>
                      <a href="step?${i + 1}">${step.CTA}</a>
                    </div>
                </div>`;
      });
      $steps.innerHTML = html;
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

let isVideoPlaying = false;

// eslint-disable-next-line import/prefer-default-export
export function playVideo() {
  document.getElementById('placeholder').classList.add('hidden');
  const $video = document.getElementById('video');
  $video.classList.remove('hidden');
  $video.classList.remove('hidden');
  if (!isVideoPlaying) {
    $video.play();
    $video.setAttribute('controls', true);
    isVideoPlaying = true;
  }
}

async function decorateStep() {
  document.body.classList.add('step');
  classify('main>div:first-of-type', 'content');
  classify('main>div:nth-of-type(2)', 'learn');
  classify('main>div:nth-of-type(3)', 'learn-in-illustrator');
  classify('main>div:nth-of-type(4)', 'learn-in-photoshop');
  classify('main>div:nth-of-type(5)', 'head-back');
  classify('main>div:nth-of-type(6)', 'next-steps');

  const $content = document.querySelector('.content');
  const $learn = document.querySelector('.learn');
  const $learnStepOne = document.querySelector('.learn-in-illustrator');
  const $learnStepTwo = document.querySelector('.learn-in-photoshop');
  const $headBack = document.querySelector('.head-back');
  const $nextSteps = document.querySelector('.next-steps');

  const $video = createTag('div', { class: 'video-wrapper' });
  $content.appendChild($video);

  const stepIndex = (+window.location.search.substring(1).split('&')[0]) - 1;
  const steps = await fetchSteps();

  const currentStep = steps[stepIndex];
  const hasSingleThumbnail = currentStep.has_single_gallery_image;

  // fill content section

  const $h1 = document.querySelector('main .content>h1');
  let title = currentStep.Title;
  if (currentStep.Heading) title = currentStep.Heading;
  title = title.replace('\n', '<br>');
  $h1.innerHTML = title;
  const iconParent = document.createElement('div');
  iconParent.setAttribute('class', 'icons_parent');
  if (hasSingleThumbnail) {
    iconParent.innerHTML = `
      <div class="icons_parent__item large"><img src="../../../../static/twp3/icons/${currentStep.has_single_gallery_image.toLowerCase()}.svg"></div>
      `;
  } else {
    iconParent.innerHTML = `
        <div class="icons_parent__item"><img src="../../../../icons/${currentStep.Product_icon_1.toLowerCase()}.svg"></div>
        <div class="icons_parent__item"><img src="../../../../icons/${currentStep.Product_icon_2.toLowerCase()}.svg"></div>`;
  }

  $h1.id = '';

  document.querySelector('main .content').prepend(iconParent);

  document.title = currentStep.Title;
  if (currentStep['Practice File']) {
    document.querySelector('main .content>p>a').setAttribute('href', currentStep['Practice File']);
  }
  const allCtas = document.querySelectorAll('main .content>p>a');
  if (allCtas.length >= 2) {
    if (currentStep.Next_file) {
      document.querySelector('main .content>p>a:nth-of-type(2)').setAttribute('href', currentStep.Next_file);
      document.querySelector('main .content>p>a:nth-of-type(2)').classList.add('secondary');
    } else {
      document.querySelector('main .content>p>a:nth-of-type(2)').remove();
    }
  }

  if (currentStep.Video.startsWith('https://images-tv.adobe.com')) {
    $video.innerHTML = `<div class="video"><div id="placeholder" class="button">
        <svg xmlns="http://www.w3.org/2000/svg" width="731" height="731" viewBox="0 0 731 731">
            <g id="Group_23" data-name="Group 23" transform="translate(-551 -551)">
                <circle id="Ellipse_14" data-name="Ellipse 14" cx="365.5" cy="365.5" r="365.5" transform="translate(551 551)" fill="#1473e6"/>
                <path id="Polygon_3" data-name="Polygon 3" d="M87.5,0,175,152H0Z" transform="translate(992.5 829.5) rotate(90)" fill="#fff"/>
            </g>
        </svg>
        </div>
        <video id='video' class="hidden" preload="metadata" src="${currentStep.Video}" tabindex="0">
        <source src="${currentStep.Video}" type="video/mpeg4">
        </video></div>`;
    $video.firstChild.style.backgroundImage = `url(${currentStep.Thumbnail})`;
    $video.firstChild.addEventListener('click', () => playVideo());

    if ($content.querySelector('a').getAttribute('href') === '#0') {
      $content.querySelector('a').addEventListener('click', (event) => {
        event.preventDefault();
        window.scrollTo(0, document.querySelector('.video-wrapper').offsetTop);
        playVideo();
      });
    }
  }

  if (currentStep.Video.startsWith('https://www.youtube.com/')) {
    const yturl = new URL(currentStep.Video);
    const vid = yturl.searchParams.get('v');
    $video.innerHTML = `<div style="left: 0; width: 100%; height: 0; position: relative; padding-bottom: 56.25%;"><iframe src="https://www.youtube.com/embed/${vid}?rel=0" style="border: 0; top: 0; left: 0; width: 100%; height: 100%; position: absolute;" allowfullscreen scrolling="no" allow="encrypted-media; accelerometer; gyroscope; picture-in-picture"></iframe></div>`;
  }

  // replace this with real checker
  const hasTutorials = currentStep.Tutorial_must_haves;
  const hasTutorialsOne = currentStep.Tutorial_type_one;
  const hasTutorialsTwo = currentStep.Tutorial_type_two;
  let tutorials = '';

  if (hasTutorialsOne) {
    tutorials += `
            <div class="tutorial__item">
                <div class="tutorial__icon">
                    <img src="../../../../icons/${currentStep.Tutorial_type_one.toLowerCase()}.svg">
                </div>
                <div class="tutorial__info">
                    <p>${currentStep.Tutorial_download_title_one}</p>
                    <a href="${currentStep.Tutorial_button_link_one}" target="_blank" class="cta">${currentStep.Tutorial_button_text_one}</a>
                </div>
            </div>

        `;
  }

  if (hasTutorialsTwo) {
    tutorials += `
            <div class="tutorial__item">
                <div class="tutorial__icon">
                    <img src="../../../../icons/${currentStep.Tutorial_type_two.toLowerCase()}.svg">
                </div>
                <div class="tutorial__info">
                    <p>${currentStep.Tutorial_download_title_two}</p>
                    <a href="${currentStep.Tutorial_button_link_two}" target="_blank" class="cta">${currentStep.Tutorial_button_text_two}</a>
                </div>
            </div>

        `;
  }

  if (hasTutorials) {
    $learn.innerHTML = `
        <div class="container">
            <h2>${currentStep.Tutorial_must_haves}</h2>
            <p>${currentStep.Tutorial_must_haves_copy}</p>
            <div class="tutorial">${tutorials}</div>
        </div>
    `;
  } else {
    $learn.remove();
  }

  function cleanUpIcons($string) {
    const lineItems = $string.split('\n');
    let li = '';
    lineItems.forEach((lineItem) => {
      const icon = `../../../../static/twp3/icons/${lineItem.split('-')[0].trim()}.svg`;
      li += `
                <li class="icon-list__set">
                    <span><img src="${icon}"></span>
                    <span>${lineItem.split('-')[1]}</span>
                </li>
            
            `;
    });
    return li;
  }

  if (currentStep.Icon_row_title_one) {
    $learnStepOne.innerHTML = `
            <div class="container">
                <h2><img class="title_icon" src="../../../../icons/${currentStep.Tutorial_type_one.toLowerCase()}.svg">${currentStep.Icon_row_title_one}</h2>
                <ul class="icon-list">
                    ${cleanUpIcons(currentStep.Icon_row_one)}
                </ul>
            </div>
        
        `;
  } else { $learnStepOne.remove(); }

  if (currentStep.Icon_row_title_two) {
    $learnStepTwo.innerHTML = `
            <div class="container">
                <h2><img class="title_icon" src="../../../../icons/${currentStep.Tutorial_type_two.toLowerCase()}.svg">${currentStep.Icon_row_title_two}</h2>
                <ul class="icon-list">
                    ${cleanUpIcons(currentStep.Icon_row_two)}
                </ul>
            </div>
        
        `;
  } else { $learnStepTwo.remove(); }

  if (currentStep.Icon_row_title_three) {
    $headBack.innerHTML = `
            <div class="container">
                <h2><img class="title_icon" src="../../../../icons/${currentStep.Tutorial_type_one.toLowerCase()}.svg">${currentStep.Icon_row_title_three}</h2>
                <ul class="icon-list">
                    ${cleanUpIcons(currentStep.Icon_row_three)}
                </ul>
            </div>
        
        `;
  } else {
    $headBack.remove();
  }

  const nextStepRow = document.createElement('div');
  nextStepRow.className = 'container lg';
  let nextStep = '';
  let counter = 0;

  const seeAllTutorials = $nextSteps.querySelector('a');
  seeAllTutorials.parentNode.remove();
  seeAllTutorials.className = 'see-all-cta';

  if (stepIndex >= 1) {
    nextStep += `
            <a href="step?${stepIndex}" class="next">
                <img src="${steps[stepIndex - 1].Thumbnail}">
                <div>
                    <h3>${steps[stepIndex - 1].Title}</h3>
                    <p>${steps[stepIndex - 1].Description}</p>
                </div>
            </a>
        `;
    counter += 1;
  }
  if (stepIndex + 1 < steps.length) {
    nextStep += `
            <a href="step?${stepIndex + 2}" class="next">
                <img src="${steps[stepIndex + 1].Thumbnail}">
                <div>
                    <h3>${steps[stepIndex + 1].Title}</h3>
                    <p>${steps[stepIndex + 1].Description}</p>
                </div>
            </a>
        `;
    counter += 1;
  }

  nextStepRow.innerHTML = nextStep;

  $nextSteps.append(nextStepRow);
  $nextSteps.append(seeAllTutorials);
  if (counter <= 1) $nextSteps.classList.add('has-one');
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

window.addEventListener('resize', debounce(() => {
  // run resize events
  cardHeightEqualizer('.card-content');
}, 250));

async function decoratePage() {
  addDefaultClass('main>div');

  await loadLocalHeader();

  externalLinks('header');
  externalLinks('footer');
  wrapSections('header>div');
  // nav style/dropdown
  addNavCarrot();

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
  }

  window.pages.decorated = true;
  appearMain();
  cardHeightEqualizer('.card-content');
}

if (document.readyState === 'loading') {
  window.addEventListener('DOMContentLoaded', decoratePage);
} else {
  decoratePage();
}
