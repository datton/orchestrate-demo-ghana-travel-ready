/* Readiness checklist logic (Senior Developer 2). Reads #readiness-form, validates, builds a personalised
   tick-off checklist from window.GTR_DATA into #checklist, then calls GTR_PICKS.render(answers, #picks).
   Answers stay in this browser (localStorage); the passport number is never read or saved. Nothing is sent. */
(function () {
  'use strict';
  var form = document.getElementById('readiness-form'), out = document.getElementById('checklist'), picks = document.getElementById('picks'), D = window.GTR_DATA;
  if (!form || !out || !D) return;
  var K_ANS = 'ghana-travel-ready:answers', K_TICK = 'ghana-travel-ready:ticks';
  function read(k, f) { try { var v = localStorage.getItem(k); return v ? JSON.parse(v) : f; } catch (e) { return f; } }
  function write(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }

  // ---- dates (local, no time zones) ----
  function parse(s) { var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s || ''); if (!m) return null; var d = new Date(+m[1], +m[2] - 1, +m[3]); return d.getMonth() === +m[2] - 1 ? d : null; }
  function today() { var n = new Date(); return new Date(n.getFullYear(), n.getMonth(), n.getDate()); }
  function addMonths(d, n) { var r = new Date(d.getFullYear(), d.getMonth() + n, d.getDate()); if (r.getDate() !== d.getDate()) r = new Date(d.getFullYear(), d.getMonth() + n + 1, 0); return r; }
  function days(a, b) { return Math.round((b - a) / 864e5); }
  function fmt(d) { return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }); }
  function iso(d) { return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }

  // ---- form ----
  function val(id) { var e = document.getElementById(id); return e ? e.value.trim() : ''; }
  function radio(name) { var e = form.querySelector('input[name="' + name + '"]:checked'); return e ? e.value : ''; }
  function collect() {
    return { nationality: val('f-nationality'), passportExpiry: val('f-passport-expiry'), from: val('f-from'), direction: radio('direction'),
      depart: val('f-depart'), return: val('f-return'), yellowFever: val('f-yf') || 'unsure', healthNotes: val('f-health-notes'), budget: radio('budget') };
  }
  function fieldFor(id) { return document.getElementById(id); }
  function setErr(id, msg) {
    var p = document.getElementById(id + '-err'), inp = fieldFor(id);
    if (p) { p.textContent = msg || ''; p.hidden = !msg; }
    if (inp) { if (msg) inp.setAttribute('aria-invalid', 'true'); else inp.removeAttribute('aria-invalid'); }
    return !msg;
  }
  function validate(a) {
    var t = today(), dep = parse(a.depart), ret = parse(a.return), exp = parse(a.passportExpiry), first = null;
    function bad(id, m) { setErr(id, m); if (!first) first = id; }
    ['f-nationality', 'f-passport-expiry', 'f-depart', 'f-return', 'f-from', 'f-direction', 'f-yf'].forEach(function (i) { setErr(i, ''); });
    if (!a.nationality) bad('f-nationality', 'Please choose the nationality on the passport.');
    if (!a.direction) bad('f-direction', 'Please choose a direction.');
    if (!a.passportExpiry) bad('f-passport-expiry', 'Please enter the date your passport expires.');
    else if (!exp) bad('f-passport-expiry', 'That date is not valid.');
    else if (exp < t) bad('f-passport-expiry', 'This passport has already expired. Renew it before you plan the trip.');
    if (!a.depart) bad('f-depart', 'Please enter your departure date.');
    else if (!dep) bad('f-depart', 'That date is not valid.');
    else if (dep < t) bad('f-depart', 'The departure date is in the past. Choose today or later.');
    else if (days(t, dep) > 730) bad('f-depart', 'Please choose a date within the next two years.');
    if (a.return) {
      if (!ret) bad('f-return', 'That date is not valid.');
      else if (dep && ret < dep) bad('f-return', 'The return date must be on or after the departure date.');
    }
    if (exp && dep && exp >= t && exp <= dep) bad('f-passport-expiry', 'Your passport expires before you travel (' + fmt(exp) + '). Renew it first.');
    if (first) { var el = fieldFor(first) || form.querySelector('input[name="direction"]'); if (el) el.focus(); return false; }
    return true;
  }

  // ---- personalised checklist ----
  // status: 'todo' (action needed), 'warn' (problem found), 'info', 'check' (check with the embassy)
  // 'ghana' (if the form offers it) or 'ecowas' (the form's "including Ghana" option) is treated as a possible Ghanaian passport.
  function ghanaian(a) { return a.nationality === 'ghana' || a.nationality === 'ecowas'; }
  var VISA_ITEMS = { 'eg-evisa': 1, 'eg-evisa-time': 1, 'eg-fee': 1, 'eg-voa': 1 };
  function personal(a) {
    var dep = parse(a.depart), ret = parse(a.return), exp = parse(a.passportExpiry), end = ret || dep, list = [], t = today();
    if (a.direction === 'eu-gh' && ghanaian(a)) {
      list.push({ id: 'p-gh-entry', group: 'visa', status: 'check', text: 'If you are travelling on a Ghanaian passport into Ghana: check entry and health-declaration rules with the Ghana Immigration Service. The yellow fever certificate and the online Health Declaration still apply.', asof: D.checkedOn, source: 'Ghana Immigration Service; CDC', link: 'https://evisa.immigration.gov.gh' });
    }
    if (a.direction === 'gh-eu' && !ghanaian(a)) {
      return [{ id: 'p-other-entry', group: 'visa', status: 'check', text: 'Entry rules for your passport depend on your nationality and destination: check the destination country\u2019s embassy or official site.', asof: D.checkedOn, source: 'Destination country\u2019s embassy' }];
    }
    if (a.direction === 'eu-gh') {
      var v = D.visa[D.visaMap[a.nationality] || 'other'];
      if (!ghanaian(a)) list.push({ id: 'p-visa', group: 'visa', text: v.text + (v.unconfirmed ? '' : ' Apply for the e-visa or ETA before you fly.'), asof: v.asof, source: v.source, link: 'https://evisa.immigration.gov.gh', status: v.unconfirmed ? 'check' : 'todo' });
      var need = addMonths(end, 6), ok = exp >= need;
      list.push({ id: 'p-passport', group: 'passport', key: 'passport', status: ok ? 'info' : 'warn',
        text: ok ? 'Your passport expires ' + fmt(exp) + ', which is more than 6 months after ' + (ret ? 'your return' : 'you arrive') + ' (' + fmt(end) + '). That meets the 6-month rule.'
          : 'Your passport expires ' + fmt(exp) + '. It should be valid until at least ' + fmt(need) + ' (6 months after ' + (ret ? 'your return' : 'you arrive') + '). Renew it before you travel.',
        asof: 'Nov 2026', source: 'GIS; Govt of Canada; UK FCDO' });
      var left = days(t, dep), yf = a.yellowFever;
      var yfText = yf === 'yes' ? 'You said you are vaccinated against yellow fever: carry the certificate. It is valid for life and required for arrivals aged 9 months and over.'
        : yf === 'no' ? (left >= 10 ? 'You are not vaccinated against yellow fever. The certificate is required: vaccinate at least 10 days before travel. Your last day to do so is ' + fmt(new Date(dep.getFullYear(), dep.getMonth(), dep.getDate() - 10)) + '.'
          : 'You are not vaccinated against yellow fever and you leave in ' + left + ' day' + (left === 1 ? '' : 's') + '. The certificate is required and should be done at least 10 days before travel: contact a travel clinic at once.')
        : 'You are not sure about yellow fever. The certificate is required and valid for life: find out if you have one, and vaccinate at least 10 days before travel if not.';
      list.push({ id: 'p-yf', group: 'health', key: 'yf', status: yf === 'yes' ? 'info' : (yf === 'no' && left < 10 ? 'warn' : 'todo'), text: yfText, asof: '9 Nov 2026', source: 'CDC; TravelHealthPro' });
      if (ret && days(dep, ret) > 60) list.push({ id: 'p-stay', group: 'visa', status: 'warn', text: 'Your trip is ' + days(dep, ret) + ' days. The e-visa allows a stay of up to 60 days, set at the border: check the portal or your embassy, or plan an extension.', asof: 'Jun 2026', source: 'EY; Ghana e-visa portal' });
    } else {
      var thr = addMonths(end, 3), ok3 = exp >= thr;
      list.push({ id: 'p-passport', group: 'passport', key: 'passport-eu', status: ok3 ? 'info' : 'warn',
        text: ok3 ? 'Your passport expires ' + fmt(exp) + '. That is more than 3 months after ' + (ret ? 'your return' : 'your arrival') + '. The German embassy page mentions 3 months; confirm the rule for your destination country.'
          : 'Your passport expires ' + fmt(exp) + '. The German embassy page mentions at least 3 months beyond the stay (' + fmt(thr) + '). Confirm the rule for your destination and consider renewing.',
        asof: D.checkedOn, source: 'German Embassy Accra' });
      var apply = new Date(dep.getFullYear(), dep.getMonth(), dep.getDate() - 15), dl = days(t, dep);
      list.push({ id: 'p-apply', group: 'visa', status: dl < 15 ? 'warn' : 'todo',
        text: dl < 15 ? 'You leave in ' + dl + ' day' + (dl === 1 ? '' : 's') + '. The German embassy says to apply at least 15 calendar days before the trip, and an appointment is needed: it may be too late for this date, so check with the embassy.'
          : 'Apply for your visa by ' + fmt(apply) + ' at the latest (at least 15 calendar days before the trip), and book the appointment now: there is a waiting list.',
        asof: D.checkedOn, source: 'German Embassy Accra', link: 'https://accra.diplo.de/gh-en/service/-VisaInformation/-/2589774' });
    }
    return list;
  }
  function build(a) {
    var p = personal(a), keys = {}; p.forEach(function (i) { if (i.key) keys[i.key] = 1; });
    var rest = D.items.filter(function (i) { return i.dir === a.direction && !(i.key && keys[i.key]) && !(a.direction === 'gh-eu' && !ghanaian(a)) && !(a.direction === 'eu-gh' && ghanaian(a) && VISA_ITEMS[i.id]); }).map(function (i) { var c = {}; for (var k in i) c[k] = i[k]; c.status = i.unconfirmed ? 'check' : 'todo'; return c; });
    return p.concat(rest);
  }

  // ---- rendering ----
  var LABEL = { todo: 'To do', warn: 'Needs attention', info: 'Looks fine', check: 'Check with the embassy' };
  var style = document.createElement('style');
  style.textContent = '.gtr-sum{margin:0 0 1rem;font-weight:600}.gtr-prog{height:8px;border-radius:99px;background:rgba(127,127,127,.25);overflow:hidden;margin:.5rem 0 1.2rem}.gtr-prog span{display:block;height:100%;width:0;background:var(--accent,#1a56db);transition:width .4s cubic-bezier(.2,.7,.2,1)}' +
    '.gtr-group{margin:1.5rem 0 .4rem;font-size:1.1rem}.gtr-list{list-style:none;margin:0;padding:0;display:grid;gap:.6rem}.gtr-item{display:grid;grid-template-columns:auto 1fr;gap:.2rem .8rem;padding:.9rem 1rem;border-radius:14px;border:1.5px solid rgba(127,127,127,.3)}' +
    '.gtr-item.is-warn{border-color:var(--danger,#b00020)}.gtr-item.is-done{opacity:.6}.gtr-item input{width:24px;height:24px;margin:.15rem 0 0}.gtr-item label{font-weight:500;cursor:pointer}.gtr-meta{grid-column:2;font-size:.85rem;opacity:.8;margin:0}' +
    '.gtr-tag{display:inline-block;font-size:.75rem;font-weight:700;padding:.1rem .55rem;border-radius:99px;border:1px solid currentColor;margin-right:.4rem}.is-warn .gtr-tag{color:var(--danger,#b00020)}' +
    '.gtr-actions{display:flex;flex-wrap:wrap;gap:.7rem;margin-top:1.3rem}.gtr-note{font-size:.9rem;opacity:.8;margin-top:1rem}.gtr-saved{font-size:.85rem;opacity:.8}' +
    '@media print{body *{visibility:hidden}#checklist,#checklist *{visibility:visible}#checklist{position:absolute;inset:0 auto auto 0;width:100%}.gtr-actions{display:none}}';
  document.head.appendChild(style);

  var current = null, listItems = [];
  function ticks() { return read(K_TICK, {}); }
  function render(a, focus) {
    current = a; listItems = build(a);
    var t = ticks(), groups = {}, order = [];
    listItems.forEach(function (i) { if (!groups[i.group]) { groups[i.group] = []; order.push(i.group); } groups[i.group].push(i); });
    var dirName = a.direction === 'eu-gh' ? 'Travelling to Ghana' : 'Travelling from Ghana to Europe';
    var html = '<h2 class="rd-h2 rd-h2--sm">Your checklist</h2><p class="gtr-sum" id="gtr-sum" tabindex="-1"></p><div class="gtr-prog" aria-hidden="true"><span id="gtr-bar"></span></div>' +
      '<p>' + esc(dirName) + ', leaving ' + esc(fmt(parse(a.depart))) + (a.return ? ', back ' + esc(fmt(parse(a.return))) : '') + '. Rules checked ' + esc(D.checkedOn) + '.</p>';
    order.forEach(function (g) {
      html += '<h3 class="gtr-group">' + esc(D.groups[g] || g) + '</h3><ul class="gtr-list">';
      groups[g].forEach(function (i) {
        var id = 'gtr-' + i.id;
        html += '<li class="gtr-item is-' + i.status + '"><input type="checkbox" id="' + id + '" data-id="' + esc(i.id) + '"' + (t[i.id] ? ' checked' : '') + '><label for="' + id + '"><span class="gtr-tag">' + esc(LABEL[i.status]) + '</span>' + esc(i.text) + '</label>' +
          '<p class="gtr-meta">Source: ' + (i.link ? '<a href="' + esc(i.link) + '" target="_blank" rel="noopener">' + esc(i.source) + '</a>' : esc(i.source)) + ' (' + esc(i.asof) + ')</p></li>';
      });
      html += '</ul>';
    });
    html += '<div class="gtr-actions"><button type="button" class="rd-btn" id="gtr-dl">Download as .txt</button><button type="button" class="rd-btn rd-btn--ghost" id="gtr-print">Print</button></div>' +
      '<p class="gtr-note">' + esc(D.disclaimer) + '</p><p class="gtr-saved">Your answers and ticks are saved only in this browser. The passport number is never saved.</p>';
    out.innerHTML = html;
    out.querySelectorAll('input[type=checkbox]').forEach(function (c) { c.addEventListener('change', onTick); });
    document.getElementById('gtr-dl').addEventListener('click', download);
    document.getElementById('gtr-print').addEventListener('click', function () { window.print(); });
    progress();
    if (focus) { var s = document.getElementById('gtr-sum'); s.focus(); out.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' }); }
    if (window.GTR_PICKS && picks) { try { window.GTR_PICKS.render(a, picks); } catch (e) {} }
  }
  function onTick(e) { var t = ticks(); if (e.target.checked) t[e.target.dataset.id] = 1; else delete t[e.target.dataset.id]; write(K_TICK, t); e.target.closest('.gtr-item').classList.toggle('is-done', e.target.checked); progress(); }
  function progress() {
    var boxes = out.querySelectorAll('input[type=checkbox]'), n = 0, warn = 0;
    boxes.forEach(function (b) { if (b.checked) n++; b.closest('.gtr-item').classList.toggle('is-done', b.checked); });
    listItems.forEach(function (i) { if (i.status === 'warn') warn++; });
    var s = document.getElementById('gtr-sum'), bar = document.getElementById('gtr-bar');
    if (s) s.textContent = n + ' of ' + boxes.length + ' ticked' + (warn ? '. ' + warn + (warn === 1 ? ' item needs' : ' items need') + ' attention first.' : '.');
    if (bar) bar.style.width = (boxes.length ? Math.round(n / boxes.length * 100) : 0) + '%';
  }
  function download() {
    var t = ticks(), a = current, L = ['GHANA TRAVEL READINESS CHECKLIST', 'Rules checked ' + D.checkedOn, '', (a.direction === 'eu-gh' ? 'Travelling to Ghana' : 'Travelling from Ghana to Europe') + ', leaving ' + fmt(parse(a.depart)) + (a.return ? ', back ' + fmt(parse(a.return)) : ''), ''];
    listItems.forEach(function (i) { L.push((t[i.id] ? '[x] ' : '[ ] ') + '(' + LABEL[i.status] + ') ' + i.text, '      Source: ' + i.source + ' (' + i.asof + ')' + (i.link ? ' ' + i.link : ''), ''); });
    L.push(D.disclaimer, 'Saved only in your browser. No passport number is included.');
    var el = document.createElement('a'); el.href = URL.createObjectURL(new Blob([L.join('\n')], { type: 'text/plain' })); el.download = 'ghana-travel-checklist.txt';
    document.body.appendChild(el); el.click(); setTimeout(function () { URL.revokeObjectURL(el.href); el.remove(); }, 500);
  }

  // ---- wiring ----
  function fill(a) {
    function set(id, v) { var e = fieldFor(id); if (e && v != null) e.value = v; }
    set('f-nationality', a.nationality); set('f-passport-expiry', a.passportExpiry); set('f-from', a.from); set('f-depart', a.depart); set('f-return', a.return); set('f-yf', a.yellowFever); set('f-health-notes', a.healthNotes);
    ['direction', 'budget'].forEach(function (n) { var r = form.querySelector('input[name="' + n + '"][value="' + a[n] + '"]'); if (r) r.checked = true; });
  }
  var t0 = iso(today());
  ['f-depart', 'f-return'].forEach(function (id) { var e = fieldFor(id); if (e) e.min = t0; });
  var dep = fieldFor('f-depart'), ret = fieldFor('f-return');
  if (dep && ret) dep.addEventListener('change', function () { if (dep.value) ret.min = dep.value; });
  form.addEventListener('input', function (e) { if (e.target.getAttribute && e.target.getAttribute('aria-invalid')) setErr(e.target.id, ''); });
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var a = collect(); if (!validate(a)) return;
    write(K_ANS, a); render(a, true);
  });
  var reset = document.getElementById('rd-reset');
  if (reset) reset.addEventListener('click', function () {
    try { localStorage.removeItem(K_ANS); localStorage.removeItem(K_TICK); } catch (e) {}
    ['f-nationality', 'f-passport-expiry', 'f-depart', 'f-return', 'f-from', 'f-direction', 'f-yf'].forEach(function (i) { setErr(i, ''); });
    out.innerHTML = '<h2 class="rd-h2 rd-h2--sm">Your checklist</h2><p class="rd-empty">Fill in the form and choose "Check my readiness". Your checklist appears here.</p>';
  });
  var saved = read(K_ANS, null);
  if (saved && saved.direction) { fill(saved); var d = parse(saved.depart); if (d && d >= today()) render(saved, false); }
})();
