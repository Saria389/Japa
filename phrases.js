/* phrases.js — محادثات يابانية إضافية + صفحة «عبارات سريعة» (يُحمَّل قبل multilang.js)
   الصيغة: "المتكلم|الجملة|القراءة (فارغة = نفسها)|الروماجي|المعنى" */
document.addEventListener("DOMContentLoaded", () => {
const S = window.SARI; if (!S) return;
const $ = S.$, $$ = S.$$, esc = S.esc;
const P = s => s.trim().split(";").map(x => { const [jp, ka, ro, ar] = x.trim().split("|"); return [jp, ka || jp, ro, ar] });
const D = (t, s) => ({ t, l: s.trim().split(";").map(x => { const [who, jp, ka, ro, ar] = x.trim().split("|"); return [who, jp, ka || jp, ro, ar] }) });

/* ===== محادثات جديدة ===== */
S.DIALOGS.push(
 D("6) في الفندق", "B|いらっしゃいませ。チェックインですか。||irasshaimase. chekkuin desu ka.|أهلاً بك. تسجيل دخول؟;A|はい、予約したサリです。|はい、よやくしたサリです。|hai, yoyaku shita sari desu.|نعم، أنا ساري ولدي حجز.;B|パスポートをお願いします。|パスポートをおねがいします。|pasupooto o onegaishimasu.|جواز السفر من فضلك.;A|はい、どうぞ。朝ご飯は何時からですか。|はい、どうぞ。あさごはんはなんじからですか。|hai, douzo. asagohan wa nanji kara desu ka.|تفضل. من أي ساعة الفطور؟;B|七時から十時までです。お部屋は五階です。|しちじからじゅうじまでです。おへやはごかいです。|shichiji kara juuji made desu. oheya wa gokai desu.|من السابعة حتى العاشرة. غرفتك في الطابق الخامس.;A|ありがとうございます。||arigatou gozaimasu.|شكراً جزيلاً."),
 D("7) عند الطبيب", "B|どうしましたか。||dou shimashita ka.|ما بك؟;A|昨日から頭が痛くて、熱もあります。|きのうからあたまがいたくて、ねつもあります。|kinou kara atama ga itakute, netsu mo arimasu.|رأسي يؤلمني منذ أمس، وعندي حرارة أيضاً.;B|そうですか。ちょっと見ましょう。|そうですか。ちょっとみましょう。|sou desu ka. chotto mimashou.|حسناً، دعني أفحصك.;B|風邪ですね。この薬を一日三回飲んでください。|かぜですね。このくすりをいちにちさんかいのんでください。|kaze desu ne. kono kusuri o ichinichi sankai nonde kudasai.|إنها نزلة برد. تناول هذا الدواء ثلاث مرات يومياً.;A|わかりました。お風呂に入ってもいいですか。|わかりました。おふろにはいってもいいですか。|wakarimashita. ofuro ni haitte mo ii desu ka.|فهمت. هل يمكنني الاستحمام؟;B|今日はやめたほうがいいですね。お大事に。|きょうはやめたほうがいいですね。おだいじに。|kyou wa yameta hou ga ii desu ne. odaiji ni.|الأفضل ألا تفعل اليوم. أتمنى لك الشفاء."),
 D("8) في متجر كونبيني", "B|いらっしゃいませ。||irasshaimase.|أهلاً بك.;B|袋はご利用ですか。|ふくろはごりようですか。|fukuro wa goriyou desu ka.|هل تحتاج كيساً؟;A|いいえ、大丈夫です。|いいえ、だいじょうぶです。|iie, daijoubu desu.|لا، شكراً.;B|お弁当は温めますか。|おべんとうはあたためますか。|obentou wa atatamemasu ka.|هل أسخّن لك علبة الطعام؟;A|はい、お願いします。カードで払えますか。|はい、おねがいします。カードではらえますか。|hai, onegaishimasu. kaado de haraemasu ka.|نعم من فضلك. هل يمكنني الدفع بالبطاقة؟;B|はい、こちらにタッチしてください。||hai, kochira ni tacchi shite kudasai.|نعم، المس البطاقة هنا من فضلك."),
 D("9) موعد مع صديق (أسلوب غير رسمي)", "A|ねえ、日曜日、暇？|ねえ、にちようび、ひま？|nee, nichiyoubi, hima?|هيه، هل أنت متفرغ يوم الأحد؟;B|うん、暇だよ。どうして？|うん、ひまだよ。どうして？|un, hima da yo. doushite?|نعم، متفرغ. لماذا؟;A|一緒に浅草へ行かない？|いっしょにあさくさへいかない？|issho ni asakusa e ikanai?|ما رأيك أن نذهب معاً إلى أساكوسا؟;B|いいね！何時に会う？|いいね！なんじにあう？|ii ne! nanji ni au?|فكرة رائعة! متى نلتقي؟;A|十時に駅の前はどう？|じゅうじにえきのまえはどう？|juuji ni eki no mae wa dou?|ما رأيك بالعاشرة أمام المحطة؟;B|わかった。楽しみにしてるね。|わかった。たのしみにしてるね。|wakatta. tanoshimi ni shiteru ne.|اتفقنا. أنا متحمس!"),
 D("10) في المطار", "B|パスポートを見せてください。|パスポートをみせてください。|pasupooto o misete kudasai.|أرني جواز سفرك من فضلك.;B|日本へ来た目的は何ですか。|にほんへきたもくてきはなんですか。|nihon e kita mokuteki wa nan desu ka.|ما هدف زيارتك لليابان؟;A|観光です。|かんこうです。|kankou desu.|السياحة.;B|どのくらい滞在しますか。|どのくらいたいざいしますか。|dono kurai taizai shimasu ka.|كم ستبقى؟;A|二週間です。|にしゅうかんです。|nishuukan desu.|أسبوعين.;B|はい、けっこうです。よい旅を。|はい、けっこうです。よいたびを。|hai, kekkou desu. yoi tabi o.|حسناً، تفضل. رحلة سعيدة."),
 D("11) مقابلة عمل جزئي (アルバイト)", "B|では、自己紹介をお願いします。|では、じこしょうかいをおねがいします。|dewa, jikoshoukai o onegaishimasu.|حسناً، عرّف بنفسك من فضلك.;A|サリと申します。シリアから来ました。日本語学校の学生です。|サリともうします。シリアからきました。にほんごがっこうのがくせいです。|sari to moushimasu. shiria kara kimashita. nihongo gakkou no gakusei desu.|اسمي ساري، من سوريا، وأنا طالب في مدرسة لغة يابانية.;B|週に何日働けますか。|しゅうになんにちはたらけますか。|shuu ni nannichi hatarakemasu ka.|كم يوماً في الأسبوع يمكنك العمل؟;A|三日ぐらい働けます。週末も大丈夫です。|みっかぐらいはたらけます。しゅうまつもだいじょうぶです。|mikka gurai hatarakemasu. shuumatsu mo daijoubu desu.|نحو ثلاثة أيام، وعطلة الأسبوع مناسبة أيضاً.;B|わかりました。結果は来週連絡します。|わかりました。けっかはらいしゅうれんらくします。|wakarimashita. kekka wa raishuu renraku shimasu.|حسناً، سنخبرك بالنتيجة الأسبوع القادم.;A|よろしくお願いいたします。|よろしくおねがいいたします。|yoroshiku onegai itashimasu.|شكراً لكم، أتطلع لذلك."),
 D("12) الحديث عن الطقس", "A|今日は暑いですね。|きょうはあついですね。|kyou wa atsui desu ne.|الجو حار اليوم، أليس كذلك؟;B|本当に暑いですね。三十五度もあるそうですよ。|ほんとうにあついですね。さんじゅうごどもあるそうですよ。|hontou ni atsui desu ne. sanjuugo do mo aru sou desu yo.|حار حقاً. يقولون إن الحرارة 35 درجة.;A|シリアの夏も暑いですが、日本は湿気が多いですね。|シリアのなつもあついですが、にほんはしっけがおおいですね。|shiria no natsu mo atsui desu ga, nihon wa shikke ga ooi desu ne.|صيف سوريا حار أيضاً، لكن الرطوبة في اليابان عالية.;B|そうですね。水をたくさん飲んでくださいね。|そうですね。みずをたくさんのんでくださいね。|sou desu ne. mizu o takusan nonde kudasai ne.|صحيح. اشرب الكثير من الماء.")
);
$("#dialogs").innerHTML = S.DIALOGS.map(d => `<div class="dlg"><h3>${d.t}</h3>` + d.l.map(([who, jp, kana, ro, ar]) => `<div class="line ${who === "B" ? "b" : ""}"><div class="av">${who}</div><div class="bub" data-say="${esc(kana)}"><div class="sent-jp">${jp}</div>${jp !== kana ? `<div class="sent-kana">${kana}</div>` : ""}<div class="sent-ro">${ro}</div><div class="sent-ar">${ar}</div></div></div>`).join("") + "</div>").join("");

/* ===== صفحة العبارات السريعة ===== */
const PH = [
 ["🆘", "الطوارئ", P("助けて！|たすけて！|tasukete!|النجدة!;警察を呼んでください。|けいさつをよんでください。|keisatsu o yonde kudasai.|اتصل بالشرطة من فضلك.;救急車を呼んでください。|きゅうきゅうしゃをよんでください。|kyuukyuusha o yonde kudasai.|اتصل بالإسعاف من فضلك.;道に迷いました。|みちにまよいました。|michi ni mayoimashita.|لقد ضللت الطريق.;財布をなくしました。|さいふをなくしました。|saifu o nakushimashita.|أضعت محفظتي.;英語を話せる人はいますか。|えいごをはなせるひとはいますか。|eigo o hanaseru hito wa imasu ka.|هل يوجد من يتحدث الإنجليزية؟")],
 ["🛍️", "التسوق", P("これはいくらですか。||kore wa ikura desu ka.|بكم هذا؟;見ているだけです。|みているだけです。|mite iru dake desu.|أتفرج فقط.;試着してもいいですか。|しちゃくしてもいいですか。|shichaku shite mo ii desu ka.|هل يمكنني قياسه؟;もっと大きいサイズはありますか。|もっとおおきいサイズはありますか。|motto ookii saizu wa arimasu ka.|هل يوجد مقاس أكبر؟;免税できますか。|めんぜいできますか。|menzei dekimasu ka.|هل يمكن الشراء معفى من الضريبة؟;カードで払えますか。|カードではらえますか。|kaado de haraemasu ka.|هل يمكنني الدفع بالبطاقة؟")],
 ["🍜", "المطعم", P("二人です。|ふたりです。|futari desu.|نحن شخصان.;おすすめは何ですか。|おすすめはなんですか。|osusume wa nan desu ka.|ما الذي تنصح به؟;ハラールの料理はありますか。|ハラールのりょうりはありますか。|haraaru no ryouri wa arimasu ka.|هل يوجد طعام حلال؟;豚肉とアルコールはだめです。|ぶたにくとアルコールはだめです。|butaniku to arukooru wa dame desu.|لا أتناول لحم الخنزير ولا الكحول.;お水をください。|おみずをください。|omizu o kudasai.|ماءً من فضلك.;お会計をお願いします。|おかいけいをおねがいします。|okaikei o onegaishimasu.|الحساب من فضلك.")],
 ["🚆", "المواصلات", P("この電車は新宿に止まりますか。|このでんしゃはしんじゅくにとまりますか。|kono densha wa shinjuku ni tomarimasu ka.|هل يتوقف هذا القطار في شينجوكو؟;切符売り場はどこですか。|きっぷうりばはどこですか。|kippu uriba wa doko desu ka.|أين مكتب بيع التذاكر؟;次は何駅ですか。|つぎはなにえきですか。|tsugi wa nani eki desu ka.|ما المحطة التالية؟;ここで降ります。|ここでおります。|koko de orimasu.|سأنزل هنا.;この住所までお願いします。|このじゅうしょまでおねがいします。|kono juusho made onegaishimasu.|إلى هذا العنوان من فضلك (للتاكسي).")],
 ["🏨", "الفندق", P("チェックインをお願いします。|チェックインをおねがいします。|chekkuin o onegaishimasu.|أريد تسجيل الدخول من فضلك.;Wi-Fiのパスワードは何ですか。|ワイファイのパスワードはなんですか。|waifai no pasuwaado wa nan desu ka.|ما كلمة مرور الواي فاي؟;荷物を預かってもらえますか。|にもつをあずかってもらえますか。|nimotsu o azukatte moraemasu ka.|هل يمكنكم الاحتفاظ بأمتعتي؟;部屋の鍵をなくしました。|へやのかぎをなくしました。|heya no kagi o nakushimashita.|أضعت مفتاح الغرفة.;チェックアウトは何時ですか。|チェックアウトはなんじですか。|chekkuauto wa nanji desu ka.|متى موعد تسجيل الخروج؟")],
 ["🙏", "المجاملات", P("お元気ですか。|おげんきですか。|ogenki desu ka.|كيف حالك؟;おかげさまで元気です。|おかげさまでげんきです。|okagesama de genki desu.|بخير والحمد لله.;お疲れ様です。|おつかれさまです。|otsukaresama desu.|يعطيك العافية (تحية بين الزملاء).;すみません、もう一度お願いします。|すみません、もういちどおねがいします。|sumimasen, mou ichido onegaishimasu.|عذراً، مرة أخرى من فضلك.;ゆっくり話してください。|ゆっくりはなしてください。|yukkuri hanashite kudasai.|تكلّم ببطء من فضلك.;よろしくお伝えください。|よろしくおつたえください。|yoroshiku otsutae kudasai.|بلّغ تحياتي.")]
];
$("#nav").insertAdjacentHTML("beforeend", `<a href="#phrases" data-page="phrases" data-ar="🗣️ عبارات سريعة">🗣️ عبارات سريعة</a>`);
$("main").insertAdjacentHTML("beforeend", `<div id="phrases" class="page-section"><section class="box"><h2>عبارات سريعة للحياة في اليابان 🗣️</h2>
<p>عبارات جاهزة للسفر والطوارئ والتسوق. اضغط 🔊 للنطق أو 🐢 للنطق البطيء، أو ▶️ لسماع القسم كاملاً.</p>
<div class="tabs" id="phCats" role="tablist"></div><div id="phList"></div></section></div>`);
let cur = 0;
function render() {
  $("#phCats").innerHTML = PH.map(([i, t], k) => `<button type="button" class="tab-btn ${k === cur ? "active" : ""}" data-phc="${k}" role="tab" aria-selected="${k === cur}">${i} ${t}</button>`).join("");
  $("#phList").innerHTML = `<button type="button" class="u-playall" data-play="#phList">▶️ استمع للقسم كاملاً</button>` + PH[cur][2].map(([jp, ka, ro, ar]) =>
    `<div class="sent"><div><div class="sent-jp">${jp}</div>${jp !== ka ? `<div class="sent-kana">${ka}</div>` : ""}<div class="sent-ro">${ro}</div><div class="sent-ar">${ar}</div></div>
    <div class="sent-btns"><button type="button" data-say="${esc(ka)}" title="نطق عادي" aria-label="نطق">🔊</button><button type="button" data-say="${esc(ka)}" data-slow="1" title="نطق بطيء" aria-label="نطق بطيء">🐢</button></div></div>`).join("");
}
$("#phrases").addEventListener("click", e => { const b = e.target.closest("[data-phc]"); if (b) { cur = +b.dataset.phc; render() } });
render();

/* تظهر لليابانية فقط */
const sync = () => {
  const ja = S.store.get("learnLang", "ja") === "ja";
  $$('nav a[data-page="phrases"]').forEach(a => a.style.display = ja ? "" : "none");
  if (!ja && ($(".page-section.active-page") || {}).id === "phrases") $('[data-page="home"]').click();
};
document.addEventListener("change", e => { if (e.target.id === "learnLang") setTimeout(sync, 0) });
setTimeout(sync, 0);
});
