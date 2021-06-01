async function fetch_sheet() {
  window.hlx.dependencies.push('content.json');
  const resp=await fetch('content.json');
  const json=await resp.json();
  return (Array.isArray(json) ? json : json.data);
}




async function insertSteps() {
  const $steps=document.querySelector('main div.steps');
  if ($steps) {
      const steps=await fetchSteps();
      if(steps[0].Category) {
          
          
          let titles = [];
          let stepGroups = [];
          let markup = '';
          steps.forEach((stepsType) => {
              if(!titles.includes(stepsType.Category)) {
                  titles.push(stepsType.Category)
                  stepGroups.push({
                      Category: stepsType.Category,
                      title: stepsType.Category_Title,
                  });
              } 
          })
          
          stepGroups.forEach((stepsNest) => {
              
              markup += `
                  <div class="row">
                      <div class="row-title">
                          <h3>${stepsNest.title}</h3>
                      </div>
              `
              
              if(step.Thumbnail.includes('http')) {
                  console.log('has external link')
              } else {
                  console.log('does not contain external link')
              }

              markup += `<div class="steps">`
              
              steps.forEach((step, i) => {
                  if(step.Category === stepsNest.Category) {
                      markup += `
                      <div class="card" onclick="window.location='step?${i+1}'">
                  <div class='img' style="background-image: url(../../../static/ete/${step.Thumbnail})">
                  <svg xmlns="http://www.w3.org/2000/svg" width="731" height="731" viewBox="0 0 731 731">
                  <g id="Group_23" data-name="Group 23" transform="translate(-551 -551)">
                      <circle id="Ellipse_14" data-name="Ellipse 14" cx="365.5" cy="365.5" r="365.5" transform="translate(551 551)" fill="#1473e6"/>
                      <path id="Polygon_3" data-name="Polygon 3" d="M87.5,0,175,152H0Z" transform="translate(992.5 829.5) rotate(90)" fill="#fff"/>
                  </g>
                  </svg>
                  </div>
                  <div class='text'>
                      <div><h4>${step.Title.replace('\n', '<br>')}</h4>
                      <p>${step.Description.replace('\n', '<br>')}</p>
                      </div>
                      <a href="step?${i+1}">${step.CTA}</a>
                  </div>
              </div>
                      
                      `
                  }
              })
              markup += `</div> </div>`
          })

          $steps.innerHTML=markup;
          // console.log(markup)

      } else {
          let html='';
          steps.forEach((step, i) => {
              let setThumbnail;

              if(step.Thumbnail.includes('http')) {
                  setThumbnail = step.Thumbnail
              } else {
                  setThumbnail = ` ../../../../static/ete/hero-posters/${getThumbnail(step)}`
              }
              html+=`<div class="card" onclick="window.location='step?${i+1}'">
                  <div class='img'>
                  <img src="${setThumbnail}">
                  <svg xmlns="http://www.w3.org/2000/svg" width="731" height="731" viewBox="0 0 731 731">
                  <g id="Group_23" data-name="Group 23" transform="translate(-551 -551)">
                      <circle id="Ellipse_14" data-name="Ellipse 14" cx="365.5" cy="365.5" r="365.5" transform="translate(551 551)" fill="#1473e6"/>
                      <path id="Polygon_3" data-name="Polygon 3" d="M87.5,0,175,152H0Z" transform="translate(992.5 829.5) rotate(90)" fill="#fff"/>
                  </g>
                  </svg>
                  </div>
                  <div class='text'>
                    <div class="icons">
                      <div class="icons__item">
                        <img src="../../../../icons/${step.Product_icon_1.toLowerCase()}.svg">
                      </div>
                      <div class="icons__item">
                        <img src="../../../../icons/${step.Product_icon_2.toLowerCase()}.svg">
                      </div>
                    </div>
                    <div class="card-content"> 
                      <h4>${step.Title}</h4>
                      <p>${step.Description}</p>
                    </div>
                    <a href="step?${i + 1}">${step.CTA}</a>
                  </div>
              </div>`
          })
          $steps.innerHTML=html;
      }
  }
}


async function decorateHome() {
  document.body.classList.add('home');
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
  // wrapSections('header>div');
  // nav style/dropdown
  // addNavCarrot();


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
      // await decorateStep();
  }

  window.pages.decorated = true;
  appearMain();
  // cardHeightEqualizer(".card-content");
}

if (document.readyState == 'loading') {
  window.addEventListener('DOMContentLoaded', (event) => {
      decoratePage();
  });
} else {
  decoratePage();
}

