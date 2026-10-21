// Brain Studio: plain JS, no build step. Hash routes: #/, #/scripts, #/script/<slug>/<tab>, ...
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const fmt = (n) => (n ?? 0).toLocaleString();
const main = () => $("#main");
const state = { cfg: null, voices: null, account: null };

async function api(path, opts = {}) {
  const init = { method: opts.method || (opts.body ? "POST" : "GET"), headers: {} };
  if (opts.body !== undefined) { init.body = JSON.stringify(opts.body); init.headers["Content-Type"] = "application/json"; }
  const r = await fetch("/api/" + path, init);
  const data = await r.json().catch(() => ({}));
  if (!r.ok) { const e = new Error(data.error || r.statusText); e.data = data; throw e; }
  return data;
}

function toast(msg, err = false) {
  const t = $("#toast");
  t.textContent = msg; t.className = "toast" + (err ? " err" : ""); t.hidden = false;
  clearTimeout(toast._t); toast._t = setTimeout(() => (t.hidden = true), err ? 6000 : 2600);
}

async function busy(btn, fn) {
  const label = btn.innerHTML; btn.disabled = true; btn.innerHTML = `<span class="spin"></span> ${label}`;
  try { return await fn(); } catch (e) { toast(e.message, true); } finally { btn.disabled = false; btn.innerHTML = label; }
}

function md(text) {
  if (window.marked) return `<div class="md">${marked.parse(text || "")}</div>`;
  return `<pre class="md">${esc(text)}</pre>`;
}

const pill = (s) => `<span class="pill ${esc(s)}">${esc(s)}</span>`;
const tagHTML = (t) => esc(t).replace(/\[([^\]]+)\]/g, '<span class="t">[$1]</span>');

async function cfg(force) { if (!state.cfg || force) state.cfg = await api("config"); return state.cfg; }

async function refreshCredit() {
  const el = $("#credit");
  try {
    const c = await cfg();
    if (!c.has_key) { el.innerHTML = `<a href="#/voice">Add ElevenLabs key →</a>`; return; }
    const a = await api("eleven/account");
    if (a.unavailable) { state.account = null; el.innerHTML = `ElevenLabs<b>Key connected</b><span>${esc(a.unavailable)}</span>`; return; }
    state.account = a;
    const pct = a.limit ? Math.round((a.remaining / a.limit) * 100) : 0;
    el.innerHTML = `ElevenLabs credits<b>${fmt(a.remaining)}</b><span>of ${fmt(a.limit)}${a.resets ? ` · resets ${esc(a.resets)}` : ""}</span><div class="bar"><i style="width:${pct}%"></i></div>`;
  } catch (e) { el.innerHTML = `<span class="muted">${esc(e.message)}</span>`; }
}

async function pollJobsBadge() {
  try {
    const jobs = await api("jobs");
    const n = jobs.filter((j) => j.status === "running").length;
    const b = $("#jobcount"); b.hidden = !n; b.textContent = n;
  } catch {}
}
setInterval(pollJobsBadge, 4000);

