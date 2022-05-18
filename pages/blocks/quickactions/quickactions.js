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
  const $logo = document.createElement('div');
  $logo.className = 'logo';
  const $icon = document.createElement('img');
  $icon.className = 'icon';
  $icon.src = '/icons/photoshop.svg';
  $logo.append($icon);
  const $logoText = document.createElement('span');
  $logoText.className = 'logo__text';
  $logoText.innerHTML = 'Photoshop Quick Actions';
  $logo.append($logoText);
  $header.append($logo);
};

const createVideoArea = ($block) => {
  const $videoArea = document.createElement('div');
  $videoArea.className = 'quickactions__video-area';
  $block.append($videoArea);

  return (uri) => {
    $videoArea.innerHTML = '';
    const $video = document.createElement('video');
    $video.setAttribute('muted', 'muted');
    $video.setAttribute('playsinline', 'playsinline');
    $video.setAttribute('autoplay', 'autoplay');
    $video.setAttribute('loop', 'loop');
    const $source = document.createElement('source');
    $source.setAttribute('type', 'video/mp4');
    $source.setAttribute('src', uri);
    $video.append($source);
    $videoArea.append($video);
    $video.muted = true;
    $video.play();
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
  // * json is in the format [{ video: uri, text: html string, background: uri }]

  createHeader();

  $block.innerHTML = '';
  const updateContent = await createMobileContentArea($block);
  const updateVideoArea = await createVideoArea($block);
  const updateBackground = await createBackground($block);
  await createSideBar($block, json, { updateVideoArea, updateBackground, updateContent });

  preloadImages(json.map((item) => item.background));
}
