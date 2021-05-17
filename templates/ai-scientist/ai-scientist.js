async function fetchSteps() {
  window.hlx.dependencies.push('steps.json');
  const resp=await fetch('steps.json');
  const json=await resp.json();
  return (Array.isArray(json) ? json : json.data);
}



function decorateFooter() {
  const create_footer_wave = document.createElement('div');
  create_footer_wave.className = 'footer-wave';
  create_footer_wave.innerHTML = `
    <img src="${window.location.origin}/templates/ai-scientist/assets/footer-wave.svg"/>
  `
  document.querySelector('main .default:last-of-type').append(create_footer_wave);
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

  

      if(document.querySelector('header .section-wrapper p')) {
          let productName = document.querySelector('header .section-wrapper').children[1].querySelector('p')
          document.querySelector('.product-icon').appendChild(productName)            
      }

  }
}

const icon_cleanup = ($string) => {
  let original = $string.split('\n')
  let type = '';
  if(document.getElementsByTagName('body')[0].classList.contains('home')) {
    original.forEach((icon_set) => {
      if(icon_set.split('-')[1] != undefined) {
        type += `
          <div class="great_for_icon_set">
            <img src="${window.location.origin}/templates/ai-scientist/assets/${icon_set.split('-')[1].trim().toLowerCase()}.svg">
          </div>
        `
      }
    })
  } else {
    original.forEach((icon_set) => {
      if(icon_set.split('-')[1] != undefined) {
        type += `
          <li class="great_for_icon_set">
            <span>
              <img src="${window.location.origin}/templates/ai-scientist/assets/${icon_set.split('-')[1].trim().toLowerCase()}.svg">
            </span>
            <span>${icon_set.split('-')[0].trim()}</span>
          </li>
        `
      }
    })
  }
  return type;
}

async function insertSteps() {
  const $steps=document.querySelector('main div.steps');
  if ($steps) {
      const steps=await fetchSteps();
      console.table(steps)
      let $step_item = '';

      steps.forEach((step, index) => {
        let icons = icon_cleanup(step.Great_for)
        $step_item += `
          <div class="steps__item">
            <div class="steps__item--inner flex">
              <div class="steps__for">
                <span>${step.Duration}</span>
                <span class="spacer">|</span>
                <span>${step.Great_for_title}</span>
              </div>
              <div class="steps__for-icons flex">
                ${icons}
              </div>
            </div>
            <a href="step?${index + 1}" class="steps__image">
              <img src="${step.Thumbnail}"/>
            </a>

            <div class="steps__item--inner content">
              <h2>${step.Title}</h2>
              <p>${step.Description}</p>
              <a href="/step?${index + 1}">${step.CTA}</a>
            </div>
          </div>
        `
      })

      $steps.innerHTML = $step_item
  }
}

function style_timeline($string) {
  const cleanup = $string.split('\n');
  let li = '';
  cleanup.forEach((list_item) => {
    li += `<li>${list_item}</li>`
  })
  return li;
}


function video_style ($video_url) {
  const video = `
  <div class="video__wrapper">
    <div class="video__element">
      <video src="${$video_url.Video}">
        <source src="${$video_url.Video}">
      </video>
      <button class="video__play-button">
        <svg xmlns="http://www.w3.org/2000/svg" width="78.092" height="78.092" viewBox="0 0 78.092 78.092">
          <path id="Path_1" data-name="Path 1" d="M41.1,2.05A39.046,39.046,0,1,0,80.142,41.1,39.046,39.046,0,0,0,41.1,2.05ZM61.761,42.787,32.239,60.12a3.924,3.924,0,0,1-2.08.6h-2.8A1.962,1.962,0,0,1,25.4,58.755V23.437a1.962,1.962,0,0,1,1.962-1.962h2.8a3.924,3.924,0,0,1,2.08.6L61.761,39.4a1.962,1.962,0,0,1,0,3.383Z" transform="translate(-2.05 -2.05)" fill="#4e86ff"/>
        </svg>
      </button>
    </div>
    <div class="video-info-single">
      <span><strong>${$video_url.Title}</strong></span>
      <span class="spacer">|</span>
      <span>${$video_url.Duration}</span>
    </div>
    <ul class="video-timeline">
      ${style_timeline($video_url.Video_timeline)}
    </ul>
  </div>
  `
  return video;
}



