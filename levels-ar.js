/* levels-ar.js — مستويات العربية B1 → C2 (يُحمَّل قبل multilang.js)
   الصيغة: "الكلمة|النطق باللاتينية|المعنى بالإنجليزية" */
(() => {
const V = s => s.split(";").map(x => { const [w, r, m] = x.trim().split("|"); return [w, w, r || "", m] });
const les = (title, intro, v, g, s) => ({ title, intro, vocab: V(v), grammar: g.map(([t, d, e]) => [t, d, V(e)[0]]), sentences: V(s) });
const lv = (name, desc, lessons) => ({ name, desc, lessons });
window.SARI_MORE = window.SARI_MORE || {};
window.SARI_MORE.ar = {
B1: lv("المستوى B1 — المتوسط", "Verbal sentences and كان with its sisters.", [
 les("الجملة الفعلية", "Verb, subject, object.", "استيقظ|istayqaza|woke up;ساعد|sa'ada|helped;اشترى|ishtara|bought;أرسل|arsala|sent;رسالة|risala|letter / message;هدية|hadiyya|gift;سيارة|sayyara|car;قديم|qadim|old",
  [["Verbal sentence", "Verb first, then subject (مرفوع), then object (منصوب): كتبَ الطالبُ الدرسَ.", "اشترى أحمدُ هديةً|ishtara ahmadu hadiyyatan|Ahmad bought a gift."]],
  "ساعدتُ صديقي في الواجب|sa'adtu sadiqi fi al-wajib|I helped my friend with the homework.;أرسلتْ سارةُ رسالةً|arsalat saratu risalatan|Sara sent a message.;استيقظتُ مبكراً اليوم|istayqaztu mubakkiran al-yawm|I woke up early today."),
 les("كان وأخواتها", "Was, became, still, is not.", "كان|kana|was;أصبح|asbaha|became;ما زال|ma zala|still;ليس|laysa|is not;سعيد|sa'id|happy;مشغول|mashghul|busy;جو|jaww|weather;بارد|barid|cold",
  [["كان + predicate", "كان and its sisters make the predicate منصوب: كان الجوُّ بارداً.", "كان الجو بارداً أمس|kana al-jawwu baridan ams|The weather was cold yesterday."]],
  "أصبح أخي طبيباً|asbaha akhi tabiban|My brother became a doctor.;ما زلتُ مشغولاً|ma ziltu mashghulan|I am still busy.;ليس الامتحانُ صعباً|laysa al-imtihanu sa'ban|The exam is not difficult.")]),
B2: lv("المستوى B2 — فوق المتوسط", "Passive voice and إنّ with its sisters.", [
 les("المبني للمجهول", "Focus on the action, not the doer.", "كُتِبَ|kutiba|was written;بُنِيَ|buniya|was built;اكتُشِفَ|uktushifa|was discovered;يُقال|yuqal|it is said;قرن|qarn|century;اختراع|ikhtira'|invention;تاريخ|tarikh|history;رواية|riwaya|novel",
  [["Passive: فُعِلَ / يُفْعَلُ", "Past passive: damma on the first letter and kasra before the last (كُتِبَ). Present: يُكتَبُ.", "بُني الجامع الأموي في القرن الثامن|buniya al-jami' al-umawi fi al-qarn ath-thamin|The Umayyad Mosque was built in the 8th century."]],
  "اكتُشف الدواء بالصدفة|uktushifa ad-dawa' bis-sudfa|The medicine was discovered by chance.;يُقال إن الامتحان سهل|yuqal inna al-imtihan sahl|It is said that the exam is easy.;كُتبت هذه الرواية عام ألفين|kutibat hadhihi ar-riwaya 'am alfayn|This novel was written in 2000."),
 les("إنّ وأخواتها", "Indeed, but, because, as if, perhaps.", "إنّ|inna|indeed / that;لكنّ|lakinna|but;لأنّ|li'anna|because;كأنّ|ka'anna|as if;لعلّ|la'alla|perhaps;مجتهد|mujtahid|hardworking;ناجح|najih|successful;مزدحم|muzdahim|crowded",
  [["إنّ + subject", "إنّ and its sisters make the subject منصوب: إنّ الطالبَ مجتهدٌ.", "إنّ العلمَ نورٌ|inna al-'ilma nurun|Knowledge is light."]],
  "تأخرتُ لأنّ الطريقَ مزدحمٌ|ta'akhkhartu li'anna at-tariqa muzdahimun|I was late because the road was crowded.;الجو باردٌ لكنّ الشمسَ مشرقةٌ|al-jawwu baridun lakinna ash-shamsa mushriqatun|It is cold but the sun is shining.;لعلّ الحظَّ يحالفك|la'alla al-hazza yuhalifuk|Perhaps luck will be on your side.")]),
C1: lv("المستوى C1 — المتقدم", "Media language, conditions and wishes.", [
 les("لغة الإعلام", "Words from the news.", "صرّح|sarraha|stated;أعلن|a'lana|announced;وفقاً لـ|wifqan li|according to;في حين|fi hin|whereas;إضافة إلى|idafatan ila|in addition to;مؤتمر|mu'tamar|conference;اتفاقية|ittifaqiyya|agreement;تنمية|tanmiya|development",
  [["Media connectors", "وفقاً لـ (according to)، في حين (whereas) and إضافة إلى ذلك (in addition) link ideas in formal Arabic.", "وفقاً للتقرير، ارتفعت الأسعار|wifqan lit-taqrir, irtafa'at al-as'ar|According to the report, prices rose."]],
  "أعلنت الحكومة عن خطة جديدة|a'lanat al-hukuma 'an khitta jadida|The government announced a new plan.;صرّح الوزير في المؤتمر الصحفي|sarraha al-wazir fi al-mu'tamar as-sahafi|The minister stated at the press conference.;وُقّعت اتفاقية للتنمية|wuqqi'at ittifaqiyya lit-tanmiya|An agreement for development was signed."),
 les("الشرط والتمني", "If, if not for, I wish.", "لو|law|if (unreal);لولا|lawla|if not for;ليت|layta|I wish;إذا|idha|if / when;إنْ|in|if;ندم|nadima|regretted;فرصة|fursa|opportunity;حظ|hazz|luck",
  [["لو / لولا / ليت", "لو for unreal conditions (answer with لـ)، لولا = if it were not for، ليت = I wish.", "لو درستَ لنجحتَ|law darasta la-najahta|If you had studied, you would have passed."]],
  "لولا مساعدتُك ما نجحتُ|lawla musa'adatuka ma najahtu|If not for your help, I would not have succeeded.;ليت الشبابَ يعود|layta ash-shababa ya'ud|I wish youth would return.;إنْ تجتهدْ تنجحْ|in tajtahid tanjah|If you work hard, you will succeed.")]),
C2: lv("المستوى C2 — الإتقان", "Rhetoric, proverbs and classical poetry.", [
 les("البلاغة والأمثال", "Simile, metaphor and famous sayings.", "تشبيه|tashbih|simile;استعارة|isti'ara|metaphor;كناية|kinaya|metonymy;سجع|saj'|rhymed prose;مثل|mathal|proverb;حكمة|hikma|wisdom;فصاحة|fasaha|eloquence;بلاغة|balagha|rhetoric",
  [["Simile and metaphor", "A simile uses كـ or مثل (العلمُ كالنور). A metaphor drops the comparison (رأيتُ أسداً يخطب = a brave man).", "العلمُ في الصغرِ كالنقشِ على الحجر|al-'ilmu fis-sighari kan-naqshi 'ala al-hajar|Learning when young is like engraving on stone."]],
  "الصديقُ وقتَ الضيق|as-sadiqu waqta ad-diq|A friend in need is a friend indeed.;من جدَّ وجد|man jadda wajad|Whoever strives, finds.;الوقتُ كالسيفِ إن لم تقطعه قطعك|al-waqtu kas-sayfi in lam taqta'hu qata'ak|Time is like a sword: if you don't cut it, it cuts you."),
 les("الأدب والشعر", "Classical poetry and literary words.", "قصيدة|qasida|poem;بيت شعر|bayt shi'r|verse;قافية|qafiya|rhyme;بحر|bahr|poetic meter (also sea);شاعر|sha'ir|poet;حنين|hanin|nostalgia;وطن|watan|homeland;غربة|ghurba|being far from home",
  [["Poetry structure", "A classical Arabic poem keeps one meter (بحر) and one rhyme (قافية) in all its verses.", "قصائد نزار قباني عن دمشق مشهورة|qasa'id nizar qabbani 'an dimashq mashhura|Nizar Qabbani's poems about Damascus are famous."]],
  "كتب الشاعر قصيدة عن الغربة|kataba ash-sha'ir qasida 'an al-ghurba|The poet wrote a poem about being far from home.;يشعر المغترب بالحنين إلى وطنه|yash'ur al-mughtarib bil-hanin ila watanih|The expatriate feels nostalgia for his homeland.;للشعر العربي ستة عشر بحراً|lish-shi'r al-'arabi sitta 'ashar bahran|Arabic poetry has sixteen meters.")])
};
})();
