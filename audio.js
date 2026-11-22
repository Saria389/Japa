/* audio.js — محرك صوت موحّد لكل أجزاء المنصة (حمّله قبل langs-addon.js)
   - يختار تلقائياً أوضح صوت متوفر لكل لغة، ويمكن تغييره من ⚙️ الإعدادات
   - يكتشف لغة النص بنفسه (ياباني / عربي / تركي / إنجليزي) فلا يُقرأ نص بصوت لغة أخرى
   - سرعة موحّدة مريحة للفهم + وضع بطيء واضح 🐢
   - يميّز العنصر الذي يُنطق الآن، ويشغّل حواراً أو نصاً كاملاً ▶️
   - مؤثرات خفيفة للإجابة الصحيحة والخاطئة (يمكن إيقافها) */
(() => {
const synth = "speechSynthesis" in window ? window.speechSynthesis : null;
const LS = { get(k, d) { try { const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v) } catch (e) { return d } }, set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)) } catch (e) {} } };
const CFG = Object.assign({ speed: 1, fx: true, voices: {} }, LS.get("audio_cfg", {}));
const save = () => LS.set("audio_cfg", CFG);
const TAG = { ja: "ja-JP", en: "en-US", tr: "tr-TR", ar: "ar-SA" };
const NAME = { ja: "اليابانية", en: "الإنجليزية", tr: "التركية", ar: "العربية" };   // بدون أعلام: ويندوز يعرضها كحروف (JP, GB)
const BASE = { ja: .88, en: .92, tr: .9, ar: .85 };   // سرعة عادية واضحة لكل لغة
const SAMPLE = { ja: "こんにちは。わたしはサリです。よろしくおねがいします。", en: "Hello! My name is Sari. Nice to meet you.", tr: "Merhaba! Benim adım Sari. Memnun oldum.", ar: "مرحباً، اسمي ساري. تشرفت بمعرفتك." };
const learn = () => LS.get("learnLang", "ja");
const ua = navigator.userAgent;

/* ===== لغة النص ===== */
function detect(text, hint) {
  const h = String(hint || "").slice(0, 2).toLowerCase();
  if (/[぀-ヿ㐀-鿿ｦ-ﾟ]/.test(text)) return "ja";
  if (/[؀-ۿ]/.test(text)) return "ar";
  if (/[çğıöşüÇĞİÖŞÜ]/.test(text)) return "tr";
  if (h === "en" || h === "tr") return h;
  return learn() === "tr" ? "tr" : "en";
}
const clean = t => String(t || "").replace(/\s\/\s.*$/, "").replace(/\p{Extended_Pictographic}|️/gu, "").replace(/[～〜~＿_]/g, "").trim();

/* ===== اختيار أوضح صوت ===== */
let VOICES = [], box = null;
const vlang = v => String(v.lang || "").replace("_", "-").toLowerCase();
const forLang = l => VOICES.filter(v => vlang(v).startsWith(l));
function rank(v, l) {
  const n = v.name || ""; let s = vlang(v) === TAG[l].toLowerCase() ? 6 : 3;
  if (/natural|neural|online|premium|enhanced|wavenet|siri/i.test(n)) s += 10;
  if (/google/i.test(n)) s += 7;
  if (/microsoft/i.test(n)) s += 3;
  if (/compact|espeak|eloquence|novelty|whisper|zarvox|bells|bubbles|cellos|jester|organ|superstar|trinoids|boing|bahh|wobble|hysterical|albert|fred|junior|ralph|bad news|good news/i.test(n)) s -= 15;
  return s + (v.default ? 1 : 0);
}
function voiceFor(l) {
  const list = forLang(l); if (!list.length) return null;
  const want = CFG.voices[l]; if (want) { const v = list.find(x => x.voiceURI === want); if (v) return v }
  return list.slice().sort((a, b) => rank(b, l) - rank(a, l))[0];
}

/* ===== التمييز البصري أثناء النطق ===== */
const AUDIO_SEL = "[data-say],[data-audio],#fS,#sp,#pHear,#sHear,#xPlay,#xSlow,#wSay";
let lastEl = null, lastAt = 0, cur = null;
document.addEventListener("click", e => { const el = e.target.closest && e.target.closest(AUDIO_SEL); if (el) { lastEl = el; lastAt = Date.now() } }, true);
const mark = (el, on) => el && el.classList.toggle("is-speaking", on);

