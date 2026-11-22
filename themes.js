/* themes.js — هوية خاصة بكل لغة: ألوان، رسمة الواجهة، أجواء متحركة، وأفق مدن في الخلفية (حمّله بعد ui.js)
   اليابان: ساكورا، فوجي، خريف كيوتو، ثلج هوكايدو، طوكيو ليلاً، زِن
   تركيا: توليب إسطنبول، البوسفور، بالونات كابادوكيا، الخرزة الزرقاء
   تراثنا العربي: ياسمين دمشق، أهرامات القاهرة، فوانيس رمضان، ليالي الصحراء
   الإنجليزية: نيويورك، لندن الممطرة، خريف أمريكا، سان فرانسيسكو
   + خيار «المؤثرات والحركة»: تلقائي / تشغيل (حتى على الأجهزة الضعيفة) / إيقاف */
document.addEventListener("DOMContentLoaded", () => {
const S = window.SARI; if (!S) return;
const $ = S.$, $$ = S.$$, store = S.store, root = document.documentElement;
const lg = () => store.get("learnLang", "ja");
const TITLE = { ja: "أجواء اليابان 🎎", tr: "أجواء تركيا 🌷", ar: "أجواء تراثنا العربي 🕌", en: "أجواء أمريكا وبريطانيا 🗽" };
const LOGO = { ja: "日", en: "A", tr: "Ş", ar: "ع" };
const TC = { ja: "#e5484d", en: "#2563eb", tr: "#d62839", ar: "#0f8a6e" };

/* [المفتاح، الاسم، نوع الحركة، الرموز، أفق المدينة] */
const SC = {
 ja: [["", "بدون"], ["sakura", "🌸 ساكورا", "fall", ["🌸", "🌸", "💮"], "fuji"], ["fuji", "🗻 جبل فوجي", "drift", ["☁️"], "fuji"], ["momiji", "🍁 خريف كيوتو", "fall", ["🍁", "🍂"], "kyoto"], ["yuki", "❄️ شتاء هوكايدو", "fall", ["❄️", "❅", "❆"], "alps"], ["night", "🌃 طوكيو ليلاً", "twinkle", ["✨", "⭐"], "tokyo"], ["zen", "🎍 حديقة زِن", "fall", ["🍃"], "torii"]],
 tr: [["", "بدون"], ["lale", "🌷 توليب إسطنبول", "fall", ["🌷"], "istanbul"], ["bogaz", "🌊 البوسفور", "drift", ["🕊️"], "istanbul"], ["kapadokya", "🎈 بالونات كابادوكيا", "rise", ["🎈"], "kapadokya"], ["nazar", "🧿 الخرزة الزرقاء", "fall", ["🧿"], "istanbul"]],
 ar: [["", "بدون"], ["sham", "🌼 ياسمين دمشق", "fall", ["🌼", "✿"], "damascus"], ["cairo", "🏜️ أهرامات القاهرة", "twinkle", ["✦"], "cairo"], ["fanous", "🏮 فوانيس رمضان", "twinkle", ["🏮", "⭐", "🌙"], "minarets"], ["sahra", "🐪 ليالي الصحراء", "twinkle", ["✨"], "desert"]],
 en: [["", "بدون"], ["nyc", "🗽 نيويورك", "twinkle", ["✨"], "nyc"], ["london", "☔ لندن الممطرة", "rain", ["💧"], "london"], ["autumn", "🍂 خريف أمريكا", "fall", ["🍂", "🍁"], "hills"], ["sf", "🌉 سان فرانسيسكو", "drift", ["☁️"], "bridge"]]
};
const DEF = { ja: "sakura", tr: "lale", ar: "sham", en: "nyc" };
const PA = { fall: { n: 16, s: [16, 26], d: [9, 17] }, rise: { n: 9, s: [24, 38], d: [16, 26] }, twinkle: { n: 22, s: [10, 18], d: [2.5, 5] }, drift: { n: 6, s: [26, 40], d: [30, 50] }, rain: { n: 40, s: [10, 14], d: [.9, 1.6] } };

/* ===== أفق المدن (viewBox 0 0 1200 200) ===== */
const B = (x, w, h) => `<rect x="${x}" y="${200 - h}" width="${w}" height="${h}"/>`;
const BS = a => a.map(r => B(...r)).join("");
const DOME = (cx, r, y) => `<path d="M${cx - r} ${y}A${r} ${r} 0 0 1 ${cx + r} ${y}Z"/>`;
const MIN = (x, h, w) => B(x, w, h) + `<path d="M${x - 1} ${200 - h}L${x + w / 2} ${200 - h - w * 3}L${x + w + 1} ${200 - h}Z"/>`;
const PYR = (x, w, h) => `<path d="M${x} 200L${x + w / 2} ${200 - h}L${x + w} 200Z"/>`;
const HILL = p => `<path d="M0 200${p}L1200 200Z"/>`;
const PALM = (x, h) => { const t = 200 - h; return `<path d="M${x} 200Q${x + 8} ${t + h / 2} ${x} ${t}" fill="none" stroke="currentColor" stroke-width="6"/>` + [[-34, 4], [-24, 18], [32, 2], [24, 18], [-6, -14]].map(([dx, dy]) => `<path d="M${x} ${t}Q${x + dx / 2} ${t + dy - 16} ${x + dx} ${t + dy + 6}" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round"/>`).join("") };
const ROOF = (cx, hw, y) => `<path d="M${cx - hw} ${y}Q${cx - hw / 2} ${y - 6} ${cx} ${y - 14}Q${cx + hw / 2} ${y - 6} ${cx + hw} ${y}Z"/>`;
const CH = (x, w, h) => `<path d="M${x} 200L${x + w * .3} ${200 - h}H${x + w * .7}L${x + w} 200Z"/><ellipse cx="${x + w / 2}" cy="${200 - h}" rx="${w * .32}" ry="${w * .16}"/>`;
const TREE = x => `<rect x="${x - 3}" y="150" width="6" height="50"/><circle cx="${x}" cy="140" r="26"/>`;
const SKY = {
 fuji: `<path d="M120 200L430 200L560 72Q600 50 640 72L800 200Z"/>` + HILL("Q300 150 600 185T1200 170"),
 kyoto: HILL("Q250 140 520 180T1200 160") + B(882, 36, 140) + B(898, 4, 175) + [[180, 56], [152, 50], [124, 44], [96, 38], [68, 32]].map(([y, hw]) => ROOF(900, hw, y)).join(""),
 alps: `<path d="M0 200L150 90L260 160L400 60L560 170L700 80L860 160L1000 70L1200 180V200Z"/>`,
 tokyo: BS([[0, 70, 70], [75, 50, 110], [130, 80, 60], [215, 45, 130], [265, 70, 85], [340, 55, 150], [400, 90, 70], [495, 40, 115], [540, 70, 90], [615, 60, 135], [680, 90, 60], [880, 60, 100], [945, 45, 140], [995, 80, 75], [1080, 50, 120], [1135, 65, 80]]) + `<path d="M796 200L826 40L856 200H840L826 90L812 200Z"/><rect x="808" y="120" width="36" height="7"/><rect x="815" y="80" width="22" height="6"/><rect x="824" y="10" width="4" height="32"/>`,
 torii: HILL("Q300 160 640 185T1200 165") + `<rect x="840" y="88" width="140" height="12" rx="6"/><rect x="852" y="110" width="116" height="8"/><rect x="862" y="96" width="12" height="104"/><rect x="946" y="96" width="12" height="104"/>`,
 istanbul: BS([[0, 60, 40], [60, 50, 55], [115, 45, 35], [480, 60, 45], [545, 70, 30], [840, 50, 50], [895, 60, 35], [1020, 70, 45], [1095, 50, 60], [1150, 50, 35]]) + B(220, 200, 40) + DOME(320, 62, 160) + DOME(255, 30, 168) + DOME(385, 30, 168) + `<rect x="318" y="84" width="4" height="16"/>` + MIN(196, 120, 10) + MIN(434, 120, 10) + B(650, 120, 30) + DOME(710, 40, 170) + MIN(636, 95, 8) + MIN(776, 95, 8) + B(965, 34, 120) + `<path d="M960 80L982 38L1004 80Z"/>`,
 kapadokya: HILL("Q200 140 420 175T850 165T1200 150") + CH(80, 70, 120) + CH(160, 60, 90) + CH(700, 80, 140) + CH(790, 60, 100) + CH(1000, 70, 125),
 damascus: BS([[0, 70, 50], [70, 60, 70], [135, 80, 45], [220, 60, 60], [760, 70, 55], [835, 55, 70], [895, 80, 45], [980, 60, 65], [1045, 70, 50], [1120, 80, 60]]) + B(330, 380, 55) + DOME(520, 48, 145) + `<rect x="516" y="80" width="8" height="18"/>` + B(320, 22, 150) + DOME(331, 11, 50) + B(700, 22, 135) + DOME(711, 11, 65) + B(560, 18, 120) + DOME(569, 9, 80) + PALM(290, 120) + PALM(1180, 110),
 cairo: PYR(560, 320, 160) + PYR(860, 240, 120) + PYR(1060, 140, 80) + PALM(200, 130) + PALM(270, 100) + MIN(40, 110, 10) + DOME(110, 30, 200) + MIN(146, 90, 8),
 minarets: [60, 260, 470, 690, 900, 1100].map(x => B(x - 55, 110, 30) + DOME(x, 50, 170) + MIN(x + 60, 130, 10)).join(""),
 desert: `<path d="M0 200Q200 120 420 170T860 150T1200 170V200Z"/>` + PALM(260, 90) + PALM(300, 70),
 nyc: BS([[220, 60, 90], [285, 45, 130], [335, 70, 70], [410, 50, 160], [465, 80, 95], [550, 45, 140], [700, 60, 110], [765, 50, 150], [820, 80, 80], [905, 45, 125], [955, 70, 95], [1030, 55, 145], [1090, 60, 70], [1150, 50, 110]]) + B(600, 70, 120) + B(612, 46, 150) + B(624, 22, 175) + `<rect x="633" y="0" width="4" height="30"/><path d="M410 40L435 4L460 40Z"/>` + B(120, 50, 50) + `<path d="M132 150L138 92Q145 84 152 92L158 150Z"/><circle cx="145" cy="84" r="7"/><path d="M150 92L162 50" stroke="currentColor" stroke-width="7" stroke-linecap="round"/><path d="M157 46L167 46L164 36Z"/>`,
 london: BS([[0, 90, 45], [120, 160, 60], [380, 70, 60], [455, 50, 80], [640, 90, 55], [900, 70, 65], [975, 60, 90], [1040, 80, 55], [1125, 75, 75]]) + B(130, 14, 90) + B(266, 14, 90) + B(280, 40, 150) + `<path d="M276 50L300 8L324 50Z"/>` + DOME(560, 45, 150) + B(515, 90, 50) + `<rect x="557" y="90" width="6" height="16"/><circle cx="800" cy="105" r="78" fill="none" stroke="currentColor" stroke-width="6"/><path d="M800 27V183M722 105H878M745 50L855 160M855 50L745 160" stroke="currentColor" stroke-width="3"/><path d="M788 200L800 105L812 200Z"/>`,
 hills: HILL("Q150 130 320 165T700 150T1200 160") + B(800, 40, 90) + `<path d="M796 110L820 40L844 110Z"/>` + [200, 260, 560, 620, 980, 1040].map(TREE).join(""),
 bridge: `<rect x="0" y="150" width="1200" height="8"/>` + B(330, 30, 180) + B(830, 30, 180) + `<rect x="330" y="60" width="30" height="8"/><rect x="830" y="60" width="30" height="8"/><path d="M0 70Q172 160 345 26Q595 190 845 26Q1020 160 1200 80" fill="none" stroke="currentColor" stroke-width="5"/><path d="M900 200Q1050 120 1200 150V200Z"/><path d="M0 200Q120 130 260 200Z"/>`
};

/* ===== رسمة الواجهة (الهيرو) لكل لغة — بالأبيض فوق التدرّج ===== */
const art = $(".hero-art"), JA_ART = art ? art.innerHTML : "";
const HERO = {
 tr: `<circle class="sun" cx="200" cy="42" r="20" fill="#fff" opacity=".85"/>
  <mask id="hmTr"><rect width="240" height="180" fill="#fff"/><circle cx="74" cy="46" r="21" fill="#000"/></mask>
  <circle cx="64" cy="50" r="26" fill="#fff" mask="url(#hmTr)" opacity=".95"/><path d="M98 50l4 9 10 1-7 7 2 10-9-5-9 5 2-10-7-7 10-1z" fill="#fff" opacity=".95"/>
  <g fill="#fff" opacity=".9"><rect x="52" y="140" width="136" height="32"/><path d="M76 140A44 44 0 0 1 164 140Z"/><path d="M52 146A20 20 0 0 1 92 146Z"/><path d="M148 146A20 20 0 0 1 188 146Z"/><rect x="118" y="84" width="4" height="14"/>
  <rect x="34" y="78" width="7" height="94"/><path d="M33 78L37.5 54L42 78Z"/><rect x="199" y="78" width="7" height="94"/><path d="M198 78L202.5 54L207 78Z"/></g>
  <path d="M0 174Q15 168 30 174T60 174T90 174T120 174T150 174T180 174T210 174T240 174V180H0Z" fill="#fff" opacity=".55"/>`,
 ar: `<mask id="hmAr"><rect width="240" height="180" fill="#fff"/><circle cx="202" cy="32" r="19" fill="#000"/></mask>
  <circle cx="192" cy="40" r="22" fill="#fff" mask="url(#hmAr)" opacity=".95"/><g fill="#fff"><circle cx="150" cy="28" r="2"/><circle cx="228" cy="72" r="1.6"/><circle cx="122" cy="50" r="1.4"/><circle cx="168" cy="64" r="1.2"/></g>
  <path d="M122 172L168 108L214 172Z" fill="#fff" opacity=".9"/><path d="M184 172L212 134L240 172Z" fill="#fff" opacity=".7"/>
  <g fill="#fff" opacity=".92"><rect x="14" y="138" width="70" height="34"/><path d="M24 138A25 25 0 0 1 74 138Z"/><rect x="47" y="102" width="4" height="12"/><rect x="88" y="92" width="10" height="80"/><path d="M87 92L93 74L99 92Z"/></g>
  <g stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round" opacity=".9"><path d="M112 172Q116 142 110 116"/><path d="M110 116Q98 104 86 112"/><path d="M110 116Q114 100 128 104"/><path d="M110 116Q102 120 94 132"/><path d="M110 116Q122 118 130 130"/></g>`,
 en: `<circle class="sun" cx="200" cy="44" r="22" fill="#fff" opacity=".88"/>
  <g fill="#fff" opacity=".35"><rect x="96" y="120" width="18" height="52"/><rect x="116" y="104" width="14" height="68"/><rect x="132" y="128" width="20" height="44"/><rect x="204" y="112" width="16" height="60"/><rect x="222" y="132" width="18" height="40"/></g>
  <g fill="#fff" opacity=".92"><rect x="40" y="70" width="26" height="102"/><path d="M38 70L53 34L68 70Z"/><rect x="52" y="22" width="2" height="14"/><rect x="36" y="96" width="34" height="5"/></g>
  <g fill="#fff" opacity=".92"><rect x="158" y="146" width="30" height="26"/><path d="M164 146L167 108Q173 100 179 108L182 146Z"/><circle cx="173" cy="100" r="6"/><path d="M179 104L190 72" stroke="#fff" stroke-width="5" stroke-linecap="round"/><path d="M186 68L195 68L191 57Z"/></g>`
};

/* ===== المؤثرات: تلقائي / تشغيل / إيقاف ===== */
const fxMode = () => store.get("ui_fx", "auto");
const reduced = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
function density() {
  const f = fxMode(); if (f === "off") return 0; if (f === "on") return 1; if (reduced()) return 0;
  return ((navigator.hardwareConcurrency || 8) <= 4 || (navigator.deviceMemory || 8) <= 3 || innerWidth < 600) ? .55 : 1;
}
const R = (a, b) => a + Math.random() * (b - a);
function particles(a, em, d) {
  const P = PA[a], n = Math.max(3, Math.round(P.n * d));
  return Array.from({ length: n }, (_, i) => {
    const dur = R(...P.d), pos = a === "twinkle" ? `left:${R(2, 98).toFixed(1)}%;top:${R(4, 80).toFixed(1)}%` : a === "drift" ? `top:${R(4, 45).toFixed(1)}%` : `left:${(i / n * 100 + R(0, 100 / n)).toFixed(1)}%`;
    return `<i class="u-p-${a}" style="${pos};font-size:${R(...P.s).toFixed(0)}px;animation-duration:${dur.toFixed(1)}s;animation-delay:${(-Math.random() * dur).toFixed(1)}s">${em[i % em.length]}</i>`;
  }).join("");
}
const curKey = l => { const k = store.get("atmos_" + l, null); return k == null ? DEF[l] : k };
function scene() {
  const l = lg(), sc = SC[l].find(s => s[0] === curKey(l)) || SC[l][0];
  if (sc[0]) root.dataset.atmos = sc[0]; else root.removeAttribute("data-atmos");
  const box = $("#petals"), d = density(); if (box) box.innerHTML = sc[0] && d ? particles(sc[2], sc[3], d) : "";
  let sk = $("#uScene"); if (!sk) { document.body.insertAdjacentHTML("afterbegin", `<div id="uScene" aria-hidden="true"></div>`); sk = $("#uScene") }
  sk.innerHTML = sc[0] && sc[4] && fxMode() !== "off" ? `<svg viewBox="0 0 1200 200" preserveAspectRatio="xMidYMax slice" fill="currentColor">${SKY[sc[4]]}</svg>` : "";
}

/* ===== أزرار الاختيار: في ⚙️ الإعدادات وفي صفحة «تقدّمي» ===== */
const look = $("#uLookRows");
if (look) look.innerHTML = `<div class="u-row"><span>✨ المؤثرات والحركة</span><div class="u-seg" id="uFx">${[["auto", "تلقائي"], ["on", "تشغيل"], ["off", "إيقاف"]].map(([k, t]) => `<button type="button" data-fx="${k}">${t}</button>`).join("")}</div>
  <p class="u-note" style="width:100%">«تلقائي» يطفئ الحركة على الأجهزة التي فعّلت «تقليل الحركة». اختر «تشغيل» لتعمل المؤثرات دائماً حتى على الأجهزة الضعيفة، أو «إيقاف» لتوفير البطارية.</p></div>
  <div class="u-row"><span id="uScT"></span><div class="u-chips" data-scenes></div></div>`;
const at = $("#atBtns"); if (at) { at.setAttribute("data-scenes", ""); at.insertAdjacentHTML("beforebegin", `<p class="u-note">اختر أجواء خاصة باللغة التي تتعلّمها: ألوان وخلفية متحركة وأفق مدينة. تتغير الخيارات حسب اللغة.</p>`) }
function pickers() {
  const l = lg(), k = curKey(l);
  $$("[data-scenes]").forEach(c => c.innerHTML = SC[l].map(([key, t]) => `<button type="button" class="tab-btn${key === k ? " active" : ""}" data-scene="${key}">${t}</button>`).join(""));
  if ($("#uScT")) $("#uScT").textContent = TITLE[l];
  if (at && at.parentElement) { const h = at.parentElement.querySelector("h2"); if (h) h.textContent = TITLE[l] }
  $$("#uFx [data-fx]").forEach(b => b.classList.toggle("on", b.dataset.fx === fxMode()));
}
document.addEventListener("click", e => {
  const b = e.target.closest("[data-scene]"); if (b) { store.set("atmos_" + lg(), b.dataset.scene); scene(); pickers() }
  const f = e.target.closest("#uFx [data-fx]"); if (f) { store.set("ui_fx", f.dataset.fx); applyFx(); scene(); pickers() }
});
function applyFx() { const f = fxMode(); if (f === "auto") root.removeAttribute("data-fx"); else root.dataset.fx = f }

/* ===== تطبيق هوية اللغة ===== */
function apply() {
  const l = lg(); root.dataset.learn = l;
  const lo = $(".brand .logo"); if (lo) lo.textContent = LOGO[l];
  $$('meta[name="theme-color"]').forEach(m => m.content = TC[l]);
  if (art) art.innerHTML = l === "ja" ? JA_ART : HERO[l];
  scene(); pickers();
}
document.addEventListener("change", e => { if (e.target.id === "learnLang") setTimeout(apply, 0) });
applyFx(); apply();
});
