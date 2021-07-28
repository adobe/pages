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

/* eslint-disable no-console, import/no-cycle  */

import {
  decorateBackgroundImageBlocks,
  decorateButtons,
  decorateEmbeds,
  decorateHero,
  decorateLinkTexting,
  decorateNav,
  decorateNextStep,
  decorateVideoBlocks,
  equalizer,
  linkInNewTab,
  setExternalLinks,
  wrapSections,
} from './default.js';
import { initializeNamespaces, emit } from './namespace.js';

/**
 * Add dependency urls that should be published with Sidekick.
 * @param {string | string[]} url
 */
export function addPublishDependencies(url) {
  if (!Array.isArray(url)) {
    // eslint-disable-next-line no-param-reassign
    url = [url];
  }
  window.hlx = window.hlx || {};
  if (window.hlx.dependencies && Array.isArray(window.hlx.dependencies)) {
    window.hlx.dependencies.concat(url);
  } else {
    window.hlx.dependencies = url;
  }
}

/**
 * Get debounced version of function.
 *
 * @param {Function} func Function to call
 * @param {number} wait Wait
 * @param {boolean} immediate Immedaite
 * @returns {Function}
 */
export function debounce(func, wait, immediate) {
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
}

/**
 * Add `default` to classList of elements matching selector
 * @param {string} element selector
 */
export function addDefaultClass(element) {
  document.querySelectorAll(element).forEach(($div) => {
    $div.classList.add('default');
  });
}

/**
 * Fetch and inject JS payload
 * @param {string} href path
 */
export function loadJSModule(href) {
  emit('preLoadJs', { href });
  const module = document.createElement('script');
  module.setAttribute('type', 'module');
  module.setAttribute('src', href);
  document.head.appendChild(module);
}

// TODO: dedupe this with default.js
/**
 * setWidths
 */
