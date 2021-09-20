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

/* eslint-disable no-param-reassign */

function decoratePhotoshopNPS() {
  // Helper: Get query string parameter
  function getUrlParameter(name) {
    name = name.replace(/[[]/, '\\[').replace(/[\]]/, '\\]');
    const regex = new RegExp(`[\\?&]${name}=([^&#]*)`);
    const results = regex.exec(window.location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
  }

  // Helper: POST request to Sonar
  const sonarPost = (function cb() {
  // Create request
    const xhr = new XMLHttpRequest();

    // Return XHR callback function
    return (data, callback) => {
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          callback(xhr.status);
        }
      };

      // Open POST request to Sonar API
      xhr.open('POST', 'https://p13n.adobe.io/data/api/v1/feedback/outbound');

      // Set necessary Sonar headers
      xhr.setRequestHeader('Accept', 'application/json');
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.setRequestHeader('Content-Language', 'en');
      xhr.setRequestHeader('x-api-key', 'p13n_sonar');

      // Send JSON data
      xhr.send(JSON.stringify(data));
    };
  }());

  // Check that "f" (feedback ID) and "s" (score) are present in URL query string
  if (getUrlParameter('f') && getUrlParameter('s') >= 0 && getUrlParameter('s') <= 10) {
    // Set "selected" class on button for selected score
    document.querySelector(`#npsScaleButton_${getUrlParameter('s')}`).classList.add('selected');

    // Construct initial JSON payload
    const initialRequest = {
      feedbackId: getUrlParameter('f'),
      feedbackAttributes: {
        score: getUrlParameter('s'),
      },
      feedbackType: 'NPS',
      metaData: {},
    };

    // Send initial POST request (score only)
    sonarPost(initialRequest, (response) => {
      if (response === 200 || response === 204) {
        // Score submitted successfully
        console.log('Score submitted succesfully');
      } else {
        // Handle error on score submission
        console.log(`Error response code received: ${response}`);

        // Hide the NPS survey form
        document.querySelector('#npsForm').classList.add('hidden');

        // Show the error message
        document.querySelector('#errorMessage').classList.remove('hidden');
      }
    });
  } else {
    // Broken URL, show error message
    console.log('Unexpected URL query string');

    // Hide the NPS survey form
    document.querySelector('#npsForm').classList.add('hidden');

    // Show the error message
    document.querySelector('#errorMessage').classList.remove('hidden');
  }

  // Event handler: Form submitted
  document.querySelector('#npsForm').addEventListener('submit', (e) => {
  // Prevent form from submitting natively
    e.preventDefault();

    // Get text field value
    const textField = document.querySelector('#surveyComment').value;

    // Get Adobe contact checkbox value
    const contactCheckbox = document.querySelector('#canAdobeContact').checked;

    // Construct second JSON payload (incl. text field)
    const secondRequest = {
      feedbackId: getUrlParameter('f'),
      feedbackAttributes: {
        comment: textField,
        score: getUrlParameter('s'),
      },
      feedbackType: 'NPS',
      metaData: {
        canAdobeContact: contactCheckbox ? 'YES' : 'NO',
      },
    };

    // Send second POST request (score, text field and checkbox)
    sonarPost(secondRequest, (response) => {
      if (response === 200 || response === 204) {
        // Survey submitted successfully
        console.log('Survey submitted successfully');

        // Hide the NPS survey form
        document.querySelector('#npsForm').classList.add('hidden');

        // Show the success message
        document.querySelector('#successMessage').classList.remove('hidden');
      } else {
        // Handle error on submission
        console.log(`Error response code received: ${response}`);

        // Hide the NPS survey form
        document.querySelector('#npsForm').classList.add('hidden');

        // Show the error message
        document.querySelector('#errorMessage').classList.remove('hidden');
      }
    });
  });
}

export default function decorate($el) {
  $el.innerHTML = `
<div class="form embed section-embed nps-form">
  <form id="npsForm">
   <div>
      <label>You selected:</label>
       <div class="button-group">
           <button id="npsScaleButton_0" class="npsScaleButton" disabled="">0</button>
           <button id="npsScaleButton_1" class="npsScaleButton" disabled="">1</button>       
           <button id="npsScaleButton_2" class="npsScaleButton" disabled="">2</button>       
           <button id="npsScaleButton_3" class="npsScaleButton" disabled="">3</button>       
           <button id="npsScaleButton_4" class="npsScaleButton" disabled="">4</button>       
           <button id="npsScaleButton_5" class="npsScaleButton" disabled="">5</button>       
           <button id="npsScaleButton_6" class="npsScaleButton" disabled="">6</button>    
           <button id="npsScaleButton_7" class="npsScaleButton" disabled="">7</button>    
           <button id="npsScaleButton_8" class="npsScaleButton" disabled="">8</button>    
           <button id="npsScaleButton_9" class="npsScaleButton" disabled="">9</button>
           <button id="npsScaleButton_10" class="npsScaleButton" disabled="">10</button>
       </div>
   </div>
   <label for="surveyComment">Please explain why you gave this rating.</label>
   <textarea rows="3" id="surveyComment" maxlength="512"></textarea>
   <div>
       <input type="checkbox" id="canAdobeContact" checked=""> 
         <label for="canAdobeContact">Adobe may contact me about my feedback</label>
    </div>
   <input type="submit" value="Share Feedback" name="submitfeedback">
</form>
<div id="successMessage" class="hidden">
   <p>Thank you for submitting your feedback.</p>
   <p><a href="https://adobe.com">Visit Adobe.com</a></p>
</div>
<div id="errorMessage" class="hidden">
   <p>We encountered an error. Please refresh to try again, or:</p>
   <p><a href="https://adobe.com">Visit Adobe.com</a></p>
</div>
</div>`;

  decoratePhotoshopNPS();
}