// ---------- router ----------
const routes = { "": home, scripts, script, topics, voice, library, performance, brain, jobs };
async function router() {
  const [name = "", ...args] = location.hash.replace(/^#\/?/, "").split("/").map(decodeURIComponent);
  const r = name === "script" ? "scripts" : name || "home";
  $$("#nav a").forEach((a) => a.classList.toggle("on", a.dataset.r === r));
  clearInterval(router._poll);
  try { await (routes[name] || home)(...args); } catch (e) { main().innerHTML = `<div class="card"><b>Something went wrong</b><p class="muted">${esc(e.message)}</p></div>`; }
}
window.addEventListener("hashchange", router);

// ---------- home ----------
async function home() {
  const [o, list] = await Promise.all([api("overview"), api("scripts")]);
  const s = o.by_status;
  main().innerHTML = `
    <div class="head"><div><h1>Studio</h1><p class="muted">Write, voice and render scripts for @f___a___c___t___s.</p></div></div>
    <div class="grid g4">
      <div class="card stat"><b>${o.scripts}</b><span>scripts · ${s.drafted || 0} drafted, ${s.approved || 0} approved</span></div>
      <div class="card stat"><b>${(s.rendered || 0) + (s.posted || 0)}</b><span>rendered or posted</span></div>
      <div class="card stat"><b>${o.open_topics}</b><span>open topics in the bank</span></div>
      <div class="card stat"><b>${fmt(o.spend.credits)}</b><span>credits spent on ${o.spend.takes} takes</span></div>
    </div>
    <div class="grid g2" style="margin-top:14px">
      <div class="card">
        <h2>Write something</h2>
        <p class="muted small">Runs Claude Code on this repo (the full AGENTS.md workflow). Watch it on the Jobs page.</p>
        <div class="row"><input id="topic" class="grow" placeholder="A topic, or a topic-bank id like T02"></div>
        <div class="row" style="margin-top:8px">
          <button class="primary" id="w-script">Write script</button>
          <button id="w-make">Script + video</button>
          <button id="w-ideas">10 new ideas</button>
        </div>
      </div>
      <div class="card">
        <h2>Next up</h2>
        ${nextUp(list, o)}
      </div>
    </div>
    <div class="card" style="margin-top:14px"><h2>Recent scripts</h2>${scriptTable(list.slice(0, 6))}</div>`;
  const go = (kind) => async (ev) => {
    const arg = $("#topic").value.trim();
    if (kind !== "ideas" && !arg) return toast("Type a topic first.", true);
    await busy(ev.currentTarget, async () => { const j = await api("write", { body: { kind, arg: kind === "ideas" ? "10" : arg } }); location.hash = `#/jobs/${j.id}`; });
  };
  $("#w-script").onclick = go("script"); $("#w-make").onclick = go("make"); $("#w-ideas").onclick = go("ideas");
  bindRows();
}

function nextUp(list, o) {
  const items = [];
  if (!o.has_key) items.push(`<a href="#/voice">Add your ElevenLabs API key</a> to generate voices here.`);
  else if (!o.voice) items.push(`<a href="#/voice">Pick the narrator voice</a> so takes use it by default.`);
  const noVoice = list.filter((x) => x.status !== "dropped" && !x.video.voice);
  const approved = list.filter((x) => x.status === "approved" && !x.video.mp4);
  if (approved.length) items.push(`${approved.length} approved script${approved.length > 1 ? "s" : ""} waiting for a video, e.g. <a href="#/script/${approved[0].slug}/video">${esc(approved[0].title)}</a>.`);
  if (noVoice.length) items.push(`${noVoice.length} scripts have no narration yet. Start with <a href="#/script/${noVoice[0].slug}/voice">${esc(noVoice[0].title)}</a>.`);
  const drafted = list.filter((x) => x.status === "drafted");
  if (drafted.length) items.push(`${drafted.length} drafts to review and approve.`);
  if (o.requested_assets) items.push(`${o.requested_assets} props are waiting to be built (<a href="#/library">library</a>).`);
  return items.length ? `<ul style="margin:0;padding-left:18px">${items.map((i) => `<li style="margin-bottom:6px">${i}</li>`).join("")}</ul>` : `<p class="muted">All caught up.</p>`;
}

// ---------- scripts ----------
function scriptTable(list) {
  if (!list.length) return `<div class="empty">No scripts yet.</div>`;
  return `<table><thead><tr><th>Title</th><th>Status</th><th class="hide-sm">Format</th><th>Length</th><th>Check</th><th title="voice · timed · coded · rendered">Pipeline</th></tr></thead><tbody>
  ${list.map((x) => `<tr class="click" data-href="#/script/${x.slug}">
    <td><b>${esc(x.title)}</b><div class="muted small">${esc(x.slug.slice(0, 10))}${x.takes ? ` · ${x.takes} take${x.takes > 1 ? "s" : ""}` : ""}</div></td>
    <td>${pill(x.status)}</td><td class="hide-sm">${esc((x.fields.format || "").split(" ")[0])}</td>
    <td>${x.words ?? "?"}w · ${x.seconds ?? "?"}s</td><td>${pill(x.check)}</td>
    <td><div class="dots">${[x.video.voice, x.video.timed, x.video.coded, x.video.mp4].map((v) => `<i class="dot ${v ? "on" : ""}"></i>`).join("")}</div></td></tr>`).join("")}
  </tbody></table>`;
}
function bindRows() { $$("tr[data-href]").forEach((tr) => (tr.onclick = () => (location.hash = tr.dataset.href))); }

async function scripts() {
  const list = await api("scripts");
  const st = (await cfg()).statuses;
  const filter = sessionStorage.getItem("sf") || "all";
  const shown = filter === "all" ? list : list.filter((x) => x.status === filter);
  main().innerHTML = `
    <div class="head"><div><h1>Scripts</h1><p class="muted">${list.length} in <code>scripts/</code></p></div>
      <div class="row"><select id="sf">${["all", ...st].map((s) => `<option ${s === filter ? "selected" : ""}>${s}</option>`).join("")}</select>
      <button id="batch">Write a batch of 5</button></div></div>
    <div class="card">${scriptTable(shown)}</div>`;
  $("#sf").onchange = (e) => { sessionStorage.setItem("sf", e.target.value); scripts(); };
  $("#batch").onclick = (ev) => busy(ev.currentTarget, async () => { const j = await api("write", { body: { kind: "batch", arg: "5" } }); location.hash = `#/jobs/${j.id}`; });
  bindRows();
}

async function script(slug, tab = "voice") {
  const d = await api(`scripts/${slug}`);
  const c = await cfg();
  const tabs = [["script", "Script"], ["voice", "Voice"], ["storyboard", "Storyboard"], ["package", "Package"], ["checks", `Checks ${d.fails.length ? `<span class="pill fail">${d.fails.length}</span>` : d.warns.length ? `<span class="pill warn">${d.warns.length}</span>` : ""}`], ["video", "Video"]];
  main().innerHTML = `
    <div class="head">
      <div><a href="#/scripts" class="small">← Scripts</a><h1>${esc(d.title)}</h1>
        <div class="row small muted">${esc(d.fields.format || "")} · ${d.words} words ≈ ${d.seconds}s · Hook ${esc(d.fields["hook code"] || "?")} · Ending ${esc(d.fields["ending code"] || "?")}</div>
        <div class="small muted" style="margin-top:4px"><b>A vs B:</b> ${esc(d.fields["a vs b"] || "")}</div></div>
      <div class="row"><select id="status">${c.statuses.map((s) => `<option ${s === d.status ? "selected" : ""}>${s}</option>`).join("")}</select>
        <button id="revise">Revise with Claude</button></div>
    </div>
    <div class="tabs">${tabs.map(([k, l]) => `<button data-t="${k}" class="${k === tab ? "on" : ""}">${l}</button>`).join("")}</div>
    <div id="pane"></div>`;
  $$(".tabs button").forEach((b) => (b.onclick = () => (location.hash = `#/script/${slug}/${b.dataset.t}`)));
  $("#status").onchange = async (e) => { try { await api(`scripts/${slug}/status`, { body: { status: e.target.value } }); toast(`Marked ${e.target.value}`); } catch (er) { toast(er.message, true); } };
  $("#revise").onclick = async (ev) => {
    const note = prompt("What should change? (e.g. punchier hook, swap the study, cut 20 words)");
    if (note) await busy(ev.currentTarget, async () => { const j = await api(`scripts/${slug}/run`, { body: { action: "revise", note } }); location.hash = `#/jobs/${j.id}`; });
  };
  const pane = $("#pane");
  ({ script: paneScript, voice: paneVoice, storyboard: paneBoard, package: panePackage, checks: paneChecks, video: paneVideo }[tab] || paneVoice)(pane, d, slug);
}

function paneScript(pane, d) {
  pane.innerHTML = `<div class="grid g2"><div>${d.beats.map((b, i) => `<div class="beat"><div class="n">Beat ${i + 1}</div>${b.map((l) => `<p>${esc(l)}</p>`).join("")}</div>`).join("")}</div>
    <div class="card"><h2>ElevenLabs version</h2><div class="tagged">${tagHTML(d.tagged)}</div><div class="row" style="margin-top:10px"><button id="copy">Copy for ElevenLabs</button></div></div></div>`;
  $("#copy").onclick = () => navigator.clipboard.writeText(d.tagged).then(() => toast("Copied"));
}

async function paneVoice(pane, d, slug) {
  const c = await cfg();
  const e = c.elevenlabs;
  const models = Object.entries(e.models || {});
  const pref = JSON.parse(localStorage.getItem("voicePrefs") || "{}");
  const model = pref.model || e.draft_model || e.model;
  const vs = { ...(e.voice_settings || {}), ...(pref.settings || {}) };
  pane.innerHTML = `
    <div class="grid g2">
      <div class="card">
        <div class="row"><h2 class="grow" style="margin:0">ElevenLabs text</h2><button class="sm" id="copy">Copy</button><button class="sm primary" id="save" disabled>Save</button></div>
        <p class="muted small">Same words as the SCRIPT, tags at the turns. Click a tag to insert it at the cursor. Select some text and hit <b>Test selection</b> to hear just that bit cheaply.</p>
        <textarea id="tx" rows="12">${esc(d.tagged)}</textarea>
        <div class="palette" style="margin-top:8px">${(e.tags || []).map((t) => `<button data-tag="${esc(t)}">[${esc(t)}]</button>`).join("")}</div>
        <div id="tagcheck" style="margin-top:10px"></div>
      </div>
      <div class="card">
        <h2>Generate</h2>
        <div class="grid g2">
          <label class="field">Voice<select id="voice"><option value="${esc(e.voice_id || "")}">${esc(e.voice_name || (e.voice_id ? e.voice_id : "Pick on the Voice page"))}</option></select></label>
          <label class="field">Model<select id="model">${models.map(([id, m]) => `<option value="${id}" ${id === model ? "selected" : ""}>${esc(m.label)}</option>`).join("")}</select></label>
          <label class="field">Stability <span id="stv">${vs.stability ?? 0.5}</span><input type="range" id="stab" min="0" max="1" step="0.05" value="${vs.stability ?? 0.5}"></label>
          <label class="field">Similarity <span id="siv">${vs.similarity_boost ?? 0.75}</span><input type="range" id="sim" min="0" max="1" step="0.05" value="${vs.similarity_boost ?? 0.75}"></label>
        </div>
        <h3>Cost of this take</h3><div class="cost" id="cost"></div>
        <div class="row" style="margin-top:12px">
          <button class="primary" id="gen">Generate full take</button>
          <button id="test">Test selection</button>
          <span class="muted small" id="bal"></span>
        </div>
        <p class="muted small" style="margin-top:8px">Tip: draft on Turbo (half the credits), then do the final on v4. An identical take is never paid for twice.</p>
      </div>
    </div>
    <div class="card" style="margin-top:14px"><div class="row"><h2 class="grow" style="margin:0">Takes</h2><span class="muted small">"Use" makes it the video's narration and times the storyboard to it.</span></div><div id="takes"></div></div>`;

  const tx = $("#tx");
  let saved = d.tagged;
  const settings = () => ({ stability: +$("#stab").value, similarity_boost: +$("#sim").value, use_speaker_boost: true });
  const remember = () => localStorage.setItem("voicePrefs", JSON.stringify({ model: $("#model").value, settings: settings() }));
  const selected = () => tx.value.slice(tx.selectionStart, tx.selectionEnd).trim();
  const words = (s) => (s.replace(/\[[^\]]*\]/g, " ").toLowerCase().replace(/’/g, "'").match(/[a-z0-9$']+/g) || []).join(" ");
  const scriptWords = words(d.beats.flat().join(" "));

  function renderCost() {
    const text = selected() || tx.value;
    const m = $("#model").value;
    $("#cost").innerHTML = models.map(([id, mm]) => {
      const credits = Math.round(text.length * mm.credits_per_char);
      return `<div class="${id === m ? "sel" : ""}"><span class="small muted">${esc(mm.label.split(" (")[0])}</span><b>${fmt(credits)} credits</b><span class="small muted">${fmt(text.length)} chars · $${((text.length / 1000) * mm.usd_per_1k).toFixed(3)} API</span></div>`;
    }).join("");
    const a = state.account;
    const need = Math.round(text.length * (e.models[m]?.credits_per_char ?? 1));
    $("#bal").innerHTML = a ? (need > a.remaining ? `<span style="color:var(--bad)">Not enough credits (${fmt(a.remaining)} left)</span>` : `${fmt(a.remaining)} left after: ${fmt(a.remaining - need)}`) : "";
    $("#test").disabled = !selected();
  }
  function renderCheck() {
    const same = words(tx.value) === scriptWords;
    const n = (tx.value.match(/\[[^\]]+\]/g) || []).length;
    $("#tagcheck").innerHTML = same
      ? `<div class="row small"><span class="pill pass">words match</span><span class="muted">${n} tags</span></div>`
      : `<div class="issue fail">The words no longer match the SCRIPT. Only add or move tags here; change words in the script itself.</div>`;
    $("#save").disabled = tx.value === saved;
  }
  tx.oninput = () => { renderCheck(); renderCost(); };
  ["select", "keyup", "mouseup"].forEach((ev) => tx.addEventListener(ev, renderCost));
  $$(".palette button").forEach((b) => (b.onclick = () => {
    const s = tx.selectionStart, ins = `[${b.dataset.tag}] `;
    tx.value = tx.value.slice(0, s) + ins + tx.value.slice(s); tx.focus(); tx.selectionStart = tx.selectionEnd = s + ins.length; tx.oninput();
  }));
  $("#copy").onclick = () => navigator.clipboard.writeText(tx.value).then(() => toast("Copied"));
  $("#save").onclick = (ev) => busy(ev.currentTarget, async () => {
    const r = await api(`scripts/${slug}/tags`, { method: "PUT", body: { text: tx.value } });
    saved = tx.value.replace(/\s+/g, " ").trim(); tx.value = saved; renderCheck();
    toast(r.fails.length ? `Saved, but the checker fails: ${r.fails[0]}` : "Saved", !!r.fails.length);
  });
  $("#stab").oninput = (ev) => { $("#stv").textContent = ev.target.value; remember(); };
  $("#sim").oninput = (ev) => { $("#siv").textContent = ev.target.value; remember(); };
  $("#model").onchange = () => { remember(); renderCost(); };

  // Fill the voice list without blocking the pane.
  if (c.has_key) loadVoices().then((vs2) => {
    if (!vs2) return;
    const sel = $("#voice"); if (!sel) return;
    sel.innerHTML = vs2.map((v) => `<option value="${v.id}" ${v.id === e.voice_id ? "selected" : ""}>${esc(v.name)}</option>`).join("") || sel.innerHTML;
  });

  async function generate(ev, partial) {
    if (tx.value !== saved && !partial) return toast("Save the text first, so the take matches the file.", true);
    if (!c.has_key) return (location.hash = "#/voice");
    const voiceSel = $("#voice");
    const body = { model: $("#model").value, settings: settings(), voice_id: voiceSel.value, voice_name: voiceSel.selectedOptions[0]?.textContent };
    if (partial) body.text = selected();
    await busy(ev.currentTarget, async () => {
      let r = await api(`scripts/${slug}/takes`, { body });
      if (r.cached) {
        if (!confirm("You already have a take with exactly this text, voice, model and settings (free to replay). Pay for another take anyway?")) { toast("Kept the existing take"); return loadTakes(); }
        r = await api(`scripts/${slug}/takes`, { body: { ...body, force: true } });
      }
      toast(`New take · ${fmt(r.take.credits)} credits`);
      loadTakes(); refreshCredit().then(renderCost);
    });
  }
  $("#gen").onclick = (ev) => generate(ev, false);
  $("#test").onclick = (ev) => generate(ev, true);

  async function loadTakes() {
    const takes = await api(`scripts/${slug}/takes`);
    $("#takes").innerHTML = takes.length ? takes.map((t) => `
      <div class="take ${t.used ? "used" : ""}">
        <div><div class="row small"><b>${t.starred ? "★ " : ""}${t.partial ? "Test" : "Full take"}</b><span class="muted">${esc(t.voice_name)} · ${esc((e.models[t.model]?.label || t.model).split(" (")[0])} · stab ${t.settings?.stability ?? "?"} · ${fmt(t.credits)} credits · ${esc(t.created)}</span>${t.used ? pill("in use") : ""}</div>
          ${t.partial ? `<div class="small muted" style="margin:4px 0">“${esc(t.text.slice(0, 140))}${t.text.length > 140 ? "…" : ""}”</div>` : ""}
          <audio controls preload="none" src="${t.url}"></audio></div>
        <div class="row">${t.partial ? "" : `<button class="sm ${t.used ? "" : "primary"}" data-use="${t.id}">${t.used ? "Re-time" : "Use"}</button>`}
          <button class="sm ghost" data-star="${t.id}" data-v="${t.starred ? "" : "1"}" title="Star">${t.starred ? "★" : "☆"}</button>
          <a class="btn sm ghost" href="${t.url}" download="${slug}-${t.id}.mp3" title="Download">↓</a>
          <button class="sm ghost danger" data-del="${t.id}" title="Delete">✕</button></div>
      </div>`).join("") : `<div class="empty">No takes yet. Generate one above.</div>`;
    $$("[data-use]").forEach((b) => (b.onclick = (ev) => busy(ev.currentTarget, async () => {
      const r = await api(`scripts/${slug}/takes/${b.dataset.use}/use`, { body: {} });
      toast(r.ok ? "Narration set and storyboard timed" : "Set, but align reported problems (see Video tab)", !r.ok);
      sessionStorage.setItem(`align-${slug}`, r.output); loadTakes();
    })));
    $$("[data-star]").forEach((b) => (b.onclick = async () => { await api(`scripts/${slug}/takes/${b.dataset.star}`, { body: { starred: !!b.dataset.v } }); loadTakes(); }));
    $$("[data-del]").forEach((b) => (b.onclick = async () => { if (confirm("Delete this take? The credits are already spent.")) { await api(`scripts/${slug}/takes/${b.dataset.del}`, { method: "DELETE" }); loadTakes(); } }));
  }
  renderCheck(); renderCost(); loadTakes();
}

async function loadVoices() {
  if (state.voices) return state.voices;
  try { state.voices = await api("eleven/voices"); } catch (e) { state.voiceError = e.message; }
  return state.voices;
}

function paneBoard(pane, d) {
  const b = d.board;
  if (!b) { pane.innerHTML = `<div class="empty">No storyboard JSON.</div>`; return; }
  const lines = d.beats.flat();
  pane.innerHTML = `
    <div class="card"><h2>Metaphor</h2><p>${esc(b.concept?.metaphor)}</p><p class="muted">${esc(b.concept?.why)}</p></div>
    <div class="card" style="margin-top:14px"><h2>${b.shots.length} shots</h2>
    ${b.shots.map((s) => `<div class="shot"><div class="num">${s.id}</div><div>
      <div class="row"><b>${esc(s.title)}</b>${s.screenshot ? pill("screenshot") : ""}<span class="muted small">${esc(s.camera)} · in: ${esc(s.transition_in)}</span></div>
      <div class="lines">${(s.lines ? lines.slice(s.lines[0] - 1, s.lines[1]) : []).map(esc).join(" ")}</div>
      <div>${esc(s.what_we_see)}</div>
      ${(s.cues || []).length ? `<div class="small" style="margin-top:6px">${s.cues.map((q) => `<div>on “<b>${esc(q.word)}</b>” ${esc(q.what)}</div>`).join("")}</div>` : ""}
      <div class="chips">${(s.cast || []).map((x) => `<span class="chip">${esc(x)}</span>`).join("")}${(s.uses || []).map((x) => `<span class="chip">${esc(x)}</span>`).join("")}${(s.new || []).map((x) => `<span class="chip new">new: ${esc(x)}</span>`).join("")}${(s.on_screen || []).map((x) => `<span class="chip">${esc(x.type)}${x.text ? `: ${esc(x.text)}` : ""}</span>`).join("")}</div>
    </div></div>`).join("")}</div>
    ${(b.new_assets || []).length ? `<div class="card" style="margin-top:14px"><h2>New assets</h2>${b.new_assets.map((a) => `<p><b>${esc(a.name || a.id)}</b> <span class="chip">${esc(a.kind)}</span><br><span class="muted">${esc(a.description)}</span></p>`).join("")}</div>` : ""}`;
}

function panePackage(pane, d) {
  const s = d.sections;
  pane.innerHTML = `<div class="grid g2">
    <div class="card"><h2>Titles</h2>${md(s["TITLE / COVER OPTIONS"])}<h2 style="margin-top:16px">Hooks</h2>${md(s["HOOK OPTIONS"])}</div>
    <div class="card"><div class="row"><h2 class="grow" style="margin:0">Caption</h2><button class="sm" id="copycap">Copy</button></div>${md(s["CAPTION"])}</div></div>
    <div class="card" style="margin-top:14px"><h2>Fact sheet</h2>${md(s["FACT SHEET & SOURCES"])}</div>`;
  $("#copycap").onclick = () => navigator.clipboard.writeText(s["CAPTION"]).then(() => toast("Caption copied"));
}

function paneChecks(pane, d, slug) {
  pane.innerHTML = `<div class="card">
    <div class="row"><h2 class="grow" style="margin:0">tools/check_script.py</h2>${pill(d.check)}</div>
    <p class="muted small">${d.stats.words} words ≈ ${d.stats.seconds}s, ${d.stats.lines} lines.</p>
    ${d.fails.map((f) => `<div class="issue fail">✗ ${esc(f)}</div>`).join("")}${d.warns.map((w) => `<div class="issue warn">! ${esc(w)}</div>`).join("")}
    ${!d.fails.length && !d.warns.length ? `<p>Everything a machine can check passes. The rest is the read-aloud test.</p>` : ""}
    <div class="row" style="margin-top:12px"><button id="lib">Register new props in the library</button></div></div>`;
  $("#lib").onclick = (ev) => busy(ev.currentTarget, async () => { const j = await api(`scripts/${slug}/run`, { body: { action: "library" } }); location.hash = `#/jobs/${j.id}`; });
}

function paneVideo(pane, d, slug) {
  const v = d.video;
  const align = sessionStorage.getItem(`align-${slug}`);
  const step = (done, title, text, btn) => `<div class="row" style="padding:10px 0;border-bottom:1px solid var(--line)"><i class="dot ${done ? "on" : ""}"></i><div class="grow"><b>${title}</b><div class="muted small">${text}</div></div>${btn || ""}</div>`;
  pane.innerHTML = `<div class="grid g2">
    <div class="card"><h2>Pipeline</h2>
      ${step(v.voice, "1. Narration", v.voice ? `<audio controls preload="none" src="${v.voice}" style="height:30px;margin-top:4px"></audio>` : "Pick a take on the Voice tab (or use the free placeholder voice).", v.voice ? "" : `<button class="sm" data-run="prep" data-ph="1">Placeholder voice</button>`)}
      ${step(v.timed, "2. Timing", "Storyboard cues timed to the spoken words (tools/align.py).", `<button class="sm" data-run="prep">Prep</button>`)}
      ${step(v.coded, "3. Shots coded", "Claude writes the Remotion shots with the kit (/video).", `<button class="sm ${v.coded ? "" : "primary"}" data-run="video">${v.coded ? "Redo with Claude" : "Make video with Claude"}</button>`)}
      ${step(v.sheets.length, "4. Stills", "Contact sheets to review before rendering.", `<button class="sm" data-run="stills" ${v.coded ? "" : "disabled"}>Stills</button>`)}
      ${step(v.mp4, "5. Render", "The post-ready MP4 at -14 LUFS.", `<button class="sm ${v.coded ? "primary" : ""}" data-run="render" ${v.coded ? "" : "disabled"}>Render</button>`)}
      ${align ? `<h3>Last align</h3><pre class="log">${esc(align)}</pre>` : ""}
    </div>
    <div class="card"><h2>Video</h2>${v.mp4 ? `<video controls src="${v.mp4}"></video><div class="row" style="margin-top:8px"><a class="btn sm" href="${v.mp4}" download>Download MP4</a></div>` : `<div class="empty">Not rendered yet.</div>`}
      ${v.sheets.length ? `<h3>Contact sheets</h3><div class="grid g2 sheets">${v.sheets.map((s) => `<a href="${s}" target="_blank"><img src="${s}" loading="lazy"></a>`).join("")}</div>` : ""}</div></div>`;
  $$("[data-run]").forEach((b) => (b.onclick = (ev) => busy(ev.currentTarget, async () => {
    const j = await api(`scripts/${slug}/run`, { body: { action: b.dataset.run, placeholder: !!b.dataset.ph } });
    location.hash = `#/jobs/${j.id}`;
  })));
}

// ---------- topics ----------
async function topics() {
  const list = await api("topics");
  const show = sessionStorage.getItem("tf") || "open";
  const shown = show === "all" ? list : list.filter((t) => t.status === show);
  const groups = [...new Set(shown.map((t) => t.group))];
  main().innerHTML = `
    <div class="head"><div><h1>Topics</h1><p class="muted">${list.filter((t) => t.status === "open").length} open of ${list.length} in <code>topics/topic-bank.md</code></p></div>
      <div class="row"><select id="tf">${["open", "drafted", "posted", "dropped", "all"].map((s) => `<option ${s === show ? "selected" : ""}>${s}</option>`).join("")}</select><button id="ideas">Generate 10 ideas</button></div></div>
    ${groups.map((g) => `<div class="card" style="margin-bottom:14px"><h2>${esc(g)}</h2><table><thead><tr><th>#</th><th>Topic</th><th class="hide-sm">A vs B</th><th>Format</th><th></th></tr></thead><tbody>
      ${shown.filter((t) => t.group === g).map((t) => `<tr><td class="muted">${t.id}</td><td><b>${esc(t.title)}</b> ${t.status !== "open" ? pill(t.status) : ""}<div class="muted small">${esc(t.situation)}</div><div class="small" style="margin-top:3px">“${esc(t.hook)}”</div></td>
      <td class="hide-sm small">${esc(t.avb)}</td><td>${esc(t.format)}</td><td><div class="row"><button class="sm primary" data-w="${t.id}">Write</button><button class="sm" data-m="${t.id}" title="Script, then video">+ video</button></div></td></tr>`).join("")}
    </tbody></table></div>`).join("") || `<div class="empty card">Nothing here.</div>`}`;
  $("#tf").onchange = (e) => { sessionStorage.setItem("tf", e.target.value); topics(); };
  const run = (kind, arg) => async (ev) => busy(ev.currentTarget, async () => { const j = await api("write", { body: { kind, arg } }); location.hash = `#/jobs/${j.id}`; });
  $("#ideas").onclick = run("ideas", "10");
  $$("[data-w]").forEach((b) => (b.onclick = run("script", b.dataset.w)));
  $$("[data-m]").forEach((b) => (b.onclick = run("make", b.dataset.m)));
}

// ---------- voice ----------
async function voice() {
  const c = await cfg(true);
  const e = c.elevenlabs;
  main().innerHTML = `
    <div class="head"><div><h1>Voice</h1><p class="muted">ElevenLabs account, the narrator voice, and a lab for trying tags.</p></div></div>
    <div class="grid g2">
      <div class="card"><h2>API key</h2>
        <p class="muted small">Stored in <code>.env</code> in this repo (gitignored) and only sent to ElevenLabs. Create one at elevenlabs.io → Developers → API keys. Give it Text to Speech, Voices (read) and User (read) access.</p>
        <div class="row"><input type="password" id="key" class="grow" placeholder="${c.has_key ? "Key saved. Paste a new one to replace it." : "sk_…"}" autocomplete="off"><button class="primary" id="savekey">Save</button>${c.has_key ? `<button class="danger" id="rmkey">Remove</button>` : ""}</div>
        <div id="acct" style="margin-top:12px"></div></div>
      <div class="card"><h2>Defaults</h2>
        <div class="grid g2">
          <label class="field">Final model<select id="m-final">${Object.entries(e.models).map(([id, m]) => `<option value="${id}" ${id === e.model ? "selected" : ""}>${esc(m.label)}</option>`).join("")}</select></label>
          <label class="field">Draft model<select id="m-draft">${Object.entries(e.models).map(([id, m]) => `<option value="${id}" ${id === e.draft_model ? "selected" : ""}>${esc(m.label)}</option>`).join("")}</select></label>
          <label class="field">Stability <span id="d-stv">${e.voice_settings.stability}</span><input type="range" id="d-stab" min="0" max="1" step="0.05" value="${e.voice_settings.stability}"></label>
          <label class="field">Similarity <span id="d-siv">${e.voice_settings.similarity_boost}</span><input type="range" id="d-sim" min="0" max="1" step="0.05" value="${e.voice_settings.similarity_boost}"></label>
        </div>
        <p class="muted small">Narrator: <b>${esc(e.voice_name || "none yet")}</b>. Saved in <code>config.json</code>, so <code>tools/voice.py --engine elevenlabs</code> uses it too.</p>
        <button id="savedef">Save defaults</button></div>
    </div>
    <div class="grid g2" style="margin-top:14px">
      <div class="card"><div class="row"><h2 class="grow" style="margin:0">Voices</h2><input id="vq" placeholder="Filter" style="width:140px"></div><div id="voices" style="max-height:520px;overflow:auto;margin-top:8px"></div></div>
      <div class="card"><h2>Tag lab</h2><p class="muted small">Try a line with tags before spending on a full take. Uses the draft model.</p>
        <textarea id="lab" rows="4">[thoughtful] You're thinking, he'll think I'm a loser. [chuckles] He's praying someone like you saves him.</textarea>
        <div class="row" style="margin-top:8px"><button class="primary" id="labgo">Generate</button><span class="muted small" id="labcost"></span></div>
        <div id="labtakes" style="margin-top:10px"></div></div>
    </div>`;
  const bindRange = (id, out) => ($(id).oninput = (ev) => ($(out).textContent = ev.target.value));
  bindRange("#d-stab", "#d-stv"); bindRange("#d-sim", "#d-siv");
  $("#savekey").onclick = (ev) => busy(ev.currentTarget, async () => { const k = $("#key").value.trim(); if (!k) return toast("Paste a key first", true); await api("eleven/key", { body: { key: k } }); state.voices = null; await cfg(true); toast("Key saved"); refreshCredit(); voice(); });
  if ($("#rmkey")) $("#rmkey").onclick = async () => { if (confirm("Remove the saved key from .env?")) { await api("eleven/key", { body: { key: "" } }); await cfg(true); refreshCredit(); voice(); } };
  $("#savedef").onclick = (ev) => busy(ev.currentTarget, async () => {
    await api("eleven/settings", { body: { model: $("#m-final").value, draft_model: $("#m-draft").value, voice_settings: { stability: +$("#d-stab").value, similarity_boost: +$("#d-sim").value, use_speaker_boost: true } } });
    localStorage.removeItem("voicePrefs"); await cfg(true); toast("Defaults saved");
  });
  const labCost = () => { const m = e.models[e.draft_model] || {}; const n = $("#lab").value.length; $("#labcost").textContent = `${fmt(Math.round(n * (m.credits_per_char ?? 1)))} credits on ${(m.label || "").split(" (")[0]}`; };
  $("#lab").oninput = labCost; labCost();
  $("#labgo").onclick = (ev) => busy(ev.currentTarget, async () => {
    let r = await api("lab/takes", { body: { text: $("#lab").value } });
    if (r.cached && confirm("You already generated exactly this. Pay for another take?")) r = await api("lab/takes", { body: { text: $("#lab").value, force: true } });
    labTakes(); refreshCredit();
  });
  async function labTakes() {
    if (!c.has_key) return;
    const t = await api("lab/takes");
    $("#labtakes").innerHTML = t.slice(0, 8).map((x) => `<div class="take"><div><div class="small">${tagHTML(x.text.slice(0, 160))}</div><div class="muted small">${esc(x.voice_name)} · ${fmt(x.credits)} credits</div><audio controls preload="none" src="${x.url}"></audio></div><div><button class="sm ghost danger" data-ldel="${x.id}">✕</button></div></div>`).join("");
    $$("[data-ldel]").forEach((b) => (b.onclick = async () => { await api(`lab/takes/${b.dataset.ldel}`, { method: "DELETE" }); labTakes(); }));
  }
  if (!c.has_key) { $("#voices").innerHTML = `<div class="empty">Add your API key to see your voices.</div>`; return; }
  api("eleven/account").then((a) => {
    if (a.unavailable) { $("#acct").innerHTML = `<div class="issue warn">${esc(a.unavailable)}</div>`; return; }
    $("#acct").innerHTML = `<div class="grid g3"><div class="stat"><b>${fmt(a.remaining)}</b><span>credits left</span></div><div class="stat"><b>${fmt(a.used)}</b><span>used of ${fmt(a.limit)}</span></div><div class="stat"><b>${esc(a.tier || "?")}</b><span>${a.resets ? `resets ${esc(a.resets)}` : "plan"}</span></div></div>
    <p class="muted small">A ~950 character script costs about ${fmt(950)} credits on v4, ${fmt(475)} on v4 Turbo.</p>`;
  }).catch((er) => ($("#acct").innerHTML = `<div class="issue warn">${esc(er.message)}</div>`));
  const vs = await loadVoices() || [];
  const manual = `<div style="margin-top:10px"><p class="muted small">Or paste a voice ID (ElevenLabs → Voices → ⋯ → Copy voice ID).</p>
    <div class="row"><input id="mid" class="grow" placeholder="Voice ID" value="${esc(e.voice_id || "")}"><input id="mname" placeholder="Name, e.g. Archie" value="${esc(e.voice_name || "")}" style="width:150px"><button id="msave">Set narrator</button></div></div>`;
  const draw = () => {
    const q = $("#vq").value.toLowerCase();
    $("#voices").innerHTML = vs.filter((v) => !q || JSON.stringify(v).toLowerCase().includes(q)).map((v) => `
      <div class="voice ${v.id === e.voice_id ? "sel" : ""}"><div><b>${esc(v.name)}</b> <span class="muted small">${esc([v.labels.accent, v.labels.age, v.labels.gender, v.labels.use_case || v.labels.descriptive].filter(Boolean).join(" · "))}</span>
        ${v.preview ? `<audio controls preload="none" src="${esc(v.preview)}" style="height:28px;width:100%;margin-top:4px"></audio>` : ""}</div>
        <button class="sm ${v.id === e.voice_id ? "" : "primary"}" data-vid="${v.id}" data-vn="${esc(v.name)}">${v.id === e.voice_id ? "Narrator" : "Use"}</button></div>`).join("") || (state.voiceError ? `<div class="issue warn">${esc(state.voiceError.includes("voices_read") ? "Your API key can't list voices (it needs Voices → Read). You can still paste a voice ID below." : state.voiceError)}</div>` : `<div class="empty">No voices. Add some in ElevenLabs' Voice Library first.</div>`);
    $("#voices").insertAdjacentHTML("beforeend", manual);
    $("#msave").onclick = async () => { const id = $("#mid").value.trim(); if (!id) return toast("Paste a voice ID", true); const name = $("#mname").value.trim() || id; await api("eleven/settings", { body: { voice_id: id, voice_name: name } }); e.voice_id = id; e.voice_name = name; await cfg(true); toast(`${name} is the narrator`); draw(); };
    $$("[data-vid]").forEach((b) => (b.onclick = async () => { await api("eleven/settings", { body: { voice_id: b.dataset.vid, voice_name: b.dataset.vn } }); e.voice_id = b.dataset.vid; e.voice_name = b.dataset.vn; await cfg(true); toast(`${b.dataset.vn} is the narrator`); draw(); }));
  };
  $("#vq").oninput = draw; draw(); labTakes();
}

// ---------- library ----------
async function library() {
  const lib = await api("library");
  const kinds = [...new Set(lib.assets.map((a) => a.kind))];
  const f = JSON.parse(sessionStorage.getItem("lf") || '{"kind":"all","status":"all"}');
  const shown = lib.assets.filter((a) => (f.kind === "all" || a.kind === f.kind) && (f.status === "all" || a.status === f.status));
  const statuses = ["core", "requested", "built", "retired"];
  main().innerHTML = `
    <div class="head"><div><h1>Library</h1><p class="muted">${lib.assets.length} sets, props, effects and metaphors. ${lib.assets.filter((a) => a.status === "requested").length} waiting to be built.</p></div>
      <div class="row"><select id="lk">${["all", ...kinds].map((k) => `<option ${k === f.kind ? "selected" : ""}>${k}</option>`).join("")}</select>
      <select id="ls">${["all", ...statuses].map((k) => `<option ${k === f.status ? "selected" : ""}>${k}</option>`).join("")}</select></div></div>
    <div class="grid g3">${shown.map((a) => `<div class="card tight"><div class="row"><b class="grow">${esc(a.name)}</b><span class="chip">${esc(a.kind)}</span></div>
      <p class="small" style="margin:6px 0">${esc(a.description)}</p>${a.reuse ? `<p class="muted small" style="margin:0 0 6px">Reuse: ${esc(a.reuse)}</p>` : ""}
      <div class="row"><select class="sm" data-aid="${a.id}">${statuses.map((s) => `<option ${s === a.status ? "selected" : ""}>${s}</option>`).join("")}</select><span class="muted small">used in ${(a.used_in || []).length}</span></div></div>`).join("")}</div>`;
  const save = () => { sessionStorage.setItem("lf", JSON.stringify({ kind: $("#lk").value, status: $("#ls").value })); library(); };
  $("#lk").onchange = save; $("#ls").onchange = save;
  $$("[data-aid]").forEach((s) => (s.onchange = async () => { try { await api(`library/${s.dataset.aid}/status`, { body: { status: s.value } }); toast(`${s.dataset.aid} → ${s.value}`); } catch (e) { toast(e.message, true); } }));
}

// ---------- performance ----------
async function performance(handle) {
  const { accounts, ours } = await api("accounts");
  handle = handle || (accounts.includes(ours) ? ours : accounts[0]);
  const p = handle ? await api(`performance/${handle}`) : null;
  main().innerHTML = `
    <div class="head"><div><h1>Performance</h1><p class="muted">From Media Tools exports. Correlation, not cause.</p></div>
      <div class="row"><select id="acc">${accounts.map((a) => `<option ${a === handle ? "selected" : ""}>${a}</option>`).join("")}</select>${p ? `<button id="report">Rebuild report</button>` : ""}</div></div>
    <div class="card" style="margin-bottom:14px"><h2>Import an export</h2><p class="muted small">Runs /refresh with Claude: imports, labels new posts, rebuilds the tables and tells you what changed.</p>
      <div class="row"><input id="path" class="grow" placeholder="~/Downloads/Media Tools/Account Exports/…"><button class="primary" id="imp">Import</button></div></div>
    ${p ? `<div class="grid g4" style="margin-bottom:14px"><div class="card stat"><b>${p.rows.length}</b><span>posts</span></div><div class="card stat"><b>${fmt(Math.round(p.median))}</b><span>median views</span></div><div class="card stat"><b>${fmt(p.best)}</b><span>best</span></div><div class="card stat"><b>${p.untagged}</b><span>untagged</span></div></div>
    <div class="card"><table><thead><tr><th>Date</th><th>Post</th><th>Views</th><th class="hide-sm">Likes</th><th>Tier</th><th class="hide-sm">Fmt</th><th class="hide-sm">Hook</th></tr></thead><tbody>
      ${p.rows.map((r) => `<tr><td class="muted small">${esc(r.date)}</td><td><a href="${esc(r.url)}" target="_blank" rel="noopener">${esc(r.title.slice(0, 90))}${r.title.length > 90 ? "…" : ""}</a></td><td><b>${fmt(r.views)}</b></td><td class="hide-sm">${fmt(r.likes)}</td><td>${esc(r.tier)}</td><td class="hide-sm">${esc(r.format)}</td><td class="hide-sm">${esc(r.hook)}</td></tr>`).join("")}
    </tbody></table></div>` : `<div class="empty card">No exports imported yet.</div>`}`;
  $("#acc") && ($("#acc").onchange = (e) => (location.hash = `#/performance/${e.target.value}`));
  $("#report") && ($("#report").onclick = (ev) => busy(ev.currentTarget, async () => { const j = await api(`performance/${handle}/report`, { body: {} }); location.hash = `#/jobs/${j.id}`; }));
  $("#imp").onclick = (ev) => busy(ev.currentTarget, async () => { const j = await api("performance/import", { body: { path: $("#path").value } }); location.hash = `#/jobs/${j.id}`; });
}

// ---------- brain ----------
async function brain(...rest) {
  const list = await api("docs");
  const path = rest.join("/") || "AGENTS.md";
  const d = await api(`doc?path=${encodeURIComponent(path)}`);
  main().innerHTML = `<div class="head"><div><h1>Brain</h1><p class="muted">The rules and knowledge the writer follows. Edit them in your editor.</p></div></div>
    <div class="grid" style="grid-template-columns:230px 1fr"><div class="card tight">${list.map((x) => `<a class="list-item small ${x.path === path ? "on" : ""}" href="#/brain/${x.path}">${esc(x.name)}</a>`).join("")}</div>
    <div class="card">${md(d.text)}</div></div>`;
}

// ---------- jobs ----------
async function jobs(id) {
  const list = await api("jobs");
  id = id || list[0]?.id;
  main().innerHTML = `<div class="head"><div><h1>Jobs</h1><p class="muted">Commands and Claude runs started from here. They keep going if you leave this page (not if you stop the server).</p></div></div>
    ${list.length ? `<div class="grid" style="grid-template-columns:260px 1fr"><div class="card tight">${list.map((j) => `<a class="list-item ${j.id === id ? "on" : ""}" href="#/jobs/${j.id}"><div class="row"><span class="grow small"><b>${esc(j.title)}</b></span>${pill(j.status)}</div><div class="muted small">${new Date(j.started * 1000).toLocaleTimeString()}</div></a>`).join("")}</div>
    <div class="card"><div class="row"><h2 class="grow" id="jt" style="margin:0"></h2><button class="sm danger" id="stop" hidden>Stop</button></div><p class="muted small" id="jc" style="word-break:break-all"></p><pre class="log" id="log"></pre></div></div>` : `<div class="empty card">No jobs yet.</div>`}`;
  if (!id) return;
  let since = 0;
  const log = $("#log");
  const tick = async () => {
    const j = await api(`jobs/${id}?since=${since}`);
    $("#jt").textContent = j.title; $("#jc").textContent = j.cmd.length > 200 ? j.cmd.slice(0, 200) + "…" : j.cmd;
    const atBottom = log.scrollTop + log.clientHeight >= log.scrollHeight - 30;
    if (j.lines.length) { log.textContent += (since ? "\n" : "") + j.lines.join("\n"); since = j.total; if (atBottom) log.scrollTop = log.scrollHeight; }
    $("#stop").hidden = j.status !== "running";
    if (j.status !== "running") { clearInterval(router._poll); log.textContent += `\n\n[${j.status}${j.code != null ? `, exit ${j.code}` : ""}]`; pollJobsBadge(); }
    return j.status === "running";
  };
  $("#stop").onclick = async () => { await api(`jobs/${id}/stop`, { body: {} }); toast("Stopping"); };
  if (await tick()) router._poll = setInterval(tick, 1200);
}

refreshCredit();
pollJobsBadge();
router();
