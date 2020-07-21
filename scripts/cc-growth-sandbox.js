console.log('loaded')


function createHeroElement() {
  let hero = document.querySelectorAll('.default')[0];
  let heroBackground = hero.querySelector('img').getAttribute('src');
  let heroTitle = hero.querySelector('h1').innerText;
  let heroCopy = hero.querySelectorAll('p')[1].innerText;
  
  hero.innerHTML = `
    <div class="hero">
      <div class="inner hero__inner">
        <div class="hero_content">
          <h1>${heroTitle}</h1>
          <p>${heroCopy}</p>
        </div>
      </div>

      <div class="hero-background" style="background-image: url(${heroBackground});">
      </div>
    </div>
  ` 
}

createHeroElement();