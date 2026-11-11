/* 열정클린 고객 전용 동작 (2026-10-29 현우) · 외부 라이브러리 없음
   머리글 줄이기 · 사진 점 설명 카드 · 전후 비교 · 불꽃 타임라인 · 동네 고르기
   동작 줄이기 설정 · 자동 캡처(navigator.webdriver) · ?nomo 이면 움직임 없이 끝 상태로 보인다 */
(function () {
  var d = document, h = d.documentElement;
  var S = matchMedia('(prefers-reduced-motion: reduce)').matches || navigator.webdriver || /[?&]nomo\b/.test(location.search);
  h.classList.add('yj-js');
  if (S) h.classList.add('yj-static');

  // 머리글 그림자 : scroll 리스너 대신 맨 위 표지 하나를 IntersectionObserver 로 본다 (2026-10-30 · 리디자인 기준)
  var hd = d.querySelector('.hd');
  if (hd && 'IntersectionObserver' in window) {
    var mark = d.createElement('div'); mark.setAttribute('aria-hidden', 'true');
    mark.style.cssText = 'position:absolute;top:0;left:0;width:1px;height:40px;pointer-events:none';
    d.body.prepend(mark);
    new IntersectionObserver(function (e) { hd.classList.toggle('yj-small', !e[0].isIntersecting); }).observe(mark);
  }

  d.querySelectorAll('.yj-spot').forEach(function (sp) {
    var cards = sp.querySelectorAll('.yj-card'), dots = sp.querySelectorAll('.yj-dot');
    function sync() {
      dots.forEach(function (b) {
        var c = d.getElementById(b.getAttribute('data-spot')), o = !!(c && c.open);
        b.classList.toggle('on', o); b.setAttribute('aria-expanded', o ? 'true' : 'false');
      });
    }
    cards.forEach(function (c) {
      c.addEventListener('toggle', function () {
        if (c.open) cards.forEach(function (x) { if (x !== c) x.open = false; });
        sync();
      });
    });
    dots.forEach(function (b) {
      b.addEventListener('click', function () {
        var c = d.getElementById(b.getAttribute('data-spot'));
        if (!c) return;
        c.open = true;
        if (matchMedia('(max-width: 899px)').matches) c.scrollIntoView({ block: 'nearest', behavior: S ? 'auto' : 'smooth' });
      });
    });
    sync();
  });

  d.querySelectorAll('.yj-cmp').forEach(function (c) {
    var r = c.querySelector('.yj-cmp-r');
    if (r) r.addEventListener('input', function () { c.style.setProperty('--pos', r.value + '%'); });
  });

  // 진행 순서 : 단계가 화면 62% 선을 지나면 불이 켜지고 선이 그만큼 내려간다 (IntersectionObserver · transform 만 움직인다)
  var st = d.querySelector('.yj-steps');
  if (st) {
    var li = [].slice.call(st.querySelectorAll('li'));
    var paint = function () {
      var n = li.filter(function (x) { return x.classList.contains('lit'); }).length;
      st.style.setProperty('--fill', li.length > 1 ? Math.max(0, n - 1) / (li.length - 1) : 1);
    };
    if (S || !('IntersectionObserver' in window)) { li.forEach(function (x) { x.classList.add('lit'); }); paint(); }
    else {
      var io = new IntersectionObserver(function (es) {
        // 한 번에 멀리 건너뛰면 선을 넘지 않은 단계는 알림이 없어서, 알림이 올 때마다 모든 단계를 다시 본다
        li.forEach(function (x) { x.classList.toggle('lit', x.getBoundingClientRect().top < innerHeight * 0.62); });
        paint();
      }, { rootMargin: '0px 0px -38% 0px' });
      li.forEach(function (x) { io.observe(x); });
    }
  }

  var chips = d.querySelectorAll('.yj-chip');
  chips.forEach(function (b) {
    b.addEventListener('click', function () {
      chips.forEach(function (x) {
        var on = x === b, p = d.getElementById(x.getAttribute('data-area'));
        x.setAttribute('aria-pressed', on ? 'true' : 'false');
        if (p) p.classList.toggle('on', on);
      });
    });
  });
})();
