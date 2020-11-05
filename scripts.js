/**
 * Loads a JS module.
 * @param {string} src The path to the JS module
 */

 document.title=document.title.split('<br>').join(' ');


function addDefaultClass(element) {
  document.querySelectorAll(element).forEach(($div) => {
      $div.classList.add('default');
  });
}

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
  decorateTables();
  const $inlineHeader=document.querySelector('main div.header-block');
  if ($inlineHeader) {
    const $header=document.querySelector('header');
    $inlineHeader.childNodes.forEach((e, i) => {
      if (e.nodeName == '#text' && !i) {
        const $p=createTag('p');
        const inner=`<img class="icon icon-${window.pages.product}" src="/icons/${window.pages.product}.svg">${e.nodeValue}`
        $p.innerHTML=inner;
        e.parentNode.replaceChild($p,e);
      }
      if (e.nodeName == 'P' && !i) {
        const inner=`<img class="icon icon-${window.pages.product}" src="/icons/${window.pages.product}.svg">${e.innerHTML}`
        e.innerHTML=inner;
      }
    });
    $header.innerHTML=`<div>${$inlineHeader.innerHTML}</div>`;
    $inlineHeader.remove();
    document.querySelector('header').classList.add('appear');
  } else {
    await insertLocalResource('header');

  }
}

function toClassName(name) {
  return (name.toLowerCase().replace(/[^0-9a-z]/gi, '-'))
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

function loadTemplate() {
  decorateTables();
  let template='default'
  $template=document.querySelector('.template');
  
  if ($template) {
    template=toClassName($template.textContent);
    $template.remove();
  }

  loadJSModule(`/templates/${template}/${template}.js`);
  loadCSS(`/templates/${template}/${template}.css`);

}

function externalizeImageSources($div) {
  $div.querySelectorAll('img').forEach(($img) => {
    const src=$img.src;
    if (src.startsWith('https://hlx.blob.core.windows.net/external/')) {
      const url=new URL(src);
      const id=url.pathname.split('/')[2];
      const ext=url.hash.split('.')[1];
      $img.src=`/hlx_${id}.${ext}`;
    }
  })
}

function decorateTables() {
  document.querySelectorAll('main div>table').forEach(($table) => {
      const $cols=$table.querySelectorAll('thead tr th');
      const cols=Array.from($cols).map((e) => toClassName(e.innerHTML));
      const $rows=$table.querySelectorAll('tbody tr');
      let $div={};

      if (cols.length==1 && $rows.length==1) {
          $div=createTag('div', {class:`${cols[0]}`});
          $div.innerHTML=$rows[0].querySelector('td').innerHTML;
          externalizeImageSources($div);
      } else {
          $div=turnTableSectionIntoCards($table, cols) 
      }
      $table.parentNode.replaceChild($div, $table);
  });
}

function turnTableSectionIntoCards($table, cols) {
  const $rows=$table.querySelectorAll('tbody tr');
  const $cards=createTag('div', {class:`cards ${cols.join('-')}`})
  $rows.forEach(($tr) => {
      const $card=createTag('div', {class:'card'})
      $tr.querySelectorAll('td').forEach(($td, i) => {
          const $div=createTag('div', {class: cols[i]});
          const $a=$td.querySelector('a[href]');
          if ($a && $a.getAttribute('href').startsWith('https://www.youtube.com/')) {
              const yturl=new URL($a.getAttribute('href'));
              const vid=yturl.searchParams.get('v');
              $div.innerHTML=`<div class="video-thumb" style="background-image:url(https://img.youtube.com/vi/${vid}/0.jpg)"><svg xmlns="http://www.w3.org/2000/svg" width="731" height="731" viewBox="0 0 731 731">
              <g id="Group_23" data-name="Group 23" transform="translate(-551 -551)">
                  <circle id="Ellipse_14" data-name="Ellipse 14" cx="365.5" cy="365.5" r="365.5" transform="translate(551 551)" fill="#1473e6"/>
                  <path id="Polygon_3" data-name="Polygon 3" d="M87.5,0,175,152H0Z" transform="translate(992.5 829.5) rotate(90)" fill="#fff"/>
              </g>
              </svg>
              </div>`;
              $div.addEventListener('click', (evt) => {
                  $div.innerHTML=$div.innerHTML=`<div style="left: 0; width: 100%; height: 0; position: relative; padding-bottom: 56.25%;"><iframe src="https://www.youtube.com/embed/${vid}?rel=0&autoplay=1" style="border: 0; top: 0; left: 0; width: 100%; height: 100%; position: absolute;" allowfullscreen scrolling="no" allow="autoplay; encrypted-media; accelerometer; gyroscope; picture-in-picture"></iframe></div>`;
              })
          } else {
              $div.innerHTML=$td.innerHTML;
          }
          $card.append($div);
      });
      $cards.append($card);
  });
  return ($cards);
}

const pathSegments=window.location.pathname.match(/[\w-]+(?=\/)/g);

window.pages={};

if (pathSegments) {
  const product=pathSegments[0];
  const locale=pathSegments[1];
  const project=pathSegments[2];
  window.pages = { product, locale, project };
}

window.pages.dependencies=[];

if (window.pages.product) {
  document.getElementById('favicon').href=`/icons/${window.pages.product}.svg`;
}

if (document.readyState == 'loading') {
  window.addEventListener('DOMContentLoaded', (event) => {
      loadTemplate();
  });
} else {
  loadTemplate();
}


