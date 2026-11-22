/* levels-en.js — مستويات الإنجليزية B1 → C2 (يُحمَّل قبل multilang.js)
   الصيغة: "الكلمة||المعنى" والعناصر تفصلها ; */
(() => {
const V = s => s.split(";").map(x => { const [w, r, m] = x.trim().split("|"); return [w, w, r || "", m] });
const les = (title, intro, v, g, s) => ({ title, intro, vocab: V(v), grammar: g.map(([t, d, e]) => [t, d, V(e)[0]]), sentences: V(s) });
const lv = (name, desc, lessons) => ({ name, desc, lessons });
window.SARI_MORE = window.SARI_MORE || {};
window.SARI_MORE.en = {
B1: lv("المستوى B1 — المتوسط", "التجارب، الشرط، والتعبير عن الآراء في مواقف الحياة.", [
 les("التجارب والمضارع التام", "الحديث عن تجاربك دون تحديد الوقت.", "experience||تجربة;achieve||يحقق;already||بالفعل;yet||بعد (في النفي والسؤال);recently||مؤخراً;ever||من قبل (في السؤال);never||أبداً;abroad||في الخارج",
  [["Present perfect أم Past simple؟", "present perfect لتجربة بلا وقت محدد، والماضي البسيط مع وقت محدد (yesterday, last year).", "Have you ever been abroad?||هل سافرت إلى الخارج من قبل؟"]],
  "I have already finished my homework.||أنهيت واجبي بالفعل.;She hasn't called me yet.||لم تتصل بي بعد.;I went to Paris last year.||ذهبت إلى باريس السنة الماضية."),
 les("الجمل الشرطية", "إذا حدث كذا... ولو كان كذا...", "if||إذا;unless||ما لم;decide||يقرر;probably||على الأرجح;chance||فرصة;advice||نصيحة;situation||موقف;lottery||يانصيب",
  [["First & second conditional", "If + مضارع ثم will للاحتمال الحقيقي، و If + ماضٍ ثم would للافتراض غير الواقعي.", "If I had more time, I would learn Japanese.||لو كان عندي وقت أكثر لتعلمت اليابانية."]],
  "If it rains, we will stay at home.||إذا أمطرت سنبقى في البيت.;What would you do if you won the lottery?||ماذا ستفعل لو ربحت اليانصيب؟;Unless you hurry, you will miss the bus.||ما لم تسرع ستفوتك الحافلة.")]),
B2: lv("المستوى B2 — فوق المتوسط", "المبني للمجهول، الكلام المنقول، ونقاش المواضيع العامة.", [
 les("المبني للمجهول", "التركيز على الحدث لا على الفاعل.", "invent||يخترع;build||يبني;publish||ينشر;produce||ينتج;damage||يتلف;announce||يعلن;region||منطقة;century||قرن",
  [["Passive voice", "be + التصريف الثالث: The bridge was built.", "The bridge was built in 1990.||بُني الجسر عام 1990."]],
  "English is spoken all over the world.||الإنجليزية تُتحدث في كل العالم.;The results will be announced tomorrow.||ستُعلن النتائج غداً.;The house has been damaged by the storm.||تضرر البيت بسبب العاصفة."),
 les("الكلام المنقول", "كيف تنقل كلام الآخرين.", "claim||يدّعي;mention||يذكر;admit||يعترف;deny||ينكر;suggest||يقترح;explain||يشرح;warn||يحذّر;promise||يعد",
  [["Reported speech", "عند نقل الكلام نرجع الزمن خطوة للوراء: is ← was، will ← would.", "She said that she was tired.||قالت إنها متعبة."]],
  "He promised that he would help me.||وعد بأنه سيساعدني.;They denied breaking the window.||أنكروا كسر النافذة.;She suggested going to the cinema.||اقترحت الذهاب إلى السينما.")]),
C1: lv("المستوى C1 — المتقدم", "الكتابة الأكاديمية، أدوات الربط، والتوكيد.", [
 les("التعبير الأكاديمي", "كلمات تجعل كتابتك رسمية ومترابطة.", "nevertheless||ومع ذلك;furthermore||علاوة على ذلك;consequently||وبالتالي;significant||ملحوظ / كبير;evidence||دليل;approach||نهج;assess||يقيّم;crucial||حاسم",
  [["Linking words", "however للتناقض، therefore للنتيجة، moreover للإضافة.", "The plan was expensive; nevertheless, it was approved.||كانت الخطة مكلفة، ومع ذلك تمت الموافقة عليها."]],
  "There is significant evidence to support this theory.||هناك أدلة كبيرة تدعم هذه النظرية.;Consequently, the company changed its approach.||وبالتالي غيّرت الشركة نهجها.;It is crucial to assess the risks first.||من الضروري تقييم المخاطر أولاً."),
 les("القلب والتوكيد (Inversion)", "أسلوب قوي للتوكيد في الكلام الرسمي.", "rarely||نادراً;hardly||بالكاد;seldom||قلّما;not only||ليس فقط;under no circumstances||تحت أي ظرف;indeed||حقاً;scarcely||بالكاد;only then||عندها فقط",
  [["Inversion", "بعد الظروف السلبية في بداية الجملة نقدّم الفعل المساعد: Never have I...", "Never have I seen such a beautiful place.||لم أرَ أبداً مكاناً بهذا الجمال."]],
  "Rarely do we see such talent.||نادراً ما نرى مثل هذه الموهبة.;Not only is he smart, but he is also kind.||ليس ذكياً فقط بل لطيف أيضاً.;Under no circumstances should you open this door.||لا تفتح هذا الباب تحت أي ظرف.")]),
C2: lv("المستوى C2 — الإتقان", "التعابير الاصطلاحية، الفروق الدقيقة، والأسلوب الرفيع.", [
 les("التعابير الاصطلاحية", "تعابير لا تُفهم حرفياً، يستخدمها المتحدثون الأصليون كثيراً.", "break the ice||يكسر الجليد;hit the nail on the head||يصيب كبد الحقيقة;a blessing in disguise||ربّ ضارة نافعة;once in a blue moon||نادراً جداً;bite the bullet||يتحمل الأمر الصعب;the tip of the iceberg||رأس جبل الجليد;cut corners||يختصر على حساب الجودة;on the fence||متردد",
  [["Idioms", "احفظ التعبير كاملاً مع سياقه، ولا تترجمه كلمة بكلمة.", "Losing that job was a blessing in disguise.||كان فقدان تلك الوظيفة ربّ ضارة نافعة."]],
  "You hit the nail on the head.||أصبت كبد الحقيقة.;We see each other once in a blue moon.||نلتقي نادراً جداً.;This problem is just the tip of the iceberg.||هذه المشكلة مجرد رأس جبل الجليد."),
 les("الأسلوب الرفيع والفروق الدقيقة", "مفردات متقدمة وصيغ رسمية.", "ubiquitous||منتشر في كل مكان;meticulous||دقيق جداً;ambiguous||غامض;eloquent||بليغ;pragmatic||عملي واقعي;inevitable||حتمي;nuance||فارق دقيق;scrutinize||يفحص بدقة",
  [["Subjunctive", "في الأسلوب الرسمي بعد essential / important that يأتي الفعل بصيغته الأصلية.", "It is essential that every student be present.||من الضروري أن يحضر كل طالب."]],
  "Smartphones have become ubiquitous.||أصبحت الهواتف الذكية منتشرة في كل مكان.;Her speech was eloquent and persuasive.||كان خطابها بليغاً ومقنعاً.;Change is inevitable.||التغيير حتمي.")])
};
})();
