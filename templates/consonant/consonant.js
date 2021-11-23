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

/**
 * log RUM if part of the sample.
 * @param {string} checkpoint identifies the checkpoint in funnel
 * @param {Object} data additional data for RUM sample
 */

// eslint-disable-next-line object-curly-newline
if (!navigator.sendBeacon) {
  window.data = JSON.stringify({ referer: window.location.href, checkpoint: 'unsupported', weight: 1 });
  new Image().src = `https://rum.hlx3.page/.rum/1?data=${window.data}`;
}

export function sampleRUM(checkpoint, data = {}) {
  try {
    window.hlx = window.hlx || {};
    if (!window.hlx.rum) {
      const usp = new URLSearchParams(window.location.search);
      const weight = (usp.get('rum') === 'on') ? 1 : 100; // with parameter, weight is 1. Defaults to 100.
      // eslint-disable-next-line no-bitwise
      const hashCode = (s) => s.split('').reduce((a, b) => (((a << 5) - a) + b.charCodeAt(0)) | 0, 0);
      const id = `${hashCode(window.location.href)}-${new Date().getTime()}-${Math.random().toString(16).substr(2, 14)}`;
      const random = Math.random();
      const isSelected = (random * weight < 1);
      // eslint-disable-next-line object-curly-newline
      window.hlx.rum = { weight, id, random, isSelected };
    }
    const { random, weight, id } = window.hlx.rum;
    if (random && (random * weight < 1)) {
      // eslint-disable-next-line object-curly-newline
      const body = JSON.stringify({ weight, id, referer: window.location.href, generation: 'biz-gen1', checkpoint, ...data });
      const url = `https://rum.hlx3.page/.rum/${weight}`;
      // eslint-disable-next-line no-unused-expressions
      navigator.sendBeacon(url, body); // we should probably use XHR instead of fetch
    }
  } catch (e) {
    // Somethign went wrong
  }
}

sampleRUM('top');
window.addEventListener('load', () => sampleRUM('load'));
document.addEventListener('click', () => sampleRUM('click'));

/**
 * Loads a CSS file.
 * @param {string} href The path to the CSS file
 */
export function loadCSS(href) {
  if (!document.querySelector(`head > link[href="${href}"]`)) {
    const link = document.createElement('link');
    link.setAttribute('rel', 'stylesheet');
    link.setAttribute('href', href);
    link.onload = () => { };
    link.onerror = () => { };
    document.head.appendChild(link);
  }
}

const LANG = {
  EN: 'en',
  DE: 'de',
  FR: 'fr',
  KO: 'ko',
  ES: 'es',
  IT: 'it',
  JP: 'jp',
  BR: 'br',
};

let language;

export function getLanguage() {
  if (language) return language;
  language = LANG.EN;
  const segs = window.location.pathname.split('/');
  if (segs && segs.length > 0) {
    // eslint-disable-next-line no-restricted-syntax
    for (const [, value] of Object.entries(LANG)) {
      if (value === segs[1]) {
        language = value;
        break;
      }
    }
  }
  return language;
}

/**
 * Retrieves the content of a metadata tag.
 * @param {string} name The metadata name (or property)
 * @returns {string} The metadata value
 */
export function getMetadata(name) {
  const attr = name && name.includes(':') ? 'property' : 'name';
  const meta = [...document.head.querySelectorAll(`meta[${attr}="${name}"]`)].map((el) => el.content).join(', ');
  return meta;
}

/**
 * Get the current Helix environment
 * @returns {Object} the env object
 */
