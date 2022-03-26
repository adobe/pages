/*
 * Copyright 2022 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

import jsonSetUp from './jsonSetUp.js';
import createSideBar from './createSideBar.js';

const createHeader = () => {
  const $header = document.querySelector('header');
  const $logo = document.createElement('a');
  $logo.className = 'logo';
  $logo.href = 'https://www.adobe.com/';
  const $icon = document.createElement('img');
  $icon.className = 'icon';
  $icon.src = '/icons/creativecloud.svg';
  $logo.append($icon);
  const $logoText = document.createElement('span');
  $logoText.className = 'logo__text';
  $logoText.innerHTML = 'Adobe Creative Cloud';
  $logo.append($logoText);
  $header.append($logo);

  const $link1 = document.createElement('a');
  $link1.href = 'https://www.adobe.com/products/creativesuite.html';
  $link1.target = '_blank';
  $link1.className = 'header__link';
  $link1.innerHTML = 'Photoshop Quick Actions';
  $header.append($link1);
};

const createGifArea = ($block) => {
  const $gif = document.createElement('div');
  $gif.className = 'gif';
  $block.append($gif);

  return (uri) => {
    $gif.style.backgroundImage = `url(${uri})`;
  };
};

const createBackground = () => {
  const $background = document.createElement('div');
  $background.className = 'quickactions__background';
  document.body.append($background);

  return (uri) => {
    $background.style.backgroundImage = `url(${uri})`;
  };
};

const createMobileContentArea = ($block) => {
  const $mobileContent = document.createElement('div');
  $mobileContent.className = 'quickactions__mobile-content';
  $block.append($mobileContent);

  return (content) => {
    $mobileContent.innerHTML = content;
  };
};

const preloadImages = (images) => {
  images.forEach((image) => {
    const img = new Image();
    img.src = image;
  });
};

export default async function quickActions($block) {
  const $blockChild = $block.childNodes;
  const json = await jsonSetUp($blockChild);
  // * json is in the format [{ gif: uri, text: html string, background: uri }]

  createHeader();

  $block.innerHTML = '';
  const updateContent = await createMobileContentArea($block);
  const updateGifArea = await createGifArea($block);
  const updateBackground = await createBackground($block);
  await createSideBar($block, json, { updateGifArea, updateBackground, updateContent });

  preloadImages(json.map((item) => item.gif));
  preloadImages(json.map((item) => item.background));
}
