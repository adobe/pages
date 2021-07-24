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

document.title = document.title.split('<br>').join(' ');

function addDefaultClass(element) {
  document.querySelectorAll(element).forEach(($div) => {
    $div.classList.add('default');
  });
}

// TODO: replace with dynamic imports
function loadJSModule(src) {
  const module = document.createElement('script');
  module.setAttribute('type', 'module');
  module.setAttribute('src', src);
  document.head.appendChild(module);
}

// TODO: dedupe this with default.js
function setWidths() {
  const sections = document.querySelectorAll('main .default');
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

/**
 * Creates a tag with the given name and attributes.
 * @param {string} name The tag name
 * @param {object} attrs An object containing the attributes
 * @returns The new tag
 */
function createTag(name, attrs) {
  const el = document.createElement(name);
  if (typeof attrs === 'object') {
    for (const [key, value] of Object.entries(attrs)) {
      el.setAttribute(key, value);
    }
  }
  return el;
}

async function insertLocalResource(type) {
  let url = '';
  if (window.pages.product && window.pages.locale) {
    url = `/${window.pages.product}/${window.pages.locale}/${type}.plain.html`;
  }

  if (window.pages.product && window.pages.project) {
    url = `/${window.pages.product}/${window.pages.locale}/${window.pages.project}/${type}.plain.html`;
  }

  if (url) {
    window.hlx.dependencies.push(url);
    const resp = await fetch(url);
    if (resp.status === 200) {
      const html = await resp.text();
      const inner = `<div> ${html} </div>`;
      document.querySelector(type).innerHTML = inner;
    }
  }

  // temporary icon fix
  document.querySelector(type).classList.add('appear');
}

/* link out to external links */
// called inside decoratePage() twp3.js
function externalLinks(selector) {
  const element = document.querySelector(selector);
  const links = element.querySelectorAll('a[href]');

  links.forEach((linkItem) => {
    const linkValue = linkItem.getAttribute('href');

    if (linkValue.includes('//') && !linkValue.includes('pages.adobe')) {
      linkItem.setAttribute('target', '_blank');
    }
  });
}

function externalizeImageSources($div) {
  $div.querySelectorAll('img').forEach(($img) => {
    const { src } = $img;
    if (src.startsWith('https://hlx.blob.core.windows.net/external/')) {
      const url = new URL(src);
      const id = url.pathname.split('/')[2];
      const ext = url.hash.split('.')[1];
      $img.src = `/hlx_${id}.${ext}`;
    }
  });
}

// TODO: dedupe with in-app.js, max.js, ete.js, learn.js, on24.js, tutorials.js
function toClassName(name) {
  return (name.toLowerCase().replace(/[^0-9a-z]/gi, '-'));
}

// TODO: dedupe with in-app.js, max.js, learn.js, tutorials.js
function turnTableSectionIntoCards($table, cols) {
  const $rows = $table.querySelectorAll('tbody tr');
  const $cards = createTag('div', { class: `cards ${cols.join('-')}` });
  $rows.forEach(($tr) => {
    const $card = createTag('div', { class: 'card' });
    $tr.querySelectorAll('td').forEach(($td, i) => {
      const $div = createTag('div', { class: cols[i] });
      const $a = $td.querySelector('a[href]');
      if ($a && $a.getAttribute('href').startsWith('https://www.youtube.com/')) {
        const yturl = new URL($a.getAttribute('href'));
        const vid = yturl.searchParams.get('v');
        $div.innerHTML = `<div class="video-thumb" style="background-image:url(https://img.youtube.com/vi/${vid}/0.jpg)"><svg xmlns="http://www.w3.org/2000/svg" width="731" height="731" viewBox="0 0 731 731">
              <g id="Group_23" data-name="Group 23" transform="translate(-551 -551)">
                  <circle id="Ellipse_14" data-name="Ellipse 14" cx="365.5" cy="365.5" r="365.5" transform="translate(551 551)" fill="#1473e6"/>
                  <path id="Polygon_3" data-name="Polygon 3" d="M87.5,0,175,152H0Z" transform="translate(992.5 829.5) rotate(90)" fill="#fff"/>
              </g>
              </svg>
              </div>`;
        $div.addEventListener('click', () => {
          $div.innerHTML = `<div style="left: 0; width: 100%; height: 0; position: relative; padding-bottom: 56.25%;"><iframe src="https://www.youtube.com/embed/${vid}?rel=0&autoplay=1" style="border: 0; top: 0; left: 0; width: 100%; height: 100%; position: absolute;" allowfullscreen scrolling="no" allow="autoplay; encrypted-media; accelerometer; gyroscope; picture-in-picture"></iframe></div>`;
        });
      } else {
        $div.innerHTML = $td.innerHTML;
        $div.childNodes.forEach(($child) => {
          if ($child.nodeName === '#text') {
            const $p = createTag('p');
            $p.innerHTML = $child.nodeValue;
            $child.parentElement.replaceChild($p, $child);
          }
        });
      }
      $card.append($div);
    });
    $cards.append($card);
  });
  return ($cards);
}

// TODO: dedupe with in-app.js, max.js,
//    templates/default.js, learn.js, on24.js,
//    stock-advocates.js, tutorials.js, xd.js
function decorateTables() {
  document.querySelectorAll('main div>table').forEach(($table) => {
    const $cols = $table.querySelectorAll('thead tr th');
    const cols = Array.from($cols).map((e) => toClassName(e.innerHTML));
    const $rows = $table.querySelectorAll('tbody tr');
    let $div = {};

    if (cols.length === 1 && $rows.length === 1) {
      $div = createTag('div', { class: `${cols[0]}` });
      $div.innerHTML = $rows[0].querySelector('td').innerHTML;
      externalizeImageSources($div);
    } else {
      $div = turnTableSectionIntoCards($table, cols);
    }
    $table.parentNode.replaceChild($div, $table);
  });
}

// TODO: dedupe with stock-advocates.js, tutorials.js
async function loadLocalHeader() {
  decorateTables();
  const $inlineHeader = document.querySelector('main div.header-block');
  if ($inlineHeader) {
    const $header = document.querySelector('header');
    $inlineHeader.childNodes.forEach((e, i) => {
      // in a document, using uppercase and strict equal checks
      if (e.nodeName === 'DIV' && !i) {
        const $p = createTag('div');
        const inner = `<img class="icon icon-${window.pages.product}" src="/icons/${window.pages.product}.svg">${e.outerHTML}`;
        $p.innerHTML = inner;
        e.parentNode.replaceChild($p, e);
      }
      if (e.nodeName === 'P' && !i) {
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

/**
 * adds a class to an element.
 * @param {string} qs querySelector string
 * @param {string} cls css class to be added
 * @param {number} parent uplevel
 */
function classify(qs, cls, parent) {
  document.querySelectorAll(qs).forEach(($e) => {
    let $root = $e;
    for (let p = parent; p > 0; p -= 1) {
      $root = $root.parentNode;
    }
    $root.classList.add(cls);
  });
}

const debounce = (func, wait, immediate) => {
  let timeout;
  return function debounced(...args) {
    const later = () => {
      timeout = null;
      if (!immediate) func.apply(this, args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(this, args);
  };
};

/**
 * Checks if <main> is ready to appear
 */
function appearMain() {
  if (window.pages.familyCssLoaded && window.pages.decorated) {
    const p = window.pages;
    const pathSplits = window.location.pathname.split('/');
    const pageName = pathSplits[pathSplits.length - 1].split('.')[0];
    const classes = [p.product, p.family, p.project, pageName];
    classes.forEach((e) => (e ? document.body.classList.add(e) : false));
    classify('main', 'appear');
  }
}

/**
 * Loads a CSS file.
 * @param {string} href The path to the CSS file
 */
function loadCSS(href) {
  const link = document.createElement('link');
  link.setAttribute('rel', 'stylesheet');
  link.setAttribute('href', href);
  link.onload = () => {
    window.pages.familyCssLoaded = true;
    appearMain();
    // set_widths();
  };
  link.onerror = () => {
    window.pages.familyCssLoaded = true;
    appearMain();
  };
  document.head.appendChild(link);
}

function loadTemplate() {
  document.querySelectorAll('table th').forEach(($th) => {
    if ($th.textContent.toLowerCase().trim() === 'template') {
      const $table = $th.closest('table');
      const template = $table.querySelector('td').textContent;
      const $div = createTag('div', { class: 'template' });
      $div.innerHTML = template;
      $table.parentElement.replaceChild($div, $table);
    }
  });

  let template = 'default';
  const $template = document.querySelector('.template');

  if ($template) {
    template = toClassName($template.textContent);
    $template.remove();
  }

  loadJSModule(`/templates/${template}/${template}.js`);
  loadCSS(`/templates/${template}/${template}.css`);
}

function localizeFooter() {
  const lang = window.pages.locale;

  const footers = {
    de: `<div>
    <p>Copyright © 2020 Adobe. All rights reserved.</p>
    <ul>
    <li><a href="https://www.adobe.com/de/privacy.html">Richtlinien f&uuml;r den Datenschutz</a></li>
    <li><a href="https://www.adobe.com/de/legal/terms.html">Nutzungsbedingungen</a></li>
    <li><a href="https://www.adobe.com/de/privacy/ca-rights.html">Daten zu meiner Person nicht verkaufen</a></li>
    <li><a href="https://www.adobe.com/de/privacy/opt-out.html#interest-based-ads"><svg xmlns="http://www.w3.org/2000/svg" class="icon icon-adchoices"><use href="/icons.svg#adchoices"></use></svg> AdAuswahl</a></li>
    </ul>
    </div>
    <div>
    <div class="privacy" style="display: block;">
      <a href="#" class="openPrivacyModal">Einstellungen</a>
      <div id="feds-footer"></div>
    </div>
    </div>`,
  };

  if (footers[lang]) {
    const $footer = document.querySelector('body>footer');
    $footer.innerHTML = footers[lang];
  }
}

function fixImages() {
  const screenWidth = window.screen.availWidth;
  const imgSizes = [375, 768, 1000];
  const fitting = imgSizes.filter((s) => s <= screenWidth);
  const width = fitting.length ? fitting[fitting.length - 1] * 2 : imgSizes[0] * 2;
  let heroProcessed = false;
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        // only handle images with src=/hlx_*
        // console.log(node.tagName +':'+node.src);
        if (node.tagName === 'IMG' && !node.src.includes('?')) {
          let contentHash;
          let extension;
          if (node.src.includes('/hlx_')) {
            const filename = node.src.split('/hlx_')[1];
            const splits = filename.split('.');
            contentHash = splits[0];
            extension = splits[1];
          }

          if (node.src.startsWith('https://hlx.blob.core.windows.net/external/')) {
            const filename = node.src.substring(43);
            const splits = filename.split('#');
            contentHash = splits[0];
            extension = splits[1].split('.')[1];
          }

          if (contentHash && (extension === 'jpg' || extension === 'jpeg' || extension === 'png')) {
            const loading = heroProcessed ? 'lazy' : 'eager';
            heroProcessed = true;
            node.setAttribute('src', `/hlx_${contentHash}.${extension}?width=${width}&auto=webp&format=pjpg&optimize=medium`);
            node.setAttribute('loading', loading);
          }
        }
      });
    });
    if (document.readyState === 'interactive' || document.readyState === 'complete') {
      observer.disconnect();
    }
  });
  observer.observe(document, { childList: true, subtree: true });
}

function styleButtons() {
  const links = document.querySelectorAll('main a');
  if (!document.querySelectorAll('main a')) return;
  links.forEach((link) => {
    if (
      link.parentElement.parentNode.nodeName === 'P'
      && link.parentElement.parentNode.childElementCount === 1
      && link.parentElement.parentNode.firstChild.nodeName === 'STRONG'
    ) {
      link.className = 'button primary';
    }
  });
}

function run() {
  fixImages();

  const pathSegments = window.location.pathname.match(/[\w-]+(?=\/)/g);

  window.pages = {};

  if (pathSegments) {
    const product = pathSegments[0];
    const locale = pathSegments[1];
    const project = pathSegments[2];
    window.pages = { product, locale, project };
  }

  window.hlx = window.hlx || {};
  window.hlx.dependencies = [];

  if (window.pages.product) {
    document.getElementById('favicon').href = `/icons/${window.pages.product}.svg`;
  }

  if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', () => {
      localizeFooter();
      loadTemplate();
      styleButtons();
    });
  } else {
    localizeFooter();
    loadTemplate();
  }
}

/**
 * TODO: remove this switch for modules.
 * We can leave the functions on window until
 * everything is moved over and tested.
 *
 * For now, this script is included as a module,
 * but also writes to window.
 * Gives us the ability to use both ways in the interrim.
 */

// non-module, explicitly add functions to global scope
window.addDefaultClass = addDefaultClass;
window.loadJSModule = loadJSModule;
window.setWidths = setWidths;
window.createTag = createTag;
window.insertLocalResource = insertLocalResource;
window.externalLinks = externalLinks;
window.loadCSS = loadCSS;
window.appearMain = appearMain;
window.classify = classify;
window.debounce = debounce;
window.toClassName = toClassName;
window.turnTableSectionIntoCards = turnTableSectionIntoCards;
window.loadLocalHeader = loadLocalHeader;
window.decorateTables = decorateTables;
run();

// module
// export default run;
