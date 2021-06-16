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
/* global window fetch */

// This file contains the pages-specific plugins for the sidekick.
(() => {
  const sk = (window.hlx && window.hlx.sidekick) || window.hlxSidekick;
  if (typeof sk !== 'object') return;

  // CONTENT ROOT -----------------------------------------------------------------
  sk.add({
    id: 'folder',
    condition: (sidekick) => !sidekick.isEditor(),
    button: {
      text: 'Parent Folder',
      action: () => {
        let folderURL;
        let path = sk.location.pathname;
        const { config: cfg } = sk;
        const resp = await fetch(`https://admin.hlx3.page/preview/${cfg.owner}/${cfg.rep}/${cfg.ref}${path}`);
        if (resp.ok) {
          const json = await resp.json();
          folderURL = json
            && json.edit
            && Array.isArray(json.edit.folders)
            && json.edit.folders[json.edit.folders.length - 1]
            && json.edit.folders[json.edit.folders.length - 1].url;
        } else {
          console.log('Failed to retrieve data', resp.status, await resp.text());
        }
        if (folderURL) {
          window.open(folderURL);
        } else {
          if (window.confirm('Sorry, but finding the folder of this page has failed. Do you want to go to the root folder instead?')) {
            window.open('https://drive.google.com/drive/u/0/folders/1DS-ZKyRuwZkMPIDeuKxNMQnKDrcw1_aw');
          }
        }
      },
    },
  });
})();
