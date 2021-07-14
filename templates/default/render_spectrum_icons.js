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
const image_type_checker = () => {
  const rows = document.querySelectorAll('.list > div');
  rows.forEach(($row) => {
    const image_column = $row.querySelector('div:first-of-type');
    if (image_column.firstChild.nodeName != 'PICTURE') {
      const icon_type = image_column.innerText;
      image_column.innerHTML = `
        <img src="../../static/${icon_type}.svg">
      `;
    }
  });
};

image_type_checker();
