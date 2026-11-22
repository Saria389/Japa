/* ui.js — الواجهة على كل الأجهزة (حمّله بعد culture.js)
   ⚙️ الإعدادات · 🌐 مبدّل لغة التعلّم (بدل القائمة المنسدلة) · 📂 «كل الأقسام» مع شرح لكل قسم
   شريط تنقل سفلي للجوال والتابلت · فتح الروابط المباشرة مثل #spot */
const U_H0 = location.hash.slice(1);
document.addEventListener("DOMContentLoaded", () => {
const S = window.SARI; if (!S) return;
const $ = S.$, $$ = S.$$, store = S.store;
const tools = $(".head-tools"), nav = $("#nav");
const iOS = /iphone|ipad|ipod/i.test(navigator.userAgent), standalone = navigator.standalone || matchMedia("(display-mode: standalone)").matches;
const coarse = () => matchMedia("(pointer:coarse)").matches;

/* ===== نافذة عامة (سفلية على الجوال، وسط الشاشة على الكمبيوتر) ===== */
let openEl = null, lastFocus = null;
function sheet(id, title, inner, wide) {
  document.body.insertAdjacentHTML("beforeend", `<div class="u-sheet" id="${id}" hidden><div class="u-panel${wide ? " u-wide" : ""}" role="dialog" aria-modal="true" aria-labelledby="${id}T">
    <div class="u-grab"></div><div class="u-head"><h3 id="${id}T">${title}</h3><button type="button" class="icon-btn" data-uclose aria-label="إغلاق">✕</button></div>${inner}</div></div>`);
  const el = $("#" + id);
  el.addEventListener("click", e => { if (e.target === el || e.target.closest("[data-uclose]")) closeSheet() });
  return el;
}
function openSheet(el) {
  closeSheet(); lastFocus = document.activeElement; el.hidden = false; openEl = el; document.body.classList.add("u-lock");
  const f = coarse() ? el.querySelector("[data-uclose]") : el.querySelector("input[type=text],[data-uclose]"); if (f) f.focus({ preventScroll: true });
  syncBar();
}
function closeSheet() {
  if (!openEl) return; openEl.hidden = true; openEl = null; document.body.classList.remove("u-lock");
  if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true }); syncBar();
}
document.addEventListener("keydown", e => { if (e.key === "Escape") closeSheet() });

/* ===== ⚙️ الإعدادات ===== */
const gear = document.createElement("button");
Object.assign(gear, { className: "icon-btn", id: "uGear", type: "button", title: "الإعدادات", textContent: "⚙️" });
gear.setAttribute("aria-label", "الإعدادات"); gear.setAttribute("aria-haspopup", "dialog");
tools.insertBefore(gear, $("#menuBtn"));
const setEl = sheet("uSheet", "⚙️ الإعدادات", `
  <div class="u-group"><div class="u-gt">🎨 المظهر</div>
    <div class="u-row"><span>الوضع الليلي / النهاري</span><span id="uThemeSlot"></span></div>
    <div class="u-row"><span>حجم الخط</span><div class="u-seg" id="uZoom">${[["0.9", "أصغر"], ["1", "عادي"], ["1.1", "أكبر"], ["1.25", "كبير جداً"]].map(([z, t]) => `<button type="button" data-z="${z}">${t}</button>`).join("")}</div></div>
    <div id="uLookRows"></div>
    <div class="u-row" id="uUiRow"><span>لغة الواجهة (عربي / English)</span><span id="uUiSlot"></span></div>
  </div>
  <div class="u-group" id="uAudio"></div>
  <div class="u-group"><div class="u-gt">📲 التطبيق</div>
    <div class="u-row" id="uInstRow"><span>ثبّت المنصة على جهازك لتعمل كتطبيق وبدون إنترنت</span><span id="uInstSlot"></span></div>
    <div class="u-row" id="uIosRow" hidden><span>على الآيفون: زر المشاركة ⬆️ ← «إضافة إلى الشاشة الرئيسية»</span></div>
    <div class="u-row"><span>اختصارات: <b>/</b> بحث · <b>1-4</b> اختيار الإجابة · <b>Enter</b> التالي · <b>Esc</b> إغلاق / إيقاف الصوت</span></div>
  </div>`);
