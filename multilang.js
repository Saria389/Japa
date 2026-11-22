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
const A2 = (d, l) => ({ name: "المستوى A2 — الأساسي", desc: d, lessons: l });
const DATA = {
en: { levels: { ...lvl("", "أساسيات الإنجليزية: التحيات، الأرقام، الأفعال البسيطة.", [
  les("التحيات والتعارف", "عبارات تستخدمها كل يوم عند لقاء الناس.", "hello||مرحباً;goodbye||مع السلامة;please||من فضلك;thank you||شكراً;sorry||آسف;yes||نعم;no||لا;good morning||صباح الخير",
    [G("الفعل to be", "am مع I، are مع you/we/they، is مع he/she/it.", "I am a student.||أنا طالب.")],
    "My name is Sari.||اسمي ساري.;Nice to meet you.||تشرفت بمعرفتك.;How are you?||كيف حالك؟"),
  les("الأرقام والأفعال", "أرقام من 1 إلى 10 وأفعال أساسية.", "one||واحد;two||اثنان;three||ثلاثة;ten||عشرة;eat||يأكل;drink||يشرب;go||يذهب;read||يقرأ",
    [G("المضارع البسيط", "نضيف s للفعل مع he/she/it.", "She reads a book.||هي تقرأ كتاباً.")],
    "I drink water.||أشرب الماء.;He goes to school.||هو يذهب إلى المدرسة."),
  les("العائلة والناس", "أفراد العائلة وصفات الأشخاص.", "mother||أم;father||أب;brother||أخ;sister||أخت;friend||صديق;teacher||معلّم;tall||طويل;kind||لطيف",
    [G("الملكية: my / your / his / her", "my = ـي، your = ـك، his = ـه، her = ـها.", "This is my brother.||هذا أخي.")],
    "My mother is a teacher.||أمي معلّمة.;Her sister is very kind.||أختها لطيفة جداً.;I have two brothers.||عندي أخوان."),
  les("الطعام والشراب", "كلمات المطعم والمطبخ.", "bread||خبز;rice||أرز;chicken||دجاج;coffee||قهوة;apple||تفاحة;hungry||جائع;delicious||لذيذ;bill||فاتورة",
    [G("I would like... (طلب مهذب)", "نستخدم I would like أو I'd like لطلب شيء بأدب.", "I would like a coffee, please.||أريد قهوة من فضلك.")],
    "I am hungry.||أنا جائع.;This soup is delicious.||هذه الشوربة لذيذة.;Can I have some water?||هل يمكنني الحصول على بعض الماء؟"),
  les("الأيام والوقت", "أيام الأسبوع والساعة.", "Monday||الاثنين;Friday||الجمعة;Sunday||الأحد;today||اليوم;tomorrow||غداً;morning||صباح;evening||مساء;o'clock||الساعة تماماً",
    [G("حروف الوقت: at / on / in", "at مع الساعة، on مع الأيام، in مع الشهور والسنوات.", "I wake up at seven o'clock.||أستيقظ الساعة السابعة.")],
    "What time is it?||كم الساعة؟;It's half past three.||الساعة الثالثة والنصف.;See you on Monday.||أراك يوم الاثنين."),
  les("الأماكن والاتجاهات", "السؤال عن الطريق.", "street||شارع;station||محطة;hospital||مستشفى;left||يسار;right||يمين;near||قريب من;far||بعيد;turn||ينعطف",
    [G("There is / There are", "للتعبير عن وجود شيء: there is للمفرد و there are للجمع.", "There is a bank near the station.||يوجد بنك قرب المحطة.")],
    "Where is the hospital?||أين المستشفى؟;Turn left at the corner.||انعطف يساراً عند الزاوية.;It is not far from here.||ليس بعيداً من هنا.")]),
  A2: A2("الماضي والمستقبل والمقارنة، وعبارات السفر.", [
  les("الماضي البسيط", "الحديث عن أحداث انتهت.", "went||ذهب;saw||رأى;ate||أكل;bought||اشترى;yesterday||أمس;last week||الأسبوع الماضي;ago||منذ;visited||زار",
    [G("Past simple", "الأفعال المنتظمة نضيف لها ed، وغير المنتظمة لها صيغ خاصة (go ← went). في النفي والسؤال نستخدم did + الفعل الأصلي.", "Did you go to the park yesterday?||هل ذهبت إلى الحديقة أمس؟")],
    "I visited my grandmother last week.||زرت جدتي الأسبوع الماضي.;We ate pizza for dinner.||أكلنا البيتزا على العشاء.;She didn't buy anything.||لم تشترِ شيئاً."),
  les("المستقبل والخطط", "التحدث عن الخطط والتوقعات.", "plan||خطة;holiday||عطلة;travel||يسافر;next year||السنة القادمة;soon||قريباً;maybe||ربما;hope||يأمل;ticket||تذكرة",
    [G("will / going to", "going to للخطط المقررة مسبقاً، و will للقرارات الفورية والتوقعات.", "I am going to study in Japan next year.||سأدرس في اليابان السنة القادمة.")],
    "It will rain tomorrow.||ستمطر غداً.;What are you going to do this weekend?||ماذا ستفعل في عطلة نهاية الأسبوع؟;I hope to see you soon.||آمل أن أراك قريباً."),
  les("المقارنة", "مقارنة الأشياء والأشخاص.", "bigger||أكبر;smaller||أصغر;better||أفضل;worse||أسوأ;the best||الأفضل;more expensive||أغلى;cheaper||أرخص;than||من (للمقارنة)",
    [G("Comparatives & superlatives", "الصفات القصيرة نضيف لها er و est، والطويلة نستخدم more و the most.", "This phone is cheaper than that one.||هذا الهاتف أرخص من ذاك.")],
    "Tokyo is bigger than Kyoto.||طوكيو أكبر من كيوتو.;This is the best day of my life.||هذا أفضل يوم في حياتي.;Gold is more expensive than silver.||الذهب أغلى من الفضة."),
  les("السفر والفندق", "عبارات السفر والحجز.", "passport||جواز سفر;luggage||أمتعة;reservation||حجز;room||غرفة;key||مفتاح;flight||رحلة طيران;arrive||يصل;leave||يغادر",
    [G("Can / Could (الطلب المهذب)", "could أكثر تهذيباً من can عند الطلب.", "Could you help me with my luggage?||هل يمكنك مساعدتي في أمتعتي؟")],
    "I have a reservation for two nights.||لدي حجز لليلتين.;What time is check-out?||متى موعد المغادرة؟;My flight leaves at nine.||تغادر رحلتي الساعة التاسعة."),
  les("الصحة والجسم", "وصف الألم عند الطبيب والصيدلية.", "head||رأس;stomach||معدة / بطن;tooth||سن;fever||حرارة;cough||سعال;medicine||دواء;pharmacy||صيدلية;appointment||موعد",
    [G("have a ...ache", "للألم نقول I have a + ache: headache (صداع)، toothache، stomachache.", "I have a headache.||عندي صداع.")],
    "I don't feel well.||لا أشعر أنني بخير.;You should take this medicine twice a day.||يجب أن تتناول هذا الدواء مرتين يومياً.;Where is the nearest pharmacy?||أين أقرب صيدلية؟"),
  les("العمل والدراسة", "الحديث عن الدراسة والعمل والمقابلات.", "job||وظيفة;office||مكتب;manager||مدير;salary||راتب;interview||مقابلة;university||جامعة;exam||امتحان;homework||واجب",
    [G("Present continuous للخطط القريبة", "نستخدم am / is / are + ing أيضاً للخطط المؤكدة القريبة.", "I am starting a new job next week.||سأبدأ عملاً جديداً الأسبوع القادم.")],
    "What do you do?||ماذا تعمل؟;I work in an office.||أعمل في مكتب.;I have an exam tomorrow.||عندي امتحان غداً.")]) },
  dialogs: [DL("1) التعارف", "A|Hello! My name is Sari.||مرحباً! اسمي ساري.;B|Nice to meet you, Sari.||تشرفت بمعرفتك يا ساري.;B|Where are you from?||من أين أنت؟;A|I am from Syria.||أنا من سوريا."),
    DL("2) في المطعم", "B|Hello! Are you ready to order?||مرحباً! هل أنت مستعد للطلب؟;A|Yes, I'd like the chicken, please.||نعم، أريد الدجاج من فضلك.;B|Anything to drink?||هل تريد شيئاً للشرب؟;A|Just water, thank you.||ماء فقط، شكراً.;A|Can I have the bill, please?||الفاتورة من فضلك."),
    DL("3) السؤال عن الطريق", "A|Excuse me, where is the station?||المعذرة، أين المحطة؟;B|Go straight and turn right.||امشِ مباشرة ثم انعطف يميناً.;A|Is it far?||هل هي بعيدة؟;B|No, it's about five minutes on foot.||لا، حوالي خمس دقائق مشياً.;A|Thank you very much!||شكراً جزيلاً!"),
    DL("4) في الفندق", "B|Good evening. How can I help you?||مساء الخير، كيف أساعدك؟;A|I have a reservation. My name is Sari.||لدي حجز، اسمي ساري.;B|Can I see your passport, please?||هل يمكنني رؤية جواز سفرك؟;A|Here you are. What time is breakfast?||تفضل. متى الفطور؟;B|From seven to ten. Here is your key.||من السابعة حتى العاشرة. هذا مفتاحك.")] },
tr: { levels: { ...lvl("", "أساسيات التركية: التحيات، الأرقام، الأفعال البسيطة.", [
  les("التحيات والتعارف", "عبارات تستخدمها كل يوم عند لقاء الناس.", "merhaba||مرحباً;günaydın||صباح الخير;teşekkürler||شكراً;lütfen||من فضلك;evet||نعم;hayır||لا;hoşça kal||مع السلامة;özür dilerim||آسف",
    [G("أنا أكون: -im", "اللاحقة im تعني (أنا): öğrenci + yim = أنا طالب.", "Ben öğrenciyim.||أنا طالب.")],
    "Benim adım Sari.||اسمي ساري.;Tanıştığımıza memnun oldum.||تشرفت بمعرفتك.;Nasılsın?||كيف حالك؟"),
  les("الأرقام والأفعال", "أرقام وأفعال أساسية.", "bir||واحد;iki||اثنان;üç||ثلاثة;on||عشرة;su||ماء;ekmek||خبز;yemek||يأكل;gitmek||يذهب",
    [G("الجمع: -ler / -lar", "للجمع: kitap ← kitaplar.", "Kitaplar masada.||الكتب على الطاولة.")],
    "Su içiyorum.||أشرب الماء.;Okula gidiyorum.||أذهب إلى المدرسة."),
  les("العائلة", "أفراد العائلة والملكية.", "anne||أم;baba||أب;kardeş||أخ / أخت;abla||أخت كبرى;ağabey||أخ أكبر;aile||عائلة;çocuk||طفل;arkadaş||صديق",
    [G("الملكية: -im / -in", "benim kitabım = كتابي، senin kitabın = كتابك.", "Benim annem öğretmen.||أمي معلّمة.")],
    "Bu benim ailem.||هذه عائلتي.;İki kardeşim var.||عندي أخوان.;Babam çok çalışıyor.||أبي يعمل كثيراً."),
  les("الطعام والشراب", "في المطعم والسوق.", "pilav||أرز;tavuk||دجاج;çay||شاي;kahve||قهوة;peynir||جبن;lezzetli||لذيذ;aç||جائع;hesap||الحساب",
    [G("الطلب: ... istiyorum", "istiyorum = أريد. نضع الشيء قبلها.", "Bir çay istiyorum.||أريد شاياً.")],
    "Çok açım.||أنا جائع جداً.;Yemek çok lezzetli.||الطعام لذيذ جداً.;Hesap lütfen.||الحساب من فضلك."),
  les("الأيام والوقت", "الأيام والساعة.", "pazartesi||الاثنين;cuma||الجمعة;pazar||الأحد;bugün||اليوم;yarın||غداً;dün||أمس;sabah||صباح;akşam||مساء",
    [G("السؤال عن الساعة", "Saat kaç? = كم الساعة؟ والجواب: Saat + الرقم.", "Saat üç.||الساعة الثالثة.")],
    "Saat kaç?||كم الساعة؟;Yarın görüşürüz.||نلتقي غداً.;Pazartesi okula gidiyorum.||أذهب إلى المدرسة يوم الاثنين."),
  les("الأماكن والاتجاهات", "السؤال عن الطريق.", "nerede||أين;sağ||يمين;sol||يسار;düz||مستقيم;yakın||قريب;uzak||بعيد;istasyon||محطة;hastane||مستشفى",
    [G("حالة المكان: -de / -da", "تدل على (في / على): evde = في البيت، okulda = في المدرسة.", "Kitap masada.||الكتاب على الطاولة.")],
    "İstasyon nerede?||أين المحطة؟;Sağa dönün.||انعطف يميناً.;Hastane çok uzak değil.||المستشفى ليس بعيداً جداً.")]),
  A2: A2("الماضي والمستقبل والمقارنة، وعبارات السفر.", [
  les("الماضي: -di", "الحديث عن أحداث مضت.", "gittim||ذهبتُ;geldim||جئتُ;yedim||أكلتُ;aldım||اشتريتُ / أخذتُ;gördüm||رأيتُ;geçen hafta||الأسبوع الماضي;önce||قبل;tatil||عطلة",
    [G("الماضي المعلوم: -di", "نضيف di/dı/du/dü حسب انسجام الأصوات ثم لاحقة الشخص: gitmek ← gittim.", "Dün sinemaya gittim.||ذهبت إلى السينما أمس.")],
    "Geçen hafta İstanbul'a gittim.||ذهبت إلى إسطنبول الأسبوع الماضي.;Kahvaltıda peynir yedim.||أكلت الجبن في الفطور.;Yeni bir telefon aldım.||اشتريت هاتفاً جديداً."),
  les("المستقبل: -ecek", "الخطط والنيات.", "gelecek yıl||السنة القادمة;plan||خطة;seyahat||سفر;belki||ربما;umarım||آمل;bilet||تذكرة;yakında||قريباً;hafta sonu||عطلة الأسبوع",
    [G("المستقبل: -ecek / -acak", "gitmek ← gideceğim (سأذهب)، okumak ← okuyacağım (سأقرأ).", "Yarın seni arayacağım.||سأتصل بك غداً.")],
    "Gelecek yıl Japonya'ya gideceğim.||سأذهب إلى اليابان السنة القادمة.;Bu akşam ne yapacaksın?||ماذا ستفعل هذا المساء؟;Umarım yakında görüşürüz.||آمل أن نلتقي قريباً."),
  les("المقارنة", "مقارنة الأشياء.", "daha||أكثر;en||الأكثر;büyük||كبير;küçük||صغير;ucuz||رخيص;pahalı||غالٍ;güzel||جميل;renk||لون",
    [G("المقارنة: -den daha", "A, B'den daha büyük = A أكبر من B. والتفضيل: en büyük = الأكبر.", "İstanbul Ankara'dan daha büyük.||إسطنبول أكبر من أنقرة.")],
    "Bu çanta daha ucuz.||هذه الحقيبة أرخص.;En sevdiğim renk mavi.||لوني المفضل الأزرق.;Kahve çaydan daha pahalı.||القهوة أغلى من الشاي."),
  les("السفر والفندق", "عبارات السفر.", "pasaport||جواز سفر;bavul||حقيبة سفر;rezervasyon||حجز;oda||غرفة;anahtar||مفتاح;uçak||طائرة;otel||فندق;kahvaltı||فطور",
    [G("الطلب المهذب: -ebilir miyim?", "هل يمكنني...؟ : alabilir miyim = هل يمكنني أن آخذ؟", "Anahtarı alabilir miyim?||هل يمكنني أخذ المفتاح؟")],
    "Rezervasyonum var.||لدي حجز.;Kahvaltı saat kaçta?||في أي ساعة الفطور؟;Uçağım saat dokuzda kalkıyor.||تقلع طائرتي الساعة التاسعة."),
  les("الصحة", "عند الطبيب والصيدلية.", "baş||رأس;karın||بطن;diş||سن;ateş||حرارة;öksürük||سعال;ilaç||دواء;eczane||صيدلية;doktor||طبيب",
    [G("الألم: ... ağrıyor", "Başım ağrıyor = رأسي يؤلمني (العضو + لاحقة الملكية + ağrıyor).", "Dişim ağrıyor.||سني يؤلمني.")],
    "Kendimi iyi hissetmiyorum.||لا أشعر أنني بخير.;Ateşim var.||عندي حرارة.;En yakın eczane nerede?||أين أقرب صيدلية؟"),
  les("العمل والدراسة", "المهن والدراسة.", "iş||عمل;ofis||مكتب;müdür||مدير;maaş||راتب;üniversite||جامعة;sınav||امتحان;öğrenci||طالب;ödev||واجب",
    [G("المهنة: -im / -sin", "Ben öğretmenim = أنا معلّم، Sen doktorsun = أنت طبيب.", "Ben mühendisim.||أنا مهندس.")],
    "Ne iş yapıyorsun?||ماذا تعمل؟;Üniversitede okuyorum.||أدرس في الجامعة.;Yarın sınavım var.||عندي امتحان غداً.")]) },
  dialogs: [DL("1) التعارف", "A|Merhaba! Benim adım Sari.||مرحباً! اسمي ساري.;B|Memnun oldum Sari.||تشرفت يا ساري.;B|Nerelisin?||من أين أنت؟;A|Suriyeliyim.||أنا سوري."),
    DL("2) في المطعم", "B|Hoş geldiniz! Ne alırsınız?||أهلاً بكم! ماذا تطلبون؟;A|Bir tavuk döner, lütfen.||شاورما دجاج واحدة من فضلك.;B|İçecek ister misiniz?||هل تريد مشروباً؟;A|Bir ayran, lütfen.||عيران واحد من فضلك.;A|Hesap lütfen.||الحساب من فضلك."),
    DL("3) السؤال عن الطريق", "A|Affedersiniz, metro nerede?||المعذرة، أين المترو؟;B|Düz gidin, sonra sola dönün.||امشِ مستقيماً ثم انعطف يساراً.;A|Uzak mı?||هل هو بعيد؟;B|Hayır, beş dakika yürüyerek.||لا، خمس دقائق مشياً.;A|Çok teşekkürler!||شكراً جزيلاً!")] },
ar: { levels: { ...lvl("", "Arabic basics (meanings in English): greetings, numbers, simple verbs.", [
  les("التحيات والتعارف", "Everyday greetings.", "مرحبا|marhaba|Hello;صباح الخير|sabah al-khayr|Good morning;شكرا|shukran|Thank you;من فضلك|min fadlik|Please;نعم|na'am|Yes;لا|la|No;مع السلامة|ma'a as-salama|Goodbye;آسف|asif|Sorry",
    [G("Nominal sentence", "No verb 'to be' in the present tense.", "أنا طالب|ana talib|I am a student.")],
    "اسمي ساري|ismi Sari|My name is Sari.;كيف حالك؟|kayfa haluk|How are you?;أنا بخير|ana bikhayr|I am fine."),
  les("الأرقام والأفعال", "Numbers and basic verbs.", "واحد|wahid|One;اثنان|ithnan|Two;ثلاثة|thalatha|Three;ماء|ma'|Water;خبز|khubz|Bread;يأكل|ya'kul|He eats;يشرب|yashrab|He drinks;يذهب|yadhhab|He goes",
    [G("Definite article ال", "Add al- to make a noun definite.", "الكتاب|al-kitab|the book")],
    "أشرب الماء|ashrab al-ma'|I drink water.;أذهب إلى المدرسة|adhhab ila al-madrasa|I go to school."),
  les("العائلة", "Family members.", "أب|ab|father;أم|umm|mother;أخ|akh|brother;أخت|ukht|sister;ابن|ibn|son;بنت|bint|daughter;عائلة|'a'ila|family;صديق|sadiq|friend",
    [G("Possessive suffixes", "Add -i for 'my', -ka / -ki for 'your': كتابي = my book.", "هذا أخي|hadha akhi|This is my brother.")],
    "عائلتي كبيرة|'a'ilati kabira|My family is big.;أمي معلمة|ummi mu'allima|My mother is a teacher.;عندي أختان|'indi ukhtan|I have two sisters."),
  les("الطعام والشراب", "Food and drinks.", "طعام|ta'am|food;شاي|shay|tea;قهوة|qahwa|coffee;لحم|lahm|meat;دجاج|dajaj|chicken;أرز|aruzz|rice;فاكهة|fakiha|fruit;لذيذ|ladhidh|delicious",
    [G("Ordering: أريد", "أريد (urid) = I want. Put the item after it.", "أريد قهوة من فضلك|urid qahwa min fadlik|I want coffee, please.")],
    "أنا جائع|ana ja'i'|I am hungry.;الطعام لذيذ جداً|at-ta'am ladhidh jiddan|The food is very delicious.;الحساب من فضلك|al-hisab min fadlik|The bill, please."),
  les("الأيام والوقت", "Days and time.", "اليوم|al-yawm|today;غداً|ghadan|tomorrow;أمس|ams|yesterday;صباح|sabah|morning;مساء|masa'|evening;ساعة|sa'a|hour / clock;الجمعة|al-jum'a|Friday;الأحد|al-ahad|Sunday",
    [G("Asking the time", "كم الساعة؟ = What time is it? Answer with الساعة + ordinal number.", "الساعة الثالثة|as-sa'a ath-thalitha|It's three o'clock.")],
    "كم الساعة؟|kam as-sa'a?|What time is it?;أراك غداً|araka ghadan|See you tomorrow.;أذهب إلى العمل صباحاً|adhhab ila al-'amal sabahan|I go to work in the morning."),
  les("الأماكن والاتجاهات", "Places and directions.", "أين|ayna|where;يمين|yamin|right;يسار|yasar|left;قريب|qarib|near;بعيد|ba'id|far;شارع|shari'|street;مستشفى|mustashfa|hospital;محطة|mahatta|station",
    [G("Prepositions في / على / إلى", "في = in, على = on, إلى = to.", "الكتاب على الطاولة|al-kitab 'ala at-tawila|The book is on the table.")],
    "أين المحطة؟|ayna al-mahatta?|Where is the station?;اذهب إلى اليمين|idhhab ila al-yamin|Go to the right.;المستشفى قريب من هنا|al-mustashfa qarib min huna|The hospital is near here.")]),
  A2: A2("Past, future, comparison and travel phrases.", [
  les("الماضي", "Talking about the past.", "ذهبَ|dhahaba|he went;أكلَ|akala|he ate;شربَ|shariba|he drank;كتبَ|kataba|he wrote;قرأَ|qara'a|he read;سافرَ|safara|he traveled;أمس|ams|yesterday;الأسبوع الماضي|al-usbu' al-madi|last week",
    [G("Past tense: -tu = I", "Add -tu for 'I': ذهبتُ (dhahabtu) = I went. Add -na for 'we': ذهبنا.", "ذهبتُ إلى السوق أمس|dhahabtu ila as-suq ams|I went to the market yesterday.")],
    "سافرتُ إلى اليابان|safartu ila al-yaban|I traveled to Japan.;أكلنا في المطعم|akalna fi al-mat'am|We ate at the restaurant.;قرأتُ كتاباً جميلاً|qara'tu kitaban jamilan|I read a beautiful book."),
  les("المستقبل", "Future plans with سـ / سوف.", "سوف|sawfa|will;السنة القادمة|as-sana al-qadima|next year;خطة|khitta|plan;رحلة|rihla|trip;ربما|rubbama|maybe;أتمنى|atamanna|I hope;قريباً|qariban|soon;عطلة|'utla|holiday",
    [G("Future: سـ / سوف", "Add سـ (sa-) or سوف (sawfa) before the present verb: سأذهب = I will go.", "سأدرس في اليابان|sa-adrus fi al-yaban|I will study in Japan.")],
    "سوف أسافر السنة القادمة|sawfa usafir as-sana al-qadima|I will travel next year.;ماذا ستفعل غداً؟|madha sataf'al ghadan?|What will you do tomorrow?;أتمنى أن أراك قريباً|atamanna an araka qariban|I hope to see you soon."),
  les("المقارنة", "Comparing with the pattern أفعل.", "أكبر|akbar|bigger;أصغر|asghar|smaller;أفضل|afdal|better;أجمل|ajmal|more beautiful;أرخص|arkhas|cheaper;أغلى|aghla|more expensive;من|min|than;جداً|jiddan|very",
    [G("Comparative: أفعل من", "Pattern أفعل + من: أكبر من = bigger than.", "القاهرة أكبر من دمشق|al-qahira akbar min dimashq|Cairo is bigger than Damascus.")],
    "هذا أرخص من ذلك|hadha arkhas min dhalik|This is cheaper than that.;أنت أفضل صديق|anta afdal sadiq|You are the best friend.;الشاي أرخص من القهوة|ash-shay arkhas min al-qahwa|Tea is cheaper than coffee."),
  les("السفر والفندق", "Travel phrases.", "جواز سفر|jawaz safar|passport;حقيبة|haqiba|bag;حجز|hajz|reservation;غرفة|ghurfa|room;مفتاح|miftah|key;طائرة|ta'ira|airplane;فندق|funduq|hotel;مطار|matar|airport",
    [G("Polite requests: هل يمكنني...؟", "هل يمكنني (hal yumkinuni) = Can I...?", "هل يمكنني أن أدفع بالبطاقة؟|hal yumkinuni an adfa' bil-bitaqa?|Can I pay by card?")],
    "عندي حجز|'indi hajz|I have a reservation.;متى الفطور؟|mata al-futur?|When is breakfast?;أين المطار؟|ayna al-matar?|Where is the airport?"),
  les("الصحة", "At the doctor and the pharmacy.", "رأس|ra's|head;بطن|batn|stomach;سن|sinn|tooth;حرارة|harara|fever;سعال|su'al|cough;دواء|dawa'|medicine;صيدلية|saydaliyya|pharmacy;طبيب|tabib|doctor",
    [G("Pain: يؤلمني", "يؤلمني + body part = my ... hurts.", "يؤلمني رأسي|yu'limuni ra'si|My head hurts.")],
    "أنا مريض|ana marid|I am sick.;عندي حرارة|'indi harara|I have a fever.;أين أقرب صيدلية؟|ayna aqrab saydaliyya?|Where is the nearest pharmacy?"),
  les("العمل والدراسة", "Jobs and studies.", "عمل|'amal|work;مكتب|maktab|office;مدير|mudir|manager;راتب|ratib|salary;جامعة|jami'a|university;امتحان|imtihan|exam;طالب|talib|student;واجب|wajib|homework",
    [G("Jobs: أنا + profession", "No verb 'to be' in the present: أنا مهندس = I am an engineer.", "أنا طبيب|ana tabib|I am a doctor.")],
    "ماذا تعمل؟|madha ta'mal?|What do you do?;أدرس في الجامعة|adrus fi al-jami'a|I study at the university.;عندي امتحان غداً|'indi imtihan ghadan|I have an exam tomorrow.")]) },
  dialogs: [DL("1) التعارف", "A|مرحبا! اسمي ساري.|marhaba! ismi Sari.|Hello! My name is Sari.;B|تشرفت بمعرفتك.|tasharraftu bima'rifatik.|Nice to meet you.;B|من أين أنت؟|min ayna anta?|Where are you from?;A|أنا من سوريا.|ana min suriya.|I am from Syria."),
    DL("2) في المطعم", "B|أهلاً وسهلاً! ماذا تطلب؟|ahlan wa sahlan! madha tatlub?|Welcome! What would you like?;A|أريد دجاجاً وأرزاً من فضلك.|urid dajajan wa aruzzan min fadlik.|I'd like chicken and rice, please.;B|وماذا تشرب؟|wa madha tashrab?|And what will you drink?;A|ماء من فضلك.|ma' min fadlik.|Water, please.;A|الحساب من فضلك.|al-hisab min fadlik.|The bill, please."),
    DL("3) السؤال عن الطريق", "A|عفواً، أين المحطة؟|'afwan, ayna al-mahatta?|Excuse me, where is the station?;B|امشِ مستقيماً ثم إلى اليمين.|imshi mustaqiman thumma ila al-yamin.|Walk straight, then to the right.;A|هل هي بعيدة؟|hal hiya ba'ida?|Is it far?;B|لا، خمس دقائق مشياً.|la, khams daqa'iq mashyan.|No, five minutes on foot.;A|شكراً جزيلاً!|shukran jazilan!|Thank you very much!")] } };
