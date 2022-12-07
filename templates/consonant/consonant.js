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
import { sampleRUM ,decorateIcons } from '../default/default.js';

export function createTag(name, attrs) {
  const el = document.createElement(name);
  if (typeof attrs === 'object') {
    for (const [key, value] of Object.entries(attrs)) {
      el.setAttribute(key, value);
    }
  }
  return el;
}

export function createSVG(id) {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
  use.setAttributeNS('http://www.w3.org/1999/xlink', 'href', `/icons.svg#${id}`);
  svg.appendChild(use);
  return svg;
}

/**
 * Loads a CSS file.
 * @param {string} href The path to the CSS file
 */
export function loadCSS(href, callback) {
  if (!document.querySelector(`head > link[href="${href}"]`)) {
    const link = document.createElement('link');
    link.setAttribute('rel', 'stylesheet');
    link.setAttribute('href', href);
    if (typeof callback === 'function') {
      link.onload = (e) => callback(e.type);
      link.onerror = (e) => callback(e.type);
    }
    document.head.appendChild(link);
  } else if (typeof callback === 'function') {
    callback('noop');
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

export function toClassName(name) {
  return name && typeof name === 'string'
    ? name.toLowerCase().replace(/[^0-9a-z]/gi, '-')
    : '';
}

export function insertAfter(newNode, existingNode) {
  existingNode.parentNode.insertBefore(newNode, existingNode.nextElementSibling);
}

export function isAttr(node, attr, val) {
  if (!node || typeof node !== 'object') return false;
  return node.getAttribute(attr) === val;
}

export function transformLinkToAnimation($a) {
  if (!$a || !$a.href.includes('.mp4')) {
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

export function transformLinkToYoutubeEmbed($a) {
  if (!$a || !($a.href.startsWith('https://www.youtube.com/watch') || $a.href.startsWith('https://youtu.be/'))) {
    return null;
  }
  const $video = createTag('div', { class: 'embed embed-youtube' });
  const url = new URL($a.href);
  const usp = new URLSearchParams(url.search);
  let vid = usp.get('v');
  if (url.host === 'youtu.be') vid = url.pathname.substr(1);
  $video.innerHTML = /* html */`
  <div class="youtube-container">
    <iframe src="https://www.youtube.com/embed/${vid}?rel=0&amp;modestbranding=1&amp;playsinline=1&amp;autohide=1&amp;showinfo=0&amp;rel=0&amp;controls=1&amp;autoplay=1&amp;mute=1&amp;loop=1&amp;playlist=${vid}" frameBorder="0" allowfullscreen="" scrolling="no" allow="encrypted-media; accelerometer; gyroscope; picture-in-picture; autoplay" title="content from youtube" loading="lazy"></iframe>
  </div>
  `;
  return $video;
}

export function linkPicture($picture) {
  const $nextSib = $picture.parentNode.nextElementSibling;
  if ($nextSib) {
    const $a = $nextSib.querySelector('a');
    if ($a && $a.textContent.startsWith('https://')) {
      $a.innerHTML = '';
      $a.className = '';
      $a.appendChild($picture);
    }
  }
}

export function linkImage($elem) {
  const $a = $elem.querySelector('a');
  if ($a) {
    const $parent = $a.closest('div');
    $a.remove();
    $a.className = '';
    $a.innerHTML = '';
    $a.append(...$parent.childNodes);
    $parent.append($a);
  }
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

export function isNodeName(node, name) {
  if (!node || typeof node !== 'object') return false;
  return node.nodeName.toLowerCase() === name.toLowerCase();
}

/**
 * Decorates a block.
 * @param {Element} block The block element
 */
export function decorateBlocks($main) {
  $main.querySelectorAll('div.section-wrapper > div > div').forEach(($block) => {
    // Add classes to container...
    const classes = Array.from($block.classList.values());
    let blockName = classes[0];
    if (!blockName) return;
    const section = $block.closest('.section-wrapper');
    if (section) {
      section.classList.add(`${blockName}-container`.replace(/--/g, '-'));
    }
    if (!section) return;

    // Hide invisible blocks
    const invisBlocks = ['template', 'metadata', 'section-metadata'];
    invisBlocks.forEach((invisBlockName) => {
      if (blockName === invisBlockName) $block.classList.add('hidden');
    });
    const children = Array.from(section.querySelectorAll(':scope > div > *'));
    let hideSection = true;
    children.forEach((child) => {
      if (!child.classList.contains('hidden')) hideSection = false;
    });
    if (hideSection) section.remove();

    // Wrap text-nodes or <a>-nodes in a <p> if they are alone...
    const divs = Array.from($block.querySelectorAll(':scope > div div'));
    divs.forEach((div) => {
      const blockChildren = Array.from(div.childNodes);
      let textOnlyNoP = true;
      blockChildren.forEach(($c) => {
        const $n = $c.nodeName.toLowerCase();
        if ($n === 'p' || $n === 'picture' || $n === 'img' || $n === 'h1' || $n === 'h2'
            || $n === 'h3' || $n === 'h4' || $n === 'h5' || $n === 'h6' || $n === 'div') {
          textOnlyNoP = false;
        }
      });
      if (textOnlyNoP) {
        const p = document.createElement('p');
        div.appendChild(p);
        blockChildren.forEach(($c) => {
          p.appendChild($c);
        });
      }
    });

    // Allow for variants...
    const blocksWithVariants = ['columns', 'cards', 'marquee', 'separator', 'quote', 'images', 'share', 'video' ];
    blocksWithVariants.forEach((b) => {
      if (blockName.startsWith(`${b}-`)) {
        const options = blockName.substring(b.length + 1).split('-').filter((opt) => !!opt);
        blockName = b;
        $block.classList.add(b);
        $block.classList.add(...options);
      }
    });

    // begin custom block option class handling
    // split and add options with a dash
    // (fullscreen-center -> fullscreen-center + fullscreen + center)
    const options = [];
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

    if (section) {
      section.classList.add(`${blockName}-container`.replace(/--/g, '-'));
      const $sectionTitle = section.querySelector('h1') || section.querySelector('h2') || section.querySelector('h3') || section.querySelector('h4') || section.querySelector('h5');
      if ($sectionTitle && typeof $sectionTitle !== 'undefined') {
        section.id = `${$sectionTitle.id}`;
      }
    }
    $block.classList.add('block');
    $block.setAttribute('data-block-name', blockName);
    $block.setAttribute('data-block-status', 'initialized');
  });
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

export function debug(message, err) {
  const { hostname } = window.location;
  const env = getHelixEnv();
  if (env.name !== 'prod' || hostname === 'localhost') {
    // eslint-disable-next-line no-console
    console.log(message, err);
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

/**
 * Get localized footer
 *
 * @param {string} locale
 */
 export function getLocalizedFooter(locale) {
  const currentYear = new Date().getFullYear();
  const template = ({
    links,
    cookies,
  }) => `
  <div>
    <p>Copyright © ${currentYear} Adobe. All rights reserved.</p>
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
  const footer = document.querySelector('footer');
  if (!footer) {
    footer = createTag('footer');
    document.body.appendChild('footer');
  }
  const locale = (window.pages && window.pages.locale) ? window.pages.locale : 'default';
  const html = getLocalizedFooter(locale);
  footer.innerHTML = html;
}

/**
 * Loads JS and CSS for a block.
 * @param {Element} $block The block element
 */
export async function loadBlock($block, eager = false) {
  if (!($block.getAttribute('data-block-status') === 'loading' || $block.getAttribute('data-block-status') === 'loaded')) {
    $block.setAttribute('data-block-status', 'loading');
    const blockName = $block.getAttribute('data-block-name');
    try {
      const cssLoaded = new Promise((resolve) => {
        loadCSS(`/templates/consonant/blocks/${blockName}/${blockName}.css`, resolve);
      });
      const decorationComplete = new Promise((resolve) => {
        (async () => {
          try {
            const mod = await import(`/templates/consonant/blocks/${blockName}/${blockName}.js`);
            if (mod.default) {
              await mod.default($block, blockName, document, eager);
            }
          } catch (err) {
            debug(`failed to load module for ${blockName}`, err);
          }
          resolve();
        })();
      });
      await Promise.all([cssLoaded, decorationComplete]);
    } catch (err) {
      debug(`failed to load block ${blockName}`, err);
    }
    $block.setAttribute('data-block-status', 'loaded');
  }
}

export async function loadBlockManually(blockName, eager = false) {
  try {
    loadCSS(`/templates/consonant/blocks/${blockName}/${blockName}.css`);
    const mod = await import(`/templates/consonant/blocks/${blockName}/${blockName}.js`);
    if (mod.default) {
      await mod.default(blockName, document, eager);
    }
  } catch (err) {
    debug(`failed to load module for ${blockName}`, err);
  }
}

export function loadBlocks($main) {
  const blockPromises = [...$main.querySelectorAll('div.section-wrapper > div > .block:not(.template)')]
    .map(($block) => loadBlock($block));
  return blockPromises;
}

export function loadScript(url, callback, type) {
  const $head = document.querySelector('head');
  const $script = createTag('script', { src: url });
  if (type) {
    $script.setAttribute('type', type);
  }
  $head.append($script);
  $script.onload = callback;
  return $script;
}

// Delete empty section wrappers
export function deleteEmptySections($main) {
  const sections = Array.from($main.querySelectorAll('.section-wrapper'));
  sections.forEach(($s) => {
    const div = $s.querySelector(':scope > div');
    if (!div.firstElementChild) {
      $s.remove();
    }
  });
}

/**
 * Decorate Buttons
 */
export function decorateButtons(block = document) {
  const $blocksWithoutButton = ['header', 'footer', 'breadcrumbs', 'sitemap', 'embed', 'quote', 'images', 'title', 'share', 'tags'];
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
      const $p = $a.closest('p');
      if ($p) {
        const childNodes = Array.from($p.childNodes);
        const whitespace = new RegExp('^\\s*$');
        // Check that the 'button-container' contains buttons only
        const buttonsOnly = childNodes.every(($c) => {
          if (isNodeName($c, 'a') || (isNodeName($c, '#text') && whitespace.test($c.textContent))) {
            return true;
          } else if ($c.childNodes.length > 0) {
            return Array.from($c.childNodes).every(($cc) => {
              if (isNodeName($cc, 'a') || (isNodeName($cc, '#text') && whitespace.test($cc.textContent))) {
                return true;
              } else if ($cc.childNodes.length > 0) {
                // Could be nested twice for 'em' and 'strong' tags.
                return Array.from($cc.childNodes).every(($ccc) => isNodeName($ccc, 'a') || (isNodeName($ccc, '#text') && whitespace.test($ccc.textContent)));
              } else return false;
            });
          } else return false;
        });
        if (buttonsOnly) {
          $p.classList.add('button-container');
          const $up = $a.parentElement;
          const $twoUp = $a.parentElement.parentElement;
          const $threeUp = $a.parentElement.parentElement.parentElement;
          if (isNodeName($up, 'p')) {
            $a.className = 'button transparent'; // default
          }
          if (isNodeName($up, 'strong') && isNodeName($twoUp, 'p')) {
            $a.className = 'button primary';
          }
          if (isNodeName($up, 'em') && isNodeName($twoUp, 'p')) {
            $a.className = 'button secondary';
          }
          if (((isNodeName($up, 'em') && isNodeName($twoUp, 'strong'))
            || (isNodeName($up, 'strong') && isNodeName($twoUp, 'em')))
            && isNodeName($threeUp, 'p')) {
            $a.className = 'button accent';
          }
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
    const n = document.createElement('span');
    n.classList.add('detail');
    const attr = $h6.attributes;
    for (let i = 0, len = attr.length; i < len; i += 1) {
      n.setAttribute(attr[i].name, attr[i].value);
    }
    n.innerHTML = $h6.innerHTML;
    $h6.parentNode.replaceChild(n, $h6);
  });
}

export function unwrapBlock($block) {
  const $section = $block.parentNode;
  const $elems = [...$section.children];
  const $blockSection = createTag('div');
  const $postBlockSection = createTag('div');
  const $nextSection = $section.nextElementSibling;
  $section.parentNode.insertBefore($blockSection, $nextSection);
  $section.parentNode.insertBefore($postBlockSection, $nextSection);

  let $appendTo;
  $elems.forEach(($e) => {
    if ($e === $block) $appendTo = $blockSection;
    if ($appendTo) {
      $appendTo.appendChild($e);
      $appendTo = $postBlockSection;
    }
  });

  if (!$postBlockSection.hasChildNodes()) {
    $postBlockSection.remove();
  }
}

function splitSections($main) {
  $main.querySelectorAll(':scope > div > div').forEach(($block) => {
    const blocksToSplit = ['marquee', 'separator', 'carousel'];

    if (blocksToSplit.includes($block.className)) {
      unwrapBlock($block);
    }
  });
}

function decorateLinkedPictures($main) {
  /* thanks to word online */
  $main.querySelectorAll(':scope > picture').forEach(($picture) => {
    if (!$picture.closest('div.block')) {
      linkPicture($picture);
    }
  });
}

/* link out to external links */
export function externalLinks() {
  const links = document.querySelectorAll('a[href]');

  links.forEach((linkItem) => {
    const linkValue = linkItem.getAttribute('href');
    if (linkValue.indexOf('#') !== 0) {
      if (linkValue.includes('//') && !linkValue.includes('pages.adobe')) {
        linkItem.setAttribute('target', '_blank');
        linkItem.setAttribute('rel', 'noopener');
      } else if (window.pages && window.pages.product && !linkValue.includes(window.pages.product)) {
        linkItem.setAttribute('target', '_blank');
      } else if (window.pages && window.pages.project && !linkValue.includes(window.pages.project)) {
        linkItem.setAttribute('target', '_blank');
      }
    }
  });
}

/* Make links relative */
export function makeLinksRelative() {
  const links = Array.from(document.querySelectorAll('a[href*="//pages.adobe.com/"]'));
  links.forEach((link) => {
    try {
      const url = new URL(link.href);
      const rel = url.pathname + url.search + url.hash;
      link.href = rel;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.debug(`problem with link ${link.href}`);
    }
  });
}

/**
 * Returns a picture element with webp and fallbacks
 * @param {string} src The image URL
 * @param {string} alt The alt text of the image
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
      img.setAttribute('loading', eager ? 'eager' : 'lazy');
      img.setAttribute('alt', alt);
      picture.appendChild(img);
      img.setAttribute('src', `${pathname}?width=${br.width}&format=${ext}&optimize=medium`);
    }
  });

  return picture;
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
 * Builds a block DOM Element from a two dimensional array
 * @param {string} blockName name of the block
 * @param {any} content two dimensional array or string or object of content
 */
export function buildBlock(blockName, content) {
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

function createFragmentBlocks(main) {
  const ps = [...main.querySelectorAll('p')];
  const filteredPs = ps.filter((p) => p.textContent.startsWith('/'));
  filteredPs.forEach((p) => {
    const path = p.textContent.split('.')[0];
    p.replaceWith(buildBlock('fragment', `${new URL(path, window.location.href)}`));
  });
}

export async function decorateMain($main) {
  createFragmentBlocks($main);
  splitSections($main);
  wrapSections($main.querySelectorAll(':scope > div'));
  deleteEmptySections($main);
  decorateButtons($main);
  decorateBlocks($main);
  decoratePictures($main);
  decorateLinkedPictures($main);
  makeLinksRelative();
  externalLinks();
  updateH6toDetail($main);
}

export function addAnimationToggle(target) {
  target.addEventListener('click', () => {
    const videos = target.querySelectorAll('video');
    const paused = videos[0] ? videos[0].paused : false;
    videos.forEach((video) => {
      if (paused) video.play();
      else video.pause();
    });
  }, true);
}

/**
 * loads everything needed to get to LCP.
 */
async function loadEager() {
  insertFooter()
  const main = document.querySelector('main');
  if (main) {
    await decorateMain(main);
    await loadBlockManually('header', true);
    displayEnv();

    const lcpBlocks = ['columns', 'marquee', 'header', 'separator', 'cards'];
    const block = document.querySelector('.block');
    const hasLCPBlock = (block && lcpBlocks.includes(block.getAttribute('data-block-name')));
    if (hasLCPBlock) await loadBlock(block, true);

    document.querySelector('body').classList.add('appear');

    const lcpCandidate = document.querySelector('main img');
    await new Promise((resolve) => {
      if (lcpCandidate && !lcpCandidate.complete) {
        lcpCandidate.addEventListener('load', () => resolve());
        lcpCandidate.addEventListener('error', () => resolve());
      } else {
        resolve();
      }
    });
  }
}

async function loadLazy() {
  const main = document.querySelector('main');

  // post LCP actions go here
  sampleRUM('lcp');

  loadCSS('/pages/styles/lazy-styles.css');
  loadBlocks(main);

  if (window.pages && window.pages.product) {
    document.getElementById('favicon-safari').href = `/icons/${window.pages.product.replaceAll('-', '')}.ico`;
    document.getElementById('favicon').href = `/icons/${window.pages.product.replaceAll('-', '')}.svg`;
  }
}

/**
 * Decorates the page.
 */
async function decoratePage() {
  window.hlx = window.hlx || {};
  window.hlx.lighthouse = new URLSearchParams(window.location.search).get('lighthouse') === 'on';
  window.hlx.init = true;

  await loadEager();
  loadLazy();
  decorateIcons();
}

if (!window.hlx.init && !window.isTestEnv) {
  decoratePage();
}

/*
 * lighthouse performance instrumentation helper
 * (needs a refactor)
 */

function stamp(message) {
  if (window.name.includes('performance')) {
    // eslint-disable-next-line no-console
    console.log(`${new Date() - performance.timing.navigationStart}:${message}`);
  }
}

stamp('start');

function registerPerformanceLogger() {
  try {
    const polcp = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      stamp(JSON.stringify(entries));
      // eslint-disable-next-line no-console
      console.log(entries[0].element);
    });
    polcp.observe({ type: 'largest-contentful-paint', buffered: true });

    const pols = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      stamp(JSON.stringify(entries));
      // eslint-disable-next-line no-console
      console.log(entries[0].sources[0].node);
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
