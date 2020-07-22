function createHeroElement() {
  let hero = document.querySelectorAll('.title')[0];
  let heroBackground = hero.querySelector('img').getAttribute('src');
  let heroContent = hero.querySelector('.header');
  
  hero.innerHTML = `
    <div class="hero">
      <div class="inner hero__inner">
        ${heroContent.innerHTML}
      </div>
      <div class="hero-background" style="background-image: url(${heroBackground});">
      </div>
    </div>
  ` 
}




if (document.readyState == 'loading') {
  window.addEventListener('DOMContentLoaded', (event) => {
    createHeroElement()
  });
} else {
  createHeroElement()
}
