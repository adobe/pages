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

import {
  debounce, isAttr, isNodeName, registerListener,
} from '../../../templates/default/default.js';

let formContainer = document.querySelector('.slide-form-container');
let slideBtns = document.querySelectorAll('.slide-btn');
let slideItems = document.querySelectorAll('.slide-form-item');
let progressIndicator = document.querySelector('.progress-indicator span');
let totalAnswers = document.querySelectorAll('.field');
// const otherOptionInput = document.querySelectorAll('.other-option-input');
let header = '';
let currentSlide = 0;
const allValues = [];
// const collectNames = [];
let totalQuestions = [];

function setHeader(content) {
  const wrap = document.createElement('div');
  wrap.innerHTML = `${content}<hr>`;
  document.querySelectorAll('.slide-form-item')[0].prepend(wrap);
  wrap.setAttribute('tabindex', 0);
  document.querySelector('main .default:first-of-type').remove();
}

// animate form height
function setFormContainHeight() {
  for (let i = 0, len = slideItems.length; i < len; i += 1) {
    const slide = slideItems[i];
    if (slide.classList.contains('active')) {
      formContainer.style.height = `${slide.offsetHeight}px`;
      break;
    }
  }
}

// Add input value for "other" check
function setOtherCheckboxValue(event) {
  const input = event.currentTarget;
  // const originalValue = input.getAttribute('value');
  const parent = input.closest('.has-other');
  const checkbox = parent.querySelector("input[type='checkbox']");

  if (input.value.length > 0) {
    if (checkbox.checked !== true) {
      checkbox.click();
    }
    checkbox.setAttribute('value', input.value);
  } else {
    checkbox.setAttribute('value', 'other');
  }
}

// Create input fields for "Other" checkboxes
function addOtherInputField() {
  const checkBoxes = document.querySelectorAll("input[type='checkbox']");

  checkBoxes.forEach((checkbox) => {
    if (checkbox.value.toLowerCase() === 'other'
    || checkbox.value.toLowerCase() === 'prefer to self describe') {
      const parentElement = checkbox.closest('div');
      parentElement.classList.add('has-other');
      const parentHTML = parentElement.innerHTML;
      const input = document.createElement('input');
      input.setAttribute('type', 'text');
      input.classList.add('other-input');
      input.setAttribute('placeholder', 'Please explain');
      /* html */
      parentElement.innerHTML = `
        <div class="other-checkbox-element">${parentHTML}</div>
        <div class="other-input-element">${input.outerHTML}</div>
      `;
    }
  });

  document.querySelectorAll('.other-input').forEach((input) => {
    input.addEventListener('keyup', setOtherCheckboxValue);
  });
}

function scrollBackUp() {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: 'smooth',
  });
}

// ----------------------------------------------
// Store the values into array to manage progress
// ----------------------------------------------

// Get total questions removes duplicated checkbox values
// for progress tracking purposes.
function getTotalQuestions(data) {
  totalQuestions = [];
  for (let i = 0, len = data.length; i < len; i += 1) {
    if (!totalQuestions.includes(data[i])) {
      totalQuestions.push(data[i]);
    }
  }
}

// Collects all input values
// goes through getTotalQuestions() to remove duplicates
function valueStore(event) {
  const currentSelector = event.currentTarget;
  const csName = currentSelector.getAttribute('name');

  if (isAttr(currentSelector, 'type', 'checkbox')) {
    if (currentSelector.checked === true) {
      allValues.push();
    } else {
      allValues.splice(allValues.indexOf(csName), 1);
    }
  }

  if (isAttr(currentSelector, 'type', 'radio')) {
    if (!allValues.includes(csName)) {
      allValues.push(csName);
    }
  }

  if (isNodeName(currentSelector, 'TEXTAREA')) {
    const textArea = event.currentTarget;

    const updateTextValue = (el, strlen) => {
      const elName = el.getAttribute('name');

      if (strlen >= 5) {
        if (!allValues.includes(elName)) {
          allValues.push(elName);
        }
      } else if (allValues.includes(elName)) {
        allValues.splice(allValues.indexOf(elName), 1);
      }
    };
    setTimeout(() => {
      updateTextValue(textArea, textArea.value.length);
    });
  }

  setTimeout(() => getTotalQuestions(allValues));
}

// Set Indicator Counter
function setIndicator() {
  document.querySelector('.indicator-current').innerHTML = `Page ${1}`;
  document.querySelector('.indicator-total').innerHTML = slideItems.length;
}

// readjust container height on resize
window.addEventListener('resize', debounce(() => {
  setFormContainHeight();
}, 300));

const checkIfDomReady = setInterval(() => {
  formContainer = document.querySelector('.slide-form-container');
  if (formContainer) {
    slideBtns = document.querySelectorAll('.slide-btn');
    slideItems = document.querySelectorAll('.slide-form-item');
    progressIndicator = document.querySelector('.progress-indicator span');
    totalAnswers = document.querySelectorAll('.question input');
    // otherOptionInput = document.querySelectorAll('.other-option-input');

    const mainAppeared = document.querySelector('main').classList.contains('appear');
    const headerEl = document.querySelector('main .default:first-of-type');
    if (headerEl && mainAppeared) {
      header = headerEl.innerHTML;
      setHeader(header);
      setFormContainHeight();
      clearInterval(checkIfDomReady);
    }
  }
}, 10);

