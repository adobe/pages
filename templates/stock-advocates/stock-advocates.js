async function loadLocalHeader() {
  const $inlineHeader=document.querySelector('main div.header-block');
  if ($inlineHeader) {
    const $header=document.querySelector('header');
    $inlineHeader.childNodes.forEach((e, i) => {
      if (e.nodeName == '#text' && !i) {
        const $p=createTag('p');
        const inner=`<img class="icon icon-${window.pages.product}" src="/icons/${window.pages.product}.svg">${e.nodeValue}`
        $p.innerHTML=inner;
        e.parentNode.replaceChild($p,e);
      }
      if (e.nodeName == 'P' && !i) {
        const inner=`<img class="icon icon-${window.pages.product}" src="/icons/${window.pages.product}.svg">${e.innerHTML}`
        e.innerHTML=inner;
      }
    });
    $header.innerHTML=`<div>${$inlineHeader.innerHTML}</div>`;
    $inlineHeader.remove();
    document.querySelector('header').classList.add('appear');
  } else {
    await insertLocalResource('header');

  }
}


function wrapSections(element) {
    document.querySelectorAll(element).forEach(($div) => {
      const $wrapper=createTag('div', { class: 'section-wrapper'});
      $div.parentNode.appendChild($wrapper);
      $wrapper.appendChild($div);
    });
  }

function decorateHeroSection() {
    const $firstSectionImage=document.querySelector('main div.section-wrapper>div>p>img');
    if ($firstSectionImage) {
        const $section=$firstSectionImage.closest('.section-wrapper');
        $section.classList.add('full-width');
        const $div=$firstSectionImage.closest('div');
        $section.classList.add('hero-section','white-text');
        $div.classList.add('text');
        if ($div.children[1].children[0].tagName=='IMG') {
          $div.classList.add('image');
        } else {
          const $imgWrapper=createTag('div', {class:'image'});
          $section.append($imgWrapper);
          const $p=$firstSectionImage.parentNode.nextElementSibling;
          $imgWrapper.append($firstSectionImage.parentNode);
          $imgWrapper.append($p);  
        }
    }
}

function decorateFaq() {
  const $faq=document.querySelector('main .faq');
  if ($faq) {
    $faq.closest('.section-wrapper').classList.add('faq-container');
    Array.from($faq.children).forEach(($row) => {
      const $question=$row.children[0];
      const $answer=$row.children[1];
  
      $question.classList.add('question');
      $answer.classList.add('answer');
  
      $question.addEventListener('click', (evt) => {
        $row.classList.toggle('show');
      })
  
    });  
  }
}

function decorateColors() {
    const $colors=document.querySelector('main .colors div div');
    if ($colors) {
        const colors=Array.from($colors.children).map(e => e.textContent);
        const $heroSection=document.querySelector('main .hero-section');
        if ($heroSection && colors.length) {
            const heroColor=colors.shift();
            $heroSection.style.backgroundColor=heroColor;
        }
        document.querySelectorAll('main .columns>div').forEach(($row, i) => {
            if (colors[i]) {
                const line=colors[i];
                const splits=line.split(',');
                const color=splits[0].trim();
                $row.style.backgroundColor=color;
                const lightness=(parseInt(color.substr(1, 2), 16)+parseInt(color.substr(3, 2), 16)+parseInt(color.substr(5, 2), 16))/3;
                if (lightness<200) $row.classList.add('white-text');
                if (splits[1]) $row.classList.add(splits[1].trim());
            }
        })
    
    }
}

function decorateGrid() {
    document.querySelectorAll('main div>.grid').forEach(($grid) => {
      $grid.closest('.section-wrapper').classList.add('full-width');

        const rows=Array.from($grid.children);
        rows.forEach($row => {
            const cells=Array.from($row.children);
            cells[0].classList.add('image');
            cells[1].classList.add('text');            
            cells[1].style.backgroundColor=cells[2].textContent+'80';
            cells[2].remove();
            const $a=cells[1].querySelector('a');
            if ($a) {
                const linkTarget=$a.href;
                $row.addEventListener('click', (evt) => {
                    window.location.href=linkTarget;
                })    
            }

        })
    })
}

