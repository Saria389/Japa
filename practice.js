/* practice.js — صفحة «التدريب» 🏋️ (حمّله بعد extras.js)
   ✏️ أكمل الفراغ · 🔄 تصريف الأفعال · 🧩 مطابقة الكلمات · 🎧 فهم الاستماع · ⌨️ كتابة الكانا (لليابانية) */
document.addEventListener("DOMContentLoaded", () => {
const S = window.SARI; if (!S) return;
const $ = S.$, $$ = S.$$, store = S.store, esc = S.esc;
const lg = () => store.get("learnLang", "ja");
const shuffle = a => { a = [...a]; for (let i = a.length - 1; i > 0; i--) { const j = Math.random() * (i + 1) | 0; [a[i], a[j]] = [a[j], a[i]] } return a };
const T = s => s.trim().split(";").map(x => x.trim().split("|"));
const fx = ok => window.SARI_AUDIO && SARI_AUDIO.fx[ok ? "ok" : "no"]();
const say = (t, o) => window.SARI_AUDIO && SARI_AUDIO.speak(t, Object.assign({ lang: lg() }, o));

/* «أكمل الفراغ»: الجملة (＿ مكان الفراغ)|الصحيح|خيار|خيار|خيار|المعنى|الشرح */
const FILL = {
ja: T(`わたし＿学生です。|は|が|を|に|أنا طالب.|は تحدد موضوع الجملة وتُنطق wa.;
パン＿食べます。|を|は|に|で|آكل الخبز.|を تأتي بعد المفعول به.;
学校＿行きます。|へ|を|で|が|أذهب إلى المدرسة.|へ للاتجاه وتُنطق e.;
図書館＿本を読みます。|で|に|を|へ|أقرأ كتاباً في المكتبة.|で لمكان حدوث الفعل.;
七時＿起きます。|に|で|を|が|أستيقظ الساعة السابعة.|に بعد الوقت المحدد.;
友達＿映画を見ました。|と|を|に|が|شاهدت فيلماً مع صديقي.|と بمعنى «مع».;
これはわたし＿本です。|の|は|が|と|هذا كتابي.|の للملكية.;
部屋に猫＿います。|が|を|で|へ|في الغرفة قطة.|الشيء الموجود مع います / あります يأخذ が.;
日本語＿わかります。|が|を|で|に|أفهم اليابانية.|الفعل わかる يأخذ が.;
バス＿空港へ行きます。|で|に|を|が|أذهب إلى المطار بالحافلة.|で للوسيلة.;
昨日、本を＿。|読みました|読みます|読む|読んで|قرأت كتاباً أمس.|昨日 (أمس) تحتاج الماضي ました.;
少し待って＿。|ください|ます|です|ません|انتظر قليلاً من فضلك.|صيغة て + ください للطلب.;
写真を撮っても＿ですか。|いい|ある|する|なる|هل يمكنني التقاط صورة؟|～てもいいですか لطلب الإذن.;
日本へ行った＿があります。|こと|もの|とき|ところ|سبق أن ذهبت إلى اليابان.|～たことがある للتجربة.;
雨が降って＿。|います|あります|します|なります|إنها تمطر.|～ています للحدث المستمر.;
静か＿町ですね。|な|の|い|が|مدينة هادئة!|صفات な تأخذ な قبل الاسم.;
駅はどこです＿。|か|ね|よ|の|أين المحطة؟|か في آخر الجملة تجعلها سؤالاً.`),
en: T(`She ＿ to school every day.|goes|go|going|gone|هي تذهب إلى المدرسة كل يوم.|مع she نضيف s أو es للفعل.;
I ＿ a student.|am|is|are|be|أنا طالب.|مع I نستخدم am.;
They ＿ football yesterday.|played|play|plays|playing|لعبوا كرة القدم أمس.|yesterday تحتاج الماضي.;
There ＿ two cats in the garden.|are|is|am|be|يوجد قطتان في الحديقة.|الجمع يأخذ are.;
I have ＿ apple.|an|a|the|some|عندي تفاحة.|an قبل الكلمة التي تبدأ بصوت حرف علة.;
He is ＿ than his brother.|taller|tall|tallest|more tall|هو أطول من أخيه.|الصفة القصيرة + er للمقارنة.;
I will call you ＿ Monday.|on|in|at|to|سأتصل بك يوم الاثنين.|on مع الأيام.;
We ＿ watching TV now.|are|is|am|be|نحن نشاهد التلفاز الآن.|now مع المضارع المستمر: are + ing.;
Did you ＿ the movie?|see|saw|seen|seeing|هل شاهدت الفيلم؟|بعد did يأتي الفعل بصيغته الأصلية.;
She can ＿ English well.|speak|speaks|speaking|to speak|تستطيع التحدث بالإنجليزية جيداً.|بعد can يأتي الفعل الأصلي.;
I'm going ＿ visit Japan.|to|for|at|on|سأزور اليابان.|going to + فعل للخطط.;
This is the ＿ day of my life!|best|good|better|most good|هذا أفضل يوم في حياتي!|التفضيل: the best.;
I have lived here ＿ 2020.|since|for|from|at|أعيش هنا منذ 2020.|since مع نقطة زمنية، و for مع مدة.;
He ＿ like coffee.|doesn't|don't|isn't|not|هو لا يحب القهوة.|مع he نستخدم doesn't.`),
tr: T(`Ben öğrenci＿.|yim|sin|iz|ler|أنا طالب.|مع ben نضيف -im (هنا yim بسبب حرف العلة).;
Sen nereye gidiyor＿?|sun|um|uz|lar|إلى أين تذهب؟|مع sen نضيف -sun.;
Biz okula gidiyor＿.|uz|um|sun|lar|نحن نذهب إلى المدرسة.|مع biz نضيف -uz.;
Kitap masa＿.|da|de|dan|ya|الكتاب على الطاولة.|masa آخر حرف علة فيها a لذلك -da.;
Ev＿ gidiyorum.|e|a|de|den|أذهب إلى البيت.|الاتجاه: -e / -a (ev ← eve).;
Dün sinemaya git＿.|tim|iyorum|eceğim|er|ذهبت إلى السينما أمس.|dün (أمس) ← الماضي -di.;
Yarın seni ara＿.|yacağım|dım|ıyorum|r|سأتصل بك غداً.|yarın (غداً) ← المستقبل -acak.;
Okul＿ geliyorum.|dan|da|a|ı|أنا قادم من المدرسة.|«من» = -dan / -den.;
Ben Türkçe bil＿.|iyorum|iyorsun|iyoruz|iyorlar|أعرف التركية.|مع ben ← -um.;
Bu kitap çok ＿.|güzel|güzeller|güzelim|güzelsin|هذا الكتاب جميل جداً.|الصفة بعد الاسم بدون لاحقة.;
Ankara İstanbul'dan daha ＿.|küçük|küçükten|küçüğü|küçükler|أنقرة أصغر من إسطنبول.|المقارنة: -den daha + الصفة.`),
ar: T(`ذهبت البنت ＿ المدرسة.|إلى|في|على|من|The girl went to school.|إلى = to (direction).;
الكتاب ＿ الطاولة.|على|إلى|من|عن|The book is on the table.|على = on.;
هذه سيارة ＿.|جميلة|جميل|جمال|أجمل|This is a beautiful car.|سيارة is feminine, so the adjective is feminine.;
أنا ＿ الماء.|أشرب|يشرب|تشرب|نشرب|I drink water.|With أنا the verb starts with أ.;
نحن ＿ إلى السوق.|نذهب|أذهب|يذهب|تذهب|We go to the market.|With نحن the verb starts with ن.;
البيت ＿.|كبير|كبيرة|كبار|كبيرات|The house is big.|البيت is masculine.;
＿ الطالب مجتهد.|هذا|هذه|هؤلاء|هم|This student is hardworking.|الطالب is masculine singular → هذا.;
سافرتُ إلى مصر ＿.|أمس|غداً|الآن|سوف|I traveled to Egypt yesterday.|سافرتُ is past tense → أمس.;
＿ أسافر إلى اليابان غداً.|سوف|قد|لم|كان|I will travel to Japan tomorrow.|سوف + present verb = future.;
القهوة ＿ من الشاي.|أغلى|غالية|غالٍ|الغلاء|Coffee is more expensive than tea.|Comparative pattern: أفعل + من.;
هي ＿ الكتاب كل يوم.|تقرأ|يقرأ|أقرأ|نقرأ|She reads the book every day.|With هي the verb starts with ت.`)
};

/* تصريف الأفعال */
const CONJ = {
ja: { f: ["ます (مهذب)", "て (الربط والطلب)", "ない (النفي)", "た (الماضي)"], v: T(`食べる|食べます|食べて|食べない|食べた|يأكل;飲む|飲みます|飲んで|飲まない|飲んだ|يشرب;行く|行きます|行って|行かない|行った|يذهب;来る|来ます|来て|来ない|来た|يأتي;する|します|して|しない|した|يفعل;見る|見ます|見て|見ない|見た|يرى;書く|書きます|書いて|書かない|書いた|يكتب;読む|読みます|読んで|読まない|読んだ|يقرأ;話す|話します|話して|話さない|話した|يتحدث;買う|買います|買って|買わない|買った|يشتري;待つ|待ちます|待って|待たない|待った|ينتظر;帰る|帰ります|帰って|帰らない|帰った|يعود;起きる|起きます|起きて|起きない|起きた|يستيقظ;泳ぐ|泳ぎます|泳いで|泳がない|泳いだ|يسبح;遊ぶ|遊びます|遊んで|遊ばない|遊んだ|يلعب;寝る|寝ます|寝て|寝ない|寝た|ينام;会う|会います|会って|会わない|会った|يقابل`) },
en: { f: ["الماضي البسيط (Past)", "التصريف الثالث (Past participle)"], v: T(`go|went|gone|يذهب;eat|ate|eaten|يأكل;see|saw|seen|يرى;write|wrote|written|يكتب;take|took|taken|يأخذ;buy|bought|bought|يشتري;come|came|come|يأتي;drink|drank|drunk|يشرب;speak|spoke|spoken|يتكلم;give|gave|given|يعطي;know|knew|known|يعرف;begin|began|begun|يبدأ;sleep|slept|slept|ينام;find|found|found|يجد;swim|swam|swum|يسبح`) },
tr: { f: ["المضارع المستمر (أنا)", "الماضي (أنا)", "المستقبل (أنا)"], v: T(`gitmek|gidiyorum|gittim|gideceğim|يذهب;gelmek|geliyorum|geldim|geleceğim|يأتي;yemek|yiyorum|yedim|yiyeceğim|يأكل;içmek|içiyorum|içtim|içeceğim|يشرب;okumak|okuyorum|okudum|okuyacağım|يقرأ;yazmak|yazıyorum|yazdım|yazacağım|يكتب;görmek|görüyorum|gördüm|göreceğim|يرى;almak|alıyorum|aldım|alacağım|يأخذ;konuşmak|konuşuyorum|konuştum|konuşacağım|يتكلم;yapmak|yapıyorum|yaptım|yapacağım|يفعل`) },
ar: { f: ["الماضي مع أنا (Past, I)", "المضارع مع أنا (Present, I)", "المضارع مع هو (Present, he)"], v: T(`كتب|كتبتُ|أكتبُ|يكتبُ|to write;ذهب|ذهبتُ|أذهبُ|يذهبُ|to go;شرب|شربتُ|أشربُ|يشربُ|to drink;قرأ|قرأتُ|أقرأُ|يقرأُ|to read;درس|درستُ|أدرسُ|يدرسُ|to study;فتح|فتحتُ|أفتحُ|يفتحُ|to open;جلس|جلستُ|أجلسُ|يجلسُ|to sit;سمع|سمعتُ|أسمعُ|يسمعُ|to hear;لعب|لعبتُ|ألعبُ|يلعبُ|to play;عمل|عملتُ|أعملُ|يعملُ|to work`) }
};
const KANA = "あa いi うu えe おo かka きki くku けke こko さsa しshi すsu せse そso たta ちchi つtsu てte とto なna にni ぬnu ねne のno はha ひhi ふfu へhe ほho まma みmi むmu めme もmo やya ゆyu よyo らra りri るru れre ろro わwa をwo んn".split(" ").map(x => [x[0], x.slice(1)]);
const ALT = { shi: ["si"], chi: ["ti"], tsu: ["tu"], fu: ["hu"], wo: ["o"], n: ["nn"] };
const toKata = c => String.fromCharCode(c.charCodeAt(0) + 0x60);
const VOC = () => Object.values(S.LEVELS).flatMap(L => L.lessons.flatMap(l => l.vocab));
const SENT = () => Object.values(S.LEVELS).flatMap(L => L.lessons.flatMap(l => l.sentences));
const say1 = v => String(v[1]).split(" / ")[0];

/* ===== الصفحة ===== */
$("#nav").insertAdjacentHTML("beforeend", `<a href="#practice" data-page="practice" data-ar="🏋️ التدريب">🏋️ التدريب</a>`);
$("main").insertAdjacentHTML("beforeend", `<div id="practice" class="page-section"><section class="box"><h2>التدريب 🏋️</h2>
<p>تمارين قصيرة (حوالي 5 دقائق) تثبّت ما تعلّمته وتمنحك نقاط XP. تتغير التمارين حسب اللغة التي تتعلّمها.</p>
<div class="tabs" id="prTabs"></div><div class="quiz-card" id="prBox"></div></section></div>`);
const TABS = [["fill", "✏️ أكمل الفراغ", "اختر الكلمة الناقصة في الجملة وتعلّم السبب"], ["conj", "🔄 تصريف الأفعال", "حوّل الفعل إلى الصيغة المطلوبة"], ["match", "🧩 مطابقة الكلمات", "طابق كل كلمة مع معناها بأسرع وقت"], ["listen", "🎧 فهم الاستماع", "استمع للجملة واختر معناها"], ["kana", "⌨️ كتابة الكانا", "اكتب نطق الحرف الياباني بالحروف اللاتينية", "ja"], ["write", "✍️ اكتب وصحّح 🤖", "اكتب جملاً عن موضوع، والذكاء الاصطناعي يصحّحها ويشرح أخطاءك"]];
const tabsFor = () => TABS.filter(t => !t[3] || t[3] === lg());
let P = null;
function intro() {
  P = null; const b = store.get("pr_best", {});
  $("#prTabs").innerHTML = tabsFor().map(([k, t]) => `<button type="button" class="tab-btn" data-pr="${k}">${t}</button>`).join("");
  $("#prBox").innerHTML = `<p>اختر تمريناً للبدء:</p><div class="pr-intro">${tabsFor().map(([k, t, d]) => `<button type="button" class="card pr-pick" data-pr="${k}"><b>${t}</b><small>${d}</small>${b[lg() + "_" + k] != null ? `<small>أفضل نتيجة: ${b[lg() + "_" + k]}%</small>` : ""}</button>`).join("")}</div>`;
}
const head = () => `<div class="bar"><i style="width:${P.i / P.n * 100}%"></i></div><div class="quiz-hint">${P.i + 1} / ${P.n} · ✔ ${P.sc}</div>`;
function finish() {
  const pct = Math.round(P.sc / P.n * 100), b = store.get("pr_best", {}), k = lg() + "_" + P.key;
  if (b[k] == null || pct > b[k]) b[k] = pct; store.set("pr_best", b);
  document.dispatchEvent(new CustomEvent("quizdone", { detail: pct }));
  $("#prBox").innerHTML = `<h3>🎉 انتهى التمرين</h3><div class="score">${P.sc} / ${P.n}</div><p>${pct >= 80 ? "🏆 ممتاز! أنت تتقن هذا." : pct >= 50 ? "👍 جيد، كرّر التمرين لتثبيته." : "💪 لا بأس، راجع الدرس ثم حاول مجدداً."}</p><p>أفضل نتيجة: ${b[k]}%</p>
  <div class="speed-row" style="justify-content:center"><button type="button" class="btn-action" data-pr="${P.key}">إعادة 🔄</button><button type="button" class="btn-action btn-ghost" data-pr-home="1">تمرين آخر</button></div>`;
}
/* سؤال اختيار من متعدد مشترك */
function mcq(top, opts, ans, explain, next) {
  $("#prBox").innerHTML = top + `<div class="quiz-options">${opts.map((o, i) => `<button type="button" class="opt" data-i="${i}">${esc(o)}</button>`).join("")}</div><div id="prFeed"></div>`;
  const bs = $$("#prBox .opt");
  bs.forEach(b => b.onclick = () => {
    if (P.lock) return; P.lock = true;
    const ok = opts[+b.dataset.i] === ans; if (ok) P.sc++;
    bs.forEach(x => { if (opts[+x.dataset.i] === ans) x.classList.add("ok") }); if (!ok) b.classList.add("no");
    $("#prFeed").innerHTML = `<div class="feedback ${ok ? "correct" : "wrong"}" style="display:block">${ok ? "✨ صحيح!" : "❌ الصحيح: " + esc(ans)}</div>${explain || ""}<button type="button" class="btn-action" id="prNext" style="margin-top:10px">التالي ←</button>`;
    $("#prNext").onclick = () => { P.lock = false; P.i++; next() };
  });
}

/* ✏️ أكمل الفراغ */
function fill() {
  const bank = FILL[lg()] || []; P = { key: "fill", i: 0, sc: 0, items: shuffle(bank).slice(0, 10) }; P.n = P.items.length; fillQ();
}
function fillQ() {
  const it = P.items[P.i]; if (!it) return finish();
  const [s, a, o1, o2, o3, m, why] = it, full = s.replace(/＿+/, a);
  mcq(head() + `<p class="quiz-hint">اختر الكلمة المناسبة للفراغ</p><div class="pr-sent">${esc(s).replace(/＿+/, '<span class="pr-blank">؟</span>')}</div><p>المعنى: ${esc(m)}</p>`,
    shuffle([a, o1, o2, o3]), a,
    `<div class="pr-full"><span>${esc(full)}</span><button type="button" class="u-playall" data-say="${esc(full)}">🔊</button></div><p>💡 ${esc(why)}</p>`, fillQ);
}

/* 🔄 التصريف */
function conj() {
  const C = CONJ[lg()]; P = { key: "conj", i: 0, sc: 0, n: 10, items: Array.from({ length: 10 }, () => ({ r: C.v[Math.random() * C.v.length | 0], f: Math.random() * C.f.length | 0 })) }; conjQ();
}
function conjQ() {
  const q = P.items[P.i]; if (!q) return finish();
  const l = lg(), C = CONJ[l], r = q.r, ans = r[q.f + 1], m = r[r.length - 1];
  let opts = l === "ja" ? r.slice(1, 5) : r.slice(0, C.f.length + 1);
  if (l === "en") opts = [...opts, r[0] + "ed", r[0] + "s", r[1] + "ed"];
  opts = [...new Set(opts)].slice(0, 4); if (!opts.includes(ans)) opts[0] = ans;
  mcq(head() + `<p class="quiz-hint">اختر الصيغة الصحيحة للفعل</p><div class="pr-sent">${esc(r[0])} <small>(${esc(m)})</small></div><p>المطلوب: <b>${C.f[q.f]}</b></p>`,
    shuffle(opts), ans, `<p>${C.f.map((f, i) => `${f}: <b>${esc(r[i + 1])}</b>`).join(" · ")}</p><button type="button" class="u-playall" data-say="${esc(ans)}">🔊 ${esc(ans)}</button>`, conjQ);
}

/* 🧩 المطابقة */
function match() {
  const seen = new Set(), v = shuffle(VOC()).filter(x => !seen.has(x[3]) && seen.add(x[3])).slice(0, 15);
  const rounds = [0, 5, 10].map(i => v.slice(i, i + 5)).filter(r => r.length === 5);
  if (!rounds.length) { $("#prBox").innerHTML = "<p>لا توجد كلمات كافية بعد.</p>"; return }
  P = { key: "match", round: 0, rounds, miss: 0, sel: null, left: 0, n: rounds.length * 5, sc: 0, t0: Date.now() }; matchQ();
}
function matchQ() {
  const R = P.rounds[P.round];
  if (!R) { P.sc = Math.max(0, P.n - P.miss); P.i = P.n; return finish() }
  P.left = 5; P.sel = null;
  $("#prBox").innerHTML = `<div class="quiz-hint">الجولة ${P.round + 1} / ${P.rounds.length} · الأخطاء: ${P.miss}</div><p>اضغط كلمة ثم معناها.</p>
  <div class="pr-match"><div class="pr-col">${shuffle(R).map(w => `<button type="button" class="opt jp" data-mw="${esc(w[0])}">${esc(w[0])}${w[1] !== w[0] ? `<small class="ai-sub"> ${esc(w[1])}</small>` : ""}</button>`).join("")}</div>
  <div class="pr-col">${shuffle(R).map(w => `<button type="button" class="opt" data-mm="${esc(w[0])}">${esc(w[3])}</button>`).join("")}</div></div>`;
  const R0 = Object.fromEntries(R.map(w => [w[0], w]));
  $$("#prBox [data-mw]").forEach(b => b.onclick = () => { $$("#prBox [data-mw]").forEach(x => x.classList.remove("sel")); b.classList.add("sel"); P.sel = b.dataset.mw; say(say1(R0[P.sel])) });
  $$("#prBox [data-mm]").forEach(b => b.onclick = () => {
    if (!P.sel) return;
    const w = $(`#prBox [data-mw="${CSS.escape(P.sel)}"]`);
    if (b.dataset.mm === P.sel) { [w, b].forEach(x => { x.classList.remove("sel"); x.classList.add("ok", "done") }); P.sel = null; if (--P.left === 0) { P.round++; setTimeout(matchQ, 650) } }
    else { P.miss++; b.classList.add("no"); setTimeout(() => b.classList.remove("no"), 600); $("#prBox .quiz-hint").textContent = `الجولة ${P.round + 1} / ${P.rounds.length} · الأخطاء: ${P.miss}` }
  });
}

/* 🎧 فهم الاستماع */
function listen() {
  const s = SENT(); if (s.length < 4) { $("#prBox").innerHTML = "<p>لا توجد جمل كافية بعد.</p>"; return }
  P = { key: "listen", i: 0, sc: 0, items: shuffle(s).slice(0, 10) }; P.n = P.items.length; listenQ();
}
function listenQ() {
  const it = P.items[P.i]; if (!it) return finish();
  const opts = shuffle([it[3], ...shuffle([...new Set(SENT().map(x => x[3]).filter(m => m !== it[3]))]).slice(0, 3)]);
  mcq(head() + `<p class="quiz-hint">استمع للجملة واختر معناها</p><div class="speed-row" style="justify-content:center"><button type="button" class="btn-action" data-say="${esc(it[1])}" style="font-size:24px">🔊 استمع</button><button type="button" class="btn-action btn-ghost" data-say="${esc(it[1])}" data-slow="1">🐢 ببطء</button></div>`,
    opts, it[3], `<div class="pr-full"><span>${esc(it[0])}</span></div>${it[2] ? `<p class="sent-ro" style="text-align:center">${esc(it[2])}</p>` : ""}`, listenQ);
  setTimeout(() => say(it[1]), 250);
}

/* ⌨️ كتابة الكانا */
function kana() {
  P = { key: "kana", i: 0, sc: 0, n: 15, items: shuffle(KANA).slice(0, 15).map(([k, r]) => [Math.random() < .5 ? k : toKata(k), r]) }; kanaQ();
}
function kanaQ() {
  const it = P.items[P.i]; if (!it) return finish();
  $("#prBox").innerHTML = head() + `<p class="quiz-hint">اكتب نطق الحرف بالحروف اللاتينية (روماجي) ثم اضغط Enter</p><div class="quiz-q" data-say="${it[0]}" style="cursor:pointer" title="اضغط للاستماع">${it[0]}</div>
  <input type="text" id="prIn" dir="ltr" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="ka" style="text-align:center;font-size:22px;max-width:220px;margin:8px auto;display:block">
  <div class="speed-row" style="justify-content:center"><button type="button" class="btn-action" id="prCheck">تحقّق ✓</button></div><div id="prFeed"></div>`;
  const inp = $("#prIn");
  const check = () => {
    if (P.lock) return; const v = inp.value.trim().toLowerCase(); if (!v) return; P.lock = true;
    const ok = v === it[1] || (ALT[it[1]] || []).includes(v); if (ok) P.sc++; fx(ok); say(it[0]);
    $("#prFeed").innerHTML = `<div class="feedback ${ok ? "correct" : "wrong"}" style="display:block">${ok ? "✨ صحيح!" : "❌ الصحيح: " + it[1]}</div><button type="button" class="btn-action" id="prNext" style="margin-top:10px">التالي ←</button>`;
    $("#prNext").onclick = () => { P.lock = false; P.i++; kanaQ() };
  };
  $("#prCheck").onclick = check;
  inp.onkeydown = e => { if (e.key === "Enter") { e.preventDefault(); P.lock ? $("#prNext").click() : check() } };
  if (!matchMedia("(pointer:coarse)").matches) inp.focus();
}

/* ✍️ اكتب وصحّح (بالذكاء الاصطناعي) */
const TOPICS = ["عرّف بنفسك: اسمك، من أين أنت، وماذا تعمل", "صف يومك من الصباح حتى المساء", "ماذا أكلت اليوم؟ وما طعامك المفضل؟", "تحدّث عن عائلتك", "ما خططك لعطلة نهاية الأسبوع؟", "صف مدينتك أو حيّك", "ما هوايتك المفضلة ولماذا؟", "اكتب رسالة قصيرة لصديق تدعوه فيها لزيارتك", "صف الطقس اليوم وما تحب أن تفعل فيه", "لماذا تتعلّم هذه اللغة؟"];
const mini = t => esc(t || "").replace(/\*\*(.+?)\*\*/g, "<b>$1</b>").replace(/\n/g, "<br>");
function correctionHTML(r) {
  return `<div class="feedback ${r.score >= 7 ? "correct" : "wrong"}" style="display:block">التقييم: ${r.score} / 10 ${r.praise ? "· " + esc(r.praise) : ""}</div>
  ${r.corrected ? `<p><b>✔ بعد التصحيح:</b></p><div class="pr-full"><span>${esc(r.corrected)}</span><button type="button" class="u-playall" data-say="${esc(r.corrected)}">🔊</button></div>` : ""}
  ${r.notes && r.notes.length ? `<p><b>📝 الملاحظات:</b></p><ul style="text-align:start">${r.notes.map(n => `<li>${mini(n)}</li>`).join("")}</ul>` : ""}
  ${r.better ? `<p><b>💡 صياغة أكثر طبيعية:</b> <span class="jp">${esc(r.better)}</span> <button type="button" class="u-playall" data-say="${esc(r.better)}">🔊</button></p>` : ""}
  ${r.meaning ? `<p class="u-note">المعنى: ${esc(r.meaning)}</p>` : ""}`;
}
async function aiCorrect(text, topic, out) {
  const Cl = window.SARI_CLOUD; if (!Cl) return;
  if (!Cl.user()) { out.innerHTML = `<p>${Cl.AI_ERR.login}</p>`; return null }
  out.innerHTML = `<p class="ai-thinking"><span>●</span><span>●</span><span>●</span></p><p class="u-note">يصحّح الذكاء الاصطناعي كتابتك…</p>`;
  const { data, err } = await Cl.ai("correct", { text, task_prompt: topic });
  if (err || !data || !data.result) { out.innerHTML = `<p>${err ? Cl.AI_ERR[err] : "تعذّر التصحيح، حاول مجدداً."}</p>`; return null }
  out.innerHTML = correctionHTML(data.result); return data.result;
}
function write() {
  P = { key: "write", topic: TOPICS[Math.random() * TOPICS.length | 0] };
  $("#prBox").innerHTML = `<p class="quiz-hint">✍️ اكتب باللغة التي تتعلّمها (جملتان إلى خمس جمل)</p><h3 style="margin:10px 0">${esc(P.topic)}</h3>
  <textarea id="prWrite" rows="4" placeholder="اكتب هنا…" style="direction:auto"></textarea>
  <div class="speed-row" style="justify-content:center"><button type="button" class="btn-action" id="prFix">🤖 صحّح كتابتي</button><button type="button" class="btn-action btn-ghost" id="prTopic">موضوع آخر ↻</button></div><div id="prFeed" style="text-align:start"></div>`;
  $("#prTopic").onclick = write;
  $("#prFix").onclick = async () => {
    const t = $("#prWrite").value.trim(); if (t.length < 2) return;
    $("#prFix").disabled = true; const r = await aiCorrect(t, P.topic, $("#prFeed")); $("#prFix").disabled = false;
    if (r) document.dispatchEvent(new CustomEvent("quizdone", { detail: r.score * 10 }));
  };
}
/* 🤖 تصحيح المفكرة */
const dAdd = $("#diaryAdd");
if (dAdd) {
  dAdd.insertAdjacentHTML("afterend", ` <button type="button" class="btn-action btn-ghost" id="diaryFix" style="margin-top:10px">🤖 صحّح بالذكاء الاصطناعي</button><div id="diaryFixOut" style="margin-top:10px"></div>`);
  $("#diaryFix").onclick = () => { const t = $("#diaryText").value.trim(); if (t) aiCorrect(t, "تدوينة يومية في مفكرة التعلّم", $("#diaryFixOut")) };
}
const RUN = { fill, conj, match, listen, kana, write };
function open(k) {
  if (!RUN[k] || !tabsFor().some(t => t[0] === k)) k = "fill";
  if (!$("#practice").classList.contains("active-page")) { const a = $('nav a[data-page="practice"]') || $('[data-page="practice"]'); if (a) a.click() }
  $$("#prTabs [data-pr]").forEach(x => x.classList.toggle("active", x.dataset.pr === k));
  RUN[k]();
}
document.addEventListener("click", e => {
  const b = e.target.closest("[data-pr]"); if (b) { open(b.dataset.pr); return }
  if (e.target.closest("[data-pr-home]")) intro();
  if (e.target.closest('[data-page="practice"]') && !e.target.closest("#practice")) setTimeout(() => { if (!P) intro() }, 0);
});
document.addEventListener("change", e => { if (e.target.id === "learnLang") intro() });
intro();
window.SARI_PRACTICE = { FILL, open };
});
