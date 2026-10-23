// 에이봄의원 홈페이지 동작 · 하랑마케팅 자체 코드 (외부 라이브러리 없음)
// 슬라이더 · 영상 · 사진 크게 보기 · 휴대폰 메뉴 · 검색 · 약관 창 · 스크롤 등장 효과 · 머리말 고정 · 옛 주소 옮기기
(function () {
  "use strict";
  var BASE = document.body.getAttribute("data-base") || "/";
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  // 옛 주소(?idx= 같은 쿼리)로 들어오면 새 주소로 옮긴다 (호스팅 규칙이 못 잡은 경우)
  (function legacy() {
    var q = location.search;
    if (!q) return;
    var p = new URLSearchParams(q), idx = p.get("idx"), cat = p.get("category"), mode = p.get("mode"), page = p.get("page");
    var here = location.pathname.slice(BASE.length - 1).replace(/\/?$/, "/");
    var to = null;
    if (mode === "policy" || mode === "privacy") to = "/" + mode + "/";
    else if (idx && /^\/(Notice|PROMOTION)\//.test(here)) to = here.split("/").slice(0, 2).join("/") + "/" + idx + "/";
    else if (idx) to = "/SIGNATURE/" + idx + "/";
    else if (cat && here.indexOf("/PROMOTION/") === 0) {
      var map = { K4Nh5L5TM6: "Monthly", "31c6PF22Qd": "Seasonal" };
      if (map[cat]) to = "/PROMOTION/" + map[cat] + "/";
    } else if (page && page !== "1" && here === "/SIGNATURE/") to = "/SIGNATURE/page-" + page + "/";
    if (to) location.replace(BASE + to.replace(/^\//, ""));
  })();

  // 머리말 : 내리면 위에 붙는다
  var hd = $(".hd");
  var onScroll = function () { if (hd) hd.classList.toggle("fixed", window.scrollY > 120); };
  window.addEventListener("scroll", onScroll, { passive: true }); onScroll();

  // 스크롤 등장 효과
  var fx = $$(".fx");
  if ("IntersectionObserver" in window && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("show"); io.unobserve(e.target); } }); }, { rootMargin: "0px 0px -8% 0px" });
    fx.forEach(function (el) { io.observe(el); });
  } else fx.forEach(function (el) { el.classList.add("show"); });

  // 슬라이더 : data-per(PC 한 화면 수) · 휴대폰 1 · data-auto(ms) · data-arrows · data-loop
  $$(".slider").forEach(function (sl) {
    var track = $(".track", sl), items = Array.prototype.slice.call(track.children), dots = $(".dots", sl);
    var auto = +sl.getAttribute("data-auto") || 0, loop = sl.hasAttribute("data-loop"), cur = 0, timer = null;
    var per = function () { return matchMedia("(max-width: 767px)").matches ? 1 : (+sl.getAttribute("data-per") || 1); };
    var pages = function () { return Math.max(1, Math.ceil(items.length / per())); };
    function draw() {
      var n = pages(); if (cur > n - 1) cur = n - 1;
      var first = items[Math.min(cur * per(), items.length - 1)];
      var x = first ? first.offsetLeft - items[0].offsetLeft : 0;
      track.style.transform = "translateX(" + (-x) + "px)";
      if (dots) {
        if (dots.children.length !== n) {
          dots.innerHTML = "";
          dots.setAttribute("role", "tablist");
          for (var i = 0; i < n; i++) {
            var b = document.createElement("button"); b.type = "button"; b.setAttribute("role", "tab"); b.setAttribute("aria-label", (i + 1) + "번째 화면");
            (function (k) { b.addEventListener("click", function () { go(k); }); })(i);
            dots.appendChild(b);
          }
        }
        Array.prototype.forEach.call(dots.children, function (b, i) { b.setAttribute("aria-selected", i === cur ? "true" : "false"); });
        dots.style.display = n > 1 ? "" : "none";
      }
      items.forEach(function (it, i) { var vis = i >= cur * per() && i < (cur + 1) * per(); it.setAttribute("aria-hidden", vis ? "false" : "true"); $$("a,button", it).forEach(function (f) { f.tabIndex = vis ? 0 : -1; }); });
    }
    function go(k) { var n = pages(); cur = loop ? (k + n) % n : Math.max(0, Math.min(n - 1, k)); draw(); restart(); }
    function restart() { if (!auto) return; clearInterval(timer); timer = setInterval(function () { go(cur + 1); }, auto); }
    if (sl.hasAttribute("data-arrows")) {
      ["prev", "next"].forEach(function (d) {
        var b = document.createElement("button"); b.type = "button"; b.className = "arrow " + d; b.setAttribute("aria-label", d === "prev" ? "이전" : "다음");
        b.addEventListener("click", function () { go(cur + (d === "prev" ? -1 : 1)); }); sl.appendChild(b);
      });
    }
    // 손가락으로 넘기기
    var sx = null;
    track.addEventListener("touchstart", function (e) { sx = e.touches[0].clientX; }, { passive: true });
    track.addEventListener("touchend", function (e) { if (sx === null) return; var dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 40) go(cur + (dx < 0 ? 1 : -1)); sx = null; });
    sl.addEventListener("mouseenter", function () { clearInterval(timer); });
    sl.addEventListener("mouseleave", restart);
    window.addEventListener("resize", draw);
    draw(); restart();
  });

  // 크게 보기 (사진 · 유튜브)
  var lb = $("#lightbox"), last = null;
  function openLb(html, cap) {
    last = document.activeElement;
    $(".lb-stage", lb).innerHTML = html; $(".lb-cap", lb).textContent = cap || "";
    lb.hidden = false; document.documentElement.style.overflow = "hidden"; $(".lb-close", lb).focus();
  }
  function closeLb() { lb.hidden = true; $(".lb-stage", lb).innerHTML = ""; document.documentElement.style.overflow = ""; if (last) last.focus(); }
  $$(".lb").forEach(function (b) {
    b.addEventListener("click", function () {
      var v = b.getAttribute("data-video"), im = b.getAttribute("data-image"), cap = b.getAttribute("data-caption");
      if (v) openLb('<iframe src="https://www.youtube-nocookie.com/embed/' + encodeURIComponent(v) + '?autoplay=1&rel=0" title="에이봄의원 유튜브 영상" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>', cap);
      else if (im) openLb('<img src="' + im + '" alt="">', cap);
    });
  });
  if (lb) { $(".lb-close", lb).addEventListener("click", closeLb); lb.addEventListener("click", function (e) { if (e.target === lb) closeLb(); }); }

  // 휴대폰 메뉴
  var drawer = $("#drawer"), mbtn = $(".menu-btn");
  function drawerOpen(on) { drawer.hidden = !on; mbtn.setAttribute("aria-expanded", on ? "true" : "false"); document.documentElement.style.overflow = on ? "hidden" : ""; if (on) $(".drawer-close", drawer).focus(); else mbtn.focus(); }
  if (mbtn) {
    mbtn.addEventListener("click", function () { drawerOpen(true); });
    $(".drawer-close", drawer).addEventListener("click", function () { drawerOpen(false); });
    drawer.addEventListener("click", function (e) { if (e.target === drawer) drawerOpen(false); });
    $$(".mnav .toggle", drawer).forEach(function (t) { t.addEventListener("click", function () { var li = t.parentNode, on = !li.classList.contains("open"); li.classList.toggle("open", on); t.setAttribute("aria-expanded", on ? "true" : "false"); }); });
  }

  // 사이트 검색 (search.json 을 한 번 받아 쓴다)
  var idx = null;
  function loadIdx() { return idx ? Promise.resolve(idx) : fetch(BASE + "assets/search.json").then(function (r) { return r.json(); }).then(function (d) { idx = d; return d; }); }
  function find(q, kind) {
    q = q.trim().toLowerCase(); if (!q) return Promise.resolve([]);
    return loadIdx().then(function (d) { return d.filter(function (x) { return (kind === "all" || x.k === kind) && (x.t + " " + x.s + " " + x.b).toLowerCase().indexOf(q) > -1; }); });
  }
  function render(ul, rows, q) {
    ul.innerHTML = rows.length ? rows.slice(0, 30).map(function (r) { return '<li><a href="' + r.u + '">' + r.t.replace(/</g, "&lt;") + "</a><small>" + (r.s || "").replace(/</g, "&lt;") + "</small></li>"; }).join("") : "<li>'" + q.replace(/</g, "&lt;") + "' 검색 결과가 없습니다.</li>";
  }
  $$(".board-search").forEach(function (f) {
    var ul = $(".board-result", f.parentNode), inp = $("input", f), kind = f.getAttribute("data-board");
    f.addEventListener("submit", function (e) { e.preventDefault(); find(inp.value, kind).then(function (rows) { if (ul) render(ul, rows, inp.value); }); });
    if (kind === "all") { var q0 = new URLSearchParams(location.search).get("q"); if (q0) { inp.value = q0; find(q0, "all").then(function (rows) { render(ul, rows, q0); }); } }
  });
  var sb = $(".search-btn"), sp = $("#search");
  if (sb && sp) {
    sb.addEventListener("click", function () { sp.hidden = false; $("input", sp).focus(); });
    $(".search-close", sp).addEventListener("click", function () { sp.hidden = true; sb.focus(); });
  }

  // 약관 · 개인정보처리방침 창
  var dlg = $("#dialog"), pol = null;
  $$("[data-dialog]").forEach(function (a) {
    a.addEventListener("click", function (e) {
      e.preventDefault(); last = a;
      (pol ? Promise.resolve(pol) : fetch(BASE + "assets/policy.json").then(function (r) { return r.json(); }).then(function (d) { pol = d; return d; })).then(function (d) {
        var it = d[a.getAttribute("data-dialog")]; $("#dialog-t").textContent = it.title; $(".dialog-body", dlg).textContent = it.text;
        dlg.hidden = false; document.documentElement.style.overflow = "hidden"; $(".dialog-close", dlg).focus();
      }).catch(function () { location.href = a.href; });
    });
  });
  function closeDlg() { dlg.hidden = true; document.documentElement.style.overflow = ""; if (last) last.focus(); }
  if (dlg) { $(".dialog-close", dlg).addEventListener("click", closeDlg); dlg.addEventListener("click", function (e) { if (e.target === dlg) closeDlg(); }); }

  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
    if (lb && !lb.hidden) closeLb(); else if (dlg && !dlg.hidden) closeDlg(); else if (drawer && !drawer.hidden) drawerOpen(false); else if (sp && !sp.hidden) sp.hidden = true;
  });
})();
