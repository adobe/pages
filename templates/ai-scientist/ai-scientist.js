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

  

      if(document.querySelector('header .section-wrapper p')) {
          let productName = document.querySelector('header .section-wrapper').children[1].querySelector('p')
          document.querySelector('.product-icon').appendChild(productName)            
      }

  }
}

async function insertSteps() {
  const $steps=document.querySelector('main div.steps');
  // if ($steps) {
  //     const steps=await fetchSteps();
  //     const steps__inner = document.createElement('div');
  //     steps__inner.classList.add('steps__inner')
  //     let step_item = ``;
  
  //     steps.forEach((step, index) => {
  //       console.log(index)
  //       step_item += `
  //         <div class="steps__item">
  //           <a href="step?${index + 1}" class="steps__img">
  //             <img src="${step.Thumbnail}"/>
  //           </a>
  //           <div class="steps__info">
  //             <span>${step.Milestone}</span>
  //             <span>|</span>
  //             <span>${step.Duration}</span>
  //           </div>
  //           <h4>${step.Title}</h4>
  //           <hr>
  //           <p>${step.Description}</p>
  //           <a href="step?${index + 1}">${step.CTA_text}</a>
  //         </div>
  //       `
  //     })

  //     steps__inner.innerHTML = step_item;
  //     $steps.innerHTML = steps__inner.outerHTML
      
  // }
}



async function decorateStep() {
  document.body.classList.add('step');
  const stepIndex=(+window.location.search.substring(1).split('&')[0])-1;
  const steps=await fetchSteps();
  let next_video = '';
  let next_video_index = stepIndex + 1;
  const currentStep=steps[stepIndex];
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


