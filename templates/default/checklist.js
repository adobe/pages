const videoParent = document.querySelector('.clvideo > div');

function layoutSetUp() {
  const videoEl = videoParent.querySelector('div:first-of-type');
  const backgroundImage = videoEl.querySelector('img');
  const videlSrc = videoEl.querySelector('a').getAttribute('href');
  document.querySelector('.clvideo-container').style.backgroundImage = `url(${backgroundImage.getAttribute('src')})`;
  backgroundImage.remove();
  const video = `
  <div class="video-iframe">
    <iframe 
      src="${videlSrc}" 
      frameborder="0" 
      allow="accelerometer; 
      autoplay; 
      clipboard-write; 
      encrypted-media; 
      gyroscope; 
      picture-in-picture" 
      allowfullscreen>
    </iframe>
  </div>
  `
  videoEl.innerHTML = video;
}

function setupCheckList() {
  const checklist = document.querySelector('.checklist').outerHTML;
  const checkListParent = document.createElement('div');
  checkListParent.className = "checklist-timeline"
  checkListParent.innerHTML = checklist;
  document.querySelector('.clvideo-container > div').appendChild(checkListParent);
  document.querySelector('.checklist-container').remove();
}


function createCheckListLayout() {
  const checklistElements = document.querySelectorAll('.checklist > div');
  let wrapper = ``
  checklistElements.forEach((checklist, index) => {
    if(index === 0) {
      wrapper += `
        <div class="get-started">
          <div class="checklist-info">
            <div class="step-info">${checklist.innerHTML}</div>
          </div>
        </div>`
    }
    if(index === 1) { 
      wrapper += `<div class="checklist-steps">`
    }

    if(index >= 1 && index < checklistElements.length - 1) {
      wrapper += checklist.innerHTML = `
      <div class="checklist-info">
        <div class="step-count"><span class="step-index">${index}</span></div>
        <div class="step-info">${checklist.innerHTML}</div>
      </div>`;
    } else if(index >= 1 && index <= checklistElements.length) {
      wrapper += checklist.innerHTML = `
      <div class="get-help">
        <div class="get-help-info">${checklist.innerHTML}</div>
      </div>`;
    }

    if(index >= checklistElements.length - 2 ) {
      wrapper += `</div>`
    }

  })
  document.querySelector('.checklist').innerHTML = wrapper;
}

layoutSetUp();
setupCheckList();
createCheckListLayout()