function decorateButtons() {
    document.querySelectorAll('main a').forEach($a => {
      const $up=$a.parentElement;
      const $twoup=$a.parentElement.parentElement;
      if ($up.childNodes.length==1 && $up.tagName=='P') {
        $a.className='button secondary';
      }
      if ($up.childNodes.length==1 && $up.tagName=='STRONG' && 
        $twoup.childNodes.length==1 && $twoup.tagName=='P') {
        $a.className='button primary';
      }
    })
  }
  

function decorateColumns() {
  var isIndex = window.location.pathname.endsWith('/');
  document.querySelectorAll('main div>.columns').forEach(($columns) => {
      if (!isIndex) {$columns.classList.add("left-justify"); }
      $columns.closest('.section-wrapper').classList.add('full-width');
      const rows=Array.from($columns.children);
      rows.forEach($row => {
          const cells=Array.from($row.children);
          cells.forEach(($cell,i,arr) => {
              const $img=$cell.querySelector('img');
              if ($img) { 
                  $cell.classList.add('image');
              } else {
                  $cell.classList.add('text');
                  if ($cell.textContent=='') {
                      $cell.remove();
                      arr[i-1].classList.add('merged');
                  }
              }
          })
      })
  })
}

function decorateOverlay() {
  document.querySelectorAll('main div>.overlay').forEach(($overlay) => {
    $overlay.closest('.section-wrapper').classList.add('full-width');
  });
}

function decorateParallax() {
    document.querySelectorAll('main div>.parallax').forEach(($parallax) => {
        $parallax.closest('.section-wrapper').classList.add('full-width');
        Array.from($parallax.children).forEach(($layer) => {
            $parallax.prepend($layer);
        })
        document.addEventListener('scroll', (evt) => {
            const clientRect=$parallax.getBoundingClientRect();
            if (clientRect.y<window.innerHeight && clientRect.bottom>0) {
                const maxExtent=window.innerHeight+clientRect.height;
                const offsetRatio=((maxExtent)-(window.innerHeight-clientRect.y))/maxExtent;
                Array.from($parallax.children).forEach(($layer, i ,arr) => {
                    const translateY=(arr.length-1-i)*clientRect.height/4*offsetRatio;
                    if (translateY) {
                      $layer.style.transform=`translate(0px,${translateY-0}px)`;
                    }
                })                        
            }
        })
    })
}

function decorateInternalAdvocates() {
  document.querySelectorAll('main div>.embed-internal-advocates').forEach(($embed) => {
    $embed.innerHTML=$embed.innerHTML.replace('Adobe Stock Advocates', '<img src="/templates/stock-advocates/stock-advocates-purple.svg" class="stock-advocates" alt="Adobe Stock Advocates">')

  })
}

function decorateHeroCarousel() {
    document.querySelectorAll('main div>.hero-carousel').forEach(($carousel) => {
        const $wrapper=createTag('div', { class: 'hero-carousel-viewport'});
        $wrapper.innerHTML=$carousel.innerHTML;
        $carousel.innerHTML='';
        $carousel.appendChild($wrapper);
        const $nav=createTag('div', { class: 'hero-carousel-navigation'});
        const $navList=createTag('div', {class: 'hero-carousel-navigation-list'});
        $nav.append($navList);
        $carousel.appendChild($nav);
        $wrapper.querySelectorAll(':scope>div').forEach(($slide, i, slides) => {
            $slide.classList.add('hero-carousel-slide');
            $slide.id=`hero-carousel-slide${i}`;
            $slide.append(createTag('div', {class: 'hero-carousel-snapper'} ));
            $slide.append(createTag('a', {class: 'hero-carousel-prev', href: `#hero-carousel-slide${(i-1)%slides.length}`} ));
            $slide.append(createTag('a', {class: 'hero-carousel-next', href: `#hero-carousel-slide${(i+1)%slides.length}`} ));
            const $navitem=createTag('div', {class: 'hero-carousel-navigation-list'});
            $navitem.innerHTML=`<div class="hero-carousel-navigation-item"><a href="#hero-carousel-slide${i}" class="hero-carousel-navigation-button"><a></div>`;
            $navList.append($navitem);
        });

        const $section=$carousel.closest('.section-wrapper');
        $section.classList.add('hero-carousel-container','full-width');
        const $overlay=$carousel.parentNode;
        $overlay.classList.add('hero-carousel-overlay');
        $section.prepend($carousel);
        
        $overlay.innerHTML=$overlay.innerHTML.replace('Adobe Stock Advocates', '<img src="/templates/stock-advocates/stock-advocates.svg" class="stock-advocates" alt="Adobe Stock Advocates">')
    });
}

