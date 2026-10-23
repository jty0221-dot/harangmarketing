/* 에이봄의원 관리 화면 (공지 · 이벤트)
 * 외부 라이브러리 없음 · ES2019
 * 저장소 두 가지
 *   체험 모드 : ./content/*.json 을 읽고 고친 내용과 기록은 이 브라우저 localStorage 에만 둔다
 *   홈페이지 반영 모드 : GitHub 저장소의 content/*.json 을 Contents API 로 커밋한다 (기록 = 커밋 목록)
 * 토큰은 메모리 또는 sessionStorage 에만 둔다. localStorage 에 쓰지 않고 콘솔에 찍지 않는다.
 */
(function () {
  "use strict";

  var FILES = { notice: "content/notice.json", promotion: "content/promotion.json" };
  var KIND_NAME = { notice: "공지", promotion: "이벤트" };
  var LS = "abomAdmin.v1.";
  var HIST_MAX = 30;
  var IMG_MAX_W = 1600;
  // 의료광고 점검 단어 (진우 2026-10-23) · 경고용 보조 장치이며 알림이 없다고 의료법에 맞는다는 뜻은 아니다
  var AD_WORDS = ["최고", "최초", "유일", "완치", "100%", "부작용 없", "무통", "보장", "1위", "전후", "before", "after",
    "통증 없", "재발 없", "흉터 없", "붓기 없", "다운타임 없", "회복기간 없", "확실", "완벽", "영구", "평생", "즉각", "즉시 효과", "근본", "근원", "탁월", "획기적", "혁신적", "기적", "대명사", "검증된", "안전한", "가장", "제일", "독보적", "최상", "최적", "맞춤",
    "전문", "인증", "선정", "공식", "추천", "수상", "명의", "expert", "no.1", "best",
    "타 병원", "다른 병원", "보다 효과", "비해",
    "후기", "리얼후기", "체험담", "생생", "솔직",
    "무료", "공짜", "할인", "%", "페이백", "본인부담", "사은품", "경품", "추첨", "증정", "지인 소개", "친구 소개", "셔틀", "픽업", "리뷰 이벤트", "후기 이벤트", "모델 모집", "체험단",
    "국내 첫", "세계 첫", "신기술", "fda", "식약처 허가"];

  var $ = function (id) { return document.getElementById(id); };
  var qs = new URLSearchParams(location.search);
  var API = (qs.get("api") || "https://api.github.com").replace(/\/+$/, "");
  var IMG_BASE = new URL("../img/", location.href).href;
  var CSS_URL = new URL("../assets/site.css", location.href).href;

  var state = {
    store: null,        // 저장소 객체
    kind: "notice",     // 현재 탭
    data: {},           // kind -> JSON
    sha: {},            // kind -> 현재 파일 sha (GitHub)
    editing: null,      // { kind, id|null }
    thumb: "",
    histKind: "notice"
  };

  // ------------------------------------------------------------ 공통 도우미
  function lsGet(k) { try { return localStorage.getItem(LS + k); } catch (e) { return null; } }
  function lsSet(k, v) { localStorage.setItem(LS + k, v); }
  function lsDel(k) { try { localStorage.removeItem(LS + k); } catch (e) { /* 없음 */ } }
  function ssGet(k) { try { return sessionStorage.getItem(LS + k); } catch (e) { return null; } }
  function ssSet(k, v) { try { sessionStorage.setItem(LS + k, v); } catch (e) { /* 없음 */ } }
  function ssDel(k) { try { sessionStorage.removeItem(LS + k); } catch (e) { /* 없음 */ } }
  function esc(s) { return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }
  function clone(o) { return JSON.parse(JSON.stringify(o)); }
  function pad(n) { return (n < 10 ? "0" : "") + n; }
  function today() { var d = new Date(); return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()); }
  function fmtTime(iso) {
    var d = new Date(iso); if (isNaN(d)) return String(iso || "");
    var w = "일월화수목금토".charAt(d.getDay());
    return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()) + " (" + w + ") " + pad(d.getHours()) + ":" + pad(d.getMinutes());
  }
  function toJson(o) { return JSON.stringify(o, null, 1) + "\n"; }
  function show(id) {
    ["scrStart", "scrList", "scrEdit", "scrHistory"].forEach(function (s) { $(s).hidden = s !== id; });
    window.scrollTo(0, 0);
  }
  var toastTimer = 0;
  function toast(msg) {
    var t = $("toast"); t.textContent = msg; t.hidden = false;
    clearTimeout(toastTimer); toastTimer = setTimeout(function () { t.hidden = true; }, 5000);
  }
  function setStatus(id, msg, ok) { var el = $(id); el.textContent = msg || ""; el.className = "status" + (ok ? " ok" : ""); }
  function setErr(id, msg) { var el = $(id); el.textContent = msg || ""; el.hidden = !msg; }

  // utf-8 안전한 base64
  function bytesToB64(bytes) {
    var s = "", CH = 0x8000;
    for (var i = 0; i < bytes.length; i += CH) s += String.fromCharCode.apply(null, bytes.subarray(i, i + CH));
    return btoa(s);
  }
  function b64ToBytes(b64) {
    var s = atob(String(b64).replace(/\s+/g, "")), out = new Uint8Array(s.length);
    for (var i = 0; i < s.length; i++) out[i] = s.charCodeAt(i);
    return out;
  }
  function textToB64(t) { return bytesToB64(new TextEncoder().encode(t)); }
  function b64ToText(b) { return new TextDecoder("utf-8").decode(b64ToBytes(b)); }

  // ------------------------------------------------------------ 모달 (확인 · 입력)
  var modalResolve = null, modalLastFocus = null, modalOpts = null;
  function ask(opts) {
    modalOpts = opts;
    modalLastFocus = document.activeElement;
    $("mTitle").textContent = opts.title || "";
    $("mBody").innerHTML = opts.html || (opts.text ? "<p>" + esc(opts.text) + "</p>" : "");
    $("mField").hidden = !opts.input;
    if (opts.input) { $("mLabel").textContent = opts.input; $("mInput").value = opts.value || ""; $("mInput").type = opts.type || "text"; }
    $("mOk").textContent = opts.ok || "확인";
    $("mOk").className = "btn " + (opts.danger ? "btn-danger" : "btn-primary");
    $("mCancel").hidden = !!opts.noCancel;
    setErr("mErr", "");
    $("modal").hidden = false;
    setTimeout(function () { (opts.input ? $("mInput") : $("mOk")).focus(); }, 0);
    return new Promise(function (res) { modalResolve = res; });
  }
  function closeModal(val) {
    $("modal").hidden = true;
    var r = modalResolve; modalResolve = null;
    if (modalLastFocus && modalLastFocus.focus) try { modalLastFocus.focus(); } catch (e) { /* 없음 */ }
    if (r) r(val);
  }
  $("mOk").addEventListener("click", function () {
    if (modalOpts && modalOpts.input) {
      var v = $("mInput").value.trim();
      if (modalOpts.required && !v) { setErr("mErr", modalOpts.requiredMsg || "내용을 적어 주세요."); $("mInput").focus(); return; }
      if (modalOpts.validate) { var m = modalOpts.validate(v); if (m) { setErr("mErr", m); $("mInput").focus(); return; } }
      closeModal(v);
    } else closeModal(true);
  });
  $("mCancel").addEventListener("click", function () { closeModal(null); });
  $("mInput").addEventListener("keydown", function (e) { if (e.key === "Enter") { e.preventDefault(); $("mOk").click(); } });
  $("modal").addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !$("mCancel").hidden) { e.preventDefault(); closeModal(null); }
    if (e.key === "Tab") { // 모달 안에서만 포커스 이동
      var f = Array.prototype.filter.call($("modal").querySelectorAll("button, input"), function (x) { return !x.hidden && x.offsetParent !== null; });
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  // ------------------------------------------------------------ 저장소 : 체험 모드
  function DemoStore() { this.mode = "demo"; }
  DemoStore.prototype.load = function (kind) {
    var saved = lsGet("demo.file." + kind);
    if (saved) return Promise.resolve({ data: JSON.parse(saved), sha: "local" });
    return fetch("./" + FILES[kind], { cache: "no-store" }).then(function (r) {
      if (!r.ok) throw new Error("기본 내용을 불러오지 못했습니다 (" + r.status + ")");
      return r.text();
    }).then(function (t) { return { data: JSON.parse(t), sha: "local" }; });
  };
  DemoStore.prototype.hist = function (kind) { try { return JSON.parse(lsGet("demo.hist." + kind) || "[]"); } catch (e) { return []; } };
  // 저장 직전 내용을 기록에 먼저 넣고 새 내용을 쓴다
  DemoStore.prototype.save = function (kind, data, message) {
    var self = this;
    return this.load(kind).then(function (cur) {
      var h = self.hist(kind);
      h.unshift({ id: String(Date.now()) + Math.random().toString(36).slice(2, 6), at: new Date().toISOString(), message: message, json: toJson(cur.data) });
      if (h.length > HIST_MAX) h.length = HIST_MAX;
      try {
        lsSet("demo.hist." + kind, JSON.stringify(h));
        lsSet("demo.file." + kind, toJson(data));
      } catch (e) { throw new Error("이 기기 저장 공간이 가득 찼습니다. 체험 내용 지우기 후 다시 해 주세요."); }
      return { sha: "local" };
    });
  };
  // 체험 모드 기록 : 각 항목은 "그 저장 직전" 상태다
  DemoStore.prototype.history = function (kind) {
    return Promise.resolve(this.hist(kind).map(function (x) {
      return { id: x.id, at: x.at, message: "다음 저장 직전 상태 · " + x.message };
    }));
  };
  DemoStore.prototype.version = function (kind, id) {
    var x = this.hist(kind).filter(function (h) { return h.id === id; })[0];
    if (!x) return Promise.reject(new Error("기록을 찾지 못했습니다."));
    return Promise.resolve(JSON.parse(x.json));
  };
  DemoStore.prototype.uploadImage = function (name, blob, dataUrl) {
    var map = demoImages();
    map[name] = dataUrl;
    try { lsSet("demo.img", JSON.stringify(map)); } catch (e) { return Promise.reject(new Error("이 기기 저장 공간이 가득 찼습니다. 사진을 더 넣을 수 없습니다.")); }
    return Promise.resolve();
  };
  DemoStore.prototype.reset = function () {
    ["notice", "promotion"].forEach(function (k) { lsDel("demo.file." + k); lsDel("demo.hist." + k); });
    lsDel("demo.img");
  };
  function demoImages() { try { return JSON.parse(lsGet("demo.img") || "{}"); } catch (e) { return {}; } }
  // 이번에 올린 사진 (홈페이지에는 다음 빌드 뒤에 보이므로 편집 화면에서는 메모리 사본을 보여 준다)
  var sessionImgs = {};
  function knownImages() {
    var m = state.store && state.store.mode === "demo" ? demoImages() : {};
    for (var k in sessionImgs) m[k] = sessionImgs[k];
    return m;
  }

  // ------------------------------------------------------------ 저장소 : GitHub
  function GitHubStore(cfg, token) {
    this.mode = "github"; this.cfg = cfg;
    var t = token; // 클로저 안에만 둔다
    this.headers = function (extra) {
      var h = { "Accept": "application/vnd.github+json", "Authorization": "Bearer " + t, "X-GitHub-Api-Version": "2022-11-28" };
      if (extra) for (var k in extra) h[k] = extra[k];
      return h;
    };
  }
  GitHubStore.prototype.url = function (p) { return API + "/repos/" + encodeURIComponent(this.cfg.owner) + "/" + encodeURIComponent(this.cfg.repo) + p; };
  GitHubStore.prototype.req = function (method, p, body) {
    var opt = { method: method, headers: this.headers(body ? { "Content-Type": "application/json" } : null), cache: "no-store" };
    if (body) opt.body = JSON.stringify(body);
    return fetch(this.url(p), opt).then(function (r) {
      return r.text().then(function (t) {
        var j = null; try { j = t ? JSON.parse(t) : null; } catch (e) { j = null; }
        if (!r.ok) {
          var err = new Error(ghMessage(r.status, j)); err.status = r.status; throw err;
        }
        return j;
      });
    }, function () { throw new Error("인터넷 연결을 확인해 주세요. 저장소에 연결하지 못했습니다."); });
  };
  function ghMessage(status, j) {
    if (status === 401) return "토큰이 맞지 않거나 기간이 끝났습니다. 토큰을 다시 확인해 주세요.";
    if (status === 403) return "이 토큰으로는 할 수 없는 작업입니다. Contents 읽기 · 쓰기 권한을 확인해 주세요.";
    if (status === 404) return "저장소나 파일을 찾지 못했습니다. 주인 · 이름 · 브랜치를 확인해 주세요.";
    if (status === 409 || status === 422) return "다른 곳에서 먼저 저장된 내용이 있습니다. 새로 불러온 뒤 다시 저장해 주세요.";
    return "저장소 응답 오류 (" + status + ")" + (j && j.message ? " · " + j.message : "");
  }
  GitHubStore.prototype.getFile = function (path, ref) {
    var self = this;
    return this.req("GET", "/contents/" + path.split("/").map(encodeURIComponent).join("/") + "?ref=" + encodeURIComponent(ref || this.cfg.branch)).then(function (j) {
      if (j && j.content) return { text: b64ToText(j.content), sha: j.sha };
      // 1MB 가 넘는 파일은 content 가 비어 온다 : blob 으로 받는다
      return self.req("GET", "/git/blobs/" + j.sha).then(function (b) { return { text: b64ToText(b.content), sha: j.sha }; });
    });
  };
  GitHubStore.prototype.load = function (kind) {
    return this.getFile(FILES[kind]).then(function (f) { return { data: JSON.parse(f.text), sha: f.sha }; });
  };
  // 이전 내용은 직전 커밋으로 자동 보관된다. sha 가 다르면 저장소가 409 로 거절한다 (덮어쓰지 않음)
  GitHubStore.prototype.save = function (kind, data, message, sha) {
    return this.req("PUT", "/contents/" + FILES[kind], { message: message, content: textToB64(toJson(data)), sha: sha, branch: this.cfg.branch })
      .then(function (j) { return { sha: j && j.content ? j.content.sha : sha }; });
  };
  GitHubStore.prototype.history = function (kind) {
    return this.req("GET", "/commits?path=" + encodeURIComponent(FILES[kind]) + "&sha=" + encodeURIComponent(this.cfg.branch) + "&per_page=20").then(function (list) {
      return (list || []).map(function (c) {
        var cm = c.commit || {};
        return { id: c.sha, at: (cm.author && cm.author.date) || (cm.committer && cm.committer.date) || "", message: String(cm.message || "").split("\n")[0] };
      });
    });
  };
  GitHubStore.prototype.version = function (kind, sha) {
    return this.getFile(FILES[kind], sha).then(function (f) { return JSON.parse(f.text); });
  };
  GitHubStore.prototype.uploadImage = function (name, blob) {
    var self = this;
    return blob.arrayBuffer().then(function (buf) {
      return self.req("PUT", "/contents/public/img/" + name, { message: "사진 올림: " + name, content: bytesToB64(new Uint8Array(buf)), branch: self.cfg.branch });
    });
  };

  // ------------------------------------------------------------ 본문 정리 (허용 태그 · 스타일만 남긴다)
  var ALLOWED = { P: 1, BR: 1, STRONG: 1, B: 1, EM: 1, U: 1, A: 1, IMG: 1, SPAN: 1 };
  var DROP = { SCRIPT: 1, STYLE: 1, IFRAME: 1, OBJECT: 1, EMBED: 1, TEMPLATE: 1, NOSCRIPT: 1, SVG: 1, MATH: 1, FORM: 1, INPUT: 1, BUTTON: 1, SELECT: 1, TEXTAREA: 1, HEAD: 1, TITLE: 1, META: 1, LINK: 1, VIDEO: 1, AUDIO: 1, CANVAS: 1 };
  var BLOCK = { DIV: 1, H1: 1, H2: 1, H3: 1, H4: 1, H5: 1, H6: 1, LI: 1, BLOCKQUOTE: 1, SECTION: 1, ARTICLE: 1, HEADER: 1, FOOTER: 1, FIGURE: 1, PRE: 1, TR: 1 };
  function cleanStyle(st) {
    var out = [];
    String(st || "").split(";").forEach(function (d) {
      var i = d.indexOf(":"); if (i < 0) return;
      var k = d.slice(0, i).trim().toLowerCase(), v = d.slice(i + 1).trim().replace(/\s*!important$/i, "");
      if (/url\(|expression|javascript:|[<>"\\]/i.test(v)) return;
      if (k === "text-align" && /^(left|center|right|justify)$/i.test(v)) out.push("text-align:" + v.toLowerCase());
      else if (k === "color" && /^(#[0-9a-f]{3,8}|rgba?\(\s*[\d.\s,%]+\)|[a-z]{3,20})$/i.test(v)) out.push("color:" + v);
      else if (k === "font-size" && /^\d{1,3}(\.\d+)?(px|em|rem|%)$/i.test(v)) out.push("font-size:" + v);
      else if (k === "font-weight" && /^(normal|bold|bolder|lighter|[1-9]00)$/i.test(v)) out.push("font-weight:" + v);
    });
    return out.join(";");
  }
  function cleanHref(h) {
    h = String(h || "").trim();
    if (/^(https?:\/\/|mailto:|tel:)/i.test(h)) return h;
    if (/^\/(?!\/)/.test(h) || /^#/.test(h)) return h;
    return "";
  }
  // 편집 화면에서 보이는 사진 주소 → 저장용 /img/이름
  function imgPath(el) {
    var dp = el.getAttribute("data-path"); if (dp && /^\/img\/[\w.\-]+$/.test(dp)) return dp;
    var s = el.getAttribute("src") || "";
    if (s.indexOf(IMG_BASE) === 0) return "/img/" + s.slice(IMG_BASE.length).split(/[?#]/)[0];
    if (/^\/img\/[\w.\-\/]+$/.test(s)) return s;
    if (/^https:\/\//i.test(s)) return s;
    return "";
  }
  function sanitize(html) {
    var doc = new DOMParser().parseFromString("<body>" + String(html || "") + "</body>", "text/html");
    function walk(node) {
      var out = "";
      for (var c = node.firstChild; c; c = c.nextSibling) {
        if (c.nodeType === 3) { out += esc(c.nodeValue).replace(/\u00a0/g, "&nbsp;"); continue; }
        if (c.nodeType !== 1) continue;
        var tag = c.tagName;
        if (DROP[tag]) continue;
        var inner = walk(c);
        if (!ALLOWED[tag]) {
          if (BLOCK[tag]) { var bs = cleanStyle(c.getAttribute("style")); out += "<p" + (bs ? ' style="' + esc(bs) + '"' : "") + ">" + (inner || "<br>") + "</p>"; }
          else out += inner;
          continue;
        }
        if (tag === "BR") { out += "<br>"; continue; }
        if (tag === "IMG") {
          var src = imgPath(c); if (!src) continue;
          out += '<img src="' + esc(src) + '" alt="' + esc(c.getAttribute("alt") || "") + '" loading="lazy">';
          continue;
        }
        if (tag === "A") {
          var href = cleanHref(c.getAttribute("href"));
          if (!href) { out += inner; continue; }
          var ext = /^https?:/i.test(href);
          out += '<a href="' + esc(href) + '"' + (ext ? ' target="_blank" rel="noopener"' : "") + ">" + inner + "</a>";
          continue;
        }
        var t = tag.toLowerCase(), st = "";
        if (tag === "P" || tag === "SPAN") st = cleanStyle(c.getAttribute("style"));
        if (tag === "SPAN" && !st) { out += inner; continue; }
        if (tag === "P" && !inner) continue; // 빈 문단 (<p></p>) 은 버린다. 빈 줄은 <p><br></p>
        out += "<" + t + (st ? ' style="' + esc(st) + '"' : "") + ">" + inner + "</" + t + ">";
      }
      return out;
    }
    // 맨 위 단계 : 문단 밖에 떨어진 글자 · 사진은 문단으로 감싼다
    var res = "", buf = "";
    var flush = function () { if (buf.replace(/&nbsp;|\s/g, "")) res += "<p>" + buf + "</p>"; buf = ""; };
    for (var c = doc.body.firstChild; c; c = c.nextSibling) {
      var tmp = doc.createElement("div"); tmp.appendChild(c.cloneNode(true));
      var h = walk(tmp);
      if (/^<p[\s>]/.test(h)) { flush(); res += h; } else buf += h;
    }
    flush();
    return res;
  }
  // 줄바꿈 정리 : 빈 줄이 여러 개 이어지면 하나로, 앞뒤 빈 줄 제거
  function tidy(html) {
    var s = sanitize(html);
    var EMPTY = "(?:<p(?: style=\"[^\"]*\")?>(?:<br>|&nbsp;|\\s)*</p>)";
    s = s.replace(new RegExp("(" + EMPTY + ")(?:" + EMPTY + ")+", "g"), "<p><br></p>");
    s = s.replace(new RegExp("^(?:" + EMPTY + ")+"), "").replace(new RegExp("(?:" + EMPTY + ")+$"), "");
    s = s.replace(/(<br>){3,}/g, "<br><br>");
    return s;
  }
  // 저장 html → 화면에 보이는 주소
  function displayHtml(html) {
    var dm = knownImages();
    return String(html || "").replace(/(<img\b[^>]*?\bsrc=")(\/img\/([\w.\-]+))(")/g, function (m, a, path, name, b) {
      var real = dm[name] || (IMG_BASE + name);
      return a + real + '" data-path="' + path + b;
    });
  }
  function displayImg(path) {
    if (!path) return "";
    var m = /^\/img\/([\w.\-]+)$/.exec(path);
    if (!m) return path;
    var dm = knownImages();
    return dm[m[1]] || IMG_BASE + m[1];
  }

  // ------------------------------------------------------------ 의료광고 표현 점검
  function adScan(text) {
    var low = String(text || "").toLowerCase();
    return AD_WORDS.filter(function (w) { return low.indexOf(w.toLowerCase()) >= 0; });
  }
  function plain(html) { var d = document.createElement("div"); d.innerHTML = String(html || "").replace(/<img[^>]*>/g, " "); return d.textContent || ""; }
  var lastAdKey = "";
  function updateGuard() {
    var found = adScan($("fTitle").value + " " + plain(currentBody()));
    var key = found.join("|");
    if (!found.length) { $("guard").hidden = true; $("guardOk").checked = false; lastAdKey = ""; return found; }
    if (key !== lastAdKey) { $("guardOk").checked = false; lastAdKey = key; }
    $("guardText").textContent = "의료광고 표현 확인이 필요한 단어가 있습니다: " + found.join(", ");
    $("guard").hidden = false;
    return found;
  }

  // ------------------------------------------------------------ 시작 화면
  function restoreCfg() {
    try {
      var c = JSON.parse(lsGet("gh.cfg") || "null");
      if (c) { $("ghOwner").value = c.owner || ""; $("ghRepo").value = c.repo || ""; $("ghBranch").value = c.branch || "main"; }
    } catch (e) { /* 없음 */ }
  }
  restoreCfg();

  $("btnDemo").addEventListener("click", function () { start(new DemoStore()); });
  $("btnDemoReset").addEventListener("click", function () {
    ask({ title: "체험 내용 지우기", text: "이 기기에서 체험 모드로 고친 내용과 기록을 모두 지우고 처음 상태로 돌립니다. 실제 홈페이지와는 관계없습니다.", ok: "지우기", danger: true }).then(function (ok) {
      if (ok) { new DemoStore().reset(); toast("체험 내용을 지웠습니다."); }
    });
  });
  $("ghForm").addEventListener("submit", function (e) {
    e.preventDefault();
    var cfg = { owner: $("ghOwner").value.trim(), repo: $("ghRepo").value.trim(), branch: $("ghBranch").value.trim() || "main" };
    var token = $("ghToken").value.trim();
    if (!cfg.owner || !cfg.repo || !token) { setErr("ghErr", "저장소 주인 · 이름 · 토큰을 모두 적어 주세요."); return; }
    if (!/^[\w.\-]+$/.test(cfg.owner) || !/^[\w.\-]+$/.test(cfg.repo) || !/^[\w.\-\/]+$/.test(cfg.branch)) { setErr("ghErr", "저장소 주인 · 이름 · 브랜치에는 영문 · 숫자 · - _ . 만 쓸 수 있습니다."); return; }
    setErr("ghErr", "");
    try { lsSet("gh.cfg", JSON.stringify(cfg)); } catch (x) { /* 없음 */ }
    if ($("ghRemember").checked) ssSet("gh.token", token); else ssDel("gh.token");
    $("ghToken").value = "";
    start(new GitHubStore(cfg, token)).catch(function () { /* 오류는 화면에 표시 */ });
  });

  function start(store) {
    state.store = store; state.data = {}; state.sha = {};
    $("btnGh").disabled = true; $("btnDemo").disabled = true;
    return Promise.all([store.load("notice"), store.load("promotion")]).then(function (r) {
      state.data.notice = r[0].data; state.sha.notice = r[0].sha;
      state.data.promotion = r[1].data; state.sha.promotion = r[1].sha;
      var bar = $("modeBar");
      if (store.mode === "demo") { bar.textContent = "체험 모드 · 저장은 이 기기 브라우저에만 됩니다. 실제 홈페이지는 바뀌지 않습니다."; bar.className = "mode-bar demo"; }
      else { bar.textContent = "홈페이지 반영 모드 · " + store.cfg.owner + "/" + store.cfg.repo + " (" + store.cfg.branch + ") · 저장하면 1~2분 뒤 홈페이지에 반영됩니다."; bar.className = "mode-bar"; }
      bar.hidden = false; $("topNav").hidden = false;
      try { ssSet("mode", store.mode); } catch (e) { /* 없음 */ }
      setTab("notice"); show("scrList"); $("main").focus({ preventScroll: true });
    }).catch(function (err) {
      state.store = null;
      if (store.mode === "github") { setErr("ghErr", err.message); ssDel("gh.token"); }
      else toast(err.message);
      throw err;
    }).then(function (v) { $("btnGh").disabled = false; $("btnDemo").disabled = false; return v; }, function (e) { $("btnGh").disabled = false; $("btnDemo").disabled = false; throw e; });
  }
  $("btnExit").addEventListener("click", function () {
    state.store = null; ssDel("gh.token"); ssDel("mode");
    $("modeBar").hidden = true; $("topNav").hidden = true; show("scrStart");
  });
  // 같은 탭에서 새로 고침했을 때 (기억 체크 시) 자동 연결
  (function resume() {
    var m = ssGet("mode");
    if (m === "demo") { start(new DemoStore()).catch(function () { /* 없음 */ }); return; }
    var tok = ssGet("gh.token");
    if (m === "github" && tok) {
      try { var c = JSON.parse(lsGet("gh.cfg") || "null"); if (c) start(new GitHubStore(c, tok)).catch(function () { /* 없음 */ }); } catch (e) { /* 없음 */ }
    }
  })();

  // ------------------------------------------------------------ 목록
  function setTab(kind) {
    state.kind = kind;
    ["tabNotice", "tabPromotion"].forEach(function (id) {
      var on = $(id).getAttribute("data-kind") === kind;
      $(id).setAttribute("aria-selected", on ? "true" : "false"); $(id).tabIndex = on ? 0 : -1;
    });
    $("listPanel").setAttribute("aria-labelledby", kind === "notice" ? "tabNotice" : "tabPromotion");
    renderList();
  }
  function tabKeys(ids, fn) {
    ids.forEach(function (id, i) {
      $(id).addEventListener("click", function () { fn($(id).getAttribute("data-kind")); });
      $(id).addEventListener("keydown", function (e) {
        if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
        e.preventDefault(); var n = $(ids[(i + 1) % ids.length]); n.focus(); n.click();
      });
    });
  }
  tabKeys(["tabNotice", "tabPromotion"], setTab);
  $("q").addEventListener("input", renderList);

  function sortedPosts(kind) {
    var posts = (state.data[kind] && state.data[kind].posts) || [];
    if (kind !== "notice") return posts.slice();
    var pin = posts.filter(function (p) { return p.pinned; });
    var rest = posts.filter(function (p) { return !p.pinned; }).sort(function (a, b) { return String(b.date || "").localeCompare(String(a.date || "")); });
    return pin.concat(rest);
  }
  function renderList() {
    var kind = state.kind, q = $("q").value.trim().toLowerCase();
    var posts = sortedPosts(kind).filter(function (p) { return !q || String(p.title || "").toLowerCase().indexOf(q) >= 0; });
    var ul = $("postList");
    if (!posts.length) { ul.innerHTML = '<li class="empty">' + (q ? "검색한 제목의 글이 없습니다." : "아직 글이 없습니다.") + "</li>"; }
    else ul.innerHTML = posts.map(function (p) {
      var meta = kind === "notice" ? (p.pinned ? "고정 공지" : "번호 " + esc(p.no)) + " · " + esc(p.date || "") : esc(p.category || "") + (p.pinned ? " · 고정" : "");
      var th = kind === "promotion" && p.thumb ? '<img class="thumb" src="' + esc(displayImg(p.thumb)) + '" alt="">' : "";
      return '<li class="post-item"><button type="button" data-id="' + esc(p.id) + '">' + th + "<span>" + '<span class="t">' + (p.pinned ? '<span class="badge">고정</span>' : "") + esc(p.title) + '</span><span class="m">' + meta + "</span></span></button></li>";
    }).join("");
    setStatus("listStatus", KIND_NAME[kind] + " " + posts.length + "개");
  }
  $("postList").addEventListener("click", function (e) {
    var b = e.target.closest("button[data-id]"); if (b) openEditor(state.kind, b.getAttribute("data-id"));
  });
  $("btnNew").addEventListener("click", function () { openEditor(state.kind, null); });

  // ------------------------------------------------------------ 편집
  function findPost(kind, id) { return ((state.data[kind] && state.data[kind].posts) || []).filter(function (p) { return String(p.id) === String(id); })[0] || null; }
  function openEditor(kind, id) {
    var p = id ? findPost(kind, id) : null;
    state.editing = { kind: kind, id: p ? p.id : null };
    $("hEdit").textContent = (p ? KIND_NAME[kind] + " 고치기" : "새 " + KIND_NAME[kind] + " 쓰기");
    $("fTitle").value = p ? p.title : "";
    var isN = kind === "notice";
    $("wrapDate").hidden = !isN; $("wrapAuthor").hidden = !isN; $("wrapCat").hidden = isN; $("wrapThumb").hidden = isN;
    if (isN) {
      $("fDate").value = p ? p.date : today();
      var last = sortedPosts("notice").filter(function (x) { return !x.pinned; })[0];
      $("fAuthor").value = p ? (p.author || "") : (last && last.author) || "에이봄의원";
    } else {
      var cats = (state.data.promotion.categories || []).map(function (c) { return c.name; });
      if (p && p.category && cats.indexOf(p.category) < 0) cats.push(p.category);
      $("fCat").innerHTML = cats.map(function (c) { return '<option value="' + esc(c) + '">' + esc(c) + "</option>"; }).join("");
      $("fCat").value = p ? p.category : cats[0] || "";
      state.thumb = p ? p.thumb || "" : "";
      showThumb();
    }
    $("fPinned").checked = p ? !!p.pinned : false;
    setSource(false);
    $("fBody").innerHTML = displayHtml(p ? p.body : "<p><br></p>");
    $("btnDelete").hidden = !p;
    $("guardOk").checked = false; lastAdKey = "";
    setErr("editErr", ""); setStatus("editStatus", "");
    updateGuard(); renderPreview();
    show("scrEdit"); $("fTitle").focus();
  }
  function showThumb() {
    var img = $("thumbImg");
    if (state.thumb) { img.src = displayImg(state.thumb); img.hidden = false; $("thumbName").textContent = state.thumb; }
    else { img.hidden = true; img.removeAttribute("src"); $("thumbName").textContent = "고른 사진이 없습니다."; }
  }
  $("btnBack").addEventListener("click", function () { show("scrList"); renderList(); });

  // 본문 : 편집기 / 글만 보기
  var sourceMode = false;
  function currentBody() { return sourceMode ? $("fSource").value : $("fBody").innerHTML; }
  function setSource(on) {
    if (on === sourceMode) { $("fSource").hidden = !on; $("fBody").hidden = on; return; }
    if (on) { $("fSource").value = sanitize($("fBody").innerHTML); }
    else { $("fBody").innerHTML = displayHtml(sanitize($("fSource").value)); }
    sourceMode = on;
    $("fSource").hidden = !on; $("fBody").hidden = on;
    $("btnSource").setAttribute("aria-pressed", on ? "true" : "false");
    Array.prototype.forEach.call(document.querySelectorAll(".tb[data-cmd]"), function (b) { b.disabled = on; });
  }
  $("btnSource").addEventListener("click", function () { setSource(!sourceMode); (sourceMode ? $("fSource") : $("fBody")).focus(); });

  var previewTimer = 0;
  function renderPreview() {
    var html = displayHtml(sanitize(currentBody()));
    var title = esc($("fTitle").value);
    var doc = '<!doctype html><html lang="ko"><head><meta charset="utf-8"><link rel="stylesheet" href="' + esc(CSS_URL) + '"><style>body{padding:20px;background:#fff}.pv-t{font-size:22px;margin:0 0 16px;color:#182f45}</style></head><body>' +
      '<h1 class="pv-t">' + (title || "제목") + '</h1><div class="rich">' + html + "</div></body></html>";
    $("preview").srcdoc = doc;
  }
  function onBodyChange() { clearTimeout(previewTimer); previewTimer = setTimeout(function () { renderPreview(); updateGuard(); }, 250); }
  $("fBody").addEventListener("input", onBodyChange);
  $("fSource").addEventListener("input", onBodyChange);
  $("fTitle").addEventListener("input", onBodyChange);
  $("fBody").addEventListener("paste", function (e) {
    // 붙여넣기는 허용 태그만 남긴다
    var cd = e.clipboardData; if (!cd) return;
    var h = cd.getData("text/html"), t = cd.getData("text/plain");
    e.preventDefault();
    if (h) document.execCommand("insertHTML", false, displayHtml(sanitize(h)));
    else document.execCommand("insertText", false, t);
  });

  // 선택 영역 보관 (모달을 열면 선택이 풀리므로)
  var savedRange = null;
  function saveRange() {
    var s = window.getSelection();
    if (s.rangeCount && $("fBody").contains(s.getRangeAt(0).commonAncestorContainer)) savedRange = s.getRangeAt(0).cloneRange();
  }
  function restoreRange() {
    $("fBody").focus();
    var s = window.getSelection(); s.removeAllRanges();
    if (savedRange && $("fBody").contains(savedRange.commonAncestorContainer)) s.addRange(savedRange);
    else { var r = document.createRange(); r.selectNodeContents($("fBody")); r.collapse(false); s.addRange(r); }
  }
  $("fBody").addEventListener("keyup", saveRange);
  $("fBody").addEventListener("mouseup", saveRange);
  $("fBody").addEventListener("blur", saveRange);
  try { document.execCommand("defaultParagraphSeparator", false, "p"); } catch (e) { /* 없음 */ }

  Array.prototype.forEach.call(document.querySelectorAll(".tb[data-cmd]"), function (b) {
    b.addEventListener("mousedown", function (e) { e.preventDefault(); saveRange(); }); // 편집기 선택 유지
    b.addEventListener("click", function () { command(b.getAttribute("data-cmd")); });
  });
  function command(cmd) {
    if (cmd === "bold" || cmd === "justifyCenter" || cmd === "justifyLeft") {
      restoreRange();
      try { document.execCommand("styleWithCSS", false, cmd !== "bold"); } catch (e) { /* 없음 */ }
      document.execCommand(cmd, false, null);
      saveRange(); onBodyChange(); return;
    }
    if (cmd === "tidy") {
      $("fBody").innerHTML = displayHtml(tidy($("fBody").innerHTML)); onBodyChange(); toast("빈 줄을 정리했습니다."); return;
    }
    if (cmd === "image") { saveRange(); $("fImage").value = ""; $("fImage").click(); return; }
    if (cmd === "link") {
      saveRange();
      var selText = savedRange ? savedRange.toString() : "";
      ask({ title: "링크 넣기", input: "연결할 주소 (https:// 로 시작)", value: "https://", required: true, ok: "넣기",
        validate: function (v) { return cleanHref(v) && v !== "https://" ? "" : "https:// 로 시작하는 주소나 tel: 번호를 적어 주세요."; } }).then(function (url) {
        if (!url) return;
        restoreRange();
        if (selText) document.execCommand("createLink", false, url);
        else document.execCommand("insertHTML", false, '<a href="' + esc(url) + '">' + esc(url) + "</a>");
        saveRange(); onBodyChange();
      });
    }
  }

  // ------------------------------------------------------------ 사진 (줄이기 · webp · 올리기)
  function imgName(ext) {
    var d = new Date();
    var r = Math.random().toString(36).slice(2, 6); while (r.length < 4) r += "0";
    return "img-" + d.getFullYear() + pad(d.getMonth() + 1) + pad(d.getDate()) + "-" + pad(d.getHours()) + pad(d.getMinutes()) + pad(d.getSeconds()) + "-" + r + "." + ext;
  }
  function loadImage(file) {
    return new Promise(function (res, rej) {
      var url = URL.createObjectURL(file), im = new Image();
      im.onload = function () { URL.revokeObjectURL(url); res(im); };
      im.onerror = function () { URL.revokeObjectURL(url); rej(new Error("사진 파일을 읽지 못했습니다. jpg · png · webp 사진을 골라 주세요.")); };
      im.src = url;
    });
  }
  function toBlob(canvas, type, q) { return new Promise(function (res) { canvas.toBlob(function (b) { res(b); }, type, q); }); }
  function processImage(file) {
    return loadImage(file).then(function (im) {
      var w = im.naturalWidth, h = im.naturalHeight;
      if (w > IMG_MAX_W) { h = Math.round(h * IMG_MAX_W / w); w = IMG_MAX_W; }
      var c = document.createElement("canvas"); c.width = w; c.height = h;
      var ctx = c.getContext("2d"); ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, w, h); ctx.drawImage(im, 0, 0, w, h);
      return toBlob(c, "image/webp", 0.85).then(function (b) {
        if (b && b.type === "image/webp") return { blob: b, ext: "webp", canvas: c };
        return toBlob(c, "image/jpeg", 0.85).then(function (j) { return { blob: j, ext: "jpg", canvas: c }; });
      });
    }).then(function (r) {
      return new Promise(function (res) {
        var fr = new FileReader(); fr.onload = function () { res({ blob: r.blob, name: imgName(r.ext), dataUrl: fr.result }); }; fr.readAsDataURL(r.blob);
      });
    });
  }
  function uploadPicked(file) {
    setStatus("editStatus", "사진을 줄이고 올리는 중입니다...");
    return processImage(file).then(function (img) {
      return state.store.uploadImage(img.name, img.blob, img.dataUrl).then(function () { sessionImgs[img.name] = img.dataUrl; return img; });
    }).then(function (img) { setStatus("editStatus", "사진을 올렸습니다: " + img.name, true); return img; }, function (err) { setStatus("editStatus", ""); setErr("editErr", err.message); throw err; });
  }
  $("fImage").addEventListener("change", function () {
    var f = $("fImage").files[0]; if (!f) return;
    ask({ title: "사진 설명", input: "사진 설명 (접근성 · 검색에 쓰입니다)", required: true, requiredMsg: "사진 설명을 한 줄 적어 주세요.", ok: "사진 넣기" }).then(function (alt) {
      if (alt == null) return;
      return uploadPicked(f).then(function (img) {
        restoreRange();
        document.execCommand("insertHTML", false, '<img src="' + esc(img.dataUrl) + '" data-path="/img/' + esc(img.name) + '" alt="' + esc(alt) + '">');
        saveRange(); onBodyChange();
      });
    }).catch(function () { /* 화면에 표시함 */ });
  });
  $("fThumb").addEventListener("change", function () {
    var f = $("fThumb").files[0]; if (!f) return;
    uploadPicked(f).then(function (img) { state.thumb = "/img/" + img.name; showThumb(); }).catch(function () { /* 화면에 표시함 */ });
    $("fThumb").value = "";
  });

  // ------------------------------------------------------------ 저장
  function nextNo(posts) {
    var max = 0;
    posts.forEach(function (p) { var n = parseInt(p.no, 10); if (!isNaN(n) && n > max) max = n; });
    return String(max + 1);
  }
  // 최신 파일에 바뀐 글 하나만 적용한다 (다른 사람이 고친 다른 글은 그대로)
  function applyEdit(data, ed, fields) {
    var posts = data.posts = data.posts || [];
    var idx = -1;
    if (ed.id) posts.forEach(function (p, i) { if (String(p.id) === String(ed.id)) idx = i; });
    var p = idx >= 0 ? posts[idx] : { id: String(Date.now()) };
    p.title = fields.title; p.pinned = fields.pinned; p.body = fields.body;
    if (ed.kind === "notice") {
      p.date = fields.date; p.author = fields.author;
      if (p.pinned) p.no = "";
      else if (!p.no || idx < 0) p.no = nextNo(posts);
      var ordered = { id: p.id, no: p.no, title: p.title, author: p.author, date: p.date, pinned: p.pinned, body: p.body };
      p = ordered;
    } else {
      p.category = fields.category; p.thumb = fields.thumb;
      p = { id: p.id, category: p.category, title: p.title, thumb: p.thumb, pinned: p.pinned, body: p.body };
    }
    if (idx >= 0) posts[idx] = p; else posts.unshift(p);
    return p;
  }
  function saveKind(kind, mutate, message) {
    // 저장 직전 최신 내용을 다시 읽고 적용 → 저장 (GitHub 는 sha 로 충돌 감지)
    var store = state.store;
    return store.load(kind).then(function (cur) {
      var data = clone(cur.data);
      var r = mutate(data);
      return store.save(kind, data, message, cur.sha).then(function (s) {
        state.data[kind] = data; state.sha[kind] = s.sha; return r;
      });
    });
  }
  function doneMsg() { return state.store.mode === "github" ? "저장했습니다. 홈페이지 반영까지 1~2분 걸립니다." : "저장했습니다. (체험 모드 · 이 기기에만 저장)"; }

  $("editForm").addEventListener("submit", function (e) {
    e.preventDefault();
    var ed = state.editing; if (!ed) return;
    setErr("editErr", "");
    var title = $("fTitle").value.trim();
    if (!title) { setErr("editErr", "제목을 적어 주세요."); $("fTitle").focus(); return; }
    var body = sanitize(currentBody());
    if (ed.kind === "notice" && !/^\d{4}-\d{2}-\d{2}$/.test($("fDate").value)) { setErr("editErr", "날짜를 골라 주세요."); $("fDate").focus(); return; }
    var found = updateGuard();
    if (found.length && !$("guardOk").checked) { setErr("editErr", "의료광고 표현 확인 후 '확인했습니다' 를 체크해 주세요."); $("guardOk").focus(); return; }
    var fields = { title: title, pinned: $("fPinned").checked, body: body, date: $("fDate").value, author: $("fAuthor").value.trim(), category: $("fCat").value, thumb: state.thumb || "" };
    var msg = KIND_NAME[ed.kind] + " " + (ed.id ? "수정" : "추가") + ": " + title;
    $("btnSave").disabled = true; setStatus("editStatus", "저장하는 중입니다...");
    saveKind(ed.kind, function (data) { return applyEdit(data, ed, fields); }, msg).then(function (p) {
      ed.id = p.id; $("btnDelete").hidden = false; $("hEdit").textContent = KIND_NAME[ed.kind] + " 고치기";
      if (sourceMode) $("fSource").value = p.body; else $("fBody").innerHTML = displayHtml(p.body);
      setStatus("editStatus", doneMsg(), true); toast(doneMsg()); renderPreview();
    }).catch(function (err) { setStatus("editStatus", ""); setErr("editErr", err.message); })
      .then(function () { $("btnSave").disabled = false; });
  });

  $("btnDelete").addEventListener("click", function () {
    var ed = state.editing; if (!ed || !ed.id) return;
    var p = findPost(ed.kind, ed.id); var title = p ? p.title : "";
    ask({ title: "이 글을 삭제할까요?", text: "'" + title + "' 글을 홈페이지에서 내립니다. 삭제 전 내용은 기록에 남아 기록 · 되돌리기에서 다시 살릴 수 있습니다.", ok: "삭제", danger: true }).then(function (ok) {
      if (!ok) return;
      setStatus("editStatus", "삭제하는 중입니다...");
      return saveKind(ed.kind, function (data) {
        data.posts = (data.posts || []).filter(function (x) { return String(x.id) !== String(ed.id); });
      }, KIND_NAME[ed.kind] + " 삭제: " + title).then(function () {
        toast(state.store.mode === "github" ? "삭제했습니다. 홈페이지 반영까지 1~2분 걸립니다." : "삭제했습니다. (체험 모드)");
        show("scrList"); renderList();
      });
    }).catch(function (err) { setStatus("editStatus", ""); setErr("editErr", err.message); });
  });

  // ------------------------------------------------------------ 기록 · 되돌리기
  $("btnHistory").addEventListener("click", function () { if (state.store) { show("scrHistory"); setHistTab(state.kind); } });
  $("btnHistBack").addEventListener("click", function () { show("scrList"); renderList(); });
  tabKeys(["htabNotice", "htabPromotion"], function (k) { setHistTab(k); });
  function setHistTab(kind) {
    state.histKind = kind;
    ["htabNotice", "htabPromotion"].forEach(function (id) {
      var on = $(id).getAttribute("data-kind") === kind;
      $(id).setAttribute("aria-selected", on ? "true" : "false"); $(id).tabIndex = on ? 0 : -1;
    });
    loadHistory();
  }
  var histItems = [];
  function loadHistory() {
    var kind = state.histKind;
    $("histList").innerHTML = ""; setStatus("histStatus", "기록을 불러오는 중입니다...");
    return state.store.history(kind).then(function (items) {
      histItems = items;
      if (!items.length) { setStatus("histStatus", ""); $("histList").innerHTML = '<li class="empty">아직 저장 기록이 없습니다. 저장하면 이전 내용이 여기에 보관됩니다.</li>'; return; }
      setStatus("histStatus", KIND_NAME[kind] + " 기록 " + items.length + "개 (최근 순" + (state.store.mode === "github" ? " · 최근 20개" : " · 최대 30개") + ")");
      $("histList").innerHTML = items.map(function (it, i) {
        var label = state.store.mode === "github" && i === 0 ? " (지금 홈페이지 내용)" : "";
        return '<li class="hist-item" data-id="' + esc(it.id) + '"><span class="when">' + esc(fmtTime(it.at)) + esc(label) + '</span><span class="msg">' + esc(it.message) + "</span>" +
          '<div class="hist-actions"><button type="button" class="btn btn-ghost btn-sm" data-act="view" aria-expanded="false">글 목록 보기</button>' +
          (label ? "" : '<button type="button" class="btn btn-primary btn-sm" data-act="revert">이 시점으로 되돌리기</button>') + '</div><div class="hist-view"></div></li>';
      }).join("");
    }).catch(function (err) { setStatus("histStatus", ""); $("histList").innerHTML = '<li class="empty">' + esc(err.message) + "</li>"; });
  }
  $("histList").addEventListener("click", function (e) {
    var b = e.target.closest("button[data-act]"); if (!b) return;
    var li = b.closest(".hist-item"), id = li.getAttribute("data-id"), kind = state.histKind;
    var it = histItems.filter(function (x) { return x.id === id; })[0];
    if (b.getAttribute("data-act") === "view") {
      var box = li.querySelector(".hist-view");
      if (b.getAttribute("aria-expanded") === "true") { box.innerHTML = ""; b.setAttribute("aria-expanded", "false"); return; }
      box.textContent = "불러오는 중입니다...";
      state.store.version(kind, id).then(function (data) {
        var posts = data.posts || [];
        box.innerHTML = '<ul class="hist-titles">' + posts.map(function (p) { return "<li>" + (p.pinned ? "[고정] " : "") + esc(p.title) + "</li>"; }).join("") + "</ul>";
        b.setAttribute("aria-expanded", "true");
      }).catch(function (err) { box.textContent = err.message; });
      return;
    }
    ask({ title: "이 시점으로 되돌릴까요?", text: fmtTime(it.at) + " 의 " + KIND_NAME[kind] + " 내용으로 되돌립니다. 지금 내용은 기록에 남아 다시 돌아올 수 있습니다.", ok: "되돌리기" }).then(function (ok) {
      if (!ok) return;
      setStatus("histStatus", "되돌리는 중입니다...");
      return state.store.version(kind, id).then(function (old) {
        return saveKind(kind, function (data) {
          Object.keys(data).forEach(function (k) { delete data[k]; });
          Object.keys(old).forEach(function (k) { data[k] = old[k]; });
        }, KIND_NAME[kind] + " 되돌리기: " + fmtTime(it.at) + " 시점");
      }).then(function () {
        toast(state.store.mode === "github" ? "되돌렸습니다. 홈페이지 반영까지 1~2분 걸립니다." : "되돌렸습니다. (체험 모드)");
        return loadHistory().then(function () { setStatus("histStatus", "되돌렸습니다. " + $("histStatus").textContent, true); });
      });
    }).catch(function (err) { setStatus("histStatus", err.message); });
  });

  // 테스트 · 점검용 (토큰은 노출하지 않는다)
  window.__abomAdmin = { sanitize: sanitize, tidy: tidy, adScan: adScan, mode: function () { return state.store ? state.store.mode : null; } };
})();
