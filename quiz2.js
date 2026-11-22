/* quiz2.js — محرك الاختبارات الجديد 🎯 (حمّله بعد practice.js)
   · أسئلة متنوعة من كل عنصر: المعنى، العكسي، الاستماع، القراءة (للكانجي)، معنى الجملة، الاستماع للجملة
   · لا تتكرر الأسئلة: يتذكّر ما سألك عنه ويقدّم الأقدم والجديد أولاً، ويعيد أخطاءك أكثر
   · خيارات مختلفة كل مرة، ووضع «🎲 مختلط» من كل المستويات و«🔁 أخطائي»
   · يعمل لكل اللغات والمستويات، ويضم كلمات القاموس للإنجليزية والتركية والعربية */
document.addEventListener("DOMContentLoaded", () => {
const S = window.SARI; if (!S) return;
const $ = S.$, $$ = S.$$, store = S.store, esc = S.esc;
const lg = () => store.get("learnLang", "ja");
const shuffle = a => { a = [...a]; for (let i = a.length - 1; i > 0; i--) { const j = Math.random() * (i + 1) | 0; [a[i], a[j]] = [a[j], a[i]] } return a };
const say1 = v => String(v[1]).split(" / ")[0];
const speak = (t, slow) => window.SARI_AUDIO && SARI_AUDIO.speak(t, { lang: lg(), slow });
const card = $("#quiz .quiz-card"); if (!card) return;
const SEEN = () => "qz_seen_" + lg(), WRONG = () => "qz_wrong_" + lg();

/* ===== بنك العناصر ===== */
const KANA = "あa いi うu えe おo かka きki くku けke こko さsa しshi すsu せse そso たta ちchi つtsu てte とto なna にni ぬnu ねne のno はha ひhi ふfu へhe ほho まma みmi むmu めme もmo やya ゆyu よyo らra りri るru れre ろro わwa をwo んn がga ぎgi ぐgu げge ごgo ざza じji ずzu ぜze ぞzo だda でde どdo ばba びbi ぶbu べbe ぼbo ぱpa ぴpi ぷpu ぺpe ぽpo".split(" ").map(x => [x[0], x.slice(1)]);
const toKata = c => String.fromCharCode(c.charCodeAt(0) + 0x60);
function levelItems(lv) {
  const L = S.LEVELS[lv]; if (!L) return [];
  const out = [];
  L.lessons.forEach(ls => {
    ls.vocab.forEach(v => out.push({ k: `${lv}|w|${v[0]}`, t: "w", v, lv }));
    ls.sentences.concat(ls.grammar.map(g => g[2])).forEach(s => out.push({ k: `${lv}|s|${s[0]}`, t: "s", v: s, lv }));
  });
  // كلمات القاموس الثلاثي تُضاف للمستوى الأول في الإنجليزية والتركية والعربية
  const l = lg(), first = Object.keys(S.LEVELS)[0], col = { en: [0, 2], tr: [1, 2], ar: [2, 0] }[l];
  if (col && lv === first) (window.SARI_DICT || []).forEach(r => { const w = r[col[0]], m = r[col[1]]; if (w && m) out.push({ k: `${lv}|d|${w}`, t: "w", v: [w, w, "", m], lv }) });
  return out;
}
const kanaItems = kata => KANA.map(([c, r]) => { const ch = kata ? toKata(c) : c; return { k: `${kata ? "kata" : "hira"}|${ch}`, t: "k", v: [ch, r], lv: kata ? "kata" : "hira" } });
const allItems = () => Object.keys(S.LEVELS).flatMap(levelItems);
function itemsFor(mode) {
  if (mode === "hira" || mode === "kata") return kanaItems(mode === "kata");
  if (mode === "mix") return allItems();
  if (mode === "wrong") { const w = new Set(store.get(WRONG(), [])); return allItems().concat(lg() === "ja" ? kanaItems(false).concat(kanaItems(true)) : []).filter(i => w.has(i.k)) }
  return levelItems(mode);
}
/* اختيار بدون تكرار: الجديد والأقدم أولاً، والأخطاء تعود أسرع */
function choose(items, n) {
  const seen = store.get(SEEN(), {}), wrong = new Set(store.get(WRONG(), [])), day = 864e5;
  return items.map(it => ({ it, s: (seen[it.k] || 0) - (wrong.has(it.k) ? 3 * day : 0) + Math.random() * day * .5 }))
    .sort((a, b) => a.s - b.s).slice(0, n).map(x => x.it);
}

/* ===== توليد سؤال من عنصر ===== */
const uniq = (arr, ans) => shuffle([...new Set(arr.filter(x => x && x !== ans))]);
function build(it, pool) {
  const same = pool.filter(x => x.t === it.t), v = it.v;
  const opts = (ans, get, extra) => shuffle([ans, ...uniq(same.map(x => get(x.v)).concat(extra || []), ans).slice(0, 3)]);
  if (it.t === "k") {
    const ty = ["char", "rom", "lis"][Math.random() * 3 | 0];
    if (ty === "rom") return { ty, q: `<div class="quiz-q" style="font-family:inherit;direction:ltr">${esc(v[1])}</div><p>أي حرف يُنطق هكذا؟</p>`, o: opts(v[0], x => x[0]), a: v[0], say: v[0], note: `${v[0]} = ${v[1]}` };
    if (ty === "lis") return { ty, q: `<p>استمع: أي حرف هذا؟</p>${playBtns(v[0])}`, o: opts(v[0], x => x[0]), a: v[0], say: v[0], auto: v[0], note: `${v[0]} = ${v[1]}` };
    return { ty, q: `<div class="quiz-q">${esc(v[0])}</div><p>ما نطق هذا الحرف؟</p>`, o: opts(v[1], x => x[1]), a: v[1], say: v[0], note: `${v[0]} = ${v[1]}` };
  }
  const read = v[0] !== v[1] ? `<div class="quiz-hint">${esc(v[1])}</div>` : "", ro = v[2] ? ` · ${v[2]}` : "";
  const note = `${v[0]}${v[0] !== v[1] ? " (" + v[1] + ")" : ""}${ro} = ${v[3]}`;
  if (it.t === "s") {
    if (Math.random() < .5) return { ty: "slis", q: `<p>استمع للجملة واختر معناها</p>${playBtns(v[1])}`, o: opts(v[3], x => x[3]), a: v[3], say: v[1], auto: v[1], note };
    return { ty: "smean", q: `<div class="pr-sent">${esc(v[0])}</div><p>ما معنى هذه الجملة؟</p>`, o: opts(v[3], x => x[3]), a: v[3], say: v[1], note };
  }
  const types = ["mean", "mean", "rev", "lis"].concat(lg() === "ja" && v[0] !== v[1] && /[一-鿿]/.test(v[0]) ? ["read", "read"] : []);
  const ty = types[Math.random() * types.length | 0];
  if (ty === "rev") return { ty, q: `<div class="quiz-q" style="font-family:inherit;font-size:30px">${esc(v[3])}</div><p>اختر الكلمة الصحيحة لهذا المعنى</p>`, o: opts(v[0], x => x[0]), a: v[0], say: say1(v), note };
  if (ty === "lis") return { ty, q: `<p>استمع للكلمة واختر معناها</p>${playBtns(say1(v))}`, o: opts(v[3], x => x[3]), a: v[3], say: say1(v), auto: say1(v), note };
  if (ty === "read") return { ty, q: `<div class="quiz-q">${esc(v[0])}</div><p>كيف تُقرأ هذه الكلمة؟</p>`, o: opts(v[1], x => x[1]), a: v[1], say: say1(v), note };
  return { ty: "mean", q: `<div class="quiz-q">${esc(v[0])}</div>${read}<p>ما معنى هذه الكلمة؟</p>`, o: opts(v[3], x => x[3]), a: v[3], say: say1(v), note };
}
const playBtns = t => `<div class="speed-row" style="justify-content:center"><button type="button" class="btn-action" data-say="${esc(t)}" style="font-size:24px">🔊 استمع</button><button type="button" class="btn-action btn-ghost" data-say="${esc(t)}" data-slow="1">🐢 ببطء</button></div>`;
const TYN = { mean: "📖 المعنى", rev: "🔄 عكسي", lis: "🎧 استماع", read: "🔤 القراءة", smean: "💬 جملة", slis: "🎧 جملة مسموعة", char: "🔤 نطق الحرف", rom: "🔤 من النطق للحرف", lis2: "" };

/* ===== 🤖 الأسئلة الذكية (يولّدها الذكاء الاصطناعي في كل مرة) ===== */
const C = () => window.SARI_CLOUD;
const mini = t => esc(t || "").replace(/\*\*(.+?)\*\*/g, "<b>$1</b>").replace(/\n/g, "<br>");
function aiPick() {
  const lvs = Object.keys(S.LEVELS), cur = store.get("qz_ailv_" + lg(), lvs[0]);
  card.innerHTML = `<h3>🤖 أسئلة ذكية</h3><p>يكتب الذكاء الاصطناعي أسئلة جديدة تماماً في كل مرة، بأنواع متنوعة، حسب المستوى الذي تختاره.</p>
  <div class="speed-row" style="justify-content:center"><span>المستوى:</span>${lvs.map(l => `<button type="button" class="tab-btn lv-${l}${l === cur ? " active" : ""}" data-ailv="${l}">${l}</button>`).join("")}</div>
  <label class="speed-row" style="justify-content:center">ركّز على (اختياري): <input type="text" id="aiFocus" placeholder="مثلاً: الأدوات، الأفعال، الطعام..." style="max-width:260px"></label>
  <button type="button" class="btn-action" id="aiGo">✨ أنشئ الاختبار</button>
  ${C() && C().user() ? "" : `<p class="u-note">${C() ? C().AI_ERR.login : ""}</p>`}`;
}
async function aiStart() {
  const lv = store.get("qz_ailv_" + lg(), Object.keys(S.LEVELS)[0]), focus = ($("#aiFocus") || {}).value || "";
  if (!C() || !C().user()) { aiPick(); return }
  card.innerHTML = `<h3>🤖 يكتب الذكاء الاصطناعي أسئلتك…</h3><p class="ai-thinking"><span>●</span><span>●</span><span>●</span></p><p class="u-note">مستوى ${lv} · قد يستغرق ذلك بضع ثوانٍ</p>`;
  const recent = store.get("qz_ai_recent", []);
  const { data, err } = await C().ai("quiz", { n: store.get("qz_len", 10) > 15 ? 15 : store.get("qz_len", 10), level: lv, focus, avoid: recent });
  if (err || !data || !data.questions) { card.innerHTML = `<p>${err ? C().AI_ERR[err] : "لم يتمكن الذكاء الاصطناعي من إنشاء الأسئلة، حاول مرة أخرى."}</p><button type="button" class="btn-action" data-qz="ai">🔄 حاول مجدداً</button>`; return }
  store.set("qz_ai_recent", recent.concat(data.questions.map(q => q.q)).slice(-40));
  Q = { mode: "ai", i: 0, sc: 0, miss: [], qs: data.questions.map(q => ({ it: { k: "ai|" + q.q }, ty: "ai", tyName: "🤖 " + (q.type || "سؤال ذكي"), q: `<div class="pr-sent" style="font-size:20px">${mini(q.q)}</div>${q.say ? playBtns(q.say) : ""}`, plain: q.q, o: q.o, a: q.o[q.a], say: q.say || "", note: q.ex || "" })) };
  show();
}

/* ===== تشغيل الاختبار ===== */
let Q = null;
function start(mode, n) {
  if (mode === "ai") { $$("#quizModes .tab-btn").forEach(b => b.classList.toggle("active", b.dataset.mode === "ai")); aiPick(); return }
  n = n || store.get("qz_len", 10);
  const items = itemsFor(mode);
  if (items.length < 4) { card.innerHTML = `<p>${mode === "wrong" ? "🎉 لا توجد أخطاء محفوظة للمراجعة الآن!" : "لا توجد عناصر كافية في هذا المستوى بعد."}</p>`; return }
  const pool = mode === "hira" || mode === "kata" ? items : allItems();
  const pick = choose(items, Math.min(n, items.length));
  Q = { mode, i: 0, sc: 0, qs: pick.map(it => ({ it, ...build(it, pool.length >= 8 ? pool : items) })), miss: [] };
  $$("#quizModes .tab-btn").forEach(b => b.classList.toggle("active", b.dataset.mode === mode));
  show();
}
function show() {
  const q = Q.qs[Q.i]; if (!q) return end();
  const seen = store.get(SEEN(), {}); seen[q.it.k] = Date.now();
  const ks = Object.keys(seen); if (ks.length > 3000) ks.sort((a, b) => seen[a] - seen[b]).slice(0, 500).forEach(k => delete seen[k]);
  store.set(SEEN(), seen);
  card.innerHTML = `<div class="ex-top"><span class="ex-sec">${q.tyName || TYN[q.ty] || ""}</span><span>السؤال ${Q.i + 1} / ${Q.qs.length}</span><span>✔ ${Q.sc}</span></div>
  <div class="bar"><i style="width:${Q.i / Q.qs.length * 100}%"></i></div>${q.q}
  <div class="quiz-options">${q.o.map((o, i) => `<button type="button" class="opt${/[぀-ヿ一-鿿]/.test(o) ? " jp" : ""}" data-qi="${i}">${esc(o)}</button>`).join("")}</div><div id="qzFeed"></div>`;
  $$("#quiz [data-qi]").forEach(b => b.onclick = () => answer(b, q));
  if (q.auto) setTimeout(() => speak(q.auto), 250);
}
function answer(b, q) {
  if (Q.lock) return; Q.lock = true;
  const ok = q.o[+b.dataset.qi] === q.a, wrong = new Set(store.get(WRONG(), []));
  $$("#quiz [data-qi]").forEach(x => { if (q.o[+x.dataset.qi] === q.a) x.classList.add("ok") }); if (!ok) b.classList.add("no");
  if (ok) { Q.sc++; wrong.delete(q.it.k) } else { if (q.ty !== "ai") wrong.add(q.it.k); Q.miss.push(q) }
  store.set(WRONG(), [...wrong].slice(-400));
  if (q.say && q.ty !== "lis" && q.ty !== "slis") speak(q.say);
  Q.last = { q, chosen: q.o[+b.dataset.qi] };
  $("#qzFeed").innerHTML = `<div class="feedback ${ok ? "correct" : "wrong"}" style="display:block">${ok ? "✨ صحيح!" : "❌ الصحيح: " + esc(q.a)}</div>
  <p class="jp" style="margin:8px 0">${q.ty === "ai" ? mini(q.note) : esc(q.note)} ${q.say ? `<button type="button" class="u-playall" data-say="${esc(q.say)}">🔊</button>` : ""}</p>
  ${ok ? "" : `<button type="button" class="u-playall" id="qzWhy">🤖 اشرح لي لماذا</button><div id="qzWhyOut" class="ai-md" style="text-align:start;margin:8px 0"></div>`}
  <button type="button" class="btn-action" id="qzNext">${Q.i === Q.qs.length - 1 ? "النتيجة 🏁" : "التالي ←"}</button>`;
  $("#qzNext").onclick = () => { Q.lock = false; Q.i++; show() };
}
function end() {
  const n = Q.qs.length, pct = Math.round(Q.sc / n * 100), b = store.get("qz_best", {}), k = lg() + "_" + Q.mode;
  if (b[k] == null || pct > b[k]) b[k] = pct; store.set("qz_best", b);
  document.dispatchEvent(new CustomEvent("quizdone", { detail: pct }));
  card.innerHTML = `<h3>${pct === 100 ? "🏆 ممتاز! كل الإجابات صحيحة" : pct >= 60 ? "🎉 أحسنت!" : "💪 واصل المحاولة"}</h3><div class="score">${Q.sc} / ${n}</div><p>${pct}% · أفضل نتيجة في هذا الاختبار: ${b[k]}%</p>
  ${Q.miss.length ? `<details class="ex-rev" open><summary><b>راجع أخطاءك (${Q.miss.length})</b></summary><ul>${Q.miss.map(q => `<li class="jp">${esc(q.note)}</li>`).join("")}</ul></details>` : ""}
  <div class="speed-row" style="justify-content:center"><button type="button" class="btn-action" data-qz="${Q.mode}">اختبار جديد 🔄</button>${store.get(WRONG(), []).length ? `<button type="button" class="btn-action btn-ghost" data-qz="wrong">🔁 راجع كل أخطائي</button>` : ""}</div>
  <p class="u-note">كل اختبار جديد يختار أسئلة لم تُسأل عنها مؤخراً، بأنواع وخيارات مختلفة.</p>`;
}
function intro() {
  const seenN = Object.keys(store.get(SEEN(), {})).length, wN = store.get(WRONG(), []).length, len = store.get("qz_len", 10);
  card.innerHTML = `<h3>اختر اختباراً من الأعلى 🎯</h3>
  <p>كل اختبار يختار أسئلة جديدة بأنواع مختلفة: المعنى، العكسي، الاستماع، معنى الجمل${lg() === "ja" ? "، وقراءة الكانجي" : ""}.</p>
  <div class="speed-row" style="justify-content:center"><span>عدد الأسئلة:</span><div class="u-seg">${[10, 20, 30].map(x => `<button type="button" data-qzlen="${x}" class="${x === len ? "on" : ""}">${x}</button>`).join("")}</div></div>
  <p class="u-note">سُئلت حتى الآن عن ${seenN} عنصراً · أخطاء محفوظة للمراجعة: ${wN}</p>`;
}
/* أزرار الأنماط: نضيف «مختلط» و«أخطائي» ونأخذ التحكم بكل الأزرار */
function decorate() {
  const m = $("#quizModes"); if (!m || m.querySelector('[data-mode="mix"]')) return;
  m.insertAdjacentHTML("beforeend", `<button class="tab-btn" data-mode="mix">🎲 مختلط</button><button class="tab-btn" data-mode="wrong">🔁 أخطائي</button><button class="tab-btn" data-mode="ai">🤖 أسئلة ذكية</button>`);
}
new MutationObserver(() => { decorate(); intro() }).observe($("#quizModes"), { childList: true });
document.addEventListener("click", e => {
  const b = e.target.closest("#quizModes [data-mode]"); if (b) { e.stopPropagation(); e.preventDefault(); start(b.dataset.mode); return }
  const r = e.target.closest("[data-qz]"); if (r) { start(r.dataset.qz); return }
  const lvb = e.target.closest("[data-ailv]"); if (lvb) { store.set("qz_ailv_" + lg(), lvb.dataset.ailv); $$("[data-ailv]").forEach(x => x.classList.toggle("active", x === lvb)); return }
  if (e.target.closest("#aiGo")) { aiStart(); return }
  if (e.target.closest("#qzWhy") && Q && Q.last) {
    const w = e.target.closest("#qzWhy"), out = $("#qzWhyOut"), { q, chosen } = Q.last;
    if (!C()) return; w.disabled = true; out.innerHTML = `<span class="ai-thinking"><span>●</span><span>●</span><span>●</span></span> يشرح…`;
    C().ai("explain", { q: q.plain || (card.querySelector(".quiz-q,.pr-sent,p") || {}).textContent || "", o: q.o, chosen, correct: q.a, note: q.note }).then(({ data, err }) => {
      out.innerHTML = err ? C().AI_ERR[err] : mini(data.text); w.remove();
    });
  }
  const l = e.target.closest("[data-qzlen]"); if (l) { store.set("qz_len", +l.dataset.qzlen); intro() }
}, true);
document.addEventListener("keydown", e => { if (e.key === "Enter" && $("#qzNext") && $("#quiz").classList.contains("active-page") && !/input|textarea/i.test(e.target.tagName)) { e.preventDefault(); $("#qzNext").click() } });
S.startQuiz = start;   // المساعد وأي مكان آخر يستخدم المحرك الجديد
decorate(); intro();
});
