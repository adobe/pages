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

async function decoratePage() {
    smartWrap('main>div');
    classify('main', 'appear');

}



if (document.readyState == 'loading') {
    window.addEventListener('DOMContentLoaded', (event) => {
        decoratePage();
    });
} else {
    decoratePage();
}

