function setUpBackground() {
  if(!document.querySelector('.missionbg-container')) return;
  const backgroundParent = document.querySelector('.missionbg-container');

  if(backgroundParent.classList.contains('tall')) {
    document.querySelector('main').classList.add('tall-bg')
  }

  if(backgroundParent.classList.contains('tallest')) {
    document.querySelector('main').classList.add('tallest-bg')
  }
  
  let backgroundImage = backgroundParent.querySelector('img').getAttribute('src');
  backgroundParent.style.backgroundImage = 'url('+ backgroundImage +')'
  backgroundParent.innerHTML = '';
}

setUpBackground();