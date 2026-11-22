/* cloud.js — الربط بـ Supabase ☁️ (حمّله بعد ui.js)
   حساب بالإيميل وكلمة المرور · مزامنة التقدّم بين الأجهزة · لوحة المتصدرين · حفظ نتائج الاختبارات في جدول quiz
   المفتاح هنا «منشور» (publishable) وآمن للمتصفح؛ الحماية عبر سياسات RLS في قاعدة البيانات. */
document.addEventListener("DOMContentLoaded", () => {
const S = window.SARI; if (!S || !window.supabase) return;
const $ = S.$, store = S.store, esc = S.esc;
// flowType "pkce": العودة من Google ومن روابط البريد تأتي بـ ?code= في الرابط، فلا يمسحها تنقّل الصفحة (#home)
const sb = supabase.createClient("https://nmrfnlfomolgsleywbig.supabase.co", "sb_publishable_tu7eKBjAqi-u7UzvOskN5w_5UPo7sFN", { auth: { flowType: "pkce", detectSessionInUrl: false, persistSession: true } });
/* إكمال الدخول من الرابط المحفوظ في <head> (لأن الصفحة تغيّر الرابط قبل وصولنا) */
setTimeout(async () => {
  let cb = null; try { cb = sessionStorage.getItem("sb_cb"); sessionStorage.removeItem("sb_cb") } catch (e) {}
  if (!cb) return;
  const u = new URL(cb), h = new URLSearchParams(u.hash.slice(1)), code = u.searchParams.get("code");
  const err = u.searchParams.get("error_description") || h.get("error_description");
  if (code) { const { error } = await sb.auth.exchangeCodeForSession(code); if (error) console.warn("exchange", error.message) }
  else if (h.get("access_token")) await sb.auth.setSession({ access_token: h.get("access_token"), refresh_token: h.get("refresh_token") });
  if (h.get("type") === "recovery" || u.searchParams.get("type") === "recovery") recovering = true;
  history.replaceState(null, "", location.pathname + (location.hash && !/access_token|code=/.test(location.hash) ? location.hash : "#home"));
  if (err) setTimeout(() => alert("تعذّر تسجيل الدخول: " + err), 300);
}, 0);
const BACK = location.origin + location.pathname;
let recovering = false;
const SKIP = k => k.startsWith("sb-") || k === "cloud_ts" || k === "ai_log";
const snapshot = () => { const o = {}; for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); if (!SKIP(k)) o[k] = localStorage.getItem(k) } return o };
const streakOf = days => { let n = 0; const d = new Date(); while ((days || []).includes(d.toISOString().slice(0, 10))) { n++; d.setDate(d.getDate() - 1) } return n };
let user = null, pushT = null;

