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

// import { debounce } from '../../scripts.js';
/* global debounce */

let formContainer = document.querySelector('.slide-form-container');
let slideBtns = document.querySelectorAll('.slide-btn');
let slideItems = document.querySelectorAll('.slide-form-item');
let progressIndicator = document.querySelector('.progress-indicator span');
let totalAnswers = document.querySelectorAll('.field');
// const otherOptionInput = document.querySelectorAll('.other-option-input');
// const header = '';
let currentSlide = 0;
const allValues = [];
// const collectNames = [];
let totalQuestions = [];

// animate form height
function setFormContainHeight() {
  slideItems.forEach((slide) => {
    if (slide.classList.contains('active')) {
      formContainer.style.height = `${slide.offsetHeight}px`;
    }
  });
}

// Add input value for "other" check
function setOtherCheckboxValue(event) {
  const input = event.currentTarget;
  // const originalValue = input.getAttribute('value');
  const parent = input.closest('.has-other');
  const checkbox = parent.querySelector("input[type='checkbox']");

  if (input.value.length > 0) {
    if (!checkbox.checked) {
      checkbox.click();
    }
    checkbox.setAttribute('value', input.value);
  } else {
    if (checkbox.checked) {
      checkbox.click();
    }
    checkbox.setAttribute('value', 'other');
  }
}

