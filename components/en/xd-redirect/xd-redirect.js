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

async function redirect() {
  if (window.location.href.includes('xd-plugin-download')) {
    const usp = new URLSearchParams(window.location.search);
    const name = usp.get('name');
    const target = `https://adobe.com/go/xd_plugins_discover_plugin?pluginId=${name}`;
    console.log(`redirecting to ${target}`);
    window.location.href = target;
  } else {
    const resp = await fetch('/redirects.json');
    const json = await resp.json();
    let target;
    json.data.forEach((e) => {
      if (e.Source === window.location.pathname + window.location.search) {
        target = e.Destination;
      }
    });
    if (target) {
      console.log(`redirecting to ${target}`);
      window.location.href = target;
    } else {
      console.log(`no target found for ${window.location.pathname + window.location.search}`);
    }
  }
}

redirect();
