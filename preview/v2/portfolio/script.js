(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const thumb = (id, kind) => `thumbs/${id}-${kind}.jpg`;

  /* ---------- Intro preview selector (manual only) ---------- */
  const tabs = $("#viewerTabs");
  const stage = {
    desk: $("#viewerDesk"), mob: $("#viewerMob"), status: $("#viewerStatus"),
    name: $("#viewerName"), premise: $("#viewerPremise"), link: $("#viewerLink"),
  };
  const viewerItems = [...SELECTED, WORKFLOWS[0]].map(p => ({
    id: p.id, name: p.name, status: p.status,
    premise: p.premise || `${p.task}: ${p.note}`,
    href: p.links ? p.links[0].href : p.href,
    label: p.links ? p.links[0].label : "Try workflow",
  }));

  viewerItems.forEach((p, i) => {
    const b = document.createElement("button");
    b.type = "button";
    b.setAttribute("role", "tab");
    b.id = `vt-${p.id}`;
    b.textContent = p.name.replace(" Adventure Co.", "").replace(" Builders", "").replace(" Care", "").replace(" Goods", "").replace(/^The /, "").replace(" Record", "");
    b.setAttribute("aria-selected", "false");
    b.tabIndex = -1;
    b.addEventListener("click", () => select(i, false));
    tabs.appendChild(b);
  });

  function select(i, focus) {
    const p = viewerItems[i];
    [...tabs.children].forEach((b, j) => {
      b.setAttribute("aria-selected", String(j === i));
      b.tabIndex = j === i ? 0 : -1;
    });
    if (focus) tabs.children[i].focus();
    stage.desk.src = thumb(p.id, "d");
    stage.desk.alt = `${p.name}, desktop view`;
    stage.mob.src = thumb(p.id, "m");
    stage.mob.alt = `${p.name}, mobile view`;
    stage.status.textContent = STATUS_LABEL[p.status];
    stage.name.textContent = p.name;
    stage.premise.textContent = p.premise;
    stage.link.textContent = p.label;
    stage.link.href = p.href;
    $("#viewerStage").setAttribute("aria-labelledby", `vt-${p.id}`);
  }
  tabs.addEventListener("keydown", e => {
    const cur = [...tabs.children].findIndex(b => b.getAttribute("aria-selected") === "true");
    let n = null;
    if (e.key === "ArrowRight") n = (cur + 1) % viewerItems.length;
    if (e.key === "ArrowLeft") n = (cur - 1 + viewerItems.length) % viewerItems.length;
    if (e.key === "Home") n = 0;
    if (e.key === "End") n = viewerItems.length - 1;
    if (n !== null) { e.preventDefault(); select(n, true); }
  });
  select(0, false);

  /* ---------- Selected concepts ---------- */
  $("#conceptList").innerHTML = SELECTED.map((p, i) => `
    <article class="concept ${i % 2 ? "concept-flip" : ""}" aria-labelledby="c-${p.id}">
      <div class="concept-media">
        <img class="shot-d" src="${thumb(p.id, "d")}" alt="${esc(p.name)} — desktop first screen" width="1200" height="750" loading="lazy">
        <img class="shot-m" src="${thumb(p.id, "m")}" alt="${esc(p.name)} — mobile first screen" width="468" height="1013" loading="lazy">
      </div>
      <div class="concept-body">
        <p class="concept-meta"><span class="status status-concept">${STATUS_LABEL[p.status]}</span><span>${INDUSTRIES[p.industry]}</span></p>
        <h3 id="c-${p.id}">${esc(p.name)}</h3>
        <p class="premise">${esc(p.premise)}</p>
        <p class="caps">${p.caps.map(c => CAPABILITIES[c]).join(" · ")}</p>
        <ul class="dest">${p.links.map(l => `<li><a class="text-link" href="${l.href}">${esc(l.label)}</a></li>`).join("")}</ul>
      </div>
    </article>`).join("");

  /* ---------- Workflows ---------- */
  $("#workflowList").innerHTML = WORKFLOWS.map(w => `
    <li class="workflow">
      <div class="workflow-head">
        <span class="status status-concept">${STATUS_LABEL[w.status]}</span>
        <h3>${esc(w.name)}</h3>
        <p class="workflow-task">${esc(w.task)}</p>
      </div>
      <ol class="steps">${w.steps.map(s => `<li>${esc(s)}</li>`).join("")}</ol>
      <p class="workflow-note">${esc(w.note)}</p>
      <a class="text-link" href="${w.href}">Try workflow</a>
    </li>`).join("");

  /* ---------- Library ---------- */
  const search = $("#libSearch"), ind = $("#libIndustry"), cap = $("#libCap");
  const list = $("#libList"), empty = $("#libEmpty"), count = $("#libCount");

  const countBy = (key, val) => LIBRARY.filter(it => key === "industry" ? it.industry === val : it.caps.includes(val)).length;
  ind.innerHTML = `<option value="">All industries</option>` +
    Object.entries(INDUSTRIES).map(([k, v]) => `<option value="${k}">${v} (${countBy("industry", k)})</option>`).join("");
  cap.innerHTML = `<option value="">All capabilities</option>` +
    Object.entries(CAPABILITIES).map(([k, v]) => `<option value="${k}">${v} (${countBy("cap", k)})</option>`).join("");

  // Shareable state via query string
  const params = new URLSearchParams(location.search);
  search.value = params.get("q") || "";
  if (INDUSTRIES[params.get("industry")]) ind.value = params.get("industry");
  if (CAPABILITIES[params.get("cap")]) cap.value = params.get("cap");

  function render() {
    const q = search.value.trim().toLowerCase();
    const items = LIBRARY.filter(it => {
      if (ind.value && it.industry !== ind.value) return false;
      if (cap.value && !it.caps.includes(cap.value)) return false;
      if (!q) return true;
      const hay = [it.name, INDUSTRIES[it.industry], ...it.caps.map(c => CAPABILITIES[c]), it.tags || "",
        ...(it.variants || []).map(v => v[0])].join(" ").toLowerCase();
      return hay.includes(q);
    }).sort((a, b) => a.name.localeCompare(b.name));

    list.innerHTML = items.map(it => `
      <li class="lib-row">
        <a class="lib-name" href="${it.href}">${esc(it.name)}</a>
        <span class="lib-ind">${INDUSTRIES[it.industry]}</span>
        <span class="lib-caps">${it.caps.map(c => CAPABILITIES[c]).join(", ")}</span>
        ${it.variants ? `<details class="lib-var"><summary>${it.variants.length} views</summary><ul>${it.variants.map(v => `<li><a href="${v[1]}">${esc(v[0])}</a></li>`).join("")}</ul></details>` : `<span></span>`}
      </li>`).join("");

    empty.hidden = items.length > 0;
    list.hidden = items.length === 0;
    count.textContent = `${items.length} of ${LIBRARY.length} projects`;

    const p = new URLSearchParams();
    if (q) p.set("q", search.value.trim());
    if (ind.value) p.set("industry", ind.value);
    if (cap.value) p.set("cap", cap.value);
    const qs = p.toString();
    history.replaceState(null, "", location.pathname + (qs ? "?" + qs : "") + location.hash);
  }

  function reset() { search.value = ""; ind.value = ""; cap.value = ""; render(); search.focus(); }
  search.addEventListener("input", render);
  ind.addEventListener("change", render);
  cap.addEventListener("change", render);
  $("#libReset").addEventListener("click", reset);
  $("#libEmptyReset").addEventListener("click", reset);
  render();
})();