function tune(u) {
  u.text = clean(u.text);
  const l = detect(u.text, u.lang); u.lang = TAG[l];
  try { u.voice = voiceFor(l) } catch (e) {}
  const slow = (u.rate || 1) <= .65;
  u.rate = Math.max(.4, Math.min(1.4, BASE[l] * CFG.speed * (slow ? .68 : 1)));
  u.pitch = 1; u.volume = 1;
  const el = u._el || (Date.now() - lastAt < 1200 ? lastEl : null); lastEl = null;
  u.addEventListener("start", () => { if (cur && cur !== el) mark(cur, false); cur = el; mark(el, true) });
  const off = () => { mark(el, false); if (cur === el) cur = null };
  u.addEventListener("end", off); u.addEventListener("error", off);
}

/* ===== تغليف speechSynthesis: كل ملفات الموقع تمرّ من هنا ===== */
let rawSpeak = null, seq = 0, cancelAt = 0, wasBusy = false, playBtn = null;
function setPlayBtn(b) {
  if (playBtn && playBtn !== b) { playBtn.classList.remove("playing"); playBtn.textContent = playBtn.dataset.label }
  playBtn = b;
}
if (synth) {
  rawSpeak = synth.speak.bind(synth);
  const rawCancel = synth.cancel.bind(synth);
  synth.cancel = function () { wasBusy = synth.speaking || synth.pending; cancelAt = Date.now(); seq++; setPlayBtn(null); if (cur) { mark(cur, false); cur = null } rawCancel() };
  synth.speak = function (u) {
    try { tune(u) } catch (e) {}
    // إصلاح Chrome/Android: النطق مباشرة بعد الإلغاء قد يُتجاهل
    if (wasBusy && Date.now() - cancelAt < 150) { wasBusy = false; setTimeout(() => rawSpeak(u), 90) } else rawSpeak(u);
  };
  const load = () => { VOICES = synth.getVoices() || []; renderVoices() };
  load(); if (synth.addEventListener) synth.addEventListener("voiceschanged", load);
  setTimeout(load, 900); setTimeout(load, 3000);
  // iPhone: أول نطق يحتاج لمسة من المستخدم، نفتح الصوت بصمت عند أول لمسة
  document.addEventListener("touchend", () => { try { const u = new SpeechSynthesisUtterance(" "); u.volume = 0; rawSpeak(u) } catch (e) {} }, { once: true, passive: true });
  document.addEventListener("visibilitychange", () => { if (document.hidden) synth.cancel() });
  document.addEventListener("keydown", e => { if (e.key === "Escape" && (synth.speaking || synth.pending)) synth.cancel() });
}

function speak(text, opt = {}) {
  if (!synth) return; synth.cancel();
  const u = new SpeechSynthesisUtterance(text); u.rate = opt.slow ? .5 : .9; if (opt.lang) u.lang = TAG[opt.lang] || opt.lang; if (opt.el) u._el = opt.el;
  synth.speak(u);
}

/* ===== تشغيل متتابع (حوار / نص / جمل درس) ===== */
function playAll(items, btn) {
  if (!synth || !items.length) return;
  if (btn && btn === playBtn) { synth.cancel(); return }   // ضغطة ثانية = إيقاف
  synth.cancel(); const my = ++seq;
  if (btn) { btn.dataset.label = btn.dataset.label || btn.textContent; btn.classList.add("playing"); btn.textContent = "⏹ إيقاف" }
  setPlayBtn(btn || null);
  let i = 0;
  const next = () => {
    if (my !== seq) return;
    if (i >= items.length) { setPlayBtn(null); return }
    const it = items[i++], u = new SpeechSynthesisUtterance(it.text);
    u.rate = .9; u._el = it.el;
    if (it.el && it.el.scrollIntoView) it.el.scrollIntoView({ block: "nearest", behavior: "smooth" });
    u.addEventListener("end", () => setTimeout(next, 450));
    u.addEventListener("error", e => { if (!/interrupted|canceled/.test(e.error)) setTimeout(next, 200) });
    synth.speak(u);
  };
  next();
}
document.addEventListener("click", e => {
  const b = e.target.closest && e.target.closest("[data-play]"); if (!b) return;
  const p = b.dataset.play, scope = p.startsWith("#") ? document.querySelector(p) : b.closest(p); if (!scope) return;
  const items = [...scope.querySelectorAll(".sent, .bub")].map(el => { const s = el.matches("[data-say]") ? el : el.querySelector("[data-say]"); return s && { text: s.dataset.say, el } }).filter(Boolean);
  playAll(items, b);
});

