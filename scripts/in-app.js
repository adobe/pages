function wrapSections(element) {
  document.querySelectorAll(element).forEach(($div) => {
      const $wrapper=createTag('div', { class: 'section-wrapper'});
      $div.parentNode.appendChild($wrapper);
      $wrapper.appendChild($div);
  });
}

function addDefaultClass(element) {
    document.querySelectorAll(element).forEach(($div) => {
        $div.classList.add('default');
    });
}


let debounce = function(func, wait, immediate) {
let timeout;
return function() {
  let context = this, args = arguments;
  let later = function() {
    timeout = null;
    if (!immediate) func.apply(context, args);
  };
  let callNow = immediate && !timeout;
  clearTimeout(timeout);
  timeout = setTimeout(later, wait);
  if (callNow) func.apply(context, args);
};
};


function styleBackgrounds() {
  let backgrounds = document.querySelectorAll('.background');

  if(!backgrounds.length) return;
  
  backgrounds.forEach(function(background) {
      if(!background.childNodes[0]) return;
      if(background.childNodes[0].nodeName === "IMG") {
          let src = background.childNodes[0].getAttribute('src')
          background.style.backgroundImage = `url(${src})`;
          background.innerHTML = ``;
      }
      
  })
}

function addNavCarrot() {
    if(document.querySelector('header img')) {
      let svg = document.querySelector('header img');
      let svgWithCarrot = document.createElement('div');
      svgWithCarrot.classList.add('nav-logo');
  
      svgWithCarrot.innerHTML = `
        <span class="product-icon">
          ${svg.outerHTML}
        </span>
  
        <span class="carrot">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" class="feather feather-chevron-down"><polyline points="6 9 12 15 18 9"></polyline></svg>
        </span>
      `;
      svg.remove();
      document.querySelector('header div')
      .prepend(svgWithCarrot);
    }
  }


function dropDownMenu() {
  let $header = document.querySelector('header');

  if(window.outerWidth >= 768) return;

  if(!$header.classList.contains('nav-showing')) {
    $header.querySelector('ul').style.display = 'flex';
    $header.classList.add('nav-showing')
  } else {
    $header.querySelector('ul').style.display = 'none';
    $header.classList.remove('nav-showing')
  }
}


function paramHelper() {
  if(!window.location.search) return;
  let query_type = new URLSearchParams(window.location.search);

  // Set Main Video
  // make sure video indicator is being requested
  if(query_type.get('v')) {
      let video_index = query_type.get('v') - 1;
      let parent_wrapper = document.querySelector('.cards');
      let mainVideo = document.createElement('div');
      mainVideo.setAttribute('class', 'main-video');
      mainVideo.innerHTML = document.querySelectorAll('.cards .card')[video_index].innerHTML;
      parent_wrapper.prepend(mainVideo);
  } 
}

async function decoratePage() {
  decorateTables();
  wrapSections('main>div');
  addDefaultClass('main>div');
  await loadLocalHeader();
  wrapSections('header>div');
  wrapSections('footer>div');
  window.pages.decorated = true;
  appearMain();
  // nav style/dropdown
  addNavCarrot();

  if(document.querySelector('.nav-logo')) {
    document.querySelector('.nav-logo').addEventListener('click', dropDownMenu)
  }
  styleBackgrounds();
}


function turnListSectionIntoCards() {
  document.querySelectorAll('main div.default>ul').forEach(($ul) => {
    if ($ul == $ul.parentNode.firstElementChild) {
      $ul.classList.remove('default');
      $ul.classList.add('cards');
      $ul.querySelectorAll('li').forEach(($li) => {
        $li.innerHTML=formatListCard($li);
      })
    }
  })
}


function toClassName(name) {
  return (name.toLowerCase().replace(/[^0-9a-z]/gi, '-'))
}

function decorateTables() {
  document.querySelectorAll('main div.default>table').forEach(($table) => {
      const $cols=$table.querySelectorAll('thead tr th');
      const cols=Array.from($cols).map((e) => toClassName(e.innerHTML));
      const $rows=$table.querySelectorAll('tbody tr');
      let $div={};

      if (cols.length==1 && $rows.length==1) {
          $div=createTag('div', {class:`${cols[0]}`});
          $div.innerHTML=$rows[0].querySelector('td').innerHTML;
      } else {
          $div=turnTableSectionIntoCards($table, cols) 
      }
      $table.parentNode.replaceChild($div, $table);
  });
}

