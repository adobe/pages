/**
 * Loads a JS module.
 * @param {string} src The path to the JS module
 */
function loadJSModule(src) {
    const module = document.createElement('script');
    module.setAttribute('type', 'module');
    module.setAttribute('src', src);
    document.head.appendChild(module);
  };

/**
 * Creates a tag with the given name and attributes.
 * @param {string} name The tag name
 * @param {object} attrs An object containing the attributes
 * @returns The new tag
 */
function createTag(name, attrs) {
    const el = document.createElement(name);
    if (typeof attrs === 'object') {
      for (let [key, value] of Object.entries(attrs)) {
        el.setAttribute(key, value);
      }
    }
    return el;
  }

async function insertLocalResource(type) {
  if (window.pages.product && window.pages.locale) {
    const resp=await fetch(`/${type}s/${window.pages.product}/${window.pages.locale}/${window.pages.project}/${type}.plain.html`);
    if (resp.status == 200) {
      const html=await resp.text();
      document.querySelector(type).innerHTML=html;
    }
  }
}


/* link out to external links */
// called inside decoratePage() twp3.js
function externalLinks($selector) {
  let element = document.querySelector($selector);
  let links = element.querySelectorAll('a');

  if(links.length >= 1) {
    links.forEach(function(link_item) {
      let linkValue = link_item.getAttribute('href');

      if(!linkValue.includes('pages.adobe')) {
        link_item.setAttribute('target', '_BLANK')
      } 
    })
  }
}



function loadLocalHeader() {
  insertLocalResource('header');
}


function loadLocalFooter() {
  insertLocalResource('footer');
}

/**
 * Fixes helix icon functionality until 
 * https://github.com/adobe/helix-pipeline/issues/509
 * is resolved.
 */

function fixIcons() {
  document.querySelectorAll("use").forEach ((e) => {
      var a=e.getAttribute("href");
      var name=a.split("/")[2].split(".")[0];
      e.setAttribute("href", `/icons.svg#${name}`);
  });
}

/**
 * Checks if <main> is ready to appear 
 */

function appearMain() {
  if (window.pages.familyCssLoaded && window.pages.decorated) {
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
      window.pages.familyCssLoaded=true;
      appearMain();
    }
    document.head.appendChild(link);
  };
  
/**
 * adds a class to an element.
 * @param {string} qs querySelector string
 * @param {string} cls css class to be added
 * @param {number} parent uplevel
 */

function classify(qs, cls, parent) {
    document.querySelectorAll(qs).forEach(($e) => {
        for (let p=parent;p>0;p--) {
            $e=$e.parentNode;
        }
        $e.classList.add(cls)    
    });
}

const pathSegments=window.location.pathname.match(/[\w-]+(?=\/)/g);
const product=pathSegments[0];
const locale=pathSegments[1];
const project=pathSegments[2];

window.pages = { product, locale, project };


// Load page specific code
if (window.pages.project) {
    loadCSS(`/styles/${window.pages.product}/${window.pages.project}.css`);
    loadJSModule(`/scripts/${window.pages.project}.js`);
} else {
  loadCSS(`/styles/default.css`);
  loadJSModule(`/scripts/default.js`);
}

