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
//   appearMain,
//   createTag,
//   debounce,
//   loadCSS,
//   loadJSModule,
//   loadLocalHeader,
//   toClassName,
// } from '../../scripts.js';
/* global appearMain, createTag, debounce, loadCSS, loadJSModule, loadLocalHeader, toClassName */

function styleNav() {
  const parent = document.querySelector('header');
  const $appIcon = parent.querySelector('img');
  if (!$appIcon) return;
  const appIcon = $appIcon.src;
  const appName = parent.querySelector('a').innerHTML;
  const appNameLink = parent.querySelector('a').getAttribute('href');
  const listItems = parent.querySelectorAll('ul li');
  let nav = '';
  let carrot = '';

  if (listItems) {
    if (listItems.length >= 1) {
      nav = parent.querySelector('ul').outerHTML;
      carrot = `
        <div class="menu-carrot">
          <img src='/icons/carrot.svg'>
        </div>
      `;
    }
  }

  parent.innerHTML = `
    <div class="section-wrapper">
      <div class="nav">
        <div class="nav__section">
          <div class="app-name-and-icon">
            <div class="app-icon mobile"><img src="${appIcon}" alt="${appName}"></div>
            <div class="app-icon desktop">
              <a href="${appNameLink}" target="_blank">
                <img src="${appIcon}" alt="${appName}">
              </a>
            </div>
            <div class="app-name mobile">
              ${appName}
            </div>
            <div class="app-name desktop">
              <a href="${appNameLink}" target="_blank">${appName}</a>
            </div>
            ${carrot}
          </div>
        </div> 
        <nav>
          ${nav}
        </nav>
      </div>
    </div>
  `;

  if (document.querySelector('.nav-container')) {
    const $nav = document.querySelector('.nav-container');
    if ($nav.querySelector('div').children.length === 0) {
      $nav.remove();
    }
  }
}

