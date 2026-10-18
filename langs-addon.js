/* langs-addon.js — إضافة اللغات (English / Türkçe / العربية) لمنصة ساري
   الاستخدام: ضع <script src="langs-addon.js"></script> قبل </body> في index.html */
const H0 = location.hash;
document.addEventListener("DOMContentLoaded", () => {
const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
const store = { g(k, d) { try { const v = JSON.parse(localStorage.getItem(k)); return v == null ? d : v } catch (e) { return d } }, s(k, v) { try { localStorage.setItem(k, JSON.stringify(v)) } catch (e) {} } };
const shuf = a => { a = [...a]; for (let i = a.length - 1; i > 0; i--) { const j = Math.random() * (i + 1) | 0;[a[i], a[j]] = [a[j], a[i]] } return a };
const esc = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");

/* ===== القاموس: [English, Türkçe, العربية] — يمكن توسيعه باستيراد ملف JSON بنفس الشكل ===== */
const BASE = [["hello","merhaba","مرحبا"],["thank you","teşekkürler","شكرا"],["please","lütfen","من فضلك"],["yes","evet","نعم"],["no","hayır","لا"],["water","su","ماء"],["bread","ekmek","خبز"],["tea","çay","شاي"],["book","kitap","كتاب"],["house","ev","بيت"],["school","okul","مدرسة"],["friend","arkadaş","صديق"],["mother","anne","أم"],["father","baba","أب"],["big","büyük","كبير"],["small","küçük","صغير"],["good","iyi","جيد"],["bad","kötü","سيئ"],["today","bugün","اليوم"],["tomorrow","yarın","غدا"],["eat","yemek","يأكل"],["drink","içmek","يشرب"],["go","gitmek","يذهب"],["read","okumak","يقرأ"],["write","yazmak","يكتب"],["love","sevmek","يحب"],["city","şehir","مدينة"],["car","araba","سيارة"],["sun","güneş","شمس"],["moon","ay","قمر"],["red","kırmızı","أحمر"],["blue","mavi","أزرق"],["one","bir","واحد"],["two","iki","اثنان"],["three","üç","ثلاثة"],["day","gün","يوم"],["night","gece","ليل"],["family","aile","عائلة"],["work","iş","عمل"],["time","zaman","وقت"]];
const D = [...BASE, ...(window.SARI_DICT || []), ...store.g("sari_dict", [])];
const L = { en: 0, tr: 1, ar: 2 }, NM = { en: "English", tr: "Türkçe", ar: "العربية" }, VC = { en: "en-US", tr: "tr-TR", ar: "ar-SA" };
const W = (i, l) => D[i][L[l]];
const S = { en: [["Sam goes to school every day.","Sam her gün okula gider.","سام يذهب إلى المدرسة كل يوم."],["He reads a book and drinks tea.","Kitap okur ve çay içer.","يقرأ كتابا ويشرب الشاي."],["Sam loves his family and his friends.","Sam ailesini ve arkadaşlarını sever.","سام يحب عائلته وأصدقاءه."]],
  tr: [["Ayşe bugün çok mutlu.","Ayşe is very happy today.","عائشة سعيدة جدا اليوم."],["Annesiyle çay içiyor.","She is drinking tea with her mother.","تشرب الشاي مع أمها."],["Akşam arkadaşlarıyla parka gidiyor.","In the evening she goes to the park with her friends.","في المساء تذهب إلى الحديقة مع صديقاتها."]],
  ar: [["ذهب أحمد إلى السوق صباحا.","Ahmed went to the market in the morning.","Ahmet sabah pazara gitti."],["اشترى خبزا وماء.","He bought bread and water.","Ekmek ve su aldı."],["ثم عاد إلى البيت مع صديقه.","Then he returned home with his friend.","Sonra arkadaşıyla eve döndü."]] };

/* ===== واجهة بلغتين ===== */
const T = { ar: { nav: "اللغات", t: "تعلّم الإنجليزية والتركية والعربية 🌍", lang: "اللغة التي أتعلمها", nat: "لغتي", cards: "بطاقات", quiz: "اختبار", listen: "استماع", timed: "تحدي زمني", review: "مراجعة أخطائي", stories: "قصص", me: "تقدّمي", flip: "اقلب", know: "أعرفها ✅", dont: "لا أعرفها ❌", score: "النتيجة", again: "إعادة", shareR: "مشاركة النتيجة", shareQ: "مشاركة هذا الاختبار", mastered: "كلمة متقنة", goal: "هدف اليوم", streak: "أيام متتالية", none: "لا أخطاء للمراجعة 🎉", name: "اكتب اسمك للبدء", go: "ابدأ", sw: "تبديل المستخدم", imp: "استيراد قاموس (JSON)", words: "كلمات في القاموس", tr: "إظهار الترجمة", copied: "تم النسخ ✔", hi: "أهلاً", pick: "اختر وضعاً للبدء", dict: "القاموس", letters: "الحروف" },
  en: { nav: "Languages", t: "Learn English, Turkish & Arabic 🌍", lang: "I'm learning", nat: "My language", cards: "Flashcards", quiz: "Quiz", listen: "Listening", timed: "Timed", review: "Review mistakes", stories: "Stories", me: "Progress", flip: "Flip", know: "I know ✅", dont: "Not yet ❌", score: "Score", again: "Again", shareR: "Share result", shareQ: "Share this quiz", mastered: "words mastered", goal: "Daily goal", streak: "day streak", none: "No mistakes to review 🎉", name: "Enter your name to start", go: "Start", sw: "Switch user", imp: "Import dictionary (JSON)", words: "words in dictionary", tr: "Show translation", copied: "Copied ✔", hi: "Hello", pick: "Pick a mode to start", dict: "Dictionary", letters: "Alphabet" } };
const NAV_EN = { home: "Home", letters: "Letters", curriculum: "Levels", conversations: "Dialogues", quiz: "Quizzes", diary: "Diary", bank: "Word bank", kanji: "Kanji", challenge: "Challenges", lab: "Reading", grammar: "Grammar", me: "My progress", about: "About" };
$$("nav a").forEach(a => a.dataset.ar = a.textContent);
let ui = store.g("sari_ui", "ar"), lang = store.g("sari_lang", "en"), nat = store.g("sari_nat", "ar");
const t = k => T[ui][k];

/* ===== المستخدمون ===== */
let users = store.g("sari_users", {}), cur = store.g("sari_cur", "");
const today = () => new Date().toISOString().slice(0, 10);
const U = () => users[cur];
const save = () => { store.s("sari_users", users); store.s("sari_cur", cur) };
function login(n) { n = n.trim().slice(0, 24); if (!n) return; if (!users[n]) users[n] = { xp: 0, days: [], m: { en: [], tr: [], ar: [] }, w: { en: [], tr: [], ar: [] }, d: {} }; cur = n; const u = U(); if (!u.days.includes(today())) u.days.push(today()); save(); $("#lgGate")?.remove(); view("hub") }
function gate() {
  const g = document.createElement("div"); g.id = "lgGate";
  g.style.cssText = "position:fixed;inset:0;z-index:5000;background:rgba(0,0,0,.6);display:grid;place-items:center;padding:16px";
  g.innerHTML = `<div class="box" style="max-width:380px;width:100%;margin:0"><h2>${t("name")}</h2><input type="text" id="lgN" maxlength="24" autofocus style="margin:10px 0"><button class="btn-action" id="lgGo">${t("go")}</button><div style="margin-top:12px">${Object.keys(users).map(n => `<button class="tab-btn" data-u="${esc(n)}">👤 ${esc(n)}</button>`).join(" ")}</div></div>`;
  document.body.appendChild(g);
  $("#lgGo").onclick = () => login($("#lgN").value); $("#lgN").onkeydown = e => e.key === "Enter" && login(e.target.value);
  g.onclick = e => { const b = e.target.closest("[data-u]"); if (b) login(b.dataset.u) };
}
const xp = n => { U().xp += n; U().d[today()] = (U().d[today()] || 0) + 1; save() };

/* ===== الصوت ===== */
const speak = (txt, l) => { if (!("speechSynthesis" in window)) return; speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(txt); u.lang = VC[l || lang]; u.rate = .85; speechSynthesis.speak(u) };

/* ===== هيكل الصفحة ===== */
const nav = $("#nav"), main = $("main");
nav.insertAdjacentHTML("afterbegin", `<a href="#langs" data-page="langs" data-ar="اللغات"></a>`);
main.insertAdjacentHTML("beforeend", `<div id="langs" class="page-section"><section class="box"><h2 id="lgT"></h2><div id="lgBar"></div><div id="lgBody"></div></section></div>`);
const tb = document.createElement("button"); tb.className = "icon-btn"; tb.id = "uiBtn"; $(".head-tools").prepend(tb);
tb.onclick = () => { ui = ui === "ar" ? "en" : "ar"; store.s("sari_ui", ui); apply() };
document.addEventListener("click", e => { if (e.target.closest('[data-page="langs"]')) setTimeout(() => view("hub"), 0) });

function apply() {
  const H = document.documentElement; H.lang = ui; H.dir = ui === "ar" ? "rtl" : "ltr"; tb.textContent = ui === "ar" ? "EN" : "ع";
  $$("nav a").forEach(a => { const p = a.dataset.page; a.textContent = ui === "ar" ? a.dataset.ar : (p === "langs" ? T.en.nav : NAV_EN[p] || a.dataset.ar) });
  if (ui === "en") { const h = $("#home .hero h2"); if (h) h.textContent = "Start your journey from zero to mastery 🌸"; $(".brand span:last-child").textContent = "Learn with Sari" } else { $("#home .hero h2").textContent = "ابدأ رحلتك مع اليابانية من الصفر حتى N1 🌸"; $(".brand span:last-child").textContent = "تعلّم اليابانية مع ساري" }
  $("#lgT").textContent = t("t"); if (cur) view("hub");
}

/* ===== العرض ===== */
const body = () => $("#lgBody");
function bar() {
  const o = Object.keys(L).map(l => `<option value="${l}" ${l === lang ? "selected" : ""}>${NM[l]}</option>`).join("");
  $("#lgBar").innerHTML = `<p>👤 ${t("hi")} <b>${esc(cur)}</b> · ⭐ ${U().xp} XP · <button class="tab-btn" id="lgSw">${t("sw")}</button></p>
  <div class="speed-row"><label>${t("lang")}: <select id="sL">${o}</select></label><label>${t("nat")}: <select id="sN">${o.replace(` selected`, "").replace(`value="${nat}"`, `value="${nat}" selected`)}</select></label></div>
  <div class="tabs">${[["letters", "letters"], ["dict", "dict"], ["cards", "cards"], ["quiz", "quiz"], ["listen", "listen"], ["timed", "timed"], ["review", "review"], ["stories", "stories"], ["me", "me"]].map(([k, v]) => `<button class="tab-btn" data-v="${k}">${t(v)}</button>`).join("")}</div>`;
  $("#sL").onchange = e => { lang = e.target.value; if (nat === lang) nat = Object.keys(L).find(x => x !== lang); store.s("sari_lang", lang); store.s("sari_nat", nat); view("hub") };
  $("#sN").onchange = e => { nat = e.target.value; if (nat === lang) lang = Object.keys(L).find(x => x !== nat); store.s("sari_lang", lang); store.s("sari_nat", nat); view("hub") };
  $("#lgSw").onclick = gate;
}
function view(v, a) {
  if (!cur) return gate(); if (nat === lang) nat = Object.keys(L).find(x => x !== lang);
  $("#lgT").textContent = t("t"); bar();
  $$("#lgBar [data-v]").forEach(b => { b.classList.toggle("active", b.dataset.v === v); b.onclick = () => view(b.dataset.v) });
  ({ dict, letters, hub: () => body().innerHTML = `<p>${t("pick")}</p>`, cards, quiz: () => run("quiz"), listen: () => run("listen"), timed: () => run("timed"), review: () => run("review"), stories, me, shared: () => run("quiz", a) }[v] || (() => {}))();
}

/* بطاقات الكلمات */
let fi = 0;
function cards() {
  const i = fi % D.length;
  body().innerHTML = `<div class="quiz-card"><div class="quiz-hint">${fi % D.length + 1} / ${D.length}</div><div class="quiz-q" id="fc">${W(i, lang)}</div><div class="word-ar" id="fb" hidden style="font-size:24px">${W(i, nat)}</div>
  <div class="speed-row" style="justify-content:center"><button class="btn-action btn-ghost" id="fF">${t("flip")}</button><button class="btn-action btn-ghost" id="fS">🔊</button></div>
  <div class="speed-row" style="justify-content:center"><button class="btn-action btn-ghost" id="fN">${t("dont")}</button><button class="btn-action" id="fY">${t("know")}</button></div></div>`;
  speak(W(i, lang)); $("#fF").onclick = () => $("#fb").hidden = false; $("#fS").onclick = () => speak(W(i, lang));
  $("#fY").onclick = () => { mark(i, 1); xp(2); fi++; cards() }; $("#fN").onclick = () => { mark(i, 0); fi++; cards() };
}
function mark(i, ok) { const u = U(), m = u.m[lang], w = u.w[lang]; if (ok) { if (!m.includes(i)) m.push(i); u.w[lang] = w.filter(x => x !== i) } else { if (!w.includes(i)) w.push(i); u.m[lang] = m.filter(x => x !== i) } save() }

/* الاختبارات والتحديات */
function run(mode, ids) {
  let pool = ids || (mode === "review" ? shuf(U().w[lang]).slice(0, 10) : shuf([...D.keys()]).slice(0, 10)), k = 0, sc = 0, tm;
  if (!pool.length) { body().innerHTML = `<p>${t("none")}</p>`; return }
  const ask = () => {
    clearInterval(tm); if (k >= pool.length) return end(); const i = pool[k], ls = mode === "listen";
    const op = shuf([i, ...shuf([...D.keys()].filter(x => x !== i)).slice(0, 3)]);
    body().innerHTML = `<div class="quiz-card"><div class="quiz-hint">${k + 1}/${pool.length} · ${sc}</div>${ls ? `<button class="btn-action" id="sp" style="font-size:32px">🔊</button>` : `<div class="quiz-q">${W(i, lang)}</div>`}${mode === "timed" ? `<div class="bar"><i id="tb" style="width:100%;transition:none"></i></div>` : ""}<div class="quiz-options">${op.map(o => `<button class="opt" data-o="${o}">${W(o, nat)}</button>`).join("")}</div></div>`;
    if (ls) { speak(W(i, lang)); $("#sp").onclick = () => speak(W(i, lang)) }
    const pick = b => { if (pick.d) return; pick.d = 1; clearInterval(tm); const ok = b && +b.dataset.o === i; $$(".opt").forEach(x => { if (+x.dataset.o === i) x.classList.add("ok") }); if (b && !ok) b.classList.add("no"); if (ok) { sc++; mark(i, 1) } else mark(i, 0); xp(ok ? 3 : 1); setTimeout(() => { k++; ask() }, 900) };
    $$(".opt").forEach(b => b.onclick = () => pick(b));
    if (mode === "timed") { let n = 100; tm = setInterval(() => { n--; $("#tb").style.width = n + "%"; if (n <= 0) pick(null) }, 100) }
  };
  const end = () => {
    const share = `${lang}.${nat}.${pool.join("-")}`;
    body().innerHTML = `<div class="quiz-card"><h3>🎉</h3><div class="score">${sc} / ${pool.length}</div><p>${t("mastered")}: ${U().m[lang].length}</p>
    <button class="btn-action" id="shR">${t("shareR")}</button> <button class="btn-action btn-ghost" id="shQ">${t("shareQ")}</button> <button class="btn-action btn-ghost" id="ag">${t("again")}</button></div>`;
    $("#shR").onclick = () => out(`🎯 ${t("score")} ${sc}/${pool.length} — ${NM[lang]}\n🏆 ${U().m[lang].length} ${t("mastered")}!\n${location.origin}${location.pathname}`);
    $("#shQ").onclick = () => out(`${location.origin}${location.pathname}#sq=${share}`);
    $("#ag").onclick = () => run(mode);
  }; ask();
}
function out(txt) { if (navigator.share) navigator.share({ text: txt }).catch(() => {}); else if (navigator.clipboard) navigator.clipboard.writeText(txt).then(() => alert(t("copied"))); else prompt("", txt) }

/* القاموس */
function dict() {
  body().onclick = null;
  body().innerHTML = `<input type="text" id="dq" placeholder="🔍" style="margin-bottom:10px"><p>${D.length} ${t("words")}</p><div class="words-grid" id="dl"></div>`;
  const r = () => { const q = $("#dq").value.trim().toLowerCase(); $("#dl").innerHTML = D.map((w, i) => [w, i]).filter(([w]) => !q || w.some(x => x.toLowerCase().includes(q))).slice(0, 300).map(([w, i]) => `<div class="word-card" data-i="${i}"><div><div class="word-jp" style="font-family:inherit">${w[L[lang]]}</div><div class="word-ar">${w[L[nat]]}</div></div><span class="spk">🔊</span></div>`).join("") };
  r(); $("#dq").oninput = r; $("#dl").onclick = e => { const c = e.target.closest("[data-i]"); if (c) speak(W(+c.dataset.i, lang)) };
}
/* الحروف */
function letters() {
  const A = { en: "A B C D E F G H I J K L M N O P Q R S T U V W X Y Z", tr: "A B C Ç D E F G Ğ H I İ J K L M N O Ö P R S Ş T U Ü V Y Z", ar: "ا ب ت ث ج ح خ د ذ ر ز س ش ص ض ط ظ ع غ ف ق ك ل م ن ه و ي" };
  body().innerHTML = `<div class="letters-grid c5" style="max-width:640px">${A[lang].split(" ").map(c => `<div class="letter-card" data-c="${c}"><span class="jp-char" style="font-family:inherit">${c}</span></div>`).join("")}</div>`;
  body().onclick = e => { const c = e.target.closest("[data-c]"); if (c) speak(c.dataset.c) };
}
/* القصص */
function stories() {
  const o = Object.keys(L).filter(x => x !== lang), ix = o.indexOf(nat) + 1;
  body().innerHTML = `<label><input type="checkbox" id="stT" checked> ${t("tr")}</label>` + S[lang].map(s => `<div class="sent" data-say="${esc(s[0])}" style="cursor:pointer"><div><div class="sent-jp" style="font-family:inherit">${s[0]}</div><div class="sent-ar st">${s[ix]}</div></div><span class="spk">🔊</span></div>`).join("");
  $("#stT").onchange = e => $$(".st").forEach(x => x.hidden = !e.target.checked);
  $$("#lgBody .sent").forEach(d => d.onclick = () => speak(d.dataset.say)); xp(1);
}

/* تقدّمي */
function me() {
  const u = U(); let s = 0, d = new Date(); while (u.days.includes(d.toISOString().slice(0, 10))) { s++; d.setDate(d.getDate() - 1) }
  const g = Math.min(100, (u.d[today()] || 0) * 10);
  body().innerHTML = `<div class="grid-auto">${Object.keys(L).map(l => `<div class="card" style="text-align:center"><b>${NM[l]}</b><div class="score" style="font-size:34px">${u.m[l].length}</div><small>${t("mastered")}</small></div>`).join("")}
  <div class="card" style="text-align:center"><div class="score" style="font-size:34px">🔥 ${s}</div><small>${t("streak")}</small></div></div>
  <p style="margin-top:16px">${t("goal")}: ${u.d[today()] || 0} / 10</p><div class="bar"><i style="width:${g}%"></i></div>
  <p>${D.length} ${t("words")}</p><label class="btn-action btn-ghost" style="cursor:pointer">${t("imp")}<input type="file" id="dI" accept=".json" hidden></label>`;
  $("#dI").onchange = async e => { try { const a = JSON.parse(await e.target.files[0].text()); store.s("sari_dict", [...store.g("sari_dict", []), ...a.filter(r => Array.isArray(r) && r.length >= 3)]); location.reload() } catch (x) { alert("JSON ✗") } };
}

apply();
if (H0.startsWith("#sq=")) { const [l, n, ids] = H0.slice(4).split("."); if (L[l] && L[n]) { lang = l; nat = n; const go = () => { document.querySelector('[data-page="langs"]').click(); setTimeout(() => view("shared", ids.split("-").map(Number).filter(i => D[i])), 50) }; cur ? go() : gate(); document.addEventListener("click", function f() { if (cur) { document.removeEventListener("click", f) } }) } }
});
