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

/* eslint-disable import/no-extraneous-dependencies */

import yargs from 'yargs';
import fetchMediaHashmap from './media-hashes/media-hashes.js';

/**
 * Simple script to fetch media hashes from a cloud doc.
 * Does not recurse, the input should ideally be a directory (ending with /)
 * with an index file denoting the assets.
 * Or it could be an existing document other than an index (not ending with /)
 *
 * List of paths mapped from static dir as of 07/27/21:
 * /static/ete/hero-posters/
 * /static/internal/
 * /static/lightroom-classic/
 * /static/twp3/
 * /static/twp3/background-elements/
 * /static/templates/stock-advocates/
 *
 * @example
 * ```js
 * node ./.tools/get-media-hashes.js /static/ete/hero-posters/ --format=".tsv" --copy
 * ```
 */

const { argv } = yargs(process.argv);

(async () => {
  // positional
  const docPath = argv._[2];
  if (typeof docPath !== 'string') {
    console.error('Invalid doc path.');
    process.exit(1);
  }

  const { format, copy } = argv;
  const map = await fetchMediaHashmap(docPath, { format, copy });
  console.log(map);
})();
