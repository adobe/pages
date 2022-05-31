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

import { createTag } from '../../../templates/default/default.js';

function decorateLinkTexting($linktexting) {
  // const $linktexting = document.querySelector('main div.linktexting');
  // if ($linktexting) {
  const $id = $linktexting.children[0].children[1].textContent;
  // const $main = document.querySelector('main');
  document.querySelectorAll('main p').forEach(($p) => {
    if ($p.textContent.includes('<linktexting>')) {
      // let $p=$p.parentElement;
      const $widget = createTag('div', { id: 'linktexting-holder' });
      $p.parentElement.replaceChild($widget, $p);

      const parent = document.getElementById('linktexting-holder');

      parent.innerHTML = `
        <div class="promptWrapper">
          <div class="linkTextingWidgetWrapper" style="">
            <div class="linkTextingWidget" style="">
              <div class="promptContent" style=""></div>
              <div class="linkTextingInner">
                <input type="hidden" class="linkID" value="${$id}">
                  <div class="linkTextingInputWrapper">
                    <input class="linkTextingInput linkTextingInputFlagAdjust" type="tel" id="numberToText_linkTexting">
                  </div>
                  <button class="linkTextingButton localized-button localized-text-text_me_a_link" type="button" id="sendButton_linkTexting" style="background-color: #1473E6;color : #ffffff">Text me a link</button>
                  <div class="linkTextingError" id="linkTextingError" style="display:none;"></div>
              </div>
            </div>
          </div>
        </div>
        `;

      const $newHeadJS1 = createTag('script', { type: 'text/javascript' });
      $newHeadJS1.innerHTML = `
  /* Default Country Off, if set to false will use linkTextingDefaultCountry to decide default country, otherwise will determine the visiting user's country via their location */
  var linkTextingDefaultCountryOff = true;
  /* All Country data is lowercase ISO2 standard http://en.wikipedia.org/wiki/ISO_3166-1_alpha-2 */
  /* Default Country, if set to "auto" will determine the visiting user's country via their location */
  var linkTextingDefaultCountry = "us";
  /* If using automatic country detection with https or over 1,000 visits/day go to http://ipinfo.io, get a token, and place it here */
  var linkTextingIpinfoToken = "";
  /* Preferred Countries in Dropdown */
  var linkTextingPreferredCountries = ["us","ca"];
  /* Countries available in dropdown */
  var linkTextingOnlyCountries = ["af","al","dz","as","ad","ao","ai","ag","ar","am","aw","au","at","az","bs","bh","bd","bb","by","be","bz","bj","bm","bt","bo","ba","bw","br","io","vg","bn","bg","bf","bi","kh","cm","ca","cv","bq","ky","cf","td","cl","cn","co","km","cd","cg","ck","cr","ci","hr","cu","cw","cy","cz","dk","dj","dm","do","ec","eg","sv","gq","er","ee","et","fk","fo","fj","fi","fr","gf","pf","ga","gm","ge","de","gh","gi","gr","gl","gd","gp","gu","gt","gn","gw","gy","ht","hn","hk","hu","is","in","id","ir","iq","ie","il","it","jm","jp","jo","kz","ke","ki","kw","kg","la","lv","lb","ls","lr","ly","li","lt","lu","mo","mk","mg","mw","my","mv","ml","mt","mh","mq","mr","mu","mx","fm","md","mc","mn","me","ms","ma","mz","mm","na","nr","np","nl","nc","nz","ni","ne","ng","nu","nf","kp","mp","no","om","pk","pw","ps","pa","pg","py","pe","ph","pl","pt","pr","qa","re","ro","ru","rw","bl","sh","kn","lc","mf","pm","vc","ws","sm","st","sa","sn","rs","sc","sl","sg","sx","sk","si","sb","so","za","kr","ss","es","lk","sd","sr","sz","se","ch","sy","tw","tj","tz","th","tl","tg","tk","to","tt","tn","tr","tm","tc","tv","vi","ug","ua","ae","gb","us","uy","uz","vu","va","ve","vn","wf","ye","zm","zw"];
  `;

      const $newHeadJS2 = createTag('script', { type: 'text/javascript', src: '//s3.amazonaws.com/linktexting-cdn/1.7/js/link_texting_gz.min.js' });

      document.head.appendChild($newHeadJS1);
      document.head.appendChild($newHeadJS2);
    }
  });

  $linktexting.remove();
  // }
}

/** @type {import('../block').BlockDecorator} */
export default function decorate($block) {
  decorateLinkTexting($block);
}
