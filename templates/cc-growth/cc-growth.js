loadJSModule(`/scripts/default.js`);


const style_icons = (color) => {
  console.log(color)
  const icons = document.querySelectorAll('main li');
  
  icons.forEach((list_item) => {
    const names = list_item.innerText+'.svg';
    console.log(window.location.origin)
    list_item.innerHTML = `
      <span class="group">
        <span class="icons"><img src="../../static/${color}/${names}"></span>
        <span>Copy name below</span>
        <br>
        <input type="text" value="${color}/${names.split('.svg')[0]}">
      </span>
    `
  })
}


const toggle_button = document.createElement('button');

toggle_button.innerText = 'Toggle Darkmode/Lightmode'
toggle_button.className = 'toggle_button';

document.body.append(toggle_button)


toggle_button.addEventListener('click', () => {
  document.body.classList.toggle('dark')
  if(document.body.classList.contains('dark')) {
    style_icons('spectrum-icons-white');
  }
})

style_icons('spectrum-icons-black');