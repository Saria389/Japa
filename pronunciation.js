/* pronunciation.js — اختبار النطق التشخيصي (Web Speech API)
   يعتمد على window.SARI (نفس السطر المطلوب لـ multilang.js). حمّله بعد multilang.js */
document.addEventListener("DOMContentLoaded", () => {
const S = window.SARI; if (!S) return;
const $ = S.$, $$ = S.$$, store = S.store;
const VC = { ja: "ja-JP", en: "en-US", tr: "tr-TR", ar: "ar-SA" };
const lg = () => store.get("learnLang", "ja");
const SR = window.SpeechRecognition || window.webkitSpeechRecognition;

/* ===== الصفحة والرابط ===== */
document.head.insertAdjacentHTML("beforeend", `<style>
#pMic{font-size:18px;padding:14px 26px;margin:14px 0}
#pMic.rec{animation:pulse 1s infinite;background:#c62828}
@keyframes pulse{0%{box-shadow:0 0 0 0 rgba(198,40,40,.5)}100%{box-shadow:0 0 0 18px rgba(198,40,40,0)}}
.p-heard{font-size:20px;font-weight:800;margin:6px 0;direction:auto}
</style>`);
$("#nav").insertAdjacentHTML("beforeend", `<a href="#pron" data-page="pron" data-ar="🎤 النطق">🎤 النطق</a>`);
$("main").insertAdjacentHTML("beforeend", `<div id="pron" class="page-section"><section class="box"><h2>اختبار النطق التشخيصي 🎤</h2><div id="pBox"></div></section></div>`);

/* ===== مقارنة النص المنطوق بالهدف ===== */
const norm = (s, l) => {
  s = String(s).normalize("NFKC"); s = l === "tr" ? s.toLocaleLowerCase("tr") : s.toLowerCase();
  if (l === "ja") s = s.replace(/[ァ-ヶ]/g, c => String.fromCharCode(c.charCodeAt(0) - 0x60));
  if (l === "ar") s = s.replace(/[\u064B-\u0652\u0640]/g, "").replace(/[إأآ]/g, "ا").replace(/ى/g, "ي").replace(/ة/g, "ه");
  return s.replace(/[^\p{L}\p{N}]/gu, "");
};
const lev = (a, b) => { const m = [...Array(b.length + 1).keys()]; for (let i = 1; i <= a.length; i++) { let p = m[0]; m[0] = i; for (let j = 1; j <= b.length; j++) { const t = m[j]; m[j] = Math.min(m[j] + 1, m[j - 1] + 1, p + (a[i - 1] === b[j - 1] ? 0 : 1)); p = t } } return m[b.length] };
const sim = (a, b) => { if (!a || !b) return 0; if (b.length >= 3 && a.includes(b)) return Math.max(.9, 1 - (a.length - b.length) / a.length); return 1 - lev(a, b) / Math.max(a.length, b.length) };
function score(heard, item, l) {
  const targets = [item[0], ...String(item[1]).split(" / ")].map(x => norm(x, l)).filter(Boolean);
  let best = 0; heard.forEach(h => targets.forEach(t => best = Math.max(best, sim(norm(h, l), t)))); return best;
}

/* ===== الأسئلة ===== */
const pool = () => Object.values(S.LEVELS).flatMap(L => L.lessons.flatMap(ls => [...ls.vocab, ...ls.sentences]));
const speak = (t, l) => { if (!("speechSynthesis" in window)) return; speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(t); u.lang = VC[l]; u.rate = .85; speechSynthesis.speak(u) };
let Q = null, rec = null;

function intro() {
  const l = lg();
  $("#pBox").innerHTML = !SR
    ? `<div class="warn">⚠️ متصفحك لا يدعم التعرف على الصوت. استخدم Chrome أو Edge (أو Safari حديث)، والموقع يجب أن يعمل عبر https أو localhost.</div>`
    : `<p>ستظهر لك 10 كلمات أو جمل، اضغط 🎤 وانطقها بصوت واضح. اللغة الحالية: <b>${{ ja: "اليابانية", en: "الإنجليزية", tr: "التركية", ar: "العربية" }[l]}</b>. تحتاج للسماح باستخدام الميكروفون عند أول مرة.</p>
       <p style="font-size:14px">الدقة تقريبية، فالتعرف على الصوت يختلف بين المتصفحات والأجهزة.</p>
       <button class="btn-action" id="pGo">ابدأ الاختبار 🎤</button> <small>أفضل نتيجة: ${store.get("pron_best", {})[l] ?? "—"}</small>`;
  $("#pGo") && ($("#pGo").onclick = start);
}
function start() {
  const l = lg(), p = pool(); if (!p.length) return;
  Q = { l, items: p.sort(() => Math.random() - .5).slice(0, 10), i: 0, pts: 0 }; show();
}
function show() {
  if (Q.i >= Q.items.length) return end();
  const it = Q.items[Q.i];
  $("#pBox").innerHTML = `<div class="quiz-card"><div class="bar"><i style="width:${Q.i / Q.items.length * 100}%"></i></div>
  <div class="quiz-hint">${Q.i + 1} / ${Q.items.length} · ${Q.pts} نقطة</div>
  <div class="quiz-q">${it[0]}</div>${it[0] !== it[1] ? `<div class="quiz-hint">${it[1]}</div>` : ""}<div class="quiz-hint">${it[2]}</div><p>${it[3]}</p>
  <div class="speed-row" style="justify-content:center"><button class="btn-action btn-ghost" id="pHear">🔊 استمع</button></div>
  <button class="btn-action" id="pMic">🎤 اضغط وتحدّث</button><div id="pRes"></div>
  <button class="btn-action btn-ghost" id="pSkip">تخطّي ←</button></div>`;
  $("#pHear").onclick = () => speak(String(it[1]).split(" / ")[0], Q.l);
  $("#pSkip").onclick = () => { Q.i++; show() }; $("#pMic").onclick = () => listen(it);
}
function listen(it) {
  const mic = $("#pMic"), res = $("#pRes"); if (rec) try { rec.abort() } catch (e) {}
  speechSynthesis.cancel(); rec = new SR(); rec.lang = VC[Q.l]; rec.interimResults = false; rec.maxAlternatives = 5;
  let got = false; mic.classList.add("rec"); mic.textContent = "🎙️ أستمع إليك…"; res.innerHTML = "";
  rec.onresult = e => { got = true; verdict(it, [...e.results[0]].map(x => x.transcript)) };
  rec.onerror = e => { got = true; res.innerHTML = `<div class="feedback wrong" style="display:block">${{ "not-allowed": "🚫 لم يُسمح بالميكروفون. فعّله من إعدادات المتصفح.", "service-not-allowed": "🚫 لم يُسمح بالميكروفون.", "no-speech": "🔇 لم أسمع صوتاً، حاول مجدداً.", "network": "🌐 خدمة التعرف تحتاج اتصالاً بالإنترنت.", "language-not-supported": "⚠️ هذه اللغة غير مدعومة في متصفحك." }[e.error] || "⚠️ تعذّر التعرف: " + e.error}</div>` };
  rec.onend = () => { mic.classList.remove("rec"); mic.textContent = "🎤 حاول مرة أخرى"; if (!got) res.innerHTML = `<div class="feedback wrong" style="display:block">🔇 لم أسمع صوتاً، حاول مجدداً.</div>` };
  try { rec.start() } catch (e) {}
}
function verdict(it, heard) {
  const sc = score(heard, it, Q.l), pct = Math.round(sc * 100);
  const [cls, msg, pts] = sc >= .85 ? ["correct", "✅ نطق صحيح! ممتاز", 10] : sc >= .6 ? ["correct", "🟡 قريب جداً، كرّر بوضوح أكثر", 5] : ["wrong", "❌ لم يطابق النطق، استمع وحاول مجدداً", 0];
  if (!Q.done) Q.done = {}; if ((Q.done[Q.i] || 0) < pts) { Q.pts += pts - (Q.done[Q.i] || 0); Q.done[Q.i] = pts }
  $("#pRes").innerHTML = `<div class="p-heard">سمعتك: «${S.esc(heard[0])}» · تطابق ${pct}%</div><div class="feedback ${cls}" style="display:block">${msg}</div>` +
    (sc >= .6 ? `<button class="btn-action" id="pNext">التالي ←</button>` : "");
  if ($("#pNext")) $("#pNext").onclick = () => { Q.i++; show() };
}
function end() {
  const max = Q.items.length * 10, b = store.get("pron_best", {}); if (!b[Q.l] || Q.pts > b[Q.l]) b[Q.l] = Q.pts; store.set("pron_best", b);
  document.dispatchEvent(new CustomEvent("quizdone", { detail: Math.round(Q.pts / max * 100) }));
  $("#pBox").innerHTML = `<div class="quiz-card"><h3>🎉 انتهى اختبار النطق</h3><div class="score">${Q.pts} / ${max}</div>
  <p>${Q.pts >= max * .8 ? "🏆 نطقك ممتاز!" : Q.pts >= max / 2 ? "👍 جيد، واصل التدريب." : "💪 كرّر الاستماع ثم النطق، وستتحسن."}</p><p>أفضل نتيجة: ${b[Q.l]} / ${max}</p>
  <button class="btn-action" id="pAgain">إعادة 🔄</button></div>`;
  $("#pAgain").onclick = start;
}
document.addEventListener("click", e => { if (e.target.closest('[data-page="pron"]')) setTimeout(intro, 0) });
const sel = $("#learnLang"); if (sel) sel.addEventListener("change", () => { if (rec) try { rec.abort() } catch (e) {} intro() });
intro();
});
