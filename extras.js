/* extras.js — ميزات إضافية لمنصة ساري. حمّله بعد pronunciation.js
   1) لوحة الرئيسية: كلمة اليوم + هدف يومي + سلسلة الأيام + «تابع من حيث توقفت»
   2) بحث شامل (زر 🔍 أو Ctrl+K أو /)
   3) إخفاء الروماجي / الكانا / الترجمة لاختبار نفسك (اضغط على المخفي لإظهاره)
   4) تحديان جديدان: «عكسي» (عربي ← الكلمة) و«إملاء» (اكتب ما تسمع)
   5) اختصارات لوحة المفاتيح: 1-4 لاختيار الإجابة، Enter للتالي، Esc للإغلاق
   6) زر تثبيت التطبيق على الجهاز + إشعار صغير عند كسب النقاط */
document.addEventListener("DOMContentLoaded", () => {
const S = window.SARI; if (!S) return;
const $ = S.$, $$ = S.$$, store = S.store, esc = S.esc;
const lg = () => store.get("learnLang", "ja");
const td = () => new Date().toISOString().slice(0, 10);
const shuffle = a => { a = [...a]; for (let i = a.length - 1; i > 0; i--) { const j = Math.random() * (i + 1) | 0; [a[i], a[j]] = [a[j], a[i]] } return a };
const VOCAB = () => Object.values(S.LEVELS).flatMap(L => L.lessons.flatMap(l => l.vocab));
const say1 = v => String(v[1]).split(" / ")[0];
const isJa = () => lg() === "ja";
const PAGE_NAMES = { letters: "الحروف والنطق", curriculum: "مراحل التعلم", conversations: "المحادثات", quiz: "الاختبارات", diary: "المفكرة", bank: "بنك المفردات", kanji: "كانجي وكتابة", challenge: "التحديات", lab: "الجمل والقراءة", grammar: "القواعد", me: "تقدّمي", spot: "اكتشف الخطأ", pron: "النطق", langs: "اللغات", phrases: "عبارات سريعة" };

document.head.insertAdjacentHTML("beforeend", `<style>
.x-dash{display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:14px}
.x-dash .card{display:flex;flex-direction:column;gap:6px}
.x-wod{font-size:34px;font-weight:900;font-family:var(--jp);line-height:1.3;cursor:pointer}
.x-big{font-size:30px;font-weight:900;color:var(--primary)}
.x-goal button{padding:4px 10px;font-size:13px}
.x-toggles{display:flex;gap:14px;flex-wrap:wrap;font-size:14px;font-weight:700;margin:6px 0 4px}
.x-toggles label{display:flex;gap:6px;align-items:center;cursor:pointer}
body.x-hide-ro :is(.word-ro,.sent-ro),body.x-hide-ka :is(.word-kana,.sent-kana),body.x-hide-ar :is(.word-ar,.sent-ar){filter:blur(7px);transition:filter .2s;cursor:pointer}
body :is(.word-ro,.sent-ro,.word-kana,.sent-kana,.word-ar,.sent-ar).x-shown{filter:none!important}
#xSearch{position:fixed;inset:0;z-index:4000;background:rgba(0,0,0,.45);display:flex;align-items:flex-start;justify-content:center;padding:70px 16px 16px}
#xSearch .box{width:min(640px,100%);max-height:80vh;overflow:auto;margin:0}
#xSearch .x-res{display:flex;flex-direction:column;gap:8px;margin-top:10px}
#xToast{position:fixed;bottom:24px;left:50%;transform:translateX(-50%) translateY(30px);background:var(--text);color:var(--bg);padding:10px 20px;border-radius:14px;font-weight:800;opacity:0;transition:.35s;z-index:4500;pointer-events:none}
#xToast.show{opacity:1;transform:translateX(-50%)}
#xBox input{text-align:center;font-size:22px;font-family:var(--jp)}
.x-kbd{font-size:12px;color:var(--sub);margin-top:10px}
</style>`);

/* ===== إشعار صغير ===== */
document.body.insertAdjacentHTML("beforeend", `<div id="xToast"></div>`);
let tT; const toast = m => { const t = $("#xToast"); t.textContent = m; t.classList.add("show"); clearTimeout(tT); tT = setTimeout(() => t.classList.remove("show"), 2200) };
document.addEventListener("quizdone", e => setTimeout(() => { toast(`⭐ +${Math.round(e.detail / 2)} XP`); renderDash() }, 50));

/* ===== 1) لوحة الرئيسية ===== */
$("#home .hero").insertAdjacentHTML("afterend", `<section class="box"><h2>يومك في التعلّم ☀️</h2><div class="x-dash" id="xDash"></div></section>`);
function xpToday() {
  const xp = (store.get("stats", {}).xp) || 0; let d = store.get("xp_day", null);
  if (!d || d.d !== td()) { d = { d: td(), base: xp }; store.set("xp_day", d) }
  return Math.max(0, xp - d.base);
}
function streak() { const days = (store.get("stats", {}).days) || []; let n = 0; const d = new Date(); while (days.includes(d.toISOString().slice(0, 10))) { n++; d.setDate(d.getDate() - 1) } return n }
function renderDash() {
  const v = VOCAB(); if (!v.length) return;
  const day = Math.floor(Date.now() / 864e5), w = v[day % v.length];
  const goal = store.get("xp_goal", 50), got = xpToday(), pct = Math.min(100, Math.round(got / goal * 100));
  const last = store.get("last_page", "");
  $("#xDash").innerHTML = `
  <div class="card"><small>📅 كلمة اليوم — اضغط لسماعها</small><div class="x-wod" data-say="${esc(say1(w))}">${w[0]}</div>
    ${w[0] !== w[1] ? `<div class="word-kana">${w[1]}</div>` : ""}${w[2] ? `<div class="word-ro">${w[2]}</div>` : ""}<div class="word-ar">${w[3]}</div></div>
  <div class="card x-goal"><small>🎯 هدف اليوم</small><div class="x-big">${got} / ${goal} XP</div><div class="bar"><i style="width:${pct}%"></i></div>
    <small>${pct >= 100 ? "🏆 حققت هدف اليوم!" : "حلّ اختباراً أو راجع بطاقات لتكسب نقاطاً."}</small>
    <div class="speed-row" style="margin:0">${[20, 50, 100].map(n => `<button class="tab-btn ${n === goal ? "active" : ""}" data-xgoal="${n}">${n}</button>`).join("")}</div></div>
  <div class="card"><small>🔥 أيام متتالية</small><div class="x-big">${streak()}</div><small>ادخل كل يوم ولو 5 دقائق لتحافظ على السلسلة.</small></div>
  <div class="card"><small>▶️ تابع من حيث توقفت</small>${last && PAGE_NAMES[last] ? `<div class="x-big" style="font-size:22px">${PAGE_NAMES[last]}</div><button class="btn-action" data-page="${last}">تابع ←</button>` : `<p>ابدأ بالحروف ثم انتقل للدروس.</p><button class="btn-action" data-page="letters">ابدأ ←</button>`}</div>`;
}
document.addEventListener("click", e => {
  const g = e.target.closest("[data-xgoal]"); if (g) { store.set("xp_goal", +g.dataset.xgoal); renderDash() }
  const p = e.target.closest("[data-page]"); if (p) { const id = p.dataset.page; if (id !== "home" && PAGE_NAMES[id]) store.set("last_page", id); if (id === "home") setTimeout(renderDash, 0) }
});
window.addEventListener("hashchange", () => { const id = location.hash.slice(1); if (PAGE_NAMES[id]) store.set("last_page", id) });

/* ===== 2) بحث شامل ===== */
const sb = document.createElement("button"); sb.className = "icon-btn"; sb.title = "بحث (Ctrl+K)"; sb.setAttribute("aria-label", "بحث"); sb.textContent = "🔍";
$(".head-tools").prepend(sb);
function openSearch() {
  if ($("#xSearch")) return;
  document.body.insertAdjacentHTML("beforeend", `<div id="xSearch"><section class="box"><input type="text" id="xQ" placeholder="ابحث عن كلمة أو قاعدة (ياباني / روماجي / عربي)…" autocomplete="off"><div class="x-res" id="xRes"><p>اكتب حرفين على الأقل.</p></div></section></div>`);
  const q = $("#xQ"); q.focus();
  q.oninput = () => {
    const s = q.value.trim().toLowerCase(); if (s.length < 2) { $("#xRes").innerHTML = "<p>اكتب حرفين على الأقل.</p>"; return }
    const hit = x => String(x || "").toLowerCase().includes(s);
    const vs = VOCAB().filter(v => v.some(hit)).slice(0, 12);
    const gs = []; Object.entries(S.LEVELS).forEach(([lv, L]) => L.lessons.forEach(l => l.grammar.forEach(g => { if (hit(g[0]) || hit(g[1])) gs.push([lv, g]) })));
    $("#xRes").innerHTML = (vs.map(v => `<div class="word-card" data-say="${esc(say1(v))}"><div><div class="word-jp">${v[0]}</div>${v[0] !== v[1] ? `<div class="word-kana">${v[1]}</div>` : ""}<div class="word-ar">${v[3]}</div></div><span class="spk">🔊</span></div>`).join("") +
      gs.slice(0, 6).map(([lv, g]) => `<div class="gram lv-${lv}" style="cursor:pointer" data-xgram="${esc(g[0])}"><span class="lv-badge">${lv}</span> <b>${g[0]}</b><p>${g[1]}</p></div>`).join("")) || "<p>لا نتائج.</p>";
  };
  $("#xSearch").onclick = e => {
    if (e.target.id === "xSearch") return closeSearch();
    const g = e.target.closest("[data-xgram]"); if (g) { closeSearch(); $("#gQ").value = g.dataset.xgram; $('nav a[data-page="grammar"]').click(); setTimeout(() => $("#gQ").dispatchEvent(new Event("input")), 30) }
  };
}
const closeSearch = () => { const x = $("#xSearch"); if (x) x.remove() };
sb.onclick = openSearch;

/* ===== 3) إخفاء الروماجي / الكانا / الترجمة ===== */
const HID = store.get("x_hide", {});
$("#lvTabs").insertAdjacentHTML("beforebegin", `<div class="x-toggles">🙈 اختبر نفسك — أخفِ:
  <label><input type="checkbox" data-xh="ro"> الروماجي</label><label><input type="checkbox" data-xh="ka"> الكانا</label><label><input type="checkbox" data-xh="ar"> الترجمة</label></div>`);
function applyHide() { ["ro", "ka", "ar"].forEach(k => { document.body.classList.toggle("x-hide-" + k, !!HID[k]); $$(`[data-xh="${k}"]`).forEach(c => c.checked = !!HID[k]) }) }
document.addEventListener("change", e => { const c = e.target.closest("[data-xh]"); if (c) { HID[c.dataset.xh] = c.checked; store.set("x_hide", HID); applyHide() } });
document.addEventListener("click", e => {
  const t = e.target.closest(".word-ro,.sent-ro,.word-kana,.sent-kana,.word-ar,.sent-ar");
  if (!t || t.classList.contains("x-shown")) return;
  const k = /-ro$/.test(t.className.split(" ")[0]) ? "ro" : /-kana$/.test(t.className.split(" ")[0]) ? "ka" : "ar";
  if (HID[k]) { t.classList.add("x-shown"); e.stopPropagation() }
}, true);
applyHide();

/* ===== 4) تحديات جديدة: عكسي + إملاء ===== */
$("#challenge .tabs").insertAdjacentHTML("beforeend", `<button class="tab-btn" data-xch="rev">🔄 عكسي (المعنى ← الكلمة)</button><button class="tab-btn" data-xch="dict">✍️ إملاء (اكتب ما تسمع)</button>`);
$("#chBox").insertAdjacentHTML("afterend", `<div class="quiz-card" id="xBox" hidden></div>`);
document.addEventListener("click", e => {
  if (e.target.closest("[data-ch]")) { $("#xBox").hidden = true; $$("[data-xch]").forEach(x => x.classList.remove("active")) }
  const b = e.target.closest("[data-xch]"); if (!b) return;
  $("#chBox").hidden = $("#ordBox").hidden = true; $("#xBox").hidden = false;
  $$("#challenge .tabs .tab-btn").forEach(x => x.classList.toggle("active", x === b));
  xStart(b.dataset.xch);
});
const kata2hira = s => s.replace(/[ァ-ヶ]/g, c => String.fromCharCode(c.charCodeAt(0) - 0x60));
const norm = s => kata2hira(String(s).normalize("NFKC").toLowerCase()).replace(/[ً-ْـ]/g, "").replace(/[^\p{L}\p{N}ー]/gu, "");
let X = null;
function xStart(type) {
  const v = VOCAB(); if (v.length < 4) { $("#xBox").innerHTML = "<p>لا توجد مفردات كافية.</p>"; return }
  X = { type, i: 0, sc: 0, lock: false, qs: shuffle(v).slice(0, 10) }; xShow();
}
function xShow() {
  const w = X.qs[X.i]; if (!w) return xEnd(); X.lock = false;
  const head = `<div class="quiz-hint">السؤال ${X.i + 1}/${X.qs.length} — النقاط ${X.sc}</div>`;
  if (X.type === "rev") {
    const others = shuffle([...new Set(VOCAB().filter(x => x[3] !== w[3] && x[0] !== w[0]).map(x => x[0]))]).slice(0, 3);
    $("#xBox").innerHTML = `${head}<p>اختر الكلمة التي تعني:</p><div class="quiz-q" style="font-family:inherit;font-size:34px">${w[3]}</div>
      <div class="quiz-options">${shuffle([w[0], ...others]).map(o => `<button class="opt jp" data-xo="${esc(o)}">${o}</button>`).join("")}</div><div class="feedback" id="xF"></div><div class="x-kbd">⌨️ اضغط 1-4 للاختيار</div>`;
    $$("#xBox [data-xo]").forEach(b => b.onclick = () => xAnswer(b.dataset.xo === w[0], b));
  } else {
    $("#xBox").innerHTML = `${head}<p>استمع واكتب الكلمة${isJa() ? " (بالكانا أو الروماجي)" : ""}:</p>
      <button class="btn-action" id="xPlay" style="font-size:30px;margin:8px">🔊</button> <button class="btn-action btn-ghost" id="xSlow">🐢</button>
      <input type="text" id="xIn" autocomplete="off" autocapitalize="off" spellcheck="false" style="margin-top:12px" placeholder="اكتب هنا ثم Enter">
      <div class="speed-row" style="justify-content:center"><button class="btn-action" id="xCheck">تحقّق ✓</button><button class="btn-action btn-ghost" id="xHint">💡 تلميح: المعنى</button></div><div class="feedback" id="xF"></div>`;
    const play = slow => { speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(say1(w)); u.lang = { ja: "ja-JP", en: "en-US", tr: "tr-TR", ar: "ar-SA" }[lg()]; u.rate = slow ? .5 : .85; speechSynthesis.speak(u) };
    $("#xPlay").onclick = () => play(); $("#xSlow").onclick = () => play(1); play();
    $("#xHint").onclick = () => { const f = $("#xF"); f.className = "feedback"; f.style.display = "block"; f.textContent = "المعنى: " + w[3] };
    const check = () => {
      const a = norm($("#xIn").value); if (!a) return;
      const ok = [w[0], ...String(w[1]).split(" / "), ...String(w[2] || "").split(" / ")].map(norm).filter(Boolean).includes(a);
      xAnswer(ok, null);
    };
    $("#xCheck").onclick = check; $("#xIn").onkeydown = e => { if (e.key === "Enter") { e.preventDefault(); X.lock ? $("#xNext") && $("#xNext").click() : check() } };
    $("#xIn").focus();
  }
}
function xAnswer(ok, btn) {
  if (X.lock) return; X.lock = true; const w = X.qs[X.i];
  if (btn) { $$("#xBox [data-xo]").forEach(b => { if (b.dataset.xo === w[0]) b.classList.add("ok") }); if (!ok) btn.classList.add("no") }
  if (ok) X.sc++;
  const f = $("#xF"); f.className = "feedback " + (ok ? "correct" : "wrong"); f.style.display = "block";
  f.innerHTML = (ok ? "✨ صحيح! " : "❌ الصحيح: ") + `<span class="jp">${w[0]}</span>${w[0] !== w[1] ? ` (${w[1]})` : ""}${w[2] ? ` — ${w[2]}` : ""} — ${w[3]}`;
  f.insertAdjacentHTML("afterend", `<button class="btn-action" id="xNext" style="margin-top:10px">التالي ←</button>`);
  $("#xNext").onclick = () => { X.i++; xShow() };
  if (X.type === "rev") setTimeout(() => { if ($("#xNext") && X.qs[X.i] === w) { X.i++; xShow() } }, 1600);
}
function xEnd() {
  const pct = Math.round(X.sc / X.qs.length * 100);
  document.dispatchEvent(new CustomEvent("quizdone", { detail: pct }));
  const b = store.get("x_best", {}), k = lg() + "_" + X.type; if (!b[k] || X.sc > b[k]) b[k] = X.sc; store.set("x_best", b);
  $("#xBox").innerHTML = `<h3>🎉 انتهى التحدي</h3><div class="score">${X.sc} / ${X.qs.length}</div><p>أفضل نتيجة: ${b[k]} / ${X.qs.length}</p><button class="btn-action" data-xch="${X.type}">إعادة 🔄</button>`;
}

/* ===== 5) اختصارات لوحة المفاتيح ===== */
document.addEventListener("keydown", e => {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") { e.preventDefault(); openSearch(); return }
  if (e.key === "Escape") { closeSearch(); $("#nav").classList.remove("open"); return }
  const tag = (e.target.tagName || "").toLowerCase(); if (["input", "textarea", "select"].includes(tag) || e.ctrlKey || e.altKey || e.metaKey) return;
  if (e.key === "/") { e.preventDefault(); openSearch(); return }
  const vis = el => el && el.offsetParent !== null;
  if (/^[1-4]$/.test(e.key)) { const o = $$(".page-section.active-page .opt").filter(vis); if (o[+e.key - 1]) o[+e.key - 1].click() }
  if (e.key === "Enter") { const n = ["#xNext", "#sNext", "#pNext"].map(s => $(s)).find(vis); if (n) { e.preventDefault(); n.click() } }
});

/* ===== 6) تثبيت التطبيق ===== */
let deferred = null;
const ib = document.createElement("button"); ib.className = "icon-btn"; ib.title = "ثبّت التطبيق على جهازك"; ib.setAttribute("aria-label", "تثبيت التطبيق"); ib.textContent = "📲"; ib.hidden = true;
$(".head-tools").prepend(ib);
window.addEventListener("beforeinstallprompt", e => { e.preventDefault(); deferred = e; ib.hidden = false });
window.addEventListener("appinstalled", () => { ib.hidden = true; toast("✅ تم تثبيت التطبيق") });
ib.onclick = async () => { if (!deferred) return; deferred.prompt(); await deferred.userChoice.catch(() => {}); deferred = null; ib.hidden = true };
const iOS = /iphone|ipad|ipod/i.test(navigator.userAgent), standalone = navigator.standalone || matchMedia("(display-mode: standalone)").matches;
if (iOS && !standalone && !store.get("ios_hint", false)) {
  setTimeout(() => { toast("📲 لتثبيت التطبيق: زر المشاركة ⬆️ ثم «إضافة إلى الشاشة الرئيسية»"); store.set("ios_hint", true) }, 4000);
}

/* ===== تحديث عند تغيير لغة التعلّم ===== */
const sel = $("#learnLang"); if (sel) sel.addEventListener("change", () => { renderDash(); if (!$("#xBox").hidden && X) xStart(X.type) });
renderDash();
});
