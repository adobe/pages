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

/* eslint-disable no-console, import/no-cycle, consistent-return  */

import {
  decorateButtons,
  decorateEmbeds,
  decorateNextStep,
  equalizer,
  linkInNewTab,
  setExternalLinks,
  wrapSections,
} from './default-blocks.js';

// eslint-disable-next-line no-use-before-define
const lgr = makeLogger('scripts');

/**
 * Resources included by type
 * map from href/name -> required, promise
 * @type {Record<string, import('./index').IncludedItem>}
 */
const cssIncluded = {};
/**
 * @type {Record<string, import('./index').IncludedItem>}
 */
const jsIncluded = {};

/**
 * Emitter handlers
 * @type {Record<string, Function[]>}
 */
const handlers = {};

/**
 * Whether namespace has been initialized
 */
let nsInit = false;
/**
 * @type {Promise<void>}
 */
let decoratedProm = null;

/**
 * Emit event.
 *
 * @param {string} event
 * @param {Object} data
 * @returns {void}
 */
export function emit(event, data) {
  const hs = handlers[event];
  const allHs = handlers[undefined];

  if (hs) hs.forEach((h) => h && h.call(undefined, data));
  if (allHs) allHs.forEach((h) => h && h.call(undefined, event, data));
}

/**
 * Create a logger
 * @param {string} ns - namespace
 * @returns {import('./index').Logger}
 */
export function makeLogger(ns) {
  const l = (lvl, msgs) => {
    emit('log', { lvl, ns, msgs });
  };
  return {
    log: (...msgs) => l('LOG', msgs),
    debug: (...msgs) => l('DEBUG', msgs),
    error: (...msgs) => l('ERROR', msgs),
  };
}

/**
 * Register callback for when event occurs.
 * `undefined` event name is called for every event.
 *
 * @param {string}    event name
 * @param {Function}  handler to call
 * @returns {Function} to remove handler, for deconstructing
 */
export function registerListener(event, handler) {
  // eslint-disable-next-line no-multi-assign
  const hs = (handlers[event] = handlers[event] || []);
  const ind = hs.push(handler) - 1;
  return () => {
    delete hs[ind];
  };
}

/**
 * Initialize global namespaces
 */
export function initializeNamespaces() {
  if (nsInit) return;

  window.hlx = window.hlx || {};
  window.hlx.dependencies = window.hlx.dependencies || [];

  // eslint-disable-next-line no-multi-assign
  const ns = (window.pages = window.pages || {});

  if (!ns.on) ns.on = registerListener;

  const pathSegments = window.location.pathname.match(/[\w-]+(?=\/)/g);
  if (pathSegments) {
    const [product, locale, project] = pathSegments;
    Object.assign(ns, { product, locale, project });
  }

  // set decoratedProm, and add setter that resolves it
  let resolve;
  let decorated = false;
  decoratedProm = new Promise((res) => {
    resolve = res;
  });
  Object.defineProperty(ns, 'decorated', {
    set: (val) => {
      decorated = val;
      if (val) resolve();
    },
    get: () => decorated,
  });
  nsInit = true;
}

/**
 * Get an included CSS item,
 * or undefined if not included [yet].
 * @param {string} href
 * @returns {import('./index').IncludedItem}
 */
export function getCSSIncluded(href) {
  return cssIncluded[href];
}

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
 * @param {string} href to load
 * @param {boolean} [required = false] Required to load before appearing main
 * @param {boolean} [useImport = true] use dynamic import
 *
 * @returns {Promise<any>}
 */
