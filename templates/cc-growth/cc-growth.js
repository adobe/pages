loadJSModule(`/scripts/default.js`);

const items = [];
let has_searched = false;

const set_icon_layout = ($color) => {
  const icons = document.querySelectorAll('main li');
  
  icons.forEach((list_item) => {

    list_item.classList.add(list_item.innerText);

    items.push({name: list_item.innerText})
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
  let extention = has_searched ?'.svg':''
  icons.forEach((icon) => {
    const name = icon.querySelector('.name').innerText;
    icon.querySelector('img').setAttribute('src', `../../static/${$color}/${name}${extention}`)
    icon.querySelector('input').value = `${$color}/${name}`
  })
}


const toggle_button = document.createElement('button');
toggle_button.className = 'toggle_button';
toggle_button.innerHTML = `<span></span>`
document.body.append(toggle_button)


const script = document.createElement('script');
script.type = 'text/javascript';
script.src = 'https://cdn.jsdelivr.net/npm/fuse.js@6.4.6';
document.getElementsByTagName('head')[0].appendChild(script);

const search_input = document.createElement('input');
search_input.classList.add('search-field')
search_input.setAttribute('placeholder', 'Search icons')

document.querySelector('main ul').insertAdjacentHTML('beforebegin', search_input.outerHTML);

const options = {
  threshold: 0.5,
  distance: 100,
  keys: [
    "name"
  ]
};


const rewrite_icons = ($data) => {
  document.querySelector('main ul').innerHTML = '';
  const $color = document.body.classList.contains('dark') ? 'spectrum-icons-white': 'spectrum-icons-black';
  let $list_item = ``;
  
  if($data.length > 0) {
    $data.forEach(($item) => {
      $list_item += `
      <li>
        <span class="group">
          <span class="icons"><img src="../../static/${$color}/${$item.item.name}.svg"></span>
          <div class="name">${$item.item.name}</div>
          <span class="copy">Copy name below</span>
          <br>
          <input type="text" value="${$color}/${$item.item.name}">
        </span>
      </li>
      `
    })
    document.querySelector('main ul').innerHTML = $list_item;
  } else {
    document.querySelector('main ul').innerHTML = `<h1>No matches found.</h1>`;
  }
  // console.log($list_item)
}

window.addEventListener('load', () => {
  const fuse = new Fuse(items, options)
  document.querySelector('.search-field').addEventListener('keyup', function(event) {
    has_searched = true;
    // console.log(fuse.search(event.currentTarget.value), 'here')
    if(event.currentTarget.value.length >= 1) {
      rewrite_icons(fuse.search(event.currentTarget.value))
    }
  })
})

toggle_button.addEventListener('click', () => {
  document.body.classList.toggle('dark')
  if(document.body.classList.contains('dark')) {
    update_colors('spectrum-icons-white');
  } else {
    update_colors('spectrum-icons-black');
  }
})

set_icon_layout('spectrum-icons-black');