export function getHelixEnv() {
  let envName = sessionStorage.getItem('helix-env');
  if (!envName) envName = 'prod';
  const envs = {
    stage: {
      ims: 'stg1',
      adobeIO: 'cc-collab-stage.adobe.io',
      adminconsole: 'stage.adminconsole.adobe.com',
      account: 'stage.account.adobe.com',
      target: false,
    },
    prod: {
      ims: 'prod',
      adobeIO: 'cc-collab.adobe.io',
      adminconsole: 'adminconsole.adobe.com',
      account: 'account.adobe.com',
      target: true,
    },
  };
  const env = envs[envName];

  const overrideItem = sessionStorage.getItem('helix-env-overrides');
  if (overrideItem) {
    const overrides = JSON.parse(overrideItem);
    const keys = Object.keys(overrides);
    env.overrides = keys;

    keys.forEach((value) => {
      env[value] = overrides[value];
    });
  }

  if (env) {
    env.name = envName;
  }
  return env;
}

export function debug(message) {
  const { hostname } = window.location;
  const env = getHelixEnv();
  if (env.name !== 'prod' || hostname === 'localhost') {
    // eslint-disable-next-line no-console
    console.log(message);
  }
}

/**
 * Adds one or more URLs to the dependencies for publishing.
 * @param {string|[string]} url The URL(s) to add as dependencies
 */
export function addPublishDependencies(url) {
  const urls = Array.isArray(url) ? url : [url];
  window.hlx = window.hlx || {};
  if (window.hlx.dependencies && Array.isArray(window.hlx.dependencies)) {
    window.hlx.dependencies.concat(urls);
  } else {
    window.hlx.dependencies = urls;
  }
}

/**
 * Sanitizes a name for use as class name.
 * @param {*} name The unsanitized name
 * @returns {string} The class name
 */
export function toClassName(name) {
  return name && typeof name === 'string'
    ? name.toLowerCase().replace(/[^0-9a-z]/gi, '-')
    : '';
}

/**
 * Wraps each section in an additional {@code div}.
 * @param {[Element]} sections The sections
 */
function wrapSections(sections) {
  sections.forEach((div) => {
    if (!div.id) {
      const wrapper = document.createElement('div');
      wrapper.className = 'section-wrapper';
      div.parentNode.appendChild(wrapper);
      wrapper.appendChild(div);
    }
  });
}

/**
 * Decorates a block.
 * @param {Element} block The block element
 */
export function decorateBlock(block) {
  const classes = Array.from(block.classList.values());
  let blockName = classes[0];
  if (!blockName) return;
  const section = block.closest('.section-wrapper');
  if (section) {
    section.classList.add(`${blockName}-container`.replace(/--/g, '-'));
  }
  const blocksWithVariants = ['columns', 'cards', 'marquee'];
  blocksWithVariants.forEach((b) => {
    if (blockName.startsWith(`${b}-`)) {
      const options = blockName.substring(b.length + 1).split('-').filter((opt) => !!opt);
      blockName = b;
      block.classList.add(b);
      block.classList.add(...options);
    }
  });
  if (section) {
    section.classList.add(`${blockName}-container`.replace(/--/g, '-'));
    const $sectionTitle = section.querySelector('h1') || section.querySelector('h2') || section.querySelector('h3') || section.querySelector('h4') || section.querySelector('h5');
    if ($sectionTitle && typeof $sectionTitle !== 'undefined') {
      section.id = `${$sectionTitle.id}`;
    }
  }

  block.classList.add('block');
  block.setAttribute('data-block-name', blockName);
}

/**
 * Builds a block DOM Element from a two dimensional array
 * @param {string} blockName name of the block
 * @param {any} content two dimensional array or string or object of content
 */
function buildBlock(blockName, content) {
  const table = Array.isArray(content) ? content : [[content]];
  const blockEl = document.createElement('div');
  // build image block nested div structure
  blockEl.classList.add(blockName);
  table.forEach((row) => {
    const rowEl = document.createElement('div');
    row.forEach((col) => {
      const colEl = document.createElement('div');
      const vals = col.elems ? col.elems : [col];
      vals.forEach((val) => {
        if (val) {
          if (typeof val === 'string') {
            colEl.innerHTML += val;
          } else {
            colEl.appendChild(val);
          }
        }
      });
      rowEl.appendChild(colEl);
    });
    blockEl.appendChild(rowEl);
  });
  return (blockEl);
}

/**
 * removes formatting from images.
 * @param {Element} mainEl The container element
 */
