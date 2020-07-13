async function fetchSteps() {
    var resp=await fetch('steps.json');
    return (await resp.json());
}

async function insertSteps() {
    const $steps=document.querySelector('main div.steps');
    if ($steps) {
        const steps=await fetchSteps();
        let html='';
        steps.forEach((step, i) => {
            html+=`<div class="card">
                <div class='img' style="background-image: url(${step.Thumbnail})"></div>
                <div class='text'>
                    <div><h4>${step.Title}</h4>
                    <p>${step.Title}</p>
                    </div>
                    <a href="step.html?${i}">${step.CTA}</a>
                </div>
            </div>`
        })
        $steps.innerHTML=html;
    }
}

function decoratePage() {

    //find steps marker
    document.querySelectorAll('main p').forEach(($e) => {
        if ($e.innerHTML.toLowerCase().trim()=='&lt;steps&gt;') {
            $e.parentNode.classList.add('steps');
            $e.parentNode.innerHTML='';
        }
    })

    insertSteps();
}

console.log(document.readyState)
if (document.readyState == 'loading') {
    window.addEventListener('DOMContentLoaded', (event) => {
        decoratePage();
    });
} else {
    decoratePage();
}