function setExternalLinks() {
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

function equalizer($element) {
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

function setWidths() {
  const sections = document.querySelectorAll('main .section-wrapper >div');
  sections.forEach((section) => {
    const children = section.childNodes;
    children.forEach((child) => {
      if (child.innerHTML != null) {
        if (child.innerHTML.includes('[!')) {
          const width = child.innerHTML.split('[!')[1].split(']')[0];
          const cleanUpText = child.innerHTML.split('[!')[0];
          child.innerHTML = cleanUpText;
          child.style.maxWidth = `${width}px`;
          child.style.marginLeft = 'auto';
          child.style.marginRight = 'auto';
        }
      }
    });
  });
}

function decorateHero() {
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

function decorateNextStep() {
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

function mobileDropDown() {
  // event.preventDefault();
  const body = document.getElementsByTagName('body')[0];
  if (!body.classList.contains('nav-showing')) {
    body.classList.add('nav-showing');
  } else {
    body.classList.remove('nav-showing');
  }
}

function decorateEmbeds() {
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

function linkInNewTab($el) {
  const links = $el.querySelectorAll('a');
  links.forEach(($link) => {
    $link.setAttribute('target', '_blank');
  });
}

function tableToDivs($table, cols) {
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

function decorateTables() {
  document.querySelectorAll('main div>table').forEach(($table) => {
    const $cols = $table.querySelectorAll('thead tr th');
    const cols = Array.from($cols).map((e) => toClassName(e.innerHTML)).filter((e) => (!!e));
    // const $rows = $table.querySelectorAll('tbody tr');
    let $div = {};

    $div = tableToDivs($table, cols);
    $table.parentNode.replaceChild($div, $table);
  });
}

function readBlockConfig($block) {
  const config = {};
  $block.querySelectorAll(':scope>div').forEach(($row) => {
    if ($row.children && $row.children[1]) {
      const name = toClassName($row.children[0].textContent);
      const $a = $row.children[1].querySelector('a');
      let value = '';
      if ($a) value = $a.href;
      else value = $row.children[1].textContent;
      config[name] = value;
    }
  });
  return config;
}

function decorateBackgroundImageBlocks() {
  document.querySelectorAll('main div.background-image').forEach(($bgImgDiv) => {
    const $images = $bgImgDiv.querySelectorAll('img');
    const $lastImage = $images[$images.length - 1];

    const $section = $bgImgDiv.closest('.section-wrapper');
    if ($section && $lastImage) {
      $section.style.backgroundImage = `url(${$lastImage.src})`;
      let $caption = $lastImage.nextElementSibling;
      if ($caption) {
        if ($caption.textContent === '') $caption = $caption.nextElementSibling;
        if ($caption) $caption.classList.add('background-image-caption');
      }
      $lastImage.remove();
    }
  });
}

async function decorateNav() {
  await loadLocalHeader();
  styleNav();
  if (document.querySelector('.nav')) {
    document.querySelector('.app-name-and-icon').addEventListener('click', mobileDropDown);
  }
  document.querySelector('header').classList.add('appear');
  loadCSS('/styles/blocks/nav.css');
}

async function decorateBlocks() {
  document.querySelectorAll('main>div.section-wrapper>div>div').forEach(($block) => {
    const { length } = $block.classList;
    if (length === 1) {
      const classes = $block.className.split('-');
      const classHelpers = $block.className.split('-');
      classHelpers.shift();

      $block.closest('.section-wrapper').classList.add(`${classes[0]}-container`);
      $block.closest('.section-wrapper').classList.add(...classHelpers);
      $block.classList.add(...classes);

      if (classes.includes('nav')) {
        $block.classList.add('header-block');
      }

      if (classes.includes('form')) {
        const config = readBlockConfig($block);

        window.formConfig = {
          sheet: config['form-data-submission'],
          redirect: config['form-redirect'] ? config['form-redirect'] : 'thank-you',
          definition: config['form-definition'],
        };

        const tag = document.createElement('script');
        tag.src = '/templates/default/create-form.js';
        document.getElementsByTagName('body')[0].appendChild(tag);
      }

      if (classes.includes('checklist')) {
        loadJSModule('/templates/default/checklist.js');
        document.getElementsByTagName('body')[0].classList.add('checklist-page');
      }

      if (classes.includes('iframe') || classes.includes('missiontimeline') || classes.includes('missionbg')) {
        loadJSModule('/templates/default/mission-series/iframe.js');
        loadJSModule('/templates/default/mission-series/background.js');
      }

      if (classes.includes('list')) {
        loadJSModule('/templates/default/render_spectrum_icons.js');
      }

      loadCSS(`/styles/blocks/${classes[0]}.css`);
    }

    if (length === 2) {
      loadCSS(`/styles/blocks/${$block.classList.item(0)}.css`);
    }
  });
}

function decorateButtons() {
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

function wrapSections(element) {
  document.querySelectorAll(element).forEach(($div) => {
    const $wrapper = createTag('div', { class: 'section-wrapper' });
    $div.parentNode.appendChild($wrapper);
    $wrapper.appendChild($div);
  });
}

function decorateVideoBlocks() {
  document.querySelectorAll('main .video a[href]').forEach(($a) => {
    const videoLink = $a.href;
    let $video = $a;
    if (videoLink.includes('tv.adobe.com')) {
      $video = createTag('iframe', { src: videoLink, class: 'embed tv-adobe' });
    }
    $a.parentElement.replaceChild($video, $a);
  });
}

function decorateLinkTexting() {
  const $linktexting = document.querySelector('main div.linktexting');
  if ($linktexting) {
    const $id = $linktexting.children[0].children[1].textContent;
    // const $main = document.querySelector('main');
    document.querySelectorAll('main p').forEach(($p) => {
      if ($p.textContent.includes('<linktexting>')) {
        // let $p=$p.parentElement;
        const $widget = createTag('div', { id: 'linktexting-holder' });
        $p.parentElement.replaceChild($widget, $p);

        const parent = document.getElementById('linktexting-holder');

        parent.innerHTML = `
        <div class="promptWrapper">
          <div class="linkTextingWidgetWrapper" style="">
            <div class="linkTextingWidget" style="">
              <div class="promptContent" style=""></div>
              <div class="linkTextingInner">
                <input type="hidden" class="linkID" value="${$id}">
                  <div class="linkTextingInputWrapper">
                    <input class="linkTextingInput linkTextingInputFlagAdjust" type="tel" id="numberToText_linkTexting">
                  </div>
                  <button class="linkTextingButton localized-button localized-text-text_me_a_link" type="button" id="sendButton_linkTexting" style="background-color: #1473E6;color : #ffffff">Text me a link</button>
                  <div class="linkTextingError" id="linkTextingError" style="display:none;"></div>
              </div>
            </div>
          </div>
        </div>
        `;

        const $newHeadJS1 = createTag('script', { type: 'text/javascript' });
        $newHeadJS1.innerHTML = `
  /* Default Country Off, if set to false will use linkTextingDefaultCountry to decide default country, otherwise will determine the visiting user's country via their location */
  var linkTextingDefaultCountryOff = true;
  /* All Country data is lowercase ISO2 standard http://en.wikipedia.org/wiki/ISO_3166-1_alpha-2 */
  /* Default Country, if set to "auto" will determine the visiting user's country via their location */
  var linkTextingDefaultCountry = "us";
  /* If using automatic country detection with https or over 1,000 visits/day go to http://ipinfo.io, get a token, and place it here */
  var linkTextingIpinfoToken = "";
  /* Preferred Countries in Dropdown */
  var linkTextingPreferredCountries = ["us","ca"];
  /* Countries available in dropdown */
  var linkTextingOnlyCountries = ["af","al","dz","as","ad","ao","ai","ag","ar","am","aw","au","at","az","bs","bh","bd","bb","by","be","bz","bj","bm","bt","bo","ba","bw","br","io","vg","bn","bg","bf","bi","kh","cm","ca","cv","bq","ky","cf","td","cl","cn","co","km","cd","cg","ck","cr","ci","hr","cu","cw","cy","cz","dk","dj","dm","do","ec","eg","sv","gq","er","ee","et","fk","fo","fj","fi","fr","gf","pf","ga","gm","ge","de","gh","gi","gr","gl","gd","gp","gu","gt","gn","gw","gy","ht","hn","hk","hu","is","in","id","ir","iq","ie","il","it","jm","jp","jo","kz","ke","ki","kw","kg","la","lv","lb","ls","lr","ly","li","lt","lu","mo","mk","mg","mw","my","mv","ml","mt","mh","mq","mr","mu","mx","fm","md","mc","mn","me","ms","ma","mz","mm","na","nr","np","nl","nc","nz","ni","ne","ng","nu","nf","kp","mp","no","om","pk","pw","ps","pa","pg","py","pe","ph","pl","pt","pr","qa","re","ro","ru","rw","bl","sh","kn","lc","mf","pm","vc","ws","sm","st","sa","sn","rs","sc","sl","sg","sx","sk","si","sb","so","za","kr","ss","es","lk","sd","sr","sz","se","ch","sy","tw","tj","tz","th","tl","tg","tk","to","tt","tn","tr","tm","tc","tv","vi","ug","ua","ae","gb","us","uy","uz","vu","va","ve","vn","wf","ye","zm","zw"];
  `;

        const $newHeadJS2 = createTag('script', { type: 'text/javascript', src: '//s3.amazonaws.com/linktexting-cdn/1.7/js/link_texting_gz.min.js' });

        document.head.appendChild($newHeadJS1);
        document.head.appendChild($newHeadJS2);
      }
    });

    $linktexting.remove();
  }
}

async function decoratePage() {
  decorateTables();
  wrapSections('main>div');
  decorateBlocks();

  if (document.querySelector('.hero-container')) {
    decorateHero();
  }

  if (document.querySelector('.next')) {
    decorateNextStep();
  }

  decorateNav();

  decorateBackgroundImageBlocks();
  decorateVideoBlocks();

  decorateButtons();
  setExternalLinks();
  decorateLinkTexting();

  window.pages.decorated = true;
  appearMain();
  decorateEmbeds();
  wrapSections('header>div, footer>div');
  window.addEventListener('load', () => {
    setTimeout(() => {
      if (document.querySelector('.callout-container')) {
        equalizer('.eq');
      }
    }, 1000);
  });

  const runResizerFunctions = debounce(() => {
    if (document.querySelector('.callout-container')) {
      equalizer('.eq');
    }
  }, 250);

  window.addEventListener('resize', runResizerFunctions);
  window.addEventListener('load', () => {
    if (document.querySelector('.eq')) {
      document.querySelectorAll('.eq').forEach(($element) => {
        linkInNewTab($element);
      });
    }
  });
  setWidths();
}

window.addEventListener('load', () => document.body.classList.add('loaded'));

if (document.readyState === 'loading') {
  window.addEventListener('DOMContentLoaded', decoratePage);
} else {
  decoratePage();
}