export function loadJSModule(href, required = false, useImport = true) {
  lgr.debug('loadJS', { href });

  if (href in jsIncluded) return Promise.resolve();

  let prom;
  if (useImport) {
    prom = import(href).then(({ default: run }) => {
      if (typeof run === 'function') {
        return run();
      }
    });
  } else {
    prom = new Promise((resolve, reject) => {
      const module = document.createElement('script');
      module.setAttribute('type', 'module');
      module.setAttribute('src', href);
      document.head.appendChild(module);
      module.onerror = reject;
      module.onload = resolve;
    });
  }
  jsIncluded[href] = { prom, req: !!required };

  return prom;
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
  lgr.debug('externalLinks', { selector });

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
      $img.src = `/media_${id}.${ext}`;
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
        /* html */
        $div.innerHTML = `<div class="video-thumb" style="background-image:url(https://img.youtube.com/vi/${vid}/0.jpg)"><svg xmlns="http://www.w3.org/2000/svg" width="731" height="731" viewBox="0 0 731 731">
              <g id="Group_23" data-name="Group 23" transform="translate(-551 -551)">
                  <circle id="Ellipse_14" data-name="Ellipse 14" cx="365.5" cy="365.5" r="365.5" transform="translate(551 551)" fill="#1473e6"/>
                  <path id="Polygon_3" data-name="Polygon 3" d="M87.5,0,175,152H0Z" transform="translate(992.5 829.5) rotate(90)" fill="#fff"/>
              </g>
              </svg>
              </div>`;
        $div.addEventListener('click', () => {
          /* html */
          $div.innerHTML = `<div style="left: 0; width: 100%; height: 0; position: relative; padding-bottom: 56.25%;"><iframe src="https://www.youtube.com/embed/${vid}?rel=0&autoplay=1" style="border: 0; top: 0; left: 0; width: 100%; height: 100%; position: absolute;" allowfullscreen scrolling="no" allow="autoplay; encrypted-media; accelerometer; gyroscope; picture-in-picture"></iframe></div>`;
        });
      } else {
        $div.innerHTML = $td.innerHTML;
        $div.childNodes.forEach(($child) => {
          if (isNodeName($child, '#text')) {
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

/**
 * Load localized header
 */
export async function loadLocalHeader() {
  decorateTables();
  const $inlineHeader = document.querySelector('main div.header-block');
  if ($inlineHeader) {
    const $header = document.querySelector('header');
    $inlineHeader.childNodes.forEach((e, i) => {
      if (isNodeName(e, 'DIV') && !i) {
        const $p = createTag('div');
        const inner = /* html */`<img class="icon icon-${window.pages.product}" src="/icons/${window.pages.product}.svg">${e.outerHTML}`;
        $p.innerHTML = inner;
        e.parentNode.replaceChild($p, e);
      }
      if (isNodeName(e, 'P') && !i) {
        const inner = /* html */`<img class="icon icon-${window.pages.product}" src="/icons/${window.pages.product}.svg">${e.innerHTML}`;
        e.innerHTML = inner;
      }
    });
    $header.innerHTML = /* html */`<div>${$inlineHeader.innerHTML}</div>`;
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
let aMD = false;
export async function appearMain() {
  // only happens once
  if (aMD) return;
  aMD = true;

  lgr.debug('appearMain');

  // wait for page to be decorated
  await decoratedProm;
  // and all required css to load
  const req = Object.values(cssIncluded).filter((c) => c.req);
  lgr.debug('appearMain:wait', { req });
  await Promise.all(req);

  const pathSplits = window.location.pathname.split('/');
  const pageName = pathSplits[pathSplits.length - 1].split('.')[0];
  const { product, family, project } = window.pages;
  const classes = [product, family, project, pageName].filter((c) => !!c);
  document.body.classList.add(...classes);
  classify('main', 'appear');

  emit('mainVisible');
}

/**
 * Loads a CSS file.
 * @param {string} href The path to the CSS file.
 * @param {boolean} [required=false] If required, appearMain() will wait until the style is loaded.
 *                                   All required CSS should be defined in the first tick,
 *                                   or before the first call to appearMain.
 * @param {boolean} [prepend=false] Whether to prepend style to head, otherwise append.
 */
export async function loadCSS(href, required, prepend) {
  lgr.debug('loadCSS', { href });

  if (href in cssIncluded) return;

  const prom = new Promise((resolve) => {
    const link = document.createElement('link');
    link.setAttribute('rel', 'stylesheet');
    link.setAttribute('href', href);
    const after = () => {
      emit('cssLoaded', { href });
      appearMain();
      resolve();
    };
    link.onload = after;
    link.onerror = after;
    if (prepend) {
      document.head.prepend(link);
    } else {
      document.head.appendChild(link);
    }
  });

  cssIncluded[href] = { prom, req: !!required };
  return prom;
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

/**
 *
 * @param {boolean} show -
 * @param  {...(string|HTMLElement)} sels
 */
function tEV(show, ...sels) {
  sels.forEach((s) => {
    if (typeof s === 'string') {
      tEV(show, ...document.querySelectorAll(s));
    } else {
      s.style.opacity = show ? '1' : '0';
    }
  });
}
/**
 * Hide elements or selectors
 * @param  {...(string|HTMLElement)} sels
 */
export function hideElements(...sels) {
  tEV(false, ...sels);
}
/**
 * Show elements or selectors
 * @param  {...(string|HTMLElement)} sels
 */
export function showElements(...sels) {
  tEV(true, ...sels);
}

/**
 * Read config from a block that is a table.
 * Treats each row of the table as an entry in
 * the output config.
 *
 * @param {HTMLElement} $block
 * @returns {Object}
 */
export function readBlockConfig($block) {
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

/**
 * Load a block-like module directory
 * Contains optional .js and .css files.
 * @param {HTMLElement} $el - The element passed to the decorator
 * @param {string} path - to the module directory, ending with `/`
 * @param {string} name - of module, used for name of .js and .css files loaded
 * @param {boolean} [reqCss=false] - whether CSS is required before appearMain
 * @returns {{jsProm: Promise, cssProm: Promise}}
 */
export function loadModuleDir($el, path, name, reqCss = false) {
  lgr.debug('loadModuleDir', { name, path });
  const basePath = `${path}${name}`;
  const cssProm = loadCSS(`${basePath}.css`, reqCss, false);
  const jsProm = import(`${basePath}.js`)
    .then((mod) => {
      if (mod.default) {
        return mod.default($el, name, document);
      }
      return undefined;
    })
    .catch((e) => console.error(`failed to load module for ${basePath}`, e));

  return { jsProm, cssProm };
}

/**
 * Load a component embed
 */
export async function loadComponent($component, embedData) {
  const { fileNoExt: componentName, path } = embedData;
  lgr.debug('loadComponent', embedData);
  const { cssProm, jsProm } = loadModuleDir($component, path, componentName, true);
  return Promise.all([cssProm, jsProm]);
}

/**
 * Load a block
 */
export async function loadBlock($block) {
  const reqCSSBlocks = ['form'];
  const ignoredBlocks = ['missionbg'];
  const blockName = $block.getAttribute('data-block-name');

  if (ignoredBlocks.includes(blockName)) return;

  const reqCSS = reqCSSBlocks.includes(blockName);
  lgr.debug('loadBlock', { blockName });
  const { jsProm } = loadModuleDir($block, `/pages/blocks/${blockName}/`, blockName, reqCSS);
  return jsProm;
}

export function loadBlocks($main) {
  $main
    .querySelectorAll('div.section-wrapper > div > .block')
    .forEach(async ($block) => loadBlock($block));
}

function handleSpecialBlock(blockName, ogBlockName) {
  lgr.debug('handleSpecialBlock', { blockName, ogBlockName });

  const options = [blockName];

  if (ogBlockName.includes('nav')) {
    options.push('header-block');
  }

  if (ogBlockName.includes('checklist')) {
    document.getElementsByTagName('body')[0].classList.add('checklist-page');
  }

  if (['missiontimeline', 'missionbg'].includes(blockName)) {
    const msnPath = '/pages/blocks/mission-series/';

    loadJSModule(`${msnPath}/background.js`);
    // loadJSModule(`${msnPath}/iframe.js`);

    // loadCSS(`${msnPath}/iframe.css`);
    loadCSS(`${msnPath}/background.css`);
    loadCSS(`${msnPath}/missiontimeline.css`);
  }

  return { options, blockName };
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
    'hero', 'tutorials', 'list',
  ];
  const blocksWithSpecialCases = ['checklist', 'nav', 'missiontimeline', 'missionbg'];

  $main.querySelectorAll(query).forEach(($block) => {
    const classes = Array.from($block.classList.values());
    lgr.debug('decorateBlock', { classes });
    let blockName = classes[0];
    if (!blockName) return;

    if (classes.length > 1) {
      const cls = $block.classList.item(0);
      loadCSS(`/pages/blocks/${cls}/${cls}.css`);
      return;
    }

    let options = [];
    blocksWithOptions.forEach((b) => {
      if (blockName.startsWith(`${b}-`)) {
        options = blockName.substring(b.length + 1).split('-').filter((opt) => !!opt);
        blockName = b;
        $block.classList.add(b);
        $block.classList.add(...options);
      }
    });

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
    if ($section) {
      $section.classList.add(`${blockName}-container`.replace(/--/g, '-'));
      $section.classList.add(...options);
    }
    $block.classList.add('block');
    $block.setAttribute('data-block-name', blockName);
  });
}

/**
 * Parse embed path
 *
 * @param {string} path
 * @returns {import('./index.d.ts').EmbedData}
 */
export function parseEmbedPath(path) {
  let cleanPath = path.toLowerCase().replace(/([^:]\/)\/+/g, '$1').trim();
  const segs = cleanPath.split('/').filter((s) => !!s);

  const indexDirEmbed = cleanPath.endsWith('/');
  const componentEmbed = segs.length > 0 && segs[0] === 'components';
  const type = componentEmbed ? 'component' : 'content';

  let lastSeg = segs.pop();
  const filename = lastSeg || '';
  const dir = segs[segs.length - 1] || '';
  const fileNoExt = (indexDirEmbed ? lastSeg : filename.split('.')[0]) || '';

  if (componentEmbed && indexDirEmbed) {
    lastSeg += '/'; // end with /
  } else if (componentEmbed && !indexDirEmbed) {
    // ie. /components/name.html
    segs.push(fileNoExt);
    lastSeg = ''; // end with /
  } else if (!componentEmbed && indexDirEmbed) {
    // ie. /content/thing/
    segs.push(lastSeg);
    lastSeg = 'index.plain.html';
  } else if (!componentEmbed) {
    // ie. /content/thing.html
    lastSeg = `${fileNoExt}.plain.html`;
  }

  cleanPath = `/${segs.join('/')}/${lastSeg}`;
  return {
    filename,
    fileNoExt,
    path: cleanPath,
    type,
    dirname: dir.replace(/[^a-z0-9]/g, ''),
    basename: fileNoExt.replace(/[^a-z0-9]/g, ''),
  };
}

/**
 * Insert content embed
 * @param {HTMLElement} el
 * @param {import('./index').EmbedData} data
 * @returns {Promise<void>}
 */
async function insertContentEmbed(el, data) {
  const { path, basename, dirname } = data;
  const r = await fetch(path);
  if (!r.ok) {
    console.error('Failed to fetch content embed: ', data);
    return;
  }

  const text = await r.text();
  const wrap = createTag('div', { class: `embed embed-internal embed-internal-${basename} embed-internal-${dirname}` });
  wrap.innerHTML = text;
  el.replaceWith(wrap);
}

/**
 * Insert component embed
 * @param {HTMLElement} el
 * @param {import('./index').EmbedData} data
 * @returns {Promise<void>}
 */
async function insertComponentEmbed(el, data) {
  const { fileNoExt } = data;
  const $component = createTag('div', { 'data-component-name': fileNoExt });
  el.parentNode.replaceChild($component, el);
  await loadComponent($component, data);
}

/**
 * Query for all p elements, replace ones that appear to be paths
 * with their block/component counterpart.
 *
 * Treat blocks starting with /components/ as sourced from code,
 * treat all other embed paths as content and fetched as plain.html
 */
export async function replaceEmbeds() {
  // matches "/some/path/", "/some/file.ext", "/some/path 2/file.html", etc.
  // but not "/some/file", "./some/file.ext"
  const embedRE = /^(\/[^/]+)+([/]|\.{1}[\w]+)$/;
  const pEls = document.querySelectorAll('p');
  const proms = ([...pEls])
    .filter(($p) => {
      const txt = $p.innerText;
      return embedRE.test(txt);
    })
    .map(async ($p) => {
      const ogPath = $p.innerText;
      const embedData = parseEmbedPath(ogPath);
      const { type } = embedData;

      lgr.debug('replaceEmbed', {
        ogPath, embedData,
      });

      if (type === 'content') {
        await insertContentEmbed($p, embedData);
      } else {
        await insertComponentEmbed($p, embedData);
      }
    });
  await Promise.all(proms);
}

/**
 * Get the template name, or undefined if none.
 * @returns {string|undefined}
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
  lgr.debug('loadTemplate', { basePath });

  loadCSS(`${basePath}.css`, true);
  return import(`${basePath}.js`).then(({ default: run }) => {
    if (run) run();
  }).catch((e) => {
    console.error(`Error loading template module: ${e}`);
  });
}

/**
 * Get localized footer
 *
 * @param {string} locale
 */
export function getLocalizedFooter(locale) {
  const template = ({
    links,
    cookies,
  }) => `
  <div>
    <p>Copyright © 2021 Adobe. All rights reserved.</p>
    <ul>
      ${links}
    </ul>
  </div>
  <div>
    <div class="privacy" style="display: block;">
      <a href="#" class="openPrivacyModal ot-sdk-show-settings">${cookies}</a>
      <div id="feds-footer"></div>
    </div>
  </div>`;

  const footers = {
    default: {
      links: `<li><a href="https://www.adobe.com/privacy.html" target="_blank">Privacy</a></li>
      <li><a href="https://www.adobe.com/legal/terms.html" target="_blank">Terms of Use</a></li>
      <li><a href="https://www.adobe.com/privacy/ca-rights.html" target="_blank">Do not sell my personal information</a></li>
      <li><a href="https://www.adobe.com/privacy/opt-out.html#interest-based-ads" target="_blank"><svg class="icon icon-adchoices"><use href="/icons.svg#adchoices"></use></svg> AdChoices</a></li>`,
      cookies: 'Cookie preferences',
    },
    de: {
      links: `
    <li><a href="https://www.adobe.com/de/privacy.html">Richtlinien f&uuml;r den Datenschutz</a></li>
    <li><a href="https://www.adobe.com/de/legal/terms.html">Nutzungsbedingungen</a></li>
    <li><a href="https://www.adobe.com/de/privacy/ca-rights.html">Daten zu meiner Person nicht verkaufen</a></li>
    <li><a href="https://www.adobe.com/de/privacy/opt-out.html#interest-based-ads"><svg xmlns="http://www.w3.org/2000/svg" class="icon icon-adchoices"><use href="/icons.svg#adchoices"></use></svg> AdAuswahl</a></li>`,
      cookies: 'Einstellungen',
    },

  };

  return template({
    ...footers.default,
    ...(footers[locale] || {}),
  });
}

export function insertFooter() {
  const footer = document.querySelector('body>footer');
  hideElements(footer);

  const localFooter = createTag('footer');
  const html = getLocalizedFooter(window.pages.locale);
  localFooter.innerHTML = html;

  const svg = localFooter.querySelector(':scope svg');
  svg.addEventListener('load', () => {
    showElements(footer);
  });

  footer.replaceWith(localFooter);
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
            node.setAttribute('src', `/media_${contentHash}.${extension}?width=${width}&auto=webp&format=pjpg&optimize=medium`);
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
      isNodeName(link.parentElement.parentNode, 'P')
      && link.parentElement.parentNode.childElementCount === 1
      && isNodeName(link.parentElement.parentNode.firstChild, 'STRONG')
    ) {
      link.className = 'button primary';
    }
  });
}

const linkInNewTabHelper = () => {
  const links = document.querySelectorAll('a');
  links.forEach((link) => {
    if (link.innerText.includes('[!]')) {
      console.log('we here');
      const linkText = link.innerText.split('[!]')[0];
      console.log(linkText);
      link.innerText = linkText;
      link.setAttribute('target', '_blank');
    }
  });
  console.log('creating link out');
};

function setupTestMode() {
  if (window.location.hash.indexOf('test') === -1) {
    return;
  }
  window.pages.on('log', ({ lvl, ns, msgs }) => {
    console.debug(`[${lvl}] ${ns}`, ...msgs);
  });
}

/**
 * Sets the trigger for the LCP (Largest Contentful Paint) event.
 * @see https://web.dev/lcp/
 * @param {Document} doc The document
 * @param {Function} postLCP The callback function
 */
function setLCPTrigger(doc, postLCP) {
  const $lcpCandidate = doc.querySelector('main > div:first-of-type img');
  if ($lcpCandidate) {
    if ($lcpCandidate.complete) {
      postLCP();
    } else {
      $lcpCandidate.addEventListener('load', () => {
        postLCP();
      });
      $lcpCandidate.addEventListener('error', () => {
        postLCP();
      });
    }
  } else {
    postLCP();
  }
}

export async function decorateDefault($main) {
  loadCSS('/pages/styles/default.css', true, true);
  decorateTables();
  wrapSections('main>div');
  decorateBlocks($main);

  if (document.querySelector('.next')) {
    decorateNextStep();
  }

  decorateButtons();
  setExternalLinks();

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
  document.body.classList.add('loaded');
}

async function decoratePage() {
  lgr.debug('decorate');

  const mainEl = document.querySelector('main');

  initializeNamespaces();
  setupTestMode();
  insertFooter();
  linkInNewTabHelper();
  const template = getTemplateName();
  if (window.pages.product) {
    document.getElementById('favicon').href = `/icons/${window.pages.product.replaceAll('-', '')}.svg`;
  }
  await replaceEmbeds();

  if (template) {
    lgr.debug('use:template', { template });
    await loadTemplate(template);
  } else {
    lgr.debug('use:default');
    decorateDefault(mainEl);
  }

  document.title = document.title.split('<br>').join(' ');
  fixImages();

  setLCPTrigger(document, async () => {
    emit('postLCP');

    if (!template) {
      loadBlocks(mainEl);
    }
    loadCSS('/pages/styles/lazy-styles.css');
  });
}

decoratePage();
