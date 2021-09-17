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

/** @type {import("../../component").ComponentDecorator} */
export default function decorate(blockEl) {
  blockEl.innerHTML = `<div class="embed embed-internal embed-internal-fundsection embed-internal-advocates">
  <div>
    <p>
      <picture>
        <source media="(max-width: 400px)"
          srcset="./media_1913b6438cfcedc885b9a6124d7bd0032f1a2c00e.png?width=750&amp;format=webply&amp;optimize=medium">
        <img
          src="./media_1913b6438cfcedc885b9a6124d7bd0032f1a2c00e.png?width=2000&amp;format=webply&amp;optimize=medium"
          alt="" loading="eager">
      </picture>
    </p>
    <p>Adobe Artist: Wisemark - Stocksy</p>
  </div>
  <div>
    <h2 id="apply-for-the-artist-development-fund">Apply for the Artist Development Fund</h2>
    <p>Introducing the Artist Development Fund, a new $500,000 creative commission program from Adobe Stock. As an
      expression of our commitment to inclusion we’re looking for artists who self-identify with and expertly depict
      diverse communities within their work.</p>
    <p><strong><a href="https://pages.adobe.com/stock/en/advocates/artist-development-fund.html">Learn more and
          apply</a></strong></p>
  </div>
</div>`;
}
