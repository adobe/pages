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
//   insertLocalResource,
//   toClassName,
// } from '../../scripts.js';
/* global appearMain, createTag, insertLocalResource, toClassName */

async function loadLocalHeader() {
  const $inlineHeader = document.querySelector('main div.header-block');
  if ($inlineHeader) {
    const $header = document.querySelector('header');
    $inlineHeader.childNodes.forEach((e, i) => {
      if (e.nodeName.toLowerCase() === '#text' && !i) {
        const $p = createTag('p');
        const inner = `<img class="icon icon-${window.pages.product}" src="/icons/${window.pages.product}.svg">${e.nodeValue}`;
        $p.innerHTML = inner;
        e.parentNode.replaceChild($p, e);
      }
      if (e.nodeName.toLowerCase() === 'p' && !i) {
        const inner = `<img class="icon icon-${window.pages.product}" src="/icons/${window.pages.product}.svg">${e.innerHTML}`;
        e.innerHTML = inner;
      }
    });
    $header.innerHTML = `<div>${$inlineHeader.innerHTML}</div>`;
    $inlineHeader.remove();
    document.querySelector('header').classList.add('appear');
  } else {
    await insertLocalResource('header');
  }
}

function wrapSections(element) {
  document.querySelectorAll(element).forEach(($div) => {
    const $wrapper = createTag('div', { class: 'section-wrapper' });
    $div.parentNode.appendChild($wrapper);
    $wrapper.appendChild($div);
  });
}

function decorateHeroSection() {
  const $firstSectionImage = document.querySelector('main div.section-wrapper>div>p img');
  if ($firstSectionImage) {
    const $section = $firstSectionImage.closest('.section-wrapper');
    $section.classList.add('full-width');
    const $div = $firstSectionImage.closest('div');
    $section.classList.add('hero-section', 'white-text');
    $div.classList.add('text');
    if ($div.children[1].children[0].tagName.toUpperCase() === 'IMG') {
      $div.classList.add('image');
    } else {
      const $imgWrapper = createTag('div', { class: 'image' });
      $section.append($imgWrapper);
      const $p = $firstSectionImage.parentNode.nextElementSibling;
      $imgWrapper.append($firstSectionImage.parentNode);
      $imgWrapper.append($p);
    }
  }
}

function decorateFaq() {
  const $faq = document.querySelector('main .faq');
  if ($faq) {
    $faq.closest('.section-wrapper').classList.add('faq-container');
    Array.from($faq.children).forEach(($row) => {
      const $question = $row.children[0];
      const $answer = $row.children[1];

      $question.classList.add('question');
      $answer.classList.add('answer');

      $question.addEventListener('click', () => {
        $row.classList.toggle('show');
      });
    });
  }
}

function decorateColors() {
  const $colors = document.querySelector('main .colors div div');
  if ($colors) {
    const colors = Array.from($colors.children).map((e) => e.textContent);
    const $heroSection = document.querySelector('main .hero-section');
    if ($heroSection && colors.length) {
      const heroColor = colors.shift();
      $heroSection.style.backgroundColor = heroColor;
    }
    document.querySelectorAll('main .columns>div').forEach(($row, i) => {
      if (colors[i]) {
        const line = colors[i];
        const splits = line.split(',');
        const color = splits[0].trim();
        $row.style.backgroundColor = color;
        const lightness = (
          parseInt(color.substr(1, 2), 16)
          + parseInt(color.substr(3, 2), 16)
          + parseInt(color.substr(5, 2), 16)) / 3;
        if (lightness < 200) $row.classList.add('white-text');
        if (splits[1]) $row.classList.add(splits[1].trim());
      }
    });
  }
}

