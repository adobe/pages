function generateVideo() {
  if(!document.querySelector('.iframe')) return;
  const videos = document.querySelectorAll('.iframe > div a');
  videos.forEach(function(video){
    const videoParent = video.closest('div');
    videoParent.innerHTML = `
      <iframe src="${video.getAttribute('href')}" frameborder="0" id="video"></iframe>
      `
  })

  var base = document.createElement('base');
  base.target = '_parent';
  document.getElementsByTagName('head')[0].appendChild(base);
  document.querySelector('.iframe > div > div').classList.add('iframe-parent');
}


function setUpTimeline() {
  if(!document.querySelector('.missiontimeline-container')) return;
  let timelineCount = 0;
  let timelineGroup = '';
  const timelineParent = document.querySelector('.missiontimeline');
  const timelineItems = document.querySelectorAll('.missiontimeline > div');
  const timelineWrapper = document.createElement('div');
  timelineWrapper.classList.add('timeline-items')


  timelineItems.forEach(function(item, index) {
    if(index < timelineItems.length - 1) {  
      item.firstChild.parentElement.className=`checklist-item ${item.firstChild.innerText.toLowerCase()}`;
      item.firstChild.remove();
      timelineGroup += item.outerHTML;
      timelineCount = index + 1
      item.remove();
    }
  })

  timelineWrapper.innerHTML = timelineGroup;
  timelineParent.prepend(timelineWrapper)

  timelineWrapper.querySelectorAll('a').forEach(function(link) { 
    link.setAttribute('target', '_blank')
  })
}

function setUpControllers() {
  const items = document.querySelectorAll('.iframecontrol > div');
  let element;
  
  items.forEach(function($row) {
    const type = $row.querySelector('div:first-of-type').innerText;
    const link = $row.querySelector('a').getAttribute('href');
    
    if(type === "previous") {
      element = document.createElement('div');
      element.className = 'btn previous';
      element.innerHTML = `
        <a href="${link}">
          <span>
            <svg xmlns="http://www.w3.org/2000/svg" width="51" height="58" viewBox="0 0 51 58">
            <g id="Polygon_1" data-name="Polygon 1" transform="translate(6 52) rotate(-90)" fill="#fff" stroke-linecap="round" stroke-linejoin="round">
              <path d="M 51.25207138061523 42 L 46 42 L -3.552713678800501e-15 42 L -5.25206995010376 42 L -2.584100008010864 37.47603988647461 L 20.4158992767334 -1.523959994316101 L 23 -5.90569019317627 L 25.5841007232666 -1.523959994316101 L 48.58409881591797 37.47603988647461 L 51.25207138061523 42 Z" stroke="none"/>
              <path d="M 23 0 L 0 39 L 46 39 L 23 0 M 23 -6 C 25.12378692626953 -6 27.0893383026123 -4.877262115478516 28.16819953918457 -3.04791259765625 L 51.1682014465332 35.95208740234375 C 52.26214981079102 37.80704879760742 52.2780876159668 40.10599899291992 51.2099609375 41.97594833374023 C 50.14184951782227 43.84590148925781 48.15349960327148 45 46 45 L 0 45 C -2.153499603271484 45 -4.141849517822266 43.84590148925781 -5.2099609375 41.97594833374023 C -6.278087615966797 40.10599899291992 -6.262149810791016 37.80704879760742 -5.168201446533203 35.95208740234375 L 17.83180046081543 -3.04791259765625 C 18.9106616973877 -4.877262115478516 20.87621307373047 -6 23 -6 Z" stroke="none" fill="#3a0001"/>
            </g>
          </svg>
          </span>
        </a>
      `
    } else {
      element = document.createElement('div');
      element.className = 'btn next';
      element.innerHTML = `
        <a href="${link}">
          <span>
            <svg xmlns="http://www.w3.org/2000/svg" width="51" height="58" viewBox="0 0 51 58">
            <g id="Polygon_1" data-name="Polygon 1" transform="translate(45 6) rotate(90)" fill="#fff" stroke-linecap="round" stroke-linejoin="round">
              <path d="M 51.25207138061523 42 L 46 42 L -3.552713678800501e-15 42 L -5.25206995010376 42 L -2.584100008010864 37.47603988647461 L 20.4158992767334 -1.523959994316101 L 23 -5.90569019317627 L 25.5841007232666 -1.523959994316101 L 48.58409881591797 37.47603988647461 L 51.25207138061523 42 Z" stroke="none"/>
              <path d="M 23 0 L 0 39 L 46 39 L 23 0 M 23 -6 C 25.12378692626953 -6 27.0893383026123 -4.877262115478516 28.16819953918457 -3.04791259765625 L 51.1682014465332 35.95208740234375 C 52.26214981079102 37.80704879760742 52.2780876159668 40.10599899291992 51.2099609375 41.97594833374023 C 50.14184951782227 43.84590148925781 48.15349960327148 45 46 45 L 0 45 C -2.153499603271484 45 -4.141849517822266 43.84590148925781 -5.2099609375 41.97594833374023 C -6.278087615966797 40.10599899291992 -6.262149810791016 37.80704879760742 -5.168201446533203 35.95208740234375 L 17.83180046081543 -3.04791259765625 C 18.9106616973877 -4.877262115478516 20.87621307373047 -6 23 -6 Z" stroke="none" fill="#3a0001"/>
            </g>
          </svg>
          
          </span>
        </a>
      `
    }  
    document.querySelector('.iframe-parent').appendChild(element)
  })
  
}

setUpTimeline();
generateVideo();
if(document.querySelector('.iframecontrol')) {
  setUpControllers();
}