function decorateTables() {
    document.querySelectorAll('main>div>table,.embed>div>table').forEach(($table) => {
      const $cols=$table.querySelectorAll(':scope>thead>tr>th');
      const cols=Array.from($cols).map((e) => toClassName(e.innerHTML)).filter(e => e?true:false);
      const $rows=$table.querySelectorAll(':scope>tbody>tr');
      let $div={};
      
      $div=tableToDivs($table, cols) 
      $table.parentNode.replaceChild($div, $table);
    });
  }
    
  function tableToDivs($table, cols) {
    const $rows=$table.querySelectorAll(':scope>tbody>tr');
    const $cards=createTag('div', {class:`${cols.join('-')}`})
    $rows.forEach(($tr) => {
      const $card=createTag('div')
      $tr.querySelectorAll(':scope>td').forEach(($td, i) => {
        const $div=createTag('div', cols.length>1?{class: cols[i]}:{});
          $div.innerHTML=$td.innerHTML;
          $div.childNodes.forEach(($child) => {
            if ($child.nodeName=='#text' && $child.nodeValue.trim()) {
              const $p=createTag('p');
              $p.innerHTML=$child.nodeValue;
              $child.parentElement.replaceChild($p, $child);
            }
          })
          $card.append($div);
        });
        $cards.append($card);
      });
    return ($cards);
  }  
  
  function readBlockConfig($block) {
    const config={};
    $block.querySelectorAll(':scope>div').forEach(($row) => {
      if ($row.children && $row.children[1]) {
        const name=toClassName($row.children[0].textContent);
        const $a=$row.children[1].querySelector('a');
        let value='';
        if ($a) value=$a.href;
        else value=$row.children[1].textContent;
        config[name]=value;  
      }
    });
    return config;
  }

  async function decorateHeader() {
    await loadLocalHeader();
    const $header=document.querySelector('header>div');
    const $logo=$header.children[0];
    const $menu=$header.children[1];
    const $hamburger=$header.children[2];

    $logo.classList.add('logo');
    $logo.classList.add('handsy');

    $logo.addEventListener("click", (() => { 
      // don't want to wrap with a tag, too many styles using children[0]
      // this won't work if we add more subs, takes us back to /stock/en/
      window.location.pathname = window.location.pathname.split("/").slice(0,-2).join("/") + "/";
    }));
    $menu.classList.add('menu');
    $hamburger.classList.add('hamburger');

    $hamburger.addEventListener('click', (evt) => {
      const added=$header.classList.toggle('expanded');
      if (added) {
        document.body.classList.add('noscroll');
      } else {
        document.body.classList.remove('noscroll');
      }
    
    })
    decorateLogo();

  }


  function decorateContactUs() {
    const $contactus=document.getElementById('contact-us');
    if ($contactus) {
      const $parent=$contactus.parentElement;
      $contactus.remove();
      $parent.id='contact-us';
      if (window.location.hash=='#contact-us') {
        $parent.scrollIntoView();
      }
    }
  }

  function decorateLogo() {
    const $hero=document.querySelector('.hero-carousel');
    if (!$hero) {
      const $header=document.querySelector('header');
      const $asaLogoDiv=createTag('div', {class: 'asa-logo handsy'});
      $asaLogoDiv.innerHTML=`<img src="/templates/stock-advocates/advocates_logo_small.svg">`;
      // don't want to wrap with a tag, too many style selectors may break - kk
      $asaLogoDiv.addEventListener("click", (() => { 
        // this won't work if we add more sub folders
        window.location.pathname = window.location.pathname.split("/").slice(0,-1).join("/") + "/";
      }));
      $header.append($asaLogoDiv);
    }
  }


  async function decoratePage() {
    decorateTables();
    decorateHeader();
    wrapSections('main>div');
    wrapSections('footer>div');
    decorateHeroCarousel();
    decorateHeroSection();
    decorateParallax();
    decorateOverlay();
    decorateInternalAdvocates();
    decorateColumns();
    decorateGrid();
    decorateColors();
    decorateButtons();
    decorateFaq();
    window.pages.decorated = true;
    appearMain();
    decorateContactUs();
  }
  
  
  if (document.readyState == 'loading') {
    window.addEventListener('DOMContentLoaded', (event) => {
      decoratePage();
    });
  } else {
    decoratePage();
  }
  