async function decorateStep() {
  document.body.classList.add('step');
  document.querySelector('main .default:first-of-type').classList.add('hero')
  decorateHero();

  const $intro = document.querySelector('main .default:nth-child(1)');
  const $icon_set = document.querySelector('main .default:nth-child(2)');
  const $step_two = document.querySelector('main .default:nth-child(3)');
  const $step_three = document.querySelector('main .default:nth-child(4)');

  $icon_set.className = 'icon-set'
  $step_two.className = 'step-two'
  $step_three.className = 'step-three'

  const stepIndex=(+window.location.search.substring(1).split('&')[0])-1;
  const steps=await fetchSteps();
  let next_video = '';
  let next_video_index = stepIndex + 1;
  const currentStep=steps[stepIndex];

  console.table(currentStep)

  // hero
  $intro.querySelector('h1').innerText = currentStep.Title
  $intro.querySelector('p').innerText = currentStep.Description

  // icon section
  $icon_set.querySelector('p').remove();
  const create_icon_row = document.createElement('ul');
  create_icon_row.className = 'topic_icons';
  create_icon_row.innerHTML = icon_cleanup(currentStep.Great_for);
  $icon_set.querySelector('.container').append(create_icon_row)

  // step two - video section
  const video_element = document.createElement('div');
  video_element.className = 'step-video';
  video_element.innerHTML = video_style(currentStep) 
  $step_three.querySelector('.container').append(video_element)

  const nav = $step_three.querySelector('ul');
  nav.className = 'mini-nav'
  $step_three.querySelector('ul').remove()

  console.log(stepIndex)
  if(stepIndex === 0) {
    
  }

  document.querySelector('.video__wrapper').append(nav)


  if(stepIndex === 0) {
    document.querySelector('.mini-nav li:last-of-type').remove() 
  } else {
    document.querySelector('.mini-nav li:last-of-type a').setAttribute('href', `step?${stepIndex}`)
    document.querySelector('.mini-nav li:last-of-type a').innerText = steps[stepIndex-1].Title
  }

  if(stepIndex + 1 < steps.length) {
    console.log('not last video')
    document.querySelector('.mini-nav li:nth-child(1) a').setAttribute('href', `step?${stepIndex+2}`)
    document.querySelector('.mini-nav li:nth-child(1) a').innerText = steps[stepIndex+1].Title
  } else {
    console.log('last video')
    document.querySelector('.mini-nav li:nth-child(1)').remove(); 
  }
  

  // get oriented
  // set up video section on homepage
  const $video_card = document.querySelector('main .default:nth-child(5) .container');
  document.querySelector('main .default:nth-child(5)').classList.add('video_card')
  const $video_url = $video_card.querySelector('a')
  $video_url.parentElement.remove();
  const $video_content = $video_card.innerHTML;
  $video_card.innerHTML = ``

  $video_card.innerHTML = `
    <div class="video__wrapper">
      <div class="video__element">
        <video src="${$video_url.getAttribute('href')}">
          <source src="${$video_url.getAttribute('href')}">
          </video>
          <button class="video__play-button">
            <svg xmlns="http://www.w3.org/2000/svg" width="78.092" height="78.092" viewBox="0 0 78.092 78.092">
              <path id="Path_1" data-name="Path 1" d="M41.1,2.05A39.046,39.046,0,1,0,80.142,41.1,39.046,39.046,0,0,0,41.1,2.05ZM61.761,42.787,32.239,60.12a3.924,3.924,0,0,1-2.08.6h-2.8A1.962,1.962,0,0,1,25.4,58.755V23.437a1.962,1.962,0,0,1,1.962-1.962h2.8a3.924,3.924,0,0,1,2.08.6L61.761,39.4a1.962,1.962,0,0,1,0,3.383Z" transform="translate(-2.05 -2.05)" fill="#4e86ff"/>
            </svg>
        
          </button>

      </div>
      <div class="video__content">
        ${$video_content}
      </div>
    </div>
  
  `
  
  document.querySelector('.video__play-button').addEventListener('click', (event) => {
    document.querySelector('.video__element video').play();
    document.querySelector('.video__element video').setAttribute('controls', true);
    event.currentTarget.remove();
  })




  // style footer 
  decorateFooter();

}

