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
export default function jsonSetUp($node) {
  const allObjects = [];
  $node.forEach(($bc) => {
    const object = {};
    const $children = [...$bc.children];
    $children.forEach((child, index) => {
      if (index === 0) {
        object.video = child.querySelector('a').getAttribute('href');
      }

      if (index === 1) {
        object.text = child.innerHTML.replace(/<a /g, '<a target="_blank" ').replace(/\s*\n\s*/gm,'');
      }

      if (index === 2) {
        object.background = (child.querySelector('img') && child.querySelector('img').getAttribute('src')) || (allObjects[0] && allObjects[0].background);
      }
    });
    allObjects.push(object);
  });
  return allObjects;
}
