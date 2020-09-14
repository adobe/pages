async function fetchSteps() {
  window.pages.dependencies.push('steps.json');
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


function wrapSections(element) {
  document.querySelectorAll(element).forEach(($div) => {
      const $wrapper=createTag('div', { class: 'section-wrapper'});
      $div.parentNode.appendChild($wrapper);
      $wrapper.appendChild($div);
  });
}




async function insertSteps() {
  const $steps=document.querySelector('main div.steps');
  const $sectionTitles = document.querySelector("main div:nth-child(2)");
  let addToCategory = '';

  if ($steps) {
      let count = -1;
      const steps=await fetchSteps();
      steps.forEach((step, i) => {
        if(i  % 3 === 0) {
          count++;      
          addToCategory += `<div class="section-title">${$sectionTitles.querySelectorAll('h3')[count].outerHTML}</div><div class="category-steps">`
        }
        addToCategory+=`<div class="card" onclick="window.location='step?${i+1}'">
              <div class='img' style="background-image: url(${getThumbnail(step)})">
              <svg xmlns="http://www.w3.org/2000/svg" width="731" height="731" viewBox="0 0 731 731">
              <g id="Group_23" data-name="Group 23" transform="translate(-551 -551)">
                  <circle id="Ellipse_14" data-name="Ellipse 14" cx="365.5" cy="365.5" r="365.5" transform="translate(551 551)" fill="#1473e6"/>
                  <path id="Polygon_3" data-name="Polygon 3" d="M87.5,0,175,152H0Z" transform="translate(992.5 829.5) rotate(90)" fill="#fff"/>
              </g>
              </svg>
              </div>
              <div class='text'>
                  <div>
                    <div class="icons">
                      <div class="icons__item">
                        <img src="../../../../icons/${step.Product_icon_1.toLowerCase()}.svg">
                      </div>
                      <div class="icons__item">
                        <img src="../../../../icons/${step.Product_icon_2.toLowerCase()}.svg">
                      </div>
                    </div>
                    <h4>${step.Title}</h4>
                    <p>${step.Description}</p>
                  </div>
                  <a href="step?${i+1}">${step.CTA}</a>
              </div>
          </div>`
          if(i  === 2 || i === 5) {
            addToCategory += '</div>'
          }
      })
      // let markup = `${addToCategory}`
      $sectionTitles.innerHTML = '';
      $steps.innerHTML = addToCategory;
  }
}




function addNavCarrot() {
if(document.querySelector('header img')) {
  let svg = document.querySelector('header img');
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
}
}


function dropDownMenu() {
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

  const $content=document.querySelector('.content');
  const $learn=document.querySelector('.learn');
  const $progress=document.querySelector('.progress');

  const $video=createTag('div', {class: 'video-wrapper'});
  $content.appendChild($video);

  const stepIndex=(+window.location.search.substring(1).split('&')[0])-1;
  const steps=await fetchSteps();
  const currentStep=steps[stepIndex];

  //fill content section

  const $h1=document.querySelector('main .content>h1');
  let title=currentStep.Title;
  if (currentStep.Heading) title=currentStep.Heading;
  title=title.split(`\n`).join('<br>');
  title = title.split("&nbsp;").join('<br>')
  $h1.innerHTML=title;


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

  let $skillsTitle = document.querySelector('.learn h2');
  $skills.innerHTML=html;
  $learn.appendChild($skills);

  $skills.prepend($skillsTitle)


  // fill up next
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
  decorateTables();
  await loadLocalHeader();

  externalLinks('header');
  externalLinks('footer');
  
  // nav style/dropdown
  addNavCarrot();

  if(document.querySelector('.nav-logo')) {
    document.querySelector('.nav-logo').addEventListener('click', dropDownMenu)
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
  wrapSections('.home > main > div')
  await cleanUpBio();
  appearMain();
}

if (document.readyState == 'loading') {
  window.addEventListener('DOMContentLoaded', (event) => {
      decoratePage();
  });
} else {
  decoratePage();
}

function toClassName(name) {
  return (name.toLowerCase().replace(/[^0-9a-z]/gi, '-'))
}

function decorateTables() {
  document.querySelectorAll('main div.default>table').forEach(($table) => {
      const $cols=$table.querySelectorAll('thead tr th');
      const cols=Array.from($cols).map((e) => toClassName(e.innerHTML));
      const $rows=$table.querySelectorAll('tbody tr');
      let $div={};

      if (cols.length==1 && $rows.length==1) {
          $div=createTag('div', {class:`${cols[0]}`});
          $div.innerHTML=$rows[0].querySelector('td').innerHTML;
      } else {
          $div=turnTableSectionIntoCards($table, cols) 
      }
      $table.parentNode.replaceChild($div, $table);
  });
}

function cleanUpBio() {
  if(!document.querySelector('.about-bio')) return;
  let $bio = document.querySelector('.about-bio');
  
  if(document.getElementsByTagName('body')[0].classList.contains('home')) {
    $bio.closest('.section-wrapper').classList.add('bio-section')
  }
  const bio = {
    $avatar : $bio.querySelectorAll('img')[0].getAttribute('src'),
    $name : $bio.querySelector('h2').innerText,
    $bioSummary : $bio.querySelector('h4').innerText,
    $behanceLogo : $bio.querySelectorAll('img')[1].getAttribute('src'),
    $link : $bio.querySelector('a:last-of-type').getAttribute('href')
  }

   $bio.innerHTML = `
      <div class="about-bio__inner">
        <div class="bio-image">
          <img src="${bio.$avatar}" alt="image of ${bio.$name}"/>
        </div>
        <div class="bio-content">
          <h4>${bio.$name}</h4>
          <p class="bio">${bio.$bioSummary}</p>
          <a class="follow-link" href="${bio.$link}">
            <img src="${bio.$behanceLogo}" alt="behance logo">
            <p>Follow Me</p>
          </a>
        </div>
      </div>
  `
}