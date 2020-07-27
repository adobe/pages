function smartWrap(qs) {
    document.querySelectorAll(qs).forEach(($e) => {
        const divs=[];
        let $div=document.createElement('div');
        divs.push($div);
        Array.from($e.children).forEach(($el, i) => {
            if ($el.querySelector('img') && i) {
                    $div=document.createElement('div');
                    divs.push($div);
            }
            $div.appendChild($el);
        })
        const $wrapper=document.createElement('div');
        $wrapper.classList.add('par-wrapper');
        divs.forEach(($div) => {
            $wrapper.appendChild($div);
        });
        $e.innerHTML='';
        $e.appendChild($wrapper);
    });
}

function unwrapEmbeds() {
    document.querySelectorAll(".section-embed").forEach(($embed) => {
        $embed.parentNode.classList.remove('default');
    })
}

async function decoratePage() {
    unwrapEmbeds();
    smartWrap('main>div.default');
    await loadLocalFooter();
    await loadLocalHeader();
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

