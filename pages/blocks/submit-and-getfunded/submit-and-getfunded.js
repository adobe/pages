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

/** @type {import("../block").BlockDecorator} */
export default function decorate(blockEl) {
  blockEl.innerHTML = `
  <div class="embed embed-internal embed-internal-submitandgetfunded embed-internal-advocates">
    <div>
      <h3 id="contact-us">Contact Us</h3>
      <h2 id="adobe-stock-advocates">Adobe Stock Advocates</h2>
      <div class="columns">
        <div>
          <div>
            <p></p>
            <p><strong><a
                  href="https://contributor.stock.adobe.com/?as_channel=microsite&amp;as_camptype=acquisition&amp;as_campclass=brand&amp;as_audience=contributors&amp;as_campaign=advocates&amp;as_source=lp">Submit
                  your work to Adobe Stock</a></strong></p>
            <p></p>
          </div>
          <div>
            <p></p>
            <p><strong><a href="https://adobe.smapply.io/prog/adobe_stock_artist_development_fund/">Apply to get
                  funded</a></strong></p>
            <p></p>
          </div>
        </div>
        <div>
          <div>
            <h3>Contact us</h3>
            <p></p>
            <p>allies@adobe.com</p>
          </div>
          <div>
            <h3>Follow us</h3>
            <p><a href="https://adobe.ly/2UaaI9M"><svg class="icon icon-adobe">
                  <use href="/icons.svg#adobe"></use>
                </svg></a> <a href="https://adobe.ly/35eUT84"><svg class="icon icon-instagram">
                  <use href="/icons.svg#instagram"></use>
                </svg></a> <a href="https://www.pinterest.co.uk/adobestock"><svg class="icon icon-pinterest">
                  <use href="/icons.svg#pinterest"></use>
                </svg></a></p>
          </div>
        </div>
      </div>
    </div>
  </div>`;
}
