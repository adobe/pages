(async function loadConsonant() {
  const href = '/templates/consonant/consonant.css';
  if (!document.querySelector(`head > link[href="${href}"]`)) {
    const link = document.createElement('link');
    link.setAttribute('rel', 'stylesheet');
    link.setAttribute('href', href);
    if (typeof callback === 'function') {
      link.onload = (e) => callback(e.type);
      link.onerror = (e) => callback(e.type);
    }
    document.head.appendChild(link);
  }
  function debug(message, err) {
    const { hostname } = window.location;
    const env = getHelixEnv();
    if (env.name !== 'prod' || hostname === 'localhost') {
      // eslint-disable-next-line no-console
      console.log(message, err);
    }
  }
  await new Promise((resolve) => {
    (async () => {
      try {
        const mod = await import(`/templates/consonant/consonant.js`);
        if (mod.default) {
          await mod.default();
        }
      } catch (err) {
        debug(`failed to load consonant: `, err);
      }
      resolve();
    })();
  });
  document.body.classList.add('appear');
})();