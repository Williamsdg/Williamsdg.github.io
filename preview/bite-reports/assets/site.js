/* The Bite Reports concept — shared behaviour */
(function(){
  var nav=document.querySelector('.nav'), b=document.querySelector('.burger');
  if(b){b.addEventListener('click',function(){var o=nav.classList.toggle('open');b.setAttribute('aria-expanded',o);});}
})();

/* ---- 14-day board, generated from the real sample report ---- */
window.BiteBoard=(function(){
  var MON={Aug:8,Sep:9};
  var DOW=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  function daysOf(when){
    // every "Thu Aug 27" / "Sep 2" in the string
    var out=[],re=/(?:Sun|Mon|Tue|Wed|Thu|Fri|Sat)?\s*(Aug|Sep)\s+(\d{1,2})/g,m;
    while((m=re.exec(when))) out.push(MON[m[1]]*100+parseInt(m[2],10));
    // "Mon Aug 31 into Tue Sep 1" / "Thu Sep 3 – Fri Sep 4": fill the span
    if(out.length===2&&/into|–|-/.test(when)){var a=out[0],b=out[1],s=[],k=a;while(k!==b&&s.length<6){s.push(k);k=next(k);}s.push(b);return s;}
    return out;
  }
  function next(k){var mo=Math.floor(k/100),d=k%100;var dim=mo===8?31:30;return d>=dim?(mo+1)*100+1:mo*100+d+1;}
  function build(data,regionIdx){
    // Aug 23 → Sep 7 (16 days, two rows of 8? no — 7-col calendar, Sun–Sat, starting Sun Aug 23)
    var days=[],k=823;for(var i=0;i<16;i++){days.push({k:k,dow:DOW[i%7],n:k%100,mo:Math.floor(k/100)});k=next(k);}
    var map={};days.forEach(function(d){map[d.k]=d;});
    ['week1','week2'].forEach(function(w){
      var r=data[w].regions[regionIdx];if(!r)return;
      (r.best||[]).forEach(function(b){daysOf(b.when).forEach(function(k){var d=map[k];if(!d)return;d.go=true;d.stars=Math.max(d.stars||0,b.stars);d.t=d.t||shortWhen(b.when);});});
      (r.avoid||[]).forEach(function(a){daysOf(a.when).forEach(function(k){var d=map[k];if(!d)return;d.skip=true;d.partial=/\d:\d\d/.test(a.when)&&!/all day/.test(a.when);d.st=shortWhen(a.when);});});
    });
    map[823].elapsed=true;map[906].nodata=true;map[907].nodata=true;
    return days;
  }
  function shortWhen(w){
    var m=w.match(/,\s*(.+)$/);var s=m?m[1]:'';
    s=s.replace(/^Around\s+/,'').replace(/into .+$/,'').replace(/–/g,'–');
    if(/^\d/.test(s)||/dawn|light|dark|day/i.test(s))return s;return '';
  }
  function render(el,data,regionIdx){
    var days=build(data,regionIdx);
    var html='';
    [[0,7,'Week 1 · this week','High confidence · inside the reliable forecast window'],[7,16,'Week 2 · next week','Lower confidence · early outlook, expect this to shift']].forEach(function(seg){
      html+='<div class="week"><div class="week-label"><b>'+seg[2]+'</b><span>'+seg[3]+'</span></div><div class="days">';
      days.slice(seg[0],seg[1]).forEach(function(d){
        var cls='day',txt='',stars='';
        if(d.elapsed){cls+=' off';txt='report day';}
        else if(d.nodata){cls+=' off';txt='no data yet';}
        else if(d.go&&d.skip){cls+=' part';txt=d.t+' · skip '+d.st;}
        else if(d.go){cls+=' go';txt=d.t||'go';}
        else if(d.skip){cls+=(d.partial?' part':' skip');txt=d.partial?'skip '+d.st:'stay home';}
        else{txt='no call';}
        if(d.go&&d.stars)stars='<span class="stars" aria-label="'+d.stars+' of 4 stars">'+'★'.repeat(d.stars)+'</span>';
        var label=d.dow+' '+(d.mo===8?'Aug':'Sep')+' '+d.n+(d.go?', best window':d.skip?', day to avoid':'');
        html+='<div class="'+cls+'" role="img" aria-label="'+label+'">'+stars+'<span class="d">'+d.dow+'</span><span class="n">'+d.n+'</span><span class="t">'+txt+'</span></div>';
      });
      html+='</div></div>';
    });
    el.innerHTML=html;
  }
  return {render:render};
})();

/* ---- Pricing picker (real prices from thebitereports.com/pricing) ---- */
window.BitePricing=function(root){
  var boxes=root.querySelectorAll('input[type=checkbox]'),amt=root.querySelector('.amt'),desc=root.querySelector('.desc'),plans=document.querySelectorAll('.plan');
  function upd(){
    var n=0;boxes.forEach(function(b){if(b.checked)n++;});
    var p,txt,pick;
    if(n===0){p='—';txt='Pick at least one state to see your price.';pick=-1;}
    else if(n===1){p='$7.99';txt='One state, a fresh two-week outlook every week.';pick=0;}
    else if(n===2){p='$12.99';txt='Two states on one plan.';pick=1;}
    else{p='$19.99';txt=n===6?'Every state we cover.':'Three or more states — the all-states plan covers them.';pick=2;}
    amt.innerHTML=p+(n?'<small>/mo</small>':'');desc.textContent=txt;
    plans.forEach(function(pl,i){pl.classList.toggle('pick',i===pick);});
  }
  boxes.forEach(function(b){b.addEventListener('change',upd);});
  var all=root.querySelector('.select-all');if(all)all.addEventListener('click',function(e){e.preventDefault();boxes.forEach(function(b){b.checked=true;});upd();});
  upd();
};
