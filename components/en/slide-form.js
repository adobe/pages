let formContainer = document.querySelector('.slide-form-container');
let slideBtns = document.querySelectorAll('.slide-btn');
let slideItems = document.querySelectorAll('.slide-form-item');
let progressIndicator = document.querySelector('.progress-indicator span')
let totalAnswers = document.querySelectorAll('.field');
let otherOptionInput = document.querySelectorAll('.other-option-input');
let currentSlide = 0;
let allValues = [];
let collectNames = [];
let totalQuestions = [];

let checkIfDomReady = setInterval(function() {
  if(document.querySelector('.slide-form-container')) {
    formContainer = document.querySelector('.slide-form-container');
    slideBtns = document.querySelectorAll('.slide-btn');
    slideItems = document.querySelectorAll('.slide-form-item');
    progressIndicator = document.querySelector('.progress-indicator span')
    totalAnswers = document.querySelectorAll('.question input');
    otherOptionInput = document.querySelectorAll('.other-option-input');
    setFormContainHeight()
    addOtherInputField();
    clearInterval(checkIfDomReady)
  }
}, 200)

// ----------------------------------------------  
// Store the values into array to manage progress 
// ----------------------------------------------

// Get total questions removes duplicated checkbox values
// for progress tracking purposes.
function getTotalQuestions(data) {
  totalQuestions = [];
  for(let i = 0; i < data.length; i++) {
    if(!totalQuestions.includes(data[i])) {
      totalQuestions.push(data[i])
    }
  }
  progressBarUpdater()
}

// Collects all input values
// goes through getTotalQuestions() to remove duplicates
function valueStore(event) {
  let currentSelector = event.currentTarget;

  if(currentSelector.getAttribute('type') == "checkbox") {
    if(currentSelector.checked == true) {
      allValues.push(currentSelector.getAttribute('name'))
    } else {
      allValues.splice(allValues.indexOf(currentSelector.getAttribute('name')), 1)
    }
  }
  
  if(currentSelector.getAttribute('type') == "radio") {
    if(!allValues.includes(currentSelector.getAttribute('name'))) {
      allValues.push(currentSelector.getAttribute('name'))
    }
  }

  if(currentSelector.nodeName == "TEXTAREA") {
    let textArea = event.currentTarget;
    setTimeout(function() {
      updateTextValue(textArea, textArea.value.length)
    })

    function updateTextValue(el, strlen) {
      if(strlen >= 5) {
        if(!allValues.includes(el.getAttribute('name'))) {
          allValues.push(el.getAttribute('name'))
        }
      } 
      
      if(strlen <= 4) {
        if(allValues.includes(el.getAttribute('name'))) {
          allValues.splice(allValues.indexOf(el.getAttribute('name')), 1)
        }
      }
      
    }    
  }

  setTimeout(() => getTotalQuestions(allValues))
}

// Set Indicator Counter
function setIndicator() {
  document.querySelector('.indicator-current').innerHTML = 0;
  document.querySelector('.indicator-total').innerHTML = document.querySelectorAll('.is-required').length;
}

// animate form height 
function setFormContainHeight() {
  slideItems.forEach(function(slide) {
    if(slide.classList.contains('active')) {
      formContainer.style.height = slide.offsetHeight + 'px'
    }
  })
}

