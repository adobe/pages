

function wrapSections(element) {
  document.querySelectorAll(element).forEach(($div) => {
    const $wrapper = createTag("div", { class: "section-wrapper" });
    $div.parentNode.appendChild($wrapper);
    $wrapper.appendChild($div);
  });
}


function decorateNav() {
  if (document.querySelector("header img")) {
    console.log('nav initiated')
    let svg = document.querySelector("header img");
    let svgWithCarrot = document.createElement("div");
    svgWithCarrot.classList.add("nav-logo");

    svgWithCarrot.innerHTML = `
      <span class="product-icon">
          ${svg.outerHTML}
      </span>

      <span class="carrot">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="feather feather-chevron-down"><polyline points="6 9 12 15 18 9"></polyline></svg>
      </span>
      `;
    svg.remove();
    document.querySelector("header div").prepend(svgWithCarrot);
    document.querySelector("header").classList.add("default-nav");

    if (
      document.querySelector("header .section-wrapper").children[1]
        .firstElementChild.nodeName === "P"
    ) {
      let productName = document
        .querySelector("header .section-wrapper")
        .children[1].querySelector("p");
      document.querySelector(".product-icon").appendChild(productName);
    }
  }
}

function dropDownMenu() {
  let $header = document.querySelector("header");

  if (window.outerWidth >= 768) return;

  if (!$header.classList.contains("nav-showing")) {
    $header.querySelector("ul").style.display = "flex";
    $header.classList.add("nav-showing");
  } else {
    $header.querySelector("ul").style.display = "none";
    $header.classList.remove("nav-showing");
  }
}

export function playVideo() {
  document.getElementById("placeholder").classList.add("hidden");
  const $video = document.getElementById("video");
  $video.classList.remove("hidden");
  $video.classList.remove("hidden");
  $video.play();
  $video.setAttribute("controls", true);
}


let debounce = function (func, wait, immediate) {
  let timeout;
  return function () {
    let context = this,
      args = arguments;
    let later = function () {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    let callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
};

// set fixed height to cards to create a uniform UI
function cardHeightEqualizer($el) {
  let initialHeight = 0;
  let element = document.querySelectorAll($el);

  if (window.innerWidth >= 700 && element.length > 1) {
    element.forEach(function (card_el) {
      card_el.style.height = "auto";
    });

    element.forEach(function (card_text) {
      if (initialHeight < card_text.offsetHeight) {
        initialHeight = card_text.offsetHeight;
      }
    });

    element.forEach(function (card_el) {
      card_el.style.height = initialHeight + "px";
    });
  } else {
    element.forEach(function (card_el) {
      card_el.style.height = "auto";
    });
  }
}

window.addEventListener("resize", debounce(function () {
    // run resize events
    cardHeightEqualizer(".card-content");
  }, 250)
);


function styleCards() {
  if(!document.getElementsByTagName('body')[0].classList.contains('inclusive')) {
    if(document.querySelector('.thank-you-cards-')) {
      document.querySelector('.thank-you-cards-').closest('.default').classList.add('thank-you-container')
      document.getElementsByTagName('body')[0].classList.add('smb-thank-you')
    }
    
    if(document.querySelector('form')) {
      document.getElementsByTagName('body')[0].classList.add('smb-form')
    }
  }
  
}


async function decoratePage() {
  addDefaultClass('main>div');
  decorateTables();
  styleCards();
  await loadLocalHeader();
  wrapSections("header>div");
  externalLinks("header");
  externalLinks("footer");
  setTabIndex();

  // nav style/dropdown
  decorateNav();

  if (document.querySelector(".nav-logo")) {
    document.querySelector(".nav-logo").addEventListener("click", dropDownMenu);
  }


  window.pages.decorated = true;
  wrapSections(".home > main > div");
  appearMain();
}


if (document.readyState == "loading") {
  window.addEventListener("DOMContentLoaded", (event) => {
    decoratePage();
  });
} else {
  decoratePage();
}

function toClassName(name) {
  return name.toLowerCase().replace(/[^0-9a-z]/gi, "-");
}


function setTabIndex() {
  const body = document.getElementsByTagName('body')[0];

  if(body.classList.contains('smb-form')) {
    let waitForForm = setInterval(function() {
      if(document.querySelector('form')) {
        setTimeout(function() {
          let elements = document.querySelectorAll('h1, p, a, label, input, button , h3, .card');
          elements.forEach(function(el) { el.setAttribute('tabindex', 0 )})
        }, 100)
        clearInterval(waitForForm)
      }
    }, 100)
  }

  if(body.classList.contains('smb-thank-you') && !body.classList.contains('smb-form')) {
    let elements = document.querySelectorAll('h1, p, a, label, input, button , h3, .card');

    elements.forEach(function(el) { el.setAttribute('tabindex', 0 )})
  }

  
}



