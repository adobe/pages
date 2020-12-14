async function delegatePageDecoration() {
    decorateABTests();
    await loadJSModule(`/templates/default/default.js`);
    //decorateTables();
} 

function decorateABTests() {
    if (!window.location.hash) {
        let $testTable;
        document.querySelectorAll('table th').forEach($th => {
            if ($th.textContent.toLowerCase().trim() == 'a/b test') {
                $testTable=$th.closest('table');
            }
        })
        
        const testSetup=[];
    
        if ($testTable) {
            $testTable.querySelectorAll('tr').forEach($row => {
                const $name=$row.children[0];
                const $percentage=$row.children[1];
                const $a=$name.querySelector('a');
                if ($a) {
                    const url=new URL($a.href);
                    testSetup.push({url: url.pathname, traffic: parseFloat($percentage.textContent)/100.0})
                }
            })
        }
        
        let test=Math.random();
        let selectedUrl='';
        testSetup.forEach((e) => {
            if (test>=0 && test<e.traffic) {
                selectedUrl=e.url;
            }
            test-=e.traffic;
        })
    
        if (selectedUrl) window.location.href=selectedUrl;    
    }
}

delegatePageDecoration();
