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
  createTag,
  insertLocalResource,
  toClassName,
  makeLogger,
  loadCSS,
  appearMain,
  replaceEmbeds,
  decorateIcons,
} from '../default/default.js';

const lgr = makeLogger('template:advocates');

function makeLinksRelative() {
  const links = Array.from(document.querySelectorAll('a[href*="//pages.adobe.com/"]'));
  links.forEach((link) => {
    try {
      const url = new URL(link.href);
      const rel = window.location.origin + url.pathname + url.search + url.hash;
      link.href = rel;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.debug(`problem with link ${link.href}`);
    }
  });
}

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
    makeLinksRelative();
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
      if ($p) $imgWrapper.append($p);

      // move artist text to image side
      const $allP = $div.querySelectorAll('p');
      Array.from($allP).forEach(($p2) => {
        if ($p2 && $p2.innerText && $p2.innerText.includes('Artist')) {
          $imgWrapper.appendChild($p2);
        }
      });
    }
  }
}

function decorateArtistBioHeroSection() {
  const $firstSectionImage = document.querySelector('main div.section-wrapper>div>p img');
  if ($firstSectionImage) {
    const $section = $firstSectionImage.closest('.section-wrapper');
    $section.classList.add('full-width');
    const $div = $firstSectionImage.closest('div');
    $section.classList.add('hero-section', 'artist-bio-hero-section', 'white-text');
    $div.classList.add('text');
    if ($div.children[1].children[0].tagName.toUpperCase() === 'IMG') {
      $div.classList.add('image');
    } else {
      const $imgWrapper = createTag('div', { class: 'image' });
      $section.append($imgWrapper);
      const $p = $firstSectionImage.parentElement.nextElementSibling;
      $imgWrapper.append($firstSectionImage.parentNode);
      if ($p) $imgWrapper.append($p);
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

      $question.tabIndex = '0';
      $question.classList.add('question');
      $answer.tabIndex = '-1';
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

export function decorateBlocks(
  $main,
  query = ':scope div.section-wrapper > div > div',
) {
  const blocksWithOptions = [
    'card', 'columns', 'missionbg',
    'callout', 'background', 'spacer',
    'scrollto', 'sectiontitle', 'hr',
    'downloadcallouts', 'cardcallouttitle',
    'cardcallouts', 'videocontent', 'scrolltop',
    'hero', 'tutorials', 'list', 'grid', 'video',
  ];
  const blocksWithSpecialCases = ['checklist', 'nav', 'missiontimeline', 'missionbg'];

  $main.querySelectorAll(query).forEach(($block) => {
    let classes = Array.from($block.classList.values());
    lgr.debug('decorateBlock', { classes });
    let blockName = classes[0];
    if (!blockName) return;

    if ('embed' === blockName) {
      const cls = $block.classList.item(0);
      loadCSS(`/pages/blocks/${cls}/${cls}.css`);
      return;
    }

    let options = [];

    // begin custom block option class handling
    // split and add options with a dash
    // (fullscreen-center -> fullscreen-center + fullscreen + center)
    $block.classList.forEach((className, index) => {
      if (index === 0) return; // block name, no split
      const split = className.split('-');
      if (split.length > 1) {
        split.forEach((part) => {
          options.push(part);
        });
      }
    });
    $block.classList.add(...options);
    // end custom block option class handling


    blocksWithOptions.forEach((b) => {
      if (blockName.startsWith(`${b}-`)) {
        options = blockName.substring(b.length + 1).split('-').filter((opt) => !!opt);
        blockName = b;
        $block.classList.add(b);
        $block.classList.add(...options);
      }
    });

    // eslint-disable-next-line no-console
    const handleSpecialBlock = console.debug.bind(console, 'Unexpected special block: ');

    blocksWithSpecialCases.forEach((sBlockName) => {
      if (blockName.indexOf(`${sBlockName}`) >= 0) {
        const {
          blockName: b,
          options: o,
        } = handleSpecialBlock(sBlockName, blockName, $block);
        blockName = b || sBlockName;
        $block.classList.add(...(o || []));
      }
    });

    const $section = $block.closest('.section-wrapper');
    if ($section && blockName !== 'grid') {
      $section.classList.add(`${blockName}-container`.replace(/--/g, '-'));
      $section.classList.add(...options);
    }
    $block.classList.add('block');
    $block.setAttribute('data-block-name', blockName);
  });
}

function decorateVideoBlock($block) {
  let autoplay = '';
  const $a = $block.querySelector('a');

  const $container = $block.closest('.section-wrapper');

  if ($container.classList.contains('full') && $container.classList.contains('width')) {
    $container.classList.remove('full', 'width');
    $container.classList.add('full-width');
  }

  if ($a && $a.textContent.startsWith('https://')) {
    const url = new URL($a.href);
    const usp = new URLSearchParams(url.search);
    let embedHTML = '';
    let type = '';

    if ($a.href.startsWith('https://www.youtube.com/watch') || $a.href.startsWith('https://youtu.be/')) {
      let vid = usp.get('v');
      if (url.host === 'youtu.be') vid = url.pathname.substr(1);
      if ($container.classList.contains('autoplay')) {
        autoplay = '&amp;autoplay=1&amp;mute=1';
      }

      type = 'youtube';
      embedHTML = /* html */`
        <div style="left: 0; width: 100%; height: 0; position: relative; padding-bottom: 56.25%;">
          <iframe src="https://www.youtube.com/embed/${vid}?rel=0&amp;modestbranding=1&amp;playsinline=1&amp;autohide=1&amp;showinfo=0&amp;controls=1&amp;rel=0&amp;loop=1&amp;playlist=${vid}${autoplay}" frameBorder="0" style="border: 0; top: 0; left: 0; width: 100%; height: 100%; position: absolute;" allowfullscreen="" scrolling="no" allow="encrypted-media; accelerometer; gyroscope; picture-in-picture; autoplay" title="content from youtube" loading="lazy"></iframe>
        </div>
        `;
    } else if ($a.href.includes('tv.adobe.com')) {
      const $video = createTag('iframe', { src: $a.href, class: 'embed tv-adobe' });

      $a.parentElement.replaceChild($video, $a);
    }

    if (type) {
      const $embed = createTag('div', { class: `embed embed-oembed embed-${type}` });
      const $div = $a.closest('div');
      $embed.innerHTML = embedHTML;
      $div.parentElement.replaceChild($embed, $div);
    }
  }
}

function videoIntersectHandler(entries) {
  const entry = entries[0];
  if (entry.isIntersecting) {
    if (entry.intersectionRatio >= 0.25) {
      const $block = entry.target;
      decorateVideoBlock($block);
    }
  }
}

function runVideoObserver($block) {
  const options = {
    root: null,
    rootMargin: '0px',
    threshold: [0.0, 0.25],
  };

  const observer = new IntersectionObserver(videoIntersectHandler, options);
  observer.observe($block);
}

function lazyDecorateVideo($block) {
  if (document.readyState === 'complete') {
    runVideoObserver($block);
  } else {
    window.addEventListener('load', () => {
      runVideoObserver($block);
    });
  }
}

function decorateVideos() {
  document.querySelectorAll('main .video.block').forEach(($block) => {
    lazyDecorateVideo($block);
  });
}

function decorateGrid() {
  const meetGrid = document.querySelector('.embed-internal-meettheartists .grid');
  const partnerGrid = document.querySelector('.embed-internal-partners .grid');
  document.querySelectorAll('main div>.grid').forEach(($grid) => {
    $grid.closest('.section-wrapper').classList.add('full-width');

    if ($grid === meetGrid) {
      $grid.classList.add('meetgrid');
    }

    const rows = Array.from($grid.children);
    rows.forEach(($row) => {
      const cells = Array.from($row.children);
      cells[0].classList.add('image');
      cells[1].classList.add('text');
      if ($grid !== meetGrid && $grid !== partnerGrid) {
        cells[1].style.backgroundColor = `${cells[2].textContent}80`; // why?
      }
      cells[2].remove();
      const $a = cells[1].querySelector('a');
      if ($a) {
        const linkTarget = $a.href;
        $row.addEventListener('click', () => {
          window.open(linkTarget);
        });
      }
    });
    // Fix header in sequential order accessibility lighthouse
    Array.from($grid.querySelectorAll('h4:first-child, p + h4')).forEach((h4) => {
      const h3 = document.createElement('h3');
      h3.innerHTML = h4.innerHTML;
      h3.className = h4.className;
      for (const attr of h4.attributes) {
        h3.setAttribute(attr.name, attr.value);
      }
      h3.classList.add('h4');
      h4.parentNode.replaceChild(h3, h4);
    });
    Array.from($grid.querySelectorAll('h5:first-child, p + h5')).forEach((h5) => {
      const h3 = document.createElement('h3');
      h3.innerHTML = h5.innerHTML;
      for (const attr of h5.attributes) {
        h3.setAttribute(attr.name, attr.value);
      }
      h3.classList.add('h5');
      h5.parentNode.replaceChild(h3, h5);
    });
  });
}

function decorateButtons() {
  document.querySelectorAll('main a').forEach(($a) => {
    const $up = $a.parentElement;
    const $twoup = $a.parentElement.parentElement;
    if ($up.childNodes.length === 1 && $up.tagName.toUpperCase() === 'P') {
      $a.className = 'button secondary';
      $up.classList.add('button-container');
    }
    if ($up.childNodes.length === 1 && $up.tagName.toUpperCase() === 'STRONG'
        && $twoup.childNodes.length === 1 && $twoup.tagName.toUpperCase() === 'P') {
      $a.className = 'button primary';
      $twoup.classList.add('button-container');
    }
  });
  document.querySelectorAll('.artist-bio-hero-section a.primary').forEach(($a) => {
    $a.classList.remove('button');
    $a.classList.remove('primary');
    $a.classList.add('artist-stock-link');
  });
}

export function transformLinkToAnimation($a) {
  if (!$a || !$a.href.endsWith('.mp4')) {
    return null;
  }
  const params = new URL($a.href).searchParams;
  const attribs = {};
  ['playsinline', 'autoplay', 'loop', 'muted'].forEach((p) => {
    if (params.get(p) !== 'false') attribs[p] = '';
  });
  // use closest picture as poster
  const $poster = $a.closest('div').querySelector('picture source');
  if ($poster) {
    attribs.poster = $poster.srcset;
    $poster.parentNode.remove();
  }
  // replace anchor with video element
  const videoUrl = new URL($a.href);
  const helixId = videoUrl.hostname.includes('hlx.blob.core') ? videoUrl.pathname.split('/')[2] : videoUrl.pathname.split('media_')[1].split('.')[0];
  const videoHref = `./media_${helixId}.mp4`;
  const $video = createTag('video', attribs);
  $video.innerHTML = `<source src="${videoHref}" type="video/mp4">`;
  const $innerDiv = $a.closest('div');
  $innerDiv.prepend($video);
  $innerDiv.classList.add('hero-animation-overlay');
  $a.replaceWith($video);
  // autoplay animation
  $video.addEventListener('canplay', () => {
    $video.muted = true;
    $video.play();
  });
  return $video;
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
        const $a = $cell.querySelector('a');
        if ($img || ($a && $a.href.endsWith('.mp4'))) {
          $cell.classList.add('image');
          let $p;
          if ($img) {
            $p = $img.closest('p');
            if (!$img.getAttribute('alt', '')) $img.setAttribute('alt', '');
          } else if ($a && $a.href.endsWith('.mp4')) {
            $p = $a.closest('p');
            transformLinkToAnimation($a);
          }
          if ($p) {
            $p.classList.add('image-bleed');
            const $nextP = $p.nextElementSibling;
            if ($nextP && $nextP.tagName === 'P') {
              $nextP.classList.add('caption');
            }
          }
        } else {
          $cell.classList.add('text');
          if ($cell.textContent === '') {
            $cell.remove();
            const prev = arr[i - 1];
            if (prev) {
              prev.classList.add('merged');
            }
          }
        }
      });
    });
    // Fix header in sequential order accessibility lighthouse
    Array.from($columns.querySelectorAll('h4:first-child, p + h4')).forEach((h4) => {
      const h2 = document.createElement('h2');
      h2.innerHTML = h4.innerHTML;
      for (const attr of h4.attributes) {
        h2.setAttribute(attr.name, attr.value);
      }
      h2.classList.add('h4');
      h4.parentNode.replaceChild(h2, h4);
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
    const $slides = $wrapper.querySelectorAll(':scope>div');
    $slides.forEach(($slide, i, slides) => {
      const prevSlide = i > 0 ? (i - 1) % slides.length : slides.length - 1;
      const nextSlide = (i + 1) % slides.length;
      $slide.classList.add('hero-carousel-slide');
      $slide.id = `hero-carousel-slide${i}`;
      $slide.append(createTag('div', { class: 'hero-carousel-snapper' }));
      $slide.append(createTag('a', {
        class: 'hero-carousel-prev', 'aria-label': 'Previous', tabindex: '-1', role: 'button', href: `#hero-carousel-slide${prevSlide}`,
      }));
      $slide.append(createTag('a', {
        class: 'hero-carousel-next', 'aria-label': 'Next', tabindex: '-1', role: 'button', href: `#hero-carousel-slide${nextSlide}`,
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

    // Carousel auto-scroll every 4 seconds:
    const seconds = 4000;

    const autoScrollCarousel = setInterval(() => {
      if (($wrapper.scrollWidth / $slides.length) >= $wrapper.scrollLeft) {
        $wrapper.scrollBy(window.innerWidth, 0);
      } else {
        $wrapper.scrollTo(0, 0);
      }
    }, seconds);

    Array.from($carousel.querySelectorAll('a')).forEach((a) => {
      a.addEventListener('click', () => {
        clearInterval(autoScrollCarousel);
      });
    });
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
    $asaLogoDiv.innerHTML = '<img src="/templates/stock-advocates/advocates_logo_small.svg" alt="Adobe Stock Advocates">';
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
  await decorateIcons($header);
  const $logo = $header.children[0];
  const $menu = $header.children[1];
  const $hamburger = $header.children[2];
  const $hamburgerButton = document.createElement('button');
  while ($hamburger.firstElementChild) {
    $hamburgerButton.appendChild($hamburger.firstElementChild);
  }
  $hamburger.parentNode.replaceChild($hamburgerButton, $hamburger);
  $logo.classList.add('logo');
  $logo.classList.add('handsy');

  $logo.addEventListener('click', (() => {
    // don't want to wrap with a tag, too many styles using children[0]
    // window.location.pathname = window.location.pathname.split("/").slice(0,-2).join("/") + "/";
    window.location.href = 'https://stock.adobe.com/'; // hardcoded for now
  }));
  $menu.classList.add('menu');
  $hamburgerButton.classList.add('hamburger');
  $hamburgerButton.setAttribute('aria-label', 'Menu Toggle');
  $hamburgerButton.addEventListener('click', () => {
    const added = $header.classList.toggle('expanded');
    if (added) {
      document.body.classList.add('noscroll');
    } else {
      document.body.classList.remove('noscroll');
    }
  });

  $header.insertBefore($hamburgerButton, $menu);

  const $links = Array.from($menu.querySelectorAll('a'));
  $links.forEach(($a) => {
    $a.addEventListener('click', () => {
      $header.classList.remove('expanded');
      document.body.classList.remove('noscroll');
    });
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
    // eslint-disable-next-line no-console
    console.debug('could not add lang to html tag');
  }

  function iconAria($icons) {
    $icons.forEach(($icon) => {
      try {
        $icon.classList.forEach(($cl) => {
          if ($cl.startsWith('icon-')) {
            const $name = $cl.split('-')[1];
            $icon.parentElement.setAttribute('aria-label', $name);
          }
        });
      } catch (e) {
        // eslint-disable-next-line no-console
        console.debug('Count not set icon aria-label');
      }
    });
  }
  const footerIcons = document.querySelectorAll('#contact-us .icon');
  iconAria(footerIcons);
  const includedIcons = document.querySelectorAll('embed-internal .icon');
  iconAria(includedIcons);
  const artistIcons = document.querySelectorAll('.artist-bio main .icon');
  iconAria(artistIcons);

  const asaIds = document.querySelectorAll('#adobe-stock-advocates');
  if (asaIds.length > 1) {
    asaIds[1].id = `${asaIds[1].id}--contact`;
  }
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

function decorateArtistBioBody() {
  document.querySelector('body').classList.add('artist-bio');
}

function searchPath(pathPart) {
  const ps = window.location.pathname.split('/');
  return ps.includes(pathPart);
}

function redecorateArtistGrid() {
  const el = document.querySelectorAll('main .block');
  el.forEach((e) => {
    e.style.visibility = 'unset';
  });
  const artistGridEntries = document.querySelectorAll('.embed-internal-meettheartists .meetgrid .text h4');
  artistGridEntries.forEach(($child) => {
    $child.id += '--artistbio';
  });
}

function generalHacks() {
  const hg = document.querySelector('.grid--partners-');
  if (hg) {
    hg.classList.add('grid');
    hg.classList.add('partners');
  }
  const h2 = document.querySelector('h2#explore-the-creative-briefs + div.grid');
  if (h2) {
    h2.classList.add('briefs');
  }
}

export default async function decoratePage() {
  await replaceEmbeds();
  makeLinksRelative();
  generalHacks();
  decorateTables();
  checkWebpFeature(() => {
    webpPolyfill(document);
  });
  decorateHeader();
  wrapSections('main>div');
  wrapSections('footer>div');
  decorateHeroCarousel();

  if (searchPath('artists')) {
    decorateArtistBioHeroSection();
    decorateArtistBioBody();
  } else {
    decorateHeroSection();
  }
  decorateBlocks(document.querySelector('main'));
  appearMain();
  decorateParallax();
  decorateOverlay();
  decorateInternalAdvocates();
  decorateColumns();
  decorateGrid();
  redecorateArtistGrid();
  decorateColors();
  decorateButtons();
  decorateFaq();
  window.pages.decorated = true;
  decorateContactUs();
  addAccessibility();
  decorateVideos();
  decorateIcons();

  document.getElementById('favicon').href = '/icons/stock.ico';
}
