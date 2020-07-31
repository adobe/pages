/**
 * Loads a JS module.
 * @param {string} src The path to the JS module
 */

 document.title=document.title.split('<br>').join(' ');


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
  let url='';
  if (window.pages.product && window.pages.locale) {
    url=`/${type}s/${window.pages.product}/${window.pages.locale}/${type}.plain.html`
  }

  if (window.pages.product && window.pages.project) {
    url=`/${type}s/${window.pages.product}/${window.pages.locale}/${window.pages.project}/${type}.plain.html`
  }

  if (url) {
    const resp=await fetch(url);
    if (resp.status == 200) {
      const html=await resp.text();
      document.querySelector(type).innerHTML=html;
    }
  }

  // temporary icon fix
  fixIcons();
  document.querySelector(type).classList.add('appear');
}


/* link out to external links */
// called inside decoratePage() twp3.js
function externalLinks(selector) {
  const element = document.querySelector(selector);
  const links = element.querySelectorAll('a[href]');

  links.forEach((link_item) => {
    const linkValue = link_item.getAttribute('href');

    if(linkValue.includes('//') && !linkValue.includes('pages.adobe')) {
      link_item.setAttribute('target', '_blank')
    } 
  })
}


async function loadLocalHeader() {
  await insertLocalResource('header');
}


async function loadLocalFooter() {
  await insertLocalResource('footer');
}

/**
 * Fixes helix icon functionality until 
 * https://github.com/adobe/helix-pipeline/issues/509
 * is resolved.
 */

function fixIcons() {
  document.querySelectorAll("use").forEach ((e) => {
      var a=e.getAttribute("href");
      if (a.startsWith('/icons/')) {
        var name=a.split("/")[2].split(".")[0];
        e.setAttribute("href", `/icons.svg#${name}`);  
      }
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
    link.onerror = () => {
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

window.pages={};

if (pathSegments) {
  const product=pathSegments[0];
  let locale=pathSegments[1];
  let project=pathSegments[2];
  let family=project;
  if (project && (project.startsWith('twp3') || project.startsWith('tl'))) family=`twp3`;
  if (project=='twp2' || project=='twp') family=`twp`;
  if (product=='internal') { family=`internal`; project=``; }
  
  window.pages = { product, locale, project, family };  
}


// Load page specific code
if (window.pages.project) {
    loadCSS(`/styles/${window.pages.product}/${window.pages.project}.css`);
    loadJSModule(`/scripts/${window.pages.family}.js`);
} else if (window.pages.product) {
  loadCSS(`/styles/${window.pages.product}/default.css`);
  loadJSModule(`/scripts/default.js`);
} else {
  loadCSS(`/styles/default.css`);
  loadJSModule(`/scripts/default.js`);
}

if (window.pages.product) {
  document.getElementById('favicon').href=`/icons/${window.pages.product}.svg`;
}