const th = $("#themeBtn"); if (th) $("#uThemeSlot").appendChild(th);
const ub = $("#uiBtn"); if (ub) $("#uUiSlot").appendChild(ub); else $("#uUiRow").hidden = true;
const ib = $('[aria-label="تثبيت التطبيق"]'); if (ib) $("#uInstSlot").appendChild(ib);
const syncInstall = () => {
  const can = !!ib && !ib.hidden;
  $("#uInstRow").hidden = !can; $("#uIosRow").hidden = !(iOS && !standalone);
  gear.classList.toggle("u-dot", can && !store.get("ui_seen_install", false));
};
if (ib) new MutationObserver(syncInstall).observe(ib, { attributes: true, attributeFilter: ["hidden"] });
syncInstall();
if (window.SARI_AUDIO) SARI_AUDIO.mount($("#uAudio")); else $("#uAudio").remove();
const openSettings = () => { store.set("ui_seen_install", true); syncInstall(); openSheet(setEl) };
gear.onclick = openSettings;

const setZoom = z => { document.documentElement.style.setProperty("--uzoom", z); store.set("ui_zoom", z); $$("#uZoom [data-z]").forEach(b => b.classList.toggle("on", b.dataset.z === z)) };
setZoom(String(store.get("ui_zoom", "1")));
$("#uZoom").onclick = e => { const b = e.target.closest("[data-z]"); if (b) setZoom(b.dataset.z) };

/* ===== 🌐 مبدّل لغة التعلّم ===== */
const sel = $("#learnLang");
const LANGS = [["ja", "日", "日本語", "اليابانية"], ["en", "A", "English", "الإنجليزية"], ["tr", "Ş", "Türkçe", "التركية"], ["ar", "ع", "العربية", "Arabic"]];
if (sel) {
  sel.classList.add("u-hide-sel"); sel.tabIndex = -1; sel.setAttribute("aria-hidden", "true");
  const box = document.createElement("div"); box.className = "u-lang";
  box.innerHTML = `<button type="button" id="uLangBtn" aria-haspopup="listbox" aria-expanded="false" title="اختر اللغة التي تتعلّمها"><b class="u-lang-ic"></b><span class="u-lang-tx"></span><i aria-hidden="true">▾</i></button>
    <div class="u-lang-menu" role="listbox" aria-label="لغة التعلّم" hidden><div class="u-lang-h">اللغة التي أتعلّمها</div>${LANGS.map(([k, ic, n, d]) => `<button type="button" role="option" data-lang="${k}"><b class="u-lang-ic" data-l="${k}">${ic}</b><span><strong>${n}</strong><small>${d}</small></span><em aria-hidden="true">✓</em></button>`).join("")}</div>`;
  sel.after(box);
  const btn = $("#uLangBtn"), menu = box.querySelector(".u-lang-menu");
  const paint = () => {
    const L = LANGS.find(x => x[0] === sel.value) || LANGS[0], ic = btn.querySelector(".u-lang-ic");
    ic.textContent = L[1]; ic.dataset.l = L[0]; btn.querySelector(".u-lang-tx").textContent = L[2];
    menu.querySelectorAll("[data-lang]").forEach(b => b.setAttribute("aria-selected", String(b.dataset.lang === sel.value)));
  };
  const closeL = () => { menu.hidden = true; btn.setAttribute("aria-expanded", "false") };
  btn.onclick = e => { e.stopPropagation(); menu.hidden = !menu.hidden; btn.setAttribute("aria-expanded", String(!menu.hidden)); if (!menu.hidden) (menu.querySelector('[aria-selected="true"]') || menu.querySelector("[data-lang]")).focus() };
  menu.onclick = e => {
    const b = e.target.closest("[data-lang]"); if (!b) return; closeL(); btn.focus();
    if (sel.value !== b.dataset.lang) { sel.value = b.dataset.lang; sel.dispatchEvent(new Event("change", { bubbles: true })) }
  };
  menu.onkeydown = e => {
    const bs = [...menu.querySelectorAll("[data-lang]")], i = bs.indexOf(document.activeElement);
    if (e.key === "ArrowDown" || e.key === "ArrowUp") { e.preventDefault(); bs[(i + (e.key === "ArrowDown" ? 1 : -1) + bs.length) % bs.length].focus() }
    if (e.key === "Escape") { closeL(); btn.focus() }
  };
  document.addEventListener("click", e => { if (!box.contains(e.target)) closeL() });
  sel.addEventListener("change", paint); paint();
}

