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

/* global loadJSModule */

loadJSModule('/scripts/default.js');

async function fetchPages() {
  window.hlx.dependencies.push('url-sheet.json');
  const resp = await fetch('url-sheet.json');
  const json = await resp.json();
  return (Array.isArray(json) ? json : json.data);
}

const checkEachPages = async () => {
  const urls = await fetchPages();
  urls.forEach((url) => {
    fetch(url.URL)
      .then((res) => res.json())
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  });
};

checkEachPages();
