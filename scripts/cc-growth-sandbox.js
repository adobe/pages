console.log('loaded')


function createHeroElement() {
  const hero = document.querySelector('.default');
  const $img = hero.querySelector('img');
  const heroBackground=$img?$img.getAttribute('src'):'';
  const heroTitle = hero.querySelector('h1').innerHTML;
  const $p = hero.querySelectorAll('p')[1];
  const heroCopy=$p?$p.innerHTML:'';
  
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