function decorateBlocks() {

}

async function decoratePage() {
    decorateTables();
    await loadLocalHeader();
    decorateBlocks();
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