function removeStylingFromImages(mainEl) {
  // remove styling from images, if any
  const styledImgEls = [...mainEl.querySelectorAll('strong picture'), ...mainEl.querySelectorAll('em picture')];
  styledImgEls.forEach((imgEl) => {
    const parentEl = imgEl.closest('p');
    parentEl.prepend(imgEl);
    parentEl.lastChild.remove();
  });
}

/**
 * returns an image caption of a picture elements
 * @param {Element} picture picture element
 */
function getImageCaption(picture) {
  const parentEl = picture.parentNode;
  const parentSiblingEl = parentEl.nextElementSibling;
  return (parentSiblingEl && parentSiblingEl.firstChild.nodeName === 'EM' ? parentSiblingEl : undefined);
}

/**
 * builds images blocks from default content.
 * @param {Element} mainEl The container element
 */
function buildImageBlocks(mainEl) {
  // select all non-featured, default (non-images block) images
  const imgEls = [...mainEl.querySelectorAll(':scope > div > p > picture')];
  imgEls.forEach((imgEl) => {
    const parentEl = imgEl.parentNode;
    const imagesBlockEl = buildBlock('images', {
      elems: [parentEl.cloneNode(true), getImageCaption(imgEl)],
    });
    parentEl.parentNode.insertBefore(imagesBlockEl, parentEl);
    parentEl.remove();
  });
}

/**
 * Decorates all blocks in a container element.
 * @param {Element} main The container element
 */
function decorateBlocks(main) {
  main
    .querySelectorAll('div.section-wrapper > div > div')
    .forEach((block) => decorateBlock(block));
}

/**
 * Builds all synthetic blocks in a container element.
 * @param {Element} main The container element
 */
function buildAutoBlocks(mainEl) {
  removeStylingFromImages(mainEl);
  try {
    buildImageBlocks(mainEl);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Auto Blocking failed', error);
  }
}

function unwrapBlock(block) {
  const section = block.parentNode;
  const els = [...section.children];
  const blockSection = document.createElement('div');
  const postBlockSection = document.createElement('div');
  const nextSection = section.nextSibling;
  section.parentNode.insertBefore(blockSection, nextSection);
  section.parentNode.insertBefore(postBlockSection, nextSection);

  let appendTo;
  els.forEach((el) => {
    if (el === block) appendTo = blockSection;
    if (appendTo) {
      appendTo.appendChild(el);
      appendTo = postBlockSection;
    }
  });
  if (!section.hasChildNodes()) {
    section.remove();
  }
  if (!blockSection.hasChildNodes()) {
    blockSection.remove();
  }
  if (!postBlockSection.hasChildNodes()) {
    postBlockSection.remove();
  }
}

function splitSections() {
  document.querySelectorAll('main > div > div').forEach((block) => {
    const blocksToSplit = ['article-header', 'recommended-articles'];
    if (blocksToSplit.includes(block.className)) {
      unwrapBlock(block);
    }
  });
}

function removeEmptySections() {
  document.querySelectorAll('main > div:empty').forEach((div) => {
    div.remove();
  });
}

/**
 * Build figcaption element
 * @param {Element} pEl The original element to be placed in figcaption.
 * @returns figCaptionEl Generated figcaption
 */
export function buildCaption(pEl) {
  const figCaptionEl = document.createElement('figcaption');
  pEl.classList.add('caption');
  figCaptionEl.append(pEl);
  return figCaptionEl;
}

/**
 * Build figure element
 * @param {Element} blockEl The original element to be placed in figure.
 * @returns figEl Generated figure
 */
