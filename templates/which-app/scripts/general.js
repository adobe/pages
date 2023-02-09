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

// eslint-disable-next-line import/prefer-default-export
export function flattenDom(element, levels = 1) {
  if (!element) return element;
  for (let level = 0; level < levels; level += 1) {
    const children = [...element.children];
    for (
      let childIndex = 0;
      childIndex < children.length;
      childIndex += 1
    ) {
      const child = children[childIndex];
      const subchildren = [...child.children];
      for (const subchild of subchildren) {
        // move subchild to element
        element.appendChild(subchild);
      }
      element.removeChild(child);
    }
  }

  return element;
}
