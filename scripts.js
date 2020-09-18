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
    url=`/${window.pages.product}/${window.pages.locale}/${type}.plain.html`
  }

  if (window.pages.product && window.pages.project) {
    url=`/${window.pages.product}/${window.pages.locale}/${window.pages.project}/${type}.plain.html`
  }

  if (url) {
    window.pages.dependencies.push(url);
    const resp=await fetch(url);
    if (resp.status == 200) {
      const html=await resp.text();
      const inner = `<div> ${html} </div>`;
      document.querySelector(type).innerHTML= inner;
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
 * Checks if <main> is ready to appear 
 */

function appearMain() {
  if (window.pages.familyCssLoaded && window.pages.decorated) {
    const p=window.pages;
    const pathSplits=window.location.pathname.split('/');
    const pageName=pathSplits[pathSplits.length-1].split('.')[0];
    const classes=[p.product, p.family, p.project, pageName];
    classes.forEach(e => e?document.body.classList.add(e):false)
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
  if (project && project.startsWith('max')) family=`max`;
  window.pages = { product, locale, project, family };  
}

window.pages.dependencies=[];

// Load page specific code
if (window.pages.project && window.pages.project.startsWith('max')) {
    loadCSS(`/styles/${window.pages.product}/max.css`);
    loadJSModule(`/scripts/${window.pages.family}.js`);	
}
else if (window.pages.project) {
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

