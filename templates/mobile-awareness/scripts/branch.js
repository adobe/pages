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

const keys = {
  fresco: 'key_live_bmNdZDHgMUk7VGTx5bdUZbpbFvogSE8i',
  'lightroom-for-mobile': 'key_live_mpNkmP6pUud4YmIqkpxginnnADcn7yGW',
  'photoshop-express': 'key_live_fhPo4Nlbi7AIL5ltTMYpxllnxvljUYEs',
  'photoshop-on-ipad': 'key_live_ibHp9EVpQKeYXNAaWHyesadpyyocSNsL',
};

export default function setUpBranch() {
  // eslint-disable-next-line
  (function (b, r, a, n, c, h, _, s, d, k) { if (!b[n] || !b[n]._q) { for (;s < _.length;)c(h, _[s++]); d = r.createElement(a); d.async = 1; d.src = 'https://cdn.branch.io/branch-latest.min.js'; k = r.getElementsByTagName(a)[0]; k.parentNode.insertBefore(d, k); b[n] = h; } }(window, document, 'script', 'branch', (b, r) => { b[r] = function () { b._q.push([r, arguments]); }; }, { _q: [], _v: 1 }, 'addListener applyCode banner closeBanner creditHistory credits data deepview deepviewCta first getCode init link logout redeem referrals removeListener sendSMS setBranchViewData setIdentity track validateCode'.split(' '), 0));
}

export function sendSMS(phoneNumber, app = 'fresco') {
  if (!phoneNumber || !keys[app] || !window.branch) return;
  window.branch.init(keys[app]);

  const linkData = {
    channel: 'Website',
    feature: 'TextMeTheApp',
  };
  const options = {};
  const callback = () => {};

  window.branch.sendSMS(phoneNumber, linkData, options, callback);
}
