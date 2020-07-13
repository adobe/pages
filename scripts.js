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
 * Loads a CSS file.
 * @param {string} href The path to the CSS file
 */
function loadCSS(href) {
    const link = document.createElement('link');
    link.setAttribute('rel', 'stylesheet');
    link.setAttribute('href', href);
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

const site=window.location.pathname.split('/')[1];
const locale=window.location.pathname.split('/')[2];

window.land = { site, locale };

// Load page specific code
if (window.land.site) {
    loadCSS(`/styles/${window.land.site}.css`);
    loadJSModule(`/scripts/${window.land.site}.js`);
}

