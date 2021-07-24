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
 * Defines the shape of a block decorator.
 * Not all blocks need scripts and not all block scripts need to export a decorator.
 *
 * This type defines functions to be executed by the main entrypoint (/pages/scripts/scripts.js)
 * In order for that to occur, use a default export in a js file.
 *
 * @example
 */
export type BlockDecorator = (blockEl: HTMLElement, blockName: string, document: Document) => any;
