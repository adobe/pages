async function fetch_sheet() {
  window.hlx.dependencies.push('content.json');
  const resp=await fetch('content.json');
  const json=await resp.json();
  return (Array.isArray(json) ? json : json.data);
}


function create_iteration_array(data) {
    console.log(data,' create iteration')
    let number = 0;    
    data.forEach((item, index) => {
        const pop_last = item.split('_').pop();
        if(pop_last > number) {
            number = pop_last;
            let nuindex = new Array();
            nuindex.push(item)
            console.log(nuindex)
        }
    })
}

async function decorateHome() {
    const data = await fetch_sheet();
    const children = document.querySelectorAll('main .default')
    const object_types = Object.keys(data[0])
    const has_multiple_columns = [];
    children.forEach(($child) => {
        if($child.innerText.includes('[#')) {
            const container_type = $child.innerText.split('[#')[1].split(']')[0]
            $child.classList.add(container_type.split(' ').join('-').toLowerCase()+'-container')
            object_types.forEach((object_type) => {
                if(object_type.includes(container_type)) {
                    const last_underscore = object_type.split('_').pop();
                    if(parseInt(last_underscore) > 0) {
                        has_multiple_columns.push(object_type)
                    }
                    
                }

            })
        }
    })
    has_multiple_columns.length > 0 ? create_iteration_array(has_multiple_columns) : null;
}

async function decoratePage() {
    addDefaultClass('main>div');

    await loadLocalHeader();
    externalLinks('header');
    externalLinks('footer');


    if(document.querySelector('.nav-logo')) {
        document.querySelector('.nav-logo').addEventListener('click', dropDownMenu)
    }

    let pageType;
    //find steps marker
    if (document.location.pathname.endsWith('/step')) {
        pageType = 'step';
    } else {
        pageType = 'home';
    }

    window.pages.pageType = pageType;

    if (pageType == 'home') {
        // await decorateHome();
    }

    if (pageType == 'step') {
        // await decorateStep();
    }

    window.pages.decorated = true;
    appearMain();
    decorateHome();
}

if (document.readyState == 'loading') {
    window.addEventListener('DOMContentLoaded', (event) => {
        decoratePage();
    });
} else {
decoratePage();
}