/* ===== الواجهة: في ⚙️ الإعدادات وفي صفحة «تقدّمي» ===== */
const sheet = $("#uSheet .u-panel");
if (sheet) sheet.querySelector(".u-group").insertAdjacentHTML("beforebegin", `<div class="u-group" id="cloudBox"></div>`);
const me = $("#me"); if (me) me.insertAdjacentHTML("beforeend", `<section class="box"><h2>لوحة المتصدرين 🏆</h2><p>أعلى المتعلّمين نقاطاً. سجّل الدخول من ⚙️ الإعدادات لتظهر هنا.</p><div id="lbList"><p>جارٍ التحميل…</p></div></section>`);
const msg = (t, bad) => { const m = $("#cloudMsg"); if (m) { m.textContent = t; m.style.color = bad ? "var(--error)" : "var(--success)" } };
function render() {
  const b = $("#cloudBox"); if (!b) return;
  if (user && recovering) {
    b.innerHTML = `<div class="u-gt">🔑 كلمة مرور جديدة</div><p class="u-note">اكتب كلمة المرور الجديدة لحسابك ${esc(user.email || "")}</p>
    <input type="password" id="cNewPass" placeholder="كلمة المرور الجديدة (6 أحرف على الأقل)" autocomplete="new-password" dir="ltr" style="width:100%;font:inherit;padding:12px;border-radius:14px;border:1.5px solid var(--line);background:var(--card);color:var(--text)">
    <button type="button" class="btn-action" id="cSetPass" style="margin-top:8px">حفظ كلمة المرور</button><p class="u-note" id="cloudMsg"></p>`;
    return;
  }
  if (user) {
    b.innerHTML = `<div class="u-gt">☁️ الحساب والمزامنة</div>
    <div class="u-row"><span>مسجّل باسم <b>${esc(user.email)}</b></span><button type="button" class="btn-action btn-ghost" id="cOut">خروج</button></div>
    <div class="u-row"><span>الاسم في لوحة المتصدرين</span><span style="display:flex;gap:6px"><input type="text" id="cName" maxlength="30" style="max-width:160px"><button type="button" class="btn-action btn-ghost" id="cNameSave">حفظ</button></span></div>
    <div class="u-row"><span>تقدّمك يُحفظ في السحابة تلقائياً ويعمل على كل أجهزتك.</span><button type="button" class="btn-action" id="cSync">مزامنة الآن ☁️</button></div><p class="u-note" id="cloudMsg"></p>
    <div class="u-gt">🏆 لوحة المتصدرين</div><div id="lbMini"><p class="u-note">جارٍ التحميل…</p></div>`;
    board();
    sb.from("profiles").select("display_name").eq("id", user.id).maybeSingle().then(({ data }) => { if (data && $("#cName")) $("#cName").value = data.display_name });
  } else {
    b.innerHTML = `<div class="u-gt">☁️ الحساب والمزامنة</div>
    <p class="u-note">سجّل الدخول ليُحفظ تقدّمك في السحابة وتكمل من أي جهاز، وتظهر في لوحة المتصدرين.</p>
    <button type="button" class="btn-action btn-ghost" id="cGoogle" style="width:100%;margin:6px 0"><svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"/><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z"/></svg> الدخول بحساب Google</button>
    <p class="u-note" style="text-align:center">أو بالبريد الإلكتروني:</p>
    <div class="u-row" style="flex-direction:column;align-items:stretch"><input type="text" id="cEmail" placeholder="البريد الإلكتروني" autocomplete="email" dir="ltr"><input type="password" id="cPass" placeholder="كلمة المرور (6 أحرف على الأقل)" autocomplete="current-password" dir="ltr" style="width:100%;font:inherit;padding:12px;border-radius:14px;border:1.5px solid var(--line);background:var(--card);color:var(--text)">
    <div style="display:flex;gap:8px;flex-wrap:wrap"><button type="button" class="btn-action" id="cIn">دخول</button><button type="button" class="btn-action btn-ghost" id="cUp">حساب جديد</button></div>
    <button type="button" class="u-playall" id="cForgot" style="align-self:flex-start">نسيت كلمة المرور؟</button></div><p class="u-note" id="cloudMsg"></p>`;
  }
}
document.addEventListener("click", async e => {
  const id = e.target.id;
  if (id === "cIn" || id === "cUp") {
    const email = $("#cEmail").value.trim(), password = $("#cPass").value;
    if (!email || password.length < 6) return msg("اكتب البريد وكلمة مرور من 6 أحرف على الأقل.", 1);
    msg("لحظة…");
    const { data, error } = id === "cIn" ? await sb.auth.signInWithPassword({ email, password }) : await sb.auth.signUp({ email, password, options: { emailRedirectTo: BACK } });
    if (error) return msg(error.message === "Invalid login credentials" ? "البريد أو كلمة المرور غير صحيحة." : error.message, 1);
    if (id === "cUp" && !data.session) return msg("✅ تم إنشاء الحساب. افتح بريدك واضغط رابط التأكيد، ثم سجّل الدخول.");
  }
  if (e.target.closest("#cGoogle")) {
    const { error } = await sb.auth.signInWithOAuth({ provider: "google", options: { redirectTo: BACK } });
    if (error) msg(/not enabled/i.test(error.message) ? "الدخول بـ Google غير مفعّل بعد في Supabase." : error.message, 1);
  }
  if (id === "cForgot") {
    const email = $("#cEmail").value.trim();
    if (!email) return msg("اكتب بريدك الإلكتروني في الخانة أولاً، ثم اضغط «نسيت كلمة المرور؟».", 1);
    msg("لحظة…");
    const { error } = await sb.auth.resetPasswordForEmail(email, { redirectTo: BACK });
    msg(error ? (/rate limit/i.test(error.message) ? "تم الوصول لحد الرسائل، حاول بعد ساعة." : error.message) : "✅ أرسلنا لك رابط إعادة تعيين كلمة المرور. افتح بريدك (وتفقّد Spam).", !!error);
  }
  if (id === "cSetPass") {
    const p = $("#cNewPass").value; if (p.length < 6) return msg("كلمة المرور يجب أن تكون 6 أحرف على الأقل.", 1);
    const { error } = await sb.auth.updateUser({ password: p });
    if (error) return msg(error.message, 1);
    recovering = false; render(); msg("✅ تم تغيير كلمة المرور.");
  }
  if (id === "cOut") { await sb.auth.signOut(); msg("تم الخروج.") }
  if (id === "cSync") { await push(); msg("✅ تمت المزامنة.") }
  if (id === "cNameSave") { const n = $("#cName").value.trim().slice(0, 30); if (n) { await sb.from("profiles").upsert({ id: user.id, display_name: n }); msg("✅ تم حفظ الاسم."); board() } }
});