export function setWidths() {
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
 * @param {Record<string,string>} attrs An object containing the attributes
 * @returns The new tag
 */
export function createTag(name, attrs) {
  const el = document.createElement(name);
  if (typeof attrs === 'object') {
    for (const [key, value] of Object.entries(attrs)) {
      el.setAttribute(key, value);
    }
  }
  return el;
}

/**
 * insertLocalResource
 * @param {string} type
 */
export async function insertLocalResource(type) {
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

/**
 * Link out to external links.
 * Called inside decoratePage() twp3.js
 *
 * @param {string} selector
 */
export function externalLinks(selector) {
  emit('externalLinks', { selector });

  const element = document.querySelector(selector);
  if (!element) return;

  const links = element.querySelectorAll('a[href]');

  links.forEach((linkItem) => {
    const linkValue = linkItem.getAttribute('href');

    if (linkValue.includes('//') && !linkValue.includes('pages.adobe')) {
      linkItem.setAttribute('target', '_blank');
    }
  });
}

/**
 * Externalize image sources contained within some element
 * @param {HTMLElement} $div element
 */
export function externalizeImageSources($div) {
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

/**
 * Create class name from string.
 *
 * @param {string} name
 * @returns {string}
 */
export function toClassName(name) {
  return (name.toLowerCase().replace(/[^0-9a-z]/gi, '-'));
}

// TODO: dedupe with in-app.js, max.js, learn.js, tutorials.js
/**
 * Convert table section into cards.
 *
 * @param {HTMLElement} $table element
 * @param {string[]} cols
 * @returns {HTMLElement}
 */
export function turnTableSectionIntoCards($table, cols) {
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
/**
 * Decorate tables
 */
export function decorateTables() {
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
/**
 * Load localized header
 */
export async function loadLocalHeader() {
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
export function classify(qs, cls, parent) {
  document.querySelectorAll(qs).forEach(($e) => {
    let $root = $e;
    for (let p = parent; p > 0; p -= 1) {
      $root = $root.parentNode;
    }
    $root.classList.add(cls);
  });
}

/**
 * Checks if <main> is ready to appear
 */
export function appearMain() {
  if (window.pages.familyCssLoaded && window.pages.decorated) {
    const pathSplits = window.location.pathname.split('/');
    const pageName = pathSplits[pathSplits.length - 1].split('.')[0];
    const p = window.pages;
    const classes = [p.product, p.family, p.project, pageName].filter((c) => !!c);
    document.body.classList.add(...classes);
    classify('main', 'appear');
    emit('mainVisible');
  }
}

/**
 * Loads a CSS file.
 * @param {string} href The path to the CSS file
 */
export function loadCSS(href) {
  emit('preLoadCss', { href });

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

/**
 * Inject style text to node
 * @param {string} txt
 * @param {HTMLElement} [parent] - if not set, injects to head
 */
export function injectCSSText(txt, parent) {
  const s = document.createElement('style');
  (parent || document.head).appendChild(s);
  s.appendChild(document.createTextNode(txt));
}

// export function decorateBlocks($main) {
//   $main.querySelectorAll('div.section-wrapper > div > div').forEach(($block) => {
//     const classes = Array.from($block.classList.values());
//     let blockName = classes[0];
//     if (!blockName) return;
//     const $section = $block.closest('.section-wrapper');
//     if ($section) {
//       $section.classList.add(`${blockName}-container`.replace(/--/g, '-'));
//     }
//     const blocksWithOptions = [
//        'checker-board', 'template-list', 'steps', 'cards',
//        'quotes', 'page-list', 'columns', 'show-section-only',
//        'image-list', 'feature-list', 'icon-list', 'table-of-contents'
//     ];
//     blocksWithOptions.forEach((b) => {
//       if (blockName.startsWith(`${b}-`)) {
//         const options = blockName.substring(b.length + 1).split('-').filter((opt) => !!opt);
//         blockName = b;
//         $block.classList.add(b);
//         $block.classList.add(...options);
//       }
//     });
//     $block.classList.add('block');
//     $block.setAttribute('data-block-name', blockName);
//   });
// }

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

export function loadBlock($block) {
  const blockName = $block.getAttribute('data-block-name');
  import(`/pages/blocks/${blockName}/${blockName}.js`)
    .then((mod) => {
      if (mod.default) {
        mod.default($block, blockName, document);
      }
    })
    .catch((err) => console.log(`failed to load module for ${blockName}`, err));

  loadCSS(`/express/blocks/${blockName}/${blockName}.css`);
}

export function loadBlocks($main) {
  $main
    .querySelectorAll('div.section-wrapper > div > .block')
    .forEach(async ($block) => loadBlock($block));
}

/**
 * Query for all p elements, replace ones that appear to be paths
 * with their block counterpart. This is expensive, ideally we will
 * rewrite the content to point to blocks directly, but this is for
 * backwards compatibility until then.
 */
export function replaceEmbeds() {
  const pEls = document.querySelectorAll('p');
  pEls.forEach((pEl) => {
    if (pEl.innerText.startsWith('/')) {
      pEl.replaceWith();
    }
  });
}

/**
 * Get the template name, or undefined if none.
 * @returns {string|void}
 */
export function getTemplateName() {
  document.querySelectorAll('table th').forEach(($th) => {
    if ($th.textContent.toLowerCase().trim() === 'template') {
      const $table = $th.closest('table');
      const template = $table.querySelector('td').textContent;
      const $div = createTag('div', { class: 'template' });
      $div.innerHTML = template;
      $table.parentElement.replaceChild($div, $table);
    }
  });

  const $template = document.querySelector('.template');
  if (!$template) {
    return undefined;
  }

  const template = toClassName($template.textContent);
  $template.remove();
  return template;
}

/**
 * Load the template
 */
export async function loadTemplate(template) {
  const basePath = `/templates/${template}/${template}`;
  emit('preLoadTemplate', { basePath });

  loadCSS(`${basePath}.css`);
  import(`${basePath}.js`).then(({ default: run }) => {
    emit('postLoadTemplate', { basePath });
    run();
    emit('postRunTemplate', { basePath });
  });
}

/**
 * Insert localized footer
 */
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

/**
 * Resize images according to screen width.
 */
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

/**
 * Style all elements matching selector `main a`.
 * Set class tokens to `button primary`.
 *
 * @returns {void}
 */
export function styleButtons() {
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

function setupTestMode() {
  if (window.location.search.indexOf('test') === -1) {
    return;
  }
  // do whatever for testing mode..
  // right now just logging junk
  window.pages.on(undefined, console.debug);
}

export async function decorateDefault() {
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

  if (document.readyState === 'complete') {
    document.body.classList.add('loaded');
  } else {
    window.addEventListener('load', () => document.body.classList.add('loaded'));
  }
}

async function decoratePage() {
  // import('./lazy.js').then((m) => {
  //   m.default();
  // });

  initializeNamespaces();
  setupTestMode();

  const template = getTemplateName();
  if (template) {
    loadTemplate(template);
  } else {
    decorateDefault();
  }

  document.title = document.title.split('<br>').join(' ');

  fixImages();

  const mainEl = document.querySelector('main');
  loadBlocks(mainEl);

  if (window.pages.product) {
    document.getElementById('favicon').href = `/icons/${window.pages.product}.svg`;
  }

  localizeFooter();
}

decoratePage();
