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

/* eslint-disable import/no-cycle */

import {
  createTag,
  // loadCSS,
  // loadLocalHeader,
  toClassName,
} from './scripts.js';

const createVideoMarkUp = (videoUrl) => (
  `
  <video preload="metadata" src="${videoUrl}" controls="true">
    <source src="${videoUrl}" type="video/mpeg4>
  </video> 
  `
);

export function contentAsset() {
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
}

// function getImageName(appName) {
//   let iconName = '';
//   if (appName.toLowerCase().includes('adobe')) {
//     iconName = appName.toLowerCase().split('adobe')[1];
//   } else {
//     iconName = appName.toLowerCase();
//   }
//   return `/icons/${iconName.split(' ').join('')}`;
// }

// export function styleNav() {
//   const parent = document.querySelector('header');
//   const $appIcon = parent.querySelector('img');
//   if (!$appIcon) return;
//   const appIcon = $appIcon.src;
//   const appName = parent.querySelector('a').innerHTML;
//   const appNameLink = parent.querySelector('a').getAttribute('href');
//   const listItems = parent.querySelectorAll('ul li');
//   let nav = '';
//   let carrot = '';

//   if (listItems) {
//     if (listItems.length >= 1) {
//       nav = parent.querySelector('ul').outerHTML;
//       carrot = `
//         <div class="menu-carrot">
//           <img src='/icons/carrot.svg'>
//         </div>
//       `;
//     }
//   }

//   parent.innerHTML = `
//     <div class="section-wrapper">
//       <div class="nav">
//         <div class="nav__section">
//           <div class="app-name-and-icon">
//             <div class="app-icon mobile"><img src="${appIcon}" alt="${appName}"></div>
//             <div class="app-icon desktop">
//               <a href="${appNameLink}" target="_blank">
//                 <img src="${getImageName(appName)}.svg" alt="${appName}">
//               </a>
//             </div>
//             <div class="app-name mobile">
//               ${appName}
//             </div>
//             <div class="app-name desktop">
//               <a href="${appNameLink}" target="_blank">${appName}</a>
//             </div>
//             ${carrot}
//           </div>
//         </div>
//         <nav>
//           ${nav}
//         </nav>
//       </div>
//     </div>
//   `;

//   if (document.querySelector('.nav-container')) {
//     const $nav = document.querySelector('.nav-container');
//     if ($nav.querySelector('div').children.length === 0) {
//       $nav.remove();
//     }
//   }
// }

export function setExternalLinks() {
  if (!document.querySelectorAll('main a')) return;
  const links = document.querySelectorAll('main a');
  links.forEach(($a) => {
    const hasExternalLink = $a.innerText.includes('[!]');
    if (hasExternalLink) {
      $a.innerText = $a.innerText.split('[!]')[0];
      $a.setAttribute('target', '_blank');
    }
  });
}

export function equalizer($element) {
  if (document.querySelector($element)) {
    if (document.querySelectorAll($element)[0].className.includes('callout')) {
      const callOutParents = document.querySelectorAll('.callout-container');
      callOutParents.forEach(($callouts) => {
        let titleHeight = 0;
        let copyHeight = 0;
        const $cardItems = $callouts.querySelectorAll('.callout > div div:last-of-type');

        // reset applied on resizing
        $cardItems.forEach(($row) => {
          const title = $row.querySelector('h3');
          const copy = $row.querySelector('p:first-of-type');
          title.style.height = '';
          copy.style.height = '';
        });

        // collects tallest heights of elements per row
        $cardItems.forEach((item) => {
          const title = item.querySelector('h3');
          const copy = item.querySelector('p:first-of-type');

          if (title.offsetHeight > titleHeight) {
            titleHeight = title.offsetHeight;
          }

          if (copy.offsetHeight >= copyHeight) {
            copyHeight = copy.offsetHeight;
          }
        });

        // Applies styles to each row (tallest title and copy)
        $cardItems.forEach(($row) => {
          const title = $row.querySelector('h3');
          const copy = $row.querySelector('p:first-of-type');

          title.style.height = `${titleHeight}px`;
          copy.style.height = `${copyHeight}px`;
        });
      });
    }
  }
}

