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
 * Create class name from string.
 *
 * @param {string} name
 * @returns {string}
 */
export function toClassName(name) {
  return (name.toLowerCase().replace(/[^0-9a-z]/gi, '-'));
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

export function loadScript(url, callback, type) {
  const $head = document.querySelector('head');
  const $script = document.createElement('script');
  $script.src = url;
  if (type) {
    $script.setAttribute('type', type);
  }
  $head.append($script);
  $script.onload = callback;
  return $script;
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
      const $div = document.createElement('div');
      $div.className = 'template';
      $div.innerHTML = template;
      $table.parentElement.replaceChild($div, $table);
    }
  });

  const $template = document.querySelector('.template');
  if (!$template) {
    return undefined;
  }

  const template = toClassName($template.textContent.trim());
  $template.remove();
  return template;
}

/**
 * Load the template
 */
export async function loadTemplate(template) {
  const basePath = `/templates/${template}/${template}`;

  loadCSS(`${basePath}.css`, true);
  return import(`${basePath}.js`).then(({ default: run }) => {
    if (run) run();
  }).catch((e) => {
    console.error(`Error loading template module: ${e}`);
  });
}

window.pages = window.pages || {};

const pathSegments = window.location.pathname.match(/[\w-]+(?=\/)/g);
if (pathSegments) {
  const [product, locale, project] = pathSegments;
  window.pages = { product, locale, project };
}

window.hlx = window.hlx || {};
window.hlx.dependencies = window.hlx.dependencies || [];

const template = getTemplateName() || 'default';
await loadTemplate(template);

if (document.querySelector('helix-sidekick')) {
  import('../tools/sidekick/plugins.js');
} else {
  document.addEventListener('helix-sidekick-ready', () => {
    import('../tools/sidekick/plugins.js');
  }, { once: true });
}

/* load martech delayed */
setTimeout(() => {
  window.fedsConfig = {
    locale: 'en',
    disableTarget: true,
    content: {
      experience: 'privacy',
    },
    privacy: {
      otDomainId: '179df195-99c9-4e20-b856-3f6620810f1a',
      footerLinkSelector: '.openPrivacyModal',
    },
  };
  window.marketingtech = {
    adobe: {
      launch: {
        property: 'global',
        environment: 'production',
      },
    },
  };
  const fedsheader = document.createElement('div');
  fedsheader.id = 'feds-header';
  document.head.append(fedsheader);

  loadScript('https://www.adobe.com/marketingtech/main.min.js');
  loadScript('https://www.adobe.com/etc.clientlibs/globalnav/clientlibs/base/polyfills.js');
  loadCSS('https://wwwimages2.adobe.com/etc/beagle/public/globalnav/adobe-privacy/latest/privacy.min.css');
  loadScript('https://wwwimages2.adobe.com/etc/beagle/public/globalnav/adobe-privacy/latest/privacy.min.js');
}, 4000);
