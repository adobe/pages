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

/**
 * Sample block format for a block that should be explicitly executed.
 *
 * The default exported function (at the bottom, {@link decorate}) is
 * the entrypoint and will be run by the page's script.
 *
 * If a .css file exists in the same directory with the same name as the block,
 * it will be loaded with the script. It's best practice to encapsulate styles
 * of a block so that coexisting blocks don't overwrite each other's styles.
 */

/**
 * JSDocs are always a good idea, it gives type hinting and autocompletion.
 *
 * You can also define types in a declaration in the same or a parent directory.
 * See the method {@link doOtherStuff} for an example of that.
 *
 * For shared interfaces/types, it's best to stick them in a common parent so
 * they can be imported by all children that share it.
 * @param {Document} document
 */
function doDocumentStuff(document) {
  const someDivEl = document.createElement('div');
  document.append(someDivEl);
}

/**
 * Example jsdoc using declaration.
 *
 * This is useful for complex types since it's easier to write
 * typedefs in declarations than in comments.
 *
 * Don't reuse the eslint disables.
 *
 * @param {import('./sample').SomethingComplex} someObject
 */
// eslint-disable-next-line no-unused-vars
function doOtherStuff(someObject) {
  // eslint-disable-next-line no-unused-vars
  for (const d of someObject.foo.data) {
    // ...
  }
}

/** @type {import('../block.js').BlockDecorator} */
export default function decorate(blockEl, blockName, document) {
  blockEl.innerHtml = `<div>Hello from ${blockName}</div>`;
  doDocumentStuff(document);
}