function wrapSections(element) {
  document.querySelectorAll(element).forEach(($div) => {
      const $wrapper=createTag('div', { class: 'section-wrapper'});
      $div.parentNode.appendChild($wrapper);
      $wrapper.appendChild($div);
      $wrapper.firstElementChild.classList.add('container')
  });
}


function decorateHero() {
  let svg = document.createElement('div');
  svg.className = 'hero-banner';
  const svg_path = `${window.location.origin}/templates/ai-scientist/assets/hero.svg`

  svg.innerHTML = `<img src="${svg_path}">`
  // svg.innerHTML = `./assets/hero.svg`
  
  document.querySelector('.hero .container').prepend(svg)

  

}

async function decorateHome() {
  document.body.classList.add('home');

  document.querySelector('main .default:first-of-type').classList.add('hero')
  decorateHero();

  const $section_two = document.querySelector('main .default:nth-child(2)');

  let li = '';

  // icon set up on homepage
  $section_two.querySelectorAll('li').forEach((list) => {
    let icon_title = list.innerText.split('-')[0]
    let icon_type = list.innerText.split('-')[1].trim()
    li += `
      <li class="${icon_type}">
        <span><img src="${window.location.origin}/templates/ai-scientist/assets/${icon_type}.svg"></span>
        <span>${icon_title}</span>
      </li>
    `
  })

  $section_two.querySelector('ul').innerHTML = li;
  $section_two.querySelector('ul').className = 'topic_icons';

  // set up video section on homepage
  const $section_three = document.querySelector('main .default:nth-child(3) .container');
  const $video_url = $section_three.querySelector('a')
  $video_url.parentElement.remove();
  const $video_content = $section_three.innerHTML;
  $section_three.innerHTML = ``

  $section_three.innerHTML = `
    <div class="video__wrapper">
      <div class="video__element">
        <video src="${$video_url.getAttribute('href')}">
          <source src="${$video_url.getAttribute('href')}">
          </video>
          <button class="video__play-button">
            <svg xmlns="http://www.w3.org/2000/svg" width="78.092" height="78.092" viewBox="0 0 78.092 78.092">
              <path id="Path_1" data-name="Path 1" d="M41.1,2.05A39.046,39.046,0,1,0,80.142,41.1,39.046,39.046,0,0,0,41.1,2.05ZM61.761,42.787,32.239,60.12a3.924,3.924,0,0,1-2.08.6h-2.8A1.962,1.962,0,0,1,25.4,58.755V23.437a1.962,1.962,0,0,1,1.962-1.962h2.8a3.924,3.924,0,0,1,2.08.6L61.761,39.4a1.962,1.962,0,0,1,0,3.383Z" transform="translate(-2.05 -2.05)" fill="#4e86ff"/>
            </svg>
        
          </button>

      </div>
      <div class="video__content">
        ${$video_content}
      </div>
    </div>
  
  `
  
  document.querySelector('.video__play-button').addEventListener('click', (event) => {
    document.querySelector('.video__element video').play();
    document.querySelector('.video__element video').setAttribute('controls', true);
    event.currentTarget.remove();
  })

  document.querySelectorAll('main p').forEach(($e) => {
      const inner=$e.innerHTML.toLowerCase().trim();
      if (inner == "&lt;steps&gt;" || inner == '\\<steps></steps>') {
              $e.parentNode.classList.add('steps');
          $e.parentNode.innerHTML='';
      }
  })
  await insertSteps();

  decorateFooter();

}


async function decoratePage() {
  wrapSections('main>div');
  addDefaultClass('main>div');
  await loadLocalHeader();

  externalLinks('header');
  externalLinks('footer');
  wrapSections('header>div');

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


