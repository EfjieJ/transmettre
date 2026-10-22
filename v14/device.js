/* Appareils complets : les pièces s'allument une à une, dans l'ordre où la force voyage. */
(function(){
  var reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
  [].forEach.call(document.querySelectorAll('.device'),function(f){
    var steps=JSON.parse(f.getAttribute('data-steps')),parts=f.querySelectorAll('.dp'),out=f.querySelector('.dev-step'),n=f.querySelector('.dev-n'),i=0,timer=null,vis=false;
    function show(k){i=(k+steps.length)%steps.length;
      [].forEach.call(parts,function(p){p.classList.toggle('on',+p.getAttribute('data-i')===i)});
      out.innerHTML='<b>'+(i+1)+'. '+steps[i][0]+'</b> : '+steps[i][1];n.textContent=(i+1)+' / '+steps.length;}
    function stop(){clearInterval(timer);timer=null}
    function go(){if(reduce||timer)return;timer=setInterval(function(){show(i+1)},2600)}
    f.querySelector('.dev-prev').addEventListener('click',function(){stop();show(i-1)});
    f.querySelector('.dev-next').addEventListener('click',function(){stop();show(i+1)});
    show(0);
    if('IntersectionObserver' in window){new IntersectionObserver(function(es){es.forEach(function(e){vis=e.isIntersecting;vis?go():stop()})},{threshold:.5}).observe(f)}
  });
})();
