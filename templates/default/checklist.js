const videoParent = document.querySelector('.clvideo > div');

function createVideoElement() {
  const videoEl = videoParent.querySelector('div:first-of-type');
  const video = `
  <div class="video-iframe">
    <iframe 
      src="${videoEl.innerText}" 
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
  console.log(checklist)
}

createVideoElement();
setupCheckList();
