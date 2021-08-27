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

export default [
  // content
  {
    title: 'content embed',
    input: '/stock/en/advocates/submit-and-getfunded.html',
    expected: {
      path: '/stock/en/advocates/submit-and-getfunded.plain.html',
      filename: 'submit-and-getfunded.html',
      fileNoExt: 'submit-and-getfunded',
      basename: 'submitandgetfunded',
      dirname: 'advocates',
      type: 'content',
    },
  },
  {
    title: 'content embed, irregular path, should normalize',
    input: '//dir//file.html',
    expected: {
      path: '/dir/file.plain.html',
      filename: 'file.html',
      fileNoExt: 'file',
      basename: 'file',
      dirname: 'dir',
      type: 'content',
    },
  },
  {
    title: 'directory content embed, should use index',
    input: '/stock/en/advocates/submit-and-getfunded/',
    expected: {
      path: '/stock/en/advocates/submit-and-getfunded/index.plain.html',
      filename: 'submit-and-getfunded',
      fileNoExt: 'submit-and-getfunded',
      basename: 'submitandgetfunded',
      dirname: 'advocates',
      type: 'content',
    },
  },
  // components
  {
    title: 'component embed, directory',
    input: '/components/en/form/',
    expected: {
      path: '/components/en/form/',
      filename: 'form',
      fileNoExt: 'form',
      basename: 'form',
      dirname: 'en',
      type: 'component',
    },
  },
  {
    title: 'component embed, from existing content (hlx2)',
    input: '/components/en/form.html',
    expected: {
      path: '/components/en/form/',
      filename: 'form.html',
      fileNoExt: 'form',
      basename: 'form',
      dirname: 'en',
      type: 'component',
    },
  },
];