function turnTableSectionIntoCards($table, cols) {
  const $rows=$table.querySelectorAll('tbody tr');
  const $cards=createTag('div', {class:`cards ${cols.join('-')}`})
  $rows.forEach(($tr) => {
      const $card=createTag('div', {class:'card'})
      $tr.querySelectorAll('td').forEach(($td, i) => {
          const $div=createTag('div', {class: cols[i]});
          const $a=$td.querySelector('a[href]');
          if ($a && $a.getAttribute('href').startsWith('https://www.youtube.com/')) {
              const yturl=new URL($a.getAttribute('href'));
              const vid=yturl.searchParams.get('v');
              $div.innerHTML=`<div style="left: 0; width: 100%; height: 0; position: relative; padding-bottom: 56.25%;"><iframe src="https://www.youtube.com/embed/${vid}?rel=0" style="border: 0; top: 0; left: 0; width: 100%; height: 100%; position: absolute;" allowfullscreen scrolling="no" allow="encrypted-media; accelerometer; gyroscope; picture-in-picture"></iframe></div>`;
          } else {
              $div.innerHTML=$td.innerHTML;
          }
          $card.append($div);
      });
      $cards.append($card);
  });
  return ($cards);
}


if (document.readyState == 'loading') {
  window.addEventListener('DOMContentLoaded', (event) => {
      decoratePage();
  });
} else {
  decoratePage();
}

