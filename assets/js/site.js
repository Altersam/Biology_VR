
document.addEventListener('DOMContentLoaded',()=>{
  const q=document.querySelector('#presetSearch');
  const cat=document.querySelector('#presetCategory');
  const cards=[...document.querySelectorAll('[data-preset-card]')];
  const filter=()=>{
    if(!cards.length)return;
    const text=(q?.value||'').trim().toLowerCase();
    const c=cat?.value||'all';
    cards.forEach(el=>{
      const okText=!text || el.dataset.search.includes(text);
      const okCat=c==='all' || el.dataset.category===c;
      el.style.display=(okText&&okCat)?'':'none';
    });
  };
  q?.addEventListener('input',filter); cat?.addEventListener('change',filter);
});
