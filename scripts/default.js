// simple form submission
async function submitSheetForm($form, sheetid, thankyou) {
    const formsink='https://script.google.com/macros/s/AKfycbxWFwI-qExw0Tg_LJvdisSYODFw35m3L8M5HdumPOufmArmRIEh/exec'
    var searchParams = new URLSearchParams(`?sheet-id=${sheetid}`);
    if ($form.reportValidity()) {
        $form.querySelectorAll(".form-field").forEach(($f) => {
            if ($f.getAttribute('type') == 'radio') {
                if ($f.checked) searchParams.append($f.name, $f.value);
            } else {
                searchParams.append($f.name, $f.value);
            }
        })
        const resp=await fetch(formsink+'?'+searchParams.toString());
        const json=await resp.json();
        if (json.status == 'ok') {
            window.location=thankyou;
        } else {
            alert ('Form Submission failed.')
            console.log(`form submission error: ${json.description}`);
        }    
    }
}

// html output for form fields
function getFieldHTML(name, type, options, attributes) {
    let html=`<label for="${name}">${name} ${attributes.mandatory?'*':''}</label><br>`;
    const r=attributes.mandatory?'required':'';

    if (type=='text') {
        html+=`<input class="form-field" type="text" id="${name}" name="${name}" ${r}><br>`;
    }

    if (type=='textarea') {
        html+=`<textarea class="form-field" id="${name}" name="${name}" rows=${attributes.rows} ${r}>`;
    }

    if (type=='radio') {
        options.forEach((o) => {
            html+=`<input class="form-field" type="radio" id="${name}" name="${name}" value="${o}" ${r}>
            <label for="${name}">${o}</label><br>`
        })
    }
    return (html);
}

// decorate a google sheets submitted form section

function decorateForm () {
    const sheetqs='main a[href^="https://docs.google.com/spreadsheets/"]';
    document.querySelectorAll(sheetqs).forEach(($a) => {
        const sheetid=$a.getAttribute('href').split('/')[5];
        const $div=$a.parentNode.parentNode;
        let thankyou='';
        $a.setAttribute('href','javascript:');
        $div.querySelectorAll('a').forEach(($diva) => {
            if ($diva.innerHTML.toLowerCase().trim() == 'thank you') {
                thankyou=$diva.getAttribute('href');
                $diva.parentNode.remove();
            }
        })
        $a.addEventListener('click', (e) => {
            submitSheetForm($form, sheetid, thankyou)
        });
        $div.classList.add('form');
        const $form=createTag('form');

        $div.querySelectorAll(':scope > p').forEach(($f) => {
            const $anchor=$f.querySelector('a');
            if (!$anchor) {
                const formfield=$f.firstChild.textContent;
                let attributes={};
                if (formfield.indexOf('*')) attributes.mandatory=true;
                let type='text';
                let options=[];
                const name=formfield.split('*')[0].trim();
    
                if ($f.nextElementSibling) {
                    $f.nextElementSibling.querySelectorAll('li').forEach(($li) => {
                        options.push($li.innerHTML)
                    });
                    if (options.length>0) {
                        $f.nextElementSibling.remove();
                        type='radio';
                    }
                }
    
                if (formfield.indexOf('[')>0) {
                    const descriptor=formfield.match(/\[(.*?)\]/)[1].toLowerCase().trim();
                    if (descriptor.endsWith('lines')) {
                        type='textarea'
                        attributes.rows=descriptor.split(' ')[0];
                    } else {
                        type=descriptor;
                    }
                }
    
                $f.innerHTML=getFieldHTML(name, type, options, attributes);    
            }
            $form.appendChild($f);
        })
        $div.appendChild($form);
    })
}


function smartWrap(qs) {
    document.querySelectorAll(qs).forEach(($e) => {
        const divs=[];
        let $div=document.createElement('div');
        divs.push($div);
        Array.from($e.children).forEach(($el, i) => {
            if ($el.querySelector('img') && i) {
                    $div=document.createElement('div');
                    divs.push($div);
            }
            $div.appendChild($el);
        })
        const $wrapper=document.createElement('div');
        $wrapper.classList.add('par-wrapper');
        divs.forEach(($div) => {
            $wrapper.appendChild($div);
        });
        $e.innerHTML='';
        $e.appendChild($wrapper);
    });
}

function unwrapEmbeds() {
    document.querySelectorAll(".section-embed").forEach(($embed) => {
        $embed.parentNode.classList.remove('default');
    })
}


function setMainVideo() {
    if(!window.location.search) return;
    let param = window.location.search;
    let query_type = param.split('=')[0];
    
    if(query_type == "?v" || query_type == "&v") {
        let video_index = param.split('=')[1] - 1;
        let parent_wrapper = document.querySelector('.cards').parentElement;
        let mainVideo = document.createElement('div');
        mainVideo.setAttribute('class', 'main-video');
        mainVideo.innerHTML = document.querySelectorAll('.cards li')[video_index].innerHTML;
        parent_wrapper.prepend(mainVideo)
        // document.querySelectorAll('.cards li')[video_index].style.display = 'none'
    } 
}

async function decoratePage() {
    unwrapEmbeds();
    turnListSectionIntoCards();
    smartWrap('main>div.default');
    decorateForm();
    await loadLocalFooter();
    await loadLocalHeader();
    window.pages.decorated = true;
    appearMain();
    setMainVideo();
}

function formatCard($li) {
    const $p=$li.firstElementChild;
    let headhtml='';
    let texthtml='';
    Array.from($p.childNodes).forEach((node) => {
      if (node.nodeName == 'A') {
        const href=node.getAttribute('href');
        if (href.startsWith('https://www.youtube.com/')) {
          const yturl=new URL(href);
          const vid=yturl.searchParams.get('v');
          headhtml+=`<div style="left: 0; width: 100%; height: 0; position: relative; padding-bottom: 56.25%;"><iframe src="https://www.youtube.com/embed/${vid}?rel=0" style="border: 0; top: 0; left: 0; width: 100%; height: 100%; position: absolute;" allowfullscreen scrolling="no" allow="encrypted-media; accelerometer; gyroscope; picture-in-picture"></iframe></div>`;
        } else {
          texthtml+=`<a href=${node.getAttribute('href')}>${node.innerHTML}</a>`;
        }          
      }
      if (node.nodeName == '#text') {
        texthtml+=`<p>${node.textContent}</p>`
      }

    });
    return (`<div class="card-image">${headhtml}</div><div class="card-text">${texthtml}</div>`);
  };
  
  function turnListSectionIntoCards() {
    document.querySelectorAll('main div.default>ul').forEach(($ul) => {
      if ($ul == $ul.parentNode.firstElementChild) {
        $ul.classList.remove('default');
        $ul.classList.add('cards');
        $ul.querySelectorAll('li').forEach(($li) => {
          $li.innerHTML=formatCard($li);
        })
      }
    })
  }
  

if (document.readyState == 'loading') {
    window.addEventListener('DOMContentLoaded', (event) => {
        decoratePage();
    });
} else {
    decoratePage();
}