// Set Sliders and disable/enable next button
function setSlider(count = 0) {
  document.querySelector('.slide-btn.next').classList.remove('completed');
  slideItems.forEach(function(slide, index) {
    slide.classList.remove('active')
    slide.style.transform = `translateX(${index - count}00%)`
  })
  slideItems[count].classList.add('active')

  let currentActiveRequired = slideItems[count].querySelectorAll('.is-required');
  let values = [];

  // Get all required input count
  let required_counter = 0;
  currentActiveRequired.forEach(function ($el, $in) { 
      required_counter = required_counter + 1
  });

  if(required_counter < 1) {
    document.querySelector('.slide-btn.next').classList.add('completed');
  }

  currentActiveRequired.forEach(function(ele, i) {
    ele.querySelectorAll('input, textarea').forEach(function(fields, index) {
      if(fields.getAttribute('type') == 'checkbox' || fields.getAttribute('type') == 'radio') {

        if(fields.checked == true) {
          values.push(fields.getAttribute('name'))
        }

        if(values.length >= required_counter) {
          document.querySelector('.slide-btn.next').classList.add('completed');
          
        } else {
          document.querySelector('.slide-btn.next').classList.remove('completed');
        }
      }

      if(fields.nodeName == "TEXTAREA" || fields.getAttribute('type') == "text" || fields.getAttribute('type') == "email") {
        
        if(!fields.classList.contains('other-input')){
          if(fields.value.length > 1) {
            values.push(fields.getAttribute('name'))
          } 
  
          if(values.length >= required_counter) {
            document.querySelector('.slide-btn.next').classList.add('completed');
          } else {
            document.querySelector('.slide-btn.next').classList.remove('completed');
          }
        }
      
      }
    })
  })


  currentActiveRequired.forEach(function(el, i) {
    el.querySelectorAll('input, textarea').forEach(function(field, index) {
      if(field.getAttribute('type') == 'checkbox' || field.getAttribute('type') == 'radio') {
    
        field.addEventListener('change', function(event) {
          
          if(event.currentTarget.checked === true) {
            if(!values.includes(event.currentTarget.getAttribute('name'))) {
              values.push(event.currentTarget.getAttribute('name')) 
            }
          } else {
            values.splice(values.indexOf(event.currentTarget.getAttribute('name')), 1)
          }
          if(values.length >= required_counter) {
            document.querySelector('.slide-btn.next').classList.add('completed');
          } else {
            document.querySelector('.slide-btn.next').classList.remove('completed');
          }
        })
      }

      if(field.nodeName == "TEXTAREA" || field.getAttribute('type') == "text" || field.getAttribute('type') == "email") {
        if(!field.classList.contains('other-input')) {
          field.addEventListener('keyup', function(event) {
  
            if(event.currentTarget.value.length > 1) {
              if(!values.includes(event.currentTarget.getAttribute('name'))) {
                values.push(event.currentTarget.getAttribute('name'))
              }
            } 
  
            if(event.currentTarget.value.length <= 0) {
              values.splice(values.indexOf(event.currentTarget.getAttribute('name')), 1)
            }
  
            if(values.length >= required_counter) {
              document.querySelector('.slide-btn.next').classList.add('completed');
            } else {
              document.querySelector('.slide-btn.next').classList.remove('completed');
            }
          })
        }
      }
    })
  })
}

// Handler to slide through forms
function formSlider(event) {
  let btn = event.currentTarget;
  if(btn.classList.contains('prev')) {
    if(currentSlide >= 1) {
      currentSlide = currentSlide - 1;
    }
  } else if(btn.classList.contains('completed')) {
    if(currentSlide < slideItems.length - 1) {
      currentSlide = currentSlide + 1;
    }
  }
  
  // ------------------------------------- //
  // Create sheet to test form submissions 
  // ------------------------------------- //
  
  if(currentSlide >= slideItems.length - 1) {
    document.querySelector('.next').style.display = 'none';
    document.querySelector('.submit').style.display = 'inline';
  } else {
    document.querySelector('.next').style.display = 'inline';
    document.querySelector('.submit').style.display = 'none';
  }
  setSlider(currentSlide)
  setFormContainHeight();
}

// Update progress counter and progress bar
function progressBarUpdater() {
  document.querySelector('.indicator-current').innerHTML = totalQuestions.length;
  let allRequiredQuestions = document.querySelectorAll('.is-required').length
  let percentageCompleted = `${totalQuestions.length * 100}` / allRequiredQuestions +'%';
  progressIndicator.style.transform = `translateX(${ percentageCompleted })`
}


// Create input fields for "Other" checkboxes
function addOtherInputField() {
  let checkBoxes = document.querySelectorAll("input[type='checkbox']");
  
  checkBoxes.forEach(function(checkbox) {
    if(checkbox.value.toLowerCase() == "other") {
      let parentElement = checkbox.closest('div');
      parentElement.classList.add('has-other')
      let input = document.createElement('input')
      input.setAttribute('type', 'text')
      input.classList.add('other-input')
      parentElement.appendChild(input)
    }
  })
  
  document.querySelectorAll('.other-input').forEach(function(input) {
    input.addEventListener('keyup', setOtherCheckboxValue)
  });
}

// Add input value for "other" check
function setOtherCheckboxValue(event) {
  let input = event.currentTarget;
  let originalValue = input.getAttribute('value');
  let parent = input.closest('.has-other');
  let checkbox = parent.querySelector("input[type='checkbox']");

  if(input.value.length > 0) {
    if(checkbox.checked != true) {
      checkbox.click();
    }
    checkbox.setAttribute('value', input.value)
  } else {
    if(checkbox.checked == true) {
      checkbox.click();
    }
    checkbox.setAttribute('value', 'other')
  }
}


setSlider();
setIndicator(currentSlide, totalAnswers.length);


slideBtns.forEach(function(btn) {
  btn.addEventListener('click', formSlider)
})

document.querySelectorAll('.is-required input, .is-required textarea').forEach(function(input) {
  if(input.getAttribute('type') === "checkbox" || input.getAttribute('type') == "radio") {
    input.addEventListener('change', valueStore)
  }

  if(input.nodeName == "TEXTAREA") {
    input.addEventListener('keyup', valueStore)
  }
})
  