/* ===== المزامنة ===== */
async function push() {
  if (!user) return;
  const st = store.get("stats", {}), now = new Date().toISOString();
  await sb.from("user_progress").upsert({ user_id: user.id, data: snapshot(), updated_at: now });
  await sb.from("profiles").upsert({ id: user.id, xp: st.xp || 0, streak: streakOf(st.days), updated_at: now });
  store.set("cloud_ts", now);
}
const pushSoon = () => { clearTimeout(pushT); pushT = setTimeout(push, 4000) };
/* أول دخول: ننشئ الملف الشخصي باسم الحساب (من Google أو من أول البريد) */
async function ensureProfile() {
  const { data } = await sb.from("profiles").select("id").eq("id", user.id).maybeSingle();
  if (data) return;
  const m = user.user_metadata || {}, name = (m.full_name || m.name || (user.email || "متعلّم").split("@")[0]).slice(0, 30);
  await sb.from("profiles").insert({ id: user.id, display_name: name });
}
async function pull() {
  await ensureProfile();
  const { data } = await sb.from("user_progress").select("data,updated_at").eq("user_id", user.id).maybeSingle();
  const local = store.get("cloud_ts", null);
  if (!data) return push();                       // أول مرة: نرفع تقدّم هذا الجهاز
  if (local && data.updated_at <= local) return push();
  if (!local && !confirm("وجدنا تقدّماً محفوظاً في حسابك. هل تريد تحميله على هذا الجهاز؟ (اختر «إلغاء» لرفع تقدّم هذا الجهاز بدلاً منه)")) return push();
  Object.entries(data.data || {}).forEach(([k, v]) => { try { localStorage.setItem(k, v) } catch (x) {} });
  store.set("cloud_ts", data.updated_at); location.reload();
}
document.addEventListener("quizdone", e => {
  pushSoon(); if (!user) return;
  sb.from("quiz").insert({ user_id: user.id, lang: store.get("learnLang", "ja"), kind: ($(".page-section.active-page") || {}).id || null, score: Math.max(0, Math.min(100, Math.round(e.detail) || 0)) }).then(() => {});
});
document.addEventListener("click", e => { if (user && e.target.closest("[data-done],[data-rate],[data-fav],[data-srs],#diaryAdd,[data-del]")) pushSoon() });
document.addEventListener("visibilitychange", () => { if (document.hidden && user) push() });

