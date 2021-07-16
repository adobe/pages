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

/* eslint-disable */

async function purge() {
  const $test = document.getElementById('test_location');
  let loc = window.location.href;
  if ($test) loc = $test.value;

  const url = new URL(loc);
  let path = url.pathname;

  const $spinnerWrap = document.createElement('div');
  $spinnerWrap.innerHTML = (`<style>
        .purge-spinner {
            position: fixed;
            width: 100vw;
            height: 100vh;
            background-color: #ffffffe0;
            top: 0;
            left: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 2em;
            color: black;         
        }

        .purge-spinner div {
            border-radius: 32px;
            padding: 8px 32px 15px 32px;
            color: white;
            background-color: black;
            animation: heartbeat 1.5s ease-in-out infinite both;
        }

        @keyframes heartbeat {
        from {
                    transform: scale(1);
                    transform-origin: center center;
                    animation-timing-function: ease-out;
        }
        10% {
                    transform: scale(0.91);
                    animation-timing-function: ease-in;
        }
        17% {
                    transform: scale(0.98);
                    animation-timing-function: ease-out;
        }
        33% {
                    transform: scale(0.87);
                    animation-timing-function: ease-in;
        }
        45% {
                    transform: scale(1);
                    animation-timing-function: ease-out;
        }
        }


    </style>
    <div class="purge-spinner">
        <div>Publishing</div>
    </div>`);

  document.body.appendChild($spinnerWrap);

  console.log(`purging for path: ${path}`);
  await sendPurge(path);

  if (path.endsWith('.html')) {
    path = path.slice(0, -5);
    console.log(`purging for path: ${path}`);
    await sendPurge(path);
  }

  if (path.endsWith('/index')) {
    path = path.slice(0, -5);
    console.log(`purging for path: ${path}`);
    await sendPurge(path);
  }

  if (window.hlx && window.hlx.dependencies) {
    const deps = window.hlx.dependencies;
    for (let i = 0; i < deps.length; i++) {
      const dep = deps[i];
      const url = new URL(dep, loc);
      await sendPurge(url.pathname + url.search);
      if (url.pathname.endsWith('steps.json')) {
        const stepUrl = url.pathname.replace('steps.json', 'step');
        await sendPurge(stepUrl);
      }
    }
  }

  const outerURL = `https://pages.adobe.com${path}`;

  console.log(`redirecting ${outerURL + url.search}`);
  window.location.href = outerURL + url.search;
}

async function sendPurge(path) {
  const resp = await fetch(`https://adobeioruntime.net/api/v1/web/helix/helix-services/purge@v1?host=pages--adobe.hlx.page&xfh=pages.adobe.com%2Cpages--adobe.hlx.live&path=${encodeURIComponent(path)}`, {
    method: 'POST',
  });
  const json = await resp.json();
  console.log(JSON.stringify(json));

  const outerURL = `https://pages.adobe.com${path}`;
  await fetch(outerURL, { cache: 'reload', mode: 'no-cors' });
  console.log(`busted browser cache for: ${outerURL}`);

  return (json);
}
if (confirm('Try out the new Helix Sidekick, your one-stop bookmarklet for preview, edit and publish! \n\nDo you want to install it now? It will only take a minute ...')) {
  window.location.href = `https://www.hlx.page/tools/sidekick/?project=Pages&giturl=https://github.com/adobe/pages/&host=pages.adobe.com&from=${window.location.href}`;
} else {
  purge();
}
