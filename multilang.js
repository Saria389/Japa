/* multilang.js — يحوّل الموقع كله إلى 4 لغات تعلّم: 日本語 / English / Türkçe / العربية
   يحتاج سطراً واحداً داخل سكربت index.html (انظر الشرح) ويُحمَّل بعد langs-addon.js */
document.addEventListener("DOMContentLoaded", () => {
const S = window.SARI; if (!S) { console.warn("multilang: أضف سطر window.SARI داخل index.html"); return }
const $ = S.$, $$ = S.$$, store = S.store;

/* ===== محتوى اللغات: المفردات "كلمة|نطق|معنى" والجمل "نص|نطق|معنى" ===== */
const V = s => s.split(";").map(x => { const [w, r, m] = x.trim().split("|"); return [w, w, r || "", m] });
const Sn = V, G = (t, d, e) => [t, d, V(e)[0]];
const les = (title, intro, v, g, s) => ({ title, intro, vocab: V(v), grammar: g, sentences: Sn(s) });
const DL = (t, s) => ({ t, l: s.split(";").map(x => { const [who, w, r, m] = x.trim().split("|"); return [who, w, w, r || "", m] }) });
const lvl = (n, d, l) => ({ A1: { name: "المستوى A1 — المبتدئ" + n, desc: d, lessons: l } });
const DATA = {
en: { levels: lvl("", "أساسيات الإنجليزية: التحيات، الأرقام، الأفعال البسيطة.", [
  les("التحيات والتعارف", "عبارات تستخدمها كل يوم عند لقاء الناس.", "hello||مرحباً;goodbye||مع السلامة;please||من فضلك;thank you||شكراً;sorry||آسف;yes||نعم;no||لا;good morning||صباح الخير",
    [G("الفعل to be", "am مع I، are مع you/we/they، is مع he/she/it.", "I am a student.||أنا طالب.")],
    "My name is Sari.||اسمي ساري.;Nice to meet you.||تشرفت بمعرفتك.;How are you?||كيف حالك؟"),
  les("الأرقام والأفعال", "أرقام من 1 إلى 10 وأفعال أساسية.", "one||واحد;two||اثنان;three||ثلاثة;ten||عشرة;eat||يأكل;drink||يشرب;go||يذهب;read||يقرأ",
    [G("المضارع البسيط", "نضيف s للفعل مع he/she/it.", "She reads a book.||هي تقرأ كتاباً.")],
    "I drink water.||أشرب الماء.;He goes to school.||هو يذهب إلى المدرسة.")]),
  dialogs: [DL("1) التعارف", "A|Hello! My name is Sari.||مرحباً! اسمي ساري.;B|Nice to meet you, Sari.||تشرفت بمعرفتك يا ساري.;B|Where are you from?||من أين أنت؟;A|I am from Syria.||أنا من سوريا.")] },
tr: { levels: lvl("", "أساسيات التركية: التحيات، الأرقام، الأفعال البسيطة.", [
  les("التحيات والتعارف", "عبارات تستخدمها كل يوم عند لقاء الناس.", "merhaba||مرحباً;günaydın||صباح الخير;teşekkürler||شكراً;lütfen||من فضلك;evet||نعم;hayır||لا;hoşça kal||مع السلامة;özür dilerim||آسف",
    [G("أنا أكون: -im", "اللاحقة im تعني (أنا): öğrenci + yim = أنا طالب.", "Ben öğrenciyim.||أنا طالب.")],
    "Benim adım Sari.||اسمي ساري.;Tanıştığımıza memnun oldum.||تشرفت بمعرفتك.;Nasılsın?||كيف حالك؟"),
  les("الأرقام والأفعال", "أرقام وأفعال أساسية.", "bir||واحد;iki||اثنان;üç||ثلاثة;on||عشرة;su||ماء;ekmek||خبز;yemek||يأكل;gitmek||يذهب",
    [G("الجمع: -ler / -lar", "للجمع: kitap ← kitaplar.", "Kitaplar masada.||الكتب على الطاولة.")],
    "Su içiyorum.||أشرب الماء.;Okula gidiyorum.||أذهب إلى المدرسة.")]),
  dialogs: [DL("1) التعارف", "A|Merhaba! Benim adım Sari.||مرحباً! اسمي ساري.;B|Memnun oldum Sari.||تشرفت يا ساري.;B|Nerelisin?||من أين أنت؟;A|Suriyeliyim.||أنا سوري.")] },
ar: { levels: lvl("", "Arabic basics (meanings in English): greetings, numbers, simple verbs.", [
  les("التحيات والتعارف", "Everyday greetings.", "مرحبا|marhaba|Hello;صباح الخير|sabah al-khayr|Good morning;شكرا|shukran|Thank you;من فضلك|min fadlik|Please;نعم|na'am|Yes;لا|la|No;مع السلامة|ma'a as-salama|Goodbye;آسف|asif|Sorry",
    [G("Nominal sentence", "No verb 'to be' in the present tense.", "أنا طالب|ana talib|I am a student.")],
    "اسمي ساري|ismi Sari|My name is Sari.;كيف حالك؟|kayfa haluk|How are you?;أنا بخير|ana bikhayr|I am fine."),
  les("الأرقام والأفعال", "Numbers and basic verbs.", "واحد|wahid|One;اثنان|ithnan|Two;ثلاثة|thalatha|Three;ماء|ma'|Water;خبز|khubz|Bread;يأكل|ya'kul|He eats;يشرب|yashrab|He drinks;يذهب|yadhhab|He goes",
    [G("Definite article ال", "Add al- to make a noun definite.", "الكتاب|al-kitab|the book")],
    "أشرب الماء|ashrab al-ma'|I drink water.;أذهب إلى المدرسة|adhhab ila al-madrasa|I go to school.")]),
  dialogs: [DL("1) التعارف", "A|مرحبا! اسمي ساري.|marhaba! ismi Sari.|Hello! My name is Sari.;B|تشرفت بمعرفتك.|tasharraftu bima'rifatik.|Nice to meet you.;B|من أين أنت؟|min ayna anta?|Where are you from?;A|أنا من سوريا.|ana min suriya.|I am from Syria.")] } };
const AL = { en: "A B C D E F G H I J K L M N O P Q R S T U V W X Y Z", tr: "A B C Ç D E F G Ğ H I İ J K L M N O Ö P R S Ş T U Ü V Y Z", ar: "ا ب ت ث ج ح خ د ذ ر ز س ش ص ض ط ظ ع غ ف ق ك ل م ن ه و ي" };
const VC = { ja: "ja-JP", en: "en-US", tr: "tr-TR", ar: "ar-SA" };
const HERO = { ja: ["ابدأ رحلتك مع اليابانية من الصفر حتى N1 🌸", "تعلّم اليابانية مع ساري"], en: ["ابدأ رحلتك مع الإنجليزية من الصفر 🇬🇧", "تعلّم الإنجليزية مع ساري"], tr: ["ابدأ رحلتك مع التركية من الصفر 🇹🇷", "تعلّم التركية مع ساري"], ar: ["Start your Arabic journey from zero 🇸🇦", "Learn Arabic with Sari"] };
const JA = { L: { ...S.LEVELS }, D: [...S.DIALOGS] };
const heroP = $("#home .hero p").textContent;

/* ===== النطق باللغة الصحيحة ===== */
let VL = "ja-JP";
if ("speechSynthesis" in window) { const sp = speechSynthesis.speak.bind(speechSynthesis); speechSynthesis.speak = u => { if (VL !== "ja-JP") { u.lang = VL; u.voice = null } sp(u) } }

/* ===== الواجهة: مظهر مريح + شريط علوي مرتّب ===== */
document.head.insertAdjacentHTML("beforeend", `<style>
.lv-A1{--lv:#2e9e5b}.lv-A2{--lv:#2f80ed}
nav{gap:2px}nav a{font-size:14px;padding:6px 11px;font-weight:600}
.more{position:relative}.more>button{border:0;background:none;font:inherit;font-size:14px;font-weight:600;color:var(--sub);padding:6px 11px;border-radius:10px;cursor:pointer}
.more>button:hover{color:var(--primary);background:var(--primary-soft)}
.more-list{display:none;position:absolute;top:110%;inset-inline-start:0;min-width:170px;background:var(--card);border:1px solid var(--line);border-radius:14px;box-shadow:var(--shadow);padding:6px;flex-direction:column;z-index:1100}
.more.open .more-list{display:flex}.more-list a{display:block}
@media(max-width:860px){.more>button{display:none}.more-list{display:flex;position:static;box-shadow:none;border:0;padding:0;min-width:0}}
.tabs{gap:4px;margin:10px 0;padding:4px;background:var(--card-2);border-radius:14px;width:fit-content;max-width:100%}
.tab-btn{padding:6px 14px;font-size:14px;font-weight:600;background:transparent;border-color:transparent}
.tab-btn:hover{background:var(--primary-soft)}.tab-btn.active{box-shadow:none}
.sent-btns button{background:transparent;border-color:transparent;opacity:.65}.sent-btns button:hover{opacity:1}
.card,.word-card,.sent{box-shadow:none}section.box{padding:28px}
#learnLang{font-family:inherit;font-size:14px;font-weight:700;padding:8px 10px;border-radius:12px;border:1px solid var(--line);background:var(--card);color:var(--text);cursor:pointer}
</style>`);
setTimeout(() => {
  const nv = $("#nav"), keep = ["home", "letters", "curriculum", "conversations", "quiz"], m = document.createElement("div");
  m.className = "more"; m.innerHTML = '<button type="button">المزيد ▾</button><div class="more-list"></div>';
  [...nv.querySelectorAll("a")].filter(a => !keep.includes(a.dataset.page)).forEach(a => m.lastChild.appendChild(a));
  nv.appendChild(m); m.firstChild.onclick = e => { e.stopPropagation(); m.classList.toggle("open") };
  document.addEventListener("click", () => m.classList.remove("open"));
}, 0);

/* ===== مبدّل لغة التعلّم ===== */
const sel = document.createElement("select"); sel.id = "learnLang"; sel.title = "لغة التعلّم";
sel.innerHTML = '<option value="ja">🇯🇵 日本語</option><option value="en">🇬🇧 English</option><option value="tr">🇹🇷 Türkçe</option><option value="ar">🇸🇦 العربية</option>';
$(".head-tools").prepend(sel);
$("#letters").insertAdjacentHTML("beforeend", '<section class="box" id="altLetters" hidden></section>');
let LG = store.get("learnLang", "ja");
function apply(l) {
  store.set("done_" + LG, S.done); const d = store.get("done_" + l, l === "ja" && LG === l ? S.done : {});
  Object.keys(S.done).forEach(k => delete S.done[k]); Object.assign(S.done, d); store.set("done", S.done);
  LG = l; VL = VC[l]; store.set("learnLang", l); sel.value = l;
  const ja = l === "ja";
  Object.keys(S.LEVELS).forEach(k => delete S.LEVELS[k]); Object.assign(S.LEVELS, ja ? JA.L : DATA[l].levels);
  S.DIALOGS.length = 0; S.DIALOGS.push(...(ja ? JA.D : DATA[l].dialogs));
  const ks = Object.keys(S.LEVELS);
  S.MODES.length = 0; S.MODES.push(...(ja ? [["hira", "هيراغانا"], ["kata", "كاتاكانا"]] : []), ...ks.map(k => [k, "مفردات " + k]));
  $("#quizModes").innerHTML = S.MODES.map(([k, t]) => `<button class="tab-btn" data-mode="${k}">${t}</button>`).join("");
  $$("#quizModes .tab-btn").forEach(b => b.onclick = () => S.startQuiz(b.dataset.mode));
  $("#lvTabs").innerHTML = ks.map(k => `<button class="tab-btn lv-${k}" data-lv="${k}">${k}</button>`).join("");
  $$("#lvTabs .tab-btn").forEach(b => b.onclick = () => S.renderLevel(b.dataset.lv));
  $("#bLv").innerHTML = '<option value="">كل المستويات</option>' + [...ks, "قاموسي"].map(k => `<option>${k}</option>`).join("");
  $("#gLv").innerHTML = '<option value="">كل المستويات</option>' + ks.map(k => `<option>${k}</option>`).join("");
  $("#dialogs").innerHTML = S.DIALOGS.map(x => `<div class="dlg"><h3>${x.t}</h3>` + x.l.map(([who, jp, kana, ro, ar]) => `<div class="line ${who === "B" ? "b" : ""}"><div class="av">${who}</div><div class="bub" data-say="${S.esc(kana)}"><div class="sent-jp">${jp}</div><div class="sent-ro">${ro}</div><div class="sent-ar">${ar}</div></div></div>`).join("") + "</div>").join("");
  const al = $("#altLetters"); al.hidden = ja; $("#letters>section.box:not(#altLetters)").hidden = !ja;
  if (!ja) al.innerHTML = `<h2>الحروف والنطق</h2><p>اضغط على أي حرف لسماعه.</p><div class="letters-grid c5" style="max-width:640px">${AL[l].split(" ").map(c => `<div class="letter-card" data-say="${c}"><span class="jp-char" style="font-family:inherit">${c}</span></div>`).join("")}</div>`;
  $("#home .hero h2").textContent = HERO[l][0]; $("#home .hero p").textContent = ja ? heroP : "حروف ونطق صوتي، مستويات، جمل مترجمة، محادثات واختبارات تفاعلية — كل شيء في مكان واحد.";
  $(".brand span:last-child").textContent = HERO[l][1]; document.title = HERO[l][1];
  $$('nav a[data-page="kanji"],nav a[data-page="lab"],[data-ch="order"]').forEach(a => a.style.display = ja ? "" : "none");
  if (!ja && ["kanji", "lab"].includes(($(".page-section.active-page") || {}).id)) $('[data-page="home"]').click();
  S.renderLevel(ks[0]); S.renderHome(); S.renderBank(); S.renderGram();
}
sel.onchange = () => apply(sel.value);
if (store.get("learnLang", "ja") !== "ja") apply(store.get("learnLang", "ja"));
});
