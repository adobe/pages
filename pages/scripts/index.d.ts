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
 * Data parsed from an embed path on initial page load.
 */
export interface EmbedData {
  /**
   * path
   *
   * For content embeds, has extension `.plain.html` and loaded as-is.
   *
   * For component embeds, this is a path to a directory.
   * Each component is a directory (with the name of the component)
   * that contains optional `.js` & `.css` files.
   *
   * @example
   * embed path => `/content/special-thing.foo.html`
   * path => `/content/special-thing.plain.html`
   *
   * @example
   * embed path => `/components/special-thing.html`
   * path => `/components/special-thing/`
   */
  path: string;

  /**
   * filename
   * Last path segment including extension
   *
   * For directory paths (ending in `/`), this will be the directory name
   *
   * @example
   * embed path => `/content/special-thing.foo.html`
   * filename => `special-thing.foo.html`
   *
   * @example
   * embed path => `/content/special-thing/`
   * filename => `special-thing`
   */
  filename: string;

  /**
   * fileNoExt
   * filename, but without the extension
   *
   * Used for components to load as module directory.
   */
  fileNoExt: string;

  /**
   * basename
   * Last path segment without extension and non-alphanum characters removed.
   * Used for classes on content embeds.
   *
   * If filename has multiple dots, all will be excluded.
   *
   * @example
   * embed path => `/content/special-thing.foo.html`
   * basename => `specialthing`
   */
  basename: string;

  /**
   * dirname
   * Last directory containing the embed with non-alphanum characters removed.
   * Used for classes on content embeds.
   *
   * If not contained in a directory, set to empty string.
   *
   * @example
   * embed path => `/content-2/foo.html`
   * dirname => `content2`
   */
  dirname: string;

  /**
   * type
   * Set to `content` unless the path starts with `/components/`
   *
   * Content is loaded as .plain.html and inserted as-is.
   *
   * Components are treated as code includes, and must exist in the /components/ directory.
   */
  type: 'content' | 'component';
}

/**
 * An included JS or CSS item.
 */
export interface IncludedItem {
  /**
   * Whether the item is required or optional.
   * All promises of included modules/css marked as required
   * must resolve before appearMain() will complete.
   */
  req: boolean;

  /**
   * Promise that resolves when the JS module is loaded and finishes executing
   * (ie. after script runs and default exported function completes, if encountered).
   * This promise will reject if any error is thrown during loading or executing the module.
   *
   * OR
   *
   * Promise that resolves when the CSS file has been loaded or has failed; this promise
   * always resolves, unless the stylesheet is removed from DOM before completing.
   */
  prom: Promise<void>;
}

export interface Logger {
  log: () => void;
  debug: () => void;
  error: () => void;
}
