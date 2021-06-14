loadJSModule(`/scripts/default.js`);

function helpxInNewWindow() {
	document.querySelectorAll('main a[href]').forEach(($a) => {
	    const url=$a.href;
	    let $link=$a;
	    if (url.includes('helpx')) {
	      $link.setAttribute('target', '_blank');
	    }
	})
}

function decorateVideoBlocks() {
  document.querySelectorAll('main .video a[href]').forEach(($a) => {
    const videoLink=$a.href;
    let $video=$a;
    if (videoLink.includes('tv.adobe.com')) {
      $video=createTag('iframe', {src: videoLink, class:'embed tv-adobe' });
    }
    $a.parentElement.replaceChild($video, $a)
  })
}


window.addEventListener('load', () => document.body.classList.add('loaded'))

if (document.readyState == 'loading') {
  window.addEventListener('DOMContentLoaded', (event) => {
	helpxInNewWindow();
    decorateVideoBlocks();
  });
} else {
	helpxInNewWindow();
  decorateVideoBlocks()
}
