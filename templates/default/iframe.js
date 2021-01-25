function generateVideo() {
  if(!document.querySelector('.iframe')) return;
  const videos = document.querySelectorAll('.iframe > div a');
  videos.forEach(function(video){
    const videoParent = video.closest('div');
    videoParent.innerHTML = `<iframe src="${video.getAttribute('href')}" frameborder="0"></iframe>`
  })
}


function setUpTimeline() {
  if(!document.querySelector('.missiontimeline-container')) return;
  const timelineParent = document.querySelector('.missiontimeline');
  const timelineItems = document.querySelectorAll('.missiontimeline > div');
  let timelineCount = 0;
  const timelineWrapper = document.createElement('div');
  timelineWrapper.classList.add('timeline-items')
  let timelineGroup = '';

  timelineItems.forEach(function(item, index) {

    if(index < timelineItems.length - 1) {
    
      item.firstChild.parentElement.className=`checklist-item ${item.firstChild.innerText.toLowerCase()}`;
      item.firstChild.remove();
      timelineGroup += item.outerHTML;
      timelineCount = index + 1
      item.remove();

    }



  })

  console.log(timelineGroup)
  timelineWrapper.innerHTML = timelineGroup;
  timelineParent.prepend(timelineWrapper)


}


setUpTimeline();
generateVideo();