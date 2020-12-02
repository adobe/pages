let formContainer = document.querySelector('.slide-form-container');
let slideBtns = document.querySelectorAll('.slide-btn');
let slideItems = document.querySelectorAll('.slide-form-item');
let progressIndicator = document.querySelector('.progress-indicator span')
let totalAnswers = document.querySelectorAll('.field');
let otherOptionInput = document.querySelectorAll('.other-option-input');
let header = '';
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
    header = document.querySelector('main .default:first-of-type').innerHTML;
    setHeader(header);
    setFormContainHeight();
    addOtherInputField();
    setUpAccessibility();
    clearInterval(checkIfDomReady)
  }
}, 200)


function scrollBackUp() {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: 'smooth'
  });
}


function setHeader(content) {
  const wrap = document.createElement('div');
  wrap.innerHTML = content + `<hr>`;
  wrap.querySelector('h1').setAttribute('tabindex', 1)
  wrap.querySelector('p').setAttribute('tabindex', 2)
  document.querySelectorAll('.slide-form-item')[0].prepend(wrap)
  document.querySelector('main .default:first-of-type').remove();
}

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
  document.querySelector('.indicator-current').innerHTML = 1;
  document.querySelector('.indicator-total').innerHTML = slideItems.length;
}

// animate form height 
function setFormContainHeight() {
  slideItems.forEach(function(slide) {
    if(slide.classList.contains('active')) {
      formContainer.style.height = slide.offsetHeight + 'px'
    }
  })
}


const debounce = function (func, wait, immediate) {
	let timeout;
	return function () {
		let context = this,
			args = arguments;
		let later = function () {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		let callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
};

// Readjust form container height on resize
window.addEventListener('resize', debounce(function() {
  setFormContainHeight()
}, 300))

// Set Sliders and disable/enable next button
function setSlider(count = 0) {   

  // Hide back button on first page.
  if(count >= 1) {
    document.querySelector('.prev').style.display = 'inline-block'
  } else {
    document.querySelector('.prev').style.display = 'none'
  }
  
  document.querySelector('.slide-btn.next').classList.remove('completed');
  slideItems.forEach(function(slide, index) {
    slide.classList.remove('active')
    slide.style.transform = `translateX(${index - count}00%)`
  })
  slideItems[count].classList.add('active')
  
  progressBarUpdater()

  if(count >= 1) {
    setUpAccessibility()
    document.querySelector('[tabindex="2"]').focus();
  }

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



  currentActiveRequired.forEach(function(el, i) {
    el.querySelectorAll('input, textarea').forEach(function(field, index) {
      if(field.getAttribute('type') == 'checkbox' || field.getAttribute('type') == 'radio') {
        
        if(field.checked == true) {
          values.push(field.getAttribute('name')) 
        }
      
        if(values.length >= required_counter) {
          document.querySelector('.slide-btn.next').classList.add('completed');
          
        } else {
          document.querySelector('.slide-btn.next').classList.remove('completed');
        }
    
        field.addEventListener('change', function(event) {
          
          if(event.currentTarget.checked === true) {
            values.push(event.currentTarget.getAttribute('name')) 
          } else {
            values.splice(values.indexOf(event.currentTarget.getAttribute('name')), 1)
          }
          
          let eachOptions = [];
          for(let i = 0; i < values.length; i++) {
            if(!eachOptions.includes(values[i])) {
               eachOptions.push(values[i]) 
            }
          }
          if(eachOptions.length >= required_counter) {
            document.querySelector('.slide-btn.next').classList.add('completed');
          } else {
            document.querySelector('.slide-btn.next').classList.remove('completed');
          }
        })
      }

      if(field.nodeName == "TEXTAREA" || field.getAttribute('type') == "text" || field.getAttribute('type') == "email") {
        if(!field.classList.contains('other-input')){
          if(field.value.length > 1) {
            values.push(fields.getAttribute('name'))
          } 
  
          if(values.length >= required_counter) {
            document.querySelector('.slide-btn.next').classList.add('completed');
          } else {
            document.querySelector('.slide-btn.next').classList.remove('completed');
          }
        
          field.addEventListener('keyup', function(event) {
  
            if(event.currentTarget.value.length > 1) {
              if(!values.includes(event.currentTarget.getAttribute('name'))) {
                values.push(event.currentTarget.getAttribute('name'))
              }
            } 
  
            if(event.currentTarget.value.length <= 0) {
              values.splice(values.indexOf(event.currentTarget.getAttribute('name')), 1)
            }
  
            let eachOptions = [];
            
            for(let i = 0; i < values.length; i++) {
              if(!eachOptions.includes(values[i])) {
                 eachOptions.push(values[i]) 
              }
            }
            if(eachOptions.length >= required_counter) {
              document.querySelector('.slide-btn.next').classList.add('completed');
            } else {
              document.querySelector('.slide-btn.next').classList.remove('completed');
            }
          })
        }
      }
    })
  })
  scrollBackUp();
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
  document.querySelector('.indicator-current').innerHTML = currentSlide + 1;
  let allRequiredQuestions = document.querySelectorAll('.is-required').length
  let percentageCompleted = `${(currentSlide + 1) * 100}` / slideItems.length +'%';
  progressIndicator.style.transform = `translateX(${ percentageCompleted })`
}


// Create input fields for "Other" checkboxes
function addOtherInputField() {
  let checkBoxes = document.querySelectorAll("input[type='checkbox']");
  
  checkBoxes.forEach(function(checkbox) {
    if(checkbox.value.toLowerCase() == "other") {
      let parentElement = checkbox.closest('div');
      parentElement.classList.add('has-other')
      let parentHTML = parentElement.innerHTML;
      let input = document.createElement('input')
      input.setAttribute('type', 'text')
      input.classList.add('other-input')
      input.setAttribute('placeholder', 'Please explain')
      parentElement.innerHTML = `
        <div class="other-checkbox-element">${parentHTML}</div>
        <div class="other-input-element">${input.outerHTML}</div>
      `
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


function setUpAccessibility() {
  document.querySelectorAll('.title-el,  .label-title, .radio-option, .radio-option input, .radio-option label, .input-el label, .text-el, .slide-btn').forEach((function($el) {
    $el.removeAttribute('tabindex')
  }))

  let element = document.querySelectorAll('.slide-form-item');
  let button = document.querySelectorAll('.slide-btn')

  element.forEach(function(slides) {
    let setTabIndex = slides.querySelectorAll('.label-title, .radio-option, .radio-option input, .radio-option label, .input-el label, .text-el')

    setTabIndex.forEach(function($el) {
      $el.removeAttribute('tabindex')
    })


    if(slides.classList.contains('active')) {
      let setTabIndex = slides.querySelectorAll('.label-title, .radio-option, .radio-option input, .radio-option label, .input-el label, .text-el')
      let count = 1;
      setTabIndex.forEach(function($el) {
        count++;
        $el.setAttribute('tabindex', count)
      })

      button.forEach(function(btn) {
        btn.setAttribute('tabindex', count++)
      })
    } 
  })

  // let elements = document.querySelectorAll('.slide-form-item, .title-el,  .label-title, .radio-option, .radio-option input, .radio-option label, .input-el label, .text-el, .slide-btn');
  // let count = 1;  
  // elements.forEach(function(element) {
  //   count++;
  //   element.setAttribute('tabindex', count)
  // })

}
  



