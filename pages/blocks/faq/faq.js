/*
 * Copyright 2022 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

const setUpClasses = ($element) => {
  $element.forEach(($el) => {
    $el.classList.add('accordion');
    $el.querySelector('div:first-of-type').classList.add('question');
    $el.querySelector('div:last-of-type').classList.add('answer');
  });
  $element[0].classList.add('active');
};

function runEvent(e) {
  const currentAccordion = e.target.closest('.accordion');
  if (!currentAccordion) return;
  currentAccordion.classList.toggle('active');
}
export default async function faq($block) {
  await setUpClasses($block.childNodes);
  document.querySelector('.faq').addEventListener('click', runEvent);
}
