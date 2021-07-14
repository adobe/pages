/*
 * Copyright 2021 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */
const items = [];
let has_searched = false;

const options = {
  threshold: 0.99,
  distance: 100,
  keys: [
    'name',
  ],
};

const run_lazy_loader = (images) => {
  const observer = new IntersectionObserver((element) => {
    element.forEach((image) => {
      if (!image.isIntersecting) return;
      if (image.intersectionRatio > 0) {
        if (image.target.getAttribute('data-src')) {
          const img = new Image();
          img.src = image.target.getAttribute('data-src');
          img.onload = () => {
            image.target.setAttribute('src', img.src);
            image.target.classList.add('loaded');
          };
        }
        observer.unobserve(image.target);
      }
    });
  }, options);

  images.forEach((image) => observer.observe(image));
};

const set_icon_layout = ($color) => {
  const icons = document.querySelectorAll('main li');
  icons.forEach((list_item) => {
    list_item.classList.add(list_item.innerText);
    items.push({ name: list_item.innerText });
    const names = `${list_item.innerText}.svg`;
    list_item.innerHTML = `
      <span class="group">
        <span class="icons">
          <img data-src="../../static/${$color}/${names}" src="">
        </span>
        <div class="name">${names}</div>
        <span class="copy">Copy name below</span>
        <br>
        <input type="text" value="${$color}/${names.split('.svg')[0]}">
      </span>
    `;
  });
  run_lazy_loader(document.querySelectorAll('.icons img'));
};

const write_fuse_lib_to_head = () => {
  if (!document.body.classList.contains('icons')) return;
  const script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = 'https://cdn.jsdelivr.net/npm/fuse.js@6.4.6';
  document.getElementsByTagName('head')[0].appendChild(script);
};

const write_input_field = () => {
  const search = document.createElement('form');
  search.classList.add('search-field');

  search.innerHTML = `
  <input type="text" placeholder="Search icons">
  <div>
  <button>Search icons</button>
  </div>
  `;
  document.querySelector('main ul').insertAdjacentHTML('beforebegin', search.outerHTML);
};

const rewrite_icons = ($data) => {
  document.querySelector('main ul').innerHTML = '';
  const $color = document.body.classList.contains('dark') ? 'spectrum-icons-light' : 'spectrum-icons-dark';
  let $list_item = '';

  if ($data.length > 0) {
    $data.forEach(($item) => {
      $list_item += `
      <li>
      <span class="group">
      <span class="icons"><img data-src="../../static/${$color}/${$item.item.name}.svg" src=""></span>
      <div class="name">${$item.item.name}</div>
      <span class="copy">Copy name below</span>
      <br>
      <input type="text" value="${$color}/${$item.item.name}">
      </span>
      </li>
      `;
    });
    document.querySelector('main ul').innerHTML = $list_item;
    run_lazy_loader(document.querySelectorAll('.icons img'));
  } else {
    document.querySelector('main ul').innerHTML = '<h1>No matches found.</h1>';
  }
};

write_fuse_lib_to_head();

window.addEventListener('load', () => {
  if (!document.body.classList.contains('icons')) return;
  set_icon_layout('spectrum-icons-dark');
  write_input_field();

  const fuse = new Fuse(items, options);
  document.querySelector('form').addEventListener('submit', (event) => {
    event.preventDefault();
    has_searched = true;
    if (document.querySelector('input').value.length >= 1) {
      rewrite_icons(fuse.search(document.querySelector('input').value));
    }
  });
});