export function buildFigure(blockEl) {
  const figEl = document.createElement('figure');
  figEl.classList.add('figure');
  // content is picture only, no caption or link
  if (blockEl.firstChild) {
    if (blockEl.firstChild.nodeName === 'PICTURE' || blockEl.firstChild.nodeName === 'VIDEO') {
      figEl.append(blockEl.firstChild);
    } else if (blockEl.firstChild.nodeName === 'P') {
      const pEls = Array.from(blockEl.children);
      pEls.forEach((pEl) => {
        if (pEl.firstChild) {
          if (pEl.firstChild.nodeName === 'PICTURE' || pEl.firstChild.nodeName === 'VIDEO') {
            figEl.append(pEl.firstChild);
          } else if (pEl.firstChild.nodeName === 'EM') {
            const figCapEl = buildCaption(pEl);
            figEl.append(figCapEl);
          } else if (pEl.firstChild.nodeName === 'A') {
            const picEl = figEl.querySelector('picture');
            if (picEl) {
              pEl.firstChild.textContent = '';
              pEl.firstChild.append(picEl);
            }
            figEl.prepend(pEl.firstChild);
          }
        }
      });
    // catch link-only figures (like embed blocks);
    } else if (blockEl.firstChild.nodeName === 'A') {
      figEl.append(blockEl.firstChild);
    }
  }
  return figEl;
}

/**
 * Loads JS and CSS for a block.
 * @param {Element} block The block element
 */
export async function loadBlock(block, eager = false) {
  if (!block.getAttribute('data-block-loaded')) {
    block.setAttribute('data-block-loaded', true);
    const blockName = block.getAttribute('data-block-name');
    try {
      loadCSS(`/templates/consonant/blocks/${blockName}/${blockName}.css`);
      const mod = await import(`/templates/consonant/blocks/${blockName}/${blockName}.js`);
      if (mod.default) {
        await mod.default(block, blockName, document, eager);
      }
    } catch (err) {
      debug(`failed to load module for ${blockName}`, err);
    }
  }
}

/**
 * Loads JS and CSS for all blocks in a container element.
 * @param {Element} main The container element
 */
async function loadBlocks(main) {
  main
    .querySelectorAll('div.section-wrapper > div > .block')
    .forEach(async (block) => loadBlock(block));
}

/**
 * Extracts the config from a block.
 * @param {Element} block The block element
 * @returns {object} The block config
 */
export function readBlockConfig(block) {
  const config = {};
  block.querySelectorAll(':scope>div').forEach((row) => {
    if (row.children) {
      const cols = [...row.children];
      if (cols[1]) {
        const valueEl = cols[1];
        const name = toClassName(cols[0].textContent);
        let value = '';
        if (valueEl.querySelector('a')) {
          const aArr = [...valueEl.querySelectorAll('a')];
          if (aArr.length === 1) {
            value = aArr[0].href;
          } else {
            value = aArr.map((a) => a.href);
          }
        } else if (valueEl.querySelector('p')) {
          const pArr = [...valueEl.querySelectorAll('p')];
          if (pArr.length === 1) {
            value = pArr[0].textContent;
          } else {
            value = pArr.map((p) => p.textContent);
          }
        } else value = row.children[1].textContent;
        config[name] = value;
      }
    }
  });
  return config;
}

/**
 * Normalizes all headings within a container element.
 * @param {Element} el The container element
 * @param {[string]]} allowedHeadings The list of allowed headings (h1 ... h6)
 */
export function normalizeHeadings(el, allowedHeadings) {
  const allowed = allowedHeadings.map((h) => h.toLowerCase());
  el.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach((tag) => {
    const h = tag.tagName.toLowerCase();
    if (allowed.indexOf(h) === -1) {
      // current heading is not in the allowed list -> try first to "promote" the heading
      let level = parseInt(h.charAt(1), 10) - 1;
      while (allowed.indexOf(`h${level}`) === -1 && level > 0) {
        level -= 1;
      }
      if (level === 0) {
        // did not find a match -> try to "downgrade" the heading
        while (allowed.indexOf(`h${level}`) === -1 && level < 7) {
          level += 1;
        }
      }
      if (level !== 7) {
        tag.outerHTML = `<h${level}>${tag.textContent}</h${level}>`;
      }
    }
  });
}

/**
 * Returns a picture element with webp and fallbacks
 * @param {string} src The image URL
 * @param {boolean} eager load image eager
 * @param {Array} breakpoints breakpoints and corresponding params (eg. width)
 */

