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

const writeStatusToPage = (data) => {
  const statusEl = document.querySelector('main .section-wrapper:nth-child(2)');
  let listItem = '';
  let allPagesWorking;

  data.forEach((item) => {
    if (item.status === 404) {
      allPagesWorking = false;
      listItem += `<div>⛔️ <strong>URL: <a href="${item.url}" target="_blank">${item.url}</a></strong> <strong>Status:</strong>${item.status}</div>`;
    }
  });

  if (allPagesWorking !== false) {
    listItem += '<h1>All pages are good 🎉</h1>';
  }

  statusEl.innerHTML = `<div class="container">${listItem}</div>`;
};

const checkEachPages = async () => {
  const urls = await fetchPages();
  const allRequests = [];
  const items = [];
  urls.forEach(async (url) => {
    allRequests.push(
      fetch(`${window.location.origin}${url.URL}`)
        .then((res) => items.push(res))
        .catch((err) => err),
    );
  });
  const data = await Promise.all(allRequests).then(() => items);
  writeStatusToPage(data);
};

const createRefreshButton = () => {
  const buttonSection = document.querySelector('main .section-wrapper:last-of-type');
  buttonSection.innerHTML = `
    <button id="refresh">Refresh</button>
  `;
  document.querySelector('#refresh').addEventListener('click', checkEachPages);
};

window.addEventListener('load', () => {
  checkEachPages();
  createRefreshButton();
});
