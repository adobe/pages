async function fetchSteps() {
  window.hlx.dependencies.push('steps.json');
  const resp=await fetch('steps.json');
  const json=await resp.json();
  return (Array.isArray(json) ? json : json.data);
}

function getThumbnail(step) {
  let thumbnail=step.Thumbnail;
  if (!thumbnail) {
      if (step.Video.startsWith('https://www.youtube.com')) {
          const yturl=new URL(step.Video);
          const vid=yturl.searchParams.get('v');    
          thumbnail=`https://img.youtube.com/vi/${vid}/0.jpg`;
      }
  }
  return (thumbnail);
}





function addNavCarrot() {
  if(document.querySelector('header svg') || document.querySelector('header img')) {
      let svg = document.querySelector('header svg') || document.querySelector('header img');
      let svgWithCarrot = document.createElement('div');
      svgWithCarrot.classList.add('nav-logo');

      svgWithCarrot.innerHTML = `
      <span class="product-icon">
          ${svg.outerHTML}
      </span>

      <span class="carrot">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" class="feather feather-chevron-down"><polyline points="6 9 12 15 18 9"></polyline></svg>
      </span>
      `;
      svg.remove();
      document.querySelector('header div')
      .prepend(svgWithCarrot);
      document.querySelector('header').classList.add('default-nav')

  

      if(document.querySelector('header .section-wrapper').children[1].firstElementChild.nodeName === "P") {
          let productName = document.querySelector('header .section-wrapper').children[1].querySelector('p')
          document.querySelector('.product-icon').appendChild(productName)            
      }

  }
}



async function insertSteps() {
  const $steps=document.querySelector('main div.steps');
  if ($steps) {
      const steps=await fetchSteps();
      const steps__inner = document.createElement('div');
      steps__inner.classList.add('steps__inner')
      let step_item = ``;
      console.log(steps)

      steps.forEach((step) => {
        step_item += `
          <div class="steps__item">
            <div class="steps__img">
              <img src="${step.Thumbnail}"/>
            </div>
            <div class="steps__info">
              <span>${step.Milestone}</span>
              <span>|</span>
              <span>${step.Duration}</span>
            </div>
            <h4>${step.Title}</h4>
            <hr>
            <p>${step.Description}</p>
            <a href="">${step.CTA}</a>
          </div>
        `
      })

      steps__inner.innerHTML = step_item;
      $steps.innerHTML = steps__inner.outerHTML
      
  }
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

  const stepIndex=(+window.location.search.substring(1).split('&')[0])-1;
  const steps=await fetchSteps();
  const currentStep=steps[stepIndex];

  //fill content section

  const $h1=document.querySelector('main .content>h1');
  let title=currentStep.Title;
  if (currentStep.Heading) title=currentStep.Heading;
  title=title.replace('\n', '<br>');
  $h1.innerHTML=title;
  let iconParent = document.createElement("div");
  iconParent.setAttribute("class", "icons_parent");
  iconParent.innerHTML = `
  <div class="icons_parent__item"><img src="../../../../icons/${currentStep.Product_icon_1.toLowerCase()}.svg"></div>
  <div class="icons_parent__item"><img src="../../../../icons/${currentStep.Product_icon_2.toLowerCase()}.svg"></div>`;

  $h1.id='';

  document.querySelector("main .content").prepend(iconParent);
  
  // for (let i=0;i<8;i++) {
  //     $h1.appendChild(createTag('span', {class: 'grab-'+i}))
  // }
  document.title=currentStep.Title;
  if (currentStep['Practice File']) {
      document.querySelector('main .content>p>a').setAttribute('href', currentStep['Practice File']);
  }

  if (currentStep.Video.startsWith('https://images-tv.adobe.com')) {
      $video.innerHTML=`<div class="video"><div id="placeholder" class="button">
      <svg xmlns="http://www.w3.org/2000/svg" width="731" height="731" viewBox="0 0 731 731">
              <g id="Group_23" data-name="Group 23" transform="translate(-551 -551)">
                  <circle id="Ellipse_14" data-name="Ellipse 14" cx="365.5" cy="365.5" r="365.5" transform="translate(551 551)" fill="#1473e6"/>
                  <path id="Polygon_3" data-name="Polygon 3" d="M87.5,0,175,152H0Z" transform="translate(992.5 829.5) rotate(90)" fill="#fff"/>
              </g>
              </svg>
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
          title: currentStep['Skill '+(skills.length+1)].replace('\n', '<br>'), 
          icon: currentStep['Skill '+(skills.length+1)+' Icon']
      });
  }
  const $skills=createTag('div',{class: 'skills'});
  let html='';

  skills.forEach((skill) => {
      html+=`<div class="skill"><img src="/static/twp3/icons/${skill.icon}.svg">
          <p>${skill.title.replace('\n', '<br>')}</p></div>`;
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
      $upnext.innerHTML=` <div class="upnext__inner">
                            <div class="window">
                              <img src="${getThumbnail(nextStep)}">
                            </div>
                            ${upnext}
                            <h2>${nextStep.Title.replace('\n', '<br>')}</h2>
                            <p>${nextStep.Description.replace('\n', '<br>')}</p>
                          </div>
      
              `;
  } else {
      $upnext.remove();
  }
  
  $upnext.addEventListener('click', (e) => window.location.href=`step?${stepIndex+2}`)

}

function wrapSections(element) {
  document.querySelectorAll(element).forEach(($div) => {
      const $wrapper=createTag('div', { class: 'section-wrapper'});
      $div.parentNode.appendChild($wrapper);
      $wrapper.appendChild($div);
  });
}


function decorateHero() {
  let hero_background = document.querySelector('.hero img');
  let has_background = hero_background ? hero_background.closest('p').remove() : false;
  let hero_content = document.querySelector('.hero').innerHTML;

  document.querySelector('.hero').innerHTML = `
    <div class="hero__content-inner">
      <div class="hero__content">
        ${hero_content}
      </div>
    </div>
    
    <div class="hero__background" style="background-image: url(${has_background != false ? hero_background.getAttribute('src') : ''});"></div>
  `


}


async function decorateHome() {
  document.body.classList.add('home');

  document.querySelector('main .default:first-of-type').classList.add('hero')

  decorateHero();

  document.querySelectorAll('main p').forEach(($e) => {
      const inner=$e.innerHTML.toLowerCase().trim();
      if (inner == "&lt;steps&gt;" || inner == '\\<steps></steps>') {
              $e.parentNode.classList.add('steps');
          $e.parentNode.innerHTML='';
      }
  })
  await insertSteps();


  const last_row = document.querySelector('main .default:last-of-type')

  last_row.firstElementChild.classList.add('row_title')
  const last_row_links = last_row.querySelectorAll('a');
  const button_group = document.createElement('div');
  button_group.className = 'button_group';
  let links = '';

  last_row_links.forEach((link, index) => {
    link.closest('p').remove();
    let class_name = index >= 1 ? 'secondary' : 'cta'
    console.log(class_name)
    links += `<a href="${link.getAttribute('href')}" class="${class_name}">${link.innerText}</a>`
  })

  button_group.innerHTML = links;
  last_row.append(button_group);
}


async function decoratePage() {
  addDefaultClass('main>div');

  await loadLocalHeader();

  externalLinks('header');
  externalLinks('footer');
  wrapSections('header>div');
  // nav style/dropdown
  // addNavCarrot();


  // if(document.querySelector('.nav-logo')) {
  //   document.querySelector('.nav-logo').addEventListener('click', dropDownMenu)
  // }

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