/* ===== لوحة المتصدرين ===== */
async function board() {
  const { data, error } = await sb.from("profiles").select("id,display_name,xp,streak").order("xp", { ascending: false }).limit(20);
  const html = n => error ? "<p>تعذّر تحميل اللوحة (تحتاج اتصالاً بالإنترنت).</p>" : data.length ? `<ol class="lb">${data.slice(0, n).map((p, i) => `<li class="${user && p.id === user.id ? "me" : ""}"><b>${["🥇", "🥈", "🥉"][i] || i + 1}</b><span>${esc(p.display_name)}</span><small>⭐ ${p.xp} · 🔥 ${p.streak}</small></li>`).join("")}</ol>` : "<p>لا يوجد متصدرون بعد. كن الأول!</p>";
  const l = $("#lbList"); if (l) l.innerHTML = html(20);
  const sh = $("#lbSheetList"); if (sh) sh.innerHTML = html(20);
  const s = $("#lbMini"); if (s) s.innerHTML = html(5) + `<button type="button" class="u-playall" data-page="me">عرض اللوحة كاملة ←</button>`;
}
/* زر عائم + نافذة لوحة المتصدرين */
document.body.insertAdjacentHTML("beforeend", `<button type="button" class="lb-fab" id="lbFab" aria-label="لوحة المتصدرين" title="لوحة المتصدرين">🏆</button>
<div class="u-sheet" id="lbSheet" hidden><div class="u-panel" role="dialog" aria-modal="true" aria-labelledby="lbT"><div class="u-grab"></div>
<div class="u-head"><h3 id="lbT">🏆 لوحة المتصدرين</h3><button type="button" class="icon-btn" id="lbClose" aria-label="إغلاق">✕</button></div>
<p class="u-note" id="lbHint"></p><div id="lbSheetList"><p class="u-note">جارٍ التحميل…</p></div></div></div>`);
function openBoard() {
  $("#lbSheet").hidden = false; document.body.classList.add("u-lock");
  $("#lbHint").innerHTML = user ? "مرتبة حسب النقاط ⭐. اجمع نقاطاً من الدروس والاختبارات والتمارين لتصعد!" : "سجّل الدخول من ⚙️ الإعدادات لتظهر في اللوحة وتنافس الآخرين.";
  board();
}
const closeBoard = () => { $("#lbSheet").hidden = true; document.body.classList.remove("u-lock") };
$("#lbFab").onclick = openBoard; $("#lbClose").onclick = closeBoard;
$("#lbSheet").addEventListener("click", e => { if (e.target.id === "lbSheet") closeBoard() });
document.addEventListener("keydown", e => { if (e.key === "Escape" && !$("#lbSheet").hidden) closeBoard() });
/* طلب من الذكاء الاصطناعي: task = quiz | explain | correct | chat. يرجع {data} أو {err: login|limit|off|fail} */
async function ai(task, body) {
  if (!user) return { err: "login" };
  try {
    const { data, error } = await sb.functions.invoke("sari-ai", { body: { task, ctx: { lang: store.get("learnLang", "ja") }, ...body } });
    if (error) { const s = error.context && error.context.status; return { err: s === 429 ? "limit" : s === 503 ? "off" : s === 401 ? "login" : "fail" } }
    return { data };
  } catch (e) { return { err: "fail" } }
}
const AI_ERR = { login: "🔐 سجّل الدخول من ⚙️ الإعدادات لتستخدم الذكاء الاصطناعي.", limit: "🌙 وصلت إلى حدّ استخدام الذكاء الاصطناعي اليوم. أكمل غداً!", off: "الذكاء الاصطناعي غير مفعّل حالياً.", fail: "تعذّر الاتصال بالذكاء الاصطناعي، تحقق من الإنترنت وحاول مجدداً." };
window.SARI_CLOUD = { sb, ai, AI_ERR, user: () => user, openBoard, myRank: async () => { if (!user) return null; const { data } = await sb.from("profiles").select("id,xp").order("xp", { ascending: false }).limit(200); const i = (data || []).findIndex(p => p.id === user.id); return i < 0 ? null : { rank: i + 1, xp: data[i].xp, total: data.length } } };
document.addEventListener("click", e => { if (e.target.closest('[data-page="me"]')) { board(); if (e.target.closest("#lbMini") && window.SARI_UI) SARI_UI.closeSheet() } });

sb.auth.onAuthStateChange((ev, session) => {
  const was = user; user = session ? session.user : null;
  if (ev === "PASSWORD_RECOVERY") { recovering = true; if (window.SARI_UI) SARI_UI.openSettings() }
  render();
  if (user && !was && ev !== "TOKEN_REFRESHED" && !recovering) pull().then(() => { render(); board() });
  if (user && !was && ev === "SIGNED_IN" && window.SARI_UI) SARI_UI.openSettings();
  if (!user) board();
});
render(); board();
});
