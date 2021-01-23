function generateVideo() {
  if(!document.querySelector('.iframe')) return;
  const videos = document.querySelectorAll('.iframe > div a');
  videos.forEach(function(video){
    const videoParent = video.closest('div');
    videoParent.innerHTML = `<iframe src="${video.getAttribute('href')}" frameborder="0"></iframe>`
  })
}

generateVideo();