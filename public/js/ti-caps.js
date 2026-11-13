/* Carrousel des captures d'installation : une image à la fois, flèches ← →, compteur. */
(function(){
  document.querySelectorAll('.ti-caps').forEach(function(box){
    var figs=box.querySelectorAll('.ti-cap'); if(figs.length<2) return;
    figs.forEach(function(f){var im=f.querySelector('img');if(im){im.loading='eager';im.addEventListener('load',function(){maj()})}});
    var track=document.createElement('div'); track.className='ti-track';
    figs.forEach(function(f){track.appendChild(f)}); box.appendChild(track);
    function btn(cls,lab,txt){var b=document.createElement('button');b.type='button';b.className='ti-nav '+cls;b.setAttribute('aria-label',lab);b.innerHTML='<span aria-hidden="true">'+txt+'</span>';box.appendChild(b);return b}
    var prev=btn('ti-prev','Image précédente','‹'), next=btn('ti-next ti-pulse','Image suivante','›');
    var cpt=document.createElement('p'); cpt.className='ti-count'; cpt.setAttribute('aria-live','polite'); box.appendChild(cpt);
    box.classList.add('ti-caps--carrousel');
    function idx(){return Math.round(track.scrollLeft/track.clientWidth)}
    function maj(){var i=idx();prev.disabled=i<=0;next.disabled=i>=figs.length-1;cpt.textContent=(i+1)+' / '+figs.length;track.style.height=figs[Math.min(i,figs.length-1)].offsetHeight+'px'}
    function aller(d){next.classList.remove('ti-pulse');track.scrollTo({left:(idx()+d)*track.clientWidth,behavior:'smooth'})}
    prev.addEventListener('click',function(){aller(-1)}); next.addEventListener('click',function(){aller(1)});
    var t;track.addEventListener('scroll',function(){clearTimeout(t);t=setTimeout(function(){if(idx()>0)next.classList.remove('ti-pulse');maj()},80)},{passive:true});
    window.addEventListener('resize',maj); maj();
  });
})();
