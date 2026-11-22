/* assistant.js — «ساري» مساعدك الشخصي 🤖 (حمّله آخر ملف)
   زر عائم في كل الصفحات + بطاقة في الرئيسية. يعمل بدون إنترنت ويجيب عن:
   معنى الكلمات وترجمتها · خطة اليوم حسب تقدّمك · اختبار سريع · نصائح · «هل تعلم؟» · تقدّمك
   أسئلة شائعة في القواعد · أين تجد كل قسم · تغيير لغة التعلّم · نطق أي جملة */
document.addEventListener("DOMContentLoaded", () => {
const S = window.SARI; if (!S) return;
const $ = S.$, $$ = S.$$, store = S.store, esc = S.esc;
const lg = () => store.get("learnLang", "ja");
const LN = { ja: "اليابانية", en: "الإنجليزية", tr: "التركية", ar: "العربية" };
const shuffle = a => { a = [...a]; for (let i = a.length - 1; i > 0; i--) { const j = Math.random() * (i + 1) | 0; [a[i], a[j]] = [a[j], a[i]] } return a };
const pick = a => a[Math.random() * a.length | 0];
const td = () => new Date().toISOString().slice(0, 10);
const norm = s => String(s || "").toLowerCase().normalize("NFKC").replace(/[ً-ْـ]/g, "").replace(/[إأآ]/g, "ا").replace(/ى/g, "ي").replace(/ة/g, "ه").replace(/[؟?!.,،:;"'()«»\[\]]/g, " ").replace(/\s+/g, " ").trim();
const VOC = () => Object.entries(S.LEVELS).flatMap(([lv, L]) => L.lessons.flatMap(l => l.vocab.map(v => ({ v, lv }))));
const say1 = v => String(v[1]).split(" / ")[0];
const speak = (t, l) => window.SARI_AUDIO && SARI_AUDIO.speak(t, l ? { lang: l } : {});
const streakOf = days => { let n = 0; const d = new Date(); while (days.includes(d.toISOString().slice(0, 10))) { n++; d.setDate(d.getDate() - 1) } return n };
const goPage = p => { const a = $(`nav a[data-page="${p}"]`) || $(`[data-page="${p}"]`); if (a) a.click() };

const CHIPS = [["📅 خطتي اليوم", "خطتي اليوم"], ["🔎 معنى كلمة", "معنى كلمة"], ["🎯 اختبرني", "اختبرني"], ["💡 نصيحة", "نصيحة"], ["🌏 هل تعلم؟", "هل تعلم"], ["📊 تقدّمي", "تقدمي"], ["❓ أسئلة شائعة", "أسئلة شائعة"], ["🧭 الأقسام", "الأقسام"]];
const TIPS = ["⏱️ 20 دقيقة كل يوم أفضل من 3 ساعات مرة في الأسبوع. الاستمرارية هي السر.", "🔁 استخدم «المراجعة المتباعدة» في بنك المفردات: تراجع الكلمة قبل أن تنساها مباشرة.", "🗣️ جرّب «الشادوينغ»: استمع لجملة ثم كررها فوراً بنفس النبرة والسرعة.", "✍️ اكتب الكلمات الجديدة بيدك؛ الكتابة تثبّت الذاكرة أكثر من القراءة فقط.", "🏷️ ضع ملصقات بأسماء الأشياء في بيتك باللغة التي تتعلّمها.", "🎧 استمع لمحتوى بسيط يومياً حتى لو لم تفهم كل شيء؛ أذنك تتعوّد تدريجياً.", "📓 اكتب 3 جمل عن يومك في «المفكرة».", "🎯 احفظ الجمل كاملة لا الكلمات المنفردة فقط؛ الجملة تعطيك القاعدة والسياق معاً.", "😴 النوم بعد المذاكرة يساعد الدماغ على تثبيت ما تعلّمته.", "🤝 لا تخف من الخطأ؛ كل خطأ خطوة للأمام.", "🧠 اربط الكلمة بصورة أو قصة مضحكة لتتذكرها أسرع.", "📱 غيّر لغة هاتفك إلى اللغة التي تتعلّمها لأسبوع كتجربة.", "🏋️ بعد كل درس جرّب تمريناً واحداً في «التدريب» ليثبت الدرس."];
const PAGE_T = { letters: "الحروف والنطق", curriculum: "مراحل التعلّم", conversations: "المحادثات", practice: "التدريب", exam: "نماذج الامتحان", phrases: "عبارات سريعة", bank: "بنك المفردات", grammar: "القواعد", kanji: "كانجي وكتابة", lab: "الجمل والقراءة", challenge: "التحديات", spot: "اكتشف الخطأ", pron: "اختبار النطق", culture: "ثقافة ومعلومات", diary: "المفكرة", quiz: "الاختبارات" };
const NAVK = [[/(حروف|هيراغانا|هيرغانا|ابجديه)/, "letters", "الحروف كلها مع النطق العادي والبطيء"], [/(دروس|الدرس|مراحل|منهج|مستويات)/, "curriculum", "الدروس مرتبة حسب المستوى"], [/(محادث|حوار)/, "conversations", "المحادثات اليومية مع الاستماع للحوار كاملاً"], [/(تدريب|تمرين|تمارين)/, "practice", "التمارين: أكمل الفراغ، التصريف، المطابقة، الاستماع"], [/(نموذج|نماذج|امتحان تجريبي)/, "exam", "نماذج الامتحان التجريبية بمؤقت ونتيجة"], [/(عبارات|سفر|طوارئ)/, "phrases", "العبارات الجاهزة للسفر والطوارئ"], [/(بنك|مفردات|مفضله|مراجعه)/, "bank", "كل الكلمات والمفضلة والمراجعة المتباعدة"], [/(قواعد|قاعده)/, "grammar", "كل القواعد مع البحث والأمثلة"], [/(كتابه|خط اليد)/, "kanji", "تدريب الكتابة بالإصبع"], [/(قراءه|نصوص|مولد)/, "lab", "نصوص القراءة ومولّد الجمل"], [/(تحدي|تحديات)/, "challenge", "التحديات: استماع، زمني، ترتيب، إملاء"], [/(اكتشف الخطا|الخطا)/, "spot", "اختبار «اكتشف الخطأ»"], [/(اختبار النطق|ميكروفون|مايك)/, "pron", "اختبار النطق بالميكروفون"], [/(ثقافه|عادات)/, "culture", "عادات البلد ومعلومات عن اللغة"], [/(مفكره|مذكرات|يوميات)/, "diary", "المفكرة لتدوين ما تعلّمته"], [/(الاختبارات|اختبار المفردات)/, "quiz", "اختبارات الحروف والمفردات"]];

/* أسئلة شائعة: [العنوان، اللغة، تعبير البحث، الجواب، أزرار] */
const FAQ = [
 ["الفرق بين は و が", "ja", /(فرق|متي|كيف|استخدم|اداه|ادوات).*(は|\bwa\b)|(は|\bwa\b).*(が|\bga\b).*(فرق|متي|استخدم)/, "<b>は (wa) و が (ga):</b><br>• <b>は</b> تحدد موضوع الحديث: «بالنسبة لـ...». مثال: わたしは学生です (أنا طالب).<br>• <b>が</b> تركّز على الفاعل أو المعلومة الجديدة: だれが来ましたか (من الذي جاء؟).<br>• ومع 好き و わかる و ある و いる نستخدم が: 猫が好きです (أحب القطط).", [["🏋️ تمرين الأدوات", "pr:fill"]]],
 ["متى أستخدم に و で؟", "ja", /(فرق|متي|كيف|استخدم).*((に|\bni\b).*(で|\bde\b)|(で|\bde\b).*(に|\bni\b))/, "<b>に و で:</b><br>• <b>に</b> للمكان الذي تتجه إليه أو توجد فيه: 学校にいます، وللوقت المحدد: 7時に.<br>• <b>で</b> لمكان حدوث الفعل: 学校で勉強します، وللوسيلة: バスで.", [["🏋️ تمرين الأدوات", "pr:fill"]]],
 ["ما هي الكاتاكانا؟", "ja", /(كاتاكانا|katakana|カタカナ)/, "الكاتاكانا لها نفس أصوات الهيراغانا بشكل مختلف، وتُستخدم للكلمات الأجنبية (コーヒー قهوة)، وأسماء الدول والأشخاص الأجانب (サリ)، وأحياناً للتأكيد.", [["🔤 الحروف", "go:letters"], ["⌨️ تدريب الكانا", "pr:kana"]]],
 ["كيف أتعلّم الكانجي؟", "ja", /(كانجي|kanji|漢字)/, "ابدأ بعد إتقان الهيراغانا. تعلّم الكانجي داخل كلمات لا منفرداً، وتدرّج: حوالي 100 كانجي لـ N5، ثم 300 لـ N4، ثم 650 لـ N3. لكل كانجي قراءة صينية (音) وقراءة يابانية (訓). واكتبه بيدك في «كانجي وكتابة».", [["✍️ كانجي وكتابة", "go:kanji"]]],
 ["ما هو امتحان JLPT؟", "ja", /(jlpt|امتحان الكفاءه|اختبار الكفاءه)/, "امتحان الكفاءة في اليابانية بخمسة مستويات: N5 (الأسهل) حتى N1 (الأصعب). يُعقد عادةً في يوليو وديسمبر، ويقيس المفردات والقواعد والقراءة والاستماع. جرّب «نماذج الامتحان» للتدرّب عليه.", [["🎓 نموذج امتحان", "go:exam"]]],
 ["ما هي لغة الاحترام (敬語)؟", "ja", /(كيغو|keigo|敬語|لغه الاحترام)/, "敬語 ثلاثة أنواع: <b>丁寧語</b> المهذب (です/ます)، و<b>尊敬語</b> لرفع فعل الآخر (いらっしゃる)، و<b>謙譲語</b> لتواضع فعلك أنت (申す، 伺う). ستجدها في درس N2 عن العمل.", [["📚 الدروس", "go:curriculum"]]],
 ["كم أحتاج من الوقت لأتعلّم؟", "*", /(كم (من )?(الوقت|سنه|سنين|شهر|اشهر)|متي (اتقن|اتعلم|اصير)|مده التعلم|بكم شهر)/, "يعتمد على وقتك اليومي. مع 30 إلى 60 دقيقة يومياً يصل كثيرون إلى المستوى الأول (N5 أو A1) خلال 3 إلى 6 أشهر، والمستوى الثاني خلال سنة تقريباً. الاستمرارية أهم من عدد الساعات.", [["📅 خطتي اليوم", "q:خطتي اليوم"]]],
 ["متى أستخدم a و an؟", "en", /(\ban\b.*\ba\b|\ba\b.*\ban\b)/, "نستخدم <b>an</b> قبل الكلمة التي تبدأ <u>بصوت</u> حرف علة: an apple، an hour. ونستخدم <b>a</b> قبل الصوت الساكن: a book، a university (لأنها تُنطق yu).", [["🏋️ تمرين", "pr:fill"]]],
 ["الفرق بين do و does", "en", /\bdoes\b/, "في المضارع البسيط نستخدم <b>does</b> مع he / she / it، و<b>do</b> مع I / you / we / they في النفي والسؤال: Does she work؟ و I don't know. وبعدهما يأتي الفعل الأصلي بدون s.", [["🏋️ تمرين", "pr:fill"]]],
 ["ما هو المضارع التام؟", "en", /(present perfect|المضارع التام|have been|has been)/, "<b>have / has + التصريف الثالث</b>: لحدث في الماضي له علاقة بالحاضر أو لتجربة: I have visited Japan. ومع since و for للمدة: I have lived here since 2020.", [["🔄 تصريف الأفعال", "pr:conj"]]],
 ["ما هو انسجام الأصوات في التركية؟", "tr", /(انسجام|vowel harmony|uyum)/, "اللواحق في التركية تتغير حسب آخر حرف علة في الكلمة:<br>• بعد a ı o u تأتي لواحق بـ a / ı: okul ← okullar، masa ← masada.<br>• بعد e i ö ü تأتي لواحق بـ e / i: ev ← evler، ev ← evde.", [["🏋️ تمرين", "pr:fill"]]],
 ["كيف أنطق الحروف التركية الخاصة؟", "tr", /(حروف|حرف|نطق|انطق).*(ç|ş|ğ|ı|ö|ü)|حروف (التركيه|تركيه)/, "• <b>ç</b> = تش · <b>ş</b> = ش · <b>c</b> = ج<br>• <b>ğ</b> لا تُنطق تقريباً، بل تطيل الحرف الذي قبلها<br>• <b>ı</b> (بدون نقطة) صوت قصير بين الإ والأ<br>• <b>ö</b> و <b>ü</b> مثل الألمانية: ضم الشفتين مع صوت e و i.", [["🔤 الحروف", "go:letters"]]],
 ["ما هي الحروف الشمسية والقمرية؟", "ar", /(شمسي|قمري)/, "مع <b>الحروف الشمسية</b> (ت ث د ذ ر ز س ش ص ض ط ظ ل ن) لا تُنطق لام «ال» ويُشدّد الحرف التالي: الشَّمس. ومع <b>القمرية</b> تُنطق اللام: القَمر، الكتاب.", [["🔤 الحروف", "go:letters"]]],
 ["الصوت لا يعمل، ماذا أفعل؟", "*", /((الصوت|النطق) (لا|ما) (يعمل|يشتغل|بيشتغل|اشتغل))|(ما في صوت|لا يوجد صوت|لا اسمع|ما بسمع|ما عم اسمع)/, "1) تأكد أن صوت الجهاز مرتفع وأن الوضع الصامت مطفأ.<br>2) افتح ⚙️ الإعدادات وانظر قسم «الصوت والنطق»: إذا ظهر «لا يوجد صوت مثبّت» اتبع الخطوات المكتوبة لتثبيت صوت اللغة.<br>3) جرّب متصفح Chrome أو Edge.", [["⚙️ افتح الإعدادات", "set"]]],
 ["كيف أثبّت التطبيق على جهازي؟", "*", /(تثبيت|ثبت التطبيق|التطبيق|بدون (نت|انترنت)|اوفلاين|offline)/, "من ⚙️ الإعدادات اضغط زر 📲 (يظهر عندما يسمح المتصفح بالتثبيت). على الآيفون: زر المشاركة ⬆️ ثم «إضافة إلى الشاشة الرئيسية». بعد أول فتح تعمل المنصة حتى بدون إنترنت.", [["⚙️ الإعدادات", "set"]]],
 ["كيف أنقل تقدّمي لجهاز آخر؟", "*", /(نسخ احتياطي|نسخه احتياطيه|انقل تقدمي|جهاز (اخر|ثاني|تاني)|backup)/, "تقدّمك محفوظ على جهازك. من صفحة «تقدّمي» اضغط «تصدير ⬇️» لتحميل ملف، ثم افتح المنصة على الجهاز الآخر واضغط «استيراد ⬆️» واختر الملف.", [["🏆 تقدّمي", "go:me"]]],
 ["كيف أستخدم المنصة؟", "*", /(كيف استخدم|شرح الموقع|شرح المنصه|كيف يعمل الموقع)/, "طريق مقترح: 1) الحروف والنطق ← 2) الدروس حسب المستوى ← 3) التدريب بعد كل درس ← 4) المحادثات والعبارات ← 5) نماذج الامتحان. وراجع كلماتك يومياً في «بنك المفردات».", [["📅 خطتي اليوم", "q:خطتي اليوم"], ["🧭 كل الأقسام", "menu"]]]
];

/* ===== الواجهة ===== */
document.body.insertAdjacentHTML("beforeend", `<button type="button" class="ai-fab" id="aiFab" aria-label="افتح مساعدك الشخصي" aria-controls="aiPanel" aria-expanded="false"><span aria-hidden="true">🤖</span><b>مساعدك</b></button>
<div class="ai-panel" id="aiPanel" role="dialog" aria-label="المساعد الشخصي" hidden>
 <div class="ai-head"><span class="ai-av" aria-hidden="true">🤖</span><div><b>ساري — مساعدك الشخصي</b><small>يجيب ويقترح ويختبرك، حتى بدون إنترنت</small></div><button type="button" class="icon-btn" id="aiNew" title="محادثة جديدة" aria-label="محادثة جديدة">🧹</button><button type="button" class="icon-btn" id="aiClose" aria-label="إغلاق">✕</button></div>
 <div class="ai-log" id="aiLog" aria-live="polite"></div>
 <div class="ai-chips">${CHIPS.map(([t, q]) => `<button type="button" data-ai-q="${q}">${t}</button>`).join("")}</div>
 <form class="ai-form" id="aiForm"><input type="text" id="aiIn" autocomplete="off" placeholder="اكتب سؤالك... مثلاً: ما معنى ماء؟" aria-label="اكتب سؤالك"><button type="button" class="icon-btn" id="aiMic" aria-label="اسأل بصوتك" title="اسأل بصوتك">🎤</button><button type="submit" class="btn-action">إرسال</button></form>
</div>`);
const dashSec = $("#xDash") && $("#xDash").closest("section");
(dashSec || $("#home .hero")).insertAdjacentHTML("afterend", `<section class="box ai-home"><h2>مساعدك الشخصي 🤖</h2>
<p>اسأل «ساري» عن معنى أي كلمة، اطلب خطة لليوم، أو اختبر نفسك بسرعة. يعمل حتى بدون إنترنت.</p>
<form id="aiHomeForm"><input type="text" id="aiHomeIn" placeholder="مثلاً: ما معنى شكراً؟" aria-label="اسأل المساعد" autocomplete="off"><button type="submit" class="btn-action">اسأل ✨</button></form>
<div class="ai-chips">${CHIPS.slice(0, 5).map(([t, q]) => `<button type="button" data-ai-q="${q}">${t}</button>`).join("")}</div></section>`);

let LOG = store.get("ai_log", []), started = false, waitWord = false, AQ = null;
const logEl = $("#aiLog");
function addMsg(w, html, o = {}) {
  const d = document.createElement("div"); d.className = "ai-msg " + w; d.innerHTML = html; logEl.appendChild(d);
  logEl.scrollTop = logEl.scrollHeight;
  if (!o.np) { LOG.push({ w, h: html }); LOG = LOG.slice(-40); store.set("ai_log", LOG) }
  return d;
}
const bot = (html, o = {}) => addMsg("b", html + (o.acts ? `<div class="ai-acts">${o.acts.map(([t, a]) => `<button type="button" class="ai-act" data-ai-act="${esc(a)}">${t}</button>`).join("")}</div>` : ""), o);
function openAI(q) {
  $("#aiPanel").hidden = false; $("#aiFab").hidden = true; $("#aiFab").setAttribute("aria-expanded", "true");
  if (!started) { started = true; if (LOG.length) LOG.forEach(m => addMsg(m.w, m.h, { np: 1 })); else hello() }
  if (q) send(q); else if (!matchMedia("(pointer:coarse)").matches) $("#aiIn").focus();
}
function closeAI() { $("#aiPanel").hidden = true; $("#aiFab").hidden = false; $("#aiFab").setAttribute("aria-expanded", "false") }
function send(raw) {
  const t = String(raw || "").trim(); if (!t) return;
  addMsg("u", esc(t)); $("#aiIn").value = "";
  setTimeout(() => answer(t), 220);
}

/* ===== الردود ===== */
function hello() {
  const n = store.get("ai_name", ""), st = store.get("stats", {}), s = streakOf(st.days || []);
  bot(`أهلاً${n ? " " + esc(n) : ""}! 👋 أنا <b>ساري</b>، مساعدك الشخصي لتعلّم ${LN[lg()]}.<br>نقاطك ⭐ ${st.xp || 0} · أيامك المتتالية 🔥 ${s}<br>اسألني عن معنى أي كلمة، أو اطلب خطة اليوم، أو اختبرني 👇`,
    { acts: [["📅 خطتي اليوم", "q:خطتي اليوم"], ["🎯 اختبرني", "q:اختبرني"], ["❓ ماذا تستطيع؟", "q:ماذا تستطيع"]] });
}
function help() {
  bot(`أستطيع مساعدتك في:<br>🔎 <b>معنى أي كلمة</b>: «ما معنى ماء؟» أو اكتب الكلمة مباشرة<br>📅 <b>خطة اليوم</b> حسب تقدّمك<br>🎯 <b>اختبار سريع</b> من 5 أسئلة<br>💡 <b>نصائح</b> للحفظ والاستمرار<br>🌏 <b>هل تعلم؟</b> معلومات عن البلد واللغة<br>❓ <b>أسئلة القواعد</b> مثل «الفرق بين は و が»<br>🔊 <b>النطق</b>: «انطق ありがとう»<br>🧭 <b>أين أجد</b> أي قسم<br>🌐 <b>تغيير اللغة</b>: «أريد تعلم التركية»<br>👤 قل «اسمي ...» لأتذكر اسمك`,
    { acts: [["❓ أسئلة شائعة", "q:أسئلة شائعة"], ["🧭 كل الأقسام", "menu"]] });
}
function plan() {
  let next = null;
  for (const [lv, X] of Object.entries(S.LEVELS)) { const i = X.lessons.findIndex((_, k) => !S.done[lv + "-" + k]); if (i >= 0) { next = { lv, i, t: X.lessons[i].title }; break } }
  const due = Object.values(store.get("srs", {})).filter(c => c.due <= td()).length;
  const goal = store.get("xp_goal", 50), xp = store.get("stats", {}).xp || 0, xd = store.get("xp_day", {}), today = xd.d === td() ? Math.max(0, xp - xd.base) : 0;
  const steps = [], acts = [];
  if (due) { steps.push(`🔁 راجع <b>${due}</b> بطاقة مستحقة في المراجعة المتباعدة.`); acts.push(["🔁 ابدأ المراجعة", "srs"]) }
  if (next) { steps.push(`📚 ادرس <b>«${esc(next.t)}»</b> (${next.lv}) واستمع لجمله وكرّرها بصوت عالٍ.`); acts.push(["📚 افتح الدرس", `lesson:${next.lv}|${next.i}`]) }
  else { steps.push("🏆 أنهيت كل الدروس! جرّب نموذج امتحان لتقيس مستواك."); acts.push(["🎓 نموذج امتحان", "go:exam"]) }
  steps.push("🏋️ تمرين «أكمل الفراغ» لتثبيت القواعد (5 دقائق)."); acts.push(["🏋️ ابدأ التمرين", "pr:fill"]);
  steps.push("🎧 استمع لمحادثة كاملة وكرّر بعدها."); acts.push(["💬 المحادثات", "go:conversations"]);
  bot(`📅 <b>خطتك لليوم</b> (حوالي 20 دقيقة):<ol>${steps.map(s => `<li>${s}</li>`).join("")}</ol>🎯 نقاطك اليوم: <b>${today} / ${goal}</b>`, { acts });
}
function stats() {
  const st = store.get("stats", {}), s = streakOf(st.days || []), x = st.xp || 0;
  bot(`📊 <b>تقدّمك</b><br>⭐ النقاط: <b>${x}</b> (المستوى ${Math.floor(x / 100) + 1})<br>🔥 أيام متتالية: <b>${s}</b><br>📘 دروس منجزة في ${LN[lg()]}: <b>${Object.keys(S.done).length}</b><br>🎯 اختبارات: <b>${st.quiz || 0}</b> · 🔁 بطاقات مراجعة: <b>${Object.keys(store.get("srs", {})).length}</b> · ⭐ مفضلة: <b>${store.get("fav", []).length}</b><br>${s >= 3 ? "رائع! حافظ على السلسلة 💪" : "ادخل كل يوم ولو 5 دقائق لتبني سلسلة أيام 🔥"}`, { acts: [["🏆 صفحة تقدّمي", "go:me"]] });
}
function switchLang(s) {
  const l = /يابان/.test(s) ? "ja" : /(انجليز|انكليز)/.test(s) ? "en" : /ترك/.test(s) ? "tr" : "ar", sel = $("#learnLang");
  if (!sel) return; if (sel.value === l) return bot(`أنت تتعلّم ${LN[l]} بالفعل 😊`);
  sel.value = l; sel.dispatchEvent(new Event("change", { bubbles: true }));
  bot(`تم ✅ صرت تتعلّم <b>${LN[l]}</b>. تغيّرت الدروس والتمارين والأجواء.`, { acts: [["📚 ابدأ الدروس", "go:curriculum"], ["📅 خطتي اليوم", "q:خطتي اليوم"]] });
}
const card = ({ v, lv }) => `<div class="ai-word"><div><b class="jp">${esc(v[0])}</b>${v[1] !== v[0] ? ` <span class="ai-sub">${esc(v[1])}</span>` : ""}${v[2] ? ` <span class="ai-ro">${esc(v[2])}</span>` : ""}<div>${esc(v[3])}</div></div><span><span class="lv-badge lv-${lv}">${lv}</span><button type="button" class="ai-mini" data-ai-say="${esc(say1(v))}" data-ai-lang="${lg()}" aria-label="استمع">🔊</button><button type="button" class="ai-mini" data-srs="${esc(v[0])}" title="أضف للمراجعة المتباعدة" aria-label="أضف للمراجعة">🔁</button></span></div>`;
function findWords(q) {
  const nq = norm(q); if (!nq) return [];
  const out = [], seen = new Set();
  VOC().forEach(o => {
    let sc = 0;
    [o.v[0], o.v[1], o.v[2], o.v[3]].map(norm).forEach((x, i) => {
      if (!x) return; const parts = x.split(/\s*[\/(),]\s*/).map(p => p.trim()).filter(Boolean);
      if (x === nq || parts.includes(nq)) sc = Math.max(sc, 100 - i);
      else if (nq.length >= 2 && x.includes(nq)) sc = Math.max(sc, 40 - Math.min(30, x.length - nq.length));
    });
    if (sc > 0) out.push({ ...o, sc });
  });
  return out.sort((a, b) => b.sc - a.sc).filter(o => !seen.has(o.v[0]) && seen.add(o.v[0])).slice(0, 4);
}
function dictFind(q) {
  const nq = norm(q), D = window.SARI_DICT || []; if (!nq) return [];
  const ex = D.filter(r => r.some(x => norm(x) === nq));
  return ex.concat(nq.length >= 3 ? D.filter(r => !ex.includes(r) && r.some(x => norm(x).includes(nq))) : []).slice(0, 3);
}
const dcard = r => `<div class="ai-word"><div><b>${esc(r[0])}</b> · <b>${esc(r[1])}</b><div>${esc(r[2])}</div></div><span><button type="button" class="ai-mini" data-ai-say="${esc(r[0])}" data-ai-lang="en" title="إنجليزي">EN</button><button type="button" class="ai-mini" data-ai-say="${esc(r[1])}" data-ai-lang="tr" title="تركي">TR</button><button type="button" class="ai-mini" data-ai-say="${esc(r[2])}" data-ai-lang="ar" title="عربي">ع</button></span></div>`;
function lookup(t, quiet) {
  const q = t.replace(/(ما|شو|ماذا|وش)?\s*(هو|هي)?\s*(معنى|معني|ترجمة|ترجمه|ترجم|يعني|كيف (أقول|اقول|بقول|نقول)|شلون (أقول|اقول))\s*(كلمة|كلمه)?/g, " ")
    .replace(/(باللغة|باللغه|بال)\s?(ال)?(يابانية|يابانيه|ياباني|انجليزية|انجليزيه|إنجليزية|انجليزي|إنجليزي|انكليزي|تركية|تركيه|تركي|عربية|عربيه|عربي)/g, " ").replace(/[؟?«»"'!.,،]/g, " ").replace(/\s+/g, " ").trim();
  if (!q) { waitWord = true; return bot("اكتب الكلمة التي تريد معناها 👇 (بأي لغة: عربي، ياباني، إنجليزي، تركي)") }
  const hits = findWords(q);
  if (hits.length) return bot(`🔎 نتائج «${esc(q)}» في ${LN[lg()]}:` + hits.map(card).join("")), true;
  const d = dictFind(q);
  if (d.length) return bot(`🔎 وجدتها في القاموس الثلاثي (إنجليزي · تركي · عربي):` + d.map(dcard).join("")), true;
  if (quiet) return false;
  bot(`لم أجد «${esc(q)}» في دروس ${LN[lg()]} 😕 جرّب كلمة أبسط، أو ابحث في بنك المفردات.`, { acts: [["📖 بنك المفردات", "go:bank"], ["🔊 انطقها", "say:" + q]] });
  return true;
}
function grammarSearch(n) {
  const STOP = new Set(["ما", "هو", "هي", "في", "من", "عن", "علي", "كيف", "متي", "ماذا", "هل", "او", "لي", "انا", "انت", "شو", "بدي", "اريد"]);
  const ws = n.split(" ").filter(w => w.length >= 3 && !STOP.has(w)); if (!ws.length) return false;
  const res = [];
  Object.entries(S.LEVELS).forEach(([lv, L]) => L.lessons.forEach(ls => ls.grammar.forEach(g => {
    const ti = norm(g[0]), de = norm(g[1]), hit = ws.filter(w => ti.includes(w) || de.includes(w)).length, sc = ws.filter(w => ti.includes(w)).length * 2 + hit;
    if (sc >= 2 && hit >= Math.ceil(ws.length / 2)) res.push({ lv, g, sc });
  })));
  if (!res.length) return false;
  res.sort((a, b) => b.sc - a.sc);
  bot("🧩 وجدت في القواعد:" + res.slice(0, 2).map(({ lv, g }) => `<div class="ai-word" style="display:block"><span class="lv-badge lv-${lv}">${lv}</span> <b>${esc(g[0])}</b><p>${esc(g[1])}</p><span class="jp">${esc(g[2][0])}</span> — ${esc(g[2][3])} <button type="button" class="ai-mini" style="display:inline-grid;vertical-align:middle" data-ai-say="${esc(g[2][1])}" data-ai-lang="${lg()}" aria-label="استمع">🔊</button></div>`).join(""), { acts: [["🧩 كل القواعد", "go:grammar"]] });
  return true;
}
/* اختبار سريع داخل المحادثة */
function quizStart() {
  const v = shuffle(VOC().map(o => o.v)); if (v.length < 4) return bot("لا توجد كلمات كافية بعد.");
  AQ = { i: 0, sc: 0, items: v.slice(0, 5), id: String(Date.now()) };
  bot("🎯 <b>اختبار سريع</b> من 5 أسئلة! اختر المعنى الصحيح:", { np: 1 }); askQ();
}
function askQ() {
  const v = AQ.items[AQ.i];
  if (!v) {
    document.dispatchEvent(new CustomEvent("quizdone", { detail: AQ.sc * 20 }));
    bot(`انتهى الاختبار: <b>${AQ.sc} / 5</b> ${AQ.sc >= 4 ? "🏆 ممتاز!" : AQ.sc >= 3 ? "👍 جيد جداً!" : "💪 راجع الكلمات وحاول مرة أخرى."}`, { acts: [["🔁 اختبار آخر", "q:اختبرني"], ["📚 راجع الدروس", "go:curriculum"]] });
    AQ = null; return;
  }
  const opts = shuffle([v[3], ...shuffle([...new Set(VOC().map(o => o.v[3]).filter(m => m !== v[3]))]).slice(0, 3)]);
  bot(`❓ (${AQ.i + 1}/5) ما معنى <b class="jp">${esc(v[0])}</b>${v[1] !== v[0] ? ` <span class="ai-sub">${esc(v[1])}</span>` : ""}؟<div class="ai-opts">${opts.map(o => `<button type="button" class="opt" data-ai-ans="${AQ.id}|${AQ.i}|${esc(o)}">${esc(o)}</button>`).join("")}</div>`, { np: 1 });
  speak(say1(v), lg());
}
function quizAnswer(b) {
  const [id, i, o] = b.dataset.aiAns.split("|"); if (!AQ || id !== AQ.id || +i !== AQ.i) return;
  const v = AQ.items[AQ.i], ok = o === v[3], box = b.closest(".ai-opts");
  box.querySelectorAll(".opt").forEach(x => { x.disabled = true; if (x.dataset.aiAns.split("|")[2] === v[3]) x.classList.add("ok") });
  if (!ok) b.classList.add("no"); else AQ.sc++;
  AQ.i++; setTimeout(askQ, 900);
}
/* فهم السؤال */
function answer(t) {
  const n = norm(t); let m;
  if (waitWord) { waitWord = false; return lookup("معنى " + t) }
  if ((m = t.match(/^(?:اسمي|انا اسمي|أنا اسمي|ناديني)\s+(.{1,20})$/))) { store.set("ai_name", m[1].trim()); return bot(`تشرفت بك يا ${esc(m[1].trim())}! 😊 سأتذكر اسمك.`) }
  if (/^(مرحب|اهلا|اهلين|هلا|السلام|سلام|هاي|hi\b|hello|صباح الخير|مساء الخير)/.test(n) && n.split(" ").length <= 4) return hello();
  if (/(شكرا|يسلمو|تسلم|مشكور|يعطيك العافيه|thank)/.test(n)) return bot(pick(["العفو! 😊 أنا هنا متى احتجتني.", "بكل سرور! واصل، أنت تتقدّم 💪", "على الرحب والسعة! 🌸"]));
  if (/(اسئله شا(ي|ئ)عه|الاسئله)/.test(n)) return bot("❓ <b>أسئلة شائعة</b> — اختر سؤالاً:", { acts: FAQ.filter(f => f[1] === "*" || f[1] === lg()).map(f => [f[0], "q:" + f[0]]) });
  for (const f of FAQ) if (f[2].test(n)) return bot(f[3], { acts: f[4] });
  if (/(ماذا تستطيع|شو بتعرف|شو بتقدر|ماذا تفعل|كيف تساعدني|من انت|ساعدني|مساعده)/.test(n)) return help();
  if (/(اتعلم|ادرس|تعلم|غير|حول|بدل)\S* (ال)?(لغه )?(ال)?(يابان|انجليز|انكليز|ترك|عرب)/.test(n)) return switchLang(n);
  if (/(خطه|خطتي|ماذا ادرس|شو ادرس|شو اعمل|ماذا افعل|من وين ابدا|من اين ابدا|برنامج|جدول)/.test(n)) return plan();
  if (/(اختبرني|اسالني|امتحني|اختبار سريع|سؤال سريع|quiz)/.test(n)) return quizStart();
  if (/(نصيحه|نصائح|نصايح|كيف احفظ|انسي|ما بحفظ|تحفيز|حمسني)/.test(n)) return bot("💡 " + pick(TIPS), { acts: [["💡 نصيحة أخرى", "q:نصيحة"]] });
  if (/(هل تعلم|معلومه|حقيقه|حقائق)/.test(n)) return bot("🌏 <b>هل تعلم؟</b> " + esc(window.SARI_CULTURE ? SARI_CULTURE.fact(lg()) : pick(TIPS)), { acts: [["↻ معلومة أخرى", "q:هل تعلم"], ["🌏 ثقافة ومعلومات", "go:culture"]] });
  if (/(تقدمي|نقاطي|نقاط|احصا|مستواي|انجازات|كم تعلمت)/.test(n)) return stats();
  if (/(الاعدادات|اعدادات|الوضع الليلي|حجم الخط|المؤثرات|الاجواء|سرعه النطق)/.test(n)) return bot("كل الإعدادات هنا: الوضع الليلي، حجم الخط، الأجواء والمؤثرات، وسرعة النطق والأصوات ⚙️", { acts: [["⚙️ افتح الإعدادات", "set"]] });
  if ((m = t.match(/^(?:انطق|أنطق|قل|لفظ|اقرأ|اقرا)\s+(.+)/))) { speak(m[1]); return bot(`🔊 أنطق لك: <b class="jp">${esc(m[1])}</b>`, { acts: [["🔁 مرة أخرى", "say:" + m[1]]] }) }
  if (/(معني|ترجم|يعني|كيف اقول|كيف بقول|شلون اقول|بالياباني|بالانجليزي|بالانكليزي|بالتركي|بالعربي)/.test(n)) return lookup(t);
  for (const [re, p, d] of NAVK) if (re.test(n)) return bot(`${d} 👇`, { acts: [[`افتح «${PAGE_T[p]}»`, "go:" + p]] });
  if (/(الاقسام|القايمه|القائمه|الصفحات|وين القي|اين اجد|فين)/.test(n)) return bot("هذه كل أقسام المنصة مع شرح كل قسم 👇", { acts: [["🧭 كل الأقسام", "menu"]] });
  if ((/[a-zçğıöşü぀-ヿ一-鿿]/i.test(t) || n.split(" ").length <= 2) && lookup(t, true)) return;
  if (grammarSearch(n)) return;
  bot("لم أفهم سؤالك تماماً 🤔 جرّب أن تسأل بطريقة أخرى، أو اختر:", { acts: [["🔎 معنى كلمة", "q:معنى كلمة"], ["📅 خطتي اليوم", "q:خطتي اليوم"], ["❓ أسئلة شائعة", "q:أسئلة شائعة"], ["🧭 كل الأقسام", "menu"]] });
}
function act(a) {
  const i = a.indexOf(":"), k = i < 0 ? a : a.slice(0, i), v = i < 0 ? "" : a.slice(i + 1);
  const small = () => { if (matchMedia("(max-width:860px)").matches) closeAI() };
  if (k === "q") return send(v);
  if (k === "say") return speak(v);
  if (k === "go") { goPage(v); small() }
  else if (k === "lesson") { const [lv, x] = v.split("|"); S.renderLevel(lv); goPage("curriculum"); small(); setTimeout(() => { const d = $$("#lvContent details")[+x]; if (d) { d.open = true; d.scrollIntoView({ behavior: "smooth", block: "start" }) } }, 500) }
  else if (k === "srs") { goPage("bank"); small(); setTimeout(() => { const t = $('[data-t="pSrs"]'); if (t) t.click() }, 80) }
  else if (k === "pr") { if (window.SARI_PRACTICE) SARI_PRACTICE.open(v); small() }
  else if (k === "exam") { if (window.SARI_EXAM) SARI_EXAM.start(v); small() }
  else if (k === "set") { closeAI(); if (window.SARI_UI) SARI_UI.openSettings() }
  else if (k === "menu") { closeAI(); if (window.SARI_UI) SARI_UI.openMenu() }
}

/* ===== الأحداث ===== */
$("#aiFab").onclick = () => openAI();
$("#aiClose").onclick = closeAI;
$("#aiNew").onclick = () => { LOG = []; store.set("ai_log", LOG); logEl.innerHTML = ""; AQ = null; waitWord = false; hello() };
$("#aiForm").onsubmit = e => { e.preventDefault(); send($("#aiIn").value) };
$("#aiHomeForm").onsubmit = e => { e.preventDefault(); const v = $("#aiHomeIn").value.trim(); $("#aiHomeIn").value = ""; openAI(v || null) };
document.addEventListener("keydown", e => { if (e.key === "Escape" && !$("#aiPanel").hidden) closeAI() });
document.addEventListener("click", e => {
  const a = e.target.closest("[data-ai-act]"); if (a) return act(a.dataset.aiAct);
  const q = e.target.closest("[data-ai-q]"); if (q) { $("#aiPanel").hidden ? openAI(q.dataset.aiQ) : send(q.dataset.aiQ); return }
  const s = e.target.closest("[data-ai-say]"); if (s) return speak(s.dataset.aiSay, s.dataset.aiLang);
  const an = e.target.closest("[data-ai-ans]"); if (an) return quizAnswer(an);
  const sr = e.target.closest("#aiPanel [data-srs]"); if (sr) setTimeout(() => { sr.textContent = "✔"; sr.title = "أُضيفت للمراجعة" }, 0);
});
const SR = window.SpeechRecognition || window.webkitSpeechRecognition, mic = $("#aiMic");
if (!SR) mic.hidden = true;
else mic.onclick = () => {
  try {
    if (window.speechSynthesis) speechSynthesis.cancel();
    const r = new SR(); r.lang = "ar-SA"; r.interimResults = false;
    r.onresult = e => send(e.results[0][0].transcript);
    r.onerror = () => bot("لم أسمعك جيداً 🎤 حاول مجدداً أو اكتب سؤالك.", { np: 1 });
    r.onend = () => mic.classList.remove("is-speaking");
    mic.classList.add("is-speaking"); r.start();
  } catch (x) { mic.classList.remove("is-speaking") }
};
window.SARI_AI = { open: openAI, ask: q => openAI(q) };
});
