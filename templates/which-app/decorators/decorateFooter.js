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

export default function decorateFooter() {
  const footer = document.querySelector('footer');
  // clear existing
  // footer.innerHTML = '';
  const customFooter = document.createElement('div');
  customFooter.classList.add('custom-footer');

  const footerLinks = [
    { path: '/creativecloud/en/which-app/', label: 'Home' },
    { path: '/creativecloud/en/which-app/photography', label: 'Photography' },
    { path: '/creativecloud/en/which-app/design', label: 'Design' },
    { path: '/creativecloud/en/which-app/video', label: 'Video' },
    { path: '/creativecloud/en/which-app/digitalart', label: 'Digital Art' },
    { path: '/creativecloud/en/which-app/documents', label: 'Documents' },
  ];
  for (const el of footerLinks) {
    const link = document.createElement('a');
    link.href = el.path;
    link.innerHTML = el.label;
    customFooter.appendChild(link);
  }

  // insert before 'footer' element
  footer.parentElement.insertBefore(customFooter, footer);
}
