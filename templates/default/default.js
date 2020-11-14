function decorateTables() {
    document.querySelectorAll('main div>table').forEach(($table) => {
        const $cols=$table.querySelectorAll('thead tr th');
        const cols=Array.from($cols).map((e) => toClassName(e.innerHTML)).filter(e => e?true:false);
        const $rows=$table.querySelectorAll('tbody tr');
        let $div={};
        if (cols.length==1 && $rows.length==1) {
            $div=createTag('div', {class:`${cols[0]}`});
            $rows[0].querySelectorAll('td').forEach($cell => {
                const $innerDiv=createTag('div');
                $innerDiv.innerHTML=$cell.innerHTML;
                $div.appendChild($innerDiv);
            });
            externalizeImageSources($div);
        } else {
            $div=turnTableSectionIntoCards($table, cols) 
        }
        $table.parentNode.replaceChild($div, $table);
    });
}
  
function turnTableSectionIntoCards($table, cols) {
    const $rows=$table.querySelectorAll('tbody tr');
    const $cards=createTag('div', {class:`cards ${cols.join('-')}`})
    $rows.forEach(($tr) => {
        const $card=createTag('div', {class:'card'})
        $tr.querySelectorAll('td').forEach(($td, i) => {
            const $div=createTag('div', {class: cols[i]});
            $div.innerHTML=$td.innerHTML;
            $div.childNodes.forEach(($child) => {
                if ($child.nodeName=='#text') {
                const $p=createTag('p');
                $p.innerHTML=$child.nodeValue;
                $child.parentElement.replaceChild($p, $child);
                }
            })
            $card.append($div);
        });
        $cards.append($card);
    });
    return ($cards);
}  


function decorateBlocks() {
    document.querySelectorAll('main>div.section-wrapper>div>div').forEach($block => {
        const length=$block.classList.length;
        if (length == 1) {
            const classes=$block.className.split('-');
            $block.classList.add(classes);
            loadCSS(`/styles/blocks/${classes[0]}.css`);
        }
    
        if (length == 2) {
            loadCSS(`/styles/blocks/${$block.classList.item(0)}.css`);
        }
    })
}

function decorateButtons() {
    document.querySelectorAll('main a').forEach($a => {
        const $up=$a.parentElement;
        const $twoup=$a.parentElement.parentElement;
        if ($up.childNodes.length==1 && $up.tagName=='P') {
            $a.className='button secondary';
        }
        if ($up.childNodes.length==1 && $up.tagName=='STRONG' && 
            $twoup.childNodes.length==1 && $twoup.tagName=='P') {
            $a.className='button primary';
        }
    })
}

function wrapSections(element) {
    document.querySelectorAll(element).forEach(($div) => {
        const $wrapper=createTag('div', { class: 'section-wrapper'});
        $div.parentNode.appendChild($wrapper);
        $wrapper.appendChild($div);
    });
}

async function decoratePage() {
    decorateTables();
    wrapSections('main>div');
    decorateBlocks();
    await loadLocalHeader();
    wrapSections('header>div, footer>div');
    decorateButtons();
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
