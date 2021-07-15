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
// let hasSearched = false;

const options = {
  threshold: 0.99,
  distance: 100,
  keys: [
    'name',
  ],
};

const runLazyLoader = (images) => {
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

const setIconLayout = ($color) => {
  const icons = document.querySelectorAll('main li');
  icons.forEach((listItem) => {
    listItem.classList.add(listItem.innerText);
    items.push({ name: listItem.innerText });
    const names = `${listItem.innerText}.svg`;
    listItem.innerHTML = `
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
  runLazyLoader(document.querySelectorAll('.icons img'));
};

const writeFuseLibToHead = () => {
  if (!document.body.classList.contains('icons')) return;
  const script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = 'https://cdn.jsdelivr.net/npm/fuse.js@6.4.6';
  document.getElementsByTagName('head')[0].appendChild(script);
};

const writeInputField = () => {
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

const rewriteIcons = ($data) => {
  document.querySelector('main ul').innerHTML = '';
  const $color = document.body.classList.contains('dark') ? 'spectrum-icons-light' : 'spectrum-icons-dark';
  let $listItem = '';

  if ($data.length > 0) {
    $data.forEach(($item) => {
      $listItem += `
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
    document.querySelector('main ul').innerHTML = $listItem;
    runLazyLoader(document.querySelectorAll('.icons img'));
  } else {
    document.querySelector('main ul').innerHTML = '<h1>No matches found.</h1>';
  }
};

writeFuseLibToHead();

window.addEventListener('load', () => {
  if (!document.body.classList.contains('icons')) return;
  setIconLayout('spectrum-icons-dark');
  writeInputField();

  // eslint-disable-next-line no-undef
  const fuse = new Fuse(items, options);
  document.querySelector('form').addEventListener('submit', (event) => {
    event.preventDefault();
    // hasSearched = true;
    if (document.querySelector('input').value.length >= 1) {
      rewriteIcons(fuse.search(document.querySelector('input').value));
    }
  });
});