/* ===== 📂 كل الأقسام (مع شرح لكل قسم) ===== */
const PAGES = [
 ["home", "🏠", "الرئيسية", "Home", "لوحتك اليومية: كلمة اليوم، هدفك، ومتابعة التعلّم"],
 ["letters", "🔤", "الحروف والنطق", "Letters", "كل الحروف مع النطق الصوتي العادي والبطيء"],
 ["curriculum", "📚", "مراحل التعلّم", "Levels", "الدروس حسب المستوى: مفردات وقواعد وجمل مسموعة"],
 ["conversations", "💬", "المحادثات", "Dialogues", "حوارات من الحياة اليومية مع الاستماع للحوار كاملاً"],
 ["quiz", "🎯", "الاختبارات", "Quizzes", "اختبر حفظك للحروف والمفردات بعشرة أسئلة"],
 ["practice", "🏋️", "التدريب", "Practice", "تمارين: أكمل الفراغ، تصريف الأفعال، مطابقة، استماع"],
 ["exam", "🎓", "نماذج الامتحان", "Mock exams", "امتحان تجريبي كامل بمؤقت ونتيجة ومراجعة للأخطاء"],
 ["phrases", "🗣️", "عبارات سريعة", "Quick phrases", "جمل جاهزة للسفر والطوارئ والتسوق والمطعم"],
 ["bank", "📖", "بنك المفردات", "Word bank", "ابحث في كل الكلمات، المفضلة، والمراجعة المتباعدة"],
 ["grammar", "🧩", "القواعد", "Grammar", "كل القواعد في مكان واحد مع البحث والأمثلة"],
 ["kanji", "✍️", "كانجي وكتابة", "Kanji", "الكانجي بالمعاني والقراءات، وتدريب الكتابة بالإصبع"],
 ["lab", "📜", "الجمل والقراءة", "Reading", "مولّد جمل ونصوص قراءة متدرجة بالصوت"],
 ["challenge", "🏁", "التحديات", "Challenges", "استماع، تحدٍّ زمني، ترتيب جمل، عكسي، وإملاء"],
 ["spot", "🔍", "اكتشف الخطأ", "Spot the mistake", "جِد الخطأ في الجملة وتعلّم سببه"],
 ["pron", "🎤", "اختبار النطق", "Pronunciation", "انطق الكلمات وسيقيّم المتصفح نطقك"],
 ["culture", "🌏", "ثقافة ومعلومات", "Culture", "عادات البلد ومعلومات مفيدة عن اللغة"],
 ["diary", "📓", "المفكرة", "Diary", "دوّن ما تعلّمته كل يوم"],
 ["me", "🏆", "تقدّمي", "My progress", "نقاطك وإنجازاتك والأجواء والنسخ الاحتياطي"],
 ["langs", "🌍", "بطاقات اللغات", "Languages", "بطاقات واختبارات سريعة بين الإنجليزية والتركية والعربية"],
 ["about", "ℹ️", "عن المنصة", "About", "قصة المنصة وهدفها"]
];
const menuEl = sheet("uMenu", "📂 كل الأقسام", `<p class="u-note">اختر القسم الذي تريده، وتحت كل قسم شرح قصير لما ستجده فيه.</p>
  <input type="text" id="uMQ" placeholder="🔍 ابحث عن قسم..." autocomplete="off" aria-label="ابحث عن قسم"><div class="u-mgrid" id="uMGrid"></div>`, true);
