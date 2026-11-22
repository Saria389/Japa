/* exam.js — «نماذج الامتحان» 🎓 (حمّله بعد practice.js)
   امتحان تجريبي من 20 سؤالاً: 📖 مفردات · 🧩 قواعد · 🎧 استماع · 📜 قراءة، بمؤقت 20 دقيقة ونتيجة لكل قسم ومراجعة للأخطاء */
document.addEventListener("DOMContentLoaded", () => {
const S = window.SARI; if (!S) return;
const $ = S.$, $$ = S.$$, store = S.store, esc = S.esc;
const lg = () => store.get("learnLang", "ja");
const shuffle = a => { a = [...a]; for (let i = a.length - 1; i > 0; i--) { const j = Math.random() * (i + 1) | 0; [a[i], a[j]] = [a[j], a[i]] } return a };
const T = s => s.trim().split(";").map(x => x.trim().split("|"));
const say1 = v => String(v[1]).split(" / ")[0];

/* نصوص القراءة: النص|السؤال|الجواب الصحيح|خيار|خيار|خيار|توضيح السؤال */
const READ = {
ja: T(`わたしはサリです。シリアから来ました。今、東京に住んでいます。毎朝、電車で学校へ行きます。|サリさんは毎朝、何で学校へ行きますか。|電車|バス|自転車|歩いて|كيف يذهب ساري إلى المدرسة كل صباح؟;
今日は日曜日です。天気がいいので、友達と公園へ行きました。公園でお弁当を食べました。とても楽しかったです。|どこでお弁当を食べましたか。|公園|家|学校|駅|أين أكلوا علبة الطعام؟;
田中さんは毎日七時に起きます。朝ご飯を食べてから、八時に会社へ行きます。夜は十一時に寝ます。|田中さんは何時に会社へ行きますか。|八時|七時|十一時|九時|متى يذهب تاناكا إلى الشركة؟;
このレストランは安くて、おいしいです。でも、いつも人が多いので、少し待たなければなりません。|このレストランのよくないところは何ですか。|待たなければならない|高い|おいしくない|遠い|ما الشيء غير الجيد في هذا المطعم؟`),
en: T(`Tom lives in London with his family. He works at a hospital. Every weekend, he plays football with his friends.|Where does Tom work?|At a hospital|At a school|At a bank|At home|أين يعمل توم؟;
Yesterday was Sara's birthday. Her friends gave her a big cake and some flowers. She was very happy.|Why was Sara happy?|It was her birthday|She found a new job|She traveled to Japan|She passed an exam|لماذا كانت سارة سعيدة؟;
The museum opens at nine o'clock and closes at five. It is closed on Mondays. Tickets are free for students.|When is the museum closed?|On Mondays|On Fridays|At nine o'clock|On weekends|متى يكون المتحف مغلقاً؟`),
tr: T(`Benim adım Ali. İstanbul'da yaşıyorum. Her sabah çay içerim ve okula otobüsle giderim.|Ali okula nasıl gidiyor?|Otobüsle|Trenle|Yürüyerek|Arabayla|كيف يذهب علي إلى المدرسة؟;
Dün hava çok güzeldi. Ayşe arkadaşlarıyla parka gitti ve dondurma yedi.|Ayşe parkta ne yedi?|Dondurma|Pizza|Ekmek|Meyve|ماذا أكلت عائشة في الحديقة؟;
Mehmet bir doktor. Hastanede çalışıyor. Hafta sonu ailesiyle denize gidiyor.|Mehmet hafta sonu nereye gidiyor?|Denize|Hastaneye|Okula|Dağa|إلى أين يذهب محمد في عطلة الأسبوع؟`),
ar: T(`اسمي أحمد. أسكن في دمشق. أعمل معلماً في مدرسة كبيرة. أحب القراءة والسفر.|ماذا يعمل أحمد؟|معلم|طبيب|مهندس|سائق|What is Ahmad's job?;
ذهبت فاطمة إلى السوق صباحاً. اشترت خبزاً وفاكهة، ثم رجعت إلى البيت.|ماذا اشترت فاطمة؟|خبزاً وفاكهة|لحماً وأرزاً|قهوة وشاياً|كتباً وأقلاماً|What did Fatima buy?;
يفتح المتحف في الساعة التاسعة صباحاً ويغلق في الخامسة مساءً. الدخول مجاني يوم الجمعة.|متى يكون الدخول مجانياً؟|يوم الجمعة|كل يوم|يوم الأحد|في المساء|When is entry free?`)
};
const MODELS = { ja: [["N5", "مبتدئ"], ["N4", "أساسي"], ["N3", "متوسط"]], en: [], tr: [], ar: [] };
["en", "tr", "ar"].forEach(l => MODELS[l] = [["A1", "مبتدئ"], ["A2", "أساسي"], ["B1", "متوسط"], ["B2", "فوق المتوسط"], ["C1", "متقدم"], ["C2", "إتقان"]]);
const SEC = { voc: "📖 المفردات", gram: "🧩 القواعد", lis: "🎧 الاستماع", read: "📜 القراءة" };

$("#nav").insertAdjacentHTML("beforeend", `<a href="#exam" data-page="exam" data-ar="🎓 نماذج الامتحان">🎓 نماذج الامتحان</a>`);
$("main").insertAdjacentHTML("beforeend", `<div id="exam" class="page-section"><section class="box"><h2>نماذج الامتحان 🎓</h2>
<p>امتحان تجريبي كامل مثل الامتحانات الحقيقية: 20 سؤالاً في المفردات والقواعد والاستماع والقراءة، مع مؤقت 20 دقيقة. لا تظهر الإجابات الصحيحة إلا في النهاية.</p>
<div id="exBox"></div></section></div>`);

let E = null, timer = null;
function intro() {
  clearInterval(timer); E = null; const b = store.get("exam_best", {}), l = lg();
  $("#exBox").innerHTML = `<div class="ex-models">${(MODELS[l] || []).filter(([lv]) => S.LEVELS[lv]).map(([lv, d]) => `<div class="card ex-model lv-${lv}"><span class="lv-badge">${lv}</span><h3>نموذج ${lv} — ${d}</h3>
    <p>20 سؤالاً · 20 دقيقة · النجاح من 60%</p>${b[l + "_" + lv] != null ? `<small>أفضل نتيجة: ${b[l + "_" + lv]}%</small>` : "<small>لم تجربه بعد</small>"}
    <button type="button" class="btn-action" data-exam="${lv}">ابدأ الامتحان ←</button></div>`).join("")}</div>
    <p class="u-note">💡 نصيحة: قبل الامتحان راجع دروس المستوى ثم جرّب «التدريب». استخدم سماعات في قسم الاستماع.</p>`;
}
function build(lv) {
  const L = S.LEVELS[lv], voc = L.lessons.flatMap(l => l.vocab), sents = L.lessons.flatMap(l => l.sentences);
  const allSents = Object.values(S.LEVELS).flatMap(x => x.lessons.flatMap(l => l.sentences)), qs = [];
  const wrongFrom = (pool, a) => shuffle([...new Set(pool.filter(m => m !== a))]).slice(0, 3);
  shuffle(voc).slice(0, 8).forEach(v => qs.push({ sec: "voc", q: `<div class="quiz-q">${esc(v[0])}</div>${v[0] !== v[1] ? `<div class="quiz-hint">${esc(v[1])}</div>` : ""}<p>ما معنى هذه الكلمة؟</p>`, o: shuffle([v[3], ...wrongFrom(voc.map(x => x[3]), v[3])]), a: v[3], brief: v[0] }));
  const F = (window.SARI_PRACTICE && SARI_PRACTICE.FILL[lg()]) || [];
  shuffle(F).slice(0, 5).forEach(f => qs.push({ sec: "gram", q: `<p>اختر الكلمة المناسبة للفراغ:</p><div class="pr-sent">${esc(f[0]).replace(/＿+/, '<span class="pr-blank">؟</span>')}</div><p class="quiz-hint">${esc(f[5])}</p>`, o: shuffle(f.slice(1, 5)), a: f[1], brief: f[0].replace(/＿+/, f[1]) }));
  shuffle(sents).slice(0, 4).forEach(s => qs.push({ sec: "lis", q: `<p>استمع ثم اختر المعنى الصحيح:</p><div class="speed-row" style="justify-content:center"><button type="button" class="btn-action" data-say="${esc(s[1])}">🔊 استمع</button><button type="button" class="btn-action btn-ghost" data-say="${esc(s[1])}" data-slow="1">🐢 ببطء</button></div>`, o: shuffle([s[3], ...wrongFrom(allSents.map(x => x[3]), s[3])]), a: s[3], brief: s[0], auto: s[1] }));
  shuffle(READ[lg()] || []).slice(0, 3).forEach(r => qs.push({ sec: "read", q: `<div class="ex-pass" data-say="${esc(r[0])}" title="اضغط للاستماع"><span>${esc(r[0])}</span><span class="spk">🔊</span></div><p style="margin-top:12px"><b>${esc(r[1])}</b></p><p class="quiz-hint">${esc(r[6] || "")}</p>`, o: shuffle(r.slice(2, 6)), a: r[2], brief: r[1] }));
  return qs;
}
function start(lv) {
  if (!S.LEVELS[lv]) return;
  if (!$("#exam").classList.contains("active-page")) { const a = $('nav a[data-page="exam"]'); if (a) a.click() }
  E = { lv, i: 0, qs: build(lv), ans: [], end: Date.now() + 20 * 60 * 1000 };
  clearInterval(timer); timer = setInterval(tick, 1000); show();
}
function tick() {
  const t = $("#exTime"); if (!E || !t) return clearInterval(timer);
  const left = Math.max(0, E.end - Date.now()), m = Math.floor(left / 60000), s = Math.floor(left / 1000) % 60;
  t.textContent = `⏱️ ${m}:${String(s).padStart(2, "0")}`; t.classList.toggle("low", left < 120000);
  if (!left) finish();
}
function show() {
  const q = E.qs[E.i]; if (!q) return finish();
  $("#exBox").innerHTML = `<div class="quiz-card"><div class="ex-top"><span class="ex-sec">${SEC[q.sec]}</span><span>${E.lv} · السؤال ${E.i + 1} / ${E.qs.length}</span><span class="ex-time" id="exTime"></span></div>
  <div class="bar"><i style="width:${E.i / E.qs.length * 100}%"></i></div>${q.q}
  <div class="quiz-options">${q.o.map((o, i) => `<button type="button" class="opt${E.ans[E.i] === o ? " sel" : ""}" data-xo="${i}">${esc(o)}</button>`).join("")}</div>
  <div class="speed-row" style="justify-content:center;margin-top:16px">${E.i ? `<button type="button" class="btn-action btn-ghost" id="exPrev">→ السابق</button>` : ""}<button type="button" class="btn-action" id="exNext" ${E.ans[E.i] == null ? "disabled" : ""}>${E.i === E.qs.length - 1 ? "إنهاء وتصحيح ✓" : "التالي ←"}</button></div>
  <p class="u-note" style="text-align:center"><button type="button" class="u-playall" id="exQuit">إنهاء الامتحان الآن</button></p></div>`;
  tick();
  $$("#exBox [data-xo]").forEach(b => b.onclick = () => { E.ans[E.i] = q.o[+b.dataset.xo]; $$("#exBox [data-xo]").forEach(x => x.classList.toggle("sel", x === b)); $("#exNext").disabled = false });
  $("#exNext").onclick = () => { if (E.ans[E.i] == null) return; E.i++; show() };
  if ($("#exPrev")) $("#exPrev").onclick = () => { E.i--; show() };
  $("#exQuit").onclick = () => { if (confirm("هل تريد إنهاء الامتحان وتصحيح ما أجبت عنه؟")) finish() };
  if (q.auto && window.SARI_AUDIO) setTimeout(() => SARI_AUDIO.speak(q.auto, { lang: lg() }), 300);
}
function finish() {
  clearInterval(timer); if (!E) return;
  const per = {}, wrong = []; let sc = 0;
  E.qs.forEach((q, i) => { per[q.sec] = per[q.sec] || [0, 0]; per[q.sec][1]++; if (E.ans[i] === q.a) { sc++; per[q.sec][0]++ } else wrong.push([q, E.ans[i]]) });
  const pct = Math.round(sc / E.qs.length * 100), pass = pct >= 60, k = lg() + "_" + E.lv, b = store.get("exam_best", {});
  if (b[k] == null || pct > b[k]) b[k] = pct; store.set("exam_best", b);
  document.dispatchEvent(new CustomEvent("quizdone", { detail: pct }));
  $("#exBox").innerHTML = `<div class="quiz-card"><h3>${pass ? "🎉 ناجح! مبروك" : "📚 لم تنجح هذه المرة"}</h3><div class="score">${pct}%</div><p>${sc} من ${E.qs.length} إجابة صحيحة في نموذج ${E.lv} · أفضل نتيجة: ${b[k]}%</p>
  <div class="ex-res">${Object.entries(per).map(([s, [a, n]]) => `<div><b>${SEC[s]}</b><br>${a} / ${n}</div>`).join("")}</div>
  <p>${pass ? "مستواك ممتاز في هذا النموذج. جرّب النموذج التالي!" : "راجع الأقسام التي أخطأت فيها، ثم أعد المحاولة. النجاح يبدأ من 60%."}</p>
  ${wrong.length ? `<details class="ex-rev"><summary><b>راجع أخطاءك (${wrong.length})</b></summary><ul>${wrong.map(([q, a]) => `<li>${SEC[q.sec]} — <span class="jp">${esc(q.brief)}</span><br>✔ ${esc(q.a)}${a != null ? ` · ✖ ${esc(a)}` : " · (لم تُجب)"}</li>`).join("")}</ul></details>` : ""}
  <div class="speed-row" style="justify-content:center"><button type="button" class="btn-action" data-exam="${E.lv}">إعادة 🔄</button><button type="button" class="btn-action btn-ghost" id="exBack">كل النماذج</button></div></div>`;
  $("#exBack").onclick = intro; E = null;
}
document.addEventListener("click", e => { const b = e.target.closest("[data-exam]"); if (b) start(b.dataset.exam) });
document.addEventListener("change", e => { if (e.target.id === "learnLang") intro() });
intro();
window.SARI_EXAM = { start };
});
