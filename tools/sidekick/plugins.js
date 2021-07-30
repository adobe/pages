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
      action: async (evt) => {
        let folderURL;
        const path = sk.location.pathname;
        const { config: cfg } = sk;
        try {
          const resp = await fetch(`https://admin.hlx3.page/preview/${cfg.owner}/${cfg.repo}/${cfg.ref}${path}`);
          if (resp.ok) {
            const json = await resp.json();
            folderURL = json
              && json.edit
              && Array.isArray(json.edit.folders)
              && json.edit.folders[0]
              && json.edit.folders[0].url;
          } else {
            console.log('Failed to retrieve data', resp.status, await resp.text());
          }
        } catch (e) {
          console.log('Failed to connect to API host', e);
        }
        if (folderURL) {
          if (evt.metaKey || evt.shiftKey || evt.which === 2) {
            window.open(folderURL);
          } else {
            window.location.href = folderURL;
          }
        } else if (window.confirm('Sorry, but finding the parent folder of this page\'s source document has failed. Do you want to go to the root folder instead?')) {
          window.open('https://drive.google.com/drive/u/0/folders/1DS-ZKyRuwZkMPIDeuKxNMQnKDrcw1_aw');
        }
      },
    },
  });

  // TEST -----------------------------------------------------------------
  /** temp, for testing locally */
  window.testPlugin = window.testPlugin || {};
  const { elements, callback, config } = window.testPlugin;

  /**
   * @type {Object} plugin
   * @description The plugin configuration.
   * @prop {string}       id        The plugin ID (mandatory)
   * @prop {pluginButton} button    A button configuration object (optional)
   * @prop {boolean}      override=false  True to replace an existing plugin (optional)
   * @prop {elemConfig[]} elements  An array of elements to add (optional)
   * @prop {Function}     condition Determines whether to show this plugin (optional).
   * This function is expected to return a boolean when called with the sidekick as argument.
   * @prop {Function}     callback  A function called after adding the plugin (optional).
   * This function is called with the sidekick and the newly added plugin as arguments.
   */
  const testPlugin = config || {
    id: 'test',
    condition: (sidekick) => sidekick.isEditor(),
    elements,
    callback,
    button: {
      text: 'Test',
      action: async (evt, _sk) => {
        console.debug('evt, _sk: ', evt, _sk);
        if (window.testPlugin.action) {
          window.testPlugin.action(evt, _sk);
        }
      },
    },
  };

  sk.add(testPlugin);
})();
