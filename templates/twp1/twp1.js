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
  
      steps.forEach((step, index) => {
        console.log(index)
        step_item += `
          <div class="steps__item">
            <a href="step?${index + 1}" class="steps__img">
              <img src="${step.Thumbnail}"/>
            </a>
            <div class="steps__info">
              <span>${step.Milestone}</span>
              <span>|</span>
              <span>${step.Duration}</span>
            </div>
            <h4>${step.Title}</h4>
            <hr>
            <p>${step.Description}</p>
            <a href="step?${index + 1}">${step.CTA_text}</a>
          </div>
        `
      })

      steps__inner.innerHTML = step_item;
      $steps.innerHTML = steps__inner.outerHTML
      
  }
}



async function decorateStep() {
  document.body.classList.add('step');

  const stepIndex=(+window.location.search.substring(1).split('&')[0])-1;
  const steps=await fetchSteps();
  let next_video = '';
  let next_video_index = stepIndex + 1;


  if(stepIndex + 1 < steps.length) {
    next_video = `<a href="?${next_video_index + 1}">${steps[next_video_index].Title}</a> <span>|</span>`
  } else {
    next_video = '';
  }
  // if(stepIndex)
  const currentStep=steps[stepIndex];
  document.querySelector('main .default:first-of-type').classList.add('hero')
  decorateHero();
  const $hero = document.querySelector('main .hero');
  const $step_1 = document.querySelector('main .default:nth-child(2)')
  const $step_2 = document.querySelector('main .default:nth-child(3)')
  const $step_3 = document.querySelector('main .default:nth-child(4)')
  const last_row = document.querySelector('main .default:last-of-type')


  // set up hero
  $hero.querySelector('h4').innerText = currentStep.Milestone;
  $hero.querySelector('h1').innerText = currentStep.Title;
  $hero.querySelector('p').innerText = currentStep.Single_page_description;
  
  // set up step 1
  $step_1.innerHTML = `
    <div class="default__container step-1">
      <div class="default__content center">
        <h3>${currentStep.Step_one_mini_title}</h3>
        <h2>${currentStep.Step_one_title}</h2>
        <p>${currentStep.Step_one_copy?currentStep.Step_one_copy:''}</p>
        <a href="${currentStep.Step_one_link}" class="cta">${currentStep.Step_one_cta_text}</a>
      </div>
    </div>
  `

  // set up step 2

  const timestamps_all = currentStep.Step_two_timestamp.split('\n');
  let timestamps = '';
  const timestamp_parent = document.createElement('ul');

  timestamps_all.forEach((time) => {
    if(time.length > 2) {
      timestamps += `<li>${time}</li>`
    }
  })

  timestamp_parent.innerHTML = timestamps


  $step_2.innerHTML = `
  <div class="default__container step-2">
    <div class="default__content center">
      <h3>${currentStep.Step_two_mini_title}</h3>
      <h2>${currentStep.Step_two_title}</h2>
    </div>
    <div class="video">
      <video class="video__el" preload="metadata" src="${currentStep.Step_two_video}">
        <source src="${currentStep.Step_two_video}" type="video/mpeg4">
      </video>
      <button class="play-video">
      <svg xmlns="http://www.w3.org/2000/svg" width="40" height="51" viewBox="0 0 40 51">
        <path id="Polygon_1" data-name="Polygon 1" d="M25.5,0,51,40H0Z" transform="translate(40) rotate(90)" fill="#fff"/>
      </svg>
    
      </button>
    </div>
    <div class="default__content default__step-info">
      <h4>${currentStep.Title}
        <span>|</span>
        ${currentStep.Duration}
      </h3>
      <p>${currentStep.Description}</p>
    </div>
    <div class="default__following-along">
      <h5>${currentStep.Step_two_timestamp_title}</h5>
      ${timestamp_parent.outerHTML}

      <div class="milestones">
        <p class="milestone-of">${currentStep.Step_two_see_all_title}</p>
        <p class="milestones-links">
          ${currentStep.Next}:
          ${next_video}
          <a href="./">${currentStep.See_all}</a>
        </p>
      </div>
    </div>
    
  </div>
  `

  // step 3
  $step_3.innerHTML = `
    <div class="default__container step-3">
      <div class="default__content center">
        <h3>${currentStep.Step_three_mini_title}</h3>
        <h2>${currentStep.Step_three_title}</h2>
        <p>${currentStep.Step_three_copy?currentStep.Step_three_copy:''}</p>
        <a href="${currentStep.Step_three_link}" class="cta">${currentStep.Step_three_cta_text}</a>
      </div>
    </div>
  `


  // play video handler
  document.querySelector('.play-video').addEventListener('click', (event) => {
    document.querySelector('.video__el').play();
    document.querySelector('.video__el').setAttribute('controls', true)
    event.currentTarget.remove()
  })
  

  // style last row
  last_row.firstElementChild.classList.add('row_title')
  const last_row_links = last_row.querySelectorAll('a');
  const button_group = document.createElement('div');
  button_group.className = 'button_group';
  let links = '';

  last_row_links.forEach((link, index) => {
    link.closest('p').remove();
    let class_name = index >= 1 ? 'secondary' : 'cta'
    links += `<a target="_BLANK" href="${link.getAttribute('href')}" class="${class_name}">${link.innerText}</a>`
  })

  button_group.innerHTML = links;
  last_row.append(button_group);
  
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
    links += `<a target="_blank" href="${link.getAttribute('href')}" class="${class_name}">${link.innerText}</a>`
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