export function createOptimizedPicture(src, alt = '', eager = false, breakpoints = [{ media: '(min-width: 400px)', width: '2000' }, { width: '750' }]) {
  const url = new URL(src, window.location.href);
  const picture = document.createElement('picture');
  const { pathname } = url;
  const ext = pathname.substring(pathname.lastIndexOf('.') + 1);

  // webp
  breakpoints.forEach((br) => {
    const source = document.createElement('source');
    if (br.media) source.setAttribute('media', br.media);
    source.setAttribute('type', 'image/webp');
    source.setAttribute('srcset', `${pathname}?width=${br.width}&format=webply&optimize=medium`);
    picture.appendChild(source);
  });

  // fallback
  breakpoints.forEach((br, i) => {
    if (i < breakpoints.length - 1) {
      const source = document.createElement('source');
      if (br.media) source.setAttribute('media', br.media);
      source.setAttribute('srcset', `${pathname}?width=${br.width}&format=${ext}&optimize=medium`);
      picture.appendChild(source);
    } else {
      const img = document.createElement('img');
      img.setAttribute('src', `${pathname}?width=${br.width}&format=${ext}&optimize=medium`);
      img.setAttribute('loading', eager ? 'eager' : 'lazy');
      img.setAttribute('alt', alt);
      picture.appendChild(img);
    }
  });

  return picture;
}

/**
 * Block Helpers
 */
export function insertAfter(newNode, existingNode) {
  existingNode.parentNode.insertBefore(newNode, existingNode.nextSibling);
}
export function isNodeName(node, name) {
  if (!node || typeof node !== 'object') return false;
  return node.nodeName.toLowerCase() === name.toLowerCase();
}
export function isAttr(node, attr, val) {
  if (!node || typeof node !== 'object') return false;
  return node.getAttribute(attr) === val;
}

/**
 * Decorate Buttons
 */
export function decorateButtons(block = document) {
  const $blocksWithoutButton = ['header', 'footer', 'cards'];
  block.querySelectorAll(':scope a').forEach(($a) => {
    $a.title = $a.title || $a.textContent || $a.href;
    const $block = $a.closest('div.section-wrapper > div > div');
    let blockClassNamesString;
    let blockClassNames;
    const blockNames = [];
    if ($block) {
      blockClassNamesString = $block.className;
      blockClassNames = blockClassNamesString.split(' ');
      blockClassNames.forEach((className) => {
        blockNames.push(className);
      });
    }
    if (!blockNames.some((e) => $blocksWithoutButton.includes(e))) {
      let buttonsOnly = true;
      let $c = $a.parentElement;
      if (!isNodeName($c, 'p') && (isNodeName($c, 'em') || isNodeName($c, 'strong'))) {
        $c = $c.parentElement;
        if (!isNodeName($c, 'p') && (isNodeName($c, 'em') || isNodeName($c, 'strong'))) {
          $c = $c.parentElement;
        }
      }
      const $elementsAround$a = Array.from($c.childNodes);
      $elementsAround$a.forEach((e) => {
        if (!isNodeName(e, 'a') && !isNodeName(e, 'em') && !isNodeName(e, 'strong') && !isNodeName(e, '#text')) {
          buttonsOnly = false;
        } else if (isNodeName(e, '#text')) {
          const re = new RegExp('^\\s*$');
          if (!re.test(e.textContent)) {
            buttonsOnly = false;
          }
        }
      });
      if (!$a.querySelector('img') && buttonsOnly) {
        $c.classList.add('button-container');
        const $up = $a.parentElement;
        const $twoUp = $a.parentElement.parentElement;
        const $threeUp = $a.parentElement.parentElement.parentElement;
        if (isNodeName($up, 'p')) {
          $a.className = 'button primary'; // default
        }
        if (isNodeName($up, 'strong') && isNodeName($twoUp, 'p')) {
          $a.className = 'button accent';
        }
        if (isNodeName($up, 'em') && isNodeName($twoUp, 'p')) {
          $a.className = 'button secondary';
        }
        if (((isNodeName($up, 'em') && isNodeName($twoUp, 'strong'))
            || (isNodeName($up, 'strong') && isNodeName($twoUp, 'em')))
            && isNodeName($threeUp, 'p')) {
          $a.className = 'button transparent';
        }
      }
    }
  });
}

