/* levels-tr.js — مستويات التركية B1 → C2 (يُحمَّل قبل multilang.js) */
(() => {
const V = s => s.split(";").map(x => { const [w, r, m] = x.trim().split("|"); return [w, w, r || "", m] });
const les = (title, intro, v, g, s) => ({ title, intro, vocab: V(v), grammar: g.map(([t, d, e]) => [t, d, V(e)[0]]), sentences: V(s) });
const lv = (name, desc, lessons) => ({ name, desc, lessons });
window.SARI_MORE = window.SARI_MORE || {};
window.SARI_MORE.tr = {
B1: lv("المستوى B1 — المتوسط", "الشرط، الخبر المنقول، والحديث عن مواقف الحياة.", [
 les("الشرط: -se / -sa", "إذا حدث كذا... ولو كان كذا...", "eğer||إذا;hava||طقس;zaman||وقت;para||مال;karar vermek||يقرر;belki||ربما;fırsat||فرصة;tavsiye||نصيحة",
  [["الشرط", "الفعل + r + se: gelirsen = إذا أتيت. وللافتراض: olsa ... -ırdı = لو كان... لـ...", "Yağmur yağarsa evde kalırız.||إذا أمطرت سنبقى في البيت."]],
  "Vaktim olursa sana yardım ederim.||إذا كان عندي وقت سأساعدك.;Param olsa araba alırdım.||لو كان عندي مال لاشتريت سيارة.;Erken kalkarsan otobüse yetişirsin.||إذا استيقظت باكراً ستلحق الحافلة."),
 les("الماضي المنقول: -miş", "لحدث لم تشهده بنفسك بل سمعت عنه.", "duymak||يسمع;söylemek||يقول;haber||خبر;galiba||على ما يبدو;olay||حادثة;gazete||صحيفة;komşu||جار;kaza||حادث",
  [["-miş للخبر المنقول", "gelmiş = يبدو / يقال إنه جاء. نستخدمها عندما ننقل خبراً أو نكتشف شيئاً.", "Ali dün İstanbul'a gitmiş.||يقال إن علي ذهب أمس إلى إسطنبول."]],
  "Komşumuz yeni bir araba almış.||يبدو أن جارنا اشترى سيارة جديدة.;Gazetede okudum, bir kaza olmuş.||قرأت في الصحيفة أن حادثاً وقع.;Sen çok yorulmuşsun.||يبدو أنك تعبت كثيراً.")]),
B2: lv("المستوى B2 — فوق المتوسط", "المبني للمجهول وتحويل الجمل إلى أسماء.", [
 les("المبني للمجهول: -il / -in", "التركيز على الحدث لا على الفاعل.", "yapılmak||يُصنع / يُبنى;yazılmak||يُكتب;satılmak||يُباع;bulunmak||يوجد;kurulmak||يُؤسَّس;açıklanmak||يُعلَن;yüzyıl||قرن;bölge||منطقة",
  [["المجهول", "نضيف -il (أو -in بعد حرف علة أو l): yapmak ← yapılmak، okumak ← okunmak.", "Bu köprü 1973'te yapıldı.||بُني هذا الجسر عام 1973."]],
  "Türkiye'de çok çay içilir.||يُشرب الشاي كثيراً في تركيا.;Sonuçlar yarın açıklanacak.||ستُعلن النتائج غداً.;Bu kitap otuz dile çevrildi.||تُرجم هذا الكتاب إلى ثلاثين لغة."),
 les("تحويل الجملة إلى اسم: -dığı / -acağı", "أعرف أنه جاء، الكتاب الذي قرأته...", "bilmek||يعرف;düşünmek||يفكر;hatırlamak||يتذكر;anlamak||يفهم;inanmak||يصدق;söz||كلمة / وعد;neden||سبب;gerçek||حقيقة",
  [["-dığı / -acağı", "geldiğini = أنه جاء، geleceğini = أنه سيأتي، okuduğum kitap = الكتاب الذي قرأته.", "Onun geleceğini biliyorum.||أعرف أنه سيأتي."]],
  "Ne dediğini anlamadım.||لم أفهم ما قلته.;Okuduğum kitap çok güzeldi.||الكتاب الذي قرأته كان جميلاً جداً.;Doğru söylediğine inanıyorum.||أصدق أنك تقول الحقيقة.")]),
C1: lv("المستوى C1 — المتقدم", "اللغة الرسمية والإعلامية، والوجوب والاحتمال.", [
 les("اللغة الرسمية والإعلامية", "كلمات الأخبار والمقالات.", "ancak||إلا أن;dolayısıyla||وبالتالي;ayrıca||بالإضافة إلى ذلك;araştırma||بحث;etkilemek||يؤثر;gelişme||تطور;açıklama||تصريح / بيان;iklim||مناخ",
  [["أدوات الربط الرسمية", "ancak للاستدراك، dolayısıyla للنتيجة، ayrıca للإضافة.", "Proje pahalıydı; ancak kabul edildi.||كان المشروع مكلفاً، إلا أنه قُبل."]],
  "Araştırma önemli sonuçlar ortaya koydu.||كشف البحث عن نتائج مهمة.;Dolayısıyla planı değiştirdik.||وبالتالي غيّرنا الخطة.;İklim değişikliği tarımı etkiliyor.||التغير المناخي يؤثر على الزراعة."),
 les("الوجوب والاحتمال: -meli / -ebilir", "يجب أن... وقد...", "mümkün||ممكن;gerekli||ضروري;zorunlu||إلزامي;ihtimal||احتمال;tahmin etmek||يخمّن;muhtemelen||على الأرجح;şart||شرط;kesinlikle||بالتأكيد",
  [["-meli / -ebilir", "-meli للوجوب (gitmeliyim = يجب أن أذهب)، و -ebilir للإمكان (gelebilir = قد يأتي).", "Bu konuyu ciddiye almalıyız.||يجب أن نأخذ هذا الموضوع بجدية."]],
  "Yarın kar yağabilir.||قد يتساقط الثلج غداً.;Herkes kurallara uymalı.||يجب على الجميع الالتزام بالقواعد.;Muhtemelen geç kalacak.||على الأرجح سيتأخر.")]),
C2: lv("المستوى C2 — الإتقان", "الأمثال والتعابير والأسلوب الأدبي.", [
 les("الأمثال والتعابير", "الأمثال (atasözleri) جزء أساسي من الكلام الفصيح.", "Damlaya damlaya göl olur||قطرة قطرة تصبح بحيرة;Sakla samanı, gelir zamanı||احفظ القش فسيأتي وقته;Bir elin nesi var, iki elin sesi var||يد وحدها لا تصفق;Ayağını yorganına göre uzat||مدّ رجليك على قدّ لحافك;Üzüm üzüme baka baka kararır||الصاحب ساحب;etekleri zil çalmak||يطير من الفرح;kulak asmamak||لا يعير اهتماماً;ağzı kulaklarına varmak||يبتسم من الأذن إلى الأذن",
  [["الأمثال", "احفظ المثل كاملاً بمعناه لا بترجمته الحرفية، واستخدمه في موقفه المناسب.", "Damlaya damlaya göl olur.||قطرة قطرة تصبح بحيرة."]],
  "Her gün biraz çalış, damlaya damlaya göl olur.||ادرس قليلاً كل يوم، فالقليل يصنع الكثير.;Haberi duyunca etekleri zil çaldı.||عندما سمع الخبر طار من الفرح.;Uyarılarıma hiç kulak asmadı.||لم يُعر تحذيراتي أي اهتمام."),
 les("الأسلوب الأدبي: -ken و -erek", "مفردات الأدب والشعور.", "hasret||حنين;huzur||طمأنينة;ebedi||أبدي;muhteşem||رائع / مهيب;sükûnet||سكينة;özlem||اشتياق;yüce||سامٍ;derin||عميق",
  [["-ken و -erek", "-ken = بينما (bakarken = وأنا أنظر)، -erek = بطريقة (gülerek = ضاحكاً).", "Denize bakarken huzur buldum.||وجدت الطمأنينة وأنا أنظر إلى البحر."]],
  "Memleketime derin bir özlem duyuyorum.||أشعر بشوق عميق لوطني.;Gülerek odaya girdi.||دخل الغرفة ضاحكاً.;İstanbul'un manzarası muhteşemdi.||كان منظر إسطنبول رائعاً.")])
};
})();
