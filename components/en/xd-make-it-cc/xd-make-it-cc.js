/*
 * Copyright 2021 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

// class: embed section-embed banner banner-xd-make-it-cc

// ---

// :creativecloud:

// ## Make it. Creative Cloud.

// Adobe XD is part of Creative Cloud, which also includes Photoshop, Illustrator,
// and all our other amazing creative desktop apps. It’s everything you need to turn
// your brightest ideas into your best work and share it with the world.

// [Learn more ›](https://www.adobe.com/creativecloud.html?promoid=759X6WJS&mv=other)

export default function decorate($el) {
  $el.innerHTML = `
<div>
  <p>class: embed section-embed banner banner-xd-make-it-cc</p>
</div>
<div>
  <p><img class="icon icon-creativecloud" src="/icons/creativecloud.svg" alt="creativecloud icon"></p>
  <h2 id="make-it-creative-cloud">Make it. Creative Cloud.</h2>
  <p>Adobe XD is part of Creative Cloud, which also includes Photoshop, Illustrator, and all our other amazing creative desktop apps. It’s everything you need to turn your brightest ideas into your best work and share it with the world.</p>
  <p><a href="https://www.adobe.com/creativecloud.html?promoid=759X6WJS&amp;mv=other">Learn more ›</a></p>
</div>`;
}