/* ===== مؤثرات الإجابات (بدون ملفات صوتية) ===== */
let ac = null;
function tones(list) {
  if (!CFG.fx) return;
  try {
    ac = ac || new (window.AudioContext || window.webkitAudioContext)();
    if (ac.state === "suspended") ac.resume();
    let t = ac.currentTime + .01;
    list.forEach(([f, d, type, g]) => {
      const o = ac.createOscillator(), a = ac.createGain();
      o.type = type || "sine"; o.frequency.setValueAtTime(f, t);
      a.gain.setValueAtTime(.0001, t); a.gain.exponentialRampToValueAtTime(g || .07, t + .02); a.gain.exponentialRampToValueAtTime(.0001, t + d);
      o.connect(a); a.connect(ac.destination); o.start(t); o.stop(t + d + .05); t += d * .8;
    });
  } catch (e) {}
}
const FX = { ok: () => tones([[659, .12], [988, .2]]), no: () => tones([[220, .22, "triangle", .07], [175, .26, "triangle", .06]]), done: () => tones([[523, .12], [659, .12], [784, .12], [1047, .34]]) };
let fxAt = 0;
const fxObs = new MutationObserver(ms => {
  let ok = false, no = false;
  ms.forEach(m => {
    const c = m.target.classList; if (!c || !(c.contains("opt") || c.contains("feedback"))) return;
    const old = " " + (m.oldValue || "") + " ", added = k => c.contains(k) && !old.includes(" " + k + " ");
    if (added("no") || added("wrong")) no = true; else if (added("ok") || added("correct")) ok = true;
  });
  if ((ok || no) && Date.now() - fxAt > 250) { fxAt = Date.now(); no ? FX.no() : FX.ok() }
});
document.addEventListener("click", e => { const r = e.target.closest && e.target.closest("[data-rate]"); if (r) r.dataset.rate === "1" ? FX.ok() : FX.no() });
document.addEventListener("quizdone", () => setTimeout(FX.done, 350));

/* ===== لوحة إعدادات الصوت (تُعرض داخل ⚙️) ===== */
const HELP = /android/i.test(ua) ? "ثبّت «Speech Services by Google» من متجر Play، ثم: الإعدادات ← إمكانية الوصول ← تحويل النص إلى كلام، وحمّل اللغة."
  : /iphone|ipad|ipod/i.test(ua) ? "الإعدادات ← تسهيلات الاستخدام ← المحتوى المنطوق ← الأصوات، ثم حمّل صوت اللغة."
  : /mac os/i.test(ua) ? "إعدادات النظام ← تسهيلات الاستخدام ← المحتوى المنطوق ← صوت النظام ← إدارة الأصوات."
  : /windows/i.test(ua) ? "الإعدادات ← الوقت واللغة ← الكلام ← إضافة أصوات. أو افتح الموقع في Edge ففيه أصوات طبيعية لكل اللغات."
  : "ثبّت صوت هذه اللغة من إعدادات النظام، أو استخدم Chrome أو Edge.";
