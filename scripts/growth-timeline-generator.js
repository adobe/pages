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

/*
async function fetchBacklog() {
    const resp=await fetch('growth-design-backlog.json');
    const json=await resp.json();
    return (Array.isArray(json) ? json : json.data);
}

async function insertSteps() {
    const $steps=document.querySelector('main div.steps');
    if ($steps) {
        const steps=await fetchBacklog();
        let html='';
        steps.forEach((step, i) => {
            html+=`<div class="card" onclick="window.location='step?${i+1}'">
                <div class='img' style="background-image: url(${getThumbnail(step)})">
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

function addNavCarrot() {
  if(document.querySelector('header img')) {
    let carrot = document.createElement('span');
    carrot.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" class="feather feather-chevron-down"><polyline points="6 9 12 15 18 9"></polyline></svg>
    `;
    document.querySelector('header img')
    .closest('p')
    .append(carrot);
  }
}

function dropDownMenu() {
    console.log('here')
  let $header = document.querySelector('header');

  if(window.outerWidth >= 768) return;

  if(!$header.classList.contains('nav-showing')) {
    $header.querySelector('ul').style.display = 'flex';
    $header.classList.add('nav-showing')
  } else {
    $header.querySelector('ul').style.display = 'none';
    $header.classList.remove('nav-showing')
  }
}

export function playVideo() {
    document.getElementById('placeholder').classList.add('hidden');
    const $video=document.getElementById('video');
    $video.classList.remove('hidden');
    $video.classList.remove('hidden');
    $video.play();
    $video.setAttribute('controls', true)

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
    let title=currentStep.Title;
    if (currentStep.Heading) title=currentStep.Heading;
    title=title.split(`\n`).join('<br>');
    $h1.innerHTML=title + '.';
    $h1.id='';

    for (let i=0;i<8;i++) {
        $h1.appendChild(createTag('span', {class: 'grab-'+i}))
    }
    document.title=currentStep.Title;
    if (currentStep['Practice File']) {
        document.querySelector('main .content>p>a')
            .setAttribute('href', currentStep['Practice File']);
    }

    if (currentStep.Video.startsWith('https://images-tv.adobe.com')) {
        $video.innerHTML=`<div class="video"><div id="placeholder" class="button">
        <svg xmlns="http://www.w3.org/2000/svg"><use href="/static/twp3/icons/play.svg#icon"></use></svg>
        </div>
        <video id='video' class="hidden" preload="metadata" src="${currentStep.Video}" tabindex="0">
        <source src="${currentStep.Video}" type="video/mpeg4">
        </video></div>`;
        $video.firstChild.style.backgroundImage=`url(${currentStep.Thumbnail})`;
        $video.firstChild.addEventListener('click', (e) => playVideo());
    }

    if (currentStep.Video.startsWith('https://www.youtube.com/')) {
        const yturl=new URL(currentStep.Video);
        const vid=yturl.searchParams.get('v');
        $video.innerHTML=`<div style="left: 0; width: 100%; height: 0; position: relative; padding-bottom: 56.25%;"><iframe src="https://www.youtube.com/embed/${vid}?rel=0" style="border: 0; top: 0; left: 0; width: 100%; height: 100%; position: absolute;" allowfullscreen scrolling="no" allow="encrypted-media; accelerometer; gyroscope; picture-in-picture"></iframe></div>`;

    }

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
        html+=`<div onclick="window.location.href='step?${i+1}'" `+
            `class="${i==stepIndex?'active':'inactive'}"></div>`;
    })
    $progressbar.innerHTML=html;
    $progress.appendChild($progressbar);

    // fill up next

    var upnext=$upnext.innerHTML;

    const nextStep=steps[stepIndex+1];
    if (nextStep) {
        $upnext.innerHTML=` <div class="upnext__inner">
                              <div class="window">
                                <img src="${getThumbnail(nextStep)}">
                              </div>
                              ${upnext}
                              <h2>${nextStep.Title}</h2>
                              <p>${nextStep.Description}</p>
                            </div>

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

async function decoratePage() {

    await loadLocalHeader();

    externalLinks('header');
    externalLinks('footer');

    // nav style/dropdown
    addNavCarrot();

    if(document.querySelector('header img')) {
      document.querySelector('header p').addEventListener('click', dropDownMenu)
    }

    let pageType;
    //find steps marker
    if (document.location.pathname.endsWith('/step')) {
        pageType = 'step';
    } else {
        pageType = 'home';
    }

    window.pages.pageType = pageType;

    if (pageType == 'home') {
        await decorateHome();
    }

    if (pageType == 'step') {
        await decorateStep();
    }

    window.pages.decorated = true;
    appearMain();

}

if (document.readyState == 'loading') {
    window.addEventListener('DOMContentLoaded', (event) => {
        decoratePage();
    });
} else {
    decoratePage();
}

*/
