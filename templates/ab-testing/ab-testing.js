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

// import { loadJSModule } from '../../scripts.js';
/* global loadJSModule */

function decorateABTests() {
  let runTest = true;
  let reason = '';

  if (window.location.host !== 'pages.adobe.com') {
    runTest = false;
    reason = 'not prod host';
  }
  if (window.location.hash) {
    runTest = false;
    reason = 'suppressed by #';
  }
  if (window.location.search === '?test') runTest = true;
  if (navigator.userAgent.match(/bot|crawl|spider/i)) {
    runTest = false;
    reason = 'bot detected';
  }

  if (runTest) {
    let $testTable;
    document.querySelectorAll('table th').forEach(($th) => {
      if ($th.textContent.toLowerCase().trim() === 'a/b test') {
        $testTable = $th.closest('table');
      }
    });

    const testSetup = [];

    if ($testTable) {
      $testTable.querySelectorAll('tr').forEach(($row) => {
        const $name = $row.children[0];
        const $percentage = $row.children[1];
        const $a = $name.querySelector('a');
        if ($a) {
          const url = new URL($a.href);
          testSetup.push({
            url: url.pathname,
            traffic: parseFloat($percentage.textContent) / 100.0,
          });
        }
      });
    }

    let test = Math.random();
    let selectedUrl = '';
    testSetup.forEach((e) => {
      if (test >= 0 && test < e.traffic) {
        selectedUrl = e.url;
      }
      test -= e.traffic;
    });

    if (selectedUrl) window.location.href = selectedUrl;
  } else {
    console.log(`Test is not run => ${reason}`);
  }
}

async function delegatePageDecoration() {
  decorateABTests();
  await loadJSModule('/templates/default/default.js');
  // decorateTables();
}

delegatePageDecoration();
