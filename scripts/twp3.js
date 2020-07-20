


async function fetchSteps() {
    var resp=await fetch('steps.json');
    return (await resp.json());
}

async function insertSteps() {
    const $steps=document.querySelector('main div.steps');
    if ($steps) {
        const steps=await fetchSteps();
        let html='';
        steps.forEach((step, i) => {
            html+=`<div class="card" onclick="window.location='step?${i+1}'">
                <div class='img' style="background-image: url(${step.Thumbnail})">
                <svg xmlns="http://www.w3.org/2000/svg"><use href="/static/twp3/icons/play.svg#icon"></use></svg>
                </div>
                <div class='text'>
                    <div><h4>${step.Title}</h4>
                    <p>${step.Description}</p>
                    </div>
                    <a href="step?${i+1}">${step.CTA}</a>
                </div>
            </div>`
        })
        $steps.innerHTML=html;
    }
}

export function playVideo() {
    document.getElementById('placeholder').classList.add('hidden');
    const $video=document.getElementById('video');
    $video.classList.remove('hidden');
    $video.classList.remove('hidden');
    $video.play();

}

async function decorateStep() {
    document.body.classList.add('step');
    classify('main>div:first-of-type', 'content');
    classify('main>div:nth-of-type(2)', 'learn');
    classify('main>div:nth-of-type(3)', 'progress');
    classify('main>div:nth-of-type(4)', 'upnext');

    const $content=document.querySelector('.content');
    const $learn=document.querySelector('.learn');
    const $progress=document.querySelector('.progress');
    const $upnext=document.querySelector('.upnext');

    const $video=createTag('div', {class: 'video-wrapper'});
    $content.appendChild($video);

    const stepIndex=(+window.location.search.substring(1))-1;
    const steps=await fetchSteps();
    const currentStep=steps[stepIndex];

    //fill content section

    const $h1=document.querySelector('main .content>h1');
    $h1.innerHTML=currentStep.Title;
    for (let i=0;i<8;i++) {
        $h1.appendChild(createTag('span', {class: 'grab-'+i}))
    }
    document.title=currentStep.Title;
    document.querySelector('main .content>p>a').setAttribute('href', currentStep['Practice File']);

    $video.innerHTML=`<div class="video"><div id="placeholder" class="button">
        <svg xmlns="http://www.w3.org/2000/svg"><use href="/static/twp3/icons/play.svg#icon"></use></svg>
        </div>
    <video id='video' class="hidden" preload="metadata" src="${currentStep.Video}" tabindex="0">
    <source src="${currentStep.Video}" type="video/mpeg4">
    </video></div>`;
    $video.firstChild.style.backgroundImage=`url(${currentStep.Thumbnail})`;
    $video.firstChild.addEventListener('click', (e) => playVideo());

    //fill learn section

    let skills=[]
    while (currentStep['Skill '+(skills.length+1)]) {
        skills.push({
            title: currentStep['Skill '+(skills.length+1)], 
            icon: currentStep['Skill '+(skills.length+1)+' Icon']
        });
    }
    const $skills=createTag('div',{class: 'skills'});
    let html='';

    skills.forEach((skill) => {
        html+=`<div class="skill"><img src="/static/twp3/icons/${skill.icon}.svg">
            <p>${skill.title}</p></div>`;
    })
    $skills.innerHTML=html;
    $learn.appendChild($skills);

    //fill progress section

    const splits=$progress.innerHTML.split("#");
    $progress.innerHTML=splits[0]+(stepIndex+1)+splits[1]+(steps.length)+splits[2];

    const $progressbar=createTag('div',{class: 'progress-bar'});
    html='';
    steps.forEach((step,i) => {
        html+=`<div onclick="window.location.href='step?${i+1}'" class="${i==stepIndex?'active':'inactive'}"></div>`
    })
    $progressbar.innerHTML=html;
    $progress.appendChild($progressbar);


    // fill up next

    var upnext=$upnext.innerHTML;

    const nextStep=steps[stepIndex+1];
    if (nextStep) {
        $upnext.innerHTML=`<div class="window">
                <img src="${nextStep.Thumbnail}">
                </div>
                ${upnext}
                <h2>${nextStep.Title}</h2>
                <p>${nextStep.Description}</p>
                `;
    } else {
        $upnext.remove();
    }
    
    $upnext.addEventListener('click', (e) => window.location.href=`step?${stepIndex+2}`)

}

async function decorateHome() {
    document.body.classList.add('home');
    document.querySelectorAll('main p').forEach(($e) => {
        if ($e.innerHTML.toLowerCase().trim()=='&lt;steps&gt;') {
            $e.parentNode.classList.add('steps');
            $e.parentNode.innerHTML='';
        }
    })
    await insertSteps();

}

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

async function decoratePage() {
    let pageType;
    //find steps marker
    if (document.location.pathname.endsWith('/step')) {
        pageType = 'step';
    } else {
        pageType = 'home';
    }

    window.pages.pageType = pageType;

    decorateForm();

    if (pageType == 'home') {
        await decorateHome();
    }

    if (pageType == 'step') {
        await decorateStep();
    }

    classify('main', 'appear');

}

if (document.readyState == 'loading') {
    window.addEventListener('DOMContentLoaded', (event) => {
        decoratePage();
    });
} else {
    decoratePage();
}


