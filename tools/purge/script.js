async function purge() {
    const $test=document.getElementById('test_location');
    let loc=window.location.href;
    if ($test) loc=$test.value;

    const url=new URL(loc);
    let path=url.pathname;

    console.log(`purging for path: ${path}`)
    await sendPurge(path);

    const outerURL=`https://pages.adobe.com${path}`;

    const resp=await fetch(outerURL, {cache: 'reload', mode: 'no-cors'});

    console.log(`redirecting ${outerURL}`);
    window.location.href=outerURL;            
}

async function sendPurge(path) {
    const resp=await fetch(`https://adobeioruntime.net/api/v1/web/helix/helix-services/purge@v1?host=pages--adobe.hlx.page&xfh=pages.adobe.com&path=${path}`, {
        method: 'POST'
    });
    const json=await resp.json();
    console.log(JSON.stringify(json));
    return(json);
}

purge();