export function decorateHero() {
  const heroRoot = document.querySelector('.hero > div');
  const heroParent = document.querySelector('.hero-container');
  const heroContent = heroRoot.querySelector('div:nth-child(2)').innerHTML;
  const videoEmbed = heroRoot.querySelector('div:first-of-type a').getAttribute('href');
  let videoPlaying = false;
  const videoPlaceholder = heroRoot.querySelector('div:first-of-type img').getAttribute('src');
  let videoBackgroundElement = '';

  if (heroRoot.childNodes.length === 3) {
    videoBackgroundElement = heroRoot.querySelector('div:nth-child(3) img').getAttribute('src');
  }

  heroParent.innerHTML = '';

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

export function decorateNextStep() {
  const root = document.querySelector('.next');
  const link = root.querySelector('div:first-of-type a').getAttribute('href');
  const thumbnail = root.querySelector('div:first-of-type img').getAttribute('src');
  const content = root.querySelector('div:nth-child(2)').innerHTML;
  const background = root.querySelector('div:nth-child(3) img').getAttribute('src');

  root.innerHTML = '';

  root.innerHTML = `
    <a href="${link}" class="next-element-container">
      <div class="next-bg-element" style="background-image: url(${background});">
        <div class="next-img-element" style="background-image: url(${thumbnail});">

        </div>
      </div>
      <div class="next-content">
        ${content}
      </div>
    </a>
  `;
}

// export function mobileDropDown() {
//   // event.preventDefault();
//   const body = document.getElementsByTagName('body')[0];
//   if (!body.classList.contains('nav-showing')) {
//     body.classList.add('nav-showing');
//   } else {
//     body.classList.remove('nav-showing');
//   }
// }

export function decorateEmbeds() {
  document.querySelectorAll('a[href]').forEach(($a) => {
    if ($a.textContent.startsWith('https://')) {
      const url = new URL($a.href);
      const usp = new URLSearchParams(url.search);
      let embedHTML = '';
      let type = '';

      if ($a.href.startsWith('https://www.youtube.com/watch') || $a.href.startsWith('https://youtu.be/')) {
        let vid = usp.get('v');
        if (url.host === 'youtu.be') vid = url.pathname.substr(1);

        type = 'youtube';
        embedHTML = `<div style="left: 0; width: 100%; height: 0; position: relative; padding-bottom: 56.25%;">
          <iframe src="https://www.youtube.com/embed/${vid}?rel=0&amp;v=${vid}" style="border: 0; top: 0; left: 0; width: 100%; height: 100%; position: absolute;" allowfullscreen="" scrolling="no" allow="encrypted-media; accelerometer; gyroscope; picture-in-picture" title="content from youtube" loading="lazy"></iframe>
          </div>
        `;
      }

      if (type) {
        const $embed = createTag('div', { class: `embed embed-oembed embed-${type}` });
        const $div = $a.closest('div');
        $embed.innerHTML = embedHTML;
        $div.parentElement.replaceChild($embed, $div);
      }
    }
  });
}

export function linkInNewTab($el) {
  const links = $el.querySelectorAll('a');
  links.forEach(($link) => {
    $link.setAttribute('target', '_blank');
  });
}

export function tableToDivs($table, cols) {
  const $rows = $table.querySelectorAll('tbody tr');
  const $cards = createTag('div', { class: `${cols.join('-')}` });
  $rows.forEach(($tr) => {
    const $card = createTag('div');
    $tr.querySelectorAll('td').forEach(($td, i) => {
      const $div = createTag('div', cols.length > 1 ? { class: cols[i] } : {});
      $div.innerHTML = $td.innerHTML;
      $card.append($div);
    });
    $cards.append($card);
  });
  return ($cards);
}

export function decorateTables() {
  document.querySelectorAll('main div>table').forEach(($table) => {
    const $cols = $table.querySelectorAll('thead tr th');
    const cols = Array.from($cols).map((e) => toClassName(e.innerHTML)).filter((e) => (!!e));
    // const $rows = $table.querySelectorAll('tbody tr');
    let $div = {};

    $div = tableToDivs($table, cols);
    $table.parentNode.replaceChild($div, $table);
  });
}

// function readBlockConfig($block) {
//   const config = {};
//   $block.querySelectorAll(':scope>div').forEach(($row) => {
//     if ($row.children && $row.children[1]) {
//       const name = toClassName($row.children[0].textContent);
//       const $a = $row.children[1].querySelector('a');
//       let value = '';
//       if ($a) value = $a.href;
//       else value = $row.children[1].textContent;
//       config[name] = value;
//     }
//   });
//   return config;
// }

// export function decorateBackgroundImageBlocks() {
//   document.querySelectorAll('main div.background-image').forEach(($bgImgDiv) => {
//     const $images = $bgImgDiv.querySelectorAll('img');
//     const $lastImage = $images[$images.length - 1];

//     const $section = $bgImgDiv.closest('.section-wrapper');
//     if ($section && $lastImage) {
//       $section.style.backgroundImage = `url(${$lastImage.src})`;
//       let $caption = $lastImage.nextElementSibling;
//       if ($caption) {
//         if ($caption.textContent === '') $caption = $caption.nextElementSibling;
//         if ($caption) $caption.classList.add('background-image-caption');
//       }
//       $lastImage.remove();
//     }
//   });
// }

// export async function decorateNav() {
//   await loadLocalHeader();
//   styleNav();
//   const navEl = document.querySelector('.nav');
//   if (navEl) {
//     const iconEl = document.querySelector('.app-name-and-icon');
//     if (iconEl) {
//       iconEl.addEventListener('click', mobileDropDown);
//     }
//   }
//   document.querySelector('header').classList.add('appear');
//   loadCSS('/pages/blocks/nav/nav.css');
// }

export function decorateButtons() {
  document.querySelectorAll('main a').forEach(($a) => {
    const $up = $a.parentElement;
    const $twoup = $a.parentElement.parentElement;
    if ($up.childNodes.length === 1 && $up.tagName.toUpperCase() === 'P') {
      $a.className = 'button secondary';
    }
    if ($up.childNodes.length === 1 && $up.tagName.toUpperCase() === 'STRONG'
      && $twoup.childNodes.length === 1 && $twoup.tagName.toUpperCase() === 'P') {
      $a.className = 'button primary';
    }
  });
}

export function wrapSections(element) {
  document.querySelectorAll(element).forEach(($div) => {
    const $wrapper = createTag('div', { class: 'section-wrapper' });
    $div.parentNode.appendChild($wrapper);
    $wrapper.appendChild($div);
  });
}

export function decorateVideoBlocks() {
  document.querySelectorAll('main .video a[href]').forEach(($a) => {
    const videoLink = $a.href;
    let $video = $a;
    if (videoLink.includes('tv.adobe.com')) {
      $video = createTag('iframe', { src: videoLink, class: 'embed tv-adobe' });
    }
    $a.parentElement.replaceChild($video, $a);
  });
}
