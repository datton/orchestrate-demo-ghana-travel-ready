/* Home page (Full-Stack): two quick checks. Nothing is sent or saved. */
(function () {
  'use strict';
  function $(id) { return document.getElementById(id); }
  function parse(v) { var d = new Date(v + 'T12:00:00'); return isNaN(d) ? null : d; }
  function fmt(d) { return d.toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }); }
  function bad(input, errId, msg) {
    $(errId).textContent = msg || '';
    if (msg) input.setAttribute('aria-invalid', 'true'); else input.removeAttribute('aria-invalid');
    return !msg;
  }
  function show(el, cls, html) { el.className = 'h-out ' + cls; el.innerHTML = html; el.hidden = false; }
  var today = new Date(); today.setHours(12, 0, 0, 0);

  var pp = $('pp');
  if (pp) pp.addEventListener('submit', function (e) {
    e.preventDefault();
    var exp = $('pp-exp'), ret = $('pp-ret'), out = $('pp-out');
    var de = exp.value && parse(exp.value), dr = ret.value && parse(ret.value);
    var a = bad(exp, 'pp-exp-e', de ? '' : 'Please enter your passport expiry date.');
    var b = bad(ret, 'pp-ret-e', !dr ? 'Please enter the date you leave Ghana.' : dr < today ? 'Please choose a date that is not in the past.' : '');
    if (!a || !b) { out.hidden = true; (a ? ret : exp).focus(); return; }
    var need = new Date(dr); need.setMonth(need.getMonth() + 6);
    if (de >= need) show(out, 'ok', 'Your passport looks long enough for this trip.<small>It expires on ' + fmt(de) + ', after the ' + fmt(need) + ' mark. Still confirm with the Ghana Immigration Service or your airline.</small>');
    else show(out, 'warn', 'Your passport may be too close to expiry.<small>To meet the 6-month rule it should be valid until at least ' + fmt(need) + '. Check with the Ghana High Commission or your embassy about renewing before you travel.</small>');
  });

  var yf = $('yf');
  if (yf) yf.addEventListener('submit', function (e) {
    e.preventDefault();
    var dep = $('yf-dep'), out = $('yf-out'), d = dep.value && parse(dep.value);
    if (!bad(dep, 'yf-dep-e', !d ? 'Please enter the date you fly.' : d < today ? 'Please choose a date that is not in the past.' : '')) { out.hidden = true; dep.focus(); return; }
    var last = new Date(d); last.setDate(last.getDate() - 10);
    if (last < today) show(out, 'warn', 'There are fewer than 10 days before your flight.<small>The advice is to vaccinate at least 10 days before travel. Ask a travel clinic what to do now, and check the entry rules with the Ghana High Commission.</small>');
    else show(out, 'ok', 'Aim to be vaccinated by ' + fmt(last) + '.<small>That is 10 days before you fly. A travel clinic can advise you. The certificate is valid for life (CDC, 9 Nov 2026).</small>');
  });
})();
