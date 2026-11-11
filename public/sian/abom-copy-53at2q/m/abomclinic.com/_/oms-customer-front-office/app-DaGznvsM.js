var ze = Object.defineProperty;
var Je = (e, t, n) => t in e ? ze(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n;
var T = (e, t, n) => (Je(e, typeof t != "symbol" ? t + "" : t, n), n), ue = (e, t, n) => {
  if (!t.has(e))
    throw TypeError("Cannot " + n);
};
var F = (e, t, n) => (ue(e, t, "read from private field"), n ? n.call(e) : t.get(e)), U = (e, t, n) => {
  if (t.has(e))
    throw TypeError("Cannot add the same private member more than once");
  t instanceof WeakSet ? t.add(e) : t.set(e, n);
}, D = (e, t, n, r) => (ue(e, t, "write to private field"), r ? r.call(e, n) : t.set(e, n), n);
function ge(e, t) {
  return function() {
    return e.apply(t, arguments);
  };
}
const { toString: We } = Object.prototype, { getPrototypeOf: oe } = Object, K = /* @__PURE__ */ ((e) => (t) => {
  const n = We.call(t);
  return e[n] || (e[n] = n.slice(8, -1).toLowerCase());
})(/* @__PURE__ */ Object.create(null)), O = (e) => (e = e.toLowerCase(), (t) => K(t) === e), v = (e) => (t) => typeof t === e, { isArray: _ } = Array, j = v("undefined");
function Ve(e) {
  return e !== null && !j(e) && e.constructor !== null && !j(e.constructor) && b(e.constructor.isBuffer) && e.constructor.isBuffer(e);
}
const Oe = O("ArrayBuffer");
function Ke(e) {
  let t;
  return typeof ArrayBuffer < "u" && ArrayBuffer.isView ? t = ArrayBuffer.isView(e) : t = e && e.buffer && Oe(e.buffer), t;
}
const ve = v("string"), b = v("function"), Re = v("number"), G = (e) => e !== null && typeof e == "object", Ge = (e) => e === !0 || e === !1, J = (e) => {
  if (K(e) !== "object")
    return !1;
  const t = oe(e);
  return (t === null || t === Object.prototype || Object.getPrototypeOf(t) === null) && !(Symbol.toStringTag in e) && !(Symbol.iterator in e);
}, Xe = O("Date"), Qe = O("File"), Ze = O("Blob"), Ye = O("FileList"), et = (e) => G(e) && b(e.pipe), tt = (e) => {
  let t;
  return e && (typeof FormData == "function" && e instanceof FormData || b(e.append) && ((t = K(e)) === "formdata" || // detect form-data instance
  t === "object" && b(e.toString) && e.toString() === "[object FormData]"));
}, nt = O("URLSearchParams"), rt = (e) => e.trim ? e.trim() : e.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "");
function H(e, t, { allOwnKeys: n = !1 } = {}) {
  if (e === null || typeof e > "u")
    return;
  let r, s;
  if (typeof e != "object" && (e = [e]), _(e))
    for (r = 0, s = e.length; r < s; r++)
      t.call(null, e[r], r, e);
  else {
    const o = n ? Object.getOwnPropertyNames(e) : Object.keys(e), i = o.length;
    let c;
    for (r = 0; r < i; r++)
      c = o[r], t.call(null, e[c], c, e);
  }
}
function Te(e, t) {
  t = t.toLowerCase();
  const n = Object.keys(e);
  let r = n.length, s;
  for (; r-- > 0; )
    if (s = n[r], t === s.toLowerCase())
      return s;
  return null;
}
const Ne = typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : global, xe = (e) => !j(e) && e !== Ne;
function te() {
  const { caseless: e } = xe(this) && this || {}, t = {}, n = (r, s) => {
    const o = e && Te(t, s) || s;
    J(t[o]) && J(r) ? t[o] = te(t[o], r) : J(r) ? t[o] = te({}, r) : _(r) ? t[o] = r.slice() : t[o] = r;
  };
  for (let r = 0, s = arguments.length; r < s; r++)
    arguments[r] && H(arguments[r], n);
  return t;
}
const st = (e, t, n, { allOwnKeys: r } = {}) => (H(t, (s, o) => {
  n && b(s) ? e[o] = ge(s, n) : e[o] = s;
}, { allOwnKeys: r }), e), ot = (e) => (e.charCodeAt(0) === 65279 && (e = e.slice(1)), e), it = (e, t, n, r) => {
  e.prototype = Object.create(t.prototype, r), e.prototype.constructor = e, Object.defineProperty(e, "super", {
    value: t.prototype
  }), n && Object.assign(e.prototype, n);
}, at = (e, t, n, r) => {
  let s, o, i;
  const c = {};
  if (t = t || {}, e == null)
    return t;
  do {
    for (s = Object.getOwnPropertyNames(e), o = s.length; o-- > 0; )
      i = s[o], (!r || r(i, e, t)) && !c[i] && (t[i] = e[i], c[i] = !0);
    e = n !== !1 && oe(e);
  } while (e && (!n || n(e, t)) && e !== Object.prototype);
  return t;
}, ct = (e, t, n) => {
  e = String(e), (n === void 0 || n > e.length) && (n = e.length), n -= t.length;
  const r = e.indexOf(t, n);
  return r !== -1 && r === n;
}, ut = (e) => {
  if (!e)
    return null;
  if (_(e))
    return e;
  let t = e.length;
  if (!Re(t))
    return null;
  const n = new Array(t);
  for (; t-- > 0; )
    n[t] = e[t];
  return n;
}, lt = /* @__PURE__ */ ((e) => (t) => e && t instanceof e)(typeof Uint8Array < "u" && oe(Uint8Array)), ft = (e, t) => {
  const r = (e && e[Symbol.iterator]).call(e);
  let s;
  for (; (s = r.next()) && !s.done; ) {
    const o = s.value;
    t.call(e, o[0], o[1]);
  }
}, dt = (e, t) => {
  let n;
  const r = [];
  for (; (n = e.exec(t)) !== null; )
    r.push(n);
  return r;
}, pt = O("HTMLFormElement"), ht = (e) => e.toLowerCase().replace(
  /[-_\s]([a-z\d])(\w*)/g,
  function(n, r, s) {
    return r.toUpperCase() + s;
  }
), le = (({ hasOwnProperty: e }) => (t, n) => e.call(t, n))(Object.prototype), mt = O("RegExp"), Ce = (e, t) => {
  const n = Object.getOwnPropertyDescriptors(e), r = {};
  H(n, (s, o) => {
    t(s, o, e) !== !1 && (r[o] = s);
  }), Object.defineProperties(e, r);
}, yt = (e) => {
  Ce(e, (t, n) => {
    if (b(e) && ["arguments", "caller", "callee"].indexOf(n) !== -1)
      return !1;
    const r = e[n];
    if (b(r)) {
      if (t.enumerable = !1, "writable" in t) {
        t.writable = !1;
        return;
      }
      t.set || (t.set = () => {
        throw Error("Can not rewrite read-only method '" + n + "'");
      });
    }
  });
}, wt = (e, t) => {
  const n = {}, r = (s) => {
    s.forEach((o) => {
      n[o] = !0;
    });
  };
  return _(e) ? r(e) : r(String(e).split(t)), n;
}, Et = () => {
}, bt = (e, t) => (e = +e, Number.isFinite(e) ? e : t), Q = "abcdefghijklmnopqrstuvwxyz", fe = "0123456789", Pe = {
  DIGIT: fe,
  ALPHA: Q,
  ALPHA_DIGIT: Q + Q.toUpperCase() + fe
}, St = (e = 16, t = Pe.ALPHA_DIGIT) => {
  let n = "";
  const { length: r } = t;
  for (; e--; )
    n += t[Math.random() * r | 0];
  return n;
};
function At(e) {
  return !!(e && b(e.append) && e[Symbol.toStringTag] === "FormData" && e[Symbol.iterator]);
}
const gt = (e) => {
  const t = new Array(10), n = (r, s) => {
    if (G(r)) {
      if (t.indexOf(r) >= 0)
        return;
      if (!("toJSON" in r)) {
        t[s] = r;
        const o = _(r) ? [] : {};
        return H(r, (i, c) => {
          const d = n(i, s + 1);
          !j(d) && (o[c] = d);
        }), t[s] = void 0, o;
      }
    }
    return r;
  };
  return n(e, 0);
}, Ot = O("AsyncFunction"), Rt = (e) => e && (G(e) || b(e)) && b(e.then) && b(e.catch), a = {
  isArray: _,
  isArrayBuffer: Oe,
  isBuffer: Ve,
  isFormData: tt,
  isArrayBufferView: Ke,
  isString: ve,
  isNumber: Re,
  isBoolean: Ge,
  isObject: G,
  isPlainObject: J,
  isUndefined: j,
  isDate: Xe,
  isFile: Qe,
  isBlob: Ze,
  isRegExp: mt,
  isFunction: b,
  isStream: et,
  isURLSearchParams: nt,
  isTypedArray: lt,
  isFileList: Ye,
  forEach: H,
  merge: te,
  extend: st,
  trim: rt,
  stripBOM: ot,
  inherits: it,
  toFlatObject: at,
  kindOf: K,
  kindOfTest: O,
  endsWith: ct,
  toArray: ut,
  forEachEntry: ft,
  matchAll: dt,
  isHTMLForm: pt,
  hasOwnProperty: le,
  hasOwnProp: le,
  // an alias to avoid ESLint no-prototype-builtins detection
  reduceDescriptors: Ce,
  freezeMethods: yt,
  toObjectSet: wt,
  toCamelCase: ht,
  noop: Et,
  toFiniteNumber: bt,
  findKey: Te,
  global: Ne,
  isContextDefined: xe,
  ALPHABET: Pe,
  generateString: St,
  isSpecCompliantForm: At,
  toJSONObject: gt,
  isAsyncFn: Ot,
  isThenable: Rt
};
function m(e, t, n, r, s) {
  Error.call(this), Error.captureStackTrace ? Error.captureStackTrace(this, this.constructor) : this.stack = new Error().stack, this.message = e, this.name = "AxiosError", t && (this.code = t), n && (this.config = n), r && (this.request = r), s && (this.response = s);
}
a.inherits(m, Error, {
  toJSON: function() {
    return {
      // Standard
      message: this.message,
      name: this.name,
      // Microsoft
      description: this.description,
      number: this.number,
      // Mozilla
      fileName: this.fileName,
      lineNumber: this.lineNumber,
      columnNumber: this.columnNumber,
      stack: this.stack,
      // Axios
      config: a.toJSONObject(this.config),
      code: this.code,
      status: this.response && this.response.status ? this.response.status : null
    };
  }
});
const _e = m.prototype, Be = {};
[
  "ERR_BAD_OPTION_VALUE",
  "ERR_BAD_OPTION",
  "ECONNABORTED",
  "ETIMEDOUT",
  "ERR_NETWORK",
  "ERR_FR_TOO_MANY_REDIRECTS",
  "ERR_DEPRECATED",
  "ERR_BAD_RESPONSE",
  "ERR_BAD_REQUEST",
  "ERR_CANCELED",
  "ERR_NOT_SUPPORT",
  "ERR_INVALID_URL"
  // eslint-disable-next-line func-names
].forEach((e) => {
  Be[e] = { value: e };
});
Object.defineProperties(m, Be);
Object.defineProperty(_e, "isAxiosError", { value: !0 });
m.from = (e, t, n, r, s, o) => {
  const i = Object.create(_e);
  return a.toFlatObject(e, i, function(d) {
    return d !== Error.prototype;
  }, (c) => c !== "isAxiosError"), m.call(i, e.message, t, n, r, s), i.cause = e, i.name = e.name, o && Object.assign(i, o), i;
};
const Tt = null;
function ne(e) {
  return a.isPlainObject(e) || a.isArray(e);
}
function Fe(e) {
  return a.endsWith(e, "[]") ? e.slice(0, -2) : e;
}
function de(e, t, n) {
  return e ? e.concat(t).map(function(s, o) {
    return s = Fe(s), !n && o ? "[" + s + "]" : s;
  }).join(n ? "." : "") : t;
}
function Nt(e) {
  return a.isArray(e) && !e.some(ne);
}
const xt = a.toFlatObject(a, {}, null, function(t) {
  return /^is[A-Z]/.test(t);
});
function X(e, t, n) {
  if (!a.isObject(e))
    throw new TypeError("target must be an object");
  t = t || new FormData(), n = a.toFlatObject(n, {
    metaTokens: !0,
    dots: !1,
    indexes: !1
  }, !1, function(h, R) {
    return !a.isUndefined(R[h]);
  });
  const r = n.metaTokens, s = n.visitor || l, o = n.dots, i = n.indexes, d = (n.Blob || typeof Blob < "u" && Blob) && a.isSpecCompliantForm(t);
  if (!a.isFunction(s))
    throw new TypeError("visitor must be a function");
  function u(f) {
    if (f === null)
      return "";
    if (a.isDate(f))
      return f.toISOString();
    if (!d && a.isBlob(f))
      throw new m("Blob is not supported. Use a Buffer instead.");
    return a.isArrayBuffer(f) || a.isTypedArray(f) ? d && typeof Blob == "function" ? new Blob([f]) : Buffer.from(f) : f;
  }
  function l(f, h, R) {
    let A = f;
    if (f && !R && typeof f == "object") {
      if (a.endsWith(h, "{}"))
        h = r ? h : h.slice(0, -2), f = JSON.stringify(f);
      else if (a.isArray(f) && Nt(f) || (a.isFileList(f) || a.endsWith(h, "[]")) && (A = a.toArray(f)))
        return h = Fe(h), A.forEach(function(z, $e) {
          !(a.isUndefined(z) || z === null) && t.append(
            // eslint-disable-next-line no-nested-ternary
            i === !0 ? de([h], $e, o) : i === null ? h : h + "[]",
            u(z)
          );
        }), !1;
    }
    return ne(f) ? !0 : (t.append(de(R, h, o), u(f)), !1);
  }
  const p = [], E = Object.assign(xt, {
    defaultVisitor: l,
    convertValue: u,
    isVisitable: ne
  });
  function w(f, h) {
    if (!a.isUndefined(f)) {
      if (p.indexOf(f) !== -1)
        throw Error("Circular reference detected in " + h.join("."));
      p.push(f), a.forEach(f, function(A, C) {
        (!(a.isUndefined(A) || A === null) && s.call(
          t,
          A,
          a.isString(C) ? C.trim() : C,
          h,
          E
        )) === !0 && w(A, h ? h.concat(C) : [C]);
      }), p.pop();
    }
  }
  if (!a.isObject(e))
    throw new TypeError("data must be an object");
  return w(e), t;
}
function pe(e) {
  const t = {
    "!": "%21",
    "'": "%27",
    "(": "%28",
    ")": "%29",
    "~": "%7E",
    "%20": "+",
    "%00": "\0"
  };
  return encodeURIComponent(e).replace(/[!'()~]|%20|%00/g, function(r) {
    return t[r];
  });
}
function ie(e, t) {
  this._pairs = [], e && X(e, this, t);
}
const Ue = ie.prototype;
Ue.append = function(t, n) {
  this._pairs.push([t, n]);
};
Ue.toString = function(t) {
  const n = t ? function(r) {
    return t.call(this, r, pe);
  } : pe;
  return this._pairs.map(function(s) {
    return n(s[0]) + "=" + n(s[1]);
  }, "").join("&");
};
function Ct(e) {
  return encodeURIComponent(e).replace(/%3A/gi, ":").replace(/%24/g, "$").replace(/%2C/gi, ",").replace(/%20/g, "+").replace(/%5B/gi, "[").replace(/%5D/gi, "]");
}
function De(e, t, n) {
  if (!t)
    return e;
  const r = n && n.encode || Ct, s = n && n.serialize;
  let o;
  if (s ? o = s(t, n) : o = a.isURLSearchParams(t) ? t.toString() : new ie(t, n).toString(r), o) {
    const i = e.indexOf("#");
    i !== -1 && (e = e.slice(0, i)), e += (e.indexOf("?") === -1 ? "?" : "&") + o;
  }
  return e;
}
class he {
  constructor() {
    this.handlers = [];
  }
  /**
   * Add a new interceptor to the stack
   *
   * @param {Function} fulfilled The function to handle `then` for a `Promise`
   * @param {Function} rejected The function to handle `reject` for a `Promise`
   *
   * @return {Number} An ID used to remove interceptor later
   */
  use(t, n, r) {
    return this.handlers.push({
      fulfilled: t,
      rejected: n,
      synchronous: r ? r.synchronous : !1,
      runWhen: r ? r.runWhen : null
    }), this.handlers.length - 1;
  }
  /**
   * Remove an interceptor from the stack
   *
   * @param {Number} id The ID that was returned by `use`
   *
   * @returns {Boolean} `true` if the interceptor was removed, `false` otherwise
   */
  eject(t) {
    this.handlers[t] && (this.handlers[t] = null);
  }
  /**
   * Clear all interceptors from the stack
   *
   * @returns {void}
   */
  clear() {
    this.handlers && (this.handlers = []);
  }
  /**
   * Iterate over all the registered interceptors
   *
   * This method is particularly useful for skipping over any
   * interceptors that may have become `null` calling `eject`.
   *
   * @param {Function} fn The function to call for each interceptor
   *
   * @returns {void}
   */
  forEach(t) {
    a.forEach(this.handlers, function(r) {
      r !== null && t(r);
    });
  }
}
const Le = {
  silentJSONParsing: !0,
  forcedJSONParsing: !0,
  clarifyTimeoutError: !1
}, Pt = typeof URLSearchParams < "u" ? URLSearchParams : ie, _t = typeof FormData < "u" ? FormData : null, Bt = typeof Blob < "u" ? Blob : null, Ft = (() => {
  let e;
  return typeof navigator < "u" && ((e = navigator.product) === "ReactNative" || e === "NativeScript" || e === "NS") ? !1 : typeof window < "u" && typeof document < "u";
})(), Ut = typeof WorkerGlobalScope < "u" && // eslint-disable-next-line no-undef
self instanceof WorkerGlobalScope && typeof self.importScripts == "function", g = {
  classes: {
    URLSearchParams: Pt,
    FormData: _t,
    Blob: Bt
  },
  isStandardBrowserEnv: Ft,
  isStandardBrowserWebWorkerEnv: Ut,
  protocols: ["http", "https", "file", "blob", "url", "data"]
};
function Dt(e, t) {
  return X(e, new g.classes.URLSearchParams(), Object.assign({
    visitor: function(n, r, s, o) {
      return g.isNode && a.isBuffer(n) ? (this.append(r, n.toString("base64")), !1) : o.defaultVisitor.apply(this, arguments);
    }
  }, t));
}
function Lt(e) {
  return a.matchAll(/\w+|\[(\w*)]/g, e).map((t) => t[0] === "[]" ? "" : t[1] || t[0]);
}
function jt(e) {
  const t = {}, n = Object.keys(e);
  let r;
  const s = n.length;
  let o;
  for (r = 0; r < s; r++)
    o = n[r], t[o] = e[o];
  return t;
}
function je(e) {
  function t(n, r, s, o) {
    let i = n[o++];
    const c = Number.isFinite(+i), d = o >= n.length;
    return i = !i && a.isArray(s) ? s.length : i, d ? (a.hasOwnProp(s, i) ? s[i] = [s[i], r] : s[i] = r, !c) : ((!s[i] || !a.isObject(s[i])) && (s[i] = []), t(n, r, s[i], o) && a.isArray(s[i]) && (s[i] = jt(s[i])), !c);
  }
  if (a.isFormData(e) && a.isFunction(e.entries)) {
    const n = {};
    return a.forEachEntry(e, (r, s) => {
      t(Lt(r), s, n, 0);
    }), n;
  }
  return null;
}
const kt = {
  "Content-Type": void 0
};
function It(e, t, n) {
  if (a.isString(e))
    try {
      return (t || JSON.parse)(e), a.trim(e);
    } catch (r) {
      if (r.name !== "SyntaxError")
        throw r;
    }
  return (n || JSON.stringify)(e);
}
const B = {
  transitional: Le,
  adapter: ["xhr", "http"],
  transformRequest: [function(t, n) {
    const r = n.getContentType() || "", s = r.indexOf("application/json") > -1, o = a.isObject(t);
    if (o && a.isHTMLForm(t) && (t = new FormData(t)), a.isFormData(t))
      return s && s ? JSON.stringify(je(t)) : t;
    if (a.isArrayBuffer(t) || a.isBuffer(t) || a.isStream(t) || a.isFile(t) || a.isBlob(t))
      return t;
    if (a.isArrayBufferView(t))
      return t.buffer;
    if (a.isURLSearchParams(t))
      return n.setContentType("application/x-www-form-urlencoded;charset=utf-8", !1), t.toString();
    let c;
    if (o) {
      if (r.indexOf("application/x-www-form-urlencoded") > -1)
        return Dt(t, this.formSerializer).toString();
      if ((c = a.isFileList(t)) || r.indexOf("multipart/form-data") > -1) {
        const d = this.env && this.env.FormData;
        return X(
          c ? { "files[]": t } : t,
          d && new d(),
          this.formSerializer
        );
      }
    }
    return o || s ? (n.setContentType("application/json", !1), It(t)) : t;
  }],
  transformResponse: [function(t) {
    const n = this.transitional || B.transitional, r = n && n.forcedJSONParsing, s = this.responseType === "json";
    if (t && a.isString(t) && (r && !this.responseType || s)) {
      const i = !(n && n.silentJSONParsing) && s;
      try {
        return JSON.parse(t);
      } catch (c) {
        if (i)
          throw c.name === "SyntaxError" ? m.from(c, m.ERR_BAD_RESPONSE, this, null, this.response) : c;
      }
    }
    return t;
  }],
  /**
   * A timeout in milliseconds to abort a request. If set to 0 (default) a
   * timeout is not created.
   */
  timeout: 0,
  xsrfCookieName: "XSRF-TOKEN",
  xsrfHeaderName: "X-XSRF-TOKEN",
  maxContentLength: -1,
  maxBodyLength: -1,
  env: {
    FormData: g.classes.FormData,
    Blob: g.classes.Blob
  },
  validateStatus: function(t) {
    return t >= 200 && t < 300;
  },
  headers: {
    common: {
      Accept: "application/json, text/plain, */*"
    }
  }
};
a.forEach(["delete", "get", "head"], function(t) {
  B.headers[t] = {};
});
a.forEach(["post", "put", "patch"], function(t) {
  B.headers[t] = a.merge(kt);
});
const Mt = a.toObjectSet([
  "age",
  "authorization",
  "content-length",
  "content-type",
  "etag",
  "expires",
  "from",
  "host",
  "if-modified-since",
  "if-unmodified-since",
  "last-modified",
  "location",
  "max-forwards",
  "proxy-authorization",
  "referer",
  "retry-after",
  "user-agent"
]), qt = (e) => {
  const t = {};
  let n, r, s;
  return e && e.split(`
`).forEach(function(i) {
    s = i.indexOf(":"), n = i.substring(0, s).trim().toLowerCase(), r = i.substring(s + 1).trim(), !(!n || t[n] && Mt[n]) && (n === "set-cookie" ? t[n] ? t[n].push(r) : t[n] = [r] : t[n] = t[n] ? t[n] + ", " + r : r);
  }), t;
}, me = Symbol("internals");
function L(e) {
  return e && String(e).trim().toLowerCase();
}
function W(e) {
  return e === !1 || e == null ? e : a.isArray(e) ? e.map(W) : String(e);
}
function Ht(e) {
  const t = /* @__PURE__ */ Object.create(null), n = /([^\s,;=]+)\s*(?:=\s*([^,;]+))?/g;
  let r;
  for (; r = n.exec(e); )
    t[r[1]] = r[2];
  return t;
}
const $t = (e) => /^[-_a-zA-Z0-9^`|~,!#$%&'*+.]+$/.test(e.trim());
function Z(e, t, n, r, s) {
  if (a.isFunction(r))
    return r.call(this, t, n);
  if (s && (t = n), !!a.isString(t)) {
    if (a.isString(r))
      return t.indexOf(r) !== -1;
    if (a.isRegExp(r))
      return r.test(t);
  }
}
function zt(e) {
  return e.trim().toLowerCase().replace(/([a-z\d])(\w*)/g, (t, n, r) => n.toUpperCase() + r);
}
function Jt(e, t) {
  const n = a.toCamelCase(" " + t);
  ["get", "set", "has"].forEach((r) => {
    Object.defineProperty(e, r + n, {
      value: function(s, o, i) {
        return this[r].call(this, t, s, o, i);
      },
      configurable: !0
    });
  });
}
let S = class {
  constructor(t) {
    t && this.set(t);
  }
  set(t, n, r) {
    const s = this;
    function o(c, d, u) {
      const l = L(d);
      if (!l)
        throw new Error("header name must be a non-empty string");
      const p = a.findKey(s, l);
      (!p || s[p] === void 0 || u === !0 || u === void 0 && s[p] !== !1) && (s[p || d] = W(c));
    }
    const i = (c, d) => a.forEach(c, (u, l) => o(u, l, d));
    return a.isPlainObject(t) || t instanceof this.constructor ? i(t, n) : a.isString(t) && (t = t.trim()) && !$t(t) ? i(qt(t), n) : t != null && o(n, t, r), this;
  }
  get(t, n) {
    if (t = L(t), t) {
      const r = a.findKey(this, t);
      if (r) {
        const s = this[r];
        if (!n)
          return s;
        if (n === !0)
          return Ht(s);
        if (a.isFunction(n))
          return n.call(this, s, r);
        if (a.isRegExp(n))
          return n.exec(s);
        throw new TypeError("parser must be boolean|regexp|function");
      }
    }
  }
  has(t, n) {
    if (t = L(t), t) {
      const r = a.findKey(this, t);
      return !!(r && this[r] !== void 0 && (!n || Z(this, this[r], r, n)));
    }
    return !1;
  }
  delete(t, n) {
    const r = this;
    let s = !1;
    function o(i) {
      if (i = L(i), i) {
        const c = a.findKey(r, i);
        c && (!n || Z(r, r[c], c, n)) && (delete r[c], s = !0);
      }
    }
    return a.isArray(t) ? t.forEach(o) : o(t), s;
  }
  clear(t) {
    const n = Object.keys(this);
    let r = n.length, s = !1;
    for (; r--; ) {
      const o = n[r];
      (!t || Z(this, this[o], o, t, !0)) && (delete this[o], s = !0);
    }
    return s;
  }
  normalize(t) {
    const n = this, r = {};
    return a.forEach(this, (s, o) => {
      const i = a.findKey(r, o);
      if (i) {
        n[i] = W(s), delete n[o];
        return;
      }
      const c = t ? zt(o) : String(o).trim();
      c !== o && delete n[o], n[c] = W(s), r[c] = !0;
    }), this;
  }
  concat(...t) {
    return this.constructor.concat(this, ...t);
  }
  toJSON(t) {
    const n = /* @__PURE__ */ Object.create(null);
    return a.forEach(this, (r, s) => {
      r != null && r !== !1 && (n[s] = t && a.isArray(r) ? r.join(", ") : r);
    }), n;
  }
  [Symbol.iterator]() {
    return Object.entries(this.toJSON())[Symbol.iterator]();
  }
  toString() {
    return Object.entries(this.toJSON()).map(([t, n]) => t + ": " + n).join(`
`);
  }
  get [Symbol.toStringTag]() {
    return "AxiosHeaders";
  }
  static from(t) {
    return t instanceof this ? t : new this(t);
  }
  static concat(t, ...n) {
    const r = new this(t);
    return n.forEach((s) => r.set(s)), r;
  }
  static accessor(t) {
    const r = (this[me] = this[me] = {
      accessors: {}
    }).accessors, s = this.prototype;
    function o(i) {
      const c = L(i);
      r[c] || (Jt(s, i), r[c] = !0);
    }
    return a.isArray(t) ? t.forEach(o) : o(t), this;
  }
};
S.accessor(["Content-Type", "Content-Length", "Accept", "Accept-Encoding", "User-Agent", "Authorization"]);
a.freezeMethods(S.prototype);
a.freezeMethods(S);
function Y(e, t) {
  const n = this || B, r = t || n, s = S.from(r.headers);
  let o = r.data;
  return a.forEach(e, function(c) {
    o = c.call(n, o, s.normalize(), t ? t.status : void 0);
  }), s.normalize(), o;
}
function ke(e) {
  return !!(e && e.__CANCEL__);
}
function $(e, t, n) {
  m.call(this, e ?? "canceled", m.ERR_CANCELED, t, n), this.name = "CanceledError";
}
a.inherits($, m, {
  __CANCEL__: !0
});
function Wt(e, t, n) {
  const r = n.config.validateStatus;
  !n.status || !r || r(n.status) ? e(n) : t(new m(
    "Request failed with status code " + n.status,
    [m.ERR_BAD_REQUEST, m.ERR_BAD_RESPONSE][Math.floor(n.status / 100) - 4],
    n.config,
    n.request,
    n
  ));
}
const Vt = g.isStandardBrowserEnv ? (
  // Standard browser envs support document.cookie
  /* @__PURE__ */ function() {
    return {
      write: function(n, r, s, o, i, c) {
        const d = [];
        d.push(n + "=" + encodeURIComponent(r)), a.isNumber(s) && d.push("expires=" + new Date(s).toGMTString()), a.isString(o) && d.push("path=" + o), a.isString(i) && d.push("domain=" + i), c === !0 && d.push("secure"), document.cookie = d.join("; ");
      },
      read: function(n) {
        const r = document.cookie.match(new RegExp("(^|;\\s*)(" + n + ")=([^;]*)"));
        return r ? decodeURIComponent(r[3]) : null;
      },
      remove: function(n) {
        this.write(n, "", Date.now() - 864e5);
      }
    };
  }()
) : (
  // Non standard browser env (web workers, react-native) lack needed support.
  /* @__PURE__ */ function() {
    return {
      write: function() {
      },
      read: function() {
        return null;
      },
      remove: function() {
      }
    };
  }()
);
function Kt(e) {
  return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(e);
}
function vt(e, t) {
  return t ? e.replace(/\/+$/, "") + "/" + t.replace(/^\/+/, "") : e;
}
function Ie(e, t) {
  return e && !Kt(t) ? vt(e, t) : t;
}
const Gt = g.isStandardBrowserEnv ? (
  // Standard browser envs have full support of the APIs needed to test
  // whether the request URL is of the same origin as current location.
  function() {
    const t = /(msie|trident)/i.test(navigator.userAgent), n = document.createElement("a");
    let r;
    function s(o) {
      let i = o;
      return t && (n.setAttribute("href", i), i = n.href), n.setAttribute("href", i), {
        href: n.href,
        protocol: n.protocol ? n.protocol.replace(/:$/, "") : "",
        host: n.host,
        search: n.search ? n.search.replace(/^\?/, "") : "",
        hash: n.hash ? n.hash.replace(/^#/, "") : "",
        hostname: n.hostname,
        port: n.port,
        pathname: n.pathname.charAt(0) === "/" ? n.pathname : "/" + n.pathname
      };
    }
    return r = s(window.location.href), function(i) {
      const c = a.isString(i) ? s(i) : i;
      return c.protocol === r.protocol && c.host === r.host;
    };
  }()
) : (
  // Non standard browser envs (web workers, react-native) lack needed support.
  /* @__PURE__ */ function() {
    return function() {
      return !0;
    };
  }()
);
function Xt(e) {
  const t = /^([-+\w]{1,25})(:?\/\/|:)/.exec(e);
  return t && t[1] || "";
}
function Qt(e, t) {
  e = e || 10;
  const n = new Array(e), r = new Array(e);
  let s = 0, o = 0, i;
  return t = t !== void 0 ? t : 1e3, function(d) {
    const u = Date.now(), l = r[o];
    i || (i = u), n[s] = d, r[s] = u;
    let p = o, E = 0;
    for (; p !== s; )
      E += n[p++], p = p % e;
    if (s = (s + 1) % e, s === o && (o = (o + 1) % e), u - i < t)
      return;
    const w = l && u - l;
    return w ? Math.round(E * 1e3 / w) : void 0;
  };
}
function ye(e, t) {
  let n = 0;
  const r = Qt(50, 250);
  return (s) => {
    const o = s.loaded, i = s.lengthComputable ? s.total : void 0, c = o - n, d = r(c), u = o <= i;
    n = o;
    const l = {
      loaded: o,
      total: i,
      progress: i ? o / i : void 0,
      bytes: c,
      rate: d || void 0,
      estimated: d && i && u ? (i - o) / d : void 0,
      event: s
    };
    l[t ? "download" : "upload"] = !0, e(l);
  };
}
const Zt = typeof XMLHttpRequest < "u", Yt = Zt && function(e) {
  return new Promise(function(n, r) {
    let s = e.data;
    const o = S.from(e.headers).normalize(), i = e.responseType;
    let c;
    function d() {
      e.cancelToken && e.cancelToken.unsubscribe(c), e.signal && e.signal.removeEventListener("abort", c);
    }
    a.isFormData(s) && (g.isStandardBrowserEnv || g.isStandardBrowserWebWorkerEnv ? o.setContentType(!1) : o.setContentType("multipart/form-data;", !1));
    let u = new XMLHttpRequest();
    if (e.auth) {
      const w = e.auth.username || "", f = e.auth.password ? unescape(encodeURIComponent(e.auth.password)) : "";
      o.set("Authorization", "Basic " + btoa(w + ":" + f));
    }
    const l = Ie(e.baseURL, e.url);
    u.open(e.method.toUpperCase(), De(l, e.params, e.paramsSerializer), !0), u.timeout = e.timeout;
    function p() {
      if (!u)
        return;
      const w = S.from(
        "getAllResponseHeaders" in u && u.getAllResponseHeaders()
      ), h = {
        data: !i || i === "text" || i === "json" ? u.responseText : u.response,
        status: u.status,
        statusText: u.statusText,
        headers: w,
        config: e,
        request: u
      };
      Wt(function(A) {
        n(A), d();
      }, function(A) {
        r(A), d();
      }, h), u = null;
    }
    if ("onloadend" in u ? u.onloadend = p : u.onreadystatechange = function() {
      !u || u.readyState !== 4 || u.status === 0 && !(u.responseURL && u.responseURL.indexOf("file:") === 0) || setTimeout(p);
    }, u.onabort = function() {
      u && (r(new m("Request aborted", m.ECONNABORTED, e, u)), u = null);
    }, u.onerror = function() {
      r(new m("Network Error", m.ERR_NETWORK, e, u)), u = null;
    }, u.ontimeout = function() {
      let f = e.timeout ? "timeout of " + e.timeout + "ms exceeded" : "timeout exceeded";
      const h = e.transitional || Le;
      e.timeoutErrorMessage && (f = e.timeoutErrorMessage), r(new m(
        f,
        h.clarifyTimeoutError ? m.ETIMEDOUT : m.ECONNABORTED,
        e,
        u
      )), u = null;
    }, g.isStandardBrowserEnv) {
      const w = (e.withCredentials || Gt(l)) && e.xsrfCookieName && Vt.read(e.xsrfCookieName);
      w && o.set(e.xsrfHeaderName, w);
    }
    s === void 0 && o.setContentType(null), "setRequestHeader" in u && a.forEach(o.toJSON(), function(f, h) {
      u.setRequestHeader(h, f);
    }), a.isUndefined(e.withCredentials) || (u.withCredentials = !!e.withCredentials), i && i !== "json" && (u.responseType = e.responseType), typeof e.onDownloadProgress == "function" && u.addEventListener("progress", ye(e.onDownloadProgress, !0)), typeof e.onUploadProgress == "function" && u.upload && u.upload.addEventListener("progress", ye(e.onUploadProgress)), (e.cancelToken || e.signal) && (c = (w) => {
      u && (r(!w || w.type ? new $(null, e, u) : w), u.abort(), u = null);
    }, e.cancelToken && e.cancelToken.subscribe(c), e.signal && (e.signal.aborted ? c() : e.signal.addEventListener("abort", c)));
    const E = Xt(l);
    if (E && g.protocols.indexOf(E) === -1) {
      r(new m("Unsupported protocol " + E + ":", m.ERR_BAD_REQUEST, e));
      return;
    }
    u.send(s || null);
  });
}, V = {
  http: Tt,
  xhr: Yt
};
a.forEach(V, (e, t) => {
  if (e) {
    try {
      Object.defineProperty(e, "name", { value: t });
    } catch {
    }
    Object.defineProperty(e, "adapterName", { value: t });
  }
});
const en = {
  getAdapter: (e) => {
    e = a.isArray(e) ? e : [e];
    const { length: t } = e;
    let n, r;
    for (let s = 0; s < t && (n = e[s], !(r = a.isString(n) ? V[n.toLowerCase()] : n)); s++)
      ;
    if (!r)
      throw r === !1 ? new m(
        `Adapter ${n} is not supported by the environment`,
        "ERR_NOT_SUPPORT"
      ) : new Error(
        a.hasOwnProp(V, n) ? `Adapter '${n}' is not available in the build` : `Unknown adapter '${n}'`
      );
    if (!a.isFunction(r))
      throw new TypeError("adapter is not a function");
    return r;
  },
  adapters: V
};
function ee(e) {
  if (e.cancelToken && e.cancelToken.throwIfRequested(), e.signal && e.signal.aborted)
    throw new $(null, e);
}
function we(e) {
  return ee(e), e.headers = S.from(e.headers), e.data = Y.call(
    e,
    e.transformRequest
  ), ["post", "put", "patch"].indexOf(e.method) !== -1 && e.headers.setContentType("application/x-www-form-urlencoded", !1), en.getAdapter(e.adapter || B.adapter)(e).then(function(r) {
    return ee(e), r.data = Y.call(
      e,
      e.transformResponse,
      r
    ), r.headers = S.from(r.headers), r;
  }, function(r) {
    return ke(r) || (ee(e), r && r.response && (r.response.data = Y.call(
      e,
      e.transformResponse,
      r.response
    ), r.response.headers = S.from(r.response.headers))), Promise.reject(r);
  });
}
const Ee = (e) => e instanceof S ? e.toJSON() : e;
function P(e, t) {
  t = t || {};
  const n = {};
  function r(u, l, p) {
    return a.isPlainObject(u) && a.isPlainObject(l) ? a.merge.call({ caseless: p }, u, l) : a.isPlainObject(l) ? a.merge({}, l) : a.isArray(l) ? l.slice() : l;
  }
  function s(u, l, p) {
    if (a.isUndefined(l)) {
      if (!a.isUndefined(u))
        return r(void 0, u, p);
    } else
      return r(u, l, p);
  }
  function o(u, l) {
    if (!a.isUndefined(l))
      return r(void 0, l);
  }
  function i(u, l) {
    if (a.isUndefined(l)) {
      if (!a.isUndefined(u))
        return r(void 0, u);
    } else
      return r(void 0, l);
  }
  function c(u, l, p) {
    if (p in t)
      return r(u, l);
    if (p in e)
      return r(void 0, u);
  }
  const d = {
    url: o,
    method: o,
    data: o,
    baseURL: i,
    transformRequest: i,
    transformResponse: i,
    paramsSerializer: i,
    timeout: i,
    timeoutMessage: i,
    withCredentials: i,
    adapter: i,
    responseType: i,
    xsrfCookieName: i,
    xsrfHeaderName: i,
    onUploadProgress: i,
    onDownloadProgress: i,
    decompress: i,
    maxContentLength: i,
    maxBodyLength: i,
    beforeRedirect: i,
    transport: i,
    httpAgent: i,
    httpsAgent: i,
    cancelToken: i,
    socketPath: i,
    responseEncoding: i,
    validateStatus: c,
    headers: (u, l) => s(Ee(u), Ee(l), !0)
  };
  return a.forEach(Object.keys(Object.assign({}, e, t)), function(l) {
    const p = d[l] || s, E = p(e[l], t[l], l);
    a.isUndefined(E) && p !== c || (n[l] = E);
  }), n;
}
const Me = "1.4.0", ae = {};
["object", "boolean", "number", "function", "string", "symbol"].forEach((e, t) => {
  ae[e] = function(r) {
    return typeof r === e || "a" + (t < 1 ? "n " : " ") + e;
  };
});
const be = {};
ae.transitional = function(t, n, r) {
  function s(o, i) {
    return "[Axios v" + Me + "] Transitional option '" + o + "'" + i + (r ? ". " + r : "");
  }
  return (o, i, c) => {
    if (t === !1)
      throw new m(
        s(i, " has been removed" + (n ? " in " + n : "")),
        m.ERR_DEPRECATED
      );
    return n && !be[i] && (be[i] = !0, console.warn(
      s(
        i,
        " has been deprecated since v" + n + " and will be removed in the near future"
      )
    )), t ? t(o, i, c) : !0;
  };
};
function tn(e, t, n) {
  if (typeof e != "object")
    throw new m("options must be an object", m.ERR_BAD_OPTION_VALUE);
  const r = Object.keys(e);
  let s = r.length;
  for (; s-- > 0; ) {
    const o = r[s], i = t[o];
    if (i) {
      const c = e[o], d = c === void 0 || i(c, o, e);
      if (d !== !0)
        throw new m("option " + o + " must be " + d, m.ERR_BAD_OPTION_VALUE);
      continue;
    }
    if (n !== !0)
      throw new m("Unknown option " + o, m.ERR_BAD_OPTION);
  }
}
const re = {
  assertOptions: tn,
  validators: ae
}, N = re.validators;
let x = class {
  constructor(t) {
    this.defaults = t, this.interceptors = {
      request: new he(),
      response: new he()
    };
  }
  /**
   * Dispatch a request
   *
   * @param {String|Object} configOrUrl The config specific for this request (merged with this.defaults)
   * @param {?Object} config
   *
   * @returns {Promise} The Promise to be fulfilled
   */
  request(t, n) {
    typeof t == "string" ? (n = n || {}, n.url = t) : n = t || {}, n = P(this.defaults, n);
    const { transitional: r, paramsSerializer: s, headers: o } = n;
    r !== void 0 && re.assertOptions(r, {
      silentJSONParsing: N.transitional(N.boolean),
      forcedJSONParsing: N.transitional(N.boolean),
      clarifyTimeoutError: N.transitional(N.boolean)
    }, !1), s != null && (a.isFunction(s) ? n.paramsSerializer = {
      serialize: s
    } : re.assertOptions(s, {
      encode: N.function,
      serialize: N.function
    }, !0)), n.method = (n.method || this.defaults.method || "get").toLowerCase();
    let i;
    i = o && a.merge(
      o.common,
      o[n.method]
    ), i && a.forEach(
      ["delete", "get", "head", "post", "put", "patch", "common"],
      (f) => {
        delete o[f];
      }
    ), n.headers = S.concat(i, o);
    const c = [];
    let d = !0;
    this.interceptors.request.forEach(function(h) {
      typeof h.runWhen == "function" && h.runWhen(n) === !1 || (d = d && h.synchronous, c.unshift(h.fulfilled, h.rejected));
    });
    const u = [];
    this.interceptors.response.forEach(function(h) {
      u.push(h.fulfilled, h.rejected);
    });
    let l, p = 0, E;
    if (!d) {
      const f = [we.bind(this), void 0];
      for (f.unshift.apply(f, c), f.push.apply(f, u), E = f.length, l = Promise.resolve(n); p < E; )
        l = l.then(f[p++], f[p++]);
      return l;
    }
    E = c.length;
    let w = n;
    for (p = 0; p < E; ) {
      const f = c[p++], h = c[p++];
      try {
        w = f(w);
      } catch (R) {
        h.call(this, R);
        break;
      }
    }
    try {
      l = we.call(this, w);
    } catch (f) {
      return Promise.reject(f);
    }
    for (p = 0, E = u.length; p < E; )
      l = l.then(u[p++], u[p++]);
    return l;
  }
  getUri(t) {
    t = P(this.defaults, t);
    const n = Ie(t.baseURL, t.url);
    return De(n, t.params, t.paramsSerializer);
  }
};
a.forEach(["delete", "get", "head", "options"], function(t) {
  x.prototype[t] = function(n, r) {
    return this.request(P(r || {}, {
      method: t,
      url: n,
      data: (r || {}).data
    }));
  };
});
a.forEach(["post", "put", "patch"], function(t) {
  function n(r) {
    return function(o, i, c) {
      return this.request(P(c || {}, {
        method: t,
        headers: r ? {
          "Content-Type": "multipart/form-data"
        } : {},
        url: o,
        data: i
      }));
    };
  }
  x.prototype[t] = n(), x.prototype[t + "Form"] = n(!0);
});
let nn = class qe {
  constructor(t) {
    if (typeof t != "function")
      throw new TypeError("executor must be a function.");
    let n;
    this.promise = new Promise(function(o) {
      n = o;
    });
    const r = this;
    this.promise.then((s) => {
      if (!r._listeners)
        return;
      let o = r._listeners.length;
      for (; o-- > 0; )
        r._listeners[o](s);
      r._listeners = null;
    }), this.promise.then = (s) => {
      let o;
      const i = new Promise((c) => {
        r.subscribe(c), o = c;
      }).then(s);
      return i.cancel = function() {
        r.unsubscribe(o);
      }, i;
    }, t(function(o, i, c) {
      r.reason || (r.reason = new $(o, i, c), n(r.reason));
    });
  }
  /**
   * Throws a `CanceledError` if cancellation has been requested.
   */
  throwIfRequested() {
    if (this.reason)
      throw this.reason;
  }
  /**
   * Subscribe to the cancel signal
   */
  subscribe(t) {
    if (this.reason) {
      t(this.reason);
      return;
    }
    this._listeners ? this._listeners.push(t) : this._listeners = [t];
  }
  /**
   * Unsubscribe from the cancel signal
   */
  unsubscribe(t) {
    if (!this._listeners)
      return;
    const n = this._listeners.indexOf(t);
    n !== -1 && this._listeners.splice(n, 1);
  }
  /**
   * Returns an object that contains a new `CancelToken` and a function that, when called,
   * cancels the `CancelToken`.
   */
  static source() {
    let t;
    return {
      token: new qe(function(s) {
        t = s;
      }),
      cancel: t
    };
  }
};
function rn(e) {
  return function(n) {
    return e.apply(null, n);
  };
}
function sn(e) {
  return a.isObject(e) && e.isAxiosError === !0;
}
const se = {
  Continue: 100,
  SwitchingProtocols: 101,
  Processing: 102,
  EarlyHints: 103,
  Ok: 200,
  Created: 201,
  Accepted: 202,
  NonAuthoritativeInformation: 203,
  NoContent: 204,
  ResetContent: 205,
  PartialContent: 206,
  MultiStatus: 207,
  AlreadyReported: 208,
  ImUsed: 226,
  MultipleChoices: 300,
  MovedPermanently: 301,
  Found: 302,
  SeeOther: 303,
  NotModified: 304,
  UseProxy: 305,
  Unused: 306,
  TemporaryRedirect: 307,
  PermanentRedirect: 308,
  BadRequest: 400,
  Unauthorized: 401,
  PaymentRequired: 402,
  Forbidden: 403,
  NotFound: 404,
  MethodNotAllowed: 405,
  NotAcceptable: 406,
  ProxyAuthenticationRequired: 407,
  RequestTimeout: 408,
  Conflict: 409,
  Gone: 410,
  LengthRequired: 411,
  PreconditionFailed: 412,
  PayloadTooLarge: 413,
  UriTooLong: 414,
  UnsupportedMediaType: 415,
  RangeNotSatisfiable: 416,
  ExpectationFailed: 417,
  ImATeapot: 418,
  MisdirectedRequest: 421,
  UnprocessableEntity: 422,
  Locked: 423,
  FailedDependency: 424,
  TooEarly: 425,
  UpgradeRequired: 426,
  PreconditionRequired: 428,
  TooManyRequests: 429,
  RequestHeaderFieldsTooLarge: 431,
  UnavailableForLegalReasons: 451,
  InternalServerError: 500,
  NotImplemented: 501,
  BadGateway: 502,
  ServiceUnavailable: 503,
  GatewayTimeout: 504,
  HttpVersionNotSupported: 505,
  VariantAlsoNegotiates: 506,
  InsufficientStorage: 507,
  LoopDetected: 508,
  NotExtended: 510,
  NetworkAuthenticationRequired: 511
};
Object.entries(se).forEach(([e, t]) => {
  se[t] = e;
});
function He(e) {
  const t = new x(e), n = ge(x.prototype.request, t);
  return a.extend(n, x.prototype, t, { allOwnKeys: !0 }), a.extend(n, t, null, { allOwnKeys: !0 }), n.create = function(s) {
    return He(P(e, s));
  }, n;
}
const y = He(B);
y.Axios = x;
y.CanceledError = $;
y.CancelToken = nn;
y.isCancel = ke;
y.VERSION = Me;
y.toFormData = X;
y.AxiosError = m;
y.Cancel = y.CanceledError;
y.all = function(t) {
  return Promise.all(t);
};
y.spread = rn;
y.isAxiosError = sn;
y.mergeConfig = P;
y.AxiosHeaders = S;
y.formToJSON = (e) => je(a.isHTMLForm(e) ? new FormData(e) : e);
y.HttpStatusCode = se;
y.default = y;
const {
  Axios: yn,
  AxiosError: wn,
  CanceledError: En,
  isCancel: bn,
  CancelToken: Sn,
  VERSION: An,
  all: gn,
  Cancel: On,
  isAxiosError: Rn,
  spread: Tn,
  toFormData: Nn,
  AxiosHeaders: on,
  HttpStatusCode: xn,
  formToJSON: Cn,
  mergeConfig: Pn
} = y, _n = (e) => (e.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i, (t, n, r, s) => "#" + n + n + r + r + s + s).substring(1).match(/.{2}/g) || []).map((t) => parseInt(t, 16)), Bn = (e, t, n = !0) => Object.fromEntries(t.filter(Boolean).reduce((r, s) => ((!n || s in e) && r.push([s, e[s]]), r), [])), Fn = (e, t, n = {}) => e.reduce((r, s) => (r[s[t]] = s, r), n);
var k, I, M, q;
class Un {
  constructor(t) {
    U(this, k, void 0);
    U(this, I, void 0);
    U(this, M, void 0);
    U(this, q, void 0);
    var o, i;
    const n = new Intl.NumberFormat(t).formatToParts(12345.6), r = [...new Intl.NumberFormat(t, {
      useGrouping: !1
    }).format(9876543210)].reverse(), s = new Map(r.map((c, d) => [c, d]));
    D(this, k, new RegExp(`[${(o = n.find((c) => c.type === "group")) == null ? void 0 : o.value}]`, "g")), D(this, I, new RegExp(`[${(i = n.find((c) => c.type === "decimal")) == null ? void 0 : i.value}]`)), D(this, M, new RegExp(`[${r.join("")}]`, "g")), D(this, q, (c) => String(s.get(c)));
  }
  parse(t) {
    const n = t.trim().replace(F(this, k), "").replace(F(this, I), ".").replace(F(this, M), F(this, q));
    return n ? Number(n) : NaN;
  }
}
k = new WeakMap(), I = new WeakMap(), M = new WeakMap(), q = new WeakMap();
const Dn = (e) => {
  const t = ["B", "KB", "MB", "GB", "TB"];
  let n = 0;
  for (; e > 1024; )
    e /= 1024, n++;
  return `${e.toFixed(2)} ${t[n]}`;
}, Se = async (e) => {
  var r;
  if (typeof ((r = e == null ? void 0 : e.headers) == null ? void 0 : r.Authorization) < "u")
    return {
      config: e,
      memberCode: null
    };
  if (!((e == null ? void 0 : e.__retry) === !0)) {
    const s = window.sessionStorage.getItem("oms_token");
    if (s !== null && s !== "")
      return y.defaults.headers.Authorization = `Bearer ${s}`, Object.assign(e, {
        headers: {
          Authorization: `Bearer ${s}`
        }
      }), {
        config: e,
        memberCode: null
      };
  }
  const {
    data: n
  } = await y.create().get("/ajax/oms/OMS_auth.cm", {
    withCredentials: !0
  });
  if (!/^SUCCESS$/i.test(n == null ? void 0 : n.msg))
    throw new Error(n == null ? void 0 : n.msg);
  return y.defaults.headers.Authorization = `Bearer ${n.token}`, window.sessionStorage.setItem("oms_token", n.token), Object.assign(e, {
    headers: {
      Authorization: `Bearer ${n.token}`
    }
  }), {
    config: e,
    memberCode: n.memberCode ?? null
  };
};
function an(e) {
  const t = new TextDecoder(), n = window.atob(e), r = new Uint8Array(new ArrayBuffer(n.length));
  for (let s = 0; s < n.length; s += 1)
    r[s] = n.charCodeAt(s);
  return t.decode(r);
}
const Ln = () => {
  const e = window.navigator.userAgent;
  return /NAVER/.test(e) && /Android/.test(e);
}, jn = (e) => Object.fromEntries(Object.entries(e).filter(([, t]) => typeof t < "u")), cn = (e) => {
  const n = new URL(e, window.location.origin).searchParams.get("back_url");
  if (n === null)
    return null;
  const r = an(n);
  return new URL(r, window.location.origin).href;
}, un = (e) => {
  const t = cn(e);
  return t !== null ? un(t) : e;
};
function kn(e) {
  return Object.fromEntries(Object.entries(e).map(([t, n]) => [t.trim(), n]));
}
function In(e) {
  return typeof e.cause < "u";
}
function Mn(e) {
  return e;
}
function qn(e) {
  return Array.isArray(e) && e.length === 0;
}
class ce extends Error {
  constructor(n, r) {
    var o;
    super(r ?? n.message);
    T(this, "config");
    T(this, "code");
    T(this, "request");
    T(this, "response");
    T(this, "isAxiosError");
    T(this, "cause");
    T(this, "toJSON");
    const s = ((o = n.response) == null ? void 0 : o.status) || 0;
    this.name = ce.getErrorName(s), this.stack = n.stack, this.config = n.config, this.code = n.code, this.request = n.request, this.response = n.response, this.isAxiosError = n.isAxiosError, this.cause = n.cause, this.toJSON = n.toJSON;
  }
  static getErrorName(n) {
    switch (n) {
      case 400:
        return "ApiBadRequestError";
      case 401:
        return "ApiUnauthorizedError";
      case 403:
        return "ApiForbiddenError";
      case 404:
        return "ApiNotFoundError";
      case 405:
        return "ApiMethodNotAllowedError";
      case 500:
        return "ApiInternalServerError";
      case 503:
        return "ApiTimeOutError";
    }
    return `ApiError${n}`;
  }
}
const Hn = (e) => {
  if (!e)
    return "";
  const t = e.trimStart().startsWith("+"), n = e.replace(/[^0-9-]/g, "");
  return t ? `+${n}` : n;
}, Ae = (e) => {
  const t = e.replace(/[^0-9]/g, "");
  return t.startsWith("820") ? t.substring(2) : t.startsWith("82") ? `0${t.substring(2)}` : t;
}, $n = (e) => {
  if (!e)
    return;
  if (!e.trim().startsWith("+"))
    return Ae(e);
  const t = e.replace(/[^0-9]/g, "");
  if (t)
    return t.startsWith("82") || t.startsWith("0") ? Ae(e) : `+${t}`;
}, ln = (e) => {
  var r, s, o, i;
  const t = window.LOCALIZE[`E_${(r = e.data) == null ? void 0 : r.code}`];
  if (typeof t == "function")
    return t();
  const n = ((s = e.data) == null ? void 0 : s.message) ?? ((o = e.data) == null ? void 0 : o.msg) ?? ((i = e.data) == null ? void 0 : i.resultCode);
  if (!(Array.isArray(n) && n.length <= 0))
    return Array.isArray(n) && n.length > 0 ? n.join(", ") : n;
};
function fn() {
  const e = window.localStorage.getItem("__bs_imweb") ?? "{}";
  try {
    const t = JSON.parse(e);
    return {
      "imweb-device-id": t.device_id,
      "imweb-session-id": t.session_id,
      "imweb-distinct-id": t.distinct_id,
      "imweb-platform": t.platform,
      "imweb-os": t.os,
      "imweb-browser-name": t.browser_name,
      "imweb-browser-version": t.browser_version,
      "imweb-language": t.language
    };
  } catch {
    return {};
  }
}
async function dn() {
  const e = {
    withCredentials: !0,
    headers: new on({
      "Content-Type": "application/json"
    }),
    validateStatus: (t) => ![401, 403].includes(t)
  };
  Object.assign(y.defaults, e), y.interceptors.request.use((t) => ({
    ...t,
    headers: {
      ...t.headers,
      ...fn()
    }
  })), y.interceptors.request.use(async (t) => {
    const {
      config: n
    } = await Se(t);
    return n;
  }), y.interceptors.response.use(
    (t) => {
      var r, s;
      const n = ln(t);
      if (
        // @ts-ignore
        !(t.config.__bypassAlert ?? !1) && typeof n == "string" && !/^SUCCESS$/i.test(n)
      )
        throw new Error(n, {
          cause: t.data
        });
      if (((r = t.config.method) == null ? void 0 : r.toUpperCase()) === "GET" && ((s = t.config.url) != null && s.includes("/ajax/oms/")) && (typeof t.data != "object" || t.data === null))
        throw new Error("Invalid OMS response", {
          cause: {
            statusCode: 502
          }
        });
      return t;
    },
    async (t) => {
      var n;
      if (y.isAxiosError(t)) {
        if ([401, 403].includes(((n = t.response) == null ? void 0 : n.status) ?? 500)) {
          if (typeof t.config < "u" && "__retry" in t.config)
            return Promise.reject(t);
          typeof t.config < "u" && (Object.assign(t.config, {
            __retry: !0
          }), Object.assign(t.config, {
            headers: {
              Authorization: void 0
            }
          }));
          const {
            config: s
          } = await Se(t.config ?? e);
          return y.request(s);
        }
        const r = new ce(t);
        return Promise.reject(r);
      }
      return Promise.reject(t);
    },
    // @ts-ignore
    {
      // @ts-ignore
      runWhen: (t) => typeof t.__bypassAlert > "u"
    }
  ), window.document.getElementById("oms-shop-payment") !== null && (import("./prefetch-Ce3lDZlN.js").then(({
    prefetchShopPaymentQueries: t
  }) => {
    t();
  }), import("./main-qTHQ2Qm6.js")), window.document.getElementById("oms-shop-payment-complete") !== null && import("./main-2Bu99Q0H.js"), window.document.getElementById("oms-my-page-order-subscription") !== null && import("./main-BdPs9ztC.js"), window.document.getElementById("oms-gift-received") !== null && import("./main-DOlpPdPi.js").then((t) => t.m);
}
dn().catch(console.error);
export {
  Un as N,
  y as a,
  Fn as b,
  an as c,
  qn as d,
  In as e,
  Dn as f,
  un as g,
  _n as h,
  Ln as i,
  $n as n,
  Bn as p,
  Mn as q,
  jn as r,
  Hn as s,
  kn as t
};