/**
 * Change h6 to 'detail'
 */
export function updateH6toDetail(block = document) {
  block.querySelectorAll(':scope h6').forEach(($h6) => {
    const n = document.createElement('p');
    n.classList.add('detail');
    const attr = $h6.attributes;
    for (let i = 0, len = attr.length; i < len; i += 1) {
      n.setAttribute(attr[i].name, attr[i].value);
    }
    n.innerHTML = $h6.innerHTML;
    $h6.parentNode.replaceChild(n, $h6);
  });
}

/**
 * Decorates the main element.
 * @param {Element} main The main element
 */
function decoratePictures(main) {
  main.querySelectorAll('img[src*="/media_"').forEach((img, i) => {
    const newPicture = createOptimizedPicture(img.src, img.alt, !i);
    const picture = img.closest('picture');
    if (picture) picture.parentElement.replaceChild(newPicture, picture);
  });
}

/**
 * Decorates the main element.
 * @param {Element} main The main element
 */
export function decorateMain(main) {
  // forward compatible pictures redecoration
  decoratePictures(main);
  buildAutoBlocks(main);
  splitSections();
  removeEmptySections();
  wrapSections(main.querySelectorAll(':scope > div'));
  decorateBlocks(main);
  decorateButtons(main);
  updateH6toDetail(main);
  document.documentElement.lang = getLanguage();
}

/**
 * Adds the favicon.
 * @param {string} href The favicon URL
 */
export function addFavIcon(href) {
  const link = document.createElement('link');
  link.rel = 'icon';
  link.type = 'image/svg+xml';
  link.href = href;
  const existingLink = document.querySelector('head link[rel="icon"]');
  if (existingLink) {
    existingLink.parentElement.replaceChild(link, existingLink);
  } else {
    document.getElementsByTagName('head')[0].appendChild(link);
  }
}

/**
 * forward looking *.metadata.json experiment
 * fetches metadata.json of page
 * @param {path} path to *.metadata.json
 * @returns {Object} containing sanitized meta data
 */

async function getMetadataJson(path) {
  const resp = await fetch(path.split('.')[0]);
  const text = await resp.text();
  const headStr = text.split('<head>')[1].split('</head>')[0];
  const head = document.createElement('head');
  head.innerHTML = headStr;
  const metaTags = head.querySelectorAll(':scope > meta');
  const meta = {};
  metaTags.forEach((metaTag) => {
    const name = metaTag.getAttribute('name') || metaTag.getAttribute('property');
    const value = metaTag.getAttribute('content');
    if (meta[name]) {
      meta[name] += `, ${value}`;
    } else {
      meta[name] = value;
    }
  });
  return (JSON.stringify(meta));
}

/**
 * gets a blog article index information by path.
 * @param {string} path indentifies article
 * @returns {object} article object
 */

export async function getBlogArticle(path) {
  const json = await getMetadataJson(`${path}.metadata.json`);
  const meta = JSON.parse(json);
  const articleMeta = {
    description: meta.description,
    title: meta['og:title'],
    image: meta['og:image'],
    imageAlt: meta['og:image:alt'],
    date: meta['publication-date'],
    path,
    category: meta.category,
  };
  return (articleMeta);
}

/**
 * loads a script by adding a script tag to the head.
 * @param {string} url URL of the js file
 * @param {Function} callback callback on load
 * @param {string} type type attribute of script tag
 * @returns {Element} script element
 */

export function loadScript(url, callback, type) {
  const head = document.querySelector('head');
  const script = document.createElement('script');
  script.setAttribute('src', url);
  if (type) {
    script.setAttribute('type', type);
  }
  head.append(script);
  script.onload = callback;
  return script;
}