function renderVoices() {
  const vb = box && box.querySelector("#aVoices"); if (!vb) return;
  vb.innerHTML = Object.keys(TAG).map(l => {
    const list = forLang(l), best = voiceFor(l);
    if (!list.length) return `<div class="u-row"><span>${NAME[l]}</span><small class="u-warn">⚠️ لا يوجد صوت مثبّت</small><p class="u-note" style="width:100%">${HELP}</p></div>`;
    return `<div class="u-row"><span>${NAME[l]}</span><div class="u-voice"><select data-voice="${l}" aria-label="صوت ${NAME[l]}"><option value="">تلقائي: ${(best && best.name || "").replace(/^(Microsoft|Google|Apple)\s+/i, "").replace(/\s+[-–(].*$/, "").slice(0, 22)}</option>${list.map(v => `<option value="${v.voiceURI.replace(/"/g, "&quot;")}" ${CFG.voices[l] === v.voiceURI ? "selected" : ""}>${v.name.replace(/</g, "&lt;")}</option>`).join("")}</select><button type="button" class="icon-btn" data-test="${l}" aria-label="تجربة الصوت">▶️</button></div></div>`;
  }).join("") + (synth ? "" : `<p class="u-note">⚠️ متصفحك لا يدعم النطق الصوتي. استخدم Chrome أو Edge أو Safari حديثاً.</p>`);
}
function mount(el) {
  box = el; if (!el) return;
  el.innerHTML = `<div class="u-gt">🔊 الصوت والنطق</div>
  <div class="u-row"><span>سرعة النطق</span><div class="u-seg" id="aSpeed">${[[.8, "🐢 أبطأ"], [1, "عادي"], [1.15, "أسرع"]].map(([v, t]) => `<button type="button" data-speed="${v}" class="${CFG.speed === v ? "on" : ""}">${t}</button>`).join("")}</div></div>
  <div id="aVoices"></div>
  <div class="u-row"><span>مؤثرات الإجابات (صح / خطأ)</span><label class="u-switch"><input type="checkbox" id="aFx" ${CFG.fx ? "checked" : ""} aria-label="مؤثرات الإجابات"><i></i></label></div>
  <p class="u-note">💡 الأصوات التي في اسمها Natural أو Online أو Google هي الأوضح عادةً. زر 🐢 بجانب كل جملة يقرؤها ببطء.</p>`;
  el.addEventListener("click", e => {
    const s = e.target.closest("[data-speed]"); if (s) { CFG.speed = +s.dataset.speed; save(); el.querySelectorAll("[data-speed]").forEach(b => b.classList.toggle("on", b === s)); speak(SAMPLE[learn()] || SAMPLE.ja) }
    const t = e.target.closest("[data-test]"); if (t) speak(SAMPLE[t.dataset.test], { el: t });
  });
  el.addEventListener("change", e => {
    const v = e.target.closest("[data-voice]"); if (v) { const l = v.dataset.voice; if (v.value) CFG.voices[l] = v.value; else delete CFG.voices[l]; save(); speak(SAMPLE[l]) }
    if (e.target.id === "aFx") { CFG.fx = e.target.checked; save(); if (CFG.fx) FX.ok() }
  });
  renderVoices();
}

/* ===== أزرار «استمع للكل» تُضاف تلقائياً ===== */
function decorate() {
  document.querySelectorAll("#dialogs .dlg").forEach(d => {
    const h = d.querySelector("h3"); if (h && !h.querySelector(".u-playall")) h.insertAdjacentHTML("beforeend", `<button type="button" class="u-playall" data-play=".dlg">▶️ استمع للحوار</button>`);
  });
  document.querySelectorAll("#lvContent .lesson-body").forEach(b => {
    const st = [...b.querySelectorAll(".sub-title")].pop();
    if (st && !st.querySelector(".u-playall")) st.insertAdjacentHTML("beforeend", `<button type="button" class="u-playall" data-play=".lesson-body">▶️ استمع للكل</button>`);
  });
}
document.addEventListener("DOMContentLoaded", () => {
  fxObs.observe(document.body, { subtree: true, attributes: true, attributeFilter: ["class"], attributeOldValue: true });
  ["#dialogs", "#lvContent"].forEach(s => { const n = document.querySelector(s); if (n) new MutationObserver(decorate).observe(n, { childList: true }) });
  const r = document.querySelector("#rOut"); if (r) r.insertAdjacentHTML("beforebegin", `<button type="button" class="u-playall" data-play="#rOut">▶️ استمع للنص كاملاً</button>`);
  decorate();
});

window.SARI_AUDIO = { mount, speak, playAll, fx: FX, voiceFor, detect };
})();
