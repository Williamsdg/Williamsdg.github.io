/* Weedon Island Preserve concept — Williams Digital */
(function(){
  "use strict";
  var TZ = "America/New_York";
  var LAT = 27.8636, LNG = -82.6116;          // Cultural & Natural History Center
  var TIDE_STATION = "8726607";               // NOAA Old Port Tampa, ~3 mi across Old Tampa Bay

  /* ---------- menu ---------- */
  var btn = document.querySelector(".menu-btn"), nav = document.getElementById("nav");
  if (btn && nav) {
    btn.addEventListener("click", function(){
      var open = nav.classList.toggle("open");
      btn.setAttribute("aria-expanded", open ? "true" : "false");
    });
    document.addEventListener("keydown", function(e){
      if (e.key === "Escape" && nav.classList.contains("open")) { nav.classList.remove("open"); btn.setAttribute("aria-expanded","false"); btn.focus(); }
    });
  }

  /* ---------- time helpers (always Eastern, whatever the visitor's clock) ---------- */
  function nyParts(d){
    var f = new Intl.DateTimeFormat("en-US",{timeZone:TZ,year:"numeric",month:"numeric",day:"numeric",hour:"numeric",minute:"numeric",weekday:"short",hourCycle:"h23"});
    var o = {}; f.formatToParts(d).forEach(function(p){ o[p.type]=p.value; });
    return {y:+o.year,m:+o.month,d:+o.day,h:+o.hour,min:+o.minute,wd:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].indexOf(o.weekday)};
  }
  function fmtTime(d){ return new Intl.DateTimeFormat("en-US",{timeZone:TZ,hour:"numeric",minute:"2-digit"}).format(d).replace("AM","a.m.").replace("PM","p.m."); }
  function fmtDay(d){ return new Intl.DateTimeFormat("en-US",{timeZone:TZ,weekday:"long",month:"long",day:"numeric"}).format(d); }
  function sent(t){ return /\.$/.test(t.replace(/<[^>]+>/g,"")) ? t : t+"."; }
  function hm(h,m){ var ap = h>=12?"p.m.":"a.m."; var hh=h%12||12; return hh+(m?":"+String(m).padStart(2,"0"):"")+" "+ap; }

  /* NOAA solar calculation: minutes after midnight UTC of sunset for a civil date */
  function sunsetUTC(y,m,d){
    var start = Date.UTC(y,0,1), day = Math.floor((Date.UTC(y,m-1,d)-start)/864e5)+1;
    var g = 2*Math.PI/365*(day-1);
    var eq = 229.18*(0.000075+0.001868*Math.cos(g)-0.032077*Math.sin(g)-0.014615*Math.cos(2*g)-0.040849*Math.sin(2*g));
    var decl = 0.006918-0.399912*Math.cos(g)+0.070257*Math.sin(g)-0.006758*Math.cos(2*g)+0.000907*Math.sin(2*g)-0.002697*Math.cos(3*g)+0.00148*Math.sin(3*g);
    var lat = LAT*Math.PI/180;
    var ha = Math.acos(Math.cos(90.833*Math.PI/180)/(Math.cos(lat)*Math.cos(decl))-Math.tan(lat)*Math.tan(decl))*180/Math.PI;
    var mins = 720-4*(LNG-ha)-eq;
    return new Date(Date.UTC(y,m-1,d)+mins*6e4);
  }
  function closingTime(p){
    var s = sunsetUTC(p.y,p.m,p.d);
    var c = new Date(s.getTime()-15*6e4);
    c.setUTCMinutes(Math.floor(c.getUTCMinutes()/5)*5,0,0);   // round down to 5 min, like a posted sign
    return {sunset:s, close:c};
  }
  function dayAfterThanksgiving(y){ var d=new Date(Date.UTC(y,10,1)); var wd=d.getUTCDay(); var first=1+((4-wd+7)%7); return first+21+1; }
  function preserveClosedAllDay(p){ return (p.m===12&&p.d===25) || (p.m===11&&p.d===dayAfterThanksgiving(p.y)); }

  var CENTER = {0:[11,16],4:[9,16],5:[9,16],6:[9,16]};   // Sun, Thu, Fri, Sat
  var DAYNAME = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

  function renderBoard(){
    var el = document.querySelector("[data-board]"); if (!el) return;
    var now = new Date(), p = nyParts(now), mNow = p.h*60+p.min;
    var t = closingTime(p), cp = nyParts(t.close), mClose = cp.h*60+cp.min;
    el.querySelector("[data-today]").textContent = fmtDay(now);

    // preserve
    var ps = el.querySelector("[data-preserve]");
    var st, what, det;
    if (preserveClosedAllDay(p)) { st=["Closed","st-closed"]; what="Closed today"; det="The preserve closes the day after Thanksgiving and on December 25."; }
    else if (mNow < 7*60) { st=["Opens 7 a.m.","st-closed"]; what="Opens at 7 a.m."; det="Today it closes about <strong>"+fmtTime(t.close)+"</strong>, 15 minutes before sunset."; }
    else if (mNow < mClose) { st=["Open now","st-open"]; what="Open until about "+fmtTime(t.close); det="That's 15 minutes before sunset at "+fmtTime(t.sunset)+" The exact time is posted at the entrance."; }
    else { var tp = nyParts(new Date(now.getTime()+864e5)), tt = closingTime(tp); st=["Closed now","st-closed"]; what="Closed for the night"; det="Opens tomorrow at 7 a.m. and closes about <strong>"+fmtTime(tt.close)+"</strong>"; }
    ps.innerHTML = '<span class="status '+st[1]+'">'+st[0]+'</span><div><div class="board-what">Preserve, trails &amp; boardwalks</div><div class="board-detail">'+sent(what)+' '+sent(det)+'</div></div>';

    // center
    var cs = el.querySelector("[data-center]");
    var hrs = CENTER[p.wd], cst, cdet;
    if (hrs && mNow >= hrs[0]*60 && mNow < hrs[1]*60) { cst=["Open now","st-open"]; cdet="Open until 4 p.m. today. Free admission, donations welcome."; }
    else {
      var nextTxt="";
      for (var i=0;i<8;i++){ var wd=(p.wd+i)%7, h=CENTER[wd]; if(!h) continue; if(i===0 && mNow>=h[0]*60) continue; nextTxt = (i===0?"today":i===1?"tomorrow":DAYNAME[wd])+" at "+hm(h[0],0); break; }
      cst=["Closed now","st-closed"]; cdet=sent("Opens "+nextTxt)+" Hours are Thursday to Saturday 9 a.m. to 4 p.m. and Sunday 11 a.m. to 4 p.m.";
    }
    cs.innerHTML = '<span class="status '+cst[1]+'">'+cst[0]+'</span><div><div class="board-what">Cultural &amp; Natural History Center</div><div class="board-detail">'+cdet+'</div></div>';
  }

  /* ---------- tides ---------- */
  function ymd(p){ return p.y+String(p.m).padStart(2,"0")+String(p.d).padStart(2,"0"); }
  function tideURL(begin, days, interval){
    return "https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?product=predictions&application=WeedonConcept&datum=MLLW&units=english&time_zone=lst_ldt&format=json&station="+TIDE_STATION+"&begin_date="+begin+"&range="+(days*24)+"&interval="+interval;
  }
  function getJSON(u){ return fetch(u).then(function(r){ if(!r.ok) throw new Error(r.status); return r.json(); }).catch(function(){ return new Promise(function(res){setTimeout(res,1500);}).then(function(){ return fetch(u).then(function(r){ if(!r.ok) throw new Error(r.status); return r.json(); }); }); }); }
  function parseNOAA(s){ var a=s.split(/[- :]/); return {y:+a[0],m:+a[1],d:+a[2],h:+a[3],min:+a[4]}; }
  function tideLabel(t){ return t.type==="H"?"High":"Low"; }
  function loadTides(){
    var spots = document.querySelectorAll("[data-tide]"); var chart = document.querySelector("[data-tide-chart]");
    if (!spots.length && !chart) return;
    var p = nyParts(new Date()), begin = ymd(p), mNow = p.h*60+p.min;
    getJSON(tideURL(begin,2,"hilo")).then(function(j){
      var list = (j.predictions||[]).map(function(x){ var q=parseNOAA(x.t); return {q:q,v:+x.v,type:x.type,today:q.d===p.d}; });
      var next = list.filter(function(x){ return !x.today || x.q.h*60+x.q.min > mNow; });
      spots.forEach(function(el){
        if (!next.length) throw new Error("no tides");
        var a = next[0], b = next[1];
        el.innerHTML = '<span class="status st-info">Tides</span><div><div class="board-what">Next '+tideLabel(a).toLowerCase()+' tide '+(a.today?"":"tomorrow ")+hm(a.q.h,a.q.min)+'</div><div class="board-detail">'+sent('Then '+tideLabel(b).toLowerCase()+' at '+hm(b.q.h,b.q.min))+' The paddling trail is easiest at mid to high tide. NOAA prediction for Old Port Tampa, across the bay.</div></div>';
      });
      var ul = document.querySelector("[data-tide-list]");
      if (ul) ul.innerHTML = list.filter(function(x){return x.today;}).map(function(x){ return "<li>"+tideLabel(x)+" "+hm(x.q.h,x.q.min)+' <span>'+x.v.toFixed(1)+" ft</span></li>"; }).join("");
    }).catch(function(){
      spots.forEach(function(el){ el.innerHTML = '<span class="status st-info">Tides</span><div><div class="board-what">Check the tide before you paddle</div><div class="board-detail">The trail is easiest at mid to high tide. <a href="https://tidesandcurrents.noaa.gov/noaatidepredictions.html?id='+TIDE_STATION+'">See today\'s NOAA tide table</a>.</div></div>'; });
    });
    if (chart) {
      getJSON(tideURL(begin,1,"30")).then(function(j){
        var pts = (j.predictions||[]).map(function(x){ var q=parseNOAA(x.t); return {x:q.h*60+q.min, v:+x.v}; }).filter(function(o){return o.x<=1440;});
        if (pts.length < 10) throw new Error("short");
        var W=720,H=220,P=34, vmax=Math.max.apply(null,pts.map(function(o){return o.v;}))+0.3, vmin=Math.min(0,Math.min.apply(null,pts.map(function(o){return o.v;}))-0.2);
        function X(m){ return P+(W-2*P)*m/1440; } function Y(v){ return H-P-(H-2*P)*(v-vmin)/(vmax-vmin); }
        var d = pts.map(function(o,i){ return (i?"L":"M")+X(o.x).toFixed(1)+" "+Y(o.v).toFixed(1); }).join(" ");
        var area = d+" L"+X(pts[pts.length-1].x).toFixed(1)+" "+(H-P)+" L"+X(pts[0].x).toFixed(1)+" "+(H-P)+" Z";
        var ticks = [0,360,720,1080,1440].map(function(m){ var lab=m===0||m===1440?"12 a.m.":m===720?"Noon":m===360?"6 a.m.":"6 p.m."; return '<line x1="'+X(m)+'" x2="'+X(m)+'" y1="'+P+'" y2="'+(H-P)+'" stroke="#CBD9CF" stroke-dasharray="3 4"/><text x="'+X(m)+'" y="'+(H-10)+'" text-anchor="middle" font-size="13" fill="#3F4470">'+lab+'</text>'; }).join("");
        var nowLine = '<line x1="'+X(mNow)+'" x2="'+X(mNow)+'" y1="'+(P-8)+'" y2="'+(H-P)+'" stroke="#854D3A" stroke-width="2.5"/><text x="'+X(mNow)+'" y="'+(P-12)+'" text-anchor="middle" font-size="13" font-weight="700" fill="#854D3A">Now</text>';
        chart.innerHTML = '<svg viewBox="0 0 '+W+' '+H+'" role="img" aria-label="Predicted tide height through today at Old Port Tampa"><path d="'+area+'" fill="#E3EEF9"/><path d="'+d+'" fill="none" stroke="#1F2467" stroke-width="3"/>'+ticks+nowLine+'</svg>';
      }).catch(function(){ chart.innerHTML = '<p class="tide-note">Today\'s tide chart could not load. <a href="https://tidesandcurrents.noaa.gov/noaatidepredictions.html?id='+TIDE_STATION+'">Open the NOAA tide table</a>.</p>'; });
    }
  }

  /* ---------- events ---------- */
  var EV = window.WI_EVENTS || [];
  var MON = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  function todayKey(){ var p=nyParts(new Date()); return p.y*10000+p.m*100+p.d; }
  function evKey(e){ var a=e.date.split("-"); return +a[0]*10000+ +a[1]*100+ +a[2]; }
  function dateBlock(e){ var a=e.date.split("-"); var wd=new Date(Date.UTC(+a[0],+a[1]-1,+a[2])).getUTCDay(); return '<div class="ev-date" aria-hidden="true"><span>'+MON[+a[1]-1]+'</span><b>'+(+a[2])+'</b></div>'; }
  function longDate(e){ var a=e.date.split("-"); var d=new Date(Date.UTC(+a[0],+a[1]-1,+a[2],12)); return new Intl.DateTimeFormat("en-US",{timeZone:"UTC",weekday:"long",month:"long",day:"numeric"}).format(d); }
  function actions(e, small){
    var s = small?" btn-sm":"";
    var reg = e.url ? '<a class="btn btn-clay'+s+'" href="'+e.url+'">'+(e.cta||"Register")+'<span class="sr"> for '+e.title+'</span></a>' : '<span class="tag" style="margin:0;align-self:center">'+(e.cta||"Drop in")+'</span>';
    return reg+'<button type="button" class="btn btn-ghost'+s+'" data-ics="'+e.id+'">Add to calendar<span class="sr"> for '+e.title+'</span></button>';
  }
  function renderStrip(){
    var el = document.querySelector("[data-ev-strip]"); if (!el) return;
    var t = todayKey(), up = EV.filter(function(e){return evKey(e)>=t;}).slice(0,4);
    if (!up.length) { el.outerHTML = '<p class="empty">New programs are posted at the start of each month. <a href="events.html">See the seasonal tours</a>.</p>'; return; }
    el.innerHTML = up.map(function(e){
      return '<article class="ev"><div class="ev-when">'+dateBlock(e)+'<div class="ev-time"><b>'+longDate(e).split(",")[0]+'</b><br>'+e.time+'</div></div><span class="tag">'+e.kind+'</span><h3>'+e.title+'</h3><p>'+e.short+'</p><div class="ev-act">'+actions(e,true)+'</div></article>';
    }).join("");
  }
  function renderList(){
    var el = document.querySelector("[data-ev-list]"); if (!el) return;
    var past = document.querySelector("[data-ev-past]");
    var chips = document.querySelectorAll("[data-filter]");
    var kind = "All";
    function draw(){
      var t = todayKey();
      var sel = EV.filter(function(e){ return kind==="All" || e.kind===kind; });
      var up = sel.filter(function(e){return evKey(e)>=t;}), old = sel.filter(function(e){return evKey(e)<t;});
      function row(e,isPast){ return '<article class="ev-row'+(isPast?" ev-past":"")+'">'+dateBlock(e)+'<div><span class="tag">'+e.kind+'</span><h3>'+e.title+'</h3><div class="ev-meta">'+longDate(e)+', '+e.time+'</div><p>'+e.desc+'</p></div><div class="ev-act">'+(isPast?'<span class="tag" style="margin:0">Already happened</span>':actions(e,false))+'</div></article>'; }
      el.innerHTML = up.length ? up.map(function(e){return row(e,false);}).join("") : '<p class="empty">Nothing else in this category this month. Try another filter, or see the seasonal tours below.</p>';
      if (past) { past.querySelector("[data-ev-past-list]").innerHTML = old.map(function(e){return row(e,true);}).join(""); past.hidden = !old.length; past.querySelector("summary").textContent = "Earlier this month ("+old.length+")"; }
      var live = document.querySelector("[data-ev-count]"); if (live) live.textContent = up.length+" upcoming "+(up.length===1?"program":"programs")+(kind==="All"?"":" in "+kind);
    }
    chips.forEach(function(c){ c.addEventListener("click", function(){ kind=c.getAttribute("data-filter"); chips.forEach(function(x){x.setAttribute("aria-pressed", x===c?"true":"false");}); draw(); }); });
    draw();
  }
  function icsFor(e){
    function pad(n){return String(n).padStart(2,"0");}
    var a=e.date.split("-"), s=e.start.split(":"), en=e.end.split(":");
    var ds=a[0]+a[1]+a[2];
    var esc=function(t){return t.replace(/([,;\\])/g,"\\$1").replace(/\n/g,"\\n");};
    return ["BEGIN:VCALENDAR","VERSION:2.0","PRODID:-//Weedon Island Preserve//Concept//EN","BEGIN:VEVENT",
      "UID:"+e.id+"@weedonislandpreserve.org","DTSTAMP:"+new Date().toISOString().replace(/[-:]/g,"").split(".")[0]+"Z",
      "DTSTART;TZID=America/New_York:"+ds+"T"+pad(s[0])+pad(s[1])+"00","DTEND;TZID=America/New_York:"+ds+"T"+pad(en[0])+pad(en[1])+"00",
      "SUMMARY:"+esc(e.title),"LOCATION:"+esc("Weedon Island Preserve Cultural and Natural History Center, 1800 Weedon Drive NE, St. Petersburg, FL 33702"),
      "DESCRIPTION:"+esc(e.short+(e.url?"\nRegister: "+e.url:"")),"END:VEVENT","END:VCALENDAR"].join("\r\n");
  }
  document.addEventListener("click", function(ev){
    var b = ev.target.closest("[data-ics]"); if (!b) return;
    var e = EV.filter(function(x){return x.id===b.getAttribute("data-ics");})[0]; if (!e) return;
    var url = URL.createObjectURL(new Blob([icsFor(e)],{type:"text/calendar"}));
    var a = document.createElement("a"); a.href=url; a.download=e.id+".ics"; document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function(){URL.revokeObjectURL(url);},1500);
    var old = b.innerHTML; b.textContent = "Calendar file downloaded"; setTimeout(function(){ b.innerHTML = old; }, 2200);
  });

  /* ---------- what to bring (remembered per visitor) ---------- */
  var KEY="wi-bring";
  var saved={}; try{ saved=JSON.parse(localStorage.getItem(KEY)||"{}"); }catch(e){}
  document.querySelectorAll(".bring input").forEach(function(i){
    if (saved[i.value]) i.checked = true;
    i.addEventListener("change", function(){ saved[i.value]=i.checked; try{ localStorage.setItem(KEY, JSON.stringify(saved)); }catch(e){} });
  });

  renderBoard(); setInterval(renderBoard, 60000);
  loadTides(); renderStrip(); renderList();
})();