(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{let g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.protocolCheck = f()}})(function(){let define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){let a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);let f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}let l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){let n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}let i=typeof require=="function"&&require;for(let o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
  function _registerEvent(target, eventType, cb) {
      if (target.addEventListener) {
          target.addEventListener(eventType, cb);
          return {
              remove: function () {
                  target.removeEventListener(eventType, cb);
              }
          };
      } else {
          target.attachEvent(eventType, cb);
          return {
              remove: function () {
                  target.detachEvent(eventType, cb);
              }
          };
      }
  }
  
  function _createHiddenIframe(target, uri) {
      let iframe = document.createElement("iframe");
      iframe.src = uri;
      iframe.id = "hiddenIframe";
      iframe.style.display = "none";
      target.appendChild(iframe);
  
      return iframe;
  }
  
  function openUriWithHiddenFrame(uri, failCb, successCb) {
  
      let timeout = setTimeout(function () {
          failCb();
          handler.remove();
      }, 1000);
  
      let iframe = document.querySelector("#hiddenIframe");
      if (!iframe) {
          iframe = _createHiddenIframe(document.body, "about:blank");
      }
  
      let handler = _registerEvent(window, "blur", onBlur);
    
      function onBlur() {
          clearTimeout(timeout);
          handler.remove();
          successCb();
      }
    
      iframe.contentWindow.location.href = uri;
  }
  
  function openUriWithTimeoutHack(uri, failCb, successCb) {
      
      let timeout = setTimeout(function () {
          failCb();
          handler.remove();
      }, 1000);
  
      //handle page running in an iframe (blur must be registered with top level window)
      let target = window;
      while (target != target.parent) {
          target = target.parent;
      }
  
      let handler = _registerEvent(target, "blur", onBlur);
  
      function onBlur() {
          clearTimeout(timeout);
          handler.remove();
          successCb();
      }
  
      window.location = uri;
  }
  
  function openUriUsingFirefox(uri, failCb, successCb) {
      let iframe = document.querySelector("#hiddenIframe");
  
      if (!iframe) {
          iframe = _createHiddenIframe(document.body, "about:blank");
      }
  
      try {
          iframe.contentWindow.location.href = uri;
          successCb();
      } catch (e) {
          if (e.name == "NS_ERROR_UNKNOWN_PROTOCOL") {
              failCb();
          }
      }
  }
  
  function openUriUsingIEInOlderWindows(uri, failCb, successCb) {
      if (getInternetExplorerVersion() === 10) {
          openUriUsingIE10InWindows7(uri, failCb, successCb);
      } else if (getInternetExplorerVersion() === 9 || getInternetExplorerVersion() === 11) {
          openUriWithHiddenFrame(uri, failCb, successCb);
      } else {
          openUriInNewWindowHack(uri, failCb, successCb);
      }
  }
  
  function openUriUsingIE10InWindows7(uri, failCb, successCb) {
      let timeout = setTimeout(failCb, 1000);
      window.addEventListener("blur", function () {
          clearTimeout(timeout);
          successCb();
      });
  
      let iframe = document.querySelector("#hiddenIframe");
      if (!iframe) {
          iframe = _createHiddenIframe(document.body, "about:blank");
      }
      try {
          iframe.contentWindow.location.href = uri;
      } catch (e) {
          failCb();
          clearTimeout(timeout);
      }
  }
  
  function openUriInNewWindowHack(uri, failCb, successCb) {
      let myWindow = window.open('', '', 'width=0,height=0');
  
      myWindow.document.write("<iframe src='" + uri + "'></iframe>");
  
      setTimeout(function () {
          try {
              myWindow.location.href;
              myWindow.setTimeout("window.close()", 1000);
              successCb();
          } catch (e) {
              myWindow.close();
              failCb();
          }
      }, 1000);
  }
  
  function openUriWithMsLaunchUri(uri, failCb, successCb) {
      navigator.msLaunchUri(uri,
          successCb,
          failCb
      );
  }
  
  function checkBrowser() {
      let isOpera = !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
      let ua = navigator.userAgent.toLowerCase();
      return {
          isOpera   : isOpera,
          isFirefox : typeof InstallTrigger !== 'undefined',
          isSafari  : (~ua.indexOf('safari') && !~ua.indexOf('chrome')) || Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0,
          isIOS     : /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream,
          isChrome  : !!window.chrome && !isOpera,
          isIE      : /*@cc_on!@*/false || !!document.documentMode // At least IE6
      }
  }
  
  function getInternetExplorerVersion() {
      let rv = -1;
      if (navigator.appName === "Microsoft Internet Explorer") {
          let ua = navigator.userAgent;
          let re = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
          if (re.exec(ua) != null)
              rv = parseFloat(RegExp.$1);
      }
      else if (navigator.appName === "Netscape") {
          let ua = navigator.userAgent;
          let re = new RegExp("Trident/.*rv:([0-9]{1,}[\.0-9]{0,})");
          if (re.exec(ua) != null) {
              rv = parseFloat(RegExp.$1);
          }
      }
      return rv;
  }
  
  module.exports = function(uri, failCb, successCb, unsupportedCb) {
      function failCallback() {
          failCb && failCb();
      }
  
      function successCallback() {
          successCb && successCb();
      }
  
      if (navigator.msLaunchUri) { //for IE and Edge in Win 8 and Win 10
          uri = uri.replace(/^clkn\/adbxd[\/]?/, "adbxd:\/\/");
          openUriWithMsLaunchUri(uri, failCb, successCb);
      } else {
          let browser = checkBrowser();
  
          if (browser.isFirefox) {
              openUriUsingFirefox(uri, failCallback, successCallback);
          } else if (browser.isChrome || browser.isIOS) {
              openUriWithTimeoutHack(uri, failCallback, successCallback);
          } else if (browser.isIE) {
              openUriUsingIEInOlderWindows(uri, failCallback, successCallback);
          } else if (browser.isSafari) {
              uri = uri.replace(/^clkn\/adbxd[\/]?/, "adbxd:\/\/");
              openUriWithHiddenFrame(uri, failCallback, successCallback);
          } else {
              unsupportedCb();
              //not supported, implement please
          }
      }
  }
  
  },{}]},{},[1])(1)
  });
    

  window.onload = function(){
  
      // $("#mailToLink").attr("href", "mailto:?subject=Remember%20To%20Download%20XD%20File%20Reminder&body="+window.location+"\nXD Team");

      let param_type = new URLSearchParams(window.location.search);
      
      if(window.location.href.includes('file') && param_type.get('name')) {
          let uiKitId = param_type.get('name');
            console.log('cloud doc init')
          if (uiKitId && !/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))
       {   
          window.protocolCheck("adbxd://app?action=openCloudDoc&cloudURL="+uiKitId+"&extn=xd",
              function () {
                  alert("The latest Adobe XD is not installed. Please install or update");
              }
          );
         
          
          event.preventDefault ? event.preventDefault() : event.returnValue = false; 
       }
      }   

      if(window.location.href.includes('plugin') && param_type.get('name') || param_type.get('pluginId') || param_type.get('versionUuid')) {

        console.log('init plugin logic')
        let oldPluginId = param_type.get('name');
        let newPluginId = param_type.get('pluginId');
        let versionUuid = param_type.get('versionUuid');
        let loc = window.location+'';
        let urilink = '';

        if(oldPluginId) {
            urilink =  "adbxd://app?action=openPluginManager&id="+oldPluginId;
          }
          else if(newPluginId) {
            let trunc= loc.split("pluginId=")[1];
            urilink = "adbxd://app?action=openPluginMarketplace&route=/pluginDetails/"+trunc
          }
          else if(versionUuid) {
            let trunc = loc.split('versionUuid=')[1];
            urilink = "adbxd://app?action=openPluginMarketplace&route=/pluginDetails/"+trunc
          }

          if (!/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))
          {   
            //alert(urilink);
            window.protocolCheck(urilink,
                 function () {
                   let intro = document.querySelector('.intro');
                   intro.querySelector('h1').innerText = "Uh oh, looks like we were unable to locate XD";
                 }
             );
             event.preventDefault ? event.preventDefault() : event.returnValue = false;
          }
      }

    };
