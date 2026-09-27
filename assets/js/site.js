document.addEventListener('DOMContentLoaded',()=>{
  // Preset library filter.
  const q=document.querySelector('#presetSearch');
  const cat=document.querySelector('#presetCategory');
  const cards=[...document.querySelectorAll('[data-preset-card]')];
  const filterPresets=()=>{
    if(!cards.length)return;
    const text=(q?.value||'').trim().toLowerCase();
    const c=cat?.value||'all';
    cards.forEach(el=>{
      const okText=!text || (el.dataset.search||'').includes(text);
      const okCat=c==='all' || el.dataset.category===c;
      el.style.display=(okText&&okCat)?'':'none';
    });
  };
  q?.addEventListener('input',filterPresets);
  cat?.addEventListener('change',filterPresets);

  // Curriculum filters. Works on curriculum.html and the full table in conceptbook.html.
  const grade=document.querySelector('#curriculumClass');
  const level=document.querySelector('#curriculumLevel');
  const curriculumRows=[...document.querySelectorAll('.curriculum-table tbody tr')];
  const filterCurriculum=()=>{
    if(!curriculumRows.length)return;
    const g=grade?.value||'all';
    const l=level?.value||'all';
    curriculumRows.forEach(row=>{
      const rowGrade=(row.dataset.class||'').trim();
      const rowLevel=(row.dataset.level||'').trim().toLowerCase();
      const okGrade=g==='all' || rowGrade===g;
      const okLevel=l==='all' || rowLevel===l;
      row.hidden=!(okGrade&&okLevel);
    });
  };
  grade?.addEventListener('change',filterCurriculum);
  level?.addEventListener('change',filterCurriculum);

  // Global image lightbox.
  const lightbox=document.createElement('div');
  lightbox.className='lightbox';
  lightbox.setAttribute('aria-hidden','true');
  lightbox.innerHTML=`
    <button class="lightbox-close" type="button" aria-label="Закрыть">×</button>
    <div class="lightbox-stage" role="dialog" aria-modal="true" aria-label="Увеличенное изображение">
      <img class="lightbox-image" alt="">
      <div class="lightbox-caption"></div>
    </div>`;
  document.body.appendChild(lightbox);

  const lbImg=lightbox.querySelector('.lightbox-image');
  const lbCaption=lightbox.querySelector('.lightbox-caption');
  const lbClose=lightbox.querySelector('.lightbox-close');

  const getFullSource=(img)=>{
    let src=img.dataset.full || img.getAttribute('src') || '';
    // Card thumbnails have high-resolution twins in assets/scenes and assets/presets.
    src=src.replace('assets/thumbs/','assets/');
    return src;
  };

  const openLightbox=(img)=>{
    const src=getFullSource(img);
    if(!src)return;
    lbImg.src=src;
    lbImg.alt=img.alt||'';
    const caption=img.dataset.caption || img.alt || '';
    lbCaption.textContent=caption;
    lbCaption.hidden=!caption;
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden','false');
    document.body.classList.add('lightbox-open');
    lbClose.focus({preventScroll:true});
  };

  const closeLightbox=()=>{
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden','true');
    document.body.classList.remove('lightbox-open');
    lbImg.removeAttribute('src');
  };

  document.addEventListener('click',(event)=>{
    const img=event.target.closest('main img:not([data-no-lightbox])');
    if(!img || img.closest('.lightbox'))return;
    // Images inside scene/preset cards zoom instead of following the card link.
    event.preventDefault();
    event.stopPropagation();
    openLightbox(img);
  });

  lbClose.addEventListener('click',closeLightbox);
  lightbox.addEventListener('click',(event)=>{
    if(event.target===lightbox)closeLightbox();
  });
  document.addEventListener('keydown',(event)=>{
    if(event.key==='Escape' && lightbox.classList.contains('open'))closeLightbox();
  });
});
