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

/* eslint-disable no-console */
import path from 'path';

/**
 * Precommit hook script to prevent certain file types from being pushed.
 * Just logs a message and exits.
 */

const allowed = ['.js', '.css', '.ts', '.json', '.md', '.html', '.txt', '.svg', '.yaml', '.ico'];
const maxDetails = 10;

function isHidden(p) {
  return (/(^|\/)\.[^/.]/g).test(p);
}

const badFiles = process.argv.filter(
  (f, i) => i > 1
    && !allowed.includes(path.extname(f))
    && !isHidden(f),
);
const len = badFiles.length;
if (len === 0) process.exit(0);

let listMsg = '';
for (let i = 0; i < maxDetails && i < len; i += 1) {
  listMsg += `\n${badFiles[i]}`;
}
if (len > maxDetails) {
  listMsg += `\n... and ${len - maxDetails} others.`;
}
console.error(`❌ Attempting to push media that doesn't belong in git: ${listMsg}`);
console.error('Media should be pushed to the media-bus (tip: you can use the SlackBot)');
process.exit(1);