function decorateGrid() {
  document.querySelectorAll('main div>.grid').forEach(($grid) => {
    $grid.closest('.section-wrapper').classList.add('full-width');

    const rows = Array.from($grid.children);
    rows.forEach(($row) => {
      const cells = Array.from($row.children);
      cells[0].classList.add('image');
      cells[1].classList.add('text');
      cells[1].style.backgroundColor = `${cells[2].textContent}80`;
      cells[2].remove();
      const $a = cells[1].querySelector('a');
      if ($a) {
        const linkTarget = $a.href;
        $row.addEventListener('click', () => {
          window.location.href = linkTarget;
        });
      }
    });
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

function decorateColumns() {
  const isIndex = window.location.pathname.endsWith('/');
  document.querySelectorAll('main div>.columns').forEach(($columns) => {
    if (!isIndex) {
      $columns.classList.add('left-justify');
    }
    $columns.closest('.section-wrapper').classList.add('full-width');
    const rows = Array.from($columns.children);
    rows.forEach(($row) => {
      const cells = Array.from($row.children);
      cells.forEach(($cell, i, arr) => {
        const $img = $cell.querySelector('img');
        if ($img) {
          $cell.classList.add('image');
          if (!$img.getAttribute('alt', '')) {
            $img.setAttribute('alt', '');
          }
          const $p = $img.closest('p');
          if ($p) $p.classList.add('image-bleed');
          const $nextP = $p.nextElementSibling;
          if ($nextP && $nextP.tagName === 'P') {
            $nextP.classList.add('caption');
          }
        } else {
          $cell.classList.add('text');
          if ($cell.textContent === '') {
            $cell.remove();
            arr[i - 1].classList.add('merged');
          }
        }
      });
    });
  });
}

function decorateOverlay() {
  document.querySelectorAll('main div>.overlay').forEach(($overlay) => {
    $overlay.closest('.section-wrapper').classList.add('full-width');
  });
}

function decorateParallax() {
  document.querySelectorAll('main div>.parallax').forEach(($parallax) => {
    $parallax.closest('.section-wrapper').classList.add('full-width');
    Array.from($parallax.children).forEach(($layer) => {
      $parallax.prepend($layer);
    });
    document.addEventListener('scroll', () => {
      const clientRect = $parallax.getBoundingClientRect();
      if (clientRect.y < window.innerHeight && clientRect.bottom > 0) {
        const maxExtent = window.innerHeight + clientRect.height;
        const offsetRatio = ((maxExtent) - (window.innerHeight - clientRect.y)) / maxExtent;
        Array.from($parallax.children).forEach(($layer, i, arr) => {
          const translateY = ((arr.length - 1 - i) * clientRect.height) / (4 * offsetRatio);
          if (translateY) {
            $layer.style.transform = `translate(0px,${translateY - 0}px)`;
          }
        });
      }
    });
  });
}

function decorateInternalAdvocates() {
  document.querySelectorAll('main div>.embed-internal-advocates').forEach(($embed) => {
    $embed.innerHTML = $embed.innerHTML.replace('Adobe Stock Advocates', '<img src="/templates/stock-advocates/stock-advocates-purple.svg" class="stock-advocates" alt="Adobe Stock Advocates. Be seen. Be heard. Be you.">');
  });
}

function decorateHeroCarousel() {
  document.querySelectorAll('main div>.hero-carousel').forEach(($carousel) => {
    const $wrapper = createTag('div', { class: 'hero-carousel-viewport' });
    $wrapper.innerHTML = $carousel.innerHTML;
    $carousel.innerHTML = '';
    $carousel.appendChild($wrapper);
    const $nav = createTag('div', { class: 'hero-carousel-navigation' });
    const $navList = createTag('div', { class: 'hero-carousel-navigation-list' });
    $nav.append($navList);
    $carousel.appendChild($nav);
    $wrapper.querySelectorAll(':scope>div').forEach(($slide, i, slides) => {
      const prevSlide = i > 0 ? (i - 1) % slides.length : slides.length - 1;
      const nextSlide = (i + 1) % slides.length;
      $slide.classList.add('hero-carousel-slide');
      $slide.id = `hero-carousel-slide${i}`;
      $slide.append(createTag('div', { class: 'hero-carousel-snapper' }));
      $slide.append(createTag('a', {
        class: 'hero-carousel-prev', 'aria-label': 'Previous', role: 'button', href: `#hero-carousel-slide${prevSlide}`,
      }));
      $slide.append(createTag('a', {
        class: 'hero-carousel-next', 'aria-label': 'Next', role: 'button', href: `#hero-carousel-slide${nextSlide}`,
      }));
      const $navitem = createTag('div', { class: 'hero-carousel-navigation-list' });
      $navitem.innerHTML = `<div class="hero-carousel-navigation-item"><a href="#hero-carousel-slide${i}" role="button" aria-label="Hero Slide ${i}" class="hero-carousel-navigation-button"><a></div>`;
      $navList.append($navitem);
    });

    const $section = $carousel.closest('.section-wrapper');
    $section.classList.add('hero-carousel-container', 'full-width');
    const $overlay = $carousel.parentNode;
    $overlay.classList.add('hero-carousel-overlay');
    $section.prepend($carousel);

    $overlay.innerHTML = $overlay.innerHTML.replace('Adobe Stock Advocates', '<img src="/templates/stock-advocates/stock-advocates.svg" class="stock-advocates" alt="Adobe Stock Advocates. Be seen. Be heard. Be you.">');
  });
}

function tableToDivs($table, cols) {
  const $rows = $table.querySelectorAll(':scope>tbody>tr');
  const $cards = createTag('div', { class: `${cols.join('-')}` });
  $rows.forEach(($tr) => {
    const $card = createTag('div');
    $tr.querySelectorAll(':scope>td').forEach(($td, i) => {
      const $div = createTag('div', cols.length > 1 ? { class: cols[i] } : {});
      $div.innerHTML = $td.innerHTML;
      $div.childNodes.forEach(($child) => {
        if ($child.nodeName.toLowerCase() === '#text' && $child.nodeValue.trim()) {
          const $p = createTag('p');
          $p.innerHTML = $child.nodeValue;
          $child.parentElement.replaceChild($p, $child);
        }
      });
      $card.append($div);
    });
    $cards.append($card);
  });
  return ($cards);
}

function decorateTables() {
  document.querySelectorAll('main>div>table,.embed>div>table').forEach(($table) => {
    const $cols = $table.querySelectorAll(':scope>thead>tr>th');
    const cols = Array.from($cols).map((e) => toClassName(e.innerHTML)).filter((e) => (!!e));
    // const $rows = $table.querySelectorAll(':scope>tbody>tr');
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

function decorateLogo() {
  const $hero = document.querySelector('.hero-carousel');
  if (!$hero) {
    const $header = document.querySelector('header');
    const $asaLogoDiv = createTag('div', { class: 'asa-logo handsy' });
    $asaLogoDiv.innerHTML = '<img src="/templates/stock-advocates/advocates_logo_small.svg">';
    // don't want to wrap with a tag, too many style selectors may break - kk
    $asaLogoDiv.addEventListener('click', (() => {
      // this won't work if we add more sub folders
      window.location.pathname = `${window.location.pathname.split('/').slice(0, -1).join('/')}/`;
    }));
    $header.append($asaLogoDiv);
  }
}

async function decorateHeader() {
  await loadLocalHeader();
  const $header = document.querySelector('header>div');
  const $logo = $header.children[0];
  const $menu = $header.children[1];
  const $hamburger = $header.children[2];

  $logo.classList.add('logo');
  $logo.classList.add('handsy');

  $logo.addEventListener('click', (() => {
    // don't want to wrap with a tag, too many styles using children[0]
    // window.location.pathname = window.location.pathname.split("/").slice(0,-2).join("/") + "/";
    window.location.href = 'https://stock.adobe.com/'; // hardcoded for now
  }));
  $menu.classList.add('menu');
  $hamburger.classList.add('hamburger');

  $hamburger.addEventListener('click', () => {
    const added = $header.classList.toggle('expanded');
    if (added) {
      document.body.classList.add('noscroll');
    } else {
      document.body.classList.remove('noscroll');
    }
  });
  decorateLogo();
}

function decorateContactUs() {
  const $contactus = document.getElementById('contact-us');
  if ($contactus) {
    const $parent = $contactus.parentElement;
    $contactus.remove();
    $parent.id = 'contact-us';
    if (window.location.hash === '#contact-us') {
      $parent.scrollIntoView();
    }
  }
}

function addAccessibility() {
  try {
    const url = window.location.pathname;
    const lang = url.split('/')[2];
    const htmlTag = document.querySelector('html');
    htmlTag.setAttribute('lang', lang);
  } catch (e) {
    console.debug('could not add lang to html tag');
  }
  const footerIcons = document.querySelectorAll('#contact-us .icon');
  footerIcons.forEach(($icon) => {
    try {
      $icon.classList.forEach(($cl) => {
        if ($cl.startsWith('icon-')) {
          const $name = $cl.split('-')[1];
          $icon.parentElement.setAttribute('aria-label', $name);
        }
      });
    } catch (e) {
      console.debug('Count not set icon aria-label');
    }
  });
}

function supportsWebp() {
  return window.webpSupport;
}

// Google official webp detection
function checkWebpFeature(callback) {
  const webpSupport = sessionStorage.getItem('webpSupport');
  if (!webpSupport) {
    const kTestImages = 'UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEADsD+JaQAA3AAAAAA';
    const img = new Image();
    img.onload = () => {
      const result = (img.width > 0) && (img.height > 0);
      window.webpSupport = result;
      sessionStorage.setItem('webpSupport', result);
      callback();
    };
    img.onerror = () => {
      sessionStorage.setItem('webpSupport', false);
      window.webpSupport = false;
      callback();
    };
    img.src = `data:image/webp;base64,${kTestImages}`;
  } else {
    window.webpSupport = (webpSupport === 'true');
    callback();
  }
}

export function getOptimizedImageURL(src) {
  const url = new URL(src, window.location.href);
  let result = src;
  const { pathname, search } = url;
  if (pathname.includes('media_')) {
    const usp = new URLSearchParams(search);
    usp.delete('auto');
    if (!supportsWebp()) {
      if (pathname.endsWith('.png')) {
        usp.set('format', 'png');
      } else if (pathname.endsWith('.gif')) {
        usp.set('format', 'gif');
      } else {
        usp.set('format', 'pjpg');
      }
    } else {
      usp.set('format', 'webply');
    }
    result = `${src.split('?')[0]}?${usp.toString()}`;
  }
  return (result);
}

function resetAttribute($elem, attrib) {
  const src = $elem.getAttribute(attrib);
  if (src) {
    const oSrc = getOptimizedImageURL(src);
    if (oSrc !== src) {
      $elem.setAttribute(attrib, oSrc);
    }
  }
}

export function webpPolyfill(element) {
  if (!supportsWebp()) {
    element.querySelectorAll('img').forEach(($img) => {
      resetAttribute($img, 'src');
    });
    element.querySelectorAll('picture source').forEach(($source) => {
      resetAttribute($source, 'srcset');
    });
  }
}

async function decoratePage() {
  decorateTables();
  checkWebpFeature(() => {
    webpPolyfill(document);
  });
  decorateHeader();
  wrapSections('main>div');
  wrapSections('footer>div');
  decorateHeroCarousel();
  decorateHeroSection();
  decorateParallax();
  decorateOverlay();
  decorateInternalAdvocates();
  decorateColumns();
  decorateGrid();
  decorateColors();
  decorateButtons();
  decorateFaq();
  window.pages.decorated = true;
  appearMain();
  decorateContactUs();
  addAccessibility();
}

if (document.readyState === 'loading') {
  window.addEventListener('DOMContentLoaded', decoratePage);
} else {
  decoratePage();
}
