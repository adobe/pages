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
const handlers = {};

/**
 * Register callback for when event occurs.
 * `undefined` event name is called for every event.
 *
 * @param {string}    event name
 * @param {Function}  handler to call
 * @returns {Function} to remove handler, for deconstructing
 */
function registerListener(event, handler) {
  // eslint-disable-next-line no-multi-assign
  const hs = (handlers[event] = handlers[event] || []);
  const ind = hs.push(handler) - 1;
  return () => {
    delete hs[ind];
  };
}

/**
 * Emit event.
 *
 * @param {string} event
 * @param {Object} data
 * @returns {void}
 */
export function emit(event, data) {
  const hs = handlers[event];
  const allHs = handlers[undefined];

  if (hs) hs.forEach((h) => h && h.call(undefined, data));
  if (allHs) allHs.forEach((h) => h && h.call(undefined, event, data));
}

/**
 * Initialize global namespaces
 */
export function initializeNamespaces() {
  window.hlx = window.hlx || {};
  window.hlx.dependencies = window.hlx.dependencies || [];

  // eslint-disable-next-line no-multi-assign
  const ns = (window.pages = window.pages || {});

  if (!ns.on) ns.on = registerListener;

  const pathSegments = window.location.pathname.match(/[\w-]+(?=\/)/g);
  if (pathSegments) {
    const [product, locale, project] = pathSegments;
    Object.assign(ns, { product, locale, project });
  }
}
