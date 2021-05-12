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
  });
}


function decorateHero() {


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

}


async function decoratePage() {
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