// Create input fields for "Other" checkboxes
function addOtherInputField() {
  const checkBoxes = document.querySelectorAll("input[type='checkbox']");

  checkBoxes.forEach((checkbox) => {
    if (checkbox.value.toLowerCase() === 'other') {
      const parentElement = checkbox.closest('div');
      parentElement.classList.add('has-other');
      const parentHTML = parentElement.innerHTML;
      const input = document.createElement('input');
      input.setAttribute('type', 'text');
      input.classList.add('other-input');
      input.setAttribute('placeholder', 'Please explain');
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

const checkIfDomReady = setInterval(() => {
  if (document.querySelector('.slide-form-container')) {
    formContainer = document.querySelector('.slide-form-container');
    slideBtns = document.querySelectorAll('.slide-btn');
    slideItems = document.querySelectorAll('.slide-form-item');
    progressIndicator = document.querySelector('.progress-indicator span');
    totalAnswers = document.querySelectorAll('.question input');
    // otherOptionInput = document.querySelectorAll('.other-option-input');
    setFormContainHeight();
    addOtherInputField();
    clearInterval(checkIfDomReady);
  }
}, 200);

// 07/14/21 Max commented out, unused
// function setHeader(content) {
//   const wrap = document.createElement('div');
//   wrap.innerHTML = `${content}<hr>`;
//   document.querySelectorAll('.slide-form-item')[0].prepend(wrap);
//   document.querySelector('main .default:first-of-type').remove();
// }

// ----------------------------------------------
// Store the values into array to manage progress
// ----------------------------------------------

// Get total questions removes duplicated checkbox values
// for progress tracking purposes.
function getTotalQuestions(data) {
  totalQuestions = [];
  for (let i = 0; i < data.length; i += 1) {
    if (!totalQuestions.includes(data[i])) {
      totalQuestions.push(data[i]);
    }
  }
}

// Collects all input values
// goes through getTotalQuestions() to remove duplicates
function valueStore(event) {
  const currentSelector = event.currentTarget;

  if (currentSelector.getAttribute('type') === 'checkbox') {
    if (currentSelector.checked) {
      allValues.push(currentSelector.getAttribute('name'));
    } else {
      allValues.splice(allValues.indexOf(currentSelector.getAttribute('name')), 1);
    }
  }

  if (currentSelector.getAttribute('type') === 'radio') {
    if (!allValues.includes(currentSelector.getAttribute('name'))) {
      allValues.push(currentSelector.getAttribute('name'));
    }
  }

  if (currentSelector.nodeName.toUpperCase() === 'TEXTAREA') {
    const textArea = event.currentTarget;

    const updateTextValue = (el, strlen) => {
      if (strlen >= 5) {
        if (!allValues.includes(el.getAttribute('name'))) {
          allValues.push(el.getAttribute('name'));
        }
      }

      if (strlen <= 4) {
        if (allValues.includes(el.getAttribute('name'))) {
          allValues.splice(allValues.indexOf(el.getAttribute('name')), 1);
        }
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
  document.querySelector('.indicator-current').innerHTML = 1;
  document.querySelector('.indicator-total').innerHTML = slideItems.length;
}

// Readjust form container height on resize
window.addEventListener('resize', debounce(() => {
  setFormContainHeight();
}, 300));

// Update progress counter and progress bar
function progressBarUpdater() {
  document.querySelector('.indicator-current').innerHTML = currentSlide + 1;
  // const allRequiredQuestions = document.querySelectorAll('.is-required').length;
  const percentageCompleted = `${`${(currentSlide + 1) * 100}` / slideItems.length}%`;
  progressIndicator.style.transform = `translateX(${percentageCompleted})`;
}

// Set Sliders and disable/enable next button
function setSlider(count = 0) {
  document.querySelector('.slide-btn.next').classList.remove('completed');
  slideItems.forEach((slide, index) => {
    slide.classList.remove('active');
    slide.style.transform = `translateX(${index - count}00%)`;
  });
  slideItems[count].classList.add('active');

  progressBarUpdater();

  const currentActiveRequired = slideItems[count].querySelectorAll('.is-required');
  const values = [];

  // Get all required input count
  let requiredCounter = 0;
  requiredCounter = currentActiveRequired.length;

  if (requiredCounter < 1) {
    document.querySelector('.slide-btn.next').classList.add('completed');
  }

  currentActiveRequired.forEach((el) => {
    el.querySelectorAll('input, textarea').forEach((field) => {
      if (field.getAttribute('type') === 'checkbox' || field.getAttribute('type') === 'radio') {
        if (field.checked) {
          values.push(field.getAttribute('name'));
        }

        if (values.length >= requiredCounter) {
          document.querySelector('.slide-btn.next').classList.add('completed');
        } else {
          document.querySelector('.slide-btn.next').classList.remove('completed');
        }

        field.addEventListener('change', (event) => {
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
            document.querySelector('.slide-btn.next').classList.add('completed');
          } else {
            document.querySelector('.slide-btn.next').classList.remove('completed');
          }
        });
      }

      if (field.nodeName.toUpperCase() === 'TEXTAREA'
      || field.getAttribute('type') === 'text'
      || field.getAttribute('type') === 'email') {
        if (!field.classList.contains('other-input')) {
          if (field.value.length > 1) {
            values.push(field.getAttribute('name'));
          }

          if (values.length >= requiredCounter) {
            document.querySelector('.slide-btn.next').classList.add('completed');
          } else {
            document.querySelector('.slide-btn.next').classList.remove('completed');
          }

          field.addEventListener('keyup', (event) => {
            if (event.currentTarget.value.length > 1) {
              if (!values.includes(event.currentTarget.getAttribute('name'))) {
                values.push(event.currentTarget.getAttribute('name'));
              }
            }

            if (event.currentTarget.value.length <= 0) {
              values.splice(values.indexOf(event.currentTarget.getAttribute('name')), 1);
            }

            const eachOptions = [];

            for (let i = 0; i < values.length; i += 1) {
              if (!eachOptions.includes(values[i])) {
                eachOptions.push(values[i]);
              }
            }
            if (eachOptions.length >= requiredCounter) {
              document.querySelector('.slide-btn.next').classList.add('completed');
            } else {
              document.querySelector('.slide-btn.next').classList.remove('completed');
            }
          });
        }
      }
    });
  });
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
  if (currentSlide >= slideItems.length - 1) {
    document.querySelector('.next').style.display = 'none';
    document.querySelector('.submit').style.display = 'inline';
  } else {
    document.querySelector('.next').style.display = 'inline';
    document.querySelector('.submit').style.display = 'none';
  }
  setSlider(currentSlide);
  setFormContainHeight();
}

setSlider();
setIndicator(currentSlide, totalAnswers.length);

slideBtns.forEach((btn) => {
  btn.addEventListener('click', formSlider);
});

document.querySelectorAll('.is-required input, .is-required textarea').forEach((input) => {
  if (input.getAttribute('type') === 'checkbox' || input.getAttribute('type') === 'radio') {
    input.addEventListener('change', valueStore);
  }

  if (input.nodeName.toUpperCase() === 'TEXTAREA') {
    input.addEventListener('keyup', valueStore);
  }
});
