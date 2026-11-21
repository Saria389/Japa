/* spot-mistake.js — اختبار العثور على الخطأ
   يعتمد على window.SARI (نفس السطر المطلوب لـ multilang.js). حمّله بعد multilang.js */
document.addEventListener("DOMContentLoaded", () => {
const S = window.SARI; if (!S) return;
const $ = S.$, store = S.store, esc = S.esc;
const VC = { ja: "ja-JP", en: "en-US", tr: "tr-TR", ar: "ar-SA" };
const lg = () => store.get("learnLang", "ja");

/* الصيغة: الجملة (مقاطعها بـ / أو بالمسافة) | رقم المقطع الخاطئ من 0 | التصحيح | الشرح | المعنى المقصود */
const BANK = {
ja: ["これは/本を/です。|1|本|です لا تأتي بعد を، نكتب الاسم مباشرة قبلها.|هذا كتاب.",
  "昨日/本を/読みます。|2|読みました。|كلمة «أمس» تتطلب صيغة الماضي ました.|قرأت كتاباً أمس.",
  "駅は/どこ/です。|2|ですか。|السؤال ينتهي بالأداة か.|أين المحطة؟",
  "パンが/食べます。|0|パンを|المفعول به يأخذ الأداة を.|آكل الخبز.",
  "明日/学校を/行きます。|1|学校へ|الاتجاه يأخذ へ (أو に) وليس を.|غداً أذهب إلى المدرسة.",
  "この町は/静かな/です。|1|静か|صفة な تأخذ な فقط قبل الاسم، وقبل です نتركها بدونها.|هذه المدينة هادئة.",
  "この本は/高いくないです。|1|高くないです。|نفي صفات い: نحذف い ونضيف くない.|هذا الكتاب ليس غالياً.",
  "六時を/起きます。|0|六時に|الوقت المحدد يأخذ الأداة に.|أستيقظ الساعة السادسة.",
  "わたしを/学生です。|0|わたしは|موضوع الجملة يأخذ は وليس を.|أنا طالب.",
  "日本を/行ったことが/あります。|0|日本へ|الاتجاه يأخذ へ أو に.|سبق أن ذهبت إلى اليابان.",
  "これは/わたし/本です。|1|わたしの|الملكية تحتاج الأداة の بين الاسمين.|هذا كتابي.",
  "きれい/花ですね。|0|きれいな|صفة な تحتاج な قبل الاسم.|يا لها من زهرة جميلة!",
  "昨日は/寒いです。|1|寒かったです。|ماضي صفات い: نحذف い ونضيف かった.|كان الجو بارداً أمس.",
  "日本語が/話しません。|1|話せません。|مع が نستخدم صيغة القدرة: 話せる.|لا أستطيع التحدث باليابانية."],
en: ["She go to school every day.|1|goes|مع he/she/it نضيف s أو es للفعل.|هي تذهب إلى المدرسة كل يوم.",
  "I am agree with you.|1|(احذفها)|agree فعل بحد ذاته ولا يحتاج am.|أنا أوافقك.",
  "He have a new car.|1|has|مع he نستخدم has وليس have.|عنده سيارة جديدة.",
  "There is three books on the table.|1|are|الجمع يأخذ are وليس is.|هناك ثلاثة كتب على الطاولة.",
  "I didn't saw him yesterday.|2|see|بعد didn't يأتي الفعل بصيغته الأصلية.|لم أره أمس.",
  "She is more taller than me.|2|(احذفها)|taller مقارنة جاهزة فلا نضيف more.|هي أطول مني.",
  "We goes to the park.|1|go|مع we نستخدم الفعل دون s.|نحن نذهب إلى الحديقة.",
  "I have 20 years old.|1|am|العمر في الإنجليزية يأخذ am وليس have.|عمري 20 سنة.",
  "He don't like coffee.|1|doesn't|مع he/she/it نستخدم doesn't.|هو لا يحب القهوة.",
  "I can to swim.|2|(احذفها)|بعد can يأتي الفعل مباشرة دون to.|أستطيع السباحة.",
  "She has two childs.|3|children.|جمع child غير منتظم: children.|عندها طفلان.",
  "I went to home early.|2|(احذفها)|مع home لا نستخدم to بعد went.|ذهبت إلى البيت مبكراً.",
  "They was at the park.|1|were|مع they نستخدم were.|كانوا في الحديقة.",
  "I am living here since 2020.|1|have been|مع since نستخدم المضارع التام.|أعيش هنا منذ 2020."],
tr: ["Ben okula gidiyor.|2|gidiyorum.|مع Ben نضيف اللاحقة um للفعل.|أنا أذهب إلى المدرسة.",
  "Ben su içiyorsun.|2|içiyorum.|sun تعني «أنت»، ومع Ben نستخدم um.|أنا أشرب الماء.",
  "O okula gidiyorum.|0|Ben|الفعل gidiyorum يخص «أنا» فيجب أن يكون الضمير Ben.|أنا أذهب إلى المدرسة.",
  "Ben öğrenciyiz.|1|öğrenciyim.|iz للجمع (نحن)، و im للمفرد (أنا).|أنا طالب.",
  "Biz kitabı okuyorum.|2|okuyoruz.|مع Biz (نحن) نستخدم uz.|نحن نقرأ الكتاب.",
  "Biz okula gidiyorsunuz.|2|gidiyoruz.|مع Biz نستخدم uz.|نحن نذهب إلى المدرسة.",
  "Sen çay içiyorum.|2|içiyorsun.|مع Sen نستخدم sun.|أنت تشرب الشاي.",
  "Ben dün okula gidiyorum.|3|gittim.|dün (أمس) يحتاج صيغة الماضي -di.|ذهبت إلى المدرسة أمس.",
  "Kitap masa.|1|masada.|للمكان نضيف -da: masada = على الطاولة.|الكتاب على الطاولة.",
  "Ben öğretmenler.|1|öğretmenim.|مع Ben نضيف -im وليس لاحقة الجمع.|أنا معلّم."],
ar: ["الولد ذهبت إلى المدرسة.|1|ذهب|Verb must agree with a masculine subject.|The boy went to school.",
  "البنت جميل.|1|جميلة|Adjective must agree in gender (feminine).|The girl is beautiful.",
  "أنا يذهب إلى السوق.|1|أذهب|With أنا the verb starts with أ.|I go to the market.",
  "هذه كتاب جديد.|0|هذا|كتاب is masculine so we use هذا.|This is a new book.",
  "الكتاب كبيرة.|1|كبير|Adjective must match a masculine noun.|The book is big.",
  "البنت ذهب إلى السوق.|1|ذهبت|The verb must be feminine with a feminine subject.|The girl went to the market.",
  "هؤلاء الطالب مجتهدون.|1|الطلاب|هؤلاء needs a plural noun.|These students are hardworking.",
  "نحن يذهب إلى المدرسة.|1|نذهب|With نحن the verb starts with ن.|We go to school.",
  "الشمس كبير.|1|كبيرة|الشمس is feminine, so the adjective is feminine.|The sun is big.",
  "ذهبت إلى المدرسة غداً.|3|أمس.|ذهبت is past tense, so use أمس (yesterday), not غداً.|I went to school yesterday."] };

document.head.insertAdjacentHTML("beforeend", `<style>.sp-tok{margin:4px;font-size:20px;padding:10px 16px}.sp-fix{font-size:20px;font-weight:800;margin:8px 0}</style>`);
$("#nav").insertAdjacentHTML("beforeend", `<a href="#spot" data-page="spot" data-ar="🔍 اكتشف الخطأ">🔍 اكتشف الخطأ</a>`);
$("main").insertAdjacentHTML("beforeend", `<div id="spot" class="page-section"><section class="box"><h2>اختبار العثور على الخطأ 🔍</h2><div id="sBox"></div></section></div>`);

const speak = (t, l) => { if (!("speechSynthesis" in window)) return; speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(t); u.lang = VC[l]; u.rate = .85; speechSynthesis.speak(u) };
const toks = t => t.includes("/") ? t.split("/") : t.split(" ");
const join = (l, a) => l === "ja" ? a.join("") : a.join(" ");
let Q = null;

function intro() {
  const l = lg(), best = store.get("spot_best", {})[l];
  $("#sBox").innerHTML = `<p>في كل سؤال جملة فيها <b>خطأ واحد</b>. اضغط على الجزء الخاطئ منها، ثم سترى التصحيح والسبب.</p>
  <button class="btn-action" id="sGo">ابدأ الاختبار 🔍</button> <small>أفضل نتيجة: ${best ?? "—"}</small>`;
  $("#sGo").onclick = () => start();
}
function start(items) {
  const l = lg(), src = items || [...BANK[l]].sort(() => Math.random() - .5).slice(0, 8);
  Q = { l, items: src, i: 0, pts: 0, missed: [] }; show();
}
function show() {
  if (Q.i >= Q.items.length) return end();
  const [t, , , , m] = Q.items[Q.i].split("|"), ts = toks(t);
  $("#sBox").innerHTML = `<div class="quiz-card"><div class="bar"><i style="width:${Q.i / Q.items.length * 100}%"></i></div>
  <div class="quiz-hint">${Q.i + 1} / ${Q.items.length} · ${Q.pts} نقطة</div>
  <p>المعنى المقصود: ${esc(m)}</p><p>أيّ جزء خاطئ؟</p>
  <div>${ts.map((w, i) => `<button class="opt sp-tok" data-i="${i}">${esc(w)}</button>`).join("")}</div><div id="sRes"></div></div>`;
  document.querySelectorAll(".sp-tok").forEach(b => b.onclick = () => pick(+b.dataset.i));
}
function pick(i) {
  if (Q.lock) return; Q.lock = true;
  const [t, e, fix, why] = Q.items[Q.i].split("|"), ts = toks(t), ok = i === +e;
  document.querySelectorAll(".sp-tok").forEach(b => { if (+b.dataset.i === +e) b.classList.add("ok"); else if (+b.dataset.i === i) b.classList.add("no") });
  if (ok) Q.pts += 10; else Q.missed.push(Q.items[Q.i]);
  const fixed = [...ts]; if (fix === "(احذفها)") fixed.splice(+e, 1); else fixed[+e] = fix;
  const full = join(Q.l, fixed);
  $("#sRes").innerHTML = `<div class="feedback ${ok ? "correct" : "wrong"}" style="display:block">${ok ? "✨ أحسنت، وجدت الخطأ!" : "❌ الخطأ كان في: " + esc(ts[+e])}</div>
  <div class="sp-fix">✔ ${esc(full)}</div><p>${esc(why)}</p>
  <div class="speed-row" style="justify-content:center"><button class="btn-action btn-ghost" id="sHear">🔊 استمع</button><button class="btn-action" id="sNext">التالي ←</button></div>`;
  $("#sHear").onclick = () => speak(full, Q.l); $("#sNext").onclick = () => { Q.lock = false; Q.i++; show() };
}
function end() {
  const max = Q.items.length * 10, b = store.get("spot_best", {});
  if (!Q.retry) { if (!b[Q.l] || Q.pts > b[Q.l]) b[Q.l] = Q.pts; store.set("spot_best", b); document.dispatchEvent(new CustomEvent("quizdone", { detail: Math.round(Q.pts / max * 100) })) }
  $("#sBox").innerHTML = `<div class="quiz-card"><h3>🎉 انتهى الاختبار</h3><div class="score">${Q.pts} / ${max}</div>
  <p>${Q.missed.length ? "أخطأت في " + Q.missed.length + " جملة، يمكنك مراجعتها الآن." : "🏆 لم تخطئ في أي جملة!"}</p>
  ${Q.missed.length ? `<button class="btn-action" id="sRev">راجع أخطائي 🔁</button> ` : ""}<button class="btn-action btn-ghost" id="sAgain">اختبار جديد</button></div>`;
  if (Q.missed.length) $("#sRev").onclick = () => { const m = Q.missed; start(m); Q.retry = true };
  $("#sAgain").onclick = () => start();
}
document.addEventListener("click", e => { if (e.target.closest('[data-page="spot"]')) setTimeout(intro, 0) });
const sel = $("#learnLang"); if (sel) sel.addEventListener("change", intro);
intro();
});
