/*
 * Copyright 2022 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

function returnPreviewValues(doc, link) {
  const videoUrl = doc.querySelectorAll('a[href*="youtu.be"]')[0].getAttribute('href').split('.be/')[1];
  return {
    url: link,
    title: doc.querySelector('h1:first-of-type').innerText,
    copy: doc.querySelector('p:first-of-type').innerText,
    youtubeThumbnail: `https://i.ytimg.com/vi/${videoUrl}/hqdefault.jpg?sqp=-oaymwEXCOADEI4CSFryq4qpAwkIARUAAIhCGAE=&rs=AOn4CLDANlnxsYWMLAMswxoN8oCoIj3baQ`,
  };
}

function fetchDocuments($links) {
  const promises = [];
  $links.forEach((link) => {
    const destinationLink = new URL(`${link.getAttribute('href')}`);
    const linkCleanUp = `${destinationLink.pathname}.plain.html`;
    promises.push(
      fetch(linkCleanUp)
        .then((res) => res.text())
        .then((resHtml) => {
          console.log(link.getAttribute('href'));
          const parser = new DOMParser();
          const doc = parser.parseFromString(resHtml, 'text/html');
          return returnPreviewValues(doc, link.getAttribute('href'));
        }),
    );
  });
  return promises;
}

async function learnmoresmart($block) {
  const links = $block.querySelectorAll('a');
  const data = await fetchDocuments(links);
  const content = await Promise.all(data).then((res) => res);
  let markup = '';
  content.forEach((contentItem) => {
    const {
      url,
      title,
      copy,
      youtubeThumbnail,
    } = contentItem;
    markup += `
      <a class="learn-smart-block" href="${url}">
        <div class="learn-image-parent">
          <div class="learn-image">
            <img src="${youtubeThumbnail}" alt="learning content around ${title}"/>
          </div>
        </div>
        <div class="learn-content">
          <p class="learn-title">${title}</p>
          <p class="learn-copy">${copy}</p>
        </div>
      </a>
    `;
  });

  $block.innerHTML = markup;
}
export default learnmoresmart;