setFormContainHeight();
addOtherInputField();
registerListener('cssLoaded', () => {
  setFormContainHeight();
});

// Update progress counter and progress bar
function progressBarUpdater() {
  document.querySelector('.indicator-current').innerHTML = `Page ${currentSlide + 1}`;
  // const allRequiredQuestions = document.querySelectorAll('.is-required').length;
  const percentageCompleted = `${`${(currentSlide + 1) * 100}` / slideItems.length}%`;
  progressIndicator.style.transform = `translateX(${percentageCompleted})`;
}

// Set Sliders and disable/enable next button
function setSlider(count = 0) {
  const nextBtnEl = document.querySelector('.slide-btn.next');
  const prevEl = document.querySelector('.prev');

  // Hide back button on first page.
  if (count >= 1) {
    prevEl.style.display = 'inline-block';
  } else {
    prevEl.style.display = 'none';
  }

  nextBtnEl.classList.remove('completed');
  slideItems.forEach((slide, index) => {
    slide.classList.remove('active');
    slide.style.transform = `translateX(${index - count}00%)`;
  });
  slideItems[count].classList.add('active');

  progressBarUpdater();

  const currentActiveRequired = slideItems[count].querySelectorAll('.is-required');
  const values = [];

  // Get all required input count
  const requiredCounter = currentActiveRequired.length;

  if (requiredCounter < 1) {
    nextBtnEl.classList.add('completed');
  }

  currentActiveRequired.forEach((el) => {
    el.querySelectorAll('input, textarea').forEach((field) => {
      if (isAttr(field, 'type', 'checkbox') || isAttr(field, 'type', 'radio')) {
        if (field.checked === true) {
          values.push(field.getAttribute('name'));
        }

        if (values.length >= requiredCounter) {
          nextBtnEl.classList.add('completed');
        } else {
          nextBtnEl.classList.remove('completed');
        }

        field.addEventListener('change', (event) => {
          setFormContainHeight();
          if (event.currentTarget.checked === true) {
            values.push(event.currentTarget.getAttribute('name'));
          } else {
            values.splice(values.indexOf(event.currentTarget.getAttribute('name')), 1);
          }

          const eachOptions = [];
          for (let i = 0; i < values.length; i += 1) {
            if (!eachOptions.includes(values[i])) {
              eachOptions.push(values[i]);
            }
          }
          if (eachOptions.length >= requiredCounter) {
            nextBtnEl.classList.add('completed');
          } else {
            nextBtnEl.classList.remove('completed');
          }
        });
      }

      if (isNodeName(field, 'TEXTAREA')
      || isAttr(field, 'type', 'text')
      || isAttr(field, 'type', 'email')) {
        if (!field.classList.contains('other-input')) {
          if (field.value.length > 1) {
            values.push(field.getAttribute('name'));
          }

          if (values.length >= requiredCounter) {
            nextBtnEl.classList.add('completed');
          } else {
            nextBtnEl.classList.remove('completed');
          }

          field.addEventListener('keyup', (event) => {
            if (event.currentTarget.value.length > 1) {
              if (!values.includes(event.currentTarget.getAttribute('name'))) {
                values.push(event.currentTarget.getAttribute('name'));
              }
            }

            // if(event.currentTarget.value.length <= 0) {
            //   values.splice(values.indexOf(event.currentTarget.getAttribute('name')), 1)
            // }

            const eachOptions = [];

            for (let i = 0; i < values.length; i += 1) {
              if (!eachOptions.includes(values[i])) {
                eachOptions.push(values[i]);
              }
            }

            if (eachOptions.length >= requiredCounter) {
              nextBtnEl.classList.add('completed');
            } else {
              nextBtnEl.classList.remove('completed');
            }
          });
        }
      }
    });
  });
  scrollBackUp();
}

// Handler to slide through forms
function formSlider(event) {
  const btn = event.currentTarget;
  if (btn.classList.contains('prev')) {
    if (currentSlide >= 1) {
      currentSlide -= 1;
    }
  } else if (btn.classList.contains('completed')) {
    if (currentSlide < slideItems.length - 1) {
      currentSlide += 1;
    }
  }

  const setBodyClass = currentSlide >= 1;
  if (setBodyClass) {
    document.body.classList.add('has-progressed');
  } else {
    document.body.classList.remove('has-progressed');
  }
  const noMoreSlides = currentSlide >= slideItems.length - 1;
  document.querySelector('.next').style.display = noMoreSlides ? 'none' : 'inline';
  document.querySelector('.submit').style.display = noMoreSlides ? 'inline' : 'none';

  setSlider(currentSlide);
  setFormContainHeight();
  document.querySelector('.panel-tab').focus();
}

setSlider();
setIndicator(currentSlide, totalAnswers.length);

slideBtns.forEach((btn) => {
  btn.addEventListener('click', formSlider);
});

document.querySelectorAll('.is-required input, .is-required textarea').forEach((input) => {
  if (isAttr(input, 'type', 'checkbox') || isAttr(input, 'type', 'radio')) {
    input.addEventListener('change', valueStore);
  }

  if (isNodeName(input, 'TEXTAREA')) {
    input.addEventListener('keyup', valueStore);
  }
});
