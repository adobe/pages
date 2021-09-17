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

/* eslint-disable no-param-reassign */

function decorateImageComparison() {
  const imageParent = document.querySelector('.image-parent');
  const indicator = document.querySelector('.indicator');
  const mask = document.querySelector('.mask');
  const imageMask = document.querySelector('.masked__img');
  imageParent.parentElement.classList.add('image-comparison-element');
  const imageComparisonParent = document.querySelector('.image-comparison-element');
  const images = [];

  const setImages = () => {
    imageComparisonParent.querySelectorAll('p').forEach((item, index) => {
      if (item.childNodes[0].nodeName === 'IMG' && index <= 1) {
        images.push(item.childNodes[0].getAttribute('src'));
        item.remove();
      }
    });

    document.querySelector('.masked__img').style.backgroundImage = `url(${images[0]})`;
    document.querySelector('.image-parent__img').style.backgroundImage = `url(${images[1]})`;
  };

  window.addEventListener('load', setImages);

  const initSize = () => {
    const parentWidth = imageParent.offsetWidth;
    imageMask.style.width = `${parentWidth}px`;
  };

  const runDragger = (event, flag) => {
    if (flag) {
      imageParent.addEventListener('mousemove', (e) => {
        if (flag) {
          const x = e.clientX - imageParent.offsetLeft;

          if (x <= imageParent.offsetWidth && x >= 0) {
            mask.style.width = `${x}px`;
            indicator.classList.add('active');
            document.getElementsByTagName('body')[0].classList.add('slider-enabled');
            indicator.querySelector('.indicator__bar').style.left = 'auto';
            indicator.querySelector('.indicator__bar').style.transform = `translatex(${x}px)`;
          }

          imageParent.addEventListener('mouseup', () => {
            flag = false;
            document.getElementsByTagName('body')[0].classList.remove('slider-enabled');
          });
        }
      });
    } else {
      flag = false;
    }
  };

  imageParent.addEventListener('mousedown', (event) => runDragger(event, true));

  window.addEventListener('load', initSize);
  window.addEventListener('resize', initSize);
}
export default function decorate($el) {
  $el.innerHTML = `
  <div class="image-parent">
  <div class="image-parent__item">
    
    <div class="mask">
      <div class="masked__img"></div>
    </div>
    
      <div class="indicator">
        <div class="indicator__bar">
          <div class="indicator__bubble">
            <div class="indicator__arrows">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 13 6">
                <g id="Group_1" data-name="Group 1" transform="translate(-11.5 -19.5)">
                  <path id="Polygon_2" data-name="Polygon 2" d="M3,0,6,4H0Z" transform="translate(24.5 19.5) rotate(90)" fill="#fff"/>
                  <path id="Polygon_3" data-name="Polygon 3" d="M3,0,6,4H0Z" transform="translate(11.5 25.5) rotate(-90)" fill="#fff"/>
                </g>
              </svg>                
            </div>
          </div>
        </div>
      </div>
    
    <div class="image image-parent__img"></div>

    <div class="lightroom">
      <img src="http://landing.adobe.com/dam/global/images/lightroom-cc.mnemonic.240x234.png" alt="">
    </div>
  </div>
</div>
`;

  decorateImageComparison();
}