/**
 * loads everything needed to get to LCP.
 */
async function loadEager() {
  const main = document.querySelector('main');
  if (main) {
    decorateMain(main);
    document.querySelector('body').classList.add('appear');
    const lcpBlocks = ['featured-article', 'article-header'];
    const block = document.querySelector('.block');
    const hasLCPBlock = (block && lcpBlocks.includes(block.getAttribute('data-block-name')));
    if (hasLCPBlock) await loadBlock(block, true);
    const lcpCandidate = document.querySelector('main img');
    const loaded = {
      then: (resolve) => {
        if (lcpCandidate && !lcpCandidate.complete) {
          lcpCandidate.addEventListener('load', () => resolve());
          lcpCandidate.addEventListener('error', () => resolve());
        } else {
          resolve();
        }
      },
    };
    await loaded;
  }
}

/**
 * loads everything that doesn't need to be delayed.
 */
async function loadLazy() {
  const main = document.querySelector('main');

  // post LCP actions go here
  sampleRUM('lcp');

  loadBlocks(main);
  loadCSS('/templates/consonant/styles/lazy-styles.css');
  // addFavIcon('/templates/consonant/styles/favicon.svg');
}

/**
 * loads everything that happens a lot later, without impacting
 * the user experience.
 */
function loadDelayed() {
  /* trigger delayed.js load */
  const delayedScript = '/templates/consonant/scripts/delayed.js';
  const usp = new URLSearchParams(window.location.search);
  const delayed = usp.get('delayed');

  if (!(delayed === 'off' || document.querySelector(`head script[src="${delayedScript}"]`))) {
    let ms = 3500;
    const delay = usp.get('delay');
    if (delay) ms = +delay;
    setTimeout(() => {
      loadScript(delayedScript, null, 'module');
    }, ms);
  }
}

/**
 * Decorates the page.
 */
async function decoratePage() {
  await loadEager();

  loadLazy();
  loadDelayed();
}

decoratePage();

function setHelixEnv(name, overrides) {
  if (name) {
    sessionStorage.setItem('helix-env', name);
    if (overrides) {
      sessionStorage.setItem('helix-env-overrides', JSON.stringify(overrides));
    } else {
      sessionStorage.removeItem('helix-env-overrides');
    }
  } else {
    sessionStorage.removeItem('helix-env');
    sessionStorage.removeItem('helix-env-overrides');
  }
}

function displayEnv() {
  try {
    /* setup based on URL Params */
    const usp = new URLSearchParams(window.location.search);
    if (usp.has('helix-env')) {
      const env = usp.get('helix-env');
      setHelixEnv(env);
    }

    /* setup based on referrer */
    if (document.referrer) {
      const url = new URL(document.referrer);
      if (window.location.hostname !== url.hostname) {
        debug(`external referrer detected: ${document.referrer}`);
      }
    }
  } catch (e) {
    debug(`display env failed: ${e.message}`);
  }
}
displayEnv();
/*
 * lighthouse performance instrumentation helper
 * (needs a refactor)
 */

function stamp(message) {
  if (window.name.includes('performance')) {
    debug(`${new Date() - performance.timing.navigationStart}:${message}`);
  }
}

stamp('start');

function registerPerformanceLogger() {
  try {
    const polcp = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      stamp(JSON.stringify(entries));
      debug(entries[0].element);
    });
    polcp.observe({ type: 'largest-contentful-paint', buffered: true });

    const pols = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      stamp(JSON.stringify(entries));
      debug(entries[0].sources[0].node);
    });
    pols.observe({ type: 'layout-shift', buffered: true });

    const pores = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      entries.forEach((entry) => {
        stamp(`resource loaded: ${entry.name} - [${Math.round(entry.startTime + entry.duration)}]`);
      });
    });

    pores.observe({ type: 'resource', buffered: true });
  } catch (e) {
    // no output
  }
}

if (window.name.includes('performance')) registerPerformanceLogger();