const AL = { en: "A B C D E F G H I J K L M N O P Q R S T U V W X Y Z", tr: "A B C Ç D E F G Ğ H I İ J K L M N O Ö P R S Ş T U Ü V Y Z", ar: "ا ب ت ث ج ح خ د ذ ر ز س ش ص ض ط ظ ع غ ف ق ك ل م ن ه و ي" };
const VC = { ja: "ja-JP", en: "en-US", tr: "tr-TR", ar: "ar-SA" };
const HERO = { ja: ["ابدأ رحلتك مع اليابانية من الصفر حتى N1 🌸", "تعلّم اليابانية مع ساري"], en: ["ابدأ رحلتك مع الإنجليزية من الصفر 🗽", "تعلّم الإنجليزية مع ساري"], tr: ["ابدأ رحلتك مع التركية من الصفر 🌷", "تعلّم التركية مع ساري"], ar: ["Start your Arabic journey from zero 🌙", "Learn Arabic with Sari"] };
const JA = { L: { ...S.LEVELS }, D: [...S.DIALOGS] };
const heroP = $("#home .hero p").textContent;

/* ===== النطق باللغة الصحيحة ===== */
/* اختيار الصوت واللغة صار في audio.js: يكتشف لغة كل نص ويختار أوضح صوت لها */
let VL = "ja-JP";

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
