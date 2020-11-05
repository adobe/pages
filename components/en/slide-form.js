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
    clearInterval(checkIfDomReady)
  }
}, 500)

  
// Store the values into array to manage progress 

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
  let valuePosition = allValues.indexOf(currentSelector.getAttribute('name'));
  console.log('working')

  if(currentSelector.getAttribute('type') == "checkbox") {
    if(currentSelector.checked == true) {
      console.log('here')
      allValues.push(currentSelector.getAttribute('name'))
    } else {
      allValues.splice(collectNames.indexOf(valuePosition), 1)
      console.log('unchecked')
    }
  }
  
  if(currentSelector.getAttribute('type') == "radio") {
    if(!allValues.includes(currentSelector.getAttribute('name'))) {
      allValues.push(currentSelector.getAttribute('name'))
    }
  }

  setTimeout(() => getTotalQuestions(allValues))
}

// Set Indicator Counter
function setIndicator(current = 0, total) {
  document.querySelector('.indicator-current').innerHTML = 0;
  document.querySelector('.indicator-total').innerHTML = document.querySelectorAll('.question').length;
}

// animate form height 
function setFormContainHeight() {
  slideItems.forEach(function(slide) {
    if(slide.classList.contains('active')) {
      formContainer.style.height = slide.offsetHeight + 'px'
    }
  })
}

// Set Sliders 
function setSlider(count = 0) {
  slideItems.forEach(function(slide, index) {
    slide.classList.remove('active')
    slide.style.transform = `translateX(${index - count}00%)`
  })
  slideItems[count].classList.add('active')
}

// Handler to slide through forms
function formSlider(event) {
  let btn = event.currentTarget;
  if(btn.classList.contains('prev')) {
    if(currentSlide >= 1) {
      currentSlide = currentSlide - 1;
    }
  } else {
    if(currentSlide < slideItems.length - 1) {
      currentSlide = currentSlide + 1;
    }
  }
  setSlider(currentSlide)
  setFormContainHeight();
}

// Update progress counter and progress bar
function progressBarUpdater() {
  document.querySelector('.indicator-current').innerHTML = totalQuestions.length;
  let percentageCompleted = `${totalQuestions.length * 100}` / document.querySelectorAll('.question').length +'%';
  progressIndicator.style.transform = `translateX(${ percentageCompleted })`
}

// Add input value for "other" check
function addOtherCheckboxValue(event) {
  let closestCheckBox = event.target.closest('.has-other').querySelector('input[type="checkbox"]');
	closestCheckBox.setAttribute('value', event.currentTarget.value)
}

setSlider();

setIndicator(currentSlide, totalAnswers.length);
slideBtns.forEach(function(btn) {
  btn.addEventListener('click', formSlider)
})

otherOptionInput.forEach(function(input) {
  input.addEventListener('keyup', addOtherCheckboxValue)
});

document.querySelectorAll('.question input').forEach(function(input) {
  if(input.getAttribute('type') === "checkbox" || input.getAttribute('type') == "radio") {
    console.log('hello')
    input.addEventListener('change', valueStore)
  }
})
  



