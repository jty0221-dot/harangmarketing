/* 클린패스 전용 층 (brief custom_assets · 2026-10-29 현우) : 검수표 체크 · 진행 막대 · 공간 탭 · 라이트박스 · 견적 문자 안내 · 질문 아코디언
   서버로 보내는 것 없음 · 저장하는 것 없음 · 외부 라이브러리 없음 */
(function () {
  'use strict';
  var d = document, html = d.documentElement;
  var still = (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) || navigator.webdriver || /[?&]nomo\b/.test(location.search);
  if (still) html.classList.add('cp-still');   // 움직임 줄이기 · 캡처 : 끝난 모습으로 보여 준다
  var $ = function (s, r) { return (r || d).querySelector(s); };
  var $$ = function (s, r) { return [].slice.call((r || d).querySelectorAll(s)); };

  /* 진행 막대 · 검수표 : scroll 리스너 대신 IntersectionObserver (2026-10-30 · 화면에 들어온 칸만 켠다 · 한 번 켜면 그대로) */
  var track = $('[data-cp-track]'), sheet = $('[data-cp-sheet]'), IO = 'IntersectionObserver' in window;
  var say = function (li) { var n = $('[data-cp-now]'); if (n && li) n.textContent = li.querySelector('strong').textContent + ' : ' + li.lastElementChild.textContent; };
  if (track) {
    var fill = $('.cp-fill', track), stops = $$('.cp-stops li', track), upto = -1;
    var light = function (k) {
      if (k <= upto) return; upto = k;
      stops.forEach(function (li, i) { li.classList.toggle('on', i <= k); });
      fill.style.setProperty('--p', (k / (stops.length - 1)).toFixed(3)); say(stops[k]);
    };
    if (still || !IO) light(stops.length - 1);
    else {
      fill.style.setProperty('--p', 0);
      var tio = new IntersectionObserver(function (es) { es.forEach(function (en) { if (en.isIntersecting) { light(stops.indexOf(en.target)); tio.unobserve(en.target); } }); }, { rootMargin: '0px 0px -28% 0px' });
      stops.forEach(function (li) { tio.observe(li); });
    }
  }
  if (sheet && !still && IO) {
    sheet.classList.add('cp-js');
    var rows = $$('.cp-row', sheet), done = 0;
    var sio = new IntersectionObserver(function (es) {
      es.forEach(function (en) { if (!en.isIntersecting) return; en.target.classList.add('done'); sio.unobserve(en.target); if (++done === rows.length) sheet.classList.add('all'); });
    }, { rootMargin: '0px 0px -34% 0px' });
    rows.forEach(function (r) { sio.observe(r); });
  }
  addEventListener('beforeprint', function () {
    if (sheet) { $$('.cp-row', sheet).forEach(function (r) { r.classList.add('done'); }); sheet.classList.add('all'); }
    if (track) { $$('.cp-stops li', track).forEach(function (li) { li.classList.add('on'); }); $('.cp-fill', track).style.setProperty('--p', 1); }
  });

  /* 태그라인 : 화면에 들어오면 단어가 차례로 진해진다 (IntersectionObserver · transform/opacity 만) */
  var tag = $('[data-cp-tagline]');
  if (tag && !still && IO) {
    tag.classList.add('cp-js');
    var gio = new IntersectionObserver(function (es) { if (es[0].isIntersecting) { tag.classList.add('in'); gio.disconnect(); } }, { rootMargin: '0px 0px -20% 0px' });
    gio.observe(tag);
  }

  /* 3. 공간별 탭 (화살표 · Home · End) */
  $$('[data-cp-tabs]').forEach(function (box) {
    var tabs = $$('[role="tab"]', box);
    var panels = tabs.map(function (t) { return d.getElementById(t.getAttribute('aria-controls')); });
    box.classList.add('cp-js');
    function select(i, focus) {
      tabs.forEach(function (t, k) {
        var on = k === i;
        t.setAttribute('aria-selected', on ? 'true' : 'false');
        t.tabIndex = on ? 0 : -1;
        panels[k].hidden = !on;
        panels[k].classList.toggle('show', on);
      });
      if (focus) { tabs[i].focus(); tabs[i].scrollIntoView({ block: 'nearest', inline: 'nearest' }); }
    }
    tabs.forEach(function (t, i) {
      t.addEventListener('click', function () { select(i, false); });
      t.addEventListener('keydown', function (e) {
        var k = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: tabs.length - 1 }[e.key];
        if (k === undefined) return;
        e.preventDefault();
        select((k + tabs.length) % tabs.length, true);
      });
    });
    select(0, false);
  });

  /* 7. 라이트박스 (Esc 닫기 · 좌우 화살표 · 포커스 가둠 · 닫으면 누른 사진으로 포커스 복귀) */
  var gal = $('[data-cp-gal]'), lb = $('[data-cp-lb]');
  if (gal && lb) {
    var btns = $$('.cp-g-btn', gal), img = d.createElement('img'), cap = $('figcaption', lb), cnt = $('.cp-lb-count', lb), cur = 0, opener = null;
    img.width = 1600; img.height = 1200;
    var show = function (i) {
      cur = (i + btns.length) % btns.length;
      var b = btns[cur];
      if (!img.parentNode) $('figure', lb).insertBefore(img, $('figcaption', lb));
      img.src = b.getAttribute('data-full');
      img.alt = b.querySelector('img').alt;
      cap.textContent = b.getAttribute('data-cap');
      cnt.textContent = (cur + 1) + ' / ' + btns.length;
      img.style.animation = 'none'; void img.offsetWidth; img.style.animation = '';
    };
    var open = function (i) { opener = btns[i]; show(i); lb.hidden = false; html.classList.add('cp-lock'); $('[data-lb="x"]', lb).focus(); };
    var close = function () { lb.hidden = true; html.classList.remove('cp-lock'); if (img.parentNode) img.parentNode.removeChild(img); if (opener) opener.focus(); };
    btns.forEach(function (b, i) { b.addEventListener('click', function () { open(i); }); });
    lb.addEventListener('click', function (e) {
      var a = e.target.closest('[data-lb]');
      if (a) { var k = a.getAttribute('data-lb'); if (k === 'x') close(); else show(cur + (k === 'n' ? 1 : -1)); return; }
      if (e.target === lb) close();
    });
    d.addEventListener('keydown', function (e) {
      if (lb.hidden) return;
      if (e.key === 'Escape') { e.preventDefault(); close(); }
      else if (e.key === 'ArrowRight') show(cur + 1);
      else if (e.key === 'ArrowLeft') show(cur - 1);
      else if (e.key === 'Tab') {
        var f = $$('button', lb), first = f[0], lastB = f[f.length - 1];
        if (e.shiftKey && d.activeElement === first) { e.preventDefault(); lastB.focus(); }
        else if (!e.shiftKey && d.activeElement === lastB) { e.preventDefault(); first.focus(); }
        else if (f.indexOf(d.activeElement) < 0) { e.preventDefault(); first.focus(); }
      }
    });
  }

  /* 5. 견적 문자 안내 : 고른 값으로 sms: 본문만 채운다 (전송 · 저장 · 금액 계산 없음) */
  var q = $('[data-cp-quote]');
  if (q) {
    var steps = $$('.cp-q-step', q), marks = $$('.cp-q-steps li', q), step = 0;
    var prev = $('[data-q="prev"]', q), next = $('[data-q="next"]', q), sms = $('[data-q-sms]', q), msg = $('[data-q-msg]', q);
    var base = sms.getAttribute('href').split('?')[0];
    var val = function (name) { var x = q.querySelector('input[name="' + name + '"]:checked'); return x ? x.value : ''; };
    var dateVal = function () {
      if (val('undecided')) return q.querySelector('input[name="undecided"]').value;
      var v = q.querySelector('input[name="date"]').value;
      return v || '';
    };
    var has = function (i) { return i === 0 ? !!val('size') : i === 1 ? !!val('svc') : !!dateVal(); };
    var paint = function () {
      var v = { size: val('size'), svc: val('svc'), date: dateVal() };
      $$('[data-q-v]', msg).forEach(function (s) { var k = s.getAttribute('data-q-v'); if (v[k]) s.textContent = v[k]; else if (s.getAttribute('data-empty')) s.textContent = s.getAttribute('data-empty'); });
      var body = $$('p', msg).map(function (p) { return p.textContent; }).join('\n');
      sms.setAttribute('href', base + '?body=' + encodeURIComponent(body));
      if (next) next.disabled = !has(step);
    };
    $$('[data-q-v]', msg).forEach(function (s) { s.setAttribute('data-empty', s.textContent); });
    var go = function (i) {
      step = Math.max(0, Math.min(steps.length - 1, i));
      steps.forEach(function (s, k) { s.classList.toggle('cur', k === step); });
      marks.forEach(function (m, k) { m.classList.toggle('on', k <= step); });
      prev.disabled = step === 0;
      next.hidden = step === steps.length - 1;
      paint();
    };
    q.classList.add('cp-js');
    prev.addEventListener('click', function () { go(step - 1); var f = steps[step].querySelector('input'); if (f) f.focus(); });
    next.addEventListener('click', function () { go(step + 1); var f = steps[step].querySelector('input'); if (f) f.focus(); });
    q.addEventListener('change', function (e) {
      if (e.target.name === 'date' && e.target.value) q.querySelector('input[name="undecided"]').checked = false;
      if (e.target.name === 'undecided' && e.target.checked) q.querySelector('input[name="date"]').value = '';
      paint();
    });
    q.addEventListener('input', paint);
    q.addEventListener('submit', function (e) { e.preventDefault(); });
    go(0);
  }

  /* 8. 질문 아코디언 : 하나를 열면 나머지는 닫는다 (FAQPage 구조화 데이터는 공장 것 그대로) */
  $$('.faq').forEach(function (box) {
    var items = $$('details', box);
    items.forEach(function (it) {
      it.addEventListener('toggle', function () { if (it.open) items.forEach(function (o) { if (o !== it) o.open = false; }); });
    });
  });
})();
