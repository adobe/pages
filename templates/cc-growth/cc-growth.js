loadJSModule(`/scripts/default.js`);


const set_icon_layout = ($color) => {
  const icons = document.querySelectorAll('main li');
  
  icons.forEach((list_item) => {
    const names = list_item.innerText+'.svg';
    list_item.innerHTML = `
      <span class="group">
        <span class="icons"><img src="../../static/${$color}/${names}"></span>
        <div class="name">${names}</div>
        <span class="copy">Copy name below</span>
        <br>
        <input type="text" value="${$color}/${names.split('.svg')[0]}">
      </span>
    `
  })
}

const update_colors = ($color) => {
  const icons = document.querySelectorAll('main li');
  icons.forEach((icon) => {
    const name = icon.querySelector('.name').innerText;
    icon.querySelector('img').setAttribute('src', `../../static/${$color}/${name}`)
    icon.querySelector('input').value = `${$color}/${name}`
  })
}


const toggle_button = document.createElement('button');
toggle_button.className = 'toggle_button';
toggle_button.innerHTML = `<span></span>`
document.body.append(toggle_button)


toggle_button.addEventListener('click', () => {
  document.body.classList.toggle('dark')
  if(document.body.classList.contains('dark')) {
    update_colors('spectrum-icons-white');
  } else {
    update_colors('spectrum-icons-black');
  }
})

set_icon_layout('spectrum-icons-black');