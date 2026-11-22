/* cloud.js — الربط بـ Supabase ☁️ (حمّله بعد ui.js)
   حساب بالإيميل وكلمة المرور · مزامنة التقدّم بين الأجهزة · لوحة المتصدرين · حفظ نتائج الاختبارات في جدول quiz
   المفتاح هنا «منشور» (publishable) وآمن للمتصفح؛ الحماية عبر سياسات RLS في قاعدة البيانات. */
document.addEventListener("DOMContentLoaded", () => {
const S = window.SARI; if (!S || !window.supabase) return;
const $ = S.$, store = S.store, esc = S.esc;
const sb = supabase.createClient("https://nmrfnlfomolgsleywbig.supabase.co", "sb_publishable_tu7eKBjAqi-u7UzvOskN5w_5UPo7sFN");
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
  if (user) {
    b.innerHTML = `<div class="u-gt">☁️ الحساب والمزامنة</div>
    <div class="u-row"><span>مسجّل باسم <b>${esc(user.email)}</b></span><button type="button" class="btn-action btn-ghost" id="cOut">خروج</button></div>
    <div class="u-row"><span>الاسم في لوحة المتصدرين</span><span style="display:flex;gap:6px"><input type="text" id="cName" maxlength="30" style="max-width:160px"><button type="button" class="btn-action btn-ghost" id="cNameSave">حفظ</button></span></div>
    <div class="u-row"><span>تقدّمك يُحفظ في السحابة تلقائياً ويعمل على كل أجهزتك.</span><button type="button" class="btn-action" id="cSync">مزامنة الآن ☁️</button></div><p class="u-note" id="cloudMsg"></p>`;
    sb.from("profiles").select("display_name").eq("id", user.id).maybeSingle().then(({ data }) => { if (data && $("#cName")) $("#cName").value = data.display_name });
  } else {
    b.innerHTML = `<div class="u-gt">☁️ الحساب والمزامنة</div>
    <p class="u-note">سجّل الدخول ليُحفظ تقدّمك في السحابة وتكمل من أي جهاز، وتظهر في لوحة المتصدرين.</p>
    <div class="u-row" style="flex-direction:column;align-items:stretch"><input type="text" id="cEmail" placeholder="البريد الإلكتروني" autocomplete="email" dir="ltr"><input type="password" id="cPass" placeholder="كلمة المرور (6 أحرف على الأقل)" autocomplete="current-password" dir="ltr" style="width:100%;font:inherit;padding:12px;border-radius:14px;border:1.5px solid var(--line);background:var(--card);color:var(--text)">
    <div style="display:flex;gap:8px;flex-wrap:wrap"><button type="button" class="btn-action" id="cIn">دخول</button><button type="button" class="btn-action btn-ghost" id="cUp">حساب جديد</button></div></div><p class="u-note" id="cloudMsg"></p>`;
  }
}
document.addEventListener("click", async e => {
  const id = e.target.id;
  if (id === "cIn" || id === "cUp") {
    const email = $("#cEmail").value.trim(), password = $("#cPass").value;
    if (!email || password.length < 6) return msg("اكتب البريد وكلمة مرور من 6 أحرف على الأقل.", 1);
    msg("لحظة…");
    const { data, error } = id === "cIn" ? await sb.auth.signInWithPassword({ email, password }) : await sb.auth.signUp({ email, password });
    if (error) return msg(error.message === "Invalid login credentials" ? "البريد أو كلمة المرور غير صحيحة." : error.message, 1);
    if (id === "cUp" && !data.session) return msg("✅ تم إنشاء الحساب. افتح بريدك واضغط رابط التأكيد، ثم سجّل الدخول.");
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
async function pull() {
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
  const l = $("#lbList"); if (!l) return;
  const { data, error } = await sb.from("profiles").select("id,display_name,xp,streak").order("xp", { ascending: false }).limit(20);
  if (error) { l.innerHTML = "<p>تعذّر تحميل اللوحة (تحتاج اتصالاً بالإنترنت).</p>"; return }
  l.innerHTML = data.length ? `<ol class="lb">${data.map((p, i) => `<li class="${user && p.id === user.id ? "me" : ""}"><b>${["🥇", "🥈", "🥉"][i] || i + 1}</b><span>${esc(p.display_name)}</span><small>⭐ ${p.xp} · 🔥 ${p.streak}</small></li>`).join("")}</ol>` : "<p>لا يوجد متصدرون بعد. كن الأول!</p>";
}
document.addEventListener("click", e => { if (e.target.closest('[data-page="me"]')) board() });

sb.auth.onAuthStateChange((ev, session) => {
  const was = user; user = session ? session.user : null; render();
  if (user && !was && ev !== "TOKEN_REFRESHED") pull().then(board);
  if (!user) board();
});
render(); board();
});