const visible = id => { if (!document.getElementById(id)) return false; const a = nav.querySelector(`a[data-page="${id}"]`); return !a || a.style.display !== "none" };
function renderMenu() {
  const q = $("#uMQ").value.trim().toLowerCase(), en = document.documentElement.lang === "en";
  const cur = ($(".page-section.active-page") || {}).id;
  $("#uMGrid").innerHTML = PAGES.filter(([id, , ar, e, d]) => visible(id) && (!q || (ar + e + d).toLowerCase().includes(q))).map(([id, ic, ar, e, d]) =>
    `<a href="#${id}" data-page="${id}" class="u-mi${id === cur ? " on" : ""}"><span class="u-mi-ic" aria-hidden="true">${ic}</span><span class="u-mi-tx"><b>${en ? e : ar}</b><small>${d}</small></span></a>`).join("") || `<p class="u-note">لا يوجد قسم بهذا الاسم.</p>`;
}
const openMenu = () => { $("#uMQ").value = ""; renderMenu(); openSheet(menuEl) };
$("#uMQ").oninput = renderMenu;
$("#uMGrid").addEventListener("click", e => { if (e.target.closest("[data-page]")) setTimeout(closeSheet, 0) });
// زر «المزيد ▾» على الكمبيوتر وزر القائمة: يفتحان نفس النافذة بدل القائمة الضيقة
document.addEventListener("click", e => { const b = e.target.closest(".more>button, #menuBtn"); if (b) { e.preventDefault(); e.stopPropagation(); openMenu() } }, true);

/* ===== شريط التنقل السفلي (جوال وتابلت) ===== */
const BN = [["home", "🏠", "الرئيسية"], ["letters", "🔤", "الحروف"], ["curriculum", "📚", "الدروس"], ["practice", "🏋️", "التدريب"]];
document.body.insertAdjacentHTML("beforeend", `<div class="u-bottom" role="navigation" aria-label="التنقل السريع">${BN.map(([p, i, t]) => `<a href="#${p}" data-page="${p}"><span aria-hidden="true">${i}</span><small>${t}</small></a>`).join("")}<button type="button" id="uMore" aria-haspopup="dialog" aria-controls="uMenu"><span aria-hidden="true">☰</span><small>كل الأقسام</small></button></div>`);
const more = $("#uMore");
function syncBar() {
  const id = ($(".page-section.active-page") || {}).id;
  $$(".u-bottom [data-page]").forEach(a => { const on = a.dataset.page === id && openEl !== menuEl; a.classList.toggle("on", on); on ? a.setAttribute("aria-current", "page") : a.removeAttribute("aria-current") });
  more.classList.toggle("on", openEl === menuEl);
}
document.addEventListener("click", e => { if (e.target.closest("[data-page]")) setTimeout(syncBar, 0) });
window.addEventListener("hashchange", () => setTimeout(syncBar, 0));
more.onclick = e => { e.stopPropagation(); openEl === menuEl ? closeSheet() : openMenu() };

window.SARI_UI = { openMenu, openSettings, closeSheet };

/* ===== روابط مباشرة للصفحات المضافة لاحقاً (#spot، #practice ...) ===== */
const cur = ($(".page-section.active-page") || {}).id;
if (U_H0 && U_H0 !== cur && document.getElementById(U_H0)) { const a = $(`[data-page="${U_H0}"]`); if (a) a.click() }
syncBar();
});
