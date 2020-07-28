export function playVideo() {
    document.getElementById('placeholder').classList.add('hidden');
    const $video=document.getElementById('video');
    $video.classList.remove('hidden');
    $video.play();

}

async function decoratePage() {

    await loadLocalFooter();
    await loadLocalHeader();

    // heading
    classify ('main>div:nth-of-type(1)', 'header');
    classify ('main>.header ul', 'roles');

    // videos
    document.querySelectorAll('main a[href^="https://images-tv.adobe.com/"]').forEach(($vlink) => {
        const $videoDiv=$vlink.closest('div');
        const href=$vlink.getAttribute('href');
        const imgSrc=$videoDiv.querySelector('img').getAttribute('src');
        $videoDiv.classList.add('video-section');

        const $videoText=createTag('div', {class: 'video-text'});

        Array.from($videoDiv.children).forEach(($e) => {
            if (!$e.querySelector('img')) {
                $videoText.append($e);
            }
        });

        $videoDiv.innerHTML=`<div class="video"><div id="placeholder" class="button">
        <svg xmlns="http://www.w3.org/2000/svg"><use href="/static/twp3/icons/play.svg#icon"></use></svg>
        </div>
        <video id='video' class="hidden" preload="metadata" src="${href}" tabindex="0">
        <source src="${href}" type="video/mpeg4">
        </video></div>`;
        $videoDiv.append($videoText);

        $videoDiv.firstChild.firstChild.style.backgroundImage=`url(${imgSrc})`;
        $videoDiv.firstChild.addEventListener('click', (e) => playVideo());
        
    })

    window.pages.decorated = true;
    appearMain();

}

if (document.readyState == 'loading') {
    window.addEventListener('DOMContentLoaded', (event) => {
        decoratePage();
    });
} else {
    decoratePage();
}