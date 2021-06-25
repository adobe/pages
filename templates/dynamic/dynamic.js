async function fetch_sheet() {
    window.hlx.dependencies.push('content.json');
    const resp=await fetch('content.json');
    const json=await resp.json();
    return (Array.isArray(json) ? json : json.data);
}


function send_data_off(data, types) {
    let groups = []
    let count = -0;

    function update_count() {
        count = count + 1;
        return count;
    }
    

    Object.keys(data[0]).forEach((item) => {
        if(item.includes(types)) {
            if(!groups.includes(item)) {
                groups.push(item)
            }
        }
    })

 
    
    data.forEach((item,index) => {
        console.log(groups[index])
        if(groups[index].includes(types)) {
            console.log(item[groups[index]])
        }
        // console.log(item[])
    })
}

async function decorateHome() {
    const data = await fetch_sheet();
    const children = document.querySelectorAll('main .default')
    children.forEach(($child) => {
        let container_type = '';
        if($child.innerText.includes('[#')) {
            container_type = $child.innerText.split('[#')[1].split(']')[0]+'s'
            send_data_off(data,container_type)
        }
    })
    // has_multiple_columns.length > 0 ? create_iteration_array(has_multiple_columns) : null;
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

