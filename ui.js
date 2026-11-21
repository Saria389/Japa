/* ui.js — الواجهة على كل الأجهزة (حمّله آخر ملف)
   ⚙️ لوحة إعدادات موحّدة (الوضع الليلي، حجم الخط، لغة الواجهة، الصوت، تثبيت التطبيق)
   شريط تنقل سفلي للجوال والتابلت + قائمة «المزيد»، وفتح الروابط المباشرة مثل #spot */
const U_H0 = location.hash.slice(1);
document.addEventListener("DOMContentLoaded", () => {
const S = window.SARI; if (!S) return;
const $ = S.$, $$ = S.$$, store = S.store;
const tools = $(".head-tools"), nav = $("#nav");
const iOS = /iphone|ipad|ipod/i.test(navigator.userAgent), standalone = navigator.standalone || matchMedia("(display-mode: standalone)").matches;

/* ===== ⚙️ لوحة الإعدادات ===== */
const gear = document.createElement("button");
Object.assign(gear, { className: "icon-btn", id: "uGear", type: "button", title: "الإعدادات", textContent: "⚙️" });
gear.setAttribute("aria-label", "الإعدادات"); gear.setAttribute("aria-haspopup", "dialog");
tools.insertBefore(gear, $("#menuBtn"));
document.body.insertAdjacentHTML("beforeend", `<div class="u-sheet" id="uSheet" hidden><div class="u-panel" role="dialog" aria-modal="true" aria-labelledby="uST">
  <div class="u-grab"></div><div class="u-head"><h3 id="uST">⚙️ الإعدادات</h3><button type="button" class="icon-btn" id="uClose" aria-label="إغلاق">✕</button></div>
  <div class="u-group"><div class="u-gt">🎨 المظهر</div>
    <div class="u-row"><span>الوضع الليلي / النهاري</span><span id="uThemeSlot"></span></div>
    <div class="u-row"><span>حجم الخط</span><div class="u-seg" id="uZoom">${[["0.9", "أصغر"], ["1", "عادي"], ["1.1", "أكبر"], ["1.25", "كبير جداً"]].map(([z, t]) => `<button type="button" data-z="${z}">${t}</button>`).join("")}</div></div>
    <div class="u-row" id="uUiRow"><span>لغة الواجهة (عربي / English)</span><span id="uUiSlot"></span></div>
  </div>
  <div class="u-group" id="uAudio"></div>
  <div class="u-group" id="uAppG"><div class="u-gt">📲 التطبيق</div>
    <div class="u-row" id="uInstRow"><span>ثبّت المنصة على جهازك لتعمل كتطبيق وبدون إنترنت</span><span id="uInstSlot"></span></div>
    <div class="u-row" id="uIosRow" hidden><span>على الآيفون: زر المشاركة ⬆️ ← «إضافة إلى الشاشة الرئيسية»</span></div>
    <div class="u-row"><span>اختصارات: <b>/</b> بحث · <b>1-4</b> اختيار الإجابة · <b>Enter</b> التالي · <b>Esc</b> إغلاق / إيقاف الصوت</span></div>
  </div></div></div>`);
const sheet = $("#uSheet");
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

let lastFocus = null;
function openSheet() { lastFocus = document.activeElement; sheet.hidden = false; document.body.classList.add("u-lock"); store.set("ui_seen_install", true); syncInstall(); $("#uClose").focus() }
function closeSheet() { if (sheet.hidden) return; sheet.hidden = true; document.body.classList.remove("u-lock"); if (lastFocus && lastFocus.focus) lastFocus.focus() }
gear.onclick = openSheet; $("#uClose").onclick = closeSheet;
sheet.addEventListener("click", e => { if (e.target === sheet) closeSheet() });
document.addEventListener("keydown", e => { if (e.key === "Escape") { closeSheet(); nav.classList.remove("open") } });

/* حجم الخط */
const setZoom = z => { document.documentElement.style.setProperty("--uzoom", z); store.set("ui_zoom", z); $$("#uZoom [data-z]").forEach(b => b.classList.toggle("on", b.dataset.z === z)) };
setZoom(String(store.get("ui_zoom", "1")));
$("#uZoom").onclick = e => { const b = e.target.closest("[data-z]"); if (b) setZoom(b.dataset.z) };

/* ===== شريط التنقل السفلي ===== */
const BN = [["home", "🏠", "الرئيسية"], ["letters", "🔤", "الحروف"], ["curriculum", "📚", "الدروس"], ["quiz", "🎯", "اختبارات"]];
document.body.insertAdjacentHTML("beforeend", `<div class="u-bottom" role="navigation" aria-label="التنقل السريع">${BN.map(([p, i, t]) => `<a href="#${p}" data-page="${p}"><span aria-hidden="true">${i}</span><small>${t}</small></a>`).join("")}<button type="button" id="uMore" aria-expanded="false" aria-controls="nav"><span aria-hidden="true">☰</span><small>المزيد</small></button></div>`);
const more = $("#uMore");
function sync() {
  const id = ($(".page-section.active-page") || {}).id, open = nav.classList.contains("open");
  $$(".u-bottom [data-page]").forEach(a => { const on = a.dataset.page === id; a.classList.toggle("on", on); on ? a.setAttribute("aria-current", "page") : a.removeAttribute("aria-current") });
  more.classList.toggle("on", open); more.setAttribute("aria-expanded", open); document.body.classList.toggle("u-nav-open", open);
}
document.addEventListener("click", e => {
  if (e.target.closest("[data-page]")) setTimeout(sync, 0);
  if (nav.classList.contains("open") && !e.target.closest("#nav,#uMore,#menuBtn")) nav.classList.remove("open");
});
window.addEventListener("hashchange", () => setTimeout(sync, 0));
new MutationObserver(sync).observe(nav, { attributes: true, attributeFilter: ["class"] });
more.onclick = e => { e.stopPropagation(); nav.classList.toggle("open") };

/* ===== روابط مباشرة للصفحات المضافة لاحقاً (#spot، #pron، #phrases ...) ===== */
const cur = ($(".page-section.active-page") || {}).id;
if (U_H0 && U_H0 !== cur && document.getElementById(U_H0)) { const a = $(`[data-page="${U_H0}"]`); if (a) a.click() }
sync();
});
