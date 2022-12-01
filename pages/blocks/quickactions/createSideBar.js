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
const createSideBar = ($block, json, { updateVideoArea, updateBackground, updateContent }) => {
  let activeIndex = 0;
  let heightResetTimeout;

  const $sideBar = document.createElement('div');
  $sideBar.classList.add('sidebar');

  const $sidebarElements = document.createElement('div');
  $sidebarElements.classList.add('sidebar__elements');
  $sideBar.appendChild($sidebarElements);

  // indicator
  const $indicator = document.createElement('div');
  $indicator.classList.add('sidebar__indicator');
  const $leftLine = document.createElement('div');
  $leftLine.classList.add('sidebar__leftline');
  $sideBar.appendChild($indicator);
  $sideBar.appendChild($leftLine);

  const moveIndicator = () => {
    // * other solutions didn't work b/c the elements are moving while any
    // * 1-time calc would be done, and it could "beat" an element to its
    // * final position, causing it to end up stuck in the wrong place.
    // * hence, it's always watching.
    const target = $sidebarElements.childNodes[activeIndex].firstElementChild.offsetTop;
    const current = $indicator.offsetTop;
    const difference = target - current;
    if (Math.abs(difference) > 1) {
      const speed = 6; // lower is faster
      let newPosition = current + Math.ceil(difference / speed);
      if (difference < 0) newPosition = current + Math.floor(difference / speed);
      // console.log({
      //   target, current, difference, speed, newPosition,
      // });
      $indicator.style.top = `${newPosition}px`;
    }

    requestAnimationFrame(moveIndicator);
  };

  const select = (index) => {
    clearTimeout(heightResetTimeout);

    const $sidebarItems = $sidebarElements.childNodes;

    // * set previous active height back to a number so it can animate
    const targetHeight = $sidebarItems[activeIndex].offsetHeight;
    $sidebarItems[activeIndex].style.height = `${targetHeight}px`;

    // * set new active element
    activeIndex = index;

    // * update mobile content section
    updateContent(json[activeIndex].text);

    // * set all non-active elements to just the height of their first child
    $sidebarItems.forEach((item) => {
      item.classList.remove('active');
      item.style.height = `${item.firstElementChild.offsetHeight}px`;
    });

    // * set active element to full height
    $sidebarItems[index].classList.add('active');
    let newTargetHeight = 0;
    $sidebarItems[index].childNodes.forEach((node) => {
      newTargetHeight += node.offsetHeight || 0;
    });
    newTargetHeight -= 1; // somehow this fixes a slight jump on reset to 'auto'
    $sidebarItems[index].style.height = `${newTargetHeight}px`;

    // * reset to auto height once animation is complete so that window resizing works
    heightResetTimeout = setTimeout(() => {
      $sidebarItems[index].style.height = 'auto';
    }, 1000);

    // * update indicator
    $indicator.style.height = `${$sidebarItems[index].firstElementChild.offsetHeight}px`;

    // * update video and bg
    updateVideoArea(json[index].video);
    updateBackground(json[index].background);
  };

  // elements
  json.forEach((item, index) => {
    const $sidebarElement = document.createElement('div');
    $sidebarElement.classList.add('sidebar__item');

    const splitContent = /^(<h\d[^<]*<\/h\d>)(.*)$/gi.exec(item.text.trim());
    if (!splitContent) {
      json.splice(index, 1);
      return;
    }
    const headerContent = splitContent[1];
    const bodyContent = splitContent[2];

    // header
    const $header = document.createElement('div');
    $header.classList.add('sidebar__item__header');
    $header.innerHTML = headerContent;
    $sidebarElement.appendChild($header);

    // body
    const $body = document.createElement('div');
    $body.classList.add('sidebar__item__body');
    $body.innerHTML = bodyContent;
    $sidebarElement.appendChild($body);

    $sidebarElement.addEventListener('click', () => {
      select(index);
    });
    $sidebarElements.appendChild($sidebarElement);
  });

  $block.insertBefore($sideBar, $block.firstElementChild);

  select(activeIndex);
  moveIndicator();
};

export default createSideBar;
