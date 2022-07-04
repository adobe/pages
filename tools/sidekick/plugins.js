export async function getParentFolder({ detail }) {
  const { status, location, config: cfg } = detail.data;
  const folderURL = status?.edit?.folders[0]?.url;
  if (folderURL) {
    window.open(folderURL);
  } else if (window.confirm('Sorry, but finding the parent folder of this page\'s source document has failed. Do you want to go to the root folder instead?')) {
    window.open('https://drive.google.com/drive/u/0/folders/1DS-ZKyRuwZkMPIDeuKxNMQnKDrcw1_aw');
  }
}

export async function purgeProd({ detail = {}}) {
  // purge url from production cdn cache
  let { data: path } = detail;
  if (!path) {
    return;
  }
  if (!path.startsWith('/')) {
    // get absolute path
    path = new URL(path, location.href).pathname;
  }
  const purgeUrl = `https://pages.adobe.com${path}`;
  console.log(`purging ${purgeUrl}`);
  try {
    const resp = await fetch(purgeUrl, { method: 'PURGE' });
    if (!resp.ok) {
      throw new Error(`non-ok status ${resp.status}`);
    }
    // refresh browser cache
    await fetch(purgeUrl, { cache: 'reload' });
  } catch (e) {
    console.error(`failed to purge ${purgeUrl}: ${e.message}`);
  }
};
