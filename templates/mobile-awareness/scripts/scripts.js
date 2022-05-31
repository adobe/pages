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

import {
  createTag,
} from '../../default/default.js';
import { sendSMS } from './branch.js';

export function openModalLink(el, app) {
  if (!el || !app) return;
  el.classList.add('branch-link');

  el.addEventListener('click', () => {
    const modals = document.querySelectorAll('.modal-wrapper');

    let modal;
    if (modals.length === 1) {
      modal = modals[0];
    } else {
      modals.forEach((m) => {
        if (m.classList.contains(app)) modal = m;
      });
    }
    if (modal) {
      modal.classList.add('active');
      if (modal.querySelector('input')) modal.querySelector('input').focus();

      modal.querySelector('form').addEventListener('submit', (e) => {
        e.preventDefault();
        if (modal.querySelector('input')) sendSMS(modal.querySelector('input').value, app);
        modal.classList.remove('active');
      });
    }
  });
}

export function wrapContents(
  el,
  { outside, wrapperAttrs, innerAttrs } =
  { outside: false, wrapperAttrs: {}, innerAttrs: {} },
) {
  if (!el) return el;
  const wrapper = createTag('div', 'wrapper');
  el.replaceWith(wrapper);
  wrapper.appendChild(el);
  if (!outside) {
    wrapper.classList.add(...el.classList);
    el.classList = '';
  }
  for (const [key, value] of Object.entries(wrapperAttrs || {})) {
    wrapper.setAttribute(key, value);
  }
  for (const [key, value] of Object.entries(innerAttrs || {})) {
    el.setAttribute(key, value);
  }
  return wrapper;
}

export function hoist(selector, parent, toTop, targetParent) {
  const all = parent.querySelectorAll(selector);
  if (!all) return false;
  return [...all].map((el) => {
    if (toTop) (targetParent || parent).prepend(el);
    else (targetParent || parent).appendChild(el);
    return el;
  });
}

export function replaceTag(el, tagName) {
  const newEl = createTag(tagName);
  const attrs = el.attributes;
  for (let i = 0; i < attrs.length; i += 1) {
    newEl.setAttribute(attrs[i].name, attrs[i].value);
  }
  newEl.append(...el.childNodes);
  el.replaceWith(newEl);
  return newEl;
}
