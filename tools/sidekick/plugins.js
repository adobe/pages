export async function getParentFolder({ detail }) {
  const { status, location, config: cfg } = detail.data;
  const folderURL = status?.edit?.folders[0]?.url;
  if (folderURL) {
    window.open(folderURL);
  } else if (window.confirm('Sorry, but finding the parent folder of this page\'s source document has failed. Do you want to go to the root folder instead?')) {
    window.open('https://drive.google.com/drive/u/0/folders/1DS-ZKyRuwZkMPIDeuKxNMQnKDrcw1_aw');
  }
}

const sk = document.querySelector('helix-sidekick');
sk.addEventListener('custom:parent-folder', getParentFolder);
