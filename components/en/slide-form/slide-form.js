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

import { debounce } from '../../../templates/default/default.js';

export default function decorate(blockEl) {
  blockEl.innerHTML = `<div class="form-container">
  <form action="">
    <div class="slide-form-container">
      <div class="slide-form-item active">
        <div class="question">
          <h1>We’d love your thoughts.</h1>
          <p>Please tell us about your experience using Creative Cloud Teams. Any feedback you would like to share is valuable.</p>
          <hr>
          <p class="field-title">Who did you purchase your Creative Cloud Teams license for? </p>
          <div class="radio-option">
            <input class="field" type="radio" id="myself" name="purchase-for" value="Myself"/>
            <label for="myself">Myself</label>
          </div>
          <div class="radio-option">
            <input class="field" type="radio" id="someone-else" name="purchase-for" value="Someone Else"/>
            <label for="someone-else">Someone else</label>
          </div>
          <div class="radio-option">
            <input class="field" type="radio" id="i-didnt-purchase" name="purchase-for" value="I didn't purchase this license"/>
            <label for="i-didnt-purchase">I didn't purchage this license.</label>
          </div>
        </div>
      </div>
  
      <div class="slide-form-item">
        <div class="question">
          <p class="field-title">Why did you choose Creative Cloud Teams over an individual Creative Cloud subscription?</p>
          <p class="check-box-subtitle">Select all that apply.</p>
          <div class="radio-option">
            <input class="field" type="checkbox" id="filmfestivals" name="teams-over-individual" value="Film festival(s)"/>
            <label for="filmfestivals">Creative Cloud Teams seemed like a better deal for the price.</label>
          </div>
          <div class="radio-option">
            <input class="field" type="checkbox" id="movietheater" name="teams-over-individual" value="Movie theater"/>
            <label for="movietheater">I wanted specific services included in Creative Cloud Teams (ex., increased cloud storage, dedicated support).</label>
          </div>
          <div class="radio-option">
            <input class="field" type="checkbox" id="filmfestivals2" name="teams-over-individual" value="Film festival(s)"/>
            <label for="filmfestivals2">I expect to add more people to my Creative Cloud Teams plan in the future.</label>
          </div>
          <div class="radio-option">
            <input class="field" type="checkbox" id="movietheater2" name="teams-over-individual" value="Movie theater"/>
            <label for="movietheater2">I wanted the flexibility to transfer my license to a different person. </label>
          </div>
          <div class="radio-option">
            <input class="field" type="checkbox" id="movietheater2" name="teams-over-individual" value="Movie theater"/>
            <label for="movietheater2">I don’t know the difference between Creative Cloud Teams and a Creative Cloud individual subscription.</label>
          </div>
          <div class="radio-option has-other">
            <input class="field other-option" type="checkbox" id="teams-over-individual-option" name="teams-over-individual" value="Other"/>
            <label for="teams-over-individual-option">Other</label>
            <input type="text" class="other-option-input">
          </div>
        </div>
      </div>

      <div class="slide-form-item">
        <div class="question">
          <p class="field-title">Which Creative Cloud Teams benefits are most valuable to you?</p>
          <p class="check-box-subtitle">Select all that apply.</p>
          <div class="radio-option">
            <input class="field" type="checkbox" id="access-to-desktop-and-mobile" name="benefits-are-most-valuable" value="Access to desktop and mobile apps"/>
            <label for="access-to-desktop-and-mobile">Access to desktop and mobile apps</label>
          </div>
          <div class="radio-option">
            <input class="field" type="checkbox" id="creative-services-including-fonts" name="benefits-are-most-valuable" value="Creative services, including Adobe Fonts and Behance"/>
            <label for="creative-services-including-fonts">Creative services, including Adobe Fonts and Behance</label>
          </div>
          <div class="radio-option">
            <input class="field" type="checkbox" id="collaboration-and-integration-tools" name="benefits-are-most-valuable" value="Collaboration and integration tools"/>
            <label for="collaboration-and-integration-tools">Collaboration and integration tools</label>
          </div>
          <div class="radio-option">
            <input class="field" type="checkbox" id="cloud-storage" name="benefits-are-most-valuable" value="Cloud storage"/>
            <label for="cloud-storage">Cloud storage</label>
          </div>
          <div class="radio-option">
            <input class="field" type="checkbox" id="streamlined-management" name="benefits-are-most-valuable" value="Streamlined management"/>
            <label for="streamlined-management">Streamlined management for contract and licenses</label>
          </div>
          <div class="radio-option">
            <input class="field" type="checkbox" id="advanced-security" name="benefits-are-most-valuable" value="Advanced security"/>
            <label for="advanced-security">Advanced security for documents and assets</label>
          </div>
          <div class="radio-option">
            <input class="field" type="checkbox" id="dedicated-tech-support" name="benefits-are-most-valuable" value="Dedicated tech support"/>
            <label for="dedicated-tech-support">Dedicated tech support 24/7 </label>
          </div>
          <div class="radio-option">
            <input class="field" type="checkbox" id="coaching-sessions-with-experts" name="benefits-are-most-valuable" value="Coaching sessions with experts"/>
            <label for="coaching-sessions-with-experts">Coaching sessions with experts</label>
          </div>
          <div class="radio-option has-other">
            <input class="field other-option" type="checkbox" id="benefits-option" name="benefits-are-most-valuable" value="Other"/>
            <label for="benefits-option">Other</label>
            <input type="text" class="other-option-input">
          </div>
        </div>
      </div>

      <div class="slide-form-item">
        <div class="question">
          <p class="field-title">How could Adobe make your Creative Cloud Teams experience better for you? </p>
          <p class="check-box-subtitle">Any feedback you have regarding purchasing, getting started, or using your plan is welcome. </p>
          <div class="text-el">
            <textarea name=""
            cols="30"
            rows="5"></textarea>
          </div>
        </div>
      </div>

    </div>

    <div class="panel">
      <div class="panel__item">
        <div class="form-sliders-btns">
          <button class="slide-btn prev" type="button">Back</button>
          <button class="slide-btn next" type="button">Next</button>
          <button type="submit" class="submit" style="display: none;">Submit</button>
        </div>
      </div>
      <div class="panel__item">
        <div class="indicator-crumb">
          <span class="indicator-current">0</span>
          <span>of</span>
          <span class="indicator-total">0</span> answered
        </div>
        <div class="progress-indicator">
          <span></span>
        </div>
      </div>
    </div>
  </form>
</div>`;

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
      header = document.querySelector('main .default:first-of-type').innerHTML;
      setHeader(header);
      setFormContainHeight();
      addOtherInputField();
      clearInterval(checkIfDomReady);
    }
  }, 200);

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

    if (currentSelector.getAttribute('type') === 'checkbox') {
      if (currentSelector.checked === true) {
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

    if (currentSelector.nodeName === 'TEXTAREA') {
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
    document.querySelector('.indicator-current').innerHTML = `Page ${1}`;
    document.querySelector('.indicator-total').innerHTML = slideItems.length;
  }

  // Readjust form container height on resize
  window.addEventListener('resize', debounce(() => {
    setFormContainHeight();
  }, 300));

  // Update progress counter and progress bar
  function progressBarUpdater() {
    document.querySelector('.indicator-current').innerHTML = `Page ${currentSlide + 1}`;
    // const allRequiredQuestions = document.querySelectorAll('.is-required').length;
    const percentageCompleted = `${`${(currentSlide + 1) * 100}` / slideItems.length}%`;
    progressIndicator.style.transform = `translateX(${percentageCompleted})`;
  }

  // Set Sliders and disable/enable next button
  function setSlider(count = 0) {
  // Hide back button on first page.
    if (count >= 1) {
      document.querySelector('.prev').style.display = 'inline-block';
    } else {
      document.querySelector('.prev').style.display = 'none';
    }

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
    const requiredCounter = currentActiveRequired.length;

    if (requiredCounter < 1) {
      document.querySelector('.slide-btn.next').classList.add('completed');
    }

    currentActiveRequired.forEach((el) => {
      el.querySelectorAll('input, textarea').forEach((field) => {
        if (field.getAttribute('type') === 'checkbox' || field.getAttribute('type') === 'radio') {
          if (field.checked === true) {
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

        if (field.nodeName === 'TEXTAREA'
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
                document.querySelector('.slide-btn.next').classList.add('completed');
              } else {
                document.querySelector('.slide-btn.next').classList.remove('completed');
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
    if (currentSlide >= slideItems.length - 1) {
      document.querySelector('.next').style.display = 'none';
      document.querySelector('.submit').style.display = 'inline';
    } else {
      document.querySelector('.next').style.display = 'inline';
      document.querySelector('.submit').style.display = 'none';
    }
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
    if (input.getAttribute('type') === 'checkbox' || input.getAttribute('type') === 'radio') {
      input.addEventListener('change', valueStore);
    }

    if (input.nodeName === 'TEXTAREA') {
      input.addEventListener('keyup', valueStore);
    }
  });
}
