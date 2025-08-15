var Hl = Object.defineProperty;
var Ul = (e, t, n) => t in e ? Hl(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n;
var Se = (e, t, n) => Ul(e, typeof t != "symbol" ? t + "" : t, n);
/**
* @vue/shared v3.5.18
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
/*! #__NO_SIDE_EFFECTS__ */
// @__NO_SIDE_EFFECTS__
function wr(e) {
  const t = /* @__PURE__ */ Object.create(null);
  for (const n of e.split(",")) t[n] = 1;
  return (n) => n in t;
}
const Ce = {}, _n = [], At = () => {
}, jl = () => !1, bs = (e) => e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 && // uppercase letter
(e.charCodeAt(2) > 122 || e.charCodeAt(2) < 97), kr = (e) => e.startsWith("onUpdate:"), Ke = Object.assign, xr = (e, t) => {
  const n = e.indexOf(t);
  n > -1 && e.splice(n, 1);
}, Wl = Object.prototype.hasOwnProperty, _e = (e, t) => Wl.call(e, t), J = Array.isArray, yn = (e) => ws(e) === "[object Map]", no = (e) => ws(e) === "[object Set]", Q = (e) => typeof e == "function", De = (e) => typeof e == "string", tn = (e) => typeof e == "symbol", $e = (e) => e !== null && typeof e == "object", so = (e) => ($e(e) || Q(e)) && Q(e.then) && Q(e.catch), ro = Object.prototype.toString, ws = (e) => ro.call(e), zl = (e) => ws(e).slice(8, -1), io = (e) => ws(e) === "[object Object]", Sr = (e) => De(e) && e !== "NaN" && e[0] !== "-" && "" + parseInt(e, 10) === e, Ln = /* @__PURE__ */ wr(
  // the leading comma is intentional so empty string "" is also included
  ",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"
), ks = (e) => {
  const t = /* @__PURE__ */ Object.create(null);
  return (n) => t[n] || (t[n] = e(n));
}, Kl = /-(\w)/g, Qt = ks(
  (e) => e.replace(Kl, (t, n) => n ? n.toUpperCase() : "")
), Zl = /\B([A-Z])/g, nn = ks(
  (e) => e.replace(Zl, "-$1").toLowerCase()
), oo = ks((e) => e.charAt(0).toUpperCase() + e.slice(1)), Ms = ks(
  (e) => e ? `on${oo(e)}` : ""
), Yt = (e, t) => !Object.is(e, t), es = (e, ...t) => {
  for (let n = 0; n < e.length; n++)
    e[n](...t);
}, er = (e, t, n, s = !1) => {
  Object.defineProperty(e, t, {
    configurable: !0,
    enumerable: !1,
    writable: s,
    value: n
  });
}, tr = (e) => {
  const t = parseFloat(e);
  return isNaN(t) ? e : t;
};
let pi;
const xs = () => pi || (pi = typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : typeof global < "u" ? global : {});
function be(e) {
  if (J(e)) {
    const t = {};
    for (let n = 0; n < e.length; n++) {
      const s = e[n], r = De(s) ? Ql(s) : be(s);
      if (r)
        for (const i in r)
          t[i] = r[i];
    }
    return t;
  } else if (De(e) || $e(e))
    return e;
}
const Gl = /;(?![^(]*\))/g, Yl = /:([^]+)/, Jl = /\/\*[^]*?\*\//g;
function Ql(e) {
  const t = {};
  return e.replace(Jl, "").split(Gl).forEach((n) => {
    if (n) {
      const s = n.split(Yl);
      s.length > 1 && (t[s[0].trim()] = s[1].trim());
    }
  }), t;
}
function Le(e) {
  let t = "";
  if (De(e))
    t = e;
  else if (J(e))
    for (let n = 0; n < e.length; n++) {
      const s = Le(e[n]);
      s && (t += s + " ");
    }
  else if ($e(e))
    for (const n in e)
      e[n] && (t += n + " ");
  return t.trim();
}
const Xl = "itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly", ea = /* @__PURE__ */ wr(Xl);
function lo(e) {
  return !!e || e === "";
}
const ao = (e) => !!(e && e.__v_isRef === !0), ae = (e) => De(e) ? e : e == null ? "" : J(e) || $e(e) && (e.toString === ro || !Q(e.toString)) ? ao(e) ? ae(e.value) : JSON.stringify(e, co, 2) : String(e), co = (e, t) => ao(t) ? co(e, t.value) : yn(t) ? {
  [`Map(${t.size})`]: [...t.entries()].reduce(
    (n, [s, r], i) => (n[Ds(s, i) + " =>"] = r, n),
    {}
  )
} : no(t) ? {
  [`Set(${t.size})`]: [...t.values()].map((n) => Ds(n))
} : tn(t) ? Ds(t) : $e(t) && !J(t) && !io(t) ? String(t) : t, Ds = (e, t = "") => {
  var n;
  return (
    // Symbol.description in es2019+ so we need to cast here to pass
    // the lib: es2016 check
    tn(e) ? `Symbol(${(n = e.description) != null ? n : t})` : e
  );
};
/**
* @vue/reactivity v3.5.18
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
let nt;
class ta {
  constructor(t = !1) {
    this.detached = t, this._active = !0, this._on = 0, this.effects = [], this.cleanups = [], this._isPaused = !1, this.parent = nt, !t && nt && (this.index = (nt.scopes || (nt.scopes = [])).push(
      this
    ) - 1);
  }
  get active() {
    return this._active;
  }
  pause() {
    if (this._active) {
      this._isPaused = !0;
      let t, n;
      if (this.scopes)
        for (t = 0, n = this.scopes.length; t < n; t++)
          this.scopes[t].pause();
      for (t = 0, n = this.effects.length; t < n; t++)
        this.effects[t].pause();
    }
  }
  /**
   * Resumes the effect scope, including all child scopes and effects.
   */
  resume() {
    if (this._active && this._isPaused) {
      this._isPaused = !1;
      let t, n;
      if (this.scopes)
        for (t = 0, n = this.scopes.length; t < n; t++)
          this.scopes[t].resume();
      for (t = 0, n = this.effects.length; t < n; t++)
        this.effects[t].resume();
    }
  }
  run(t) {
    if (this._active) {
      const n = nt;
      try {
        return nt = this, t();
      } finally {
        nt = n;
      }
    }
  }
  /**
   * This should only be called on non-detached scopes
   * @internal
   */
  on() {
    ++this._on === 1 && (this.prevScope = nt, nt = this);
  }
  /**
   * This should only be called on non-detached scopes
   * @internal
   */
  off() {
    this._on > 0 && --this._on === 0 && (nt = this.prevScope, this.prevScope = void 0);
  }
  stop(t) {
    if (this._active) {
      this._active = !1;
      let n, s;
      for (n = 0, s = this.effects.length; n < s; n++)
        this.effects[n].stop();
      for (this.effects.length = 0, n = 0, s = this.cleanups.length; n < s; n++)
        this.cleanups[n]();
      if (this.cleanups.length = 0, this.scopes) {
        for (n = 0, s = this.scopes.length; n < s; n++)
          this.scopes[n].stop(!0);
        this.scopes.length = 0;
      }
      if (!this.detached && this.parent && !t) {
        const r = this.parent.scopes.pop();
        r && r !== this && (this.parent.scopes[this.index] = r, r.index = this.index);
      }
      this.parent = void 0;
    }
  }
}
function na() {
  return nt;
}
let Ae;
const qs = /* @__PURE__ */ new WeakSet();
class uo {
  constructor(t) {
    this.fn = t, this.deps = void 0, this.depsTail = void 0, this.flags = 5, this.next = void 0, this.cleanup = void 0, this.scheduler = void 0, nt && nt.active && nt.effects.push(this);
  }
  pause() {
    this.flags |= 64;
  }
  resume() {
    this.flags & 64 && (this.flags &= -65, qs.has(this) && (qs.delete(this), this.trigger()));
  }
  /**
   * @internal
   */
  notify() {
    this.flags & 2 && !(this.flags & 32) || this.flags & 8 || ho(this);
  }
  run() {
    if (!(this.flags & 1))
      return this.fn();
    this.flags |= 2, gi(this), po(this);
    const t = Ae, n = bt;
    Ae = this, bt = !0;
    try {
      return this.fn();
    } finally {
      go(this), Ae = t, bt = n, this.flags &= -3;
    }
  }
  stop() {
    if (this.flags & 1) {
      for (let t = this.deps; t; t = t.nextDep)
        Er(t);
      this.deps = this.depsTail = void 0, gi(this), this.onStop && this.onStop(), this.flags &= -2;
    }
  }
  trigger() {
    this.flags & 64 ? qs.add(this) : this.scheduler ? this.scheduler() : this.runIfDirty();
  }
  /**
   * @internal
   */
  runIfDirty() {
    nr(this) && this.run();
  }
  get dirty() {
    return nr(this);
  }
}
let fo = 0, Pn, $n;
function ho(e, t = !1) {
  if (e.flags |= 8, t) {
    e.next = $n, $n = e;
    return;
  }
  e.next = Pn, Pn = e;
}
function Cr() {
  fo++;
}
function Tr() {
  if (--fo > 0)
    return;
  if ($n) {
    let t = $n;
    for ($n = void 0; t; ) {
      const n = t.next;
      t.next = void 0, t.flags &= -9, t = n;
    }
  }
  let e;
  for (; Pn; ) {
    let t = Pn;
    for (Pn = void 0; t; ) {
      const n = t.next;
      if (t.next = void 0, t.flags &= -9, t.flags & 1)
        try {
          t.trigger();
        } catch (s) {
          e || (e = s);
        }
      t = n;
    }
  }
  if (e) throw e;
}
function po(e) {
  for (let t = e.deps; t; t = t.nextDep)
    t.version = -1, t.prevActiveLink = t.dep.activeLink, t.dep.activeLink = t;
}
function go(e) {
  let t, n = e.depsTail, s = n;
  for (; s; ) {
    const r = s.prevDep;
    s.version === -1 ? (s === n && (n = r), Er(s), sa(s)) : t = s, s.dep.activeLink = s.prevActiveLink, s.prevActiveLink = void 0, s = r;
  }
  e.deps = t, e.depsTail = n;
}
function nr(e) {
  for (let t = e.deps; t; t = t.nextDep)
    if (t.dep.version !== t.version || t.dep.computed && (mo(t.dep.computed) || t.dep.version !== t.version))
      return !0;
  return !!e._dirty;
}
function mo(e) {
  if (e.flags & 4 && !(e.flags & 16) || (e.flags &= -17, e.globalVersion === qn) || (e.globalVersion = qn, !e.isSSR && e.flags & 128 && (!e.deps && !e._dirty || !nr(e))))
    return;
  e.flags |= 2;
  const t = e.dep, n = Ae, s = bt;
  Ae = e, bt = !0;
  try {
    po(e);
    const r = e.fn(e._value);
    (t.version === 0 || Yt(r, e._value)) && (e.flags |= 128, e._value = r, t.version++);
  } catch (r) {
    throw t.version++, r;
  } finally {
    Ae = n, bt = s, go(e), e.flags &= -3;
  }
}
function Er(e, t = !1) {
  const { dep: n, prevSub: s, nextSub: r } = e;
  if (s && (s.nextSub = r, e.prevSub = void 0), r && (r.prevSub = s, e.nextSub = void 0), n.subs === e && (n.subs = s, !s && n.computed)) {
    n.computed.flags &= -5;
    for (let i = n.computed.deps; i; i = i.nextDep)
      Er(i, !0);
  }
  !t && !--n.sc && n.map && n.map.delete(n.key);
}
function sa(e) {
  const { prevDep: t, nextDep: n } = e;
  t && (t.nextDep = n, e.prevDep = void 0), n && (n.prevDep = t, e.nextDep = void 0);
}
let bt = !0;
const _o = [];
function Dt() {
  _o.push(bt), bt = !1;
}
function qt() {
  const e = _o.pop();
  bt = e === void 0 ? !0 : e;
}
function gi(e) {
  const { cleanup: t } = e;
  if (e.cleanup = void 0, t) {
    const n = Ae;
    Ae = void 0;
    try {
      t();
    } finally {
      Ae = n;
    }
  }
}
let qn = 0;
class ra {
  constructor(t, n) {
    this.sub = t, this.dep = n, this.version = n.version, this.nextDep = this.prevDep = this.nextSub = this.prevSub = this.prevActiveLink = void 0;
  }
}
class Ar {
  // TODO isolatedDeclarations "__v_skip"
  constructor(t) {
    this.computed = t, this.version = 0, this.activeLink = void 0, this.subs = void 0, this.map = void 0, this.key = void 0, this.sc = 0, this.__v_skip = !0;
  }
  track(t) {
    if (!Ae || !bt || Ae === this.computed)
      return;
    let n = this.activeLink;
    if (n === void 0 || n.sub !== Ae)
      n = this.activeLink = new ra(Ae, this), Ae.deps ? (n.prevDep = Ae.depsTail, Ae.depsTail.nextDep = n, Ae.depsTail = n) : Ae.deps = Ae.depsTail = n, yo(n);
    else if (n.version === -1 && (n.version = this.version, n.nextDep)) {
      const s = n.nextDep;
      s.prevDep = n.prevDep, n.prevDep && (n.prevDep.nextDep = s), n.prevDep = Ae.depsTail, n.nextDep = void 0, Ae.depsTail.nextDep = n, Ae.depsTail = n, Ae.deps === n && (Ae.deps = s);
    }
    return n;
  }
  trigger(t) {
    this.version++, qn++, this.notify(t);
  }
  notify(t) {
    Cr();
    try {
      for (let n = this.subs; n; n = n.prevSub)
        n.sub.notify() && n.sub.dep.notify();
    } finally {
      Tr();
    }
  }
}
function yo(e) {
  if (e.dep.sc++, e.sub.flags & 4) {
    const t = e.dep.computed;
    if (t && !e.dep.subs) {
      t.flags |= 20;
      for (let s = t.deps; s; s = s.nextDep)
        yo(s);
    }
    const n = e.dep.subs;
    n !== e && (e.prevSub = n, n && (n.nextSub = e)), e.dep.subs = e;
  }
}
const sr = /* @__PURE__ */ new WeakMap(), fn = Symbol(
  ""
), rr = Symbol(
  ""
), Vn = Symbol(
  ""
);
function We(e, t, n) {
  if (bt && Ae) {
    let s = sr.get(e);
    s || sr.set(e, s = /* @__PURE__ */ new Map());
    let r = s.get(n);
    r || (s.set(n, r = new Ar()), r.map = s, r.key = n), r.track();
  }
}
function Ft(e, t, n, s, r, i) {
  const o = sr.get(e);
  if (!o) {
    qn++;
    return;
  }
  const l = (a) => {
    a && a.trigger();
  };
  if (Cr(), t === "clear")
    o.forEach(l);
  else {
    const a = J(e), u = a && Sr(n);
    if (a && n === "length") {
      const f = Number(s);
      o.forEach((_, b) => {
        (b === "length" || b === Vn || !tn(b) && b >= f) && l(_);
      });
    } else
      switch ((n !== void 0 || o.has(void 0)) && l(o.get(n)), u && l(o.get(Vn)), t) {
        case "add":
          a ? u && l(o.get("length")) : (l(o.get(fn)), yn(e) && l(o.get(rr)));
          break;
        case "delete":
          a || (l(o.get(fn)), yn(e) && l(o.get(rr)));
          break;
        case "set":
          yn(e) && l(o.get(fn));
          break;
      }
  }
  Tr();
}
function pn(e) {
  const t = me(e);
  return t === e ? t : (We(t, "iterate", Vn), dt(e) ? t : t.map(Ue));
}
function Ss(e) {
  return We(e = me(e), "iterate", Vn), e;
}
const ia = {
  __proto__: null,
  [Symbol.iterator]() {
    return Vs(this, Symbol.iterator, Ue);
  },
  concat(...e) {
    return pn(this).concat(
      ...e.map((t) => J(t) ? pn(t) : t)
    );
  },
  entries() {
    return Vs(this, "entries", (e) => (e[1] = Ue(e[1]), e));
  },
  every(e, t) {
    return Pt(this, "every", e, t, void 0, arguments);
  },
  filter(e, t) {
    return Pt(this, "filter", e, t, (n) => n.map(Ue), arguments);
  },
  find(e, t) {
    return Pt(this, "find", e, t, Ue, arguments);
  },
  findIndex(e, t) {
    return Pt(this, "findIndex", e, t, void 0, arguments);
  },
  findLast(e, t) {
    return Pt(this, "findLast", e, t, Ue, arguments);
  },
  findLastIndex(e, t) {
    return Pt(this, "findLastIndex", e, t, void 0, arguments);
  },
  // flat, flatMap could benefit from ARRAY_ITERATE but are not straight-forward to implement
  forEach(e, t) {
    return Pt(this, "forEach", e, t, void 0, arguments);
  },
  includes(...e) {
    return Hs(this, "includes", e);
  },
  indexOf(...e) {
    return Hs(this, "indexOf", e);
  },
  join(e) {
    return pn(this).join(e);
  },
  // keys() iterator only reads `length`, no optimisation required
  lastIndexOf(...e) {
    return Hs(this, "lastIndexOf", e);
  },
  map(e, t) {
    return Pt(this, "map", e, t, void 0, arguments);
  },
  pop() {
    return Sn(this, "pop");
  },
  push(...e) {
    return Sn(this, "push", e);
  },
  reduce(e, ...t) {
    return mi(this, "reduce", e, t);
  },
  reduceRight(e, ...t) {
    return mi(this, "reduceRight", e, t);
  },
  shift() {
    return Sn(this, "shift");
  },
  // slice could use ARRAY_ITERATE but also seems to beg for range tracking
  some(e, t) {
    return Pt(this, "some", e, t, void 0, arguments);
  },
  splice(...e) {
    return Sn(this, "splice", e);
  },
  toReversed() {
    return pn(this).toReversed();
  },
  toSorted(e) {
    return pn(this).toSorted(e);
  },
  toSpliced(...e) {
    return pn(this).toSpliced(...e);
  },
  unshift(...e) {
    return Sn(this, "unshift", e);
  },
  values() {
    return Vs(this, "values", Ue);
  }
};
function Vs(e, t, n) {
  const s = Ss(e), r = s[t]();
  return s !== e && !dt(e) && (r._next = r.next, r.next = () => {
    const i = r._next();
    return i.value && (i.value = n(i.value)), i;
  }), r;
}
const oa = Array.prototype;
function Pt(e, t, n, s, r, i) {
  const o = Ss(e), l = o !== e && !dt(e), a = o[t];
  if (a !== oa[t]) {
    const _ = a.apply(e, i);
    return l ? Ue(_) : _;
  }
  let u = n;
  o !== e && (l ? u = function(_, b) {
    return n.call(this, Ue(_), b, e);
  } : n.length > 2 && (u = function(_, b) {
    return n.call(this, _, b, e);
  }));
  const f = a.call(o, u, s);
  return l && r ? r(f) : f;
}
function mi(e, t, n, s) {
  const r = Ss(e);
  let i = n;
  return r !== e && (dt(e) ? n.length > 3 && (i = function(o, l, a) {
    return n.call(this, o, l, a, e);
  }) : i = function(o, l, a) {
    return n.call(this, o, Ue(l), a, e);
  }), r[t](i, ...s);
}
function Hs(e, t, n) {
  const s = me(e);
  We(s, "iterate", Vn);
  const r = s[t](...n);
  return (r === -1 || r === !1) && Lr(n[0]) ? (n[0] = me(n[0]), s[t](...n)) : r;
}
function Sn(e, t, n = []) {
  Dt(), Cr();
  const s = me(e)[t].apply(e, n);
  return Tr(), qt(), s;
}
const la = /* @__PURE__ */ wr("__proto__,__v_isRef,__isVue"), vo = new Set(
  /* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((e) => e !== "arguments" && e !== "caller").map((e) => Symbol[e]).filter(tn)
);
function aa(e) {
  tn(e) || (e = String(e));
  const t = me(this);
  return We(t, "has", e), t.hasOwnProperty(e);
}
class bo {
  constructor(t = !1, n = !1) {
    this._isReadonly = t, this._isShallow = n;
  }
  get(t, n, s) {
    if (n === "__v_skip") return t.__v_skip;
    const r = this._isReadonly, i = this._isShallow;
    if (n === "__v_isReactive")
      return !r;
    if (n === "__v_isReadonly")
      return r;
    if (n === "__v_isShallow")
      return i;
    if (n === "__v_raw")
      return s === (r ? i ? ya : So : i ? xo : ko).get(t) || // receiver is not the reactive proxy, but has the same prototype
      // this means the receiver is a user proxy of the reactive proxy
      Object.getPrototypeOf(t) === Object.getPrototypeOf(s) ? t : void 0;
    const o = J(t);
    if (!r) {
      let a;
      if (o && (a = ia[n]))
        return a;
      if (n === "hasOwnProperty")
        return aa;
    }
    const l = Reflect.get(
      t,
      n,
      // if this is a proxy wrapping a ref, return methods using the raw ref
      // as receiver so that we don't have to call `toRaw` on the ref in all
      // its class methods
      ze(t) ? t : s
    );
    return (tn(n) ? vo.has(n) : la(n)) || (r || We(t, "get", n), i) ? l : ze(l) ? o && Sr(n) ? l : l.value : $e(l) ? r ? Co(l) : Ir(l) : l;
  }
}
class wo extends bo {
  constructor(t = !1) {
    super(!1, t);
  }
  set(t, n, s, r) {
    let i = t[n];
    if (!this._isShallow) {
      const a = Xt(i);
      if (!dt(s) && !Xt(s) && (i = me(i), s = me(s)), !J(t) && ze(i) && !ze(s))
        return a ? !1 : (i.value = s, !0);
    }
    const o = J(t) && Sr(n) ? Number(n) < t.length : _e(t, n), l = Reflect.set(
      t,
      n,
      s,
      ze(t) ? t : r
    );
    return t === me(r) && (o ? Yt(s, i) && Ft(t, "set", n, s) : Ft(t, "add", n, s)), l;
  }
  deleteProperty(t, n) {
    const s = _e(t, n);
    t[n];
    const r = Reflect.deleteProperty(t, n);
    return r && s && Ft(t, "delete", n, void 0), r;
  }
  has(t, n) {
    const s = Reflect.has(t, n);
    return (!tn(n) || !vo.has(n)) && We(t, "has", n), s;
  }
  ownKeys(t) {
    return We(
      t,
      "iterate",
      J(t) ? "length" : fn
    ), Reflect.ownKeys(t);
  }
}
class ca extends bo {
  constructor(t = !1) {
    super(!0, t);
  }
  set(t, n) {
    return !0;
  }
  deleteProperty(t, n) {
    return !0;
  }
}
const ua = /* @__PURE__ */ new wo(), fa = /* @__PURE__ */ new ca(), ha = /* @__PURE__ */ new wo(!0);
const ir = (e) => e, Zn = (e) => Reflect.getPrototypeOf(e);
function da(e, t, n) {
  return function(...s) {
    const r = this.__v_raw, i = me(r), o = yn(i), l = e === "entries" || e === Symbol.iterator && o, a = e === "keys" && o, u = r[e](...s), f = n ? ir : t ? us : Ue;
    return !t && We(
      i,
      "iterate",
      a ? rr : fn
    ), {
      // iterator protocol
      next() {
        const { value: _, done: b } = u.next();
        return b ? { value: _, done: b } : {
          value: l ? [f(_[0]), f(_[1])] : f(_),
          done: b
        };
      },
      // iterable protocol
      [Symbol.iterator]() {
        return this;
      }
    };
  };
}
function Gn(e) {
  return function(...t) {
    return e === "delete" ? !1 : e === "clear" ? void 0 : this;
  };
}
function pa(e, t) {
  const n = {
    get(r) {
      const i = this.__v_raw, o = me(i), l = me(r);
      e || (Yt(r, l) && We(o, "get", r), We(o, "get", l));
      const { has: a } = Zn(o), u = t ? ir : e ? us : Ue;
      if (a.call(o, r))
        return u(i.get(r));
      if (a.call(o, l))
        return u(i.get(l));
      i !== o && i.get(r);
    },
    get size() {
      const r = this.__v_raw;
      return !e && We(me(r), "iterate", fn), Reflect.get(r, "size", r);
    },
    has(r) {
      const i = this.__v_raw, o = me(i), l = me(r);
      return e || (Yt(r, l) && We(o, "has", r), We(o, "has", l)), r === l ? i.has(r) : i.has(r) || i.has(l);
    },
    forEach(r, i) {
      const o = this, l = o.__v_raw, a = me(l), u = t ? ir : e ? us : Ue;
      return !e && We(a, "iterate", fn), l.forEach((f, _) => r.call(i, u(f), u(_), o));
    }
  };
  return Ke(
    n,
    e ? {
      add: Gn("add"),
      set: Gn("set"),
      delete: Gn("delete"),
      clear: Gn("clear")
    } : {
      add(r) {
        !t && !dt(r) && !Xt(r) && (r = me(r));
        const i = me(this);
        return Zn(i).has.call(i, r) || (i.add(r), Ft(i, "add", r, r)), this;
      },
      set(r, i) {
        !t && !dt(i) && !Xt(i) && (i = me(i));
        const o = me(this), { has: l, get: a } = Zn(o);
        let u = l.call(o, r);
        u || (r = me(r), u = l.call(o, r));
        const f = a.call(o, r);
        return o.set(r, i), u ? Yt(i, f) && Ft(o, "set", r, i) : Ft(o, "add", r, i), this;
      },
      delete(r) {
        const i = me(this), { has: o, get: l } = Zn(i);
        let a = o.call(i, r);
        a || (r = me(r), a = o.call(i, r)), l && l.call(i, r);
        const u = i.delete(r);
        return a && Ft(i, "delete", r, void 0), u;
      },
      clear() {
        const r = me(this), i = r.size !== 0, o = r.clear();
        return i && Ft(
          r,
          "clear",
          void 0,
          void 0
        ), o;
      }
    }
  ), [
    "keys",
    "values",
    "entries",
    Symbol.iterator
  ].forEach((r) => {
    n[r] = da(r, e, t);
  }), n;
}
function Rr(e, t) {
  const n = pa(e, t);
  return (s, r, i) => r === "__v_isReactive" ? !e : r === "__v_isReadonly" ? e : r === "__v_raw" ? s : Reflect.get(
    _e(n, r) && r in s ? n : s,
    r,
    i
  );
}
const ga = {
  get: /* @__PURE__ */ Rr(!1, !1)
}, ma = {
  get: /* @__PURE__ */ Rr(!1, !0)
}, _a = {
  get: /* @__PURE__ */ Rr(!0, !1)
};
const ko = /* @__PURE__ */ new WeakMap(), xo = /* @__PURE__ */ new WeakMap(), So = /* @__PURE__ */ new WeakMap(), ya = /* @__PURE__ */ new WeakMap();
function va(e) {
  switch (e) {
    case "Object":
    case "Array":
      return 1;
    case "Map":
    case "Set":
    case "WeakMap":
    case "WeakSet":
      return 2;
    default:
      return 0;
  }
}
function ba(e) {
  return e.__v_skip || !Object.isExtensible(e) ? 0 : va(zl(e));
}
function Ir(e) {
  return Xt(e) ? e : Or(
    e,
    !1,
    ua,
    ga,
    ko
  );
}
function wa(e) {
  return Or(
    e,
    !1,
    ha,
    ma,
    xo
  );
}
function Co(e) {
  return Or(
    e,
    !0,
    fa,
    _a,
    So
  );
}
function Or(e, t, n, s, r) {
  if (!$e(e) || e.__v_raw && !(t && e.__v_isReactive))
    return e;
  const i = ba(e);
  if (i === 0)
    return e;
  const o = r.get(e);
  if (o)
    return o;
  const l = new Proxy(
    e,
    i === 2 ? s : n
  );
  return r.set(e, l), l;
}
function vn(e) {
  return Xt(e) ? vn(e.__v_raw) : !!(e && e.__v_isReactive);
}
function Xt(e) {
  return !!(e && e.__v_isReadonly);
}
function dt(e) {
  return !!(e && e.__v_isShallow);
}
function Lr(e) {
  return e ? !!e.__v_raw : !1;
}
function me(e) {
  const t = e && e.__v_raw;
  return t ? me(t) : e;
}
function ka(e) {
  return !_e(e, "__v_skip") && Object.isExtensible(e) && er(e, "__v_skip", !0), e;
}
const Ue = (e) => $e(e) ? Ir(e) : e, us = (e) => $e(e) ? Co(e) : e;
function ze(e) {
  return e ? e.__v_isRef === !0 : !1;
}
function he(e) {
  return xa(e, !1);
}
function xa(e, t) {
  return ze(e) ? e : new Sa(e, t);
}
class Sa {
  constructor(t, n) {
    this.dep = new Ar(), this.__v_isRef = !0, this.__v_isShallow = !1, this._rawValue = n ? t : me(t), this._value = n ? t : Ue(t), this.__v_isShallow = n;
  }
  get value() {
    return this.dep.track(), this._value;
  }
  set value(t) {
    const n = this._rawValue, s = this.__v_isShallow || dt(t) || Xt(t);
    t = s ? t : me(t), Yt(t, n) && (this._rawValue = t, this._value = s ? t : Ue(t), this.dep.trigger());
  }
}
function D(e) {
  return ze(e) ? e.value : e;
}
const Ca = {
  get: (e, t, n) => t === "__v_raw" ? e : D(Reflect.get(e, t, n)),
  set: (e, t, n, s) => {
    const r = e[t];
    return ze(r) && !ze(n) ? (r.value = n, !0) : Reflect.set(e, t, n, s);
  }
};
function To(e) {
  return vn(e) ? e : new Proxy(e, Ca);
}
class Ta {
  constructor(t, n, s) {
    this.fn = t, this.setter = n, this._value = void 0, this.dep = new Ar(this), this.__v_isRef = !0, this.deps = void 0, this.depsTail = void 0, this.flags = 16, this.globalVersion = qn - 1, this.next = void 0, this.effect = this, this.__v_isReadonly = !n, this.isSSR = s;
  }
  /**
   * @internal
   */
  notify() {
    if (this.flags |= 16, !(this.flags & 8) && // avoid infinite self recursion
    Ae !== this)
      return ho(this, !0), !0;
  }
  get value() {
    const t = this.dep.track();
    return mo(this), t && (t.version = this.dep.version), this._value;
  }
  set value(t) {
    this.setter && this.setter(t);
  }
}
function Ea(e, t, n = !1) {
  let s, r;
  return Q(e) ? s = e : (s = e.get, r = e.set), new Ta(s, r, n);
}
const Yn = {}, fs = /* @__PURE__ */ new WeakMap();
let cn;
function Aa(e, t = !1, n = cn) {
  if (n) {
    let s = fs.get(n);
    s || fs.set(n, s = []), s.push(e);
  }
}
function Ra(e, t, n = Ce) {
  const { immediate: s, deep: r, once: i, scheduler: o, augmentJob: l, call: a } = n, u = (H) => r ? H : dt(H) || r === !1 || r === 0 ? Nt(H, 1) : Nt(H);
  let f, _, b, I, N = !1, q = !1;
  if (ze(e) ? (_ = () => e.value, N = dt(e)) : vn(e) ? (_ = () => u(e), N = !0) : J(e) ? (q = !0, N = e.some((H) => vn(H) || dt(H)), _ = () => e.map((H) => {
    if (ze(H))
      return H.value;
    if (vn(H))
      return u(H);
    if (Q(H))
      return a ? a(H, 2) : H();
  })) : Q(e) ? t ? _ = a ? () => a(e, 2) : e : _ = () => {
    if (b) {
      Dt();
      try {
        b();
      } finally {
        qt();
      }
    }
    const H = cn;
    cn = f;
    try {
      return a ? a(e, 3, [I]) : e(I);
    } finally {
      cn = H;
    }
  } : _ = At, t && r) {
    const H = _, oe = r === !0 ? 1 / 0 : r;
    _ = () => Nt(H(), oe);
  }
  const we = na(), ne = () => {
    f.stop(), we && we.active && xr(we.effects, f);
  };
  if (i && t) {
    const H = t;
    t = (...oe) => {
      H(...oe), ne();
    };
  }
  let de = q ? new Array(e.length).fill(Yn) : Yn;
  const pe = (H) => {
    if (!(!(f.flags & 1) || !f.dirty && !H))
      if (t) {
        const oe = f.run();
        if (r || N || (q ? oe.some((qe, fe) => Yt(qe, de[fe])) : Yt(oe, de))) {
          b && b();
          const qe = cn;
          cn = f;
          try {
            const fe = [
              oe,
              // pass undefined as the old value when it's changed for the first time
              de === Yn ? void 0 : q && de[0] === Yn ? [] : de,
              I
            ];
            de = oe, a ? a(t, 3, fe) : (
              // @ts-expect-error
              t(...fe)
            );
          } finally {
            cn = qe;
          }
        }
      } else
        f.run();
  };
  return l && l(pe), f = new uo(_), f.scheduler = o ? () => o(pe, !1) : pe, I = (H) => Aa(H, !1, f), b = f.onStop = () => {
    const H = fs.get(f);
    if (H) {
      if (a)
        a(H, 4);
      else
        for (const oe of H) oe();
      fs.delete(f);
    }
  }, t ? s ? pe(!0) : de = f.run() : o ? o(pe.bind(null, !0), !0) : f.run(), ne.pause = f.pause.bind(f), ne.resume = f.resume.bind(f), ne.stop = ne, ne;
}
function Nt(e, t = 1 / 0, n) {
  if (t <= 0 || !$e(e) || e.__v_skip || (n = n || /* @__PURE__ */ new Set(), n.has(e)))
    return e;
  if (n.add(e), t--, ze(e))
    Nt(e.value, t, n);
  else if (J(e))
    for (let s = 0; s < e.length; s++)
      Nt(e[s], t, n);
  else if (no(e) || yn(e))
    e.forEach((s) => {
      Nt(s, t, n);
    });
  else if (io(e)) {
    for (const s in e)
      Nt(e[s], t, n);
    for (const s of Object.getOwnPropertySymbols(e))
      Object.prototype.propertyIsEnumerable.call(e, s) && Nt(e[s], t, n);
  }
  return e;
}
/**
* @vue/runtime-core v3.5.18
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
function Wn(e, t, n, s) {
  try {
    return s ? e(...s) : e();
  } catch (r) {
    Cs(r, t, n);
  }
}
function Ot(e, t, n, s) {
  if (Q(e)) {
    const r = Wn(e, t, n, s);
    return r && so(r) && r.catch((i) => {
      Cs(i, t, n);
    }), r;
  }
  if (J(e)) {
    const r = [];
    for (let i = 0; i < e.length; i++)
      r.push(Ot(e[i], t, n, s));
    return r;
  }
}
function Cs(e, t, n, s = !0) {
  const r = t ? t.vnode : null, { errorHandler: i, throwUnhandledErrorInProduction: o } = t && t.appContext.config || Ce;
  if (t) {
    let l = t.parent;
    const a = t.proxy, u = `https://vuejs.org/error-reference/#runtime-${n}`;
    for (; l; ) {
      const f = l.ec;
      if (f) {
        for (let _ = 0; _ < f.length; _++)
          if (f[_](e, a, u) === !1)
            return;
      }
      l = l.parent;
    }
    if (i) {
      Dt(), Wn(i, null, 10, [
        e,
        a,
        u
      ]), qt();
      return;
    }
  }
  Ia(e, n, r, s, o);
}
function Ia(e, t, n, s = !0, r = !1) {
  if (r)
    throw e;
  console.error(e);
}
const Je = [];
let Tt = -1;
const bn = [];
let Zt = null, gn = 0;
const Eo = /* @__PURE__ */ Promise.resolve();
let hs = null;
function Ao(e) {
  const t = hs || Eo;
  return e ? t.then(this ? e.bind(this) : e) : t;
}
function Oa(e) {
  let t = Tt + 1, n = Je.length;
  for (; t < n; ) {
    const s = t + n >>> 1, r = Je[s], i = Hn(r);
    i < e || i === e && r.flags & 2 ? t = s + 1 : n = s;
  }
  return t;
}
function Pr(e) {
  if (!(e.flags & 1)) {
    const t = Hn(e), n = Je[Je.length - 1];
    !n || // fast path when the job id is larger than the tail
    !(e.flags & 2) && t >= Hn(n) ? Je.push(e) : Je.splice(Oa(t), 0, e), e.flags |= 1, Ro();
  }
}
function Ro() {
  hs || (hs = Eo.then(Oo));
}
function La(e) {
  J(e) ? bn.push(...e) : Zt && e.id === -1 ? Zt.splice(gn + 1, 0, e) : e.flags & 1 || (bn.push(e), e.flags |= 1), Ro();
}
function _i(e, t, n = Tt + 1) {
  for (; n < Je.length; n++) {
    const s = Je[n];
    if (s && s.flags & 2) {
      if (e && s.id !== e.uid)
        continue;
      Je.splice(n, 1), n--, s.flags & 4 && (s.flags &= -2), s(), s.flags & 4 || (s.flags &= -2);
    }
  }
}
function Io(e) {
  if (bn.length) {
    const t = [...new Set(bn)].sort(
      (n, s) => Hn(n) - Hn(s)
    );
    if (bn.length = 0, Zt) {
      Zt.push(...t);
      return;
    }
    for (Zt = t, gn = 0; gn < Zt.length; gn++) {
      const n = Zt[gn];
      n.flags & 4 && (n.flags &= -2), n.flags & 8 || n(), n.flags &= -2;
    }
    Zt = null, gn = 0;
  }
}
const Hn = (e) => e.id == null ? e.flags & 2 ? -1 : 1 / 0 : e.id;
function Oo(e) {
  try {
    for (Tt = 0; Tt < Je.length; Tt++) {
      const t = Je[Tt];
      t && !(t.flags & 8) && (t.flags & 4 && (t.flags &= -2), Wn(
        t,
        t.i,
        t.i ? 15 : 14
      ), t.flags & 4 || (t.flags &= -2));
    }
  } finally {
    for (; Tt < Je.length; Tt++) {
      const t = Je[Tt];
      t && (t.flags &= -2);
    }
    Tt = -1, Je.length = 0, Io(), hs = null, (Je.length || bn.length) && Oo();
  }
}
let ht = null, Lo = null;
function ds(e) {
  const t = ht;
  return ht = e, Lo = e && e.type.__scopeId || null, t;
}
function Pa(e, t = ht, n) {
  if (!t || e._n)
    return e;
  const s = (...r) => {
    s._d && Ti(-1);
    const i = ds(t);
    let o;
    try {
      o = e(...r);
    } finally {
      ds(i), s._d && Ti(1);
    }
    return o;
  };
  return s._n = !0, s._c = !0, s._d = !0, s;
}
function rn(e, t) {
  if (ht === null)
    return e;
  const n = Rs(ht), s = e.dirs || (e.dirs = []);
  for (let r = 0; r < t.length; r++) {
    let [i, o, l, a = Ce] = t[r];
    i && (Q(i) && (i = {
      mounted: i,
      updated: i
    }), i.deep && Nt(o), s.push({
      dir: i,
      instance: n,
      value: o,
      oldValue: void 0,
      arg: l,
      modifiers: a
    }));
  }
  return e;
}
function on(e, t, n, s) {
  const r = e.dirs, i = t && t.dirs;
  for (let o = 0; o < r.length; o++) {
    const l = r[o];
    i && (l.oldValue = i[o].value);
    let a = l.dir[s];
    a && (Dt(), Ot(a, n, 8, [
      e.el,
      l,
      e,
      t
    ]), qt());
  }
}
const $a = Symbol("_vte"), Fa = (e) => e.__isTeleport;
function $r(e, t) {
  e.shapeFlag & 6 && e.component ? (e.transition = t, $r(e.component.subTree, t)) : e.shapeFlag & 128 ? (e.ssContent.transition = t.clone(e.ssContent), e.ssFallback.transition = t.clone(e.ssFallback)) : e.transition = t;
}
/*! #__NO_SIDE_EFFECTS__ */
// @__NO_SIDE_EFFECTS__
function Na(e, t) {
  return Q(e) ? (
    // #8236: extend call and options.name access are considered side-effects
    // by Rollup, so we have to wrap it in a pure-annotated IIFE.
    Ke({ name: e.name }, t, { setup: e })
  ) : e;
}
function Po(e) {
  e.ids = [e.ids[0] + e.ids[2]++ + "-", 0, 0];
}
function Fn(e, t, n, s, r = !1) {
  if (J(e)) {
    e.forEach(
      (N, q) => Fn(
        N,
        t && (J(t) ? t[q] : t),
        n,
        s,
        r
      )
    );
    return;
  }
  if (Nn(s) && !r) {
    s.shapeFlag & 512 && s.type.__asyncResolved && s.component.subTree.component && Fn(e, t, n, s.component.subTree);
    return;
  }
  const i = s.shapeFlag & 4 ? Rs(s.component) : s.el, o = r ? null : i, { i: l, r: a } = e, u = t && t.r, f = l.refs === Ce ? l.refs = {} : l.refs, _ = l.setupState, b = me(_), I = _ === Ce ? () => !1 : (N) => _e(b, N);
  if (u != null && u !== a && (De(u) ? (f[u] = null, I(u) && (_[u] = null)) : ze(u) && (u.value = null)), Q(a))
    Wn(a, l, 12, [o, f]);
  else {
    const N = De(a), q = ze(a);
    if (N || q) {
      const we = () => {
        if (e.f) {
          const ne = N ? I(a) ? _[a] : f[a] : a.value;
          r ? J(ne) && xr(ne, i) : J(ne) ? ne.includes(i) || ne.push(i) : N ? (f[a] = [i], I(a) && (_[a] = f[a])) : (a.value = [i], e.k && (f[e.k] = a.value));
        } else N ? (f[a] = o, I(a) && (_[a] = o)) : q && (a.value = o, e.k && (f[e.k] = o));
      };
      o ? (we.id = -1, lt(we, n)) : we();
    }
  }
}
xs().requestIdleCallback;
xs().cancelIdleCallback;
const Nn = (e) => !!e.type.__asyncLoader, $o = (e) => e.type.__isKeepAlive;
function Ba(e, t) {
  Fo(e, "a", t);
}
function Ma(e, t) {
  Fo(e, "da", t);
}
function Fo(e, t, n = Qe) {
  const s = e.__wdc || (e.__wdc = () => {
    let r = n;
    for (; r; ) {
      if (r.isDeactivated)
        return;
      r = r.parent;
    }
    return e();
  });
  if (Ts(t, s, n), n) {
    let r = n.parent;
    for (; r && r.parent; )
      $o(r.parent.vnode) && Da(s, t, n, r), r = r.parent;
  }
}
function Da(e, t, n, s) {
  const r = Ts(
    t,
    e,
    s,
    !0
    /* prepend */
  );
  Fr(() => {
    xr(s[t], r);
  }, n);
}
function Ts(e, t, n = Qe, s = !1) {
  if (n) {
    const r = n[e] || (n[e] = []), i = t.__weh || (t.__weh = (...o) => {
      Dt();
      const l = zn(n), a = Ot(t, n, e, o);
      return l(), qt(), a;
    });
    return s ? r.unshift(i) : r.push(i), i;
  }
}
const Vt = (e) => (t, n = Qe) => {
  (!jn || e === "sp") && Ts(e, (...s) => t(...s), n);
}, qa = Vt("bm"), No = Vt("m"), Va = Vt(
  "bu"
), Ha = Vt("u"), Ua = Vt(
  "bum"
), Fr = Vt("um"), ja = Vt(
  "sp"
), Wa = Vt("rtg"), za = Vt("rtc");
function Ka(e, t = Qe) {
  Ts("ec", e, t);
}
const Za = Symbol.for("v-ndc");
function xt(e, t, n, s) {
  let r;
  const i = n, o = J(e);
  if (o || De(e)) {
    const l = o && vn(e);
    let a = !1, u = !1;
    l && (a = !dt(e), u = Xt(e), e = Ss(e)), r = new Array(e.length);
    for (let f = 0, _ = e.length; f < _; f++)
      r[f] = t(
        a ? u ? us(Ue(e[f])) : Ue(e[f]) : e[f],
        f,
        void 0,
        i
      );
  } else if (typeof e == "number") {
    r = new Array(e);
    for (let l = 0; l < e; l++)
      r[l] = t(l + 1, l, void 0, i);
  } else if ($e(e))
    if (e[Symbol.iterator])
      r = Array.from(
        e,
        (l, a) => t(l, a, void 0, i)
      );
    else {
      const l = Object.keys(e);
      r = new Array(l.length);
      for (let a = 0, u = l.length; a < u; a++) {
        const f = l[a];
        r[a] = t(e[f], f, a, i);
      }
    }
  else
    r = [];
  return r;
}
const or = (e) => e ? sl(e) ? Rs(e) : or(e.parent) : null, Bn = (
  // Move PURE marker to new line to workaround compiler discarding it
  // due to type annotation
  /* @__PURE__ */ Ke(/* @__PURE__ */ Object.create(null), {
    $: (e) => e,
    $el: (e) => e.vnode.el,
    $data: (e) => e.data,
    $props: (e) => e.props,
    $attrs: (e) => e.attrs,
    $slots: (e) => e.slots,
    $refs: (e) => e.refs,
    $parent: (e) => or(e.parent),
    $root: (e) => or(e.root),
    $host: (e) => e.ce,
    $emit: (e) => e.emit,
    $options: (e) => Mo(e),
    $forceUpdate: (e) => e.f || (e.f = () => {
      Pr(e.update);
    }),
    $nextTick: (e) => e.n || (e.n = Ao.bind(e.proxy)),
    $watch: (e) => mc.bind(e)
  })
), Us = (e, t) => e !== Ce && !e.__isScriptSetup && _e(e, t), Ga = {
  get({ _: e }, t) {
    if (t === "__v_skip")
      return !0;
    const { ctx: n, setupState: s, data: r, props: i, accessCache: o, type: l, appContext: a } = e;
    let u;
    if (t[0] !== "$") {
      const I = o[t];
      if (I !== void 0)
        switch (I) {
          case 1:
            return s[t];
          case 2:
            return r[t];
          case 4:
            return n[t];
          case 3:
            return i[t];
        }
      else {
        if (Us(s, t))
          return o[t] = 1, s[t];
        if (r !== Ce && _e(r, t))
          return o[t] = 2, r[t];
        if (
          // only cache other properties when instance has declared (thus stable)
          // props
          (u = e.propsOptions[0]) && _e(u, t)
        )
          return o[t] = 3, i[t];
        if (n !== Ce && _e(n, t))
          return o[t] = 4, n[t];
        lr && (o[t] = 0);
      }
    }
    const f = Bn[t];
    let _, b;
    if (f)
      return t === "$attrs" && We(e.attrs, "get", ""), f(e);
    if (
      // css module (injected by vue-loader)
      (_ = l.__cssModules) && (_ = _[t])
    )
      return _;
    if (n !== Ce && _e(n, t))
      return o[t] = 4, n[t];
    if (
      // global properties
      b = a.config.globalProperties, _e(b, t)
    )
      return b[t];
  },
  set({ _: e }, t, n) {
    const { data: s, setupState: r, ctx: i } = e;
    return Us(r, t) ? (r[t] = n, !0) : s !== Ce && _e(s, t) ? (s[t] = n, !0) : _e(e.props, t) || t[0] === "$" && t.slice(1) in e ? !1 : (i[t] = n, !0);
  },
  has({
    _: { data: e, setupState: t, accessCache: n, ctx: s, appContext: r, propsOptions: i }
  }, o) {
    let l;
    return !!n[o] || e !== Ce && _e(e, o) || Us(t, o) || (l = i[0]) && _e(l, o) || _e(s, o) || _e(Bn, o) || _e(r.config.globalProperties, o);
  },
  defineProperty(e, t, n) {
    return n.get != null ? e._.accessCache[t] = 0 : _e(n, "value") && this.set(e, t, n.value, null), Reflect.defineProperty(e, t, n);
  }
};
function yi(e) {
  return J(e) ? e.reduce(
    (t, n) => (t[n] = null, t),
    {}
  ) : e;
}
let lr = !0;
function Ya(e) {
  const t = Mo(e), n = e.proxy, s = e.ctx;
  lr = !1, t.beforeCreate && vi(t.beforeCreate, e, "bc");
  const {
    // state
    data: r,
    computed: i,
    methods: o,
    watch: l,
    provide: a,
    inject: u,
    // lifecycle
    created: f,
    beforeMount: _,
    mounted: b,
    beforeUpdate: I,
    updated: N,
    activated: q,
    deactivated: we,
    beforeDestroy: ne,
    beforeUnmount: de,
    destroyed: pe,
    unmounted: H,
    render: oe,
    renderTracked: qe,
    renderTriggered: fe,
    errorCaptured: je,
    serverPrefetch: pt,
    // public API
    expose: Ze,
    inheritAttrs: gt,
    // assets
    components: wt,
    directives: et,
    filters: Ve
  } = t;
  if (u && Ja(u, s, null), o)
    for (const X in o) {
      const re = o[X];
      Q(re) && (s[X] = re.bind(n));
    }
  if (r) {
    const X = r.call(n, n);
    $e(X) && (e.data = Ir(X));
  }
  if (lr = !0, i)
    for (const X in i) {
      const re = i[X], M = Q(re) ? re.bind(n, n) : Q(re.get) ? re.get.bind(n, n) : At, ke = !Q(re) && Q(re.set) ? re.set.bind(n) : At, W = Be({
        get: M,
        set: ke
      });
      Object.defineProperty(s, X, {
        enumerable: !0,
        configurable: !0,
        get: () => W.value,
        set: (Te) => W.value = Te
      });
    }
  if (l)
    for (const X in l)
      Bo(l[X], s, n, X);
  if (a) {
    const X = Q(a) ? a.call(n) : a;
    Reflect.ownKeys(X).forEach((re) => {
      sc(re, X[re]);
    });
  }
  f && vi(f, e, "c");
  function se(X, re) {
    J(re) ? re.forEach((M) => X(M.bind(n))) : re && X(re.bind(n));
  }
  if (se(qa, _), se(No, b), se(Va, I), se(Ha, N), se(Ba, q), se(Ma, we), se(Ka, je), se(za, qe), se(Wa, fe), se(Ua, de), se(Fr, H), se(ja, pt), J(Ze))
    if (Ze.length) {
      const X = e.exposed || (e.exposed = {});
      Ze.forEach((re) => {
        Object.defineProperty(X, re, {
          get: () => n[re],
          set: (M) => n[re] = M,
          enumerable: !0
        });
      });
    } else e.exposed || (e.exposed = {});
  oe && e.render === At && (e.render = oe), gt != null && (e.inheritAttrs = gt), wt && (e.components = wt), et && (e.directives = et), pt && Po(e);
}
function Ja(e, t, n = At) {
  J(e) && (e = ar(e));
  for (const s in e) {
    const r = e[s];
    let i;
    $e(r) ? "default" in r ? i = ts(
      r.from || s,
      r.default,
      !0
    ) : i = ts(r.from || s) : i = ts(r), ze(i) ? Object.defineProperty(t, s, {
      enumerable: !0,
      configurable: !0,
      get: () => i.value,
      set: (o) => i.value = o
    }) : t[s] = i;
  }
}
function vi(e, t, n) {
  Ot(
    J(e) ? e.map((s) => s.bind(t.proxy)) : e.bind(t.proxy),
    t,
    n
  );
}
function Bo(e, t, n, s) {
  let r = s.includes(".") ? Jo(n, s) : () => n[s];
  if (De(e)) {
    const i = t[e];
    Q(i) && un(r, i);
  } else if (Q(e))
    un(r, e.bind(n));
  else if ($e(e))
    if (J(e))
      e.forEach((i) => Bo(i, t, n, s));
    else {
      const i = Q(e.handler) ? e.handler.bind(n) : t[e.handler];
      Q(i) && un(r, i, e);
    }
}
function Mo(e) {
  const t = e.type, { mixins: n, extends: s } = t, {
    mixins: r,
    optionsCache: i,
    config: { optionMergeStrategies: o }
  } = e.appContext, l = i.get(t);
  let a;
  return l ? a = l : !r.length && !n && !s ? a = t : (a = {}, r.length && r.forEach(
    (u) => ps(a, u, o, !0)
  ), ps(a, t, o)), $e(t) && i.set(t, a), a;
}
function ps(e, t, n, s = !1) {
  const { mixins: r, extends: i } = t;
  i && ps(e, i, n, !0), r && r.forEach(
    (o) => ps(e, o, n, !0)
  );
  for (const o in t)
    if (!(s && o === "expose")) {
      const l = Qa[o] || n && n[o];
      e[o] = l ? l(e[o], t[o]) : t[o];
    }
  return e;
}
const Qa = {
  data: bi,
  props: wi,
  emits: wi,
  // objects
  methods: In,
  computed: In,
  // lifecycle
  beforeCreate: Ye,
  created: Ye,
  beforeMount: Ye,
  mounted: Ye,
  beforeUpdate: Ye,
  updated: Ye,
  beforeDestroy: Ye,
  beforeUnmount: Ye,
  destroyed: Ye,
  unmounted: Ye,
  activated: Ye,
  deactivated: Ye,
  errorCaptured: Ye,
  serverPrefetch: Ye,
  // assets
  components: In,
  directives: In,
  // watch
  watch: ec,
  // provide / inject
  provide: bi,
  inject: Xa
};
function bi(e, t) {
  return t ? e ? function() {
    return Ke(
      Q(e) ? e.call(this, this) : e,
      Q(t) ? t.call(this, this) : t
    );
  } : t : e;
}
function Xa(e, t) {
  return In(ar(e), ar(t));
}
function ar(e) {
  if (J(e)) {
    const t = {};
    for (let n = 0; n < e.length; n++)
      t[e[n]] = e[n];
    return t;
  }
  return e;
}
function Ye(e, t) {
  return e ? [...new Set([].concat(e, t))] : t;
}
function In(e, t) {
  return e ? Ke(/* @__PURE__ */ Object.create(null), e, t) : t;
}
function wi(e, t) {
  return e ? J(e) && J(t) ? [.../* @__PURE__ */ new Set([...e, ...t])] : Ke(
    /* @__PURE__ */ Object.create(null),
    yi(e),
    yi(t ?? {})
  ) : t;
}
function ec(e, t) {
  if (!e) return t;
  if (!t) return e;
  const n = Ke(/* @__PURE__ */ Object.create(null), e);
  for (const s in t)
    n[s] = Ye(e[s], t[s]);
  return n;
}
function Do() {
  return {
    app: null,
    config: {
      isNativeTag: jl,
      performance: !1,
      globalProperties: {},
      optionMergeStrategies: {},
      errorHandler: void 0,
      warnHandler: void 0,
      compilerOptions: {}
    },
    mixins: [],
    components: {},
    directives: {},
    provides: /* @__PURE__ */ Object.create(null),
    optionsCache: /* @__PURE__ */ new WeakMap(),
    propsCache: /* @__PURE__ */ new WeakMap(),
    emitsCache: /* @__PURE__ */ new WeakMap()
  };
}
let tc = 0;
function nc(e, t) {
  return function(s, r = null) {
    Q(s) || (s = Ke({}, s)), r != null && !$e(r) && (r = null);
    const i = Do(), o = /* @__PURE__ */ new WeakSet(), l = [];
    let a = !1;
    const u = i.app = {
      _uid: tc++,
      _component: s,
      _props: r,
      _container: null,
      _context: i,
      _instance: null,
      version: Dc,
      get config() {
        return i.config;
      },
      set config(f) {
      },
      use(f, ..._) {
        return o.has(f) || (f && Q(f.install) ? (o.add(f), f.install(u, ..._)) : Q(f) && (o.add(f), f(u, ..._))), u;
      },
      mixin(f) {
        return i.mixins.includes(f) || i.mixins.push(f), u;
      },
      component(f, _) {
        return _ ? (i.components[f] = _, u) : i.components[f];
      },
      directive(f, _) {
        return _ ? (i.directives[f] = _, u) : i.directives[f];
      },
      mount(f, _, b) {
        if (!a) {
          const I = u._ceVNode || Rt(s, r);
          return I.appContext = i, b === !0 ? b = "svg" : b === !1 && (b = void 0), e(I, f, b), a = !0, u._container = f, f.__vue_app__ = u, Rs(I.component);
        }
      },
      onUnmount(f) {
        l.push(f);
      },
      unmount() {
        a && (Ot(
          l,
          u._instance,
          16
        ), e(null, u._container), delete u._container.__vue_app__);
      },
      provide(f, _) {
        return i.provides[f] = _, u;
      },
      runWithContext(f) {
        const _ = wn;
        wn = u;
        try {
          return f();
        } finally {
          wn = _;
        }
      }
    };
    return u;
  };
}
let wn = null;
function sc(e, t) {
  if (Qe) {
    let n = Qe.provides;
    const s = Qe.parent && Qe.parent.provides;
    s === n && (n = Qe.provides = Object.create(s)), n[e] = t;
  }
}
function ts(e, t, n = !1) {
  const s = Pc();
  if (s || wn) {
    let r = wn ? wn._context.provides : s ? s.parent == null || s.ce ? s.vnode.appContext && s.vnode.appContext.provides : s.parent.provides : void 0;
    if (r && e in r)
      return r[e];
    if (arguments.length > 1)
      return n && Q(t) ? t.call(s && s.proxy) : t;
  }
}
const qo = {}, Vo = () => Object.create(qo), Ho = (e) => Object.getPrototypeOf(e) === qo;
function rc(e, t, n, s = !1) {
  const r = {}, i = Vo();
  e.propsDefaults = /* @__PURE__ */ Object.create(null), Uo(e, t, r, i);
  for (const o in e.propsOptions[0])
    o in r || (r[o] = void 0);
  n ? e.props = s ? r : wa(r) : e.type.props ? e.props = r : e.props = i, e.attrs = i;
}
function ic(e, t, n, s) {
  const {
    props: r,
    attrs: i,
    vnode: { patchFlag: o }
  } = e, l = me(r), [a] = e.propsOptions;
  let u = !1;
  if (
    // always force full diff in dev
    // - #1942 if hmr is enabled with sfc component
    // - vite#872 non-sfc component used by sfc component
    (s || o > 0) && !(o & 16)
  ) {
    if (o & 8) {
      const f = e.vnode.dynamicProps;
      for (let _ = 0; _ < f.length; _++) {
        let b = f[_];
        if (Es(e.emitsOptions, b))
          continue;
        const I = t[b];
        if (a)
          if (_e(i, b))
            I !== i[b] && (i[b] = I, u = !0);
          else {
            const N = Qt(b);
            r[N] = cr(
              a,
              l,
              N,
              I,
              e,
              !1
            );
          }
        else
          I !== i[b] && (i[b] = I, u = !0);
      }
    }
  } else {
    Uo(e, t, r, i) && (u = !0);
    let f;
    for (const _ in l)
      (!t || // for camelCase
      !_e(t, _) && // it's possible the original props was passed in as kebab-case
      // and converted to camelCase (#955)
      ((f = nn(_)) === _ || !_e(t, f))) && (a ? n && // for camelCase
      (n[_] !== void 0 || // for kebab-case
      n[f] !== void 0) && (r[_] = cr(
        a,
        l,
        _,
        void 0,
        e,
        !0
      )) : delete r[_]);
    if (i !== l)
      for (const _ in i)
        (!t || !_e(t, _)) && (delete i[_], u = !0);
  }
  u && Ft(e.attrs, "set", "");
}
function Uo(e, t, n, s) {
  const [r, i] = e.propsOptions;
  let o = !1, l;
  if (t)
    for (let a in t) {
      if (Ln(a))
        continue;
      const u = t[a];
      let f;
      r && _e(r, f = Qt(a)) ? !i || !i.includes(f) ? n[f] = u : (l || (l = {}))[f] = u : Es(e.emitsOptions, a) || (!(a in s) || u !== s[a]) && (s[a] = u, o = !0);
    }
  if (i) {
    const a = me(n), u = l || Ce;
    for (let f = 0; f < i.length; f++) {
      const _ = i[f];
      n[_] = cr(
        r,
        a,
        _,
        u[_],
        e,
        !_e(u, _)
      );
    }
  }
  return o;
}
function cr(e, t, n, s, r, i) {
  const o = e[n];
  if (o != null) {
    const l = _e(o, "default");
    if (l && s === void 0) {
      const a = o.default;
      if (o.type !== Function && !o.skipFactory && Q(a)) {
        const { propsDefaults: u } = r;
        if (n in u)
          s = u[n];
        else {
          const f = zn(r);
          s = u[n] = a.call(
            null,
            t
          ), f();
        }
      } else
        s = a;
      r.ce && r.ce._setProp(n, s);
    }
    o[
      0
      /* shouldCast */
    ] && (i && !l ? s = !1 : o[
      1
      /* shouldCastTrue */
    ] && (s === "" || s === nn(n)) && (s = !0));
  }
  return s;
}
const oc = /* @__PURE__ */ new WeakMap();
function jo(e, t, n = !1) {
  const s = n ? oc : t.propsCache, r = s.get(e);
  if (r)
    return r;
  const i = e.props, o = {}, l = [];
  let a = !1;
  if (!Q(e)) {
    const f = (_) => {
      a = !0;
      const [b, I] = jo(_, t, !0);
      Ke(o, b), I && l.push(...I);
    };
    !n && t.mixins.length && t.mixins.forEach(f), e.extends && f(e.extends), e.mixins && e.mixins.forEach(f);
  }
  if (!i && !a)
    return $e(e) && s.set(e, _n), _n;
  if (J(i))
    for (let f = 0; f < i.length; f++) {
      const _ = Qt(i[f]);
      ki(_) && (o[_] = Ce);
    }
  else if (i)
    for (const f in i) {
      const _ = Qt(f);
      if (ki(_)) {
        const b = i[f], I = o[_] = J(b) || Q(b) ? { type: b } : Ke({}, b), N = I.type;
        let q = !1, we = !0;
        if (J(N))
          for (let ne = 0; ne < N.length; ++ne) {
            const de = N[ne], pe = Q(de) && de.name;
            if (pe === "Boolean") {
              q = !0;
              break;
            } else pe === "String" && (we = !1);
          }
        else
          q = Q(N) && N.name === "Boolean";
        I[
          0
          /* shouldCast */
        ] = q, I[
          1
          /* shouldCastTrue */
        ] = we, (q || _e(I, "default")) && l.push(_);
      }
    }
  const u = [o, l];
  return $e(e) && s.set(e, u), u;
}
function ki(e) {
  return e[0] !== "$" && !Ln(e);
}
const Nr = (e) => e === "_" || e === "__" || e === "_ctx" || e === "$stable", Br = (e) => J(e) ? e.map(Et) : [Et(e)], lc = (e, t, n) => {
  if (t._n)
    return t;
  const s = Pa((...r) => Br(t(...r)), n);
  return s._c = !1, s;
}, Wo = (e, t, n) => {
  const s = e._ctx;
  for (const r in e) {
    if (Nr(r)) continue;
    const i = e[r];
    if (Q(i))
      t[r] = lc(r, i, s);
    else if (i != null) {
      const o = Br(i);
      t[r] = () => o;
    }
  }
}, zo = (e, t) => {
  const n = Br(t);
  e.slots.default = () => n;
}, Ko = (e, t, n) => {
  for (const s in t)
    (n || !Nr(s)) && (e[s] = t[s]);
}, ac = (e, t, n) => {
  const s = e.slots = Vo();
  if (e.vnode.shapeFlag & 32) {
    const r = t.__;
    r && er(s, "__", r, !0);
    const i = t._;
    i ? (Ko(s, t, n), n && er(s, "_", i, !0)) : Wo(t, s);
  } else t && zo(e, t);
}, cc = (e, t, n) => {
  const { vnode: s, slots: r } = e;
  let i = !0, o = Ce;
  if (s.shapeFlag & 32) {
    const l = t._;
    l ? n && l === 1 ? i = !1 : Ko(r, t, n) : (i = !t.$stable, Wo(t, r)), o = t;
  } else t && (zo(e, t), o = { default: 1 });
  if (i)
    for (const l in r)
      !Nr(l) && o[l] == null && delete r[l];
}, lt = xc;
function uc(e) {
  return fc(e);
}
function fc(e, t) {
  const n = xs();
  n.__VUE__ = !0;
  const {
    insert: s,
    remove: r,
    patchProp: i,
    createElement: o,
    createText: l,
    createComment: a,
    setText: u,
    setElementText: f,
    parentNode: _,
    nextSibling: b,
    setScopeId: I = At,
    insertStaticContent: N
  } = e, q = (h, g, w, C = null, T = null, S = null, B = void 0, O = null, L = !!g.dynamicChildren) => {
    if (h === g)
      return;
    h && !Cn(h, g) && (C = ct(h), Te(h, T, S, !0), h = null), g.patchFlag === -2 && (L = !1, g.dynamicChildren = null);
    const { type: E, ref: U, shapeFlag: F } = g;
    switch (E) {
      case As:
        we(h, g, w, C);
        break;
      case en:
        ne(h, g, w, C);
        break;
      case ns:
        h == null && de(g, w, C, B);
        break;
      case Ne:
        wt(
          h,
          g,
          w,
          C,
          T,
          S,
          B,
          O,
          L
        );
        break;
      default:
        F & 1 ? oe(
          h,
          g,
          w,
          C,
          T,
          S,
          B,
          O,
          L
        ) : F & 6 ? et(
          h,
          g,
          w,
          C,
          T,
          S,
          B,
          O,
          L
        ) : (F & 64 || F & 128) && E.process(
          h,
          g,
          w,
          C,
          T,
          S,
          B,
          O,
          L,
          it
        );
    }
    U != null && T ? Fn(U, h && h.ref, S, g || h, !g) : U == null && h && h.ref != null && Fn(h.ref, null, S, h, !0);
  }, we = (h, g, w, C) => {
    if (h == null)
      s(
        g.el = l(g.children),
        w,
        C
      );
    else {
      const T = g.el = h.el;
      g.children !== h.children && u(T, g.children);
    }
  }, ne = (h, g, w, C) => {
    h == null ? s(
      g.el = a(g.children || ""),
      w,
      C
    ) : g.el = h.el;
  }, de = (h, g, w, C) => {
    [h.el, h.anchor] = N(
      h.children,
      g,
      w,
      C,
      h.el,
      h.anchor
    );
  }, pe = ({ el: h, anchor: g }, w, C) => {
    let T;
    for (; h && h !== g; )
      T = b(h), s(h, w, C), h = T;
    s(g, w, C);
  }, H = ({ el: h, anchor: g }) => {
    let w;
    for (; h && h !== g; )
      w = b(h), r(h), h = w;
    r(g);
  }, oe = (h, g, w, C, T, S, B, O, L) => {
    g.type === "svg" ? B = "svg" : g.type === "math" && (B = "mathml"), h == null ? qe(
      g,
      w,
      C,
      T,
      S,
      B,
      O,
      L
    ) : pt(
      h,
      g,
      T,
      S,
      B,
      O,
      L
    );
  }, qe = (h, g, w, C, T, S, B, O) => {
    let L, E;
    const { props: U, shapeFlag: F, transition: j, dirs: K } = h;
    if (L = h.el = o(
      h.type,
      S,
      U && U.is,
      U
    ), F & 8 ? f(L, h.children) : F & 16 && je(
      h.children,
      L,
      null,
      C,
      T,
      js(h, S),
      B,
      O
    ), K && on(h, null, C, "created"), fe(L, h, h.scopeId, B, C), U) {
      for (const ge in U)
        ge !== "value" && !Ln(ge) && i(L, ge, null, U[ge], S, C);
      "value" in U && i(L, "value", null, U.value, S), (E = U.onVnodeBeforeMount) && St(E, C, h);
    }
    K && on(h, null, C, "beforeMount");
    const ee = hc(T, j);
    ee && j.beforeEnter(L), s(L, g, w), ((E = U && U.onVnodeMounted) || ee || K) && lt(() => {
      E && St(E, C, h), ee && j.enter(L), K && on(h, null, C, "mounted");
    }, T);
  }, fe = (h, g, w, C, T) => {
    if (w && I(h, w), C)
      for (let S = 0; S < C.length; S++)
        I(h, C[S]);
    if (T) {
      let S = T.subTree;
      if (g === S || Xo(S.type) && (S.ssContent === g || S.ssFallback === g)) {
        const B = T.vnode;
        fe(
          h,
          B,
          B.scopeId,
          B.slotScopeIds,
          T.parent
        );
      }
    }
  }, je = (h, g, w, C, T, S, B, O, L = 0) => {
    for (let E = L; E < h.length; E++) {
      const U = h[E] = O ? Gt(h[E]) : Et(h[E]);
      q(
        null,
        U,
        g,
        w,
        C,
        T,
        S,
        B,
        O
      );
    }
  }, pt = (h, g, w, C, T, S, B) => {
    const O = g.el = h.el;
    let { patchFlag: L, dynamicChildren: E, dirs: U } = g;
    L |= h.patchFlag & 16;
    const F = h.props || Ce, j = g.props || Ce;
    let K;
    if (w && ln(w, !1), (K = j.onVnodeBeforeUpdate) && St(K, w, g, h), U && on(g, h, w, "beforeUpdate"), w && ln(w, !0), (F.innerHTML && j.innerHTML == null || F.textContent && j.textContent == null) && f(O, ""), E ? Ze(
      h.dynamicChildren,
      E,
      O,
      w,
      C,
      js(g, T),
      S
    ) : B || re(
      h,
      g,
      O,
      null,
      w,
      C,
      js(g, T),
      S,
      !1
    ), L > 0) {
      if (L & 16)
        gt(O, F, j, w, T);
      else if (L & 2 && F.class !== j.class && i(O, "class", null, j.class, T), L & 4 && i(O, "style", F.style, j.style, T), L & 8) {
        const ee = g.dynamicProps;
        for (let ge = 0; ge < ee.length; ge++) {
          const ie = ee[ge], Fe = F[ie], Re = j[ie];
          (Re !== Fe || ie === "value") && i(O, ie, Fe, Re, T, w);
        }
      }
      L & 1 && h.children !== g.children && f(O, g.children);
    } else !B && E == null && gt(O, F, j, w, T);
    ((K = j.onVnodeUpdated) || U) && lt(() => {
      K && St(K, w, g, h), U && on(g, h, w, "updated");
    }, C);
  }, Ze = (h, g, w, C, T, S, B) => {
    for (let O = 0; O < g.length; O++) {
      const L = h[O], E = g[O], U = (
        // oldVNode may be an errored async setup() component inside Suspense
        // which will not have a mounted element
        L.el && // - In the case of a Fragment, we need to provide the actual parent
        // of the Fragment itself so it can move its children.
        (L.type === Ne || // - In the case of different nodes, there is going to be a replacement
        // which also requires the correct parent container
        !Cn(L, E) || // - In the case of a component, it could contain anything.
        L.shapeFlag & 198) ? _(L.el) : (
          // In other cases, the parent container is not actually used so we
          // just pass the block element here to avoid a DOM parentNode call.
          w
        )
      );
      q(
        L,
        E,
        U,
        null,
        C,
        T,
        S,
        B,
        !0
      );
    }
  }, gt = (h, g, w, C, T) => {
    if (g !== w) {
      if (g !== Ce)
        for (const S in g)
          !Ln(S) && !(S in w) && i(
            h,
            S,
            g[S],
            null,
            T,
            C
          );
      for (const S in w) {
        if (Ln(S)) continue;
        const B = w[S], O = g[S];
        B !== O && S !== "value" && i(h, S, O, B, T, C);
      }
      "value" in w && i(h, "value", g.value, w.value, T);
    }
  }, wt = (h, g, w, C, T, S, B, O, L) => {
    const E = g.el = h ? h.el : l(""), U = g.anchor = h ? h.anchor : l("");
    let { patchFlag: F, dynamicChildren: j, slotScopeIds: K } = g;
    K && (O = O ? O.concat(K) : K), h == null ? (s(E, w, C), s(U, w, C), je(
      // #10007
      // such fragment like `<></>` will be compiled into
      // a fragment which doesn't have a children.
      // In this case fallback to an empty array
      g.children || [],
      w,
      U,
      T,
      S,
      B,
      O,
      L
    )) : F > 0 && F & 64 && j && // #2715 the previous fragment could've been a BAILed one as a result
    // of renderSlot() with no valid children
    h.dynamicChildren ? (Ze(
      h.dynamicChildren,
      j,
      w,
      T,
      S,
      B,
      O
    ), // #2080 if the stable fragment has a key, it's a <template v-for> that may
    //  get moved around. Make sure all root level vnodes inherit el.
    // #2134 or if it's a component root, it may also get moved around
    // as the component is being moved.
    (g.key != null || T && g === T.subTree) && Zo(
      h,
      g,
      !0
      /* shallow */
    )) : re(
      h,
      g,
      w,
      U,
      T,
      S,
      B,
      O,
      L
    );
  }, et = (h, g, w, C, T, S, B, O, L) => {
    g.slotScopeIds = O, h == null ? g.shapeFlag & 512 ? T.ctx.activate(
      g,
      w,
      C,
      B,
      L
    ) : Ve(
      g,
      w,
      C,
      T,
      S,
      B,
      L
    ) : Ht(h, g, L);
  }, Ve = (h, g, w, C, T, S, B) => {
    const O = h.component = Lc(
      h,
      C,
      T
    );
    if ($o(h) && (O.ctx.renderer = it), $c(O, !1, B), O.asyncDep) {
      if (T && T.registerDep(O, se, B), !h.el) {
        const L = O.subTree = Rt(en);
        ne(null, L, g, w), h.placeholder = L.el;
      }
    } else
      se(
        O,
        h,
        g,
        w,
        T,
        S,
        B
      );
  }, Ht = (h, g, w) => {
    const C = g.component = h.component;
    if (wc(h, g, w))
      if (C.asyncDep && !C.asyncResolved) {
        X(C, g, w);
        return;
      } else
        C.next = g, C.update();
    else
      g.el = h.el, C.vnode = g;
  }, se = (h, g, w, C, T, S, B) => {
    const O = () => {
      if (h.isMounted) {
        let { next: F, bu: j, u: K, parent: ee, vnode: ge } = h;
        {
          const c = Go(h);
          if (c) {
            F && (F.el = ge.el, X(h, F, B)), c.asyncDep.then(() => {
              h.isUnmounted || O();
            });
            return;
          }
        }
        let ie = F, Fe;
        ln(h, !1), F ? (F.el = ge.el, X(h, F, B)) : F = ge, j && es(j), (Fe = F.props && F.props.onVnodeBeforeUpdate) && St(Fe, ee, F, ge), ln(h, !0);
        const Re = Si(h), Oe = h.subTree;
        h.subTree = Re, q(
          Oe,
          Re,
          // parent may have changed if it's in a teleport
          _(Oe.el),
          // anchor may have changed if it's in a fragment
          ct(Oe),
          h,
          T,
          S
        ), F.el = Re.el, ie === null && kc(h, Re.el), K && lt(K, T), (Fe = F.props && F.props.onVnodeUpdated) && lt(
          () => St(Fe, ee, F, ge),
          T
        );
      } else {
        let F;
        const { el: j, props: K } = g, { bm: ee, m: ge, parent: ie, root: Fe, type: Re } = h, Oe = Nn(g);
        ln(h, !1), ee && es(ee), !Oe && (F = K && K.onVnodeBeforeMount) && St(F, ie, g), ln(h, !0);
        {
          Fe.ce && // @ts-expect-error _def is private
          Fe.ce._def.shadowRoot !== !1 && Fe.ce._injectChildStyle(Re);
          const c = h.subTree = Si(h);
          q(
            null,
            c,
            w,
            C,
            h,
            T,
            S
          ), g.el = c.el;
        }
        if (ge && lt(ge, T), !Oe && (F = K && K.onVnodeMounted)) {
          const c = g;
          lt(
            () => St(F, ie, c),
            T
          );
        }
        (g.shapeFlag & 256 || ie && Nn(ie.vnode) && ie.vnode.shapeFlag & 256) && h.a && lt(h.a, T), h.isMounted = !0, g = w = C = null;
      }
    };
    h.scope.on();
    const L = h.effect = new uo(O);
    h.scope.off();
    const E = h.update = L.run.bind(L), U = h.job = L.runIfDirty.bind(L);
    U.i = h, U.id = h.uid, L.scheduler = () => Pr(U), ln(h, !0), E();
  }, X = (h, g, w) => {
    g.component = h;
    const C = h.vnode.props;
    h.vnode = g, h.next = null, ic(h, g.props, C, w), cc(h, g.children, w), Dt(), _i(h), qt();
  }, re = (h, g, w, C, T, S, B, O, L = !1) => {
    const E = h && h.children, U = h ? h.shapeFlag : 0, F = g.children, { patchFlag: j, shapeFlag: K } = g;
    if (j > 0) {
      if (j & 128) {
        ke(
          E,
          F,
          w,
          C,
          T,
          S,
          B,
          O,
          L
        );
        return;
      } else if (j & 256) {
        M(
          E,
          F,
          w,
          C,
          T,
          S,
          B,
          O,
          L
        );
        return;
      }
    }
    K & 8 ? (U & 16 && kt(E, T, S), F !== E && f(w, F)) : U & 16 ? K & 16 ? ke(
      E,
      F,
      w,
      C,
      T,
      S,
      B,
      O,
      L
    ) : kt(E, T, S, !0) : (U & 8 && f(w, ""), K & 16 && je(
      F,
      w,
      C,
      T,
      S,
      B,
      O,
      L
    ));
  }, M = (h, g, w, C, T, S, B, O, L) => {
    h = h || _n, g = g || _n;
    const E = h.length, U = g.length, F = Math.min(E, U);
    let j;
    for (j = 0; j < F; j++) {
      const K = g[j] = L ? Gt(g[j]) : Et(g[j]);
      q(
        h[j],
        K,
        w,
        null,
        T,
        S,
        B,
        O,
        L
      );
    }
    E > U ? kt(
      h,
      T,
      S,
      !0,
      !1,
      F
    ) : je(
      g,
      w,
      C,
      T,
      S,
      B,
      O,
      L,
      F
    );
  }, ke = (h, g, w, C, T, S, B, O, L) => {
    let E = 0;
    const U = g.length;
    let F = h.length - 1, j = U - 1;
    for (; E <= F && E <= j; ) {
      const K = h[E], ee = g[E] = L ? Gt(g[E]) : Et(g[E]);
      if (Cn(K, ee))
        q(
          K,
          ee,
          w,
          null,
          T,
          S,
          B,
          O,
          L
        );
      else
        break;
      E++;
    }
    for (; E <= F && E <= j; ) {
      const K = h[F], ee = g[j] = L ? Gt(g[j]) : Et(g[j]);
      if (Cn(K, ee))
        q(
          K,
          ee,
          w,
          null,
          T,
          S,
          B,
          O,
          L
        );
      else
        break;
      F--, j--;
    }
    if (E > F) {
      if (E <= j) {
        const K = j + 1, ee = K < U ? g[K].el : C;
        for (; E <= j; )
          q(
            null,
            g[E] = L ? Gt(g[E]) : Et(g[E]),
            w,
            ee,
            T,
            S,
            B,
            O,
            L
          ), E++;
      }
    } else if (E > j)
      for (; E <= F; )
        Te(h[E], T, S, !0), E++;
    else {
      const K = E, ee = E, ge = /* @__PURE__ */ new Map();
      for (E = ee; E <= j; E++) {
        const y = g[E] = L ? Gt(g[E]) : Et(g[E]);
        y.key != null && ge.set(y.key, E);
      }
      let ie, Fe = 0;
      const Re = j - ee + 1;
      let Oe = !1, c = 0;
      const d = new Array(Re);
      for (E = 0; E < Re; E++) d[E] = 0;
      for (E = K; E <= F; E++) {
        const y = h[E];
        if (Fe >= Re) {
          Te(y, T, S, !0);
          continue;
        }
        let A;
        if (y.key != null)
          A = ge.get(y.key);
        else
          for (ie = ee; ie <= j; ie++)
            if (d[ie - ee] === 0 && Cn(y, g[ie])) {
              A = ie;
              break;
            }
        A === void 0 ? Te(y, T, S, !0) : (d[A - ee] = E + 1, A >= c ? c = A : Oe = !0, q(
          y,
          g[A],
          w,
          null,
          T,
          S,
          B,
          O,
          L
        ), Fe++);
      }
      const k = Oe ? dc(d) : _n;
      for (ie = k.length - 1, E = Re - 1; E >= 0; E--) {
        const y = ee + E, A = g[y], V = g[y + 1], z = y + 1 < U ? (
          // #13559, fallback to el placeholder for unresolved async component
          V.el || V.placeholder
        ) : C;
        d[E] === 0 ? q(
          null,
          A,
          w,
          z,
          T,
          S,
          B,
          O,
          L
        ) : Oe && (ie < 0 || E !== k[ie] ? W(A, w, z, 2) : ie--);
      }
    }
  }, W = (h, g, w, C, T = null) => {
    const { el: S, type: B, transition: O, children: L, shapeFlag: E } = h;
    if (E & 6) {
      W(h.component.subTree, g, w, C);
      return;
    }
    if (E & 128) {
      h.suspense.move(g, w, C);
      return;
    }
    if (E & 64) {
      B.move(h, g, w, it);
      return;
    }
    if (B === Ne) {
      s(S, g, w);
      for (let F = 0; F < L.length; F++)
        W(L[F], g, w, C);
      s(h.anchor, g, w);
      return;
    }
    if (B === ns) {
      pe(h, g, w);
      return;
    }
    if (C !== 2 && E & 1 && O)
      if (C === 0)
        O.beforeEnter(S), s(S, g, w), lt(() => O.enter(S), T);
      else {
        const { leave: F, delayLeave: j, afterLeave: K } = O, ee = () => {
          h.ctx.isUnmounted ? r(S) : s(S, g, w);
        }, ge = () => {
          F(S, () => {
            ee(), K && K();
          });
        };
        j ? j(S, ee, ge) : ge();
      }
    else
      s(S, g, w);
  }, Te = (h, g, w, C = !1, T = !1) => {
    const {
      type: S,
      props: B,
      ref: O,
      children: L,
      dynamicChildren: E,
      shapeFlag: U,
      patchFlag: F,
      dirs: j,
      cacheIndex: K
    } = h;
    if (F === -2 && (T = !1), O != null && (Dt(), Fn(O, null, w, h, !0), qt()), K != null && (g.renderCache[K] = void 0), U & 256) {
      g.ctx.deactivate(h);
      return;
    }
    const ee = U & 1 && j, ge = !Nn(h);
    let ie;
    if (ge && (ie = B && B.onVnodeBeforeUnmount) && St(ie, g, h), U & 6)
      sn(h.component, w, C);
    else {
      if (U & 128) {
        h.suspense.unmount(w, C);
        return;
      }
      ee && on(h, null, g, "beforeUnmount"), U & 64 ? h.type.remove(
        h,
        g,
        w,
        it,
        C
      ) : E && // #5154
      // when v-once is used inside a block, setBlockTracking(-1) marks the
      // parent block with hasOnce: true
      // so that it doesn't take the fast path during unmount - otherwise
      // components nested in v-once are never unmounted.
      !E.hasOnce && // #1153: fast path should not be taken for non-stable (v-for) fragments
      (S !== Ne || F > 0 && F & 64) ? kt(
        E,
        g,
        w,
        !1,
        !0
      ) : (S === Ne && F & 384 || !T && U & 16) && kt(L, g, w), C && mt(h);
    }
    (ge && (ie = B && B.onVnodeUnmounted) || ee) && lt(() => {
      ie && St(ie, g, h), ee && on(h, null, g, "unmounted");
    }, w);
  }, mt = (h) => {
    const { type: g, el: w, anchor: C, transition: T } = h;
    if (g === Ne) {
      _t(w, C);
      return;
    }
    if (g === ns) {
      H(h);
      return;
    }
    const S = () => {
      r(w), T && !T.persisted && T.afterLeave && T.afterLeave();
    };
    if (h.shapeFlag & 1 && T && !T.persisted) {
      const { leave: B, delayLeave: O } = T, L = () => B(w, S);
      O ? O(h.el, S, L) : L();
    } else
      S();
  }, _t = (h, g) => {
    let w;
    for (; h !== g; )
      w = b(h), r(h), h = w;
    r(g);
  }, sn = (h, g, w) => {
    const {
      bum: C,
      scope: T,
      job: S,
      subTree: B,
      um: O,
      m: L,
      a: E,
      parent: U,
      slots: { __: F }
    } = h;
    xi(L), xi(E), C && es(C), U && J(F) && F.forEach((j) => {
      U.renderCache[j] = void 0;
    }), T.stop(), S && (S.flags |= 8, Te(B, h, g, w)), O && lt(O, g), lt(() => {
      h.isUnmounted = !0;
    }, g), g && g.pendingBranch && !g.isUnmounted && h.asyncDep && !h.asyncResolved && h.suspenseId === g.pendingId && (g.deps--, g.deps === 0 && g.resolve());
  }, kt = (h, g, w, C = !1, T = !1, S = 0) => {
    for (let B = S; B < h.length; B++)
      Te(h[B], g, w, C, T);
  }, ct = (h) => {
    if (h.shapeFlag & 6)
      return ct(h.component.subTree);
    if (h.shapeFlag & 128)
      return h.suspense.next();
    const g = b(h.anchor || h.el), w = g && g[$a];
    return w ? b(w) : g;
  };
  let st = !1;
  const rt = (h, g, w) => {
    h == null ? g._vnode && Te(g._vnode, null, null, !0) : q(
      g._vnode || null,
      h,
      g,
      null,
      null,
      null,
      w
    ), g._vnode = h, st || (st = !0, _i(), Io(), st = !1);
  }, it = {
    p: q,
    um: Te,
    m: W,
    r: mt,
    mt: Ve,
    mc: je,
    pc: re,
    pbc: Ze,
    n: ct,
    o: e
  };
  return {
    render: rt,
    hydrate: void 0,
    createApp: nc(rt)
  };
}
function js({ type: e, props: t }, n) {
  return n === "svg" && e === "foreignObject" || n === "mathml" && e === "annotation-xml" && t && t.encoding && t.encoding.includes("html") ? void 0 : n;
}
function ln({ effect: e, job: t }, n) {
  n ? (e.flags |= 32, t.flags |= 4) : (e.flags &= -33, t.flags &= -5);
}
function hc(e, t) {
  return (!e || e && !e.pendingBranch) && t && !t.persisted;
}
function Zo(e, t, n = !1) {
  const s = e.children, r = t.children;
  if (J(s) && J(r))
    for (let i = 0; i < s.length; i++) {
      const o = s[i];
      let l = r[i];
      l.shapeFlag & 1 && !l.dynamicChildren && ((l.patchFlag <= 0 || l.patchFlag === 32) && (l = r[i] = Gt(r[i]), l.el = o.el), !n && l.patchFlag !== -2 && Zo(o, l)), l.type === As && (l.el = o.el), l.type === en && !l.el && (l.el = o.el);
    }
}
function dc(e) {
  const t = e.slice(), n = [0];
  let s, r, i, o, l;
  const a = e.length;
  for (s = 0; s < a; s++) {
    const u = e[s];
    if (u !== 0) {
      if (r = n[n.length - 1], e[r] < u) {
        t[s] = r, n.push(s);
        continue;
      }
      for (i = 0, o = n.length - 1; i < o; )
        l = i + o >> 1, e[n[l]] < u ? i = l + 1 : o = l;
      u < e[n[i]] && (i > 0 && (t[s] = n[i - 1]), n[i] = s);
    }
  }
  for (i = n.length, o = n[i - 1]; i-- > 0; )
    n[i] = o, o = t[o];
  return n;
}
function Go(e) {
  const t = e.subTree.component;
  if (t)
    return t.asyncDep && !t.asyncResolved ? t : Go(t);
}
function xi(e) {
  if (e)
    for (let t = 0; t < e.length; t++)
      e[t].flags |= 8;
}
const pc = Symbol.for("v-scx"), gc = () => ts(pc);
function un(e, t, n) {
  return Yo(e, t, n);
}
function Yo(e, t, n = Ce) {
  const { immediate: s, deep: r, flush: i, once: o } = n, l = Ke({}, n), a = t && s || !t && i !== "post";
  let u;
  if (jn) {
    if (i === "sync") {
      const I = gc();
      u = I.__watcherHandles || (I.__watcherHandles = []);
    } else if (!a) {
      const I = () => {
      };
      return I.stop = At, I.resume = At, I.pause = At, I;
    }
  }
  const f = Qe;
  l.call = (I, N, q) => Ot(I, f, N, q);
  let _ = !1;
  i === "post" ? l.scheduler = (I) => {
    lt(I, f && f.suspense);
  } : i !== "sync" && (_ = !0, l.scheduler = (I, N) => {
    N ? I() : Pr(I);
  }), l.augmentJob = (I) => {
    t && (I.flags |= 4), _ && (I.flags |= 2, f && (I.id = f.uid, I.i = f));
  };
  const b = Ra(e, t, l);
  return jn && (u ? u.push(b) : a && b()), b;
}
function mc(e, t, n) {
  const s = this.proxy, r = De(e) ? e.includes(".") ? Jo(s, e) : () => s[e] : e.bind(s, s);
  let i;
  Q(t) ? i = t : (i = t.handler, n = t);
  const o = zn(this), l = Yo(r, i.bind(s), n);
  return o(), l;
}
function Jo(e, t) {
  const n = t.split(".");
  return () => {
    let s = e;
    for (let r = 0; r < n.length && s; r++)
      s = s[n[r]];
    return s;
  };
}
const _c = (e, t) => t === "modelValue" || t === "model-value" ? e.modelModifiers : e[`${t}Modifiers`] || e[`${Qt(t)}Modifiers`] || e[`${nn(t)}Modifiers`];
function yc(e, t, ...n) {
  if (e.isUnmounted) return;
  const s = e.vnode.props || Ce;
  let r = n;
  const i = t.startsWith("update:"), o = i && _c(s, t.slice(7));
  o && (o.trim && (r = n.map((f) => De(f) ? f.trim() : f)), o.number && (r = n.map(tr)));
  let l, a = s[l = Ms(t)] || // also try camelCase event handler (#2249)
  s[l = Ms(Qt(t))];
  !a && i && (a = s[l = Ms(nn(t))]), a && Ot(
    a,
    e,
    6,
    r
  );
  const u = s[l + "Once"];
  if (u) {
    if (!e.emitted)
      e.emitted = {};
    else if (e.emitted[l])
      return;
    e.emitted[l] = !0, Ot(
      u,
      e,
      6,
      r
    );
  }
}
function Qo(e, t, n = !1) {
  const s = t.emitsCache, r = s.get(e);
  if (r !== void 0)
    return r;
  const i = e.emits;
  let o = {}, l = !1;
  if (!Q(e)) {
    const a = (u) => {
      const f = Qo(u, t, !0);
      f && (l = !0, Ke(o, f));
    };
    !n && t.mixins.length && t.mixins.forEach(a), e.extends && a(e.extends), e.mixins && e.mixins.forEach(a);
  }
  return !i && !l ? ($e(e) && s.set(e, null), null) : (J(i) ? i.forEach((a) => o[a] = null) : Ke(o, i), $e(e) && s.set(e, o), o);
}
function Es(e, t) {
  return !e || !bs(t) ? !1 : (t = t.slice(2).replace(/Once$/, ""), _e(e, t[0].toLowerCase() + t.slice(1)) || _e(e, nn(t)) || _e(e, t));
}
function Si(e) {
  const {
    type: t,
    vnode: n,
    proxy: s,
    withProxy: r,
    propsOptions: [i],
    slots: o,
    attrs: l,
    emit: a,
    render: u,
    renderCache: f,
    props: _,
    data: b,
    setupState: I,
    ctx: N,
    inheritAttrs: q
  } = e, we = ds(e);
  let ne, de;
  try {
    if (n.shapeFlag & 4) {
      const H = r || s, oe = H;
      ne = Et(
        u.call(
          oe,
          H,
          f,
          _,
          I,
          b,
          N
        )
      ), de = l;
    } else {
      const H = t;
      ne = Et(
        H.length > 1 ? H(
          _,
          { attrs: l, slots: o, emit: a }
        ) : H(
          _,
          null
        )
      ), de = t.props ? l : vc(l);
    }
  } catch (H) {
    Mn.length = 0, Cs(H, e, 1), ne = Rt(en);
  }
  let pe = ne;
  if (de && q !== !1) {
    const H = Object.keys(de), { shapeFlag: oe } = pe;
    H.length && oe & 7 && (i && H.some(kr) && (de = bc(
      de,
      i
    )), pe = kn(pe, de, !1, !0));
  }
  return n.dirs && (pe = kn(pe, null, !1, !0), pe.dirs = pe.dirs ? pe.dirs.concat(n.dirs) : n.dirs), n.transition && $r(pe, n.transition), ne = pe, ds(we), ne;
}
const vc = (e) => {
  let t;
  for (const n in e)
    (n === "class" || n === "style" || bs(n)) && ((t || (t = {}))[n] = e[n]);
  return t;
}, bc = (e, t) => {
  const n = {};
  for (const s in e)
    (!kr(s) || !(s.slice(9) in t)) && (n[s] = e[s]);
  return n;
};
function wc(e, t, n) {
  const { props: s, children: r, component: i } = e, { props: o, children: l, patchFlag: a } = t, u = i.emitsOptions;
  if (t.dirs || t.transition)
    return !0;
  if (n && a >= 0) {
    if (a & 1024)
      return !0;
    if (a & 16)
      return s ? Ci(s, o, u) : !!o;
    if (a & 8) {
      const f = t.dynamicProps;
      for (let _ = 0; _ < f.length; _++) {
        const b = f[_];
        if (o[b] !== s[b] && !Es(u, b))
          return !0;
      }
    }
  } else
    return (r || l) && (!l || !l.$stable) ? !0 : s === o ? !1 : s ? o ? Ci(s, o, u) : !0 : !!o;
  return !1;
}
function Ci(e, t, n) {
  const s = Object.keys(t);
  if (s.length !== Object.keys(e).length)
    return !0;
  for (let r = 0; r < s.length; r++) {
    const i = s[r];
    if (t[i] !== e[i] && !Es(n, i))
      return !0;
  }
  return !1;
}
function kc({ vnode: e, parent: t }, n) {
  for (; t; ) {
    const s = t.subTree;
    if (s.suspense && s.suspense.activeBranch === e && (s.el = e.el), s === e)
      (e = t.vnode).el = n, t = t.parent;
    else
      break;
  }
}
const Xo = (e) => e.__isSuspense;
function xc(e, t) {
  t && t.pendingBranch ? J(e) ? t.effects.push(...e) : t.effects.push(e) : La(e);
}
const Ne = Symbol.for("v-fgt"), As = Symbol.for("v-txt"), en = Symbol.for("v-cmt"), ns = Symbol.for("v-stc"), Mn = [];
let at = null;
function P(e = !1) {
  Mn.push(at = e ? null : []);
}
function Sc() {
  Mn.pop(), at = Mn[Mn.length - 1] || null;
}
let Un = 1;
function Ti(e, t = !1) {
  Un += e, e < 0 && at && t && (at.hasOnce = !0);
}
function el(e) {
  return e.dynamicChildren = Un > 0 ? at || _n : null, Sc(), Un > 0 && at && at.push(e), e;
}
function $(e, t, n, s, r, i) {
  return el(
    x(
      e,
      t,
      n,
      s,
      r,
      i,
      !0
    )
  );
}
function Cc(e, t, n, s, r) {
  return el(
    Rt(
      e,
      t,
      n,
      s,
      r,
      !0
    )
  );
}
function tl(e) {
  return e ? e.__v_isVNode === !0 : !1;
}
function Cn(e, t) {
  return e.type === t.type && e.key === t.key;
}
const nl = ({ key: e }) => e ?? null, ss = ({
  ref: e,
  ref_key: t,
  ref_for: n
}) => (typeof e == "number" && (e = "" + e), e != null ? De(e) || ze(e) || Q(e) ? { i: ht, r: e, k: t, f: !!n } : e : null);
function x(e, t = null, n = null, s = 0, r = null, i = e === Ne ? 0 : 1, o = !1, l = !1) {
  const a = {
    __v_isVNode: !0,
    __v_skip: !0,
    type: e,
    props: t,
    key: t && nl(t),
    ref: t && ss(t),
    scopeId: Lo,
    slotScopeIds: null,
    children: n,
    component: null,
    suspense: null,
    ssContent: null,
    ssFallback: null,
    dirs: null,
    transition: null,
    el: null,
    anchor: null,
    target: null,
    targetStart: null,
    targetAnchor: null,
    staticCount: 0,
    shapeFlag: i,
    patchFlag: s,
    dynamicProps: r,
    dynamicChildren: null,
    appContext: null,
    ctx: ht
  };
  return l ? (Mr(a, n), i & 128 && e.normalize(a)) : n && (a.shapeFlag |= De(n) ? 8 : 16), Un > 0 && // avoid a block node from tracking itself
  !o && // has current parent block
  at && // presence of a patch flag indicates this node needs patching on updates.
  // component nodes also should always be patched, because even if the
  // component doesn't need to update, it needs to persist the instance on to
  // the next vnode so that it can be properly unmounted later.
  (a.patchFlag > 0 || i & 6) && // the EVENTS flag is only for hydration and if it is the only flag, the
  // vnode should not be considered dynamic due to handler caching.
  a.patchFlag !== 32 && at.push(a), a;
}
const Rt = Tc;
function Tc(e, t = null, n = null, s = 0, r = null, i = !1) {
  if ((!e || e === Za) && (e = en), tl(e)) {
    const l = kn(
      e,
      t,
      !0
      /* mergeRef: true */
    );
    return n && Mr(l, n), Un > 0 && !i && at && (l.shapeFlag & 6 ? at[at.indexOf(e)] = l : at.push(l)), l.patchFlag = -2, l;
  }
  if (Mc(e) && (e = e.__vccOpts), t) {
    t = Ec(t);
    let { class: l, style: a } = t;
    l && !De(l) && (t.class = Le(l)), $e(a) && (Lr(a) && !J(a) && (a = Ke({}, a)), t.style = be(a));
  }
  const o = De(e) ? 1 : Xo(e) ? 128 : Fa(e) ? 64 : $e(e) ? 4 : Q(e) ? 2 : 0;
  return x(
    e,
    t,
    n,
    s,
    r,
    o,
    i,
    !0
  );
}
function Ec(e) {
  return e ? Lr(e) || Ho(e) ? Ke({}, e) : e : null;
}
function kn(e, t, n = !1, s = !1) {
  const { props: r, ref: i, patchFlag: o, children: l, transition: a } = e, u = t ? Rc(r || {}, t) : r, f = {
    __v_isVNode: !0,
    __v_skip: !0,
    type: e.type,
    props: u,
    key: u && nl(u),
    ref: t && t.ref ? (
      // #2078 in the case of <component :is="vnode" ref="extra"/>
      // if the vnode itself already has a ref, cloneVNode will need to merge
      // the refs so the single vnode can be set on multiple refs
      n && i ? J(i) ? i.concat(ss(t)) : [i, ss(t)] : ss(t)
    ) : i,
    scopeId: e.scopeId,
    slotScopeIds: e.slotScopeIds,
    children: l,
    target: e.target,
    targetStart: e.targetStart,
    targetAnchor: e.targetAnchor,
    staticCount: e.staticCount,
    shapeFlag: e.shapeFlag,
    // if the vnode is cloned with extra props, we can no longer assume its
    // existing patch flag to be reliable and need to add the FULL_PROPS flag.
    // note: preserve flag for fragments since they use the flag for children
    // fast paths only.
    patchFlag: t && e.type !== Ne ? o === -1 ? 16 : o | 16 : o,
    dynamicProps: e.dynamicProps,
    dynamicChildren: e.dynamicChildren,
    appContext: e.appContext,
    dirs: e.dirs,
    transition: a,
    // These should technically only be non-null on mounted VNodes. However,
    // they *should* be copied for kept-alive vnodes. So we just always copy
    // them since them being non-null during a mount doesn't affect the logic as
    // they will simply be overwritten.
    component: e.component,
    suspense: e.suspense,
    ssContent: e.ssContent && kn(e.ssContent),
    ssFallback: e.ssFallback && kn(e.ssFallback),
    placeholder: e.placeholder,
    el: e.el,
    anchor: e.anchor,
    ctx: e.ctx,
    ce: e.ce
  };
  return a && s && $r(
    f,
    a.clone(f)
  ), f;
}
function yt(e = " ", t = 0) {
  return Rt(As, null, e, t);
}
function Ac(e, t) {
  const n = Rt(ns, null, e);
  return n.staticCount = t, n;
}
function le(e = "", t = !1) {
  return t ? (P(), Cc(en, null, e)) : Rt(en, null, e);
}
function Et(e) {
  return e == null || typeof e == "boolean" ? Rt(en) : J(e) ? Rt(
    Ne,
    null,
    // #3666, avoid reference pollution when reusing vnode
    e.slice()
  ) : tl(e) ? Gt(e) : Rt(As, null, String(e));
}
function Gt(e) {
  return e.el === null && e.patchFlag !== -1 || e.memo ? e : kn(e);
}
function Mr(e, t) {
  let n = 0;
  const { shapeFlag: s } = e;
  if (t == null)
    t = null;
  else if (J(t))
    n = 16;
  else if (typeof t == "object")
    if (s & 65) {
      const r = t.default;
      r && (r._c && (r._d = !1), Mr(e, r()), r._c && (r._d = !0));
      return;
    } else {
      n = 32;
      const r = t._;
      !r && !Ho(t) ? t._ctx = ht : r === 3 && ht && (ht.slots._ === 1 ? t._ = 1 : (t._ = 2, e.patchFlag |= 1024));
    }
  else Q(t) ? (t = { default: t, _ctx: ht }, n = 32) : (t = String(t), s & 64 ? (n = 16, t = [yt(t)]) : n = 8);
  e.children = t, e.shapeFlag |= n;
}
function Rc(...e) {
  const t = {};
  for (let n = 0; n < e.length; n++) {
    const s = e[n];
    for (const r in s)
      if (r === "class")
        t.class !== s.class && (t.class = Le([t.class, s.class]));
      else if (r === "style")
        t.style = be([t.style, s.style]);
      else if (bs(r)) {
        const i = t[r], o = s[r];
        o && i !== o && !(J(i) && i.includes(o)) && (t[r] = i ? [].concat(i, o) : o);
      } else r !== "" && (t[r] = s[r]);
  }
  return t;
}
function St(e, t, n, s = null) {
  Ot(e, t, 7, [
    n,
    s
  ]);
}
const Ic = Do();
let Oc = 0;
function Lc(e, t, n) {
  const s = e.type, r = (t ? t.appContext : e.appContext) || Ic, i = {
    uid: Oc++,
    vnode: e,
    type: s,
    parent: t,
    appContext: r,
    root: null,
    // to be immediately set
    next: null,
    subTree: null,
    // will be set synchronously right after creation
    effect: null,
    update: null,
    // will be set synchronously right after creation
    job: null,
    scope: new ta(
      !0
      /* detached */
    ),
    render: null,
    proxy: null,
    exposed: null,
    exposeProxy: null,
    withProxy: null,
    provides: t ? t.provides : Object.create(r.provides),
    ids: t ? t.ids : ["", 0, 0],
    accessCache: null,
    renderCache: [],
    // local resolved assets
    components: null,
    directives: null,
    // resolved props and emits options
    propsOptions: jo(s, r),
    emitsOptions: Qo(s, r),
    // emit
    emit: null,
    // to be set immediately
    emitted: null,
    // props default value
    propsDefaults: Ce,
    // inheritAttrs
    inheritAttrs: s.inheritAttrs,
    // state
    ctx: Ce,
    data: Ce,
    props: Ce,
    attrs: Ce,
    slots: Ce,
    refs: Ce,
    setupState: Ce,
    setupContext: null,
    // suspense related
    suspense: n,
    suspenseId: n ? n.pendingId : 0,
    asyncDep: null,
    asyncResolved: !1,
    // lifecycle hooks
    // not using enums here because it results in computed properties
    isMounted: !1,
    isUnmounted: !1,
    isDeactivated: !1,
    bc: null,
    c: null,
    bm: null,
    m: null,
    bu: null,
    u: null,
    um: null,
    bum: null,
    da: null,
    a: null,
    rtg: null,
    rtc: null,
    ec: null,
    sp: null
  };
  return i.ctx = { _: i }, i.root = t ? t.root : i, i.emit = yc.bind(null, i), e.ce && e.ce(i), i;
}
let Qe = null;
const Pc = () => Qe || ht;
let gs, ur;
{
  const e = xs(), t = (n, s) => {
    let r;
    return (r = e[n]) || (r = e[n] = []), r.push(s), (i) => {
      r.length > 1 ? r.forEach((o) => o(i)) : r[0](i);
    };
  };
  gs = t(
    "__VUE_INSTANCE_SETTERS__",
    (n) => Qe = n
  ), ur = t(
    "__VUE_SSR_SETTERS__",
    (n) => jn = n
  );
}
const zn = (e) => {
  const t = Qe;
  return gs(e), e.scope.on(), () => {
    e.scope.off(), gs(t);
  };
}, Ei = () => {
  Qe && Qe.scope.off(), gs(null);
};
function sl(e) {
  return e.vnode.shapeFlag & 4;
}
let jn = !1;
function $c(e, t = !1, n = !1) {
  t && ur(t);
  const { props: s, children: r } = e.vnode, i = sl(e);
  rc(e, s, i, t), ac(e, r, n || t);
  const o = i ? Fc(e, t) : void 0;
  return t && ur(!1), o;
}
function Fc(e, t) {
  const n = e.type;
  e.accessCache = /* @__PURE__ */ Object.create(null), e.proxy = new Proxy(e.ctx, Ga);
  const { setup: s } = n;
  if (s) {
    Dt();
    const r = e.setupContext = s.length > 1 ? Bc(e) : null, i = zn(e), o = Wn(
      s,
      e,
      0,
      [
        e.props,
        r
      ]
    ), l = so(o);
    if (qt(), i(), (l || e.sp) && !Nn(e) && Po(e), l) {
      if (o.then(Ei, Ei), t)
        return o.then((a) => {
          Ai(e, a);
        }).catch((a) => {
          Cs(a, e, 0);
        });
      e.asyncDep = o;
    } else
      Ai(e, o);
  } else
    rl(e);
}
function Ai(e, t, n) {
  Q(t) ? e.type.__ssrInlineRender ? e.ssrRender = t : e.render = t : $e(t) && (e.setupState = To(t)), rl(e);
}
function rl(e, t, n) {
  const s = e.type;
  e.render || (e.render = s.render || At);
  {
    const r = zn(e);
    Dt();
    try {
      Ya(e);
    } finally {
      qt(), r();
    }
  }
}
const Nc = {
  get(e, t) {
    return We(e, "get", ""), e[t];
  }
};
function Bc(e) {
  const t = (n) => {
    e.exposed = n || {};
  };
  return {
    attrs: new Proxy(e.attrs, Nc),
    slots: e.slots,
    emit: e.emit,
    expose: t
  };
}
function Rs(e) {
  return e.exposed ? e.exposeProxy || (e.exposeProxy = new Proxy(To(ka(e.exposed)), {
    get(t, n) {
      if (n in t)
        return t[n];
      if (n in Bn)
        return Bn[n](e);
    },
    has(t, n) {
      return n in t || n in Bn;
    }
  })) : e.proxy;
}
function Mc(e) {
  return Q(e) && "__vccOpts" in e;
}
const Be = (e, t) => Ea(e, t, jn), Dc = "3.5.18";
/**
* @vue/runtime-dom v3.5.18
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
let fr;
const Ri = typeof window < "u" && window.trustedTypes;
if (Ri)
  try {
    fr = /* @__PURE__ */ Ri.createPolicy("vue", {
      createHTML: (e) => e
    });
  } catch {
  }
const il = fr ? (e) => fr.createHTML(e) : (e) => e, qc = "http://www.w3.org/2000/svg", Vc = "http://www.w3.org/1998/Math/MathML", $t = typeof document < "u" ? document : null, Ii = $t && /* @__PURE__ */ $t.createElement("template"), Hc = {
  insert: (e, t, n) => {
    t.insertBefore(e, n || null);
  },
  remove: (e) => {
    const t = e.parentNode;
    t && t.removeChild(e);
  },
  createElement: (e, t, n, s) => {
    const r = t === "svg" ? $t.createElementNS(qc, e) : t === "mathml" ? $t.createElementNS(Vc, e) : n ? $t.createElement(e, { is: n }) : $t.createElement(e);
    return e === "select" && s && s.multiple != null && r.setAttribute("multiple", s.multiple), r;
  },
  createText: (e) => $t.createTextNode(e),
  createComment: (e) => $t.createComment(e),
  setText: (e, t) => {
    e.nodeValue = t;
  },
  setElementText: (e, t) => {
    e.textContent = t;
  },
  parentNode: (e) => e.parentNode,
  nextSibling: (e) => e.nextSibling,
  querySelector: (e) => $t.querySelector(e),
  setScopeId(e, t) {
    e.setAttribute(t, "");
  },
  // __UNSAFE__
  // Reason: innerHTML.
  // Static content here can only come from compiled templates.
  // As long as the user only uses trusted templates, this is safe.
  insertStaticContent(e, t, n, s, r, i) {
    const o = n ? n.previousSibling : t.lastChild;
    if (r && (r === i || r.nextSibling))
      for (; t.insertBefore(r.cloneNode(!0), n), !(r === i || !(r = r.nextSibling)); )
        ;
    else {
      Ii.innerHTML = il(
        s === "svg" ? `<svg>${e}</svg>` : s === "mathml" ? `<math>${e}</math>` : e
      );
      const l = Ii.content;
      if (s === "svg" || s === "mathml") {
        const a = l.firstChild;
        for (; a.firstChild; )
          l.appendChild(a.firstChild);
        l.removeChild(a);
      }
      t.insertBefore(l, n);
    }
    return [
      // first
      o ? o.nextSibling : t.firstChild,
      // last
      n ? n.previousSibling : t.lastChild
    ];
  }
}, Uc = Symbol("_vtc");
function jc(e, t, n) {
  const s = e[Uc];
  s && (t = (t ? [t, ...s] : [...s]).join(" ")), t == null ? e.removeAttribute("class") : n ? e.setAttribute("class", t) : e.className = t;
}
const Oi = Symbol("_vod"), Wc = Symbol("_vsh"), zc = Symbol(""), Kc = /(^|;)\s*display\s*:/;
function Zc(e, t, n) {
  const s = e.style, r = De(n);
  let i = !1;
  if (n && !r) {
    if (t)
      if (De(t))
        for (const o of t.split(";")) {
          const l = o.slice(0, o.indexOf(":")).trim();
          n[l] == null && rs(s, l, "");
        }
      else
        for (const o in t)
          n[o] == null && rs(s, o, "");
    for (const o in n)
      o === "display" && (i = !0), rs(s, o, n[o]);
  } else if (r) {
    if (t !== n) {
      const o = s[zc];
      o && (n += ";" + o), s.cssText = n, i = Kc.test(n);
    }
  } else t && e.removeAttribute("style");
  Oi in e && (e[Oi] = i ? s.display : "", e[Wc] && (s.display = "none"));
}
const Li = /\s*!important$/;
function rs(e, t, n) {
  if (J(n))
    n.forEach((s) => rs(e, t, s));
  else if (n == null && (n = ""), t.startsWith("--"))
    e.setProperty(t, n);
  else {
    const s = Gc(e, t);
    Li.test(n) ? e.setProperty(
      nn(s),
      n.replace(Li, ""),
      "important"
    ) : e[s] = n;
  }
}
const Pi = ["Webkit", "Moz", "ms"], Ws = {};
function Gc(e, t) {
  const n = Ws[t];
  if (n)
    return n;
  let s = Qt(t);
  if (s !== "filter" && s in e)
    return Ws[t] = s;
  s = oo(s);
  for (let r = 0; r < Pi.length; r++) {
    const i = Pi[r] + s;
    if (i in e)
      return Ws[t] = i;
  }
  return t;
}
const $i = "http://www.w3.org/1999/xlink";
function Fi(e, t, n, s, r, i = ea(t)) {
  s && t.startsWith("xlink:") ? n == null ? e.removeAttributeNS($i, t.slice(6, t.length)) : e.setAttributeNS($i, t, n) : n == null || i && !lo(n) ? e.removeAttribute(t) : e.setAttribute(
    t,
    i ? "" : tn(n) ? String(n) : n
  );
}
function Ni(e, t, n, s, r) {
  if (t === "innerHTML" || t === "textContent") {
    n != null && (e[t] = t === "innerHTML" ? il(n) : n);
    return;
  }
  const i = e.tagName;
  if (t === "value" && i !== "PROGRESS" && // custom elements may use _value internally
  !i.includes("-")) {
    const l = i === "OPTION" ? e.getAttribute("value") || "" : e.value, a = n == null ? (
      // #11647: value should be set as empty string for null and undefined,
      // but <input type="checkbox"> should be set as 'on'.
      e.type === "checkbox" ? "on" : ""
    ) : String(n);
    (l !== a || !("_value" in e)) && (e.value = a), n == null && e.removeAttribute(t), e._value = n;
    return;
  }
  let o = !1;
  if (n === "" || n == null) {
    const l = typeof e[t];
    l === "boolean" ? n = lo(n) : n == null && l === "string" ? (n = "", o = !0) : l === "number" && (n = 0, o = !0);
  }
  try {
    e[t] = n;
  } catch {
  }
  o && e.removeAttribute(r || t);
}
function mn(e, t, n, s) {
  e.addEventListener(t, n, s);
}
function Yc(e, t, n, s) {
  e.removeEventListener(t, n, s);
}
const Bi = Symbol("_vei");
function Jc(e, t, n, s, r = null) {
  const i = e[Bi] || (e[Bi] = {}), o = i[t];
  if (s && o)
    o.value = s;
  else {
    const [l, a] = Qc(t);
    if (s) {
      const u = i[t] = tu(
        s,
        r
      );
      mn(e, l, u, a);
    } else o && (Yc(e, l, o, a), i[t] = void 0);
  }
}
const Mi = /(?:Once|Passive|Capture)$/;
function Qc(e) {
  let t;
  if (Mi.test(e)) {
    t = {};
    let s;
    for (; s = e.match(Mi); )
      e = e.slice(0, e.length - s[0].length), t[s[0].toLowerCase()] = !0;
  }
  return [e[2] === ":" ? e.slice(3) : nn(e.slice(2)), t];
}
let zs = 0;
const Xc = /* @__PURE__ */ Promise.resolve(), eu = () => zs || (Xc.then(() => zs = 0), zs = Date.now());
function tu(e, t) {
  const n = (s) => {
    if (!s._vts)
      s._vts = Date.now();
    else if (s._vts <= n.attached)
      return;
    Ot(
      nu(s, n.value),
      t,
      5,
      [s]
    );
  };
  return n.value = e, n.attached = eu(), n;
}
function nu(e, t) {
  if (J(t)) {
    const n = e.stopImmediatePropagation;
    return e.stopImmediatePropagation = () => {
      n.call(e), e._stopped = !0;
    }, t.map(
      (s) => (r) => !r._stopped && s && s(r)
    );
  } else
    return t;
}
const Di = (e) => e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 && // lowercase letter
e.charCodeAt(2) > 96 && e.charCodeAt(2) < 123, su = (e, t, n, s, r, i) => {
  const o = r === "svg";
  t === "class" ? jc(e, s, o) : t === "style" ? Zc(e, n, s) : bs(t) ? kr(t) || Jc(e, t, n, s, i) : (t[0] === "." ? (t = t.slice(1), !0) : t[0] === "^" ? (t = t.slice(1), !1) : ru(e, t, s, o)) ? (Ni(e, t, s), !e.tagName.includes("-") && (t === "value" || t === "checked" || t === "selected") && Fi(e, t, s, o, i, t !== "value")) : /* #11081 force set props for possible async custom element */ e._isVueCE && (/[A-Z]/.test(t) || !De(s)) ? Ni(e, Qt(t), s, i, t) : (t === "true-value" ? e._trueValue = s : t === "false-value" && (e._falseValue = s), Fi(e, t, s, o));
};
function ru(e, t, n, s) {
  if (s)
    return !!(t === "innerHTML" || t === "textContent" || t in e && Di(t) && Q(n));
  if (t === "spellcheck" || t === "draggable" || t === "translate" || t === "autocorrect" || t === "form" || t === "list" && e.tagName === "INPUT" || t === "type" && e.tagName === "TEXTAREA")
    return !1;
  if (t === "width" || t === "height") {
    const r = e.tagName;
    if (r === "IMG" || r === "VIDEO" || r === "CANVAS" || r === "SOURCE")
      return !1;
  }
  return Di(t) && De(n) ? !1 : t in e;
}
const qi = (e) => {
  const t = e.props["onUpdate:modelValue"] || !1;
  return J(t) ? (n) => es(t, n) : t;
};
function iu(e) {
  e.target.composing = !0;
}
function Vi(e) {
  const t = e.target;
  t.composing && (t.composing = !1, t.dispatchEvent(new Event("input")));
}
const Ks = Symbol("_assign"), an = {
  created(e, { modifiers: { lazy: t, trim: n, number: s } }, r) {
    e[Ks] = qi(r);
    const i = s || r.props && r.props.type === "number";
    mn(e, t ? "change" : "input", (o) => {
      if (o.target.composing) return;
      let l = e.value;
      n && (l = l.trim()), i && (l = tr(l)), e[Ks](l);
    }), n && mn(e, "change", () => {
      e.value = e.value.trim();
    }), t || (mn(e, "compositionstart", iu), mn(e, "compositionend", Vi), mn(e, "change", Vi));
  },
  // set value on mounted so it's after min/max for type="range"
  mounted(e, { value: t }) {
    e.value = t ?? "";
  },
  beforeUpdate(e, { value: t, oldValue: n, modifiers: { lazy: s, trim: r, number: i } }, o) {
    if (e[Ks] = qi(o), e.composing) return;
    const l = (i || e.type === "number") && !/^0\d/.test(e.value) ? tr(e.value) : e.value, a = t ?? "";
    l !== a && (document.activeElement === e && e.type !== "range" && (s && t === n || r && e.value.trim() === a) || (e.value = a));
  }
}, ou = ["ctrl", "shift", "alt", "meta"], lu = {
  stop: (e) => e.stopPropagation(),
  prevent: (e) => e.preventDefault(),
  self: (e) => e.target !== e.currentTarget,
  ctrl: (e) => !e.ctrlKey,
  shift: (e) => !e.shiftKey,
  alt: (e) => !e.altKey,
  meta: (e) => !e.metaKey,
  left: (e) => "button" in e && e.button !== 0,
  middle: (e) => "button" in e && e.button !== 1,
  right: (e) => "button" in e && e.button !== 2,
  exact: (e, t) => ou.some((n) => e[`${n}Key`] && !t.includes(n))
}, Hi = (e, t) => {
  const n = e._withMods || (e._withMods = {}), s = t.join(".");
  return n[s] || (n[s] = (r, ...i) => {
    for (let o = 0; o < t.length; o++) {
      const l = lu[t[o]];
      if (l && l(r, t)) return;
    }
    return e(r, ...i);
  });
}, au = {
  esc: "escape",
  space: " ",
  up: "arrow-up",
  left: "arrow-left",
  right: "arrow-right",
  down: "arrow-down",
  delete: "backspace"
}, Ui = (e, t) => {
  const n = e._withKeys || (e._withKeys = {}), s = t.join(".");
  return n[s] || (n[s] = (r) => {
    if (!("key" in r))
      return;
    const i = nn(r.key);
    if (t.some(
      (o) => o === i || au[o] === i
    ))
      return e(r);
  });
}, cu = /* @__PURE__ */ Ke({ patchProp: su }, Hc);
let ji;
function uu() {
  return ji || (ji = uc(cu));
}
const fu = (...e) => {
  const t = uu().createApp(...e), { mount: n } = t;
  return t.mount = (s) => {
    const r = du(s);
    if (!r) return;
    const i = t._component;
    !Q(i) && !i.render && !i.template && (i.template = r.innerHTML), r.nodeType === 1 && (r.textContent = "");
    const o = n(r, !1, hu(r));
    return r instanceof Element && (r.removeAttribute("v-cloak"), r.setAttribute("data-v-app", "")), o;
  }, t;
};
function hu(e) {
  if (e instanceof SVGElement)
    return "svg";
  if (typeof MathMLElement == "function" && e instanceof MathMLElement)
    return "mathml";
}
function du(e) {
  return De(e) ? document.querySelector(e) : e;
}
const Kt = (e) => {
  const t = e.replace("#", ""), n = parseInt(t.substr(0, 2), 16), s = parseInt(t.substr(2, 2), 16), r = parseInt(t.substr(4, 2), 16);
  return (n * 299 + s * 587 + r * 114) / 1e3 < 128;
}, pu = (e, t) => {
  const n = e.replace("#", ""), s = parseInt(n.substr(0, 2), 16), r = parseInt(n.substr(2, 2), 16), i = parseInt(n.substr(4, 2), 16), o = Kt(e), l = o ? Math.min(255, s + t) : Math.max(0, s - t), a = o ? Math.min(255, r + t) : Math.max(0, r - t), u = o ? Math.min(255, i + t) : Math.max(0, i - t);
  return `#${l.toString(16).padStart(2, "0")}${a.toString(16).padStart(2, "0")}${u.toString(16).padStart(2, "0")}`;
}, Tn = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e), gu = (e) => {
  switch (e.type) {
    case "connection_error":
      return "Unable to connect. Please try again later.";
    case "auth_error":
      return "Authentication failed. Please refresh the page.";
    case "chat_error":
      return "Unable to send message. Please try again.";
    case "ai_config_missing":
      return "Chat service is currently unavailable.";
    default:
      return e.error || "Something went wrong. Please try again.";
  }
};
function Dr() {
  return {
    async: !1,
    breaks: !1,
    extensions: null,
    gfm: !0,
    hooks: null,
    pedantic: !1,
    renderer: null,
    silent: !1,
    tokenizer: null,
    walkTokens: null
  };
}
var dn = Dr();
function ol(e) {
  dn = e;
}
var Dn = { exec: () => null };
function ye(e, t = "") {
  let n = typeof e == "string" ? e : e.source;
  const s = {
    replace: (r, i) => {
      let o = typeof i == "string" ? i : i.source;
      return o = o.replace(Xe.caret, "$1"), n = n.replace(r, o), s;
    },
    getRegex: () => new RegExp(n, t)
  };
  return s;
}
var Xe = {
  codeRemoveIndent: /^(?: {1,4}| {0,3}\t)/gm,
  outputLinkReplace: /\\([\[\]])/g,
  indentCodeCompensation: /^(\s+)(?:```)/,
  beginningSpace: /^\s+/,
  endingHash: /#$/,
  startingSpaceChar: /^ /,
  endingSpaceChar: / $/,
  nonSpaceChar: /[^ ]/,
  newLineCharGlobal: /\n/g,
  tabCharGlobal: /\t/g,
  multipleSpaceGlobal: /\s+/g,
  blankLine: /^[ \t]*$/,
  doubleBlankLine: /\n[ \t]*\n[ \t]*$/,
  blockquoteStart: /^ {0,3}>/,
  blockquoteSetextReplace: /\n {0,3}((?:=+|-+) *)(?=\n|$)/g,
  blockquoteSetextReplace2: /^ {0,3}>[ \t]?/gm,
  listReplaceTabs: /^\t+/,
  listReplaceNesting: /^ {1,4}(?=( {4})*[^ ])/g,
  listIsTask: /^\[[ xX]\] /,
  listReplaceTask: /^\[[ xX]\] +/,
  anyLine: /\n.*\n/,
  hrefBrackets: /^<(.*)>$/,
  tableDelimiter: /[:|]/,
  tableAlignChars: /^\||\| *$/g,
  tableRowBlankLine: /\n[ \t]*$/,
  tableAlignRight: /^ *-+: *$/,
  tableAlignCenter: /^ *:-+: *$/,
  tableAlignLeft: /^ *:-+ *$/,
  startATag: /^<a /i,
  endATag: /^<\/a>/i,
  startPreScriptTag: /^<(pre|code|kbd|script)(\s|>)/i,
  endPreScriptTag: /^<\/(pre|code|kbd|script)(\s|>)/i,
  startAngleBracket: /^</,
  endAngleBracket: />$/,
  pedanticHrefTitle: /^([^'"]*[^\s])\s+(['"])(.*)\2/,
  unicodeAlphaNumeric: /[\p{L}\p{N}]/u,
  escapeTest: /[&<>"']/,
  escapeReplace: /[&<>"']/g,
  escapeTestNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/,
  escapeReplaceNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g,
  unescapeTest: /&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/ig,
  caret: /(^|[^\[])\^/g,
  percentDecode: /%25/g,
  findPipe: /\|/g,
  splitPipe: / \|/,
  slashPipe: /\\\|/g,
  carriageReturn: /\r\n|\r/g,
  spaceLine: /^ +$/gm,
  notSpaceStart: /^\S*/,
  endingNewline: /\n$/,
  listItemRegex: (e) => new RegExp(`^( {0,3}${e})((?:[	 ][^\\n]*)?(?:\\n|$))`),
  nextBulletRegex: (e) => new RegExp(`^ {0,${Math.min(3, e - 1)}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`),
  hrRegex: (e) => new RegExp(`^ {0,${Math.min(3, e - 1)}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`),
  fencesBeginRegex: (e) => new RegExp(`^ {0,${Math.min(3, e - 1)}}(?:\`\`\`|~~~)`),
  headingBeginRegex: (e) => new RegExp(`^ {0,${Math.min(3, e - 1)}}#`),
  htmlBeginRegex: (e) => new RegExp(`^ {0,${Math.min(3, e - 1)}}<(?:[a-z].*>|!--)`, "i")
}, mu = /^(?:[ \t]*(?:\n|$))+/, _u = /^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/, yu = /^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/, Kn = /^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/, vu = /^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/, qr = /(?:[*+-]|\d{1,9}[.)])/, ll = /^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html|table))+?)\n {0,3}(=+|-+) *(?:\n+|$)/, al = ye(ll).replace(/bull/g, qr).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/\|table/g, "").getRegex(), bu = ye(ll).replace(/bull/g, qr).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/table/g, / {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/).getRegex(), Vr = /^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/, wu = /^[^\n]+/, Hr = /(?!\s*\])(?:\\.|[^\[\]\\])+/, ku = ye(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label", Hr).replace("title", /(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex(), xu = ye(/^( {0,3}bull)([ \t][^\n]+?)?(?:\n|$)/).replace(/bull/g, qr).getRegex(), Is = "address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul", Ur = /<!--(?:-?>|[\s\S]*?(?:-->|$))/, Su = ye(
  "^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))",
  "i"
).replace("comment", Ur).replace("tag", Is).replace("attribute", / +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(), cl = ye(Vr).replace("hr", Kn).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("|table", "").replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", Is).getRegex(), Cu = ye(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph", cl).getRegex(), jr = {
  blockquote: Cu,
  code: _u,
  def: ku,
  fences: yu,
  heading: vu,
  hr: Kn,
  html: Su,
  lheading: al,
  list: xu,
  newline: mu,
  paragraph: cl,
  table: Dn,
  text: wu
}, Wi = ye(
  "^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)"
).replace("hr", Kn).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("blockquote", " {0,3}>").replace("code", "(?: {4}| {0,3}	)[^\\n]").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", Is).getRegex(), Tu = {
  ...jr,
  lheading: bu,
  table: Wi,
  paragraph: ye(Vr).replace("hr", Kn).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("table", Wi).replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", Is).getRegex()
}, Eu = {
  ...jr,
  html: ye(
    `^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`
  ).replace("comment", Ur).replace(/tag/g, "(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(),
  def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,
  heading: /^(#{1,6})(.*)(?:\n+|$)/,
  fences: Dn,
  // fences not supported
  lheading: /^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/,
  paragraph: ye(Vr).replace("hr", Kn).replace("heading", ` *#{1,6} *[^
]`).replace("lheading", al).replace("|table", "").replace("blockquote", " {0,3}>").replace("|fences", "").replace("|list", "").replace("|html", "").replace("|tag", "").getRegex()
}, Au = /^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/, Ru = /^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/, ul = /^( {2,}|\\)\n(?!\s*$)/, Iu = /^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/, Os = /[\p{P}\p{S}]/u, Wr = /[\s\p{P}\p{S}]/u, fl = /[^\s\p{P}\p{S}]/u, Ou = ye(/^((?![*_])punctSpace)/, "u").replace(/punctSpace/g, Wr).getRegex(), hl = /(?!~)[\p{P}\p{S}]/u, Lu = /(?!~)[\s\p{P}\p{S}]/u, Pu = /(?:[^\s\p{P}\p{S}]|~)/u, $u = /\[[^[\]]*?\]\((?:\\.|[^\\\(\)]|\((?:\\.|[^\\\(\)])*\))*\)|`[^`]*?`|<[^<>]*?>/g, dl = /^(?:\*+(?:((?!\*)punct)|[^\s*]))|^_+(?:((?!_)punct)|([^\s_]))/, Fu = ye(dl, "u").replace(/punct/g, Os).getRegex(), Nu = ye(dl, "u").replace(/punct/g, hl).getRegex(), pl = "^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)", Bu = ye(pl, "gu").replace(/notPunctSpace/g, fl).replace(/punctSpace/g, Wr).replace(/punct/g, Os).getRegex(), Mu = ye(pl, "gu").replace(/notPunctSpace/g, Pu).replace(/punctSpace/g, Lu).replace(/punct/g, hl).getRegex(), Du = ye(
  "^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)",
  "gu"
).replace(/notPunctSpace/g, fl).replace(/punctSpace/g, Wr).replace(/punct/g, Os).getRegex(), qu = ye(/\\(punct)/, "gu").replace(/punct/g, Os).getRegex(), Vu = ye(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme", /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email", /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(), Hu = ye(Ur).replace("(?:-->|$)", "-->").getRegex(), Uu = ye(
  "^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>"
).replace("comment", Hu).replace("attribute", /\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex(), ms = /(?:\[(?:\\.|[^\[\]\\])*\]|\\.|`[^`]*`|[^\[\]\\`])*?/, ju = ye(/^!?\[(label)\]\(\s*(href)(?:(?:[ \t]*(?:\n[ \t]*)?)(title))?\s*\)/).replace("label", ms).replace("href", /<(?:\\.|[^\n<>\\])+>|[^ \t\n\x00-\x1f]*/).replace("title", /"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex(), gl = ye(/^!?\[(label)\]\[(ref)\]/).replace("label", ms).replace("ref", Hr).getRegex(), ml = ye(/^!?\[(ref)\](?:\[\])?/).replace("ref", Hr).getRegex(), Wu = ye("reflink|nolink(?!\\()", "g").replace("reflink", gl).replace("nolink", ml).getRegex(), zr = {
  _backpedal: Dn,
  // only used for GFM url
  anyPunctuation: qu,
  autolink: Vu,
  blockSkip: $u,
  br: ul,
  code: Ru,
  del: Dn,
  emStrongLDelim: Fu,
  emStrongRDelimAst: Bu,
  emStrongRDelimUnd: Du,
  escape: Au,
  link: ju,
  nolink: ml,
  punctuation: Ou,
  reflink: gl,
  reflinkSearch: Wu,
  tag: Uu,
  text: Iu,
  url: Dn
}, zu = {
  ...zr,
  link: ye(/^!?\[(label)\]\((.*?)\)/).replace("label", ms).getRegex(),
  reflink: ye(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label", ms).getRegex()
}, hr = {
  ...zr,
  emStrongRDelimAst: Mu,
  emStrongLDelim: Nu,
  url: ye(/^((?:ftp|https?):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/, "i").replace("email", /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/).getRegex(),
  _backpedal: /(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/,
  del: /^(~~?)(?=[^\s~])((?:\\.|[^\\])*?(?:\\.|[^\s~\\]))\1(?=[^~]|$)/,
  text: /^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|https?:\/\/|ftp:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/
}, Ku = {
  ...hr,
  br: ye(ul).replace("{2,}", "*").getRegex(),
  text: ye(hr.text).replace("\\b_", "\\b_| {2,}\\n").replace(/\{2,\}/g, "*").getRegex()
}, Jn = {
  normal: jr,
  gfm: Tu,
  pedantic: Eu
}, En = {
  normal: zr,
  gfm: hr,
  breaks: Ku,
  pedantic: zu
}, Zu = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;"
}, zi = (e) => Zu[e];
function Ct(e, t) {
  if (t) {
    if (Xe.escapeTest.test(e))
      return e.replace(Xe.escapeReplace, zi);
  } else if (Xe.escapeTestNoEncode.test(e))
    return e.replace(Xe.escapeReplaceNoEncode, zi);
  return e;
}
function Ki(e) {
  try {
    e = encodeURI(e).replace(Xe.percentDecode, "%");
  } catch {
    return null;
  }
  return e;
}
function Zi(e, t) {
  var i;
  const n = e.replace(Xe.findPipe, (o, l, a) => {
    let u = !1, f = l;
    for (; --f >= 0 && a[f] === "\\"; ) u = !u;
    return u ? "|" : " |";
  }), s = n.split(Xe.splitPipe);
  let r = 0;
  if (s[0].trim() || s.shift(), s.length > 0 && !((i = s.at(-1)) != null && i.trim()) && s.pop(), t)
    if (s.length > t)
      s.splice(t);
    else
      for (; s.length < t; ) s.push("");
  for (; r < s.length; r++)
    s[r] = s[r].trim().replace(Xe.slashPipe, "|");
  return s;
}
function An(e, t, n) {
  const s = e.length;
  if (s === 0)
    return "";
  let r = 0;
  for (; r < s && e.charAt(s - r - 1) === t; )
    r++;
  return e.slice(0, s - r);
}
function Gu(e, t) {
  if (e.indexOf(t[1]) === -1)
    return -1;
  let n = 0;
  for (let s = 0; s < e.length; s++)
    if (e[s] === "\\")
      s++;
    else if (e[s] === t[0])
      n++;
    else if (e[s] === t[1] && (n--, n < 0))
      return s;
  return n > 0 ? -2 : -1;
}
function Gi(e, t, n, s, r) {
  const i = t.href, o = t.title || null, l = e[1].replace(r.other.outputLinkReplace, "$1");
  s.state.inLink = !0;
  const a = {
    type: e[0].charAt(0) === "!" ? "image" : "link",
    raw: n,
    href: i,
    title: o,
    text: l,
    tokens: s.inlineTokens(l)
  };
  return s.state.inLink = !1, a;
}
function Yu(e, t, n) {
  const s = e.match(n.other.indentCodeCompensation);
  if (s === null)
    return t;
  const r = s[1];
  return t.split(`
`).map((i) => {
    const o = i.match(n.other.beginningSpace);
    if (o === null)
      return i;
    const [l] = o;
    return l.length >= r.length ? i.slice(r.length) : i;
  }).join(`
`);
}
var _s = class {
  // set by the lexer
  constructor(e) {
    Se(this, "options");
    Se(this, "rules");
    // set by the lexer
    Se(this, "lexer");
    this.options = e || dn;
  }
  space(e) {
    const t = this.rules.block.newline.exec(e);
    if (t && t[0].length > 0)
      return {
        type: "space",
        raw: t[0]
      };
  }
  code(e) {
    const t = this.rules.block.code.exec(e);
    if (t) {
      const n = t[0].replace(this.rules.other.codeRemoveIndent, "");
      return {
        type: "code",
        raw: t[0],
        codeBlockStyle: "indented",
        text: this.options.pedantic ? n : An(n, `
`)
      };
    }
  }
  fences(e) {
    const t = this.rules.block.fences.exec(e);
    if (t) {
      const n = t[0], s = Yu(n, t[3] || "", this.rules);
      return {
        type: "code",
        raw: n,
        lang: t[2] ? t[2].trim().replace(this.rules.inline.anyPunctuation, "$1") : t[2],
        text: s
      };
    }
  }
  heading(e) {
    const t = this.rules.block.heading.exec(e);
    if (t) {
      let n = t[2].trim();
      if (this.rules.other.endingHash.test(n)) {
        const s = An(n, "#");
        (this.options.pedantic || !s || this.rules.other.endingSpaceChar.test(s)) && (n = s.trim());
      }
      return {
        type: "heading",
        raw: t[0],
        depth: t[1].length,
        text: n,
        tokens: this.lexer.inline(n)
      };
    }
  }
  hr(e) {
    const t = this.rules.block.hr.exec(e);
    if (t)
      return {
        type: "hr",
        raw: An(t[0], `
`)
      };
  }
  blockquote(e) {
    const t = this.rules.block.blockquote.exec(e);
    if (t) {
      let n = An(t[0], `
`).split(`
`), s = "", r = "";
      const i = [];
      for (; n.length > 0; ) {
        let o = !1;
        const l = [];
        let a;
        for (a = 0; a < n.length; a++)
          if (this.rules.other.blockquoteStart.test(n[a]))
            l.push(n[a]), o = !0;
          else if (!o)
            l.push(n[a]);
          else
            break;
        n = n.slice(a);
        const u = l.join(`
`), f = u.replace(this.rules.other.blockquoteSetextReplace, `
    $1`).replace(this.rules.other.blockquoteSetextReplace2, "");
        s = s ? `${s}
${u}` : u, r = r ? `${r}
${f}` : f;
        const _ = this.lexer.state.top;
        if (this.lexer.state.top = !0, this.lexer.blockTokens(f, i, !0), this.lexer.state.top = _, n.length === 0)
          break;
        const b = i.at(-1);
        if ((b == null ? void 0 : b.type) === "code")
          break;
        if ((b == null ? void 0 : b.type) === "blockquote") {
          const I = b, N = I.raw + `
` + n.join(`
`), q = this.blockquote(N);
          i[i.length - 1] = q, s = s.substring(0, s.length - I.raw.length) + q.raw, r = r.substring(0, r.length - I.text.length) + q.text;
          break;
        } else if ((b == null ? void 0 : b.type) === "list") {
          const I = b, N = I.raw + `
` + n.join(`
`), q = this.list(N);
          i[i.length - 1] = q, s = s.substring(0, s.length - b.raw.length) + q.raw, r = r.substring(0, r.length - I.raw.length) + q.raw, n = N.substring(i.at(-1).raw.length).split(`
`);
          continue;
        }
      }
      return {
        type: "blockquote",
        raw: s,
        tokens: i,
        text: r
      };
    }
  }
  list(e) {
    let t = this.rules.block.list.exec(e);
    if (t) {
      let n = t[1].trim();
      const s = n.length > 1, r = {
        type: "list",
        raw: "",
        ordered: s,
        start: s ? +n.slice(0, -1) : "",
        loose: !1,
        items: []
      };
      n = s ? `\\d{1,9}\\${n.slice(-1)}` : `\\${n}`, this.options.pedantic && (n = s ? n : "[*+-]");
      const i = this.rules.other.listItemRegex(n);
      let o = !1;
      for (; e; ) {
        let a = !1, u = "", f = "";
        if (!(t = i.exec(e)) || this.rules.block.hr.test(e))
          break;
        u = t[0], e = e.substring(u.length);
        let _ = t[2].split(`
`, 1)[0].replace(this.rules.other.listReplaceTabs, (ne) => " ".repeat(3 * ne.length)), b = e.split(`
`, 1)[0], I = !_.trim(), N = 0;
        if (this.options.pedantic ? (N = 2, f = _.trimStart()) : I ? N = t[1].length + 1 : (N = t[2].search(this.rules.other.nonSpaceChar), N = N > 4 ? 1 : N, f = _.slice(N), N += t[1].length), I && this.rules.other.blankLine.test(b) && (u += b + `
`, e = e.substring(b.length + 1), a = !0), !a) {
          const ne = this.rules.other.nextBulletRegex(N), de = this.rules.other.hrRegex(N), pe = this.rules.other.fencesBeginRegex(N), H = this.rules.other.headingBeginRegex(N), oe = this.rules.other.htmlBeginRegex(N);
          for (; e; ) {
            const qe = e.split(`
`, 1)[0];
            let fe;
            if (b = qe, this.options.pedantic ? (b = b.replace(this.rules.other.listReplaceNesting, "  "), fe = b) : fe = b.replace(this.rules.other.tabCharGlobal, "    "), pe.test(b) || H.test(b) || oe.test(b) || ne.test(b) || de.test(b))
              break;
            if (fe.search(this.rules.other.nonSpaceChar) >= N || !b.trim())
              f += `
` + fe.slice(N);
            else {
              if (I || _.replace(this.rules.other.tabCharGlobal, "    ").search(this.rules.other.nonSpaceChar) >= 4 || pe.test(_) || H.test(_) || de.test(_))
                break;
              f += `
` + b;
            }
            !I && !b.trim() && (I = !0), u += qe + `
`, e = e.substring(qe.length + 1), _ = fe.slice(N);
          }
        }
        r.loose || (o ? r.loose = !0 : this.rules.other.doubleBlankLine.test(u) && (o = !0));
        let q = null, we;
        this.options.gfm && (q = this.rules.other.listIsTask.exec(f), q && (we = q[0] !== "[ ] ", f = f.replace(this.rules.other.listReplaceTask, ""))), r.items.push({
          type: "list_item",
          raw: u,
          task: !!q,
          checked: we,
          loose: !1,
          text: f,
          tokens: []
        }), r.raw += u;
      }
      const l = r.items.at(-1);
      if (l)
        l.raw = l.raw.trimEnd(), l.text = l.text.trimEnd();
      else
        return;
      r.raw = r.raw.trimEnd();
      for (let a = 0; a < r.items.length; a++)
        if (this.lexer.state.top = !1, r.items[a].tokens = this.lexer.blockTokens(r.items[a].text, []), !r.loose) {
          const u = r.items[a].tokens.filter((_) => _.type === "space"), f = u.length > 0 && u.some((_) => this.rules.other.anyLine.test(_.raw));
          r.loose = f;
        }
      if (r.loose)
        for (let a = 0; a < r.items.length; a++)
          r.items[a].loose = !0;
      return r;
    }
  }
  html(e) {
    const t = this.rules.block.html.exec(e);
    if (t)
      return {
        type: "html",
        block: !0,
        raw: t[0],
        pre: t[1] === "pre" || t[1] === "script" || t[1] === "style",
        text: t[0]
      };
  }
  def(e) {
    const t = this.rules.block.def.exec(e);
    if (t) {
      const n = t[1].toLowerCase().replace(this.rules.other.multipleSpaceGlobal, " "), s = t[2] ? t[2].replace(this.rules.other.hrefBrackets, "$1").replace(this.rules.inline.anyPunctuation, "$1") : "", r = t[3] ? t[3].substring(1, t[3].length - 1).replace(this.rules.inline.anyPunctuation, "$1") : t[3];
      return {
        type: "def",
        tag: n,
        raw: t[0],
        href: s,
        title: r
      };
    }
  }
  table(e) {
    var o;
    const t = this.rules.block.table.exec(e);
    if (!t || !this.rules.other.tableDelimiter.test(t[2]))
      return;
    const n = Zi(t[1]), s = t[2].replace(this.rules.other.tableAlignChars, "").split("|"), r = (o = t[3]) != null && o.trim() ? t[3].replace(this.rules.other.tableRowBlankLine, "").split(`
`) : [], i = {
      type: "table",
      raw: t[0],
      header: [],
      align: [],
      rows: []
    };
    if (n.length === s.length) {
      for (const l of s)
        this.rules.other.tableAlignRight.test(l) ? i.align.push("right") : this.rules.other.tableAlignCenter.test(l) ? i.align.push("center") : this.rules.other.tableAlignLeft.test(l) ? i.align.push("left") : i.align.push(null);
      for (let l = 0; l < n.length; l++)
        i.header.push({
          text: n[l],
          tokens: this.lexer.inline(n[l]),
          header: !0,
          align: i.align[l]
        });
      for (const l of r)
        i.rows.push(Zi(l, i.header.length).map((a, u) => ({
          text: a,
          tokens: this.lexer.inline(a),
          header: !1,
          align: i.align[u]
        })));
      return i;
    }
  }
  lheading(e) {
    const t = this.rules.block.lheading.exec(e);
    if (t)
      return {
        type: "heading",
        raw: t[0],
        depth: t[2].charAt(0) === "=" ? 1 : 2,
        text: t[1],
        tokens: this.lexer.inline(t[1])
      };
  }
  paragraph(e) {
    const t = this.rules.block.paragraph.exec(e);
    if (t) {
      const n = t[1].charAt(t[1].length - 1) === `
` ? t[1].slice(0, -1) : t[1];
      return {
        type: "paragraph",
        raw: t[0],
        text: n,
        tokens: this.lexer.inline(n)
      };
    }
  }
  text(e) {
    const t = this.rules.block.text.exec(e);
    if (t)
      return {
        type: "text",
        raw: t[0],
        text: t[0],
        tokens: this.lexer.inline(t[0])
      };
  }
  escape(e) {
    const t = this.rules.inline.escape.exec(e);
    if (t)
      return {
        type: "escape",
        raw: t[0],
        text: t[1]
      };
  }
  tag(e) {
    const t = this.rules.inline.tag.exec(e);
    if (t)
      return !this.lexer.state.inLink && this.rules.other.startATag.test(t[0]) ? this.lexer.state.inLink = !0 : this.lexer.state.inLink && this.rules.other.endATag.test(t[0]) && (this.lexer.state.inLink = !1), !this.lexer.state.inRawBlock && this.rules.other.startPreScriptTag.test(t[0]) ? this.lexer.state.inRawBlock = !0 : this.lexer.state.inRawBlock && this.rules.other.endPreScriptTag.test(t[0]) && (this.lexer.state.inRawBlock = !1), {
        type: "html",
        raw: t[0],
        inLink: this.lexer.state.inLink,
        inRawBlock: this.lexer.state.inRawBlock,
        block: !1,
        text: t[0]
      };
  }
  link(e) {
    const t = this.rules.inline.link.exec(e);
    if (t) {
      const n = t[2].trim();
      if (!this.options.pedantic && this.rules.other.startAngleBracket.test(n)) {
        if (!this.rules.other.endAngleBracket.test(n))
          return;
        const i = An(n.slice(0, -1), "\\");
        if ((n.length - i.length) % 2 === 0)
          return;
      } else {
        const i = Gu(t[2], "()");
        if (i === -2)
          return;
        if (i > -1) {
          const l = (t[0].indexOf("!") === 0 ? 5 : 4) + t[1].length + i;
          t[2] = t[2].substring(0, i), t[0] = t[0].substring(0, l).trim(), t[3] = "";
        }
      }
      let s = t[2], r = "";
      if (this.options.pedantic) {
        const i = this.rules.other.pedanticHrefTitle.exec(s);
        i && (s = i[1], r = i[3]);
      } else
        r = t[3] ? t[3].slice(1, -1) : "";
      return s = s.trim(), this.rules.other.startAngleBracket.test(s) && (this.options.pedantic && !this.rules.other.endAngleBracket.test(n) ? s = s.slice(1) : s = s.slice(1, -1)), Gi(t, {
        href: s && s.replace(this.rules.inline.anyPunctuation, "$1"),
        title: r && r.replace(this.rules.inline.anyPunctuation, "$1")
      }, t[0], this.lexer, this.rules);
    }
  }
  reflink(e, t) {
    let n;
    if ((n = this.rules.inline.reflink.exec(e)) || (n = this.rules.inline.nolink.exec(e))) {
      const s = (n[2] || n[1]).replace(this.rules.other.multipleSpaceGlobal, " "), r = t[s.toLowerCase()];
      if (!r) {
        const i = n[0].charAt(0);
        return {
          type: "text",
          raw: i,
          text: i
        };
      }
      return Gi(n, r, n[0], this.lexer, this.rules);
    }
  }
  emStrong(e, t, n = "") {
    let s = this.rules.inline.emStrongLDelim.exec(e);
    if (!s || s[3] && n.match(this.rules.other.unicodeAlphaNumeric)) return;
    if (!(s[1] || s[2] || "") || !n || this.rules.inline.punctuation.exec(n)) {
      const i = [...s[0]].length - 1;
      let o, l, a = i, u = 0;
      const f = s[0][0] === "*" ? this.rules.inline.emStrongRDelimAst : this.rules.inline.emStrongRDelimUnd;
      for (f.lastIndex = 0, t = t.slice(-1 * e.length + i); (s = f.exec(t)) != null; ) {
        if (o = s[1] || s[2] || s[3] || s[4] || s[5] || s[6], !o) continue;
        if (l = [...o].length, s[3] || s[4]) {
          a += l;
          continue;
        } else if ((s[5] || s[6]) && i % 3 && !((i + l) % 3)) {
          u += l;
          continue;
        }
        if (a -= l, a > 0) continue;
        l = Math.min(l, l + a + u);
        const _ = [...s[0]][0].length, b = e.slice(0, i + s.index + _ + l);
        if (Math.min(i, l) % 2) {
          const N = b.slice(1, -1);
          return {
            type: "em",
            raw: b,
            text: N,
            tokens: this.lexer.inlineTokens(N)
          };
        }
        const I = b.slice(2, -2);
        return {
          type: "strong",
          raw: b,
          text: I,
          tokens: this.lexer.inlineTokens(I)
        };
      }
    }
  }
  codespan(e) {
    const t = this.rules.inline.code.exec(e);
    if (t) {
      let n = t[2].replace(this.rules.other.newLineCharGlobal, " ");
      const s = this.rules.other.nonSpaceChar.test(n), r = this.rules.other.startingSpaceChar.test(n) && this.rules.other.endingSpaceChar.test(n);
      return s && r && (n = n.substring(1, n.length - 1)), {
        type: "codespan",
        raw: t[0],
        text: n
      };
    }
  }
  br(e) {
    const t = this.rules.inline.br.exec(e);
    if (t)
      return {
        type: "br",
        raw: t[0]
      };
  }
  del(e) {
    const t = this.rules.inline.del.exec(e);
    if (t)
      return {
        type: "del",
        raw: t[0],
        text: t[2],
        tokens: this.lexer.inlineTokens(t[2])
      };
  }
  autolink(e) {
    const t = this.rules.inline.autolink.exec(e);
    if (t) {
      let n, s;
      return t[2] === "@" ? (n = t[1], s = "mailto:" + n) : (n = t[1], s = n), {
        type: "link",
        raw: t[0],
        text: n,
        href: s,
        tokens: [
          {
            type: "text",
            raw: n,
            text: n
          }
        ]
      };
    }
  }
  url(e) {
    var n;
    let t;
    if (t = this.rules.inline.url.exec(e)) {
      let s, r;
      if (t[2] === "@")
        s = t[0], r = "mailto:" + s;
      else {
        let i;
        do
          i = t[0], t[0] = ((n = this.rules.inline._backpedal.exec(t[0])) == null ? void 0 : n[0]) ?? "";
        while (i !== t[0]);
        s = t[0], t[1] === "www." ? r = "http://" + t[0] : r = t[0];
      }
      return {
        type: "link",
        raw: t[0],
        text: s,
        href: r,
        tokens: [
          {
            type: "text",
            raw: s,
            text: s
          }
        ]
      };
    }
  }
  inlineText(e) {
    const t = this.rules.inline.text.exec(e);
    if (t) {
      const n = this.lexer.state.inRawBlock;
      return {
        type: "text",
        raw: t[0],
        text: t[0],
        escaped: n
      };
    }
  }
}, Bt = class dr {
  constructor(t) {
    Se(this, "tokens");
    Se(this, "options");
    Se(this, "state");
    Se(this, "tokenizer");
    Se(this, "inlineQueue");
    this.tokens = [], this.tokens.links = /* @__PURE__ */ Object.create(null), this.options = t || dn, this.options.tokenizer = this.options.tokenizer || new _s(), this.tokenizer = this.options.tokenizer, this.tokenizer.options = this.options, this.tokenizer.lexer = this, this.inlineQueue = [], this.state = {
      inLink: !1,
      inRawBlock: !1,
      top: !0
    };
    const n = {
      other: Xe,
      block: Jn.normal,
      inline: En.normal
    };
    this.options.pedantic ? (n.block = Jn.pedantic, n.inline = En.pedantic) : this.options.gfm && (n.block = Jn.gfm, this.options.breaks ? n.inline = En.breaks : n.inline = En.gfm), this.tokenizer.rules = n;
  }
  /**
   * Expose Rules
   */
  static get rules() {
    return {
      block: Jn,
      inline: En
    };
  }
  /**
   * Static Lex Method
   */
  static lex(t, n) {
    return new dr(n).lex(t);
  }
  /**
   * Static Lex Inline Method
   */
  static lexInline(t, n) {
    return new dr(n).inlineTokens(t);
  }
  /**
   * Preprocessing
   */
  lex(t) {
    t = t.replace(Xe.carriageReturn, `
`), this.blockTokens(t, this.tokens);
    for (let n = 0; n < this.inlineQueue.length; n++) {
      const s = this.inlineQueue[n];
      this.inlineTokens(s.src, s.tokens);
    }
    return this.inlineQueue = [], this.tokens;
  }
  blockTokens(t, n = [], s = !1) {
    var r, i, o;
    for (this.options.pedantic && (t = t.replace(Xe.tabCharGlobal, "    ").replace(Xe.spaceLine, "")); t; ) {
      let l;
      if ((i = (r = this.options.extensions) == null ? void 0 : r.block) != null && i.some((u) => (l = u.call({ lexer: this }, t, n)) ? (t = t.substring(l.raw.length), n.push(l), !0) : !1))
        continue;
      if (l = this.tokenizer.space(t)) {
        t = t.substring(l.raw.length);
        const u = n.at(-1);
        l.raw.length === 1 && u !== void 0 ? u.raw += `
` : n.push(l);
        continue;
      }
      if (l = this.tokenizer.code(t)) {
        t = t.substring(l.raw.length);
        const u = n.at(-1);
        (u == null ? void 0 : u.type) === "paragraph" || (u == null ? void 0 : u.type) === "text" ? (u.raw += `
` + l.raw, u.text += `
` + l.text, this.inlineQueue.at(-1).src = u.text) : n.push(l);
        continue;
      }
      if (l = this.tokenizer.fences(t)) {
        t = t.substring(l.raw.length), n.push(l);
        continue;
      }
      if (l = this.tokenizer.heading(t)) {
        t = t.substring(l.raw.length), n.push(l);
        continue;
      }
      if (l = this.tokenizer.hr(t)) {
        t = t.substring(l.raw.length), n.push(l);
        continue;
      }
      if (l = this.tokenizer.blockquote(t)) {
        t = t.substring(l.raw.length), n.push(l);
        continue;
      }
      if (l = this.tokenizer.list(t)) {
        t = t.substring(l.raw.length), n.push(l);
        continue;
      }
      if (l = this.tokenizer.html(t)) {
        t = t.substring(l.raw.length), n.push(l);
        continue;
      }
      if (l = this.tokenizer.def(t)) {
        t = t.substring(l.raw.length);
        const u = n.at(-1);
        (u == null ? void 0 : u.type) === "paragraph" || (u == null ? void 0 : u.type) === "text" ? (u.raw += `
` + l.raw, u.text += `
` + l.raw, this.inlineQueue.at(-1).src = u.text) : this.tokens.links[l.tag] || (this.tokens.links[l.tag] = {
          href: l.href,
          title: l.title
        });
        continue;
      }
      if (l = this.tokenizer.table(t)) {
        t = t.substring(l.raw.length), n.push(l);
        continue;
      }
      if (l = this.tokenizer.lheading(t)) {
        t = t.substring(l.raw.length), n.push(l);
        continue;
      }
      let a = t;
      if ((o = this.options.extensions) != null && o.startBlock) {
        let u = 1 / 0;
        const f = t.slice(1);
        let _;
        this.options.extensions.startBlock.forEach((b) => {
          _ = b.call({ lexer: this }, f), typeof _ == "number" && _ >= 0 && (u = Math.min(u, _));
        }), u < 1 / 0 && u >= 0 && (a = t.substring(0, u + 1));
      }
      if (this.state.top && (l = this.tokenizer.paragraph(a))) {
        const u = n.at(-1);
        s && (u == null ? void 0 : u.type) === "paragraph" ? (u.raw += `
` + l.raw, u.text += `
` + l.text, this.inlineQueue.pop(), this.inlineQueue.at(-1).src = u.text) : n.push(l), s = a.length !== t.length, t = t.substring(l.raw.length);
        continue;
      }
      if (l = this.tokenizer.text(t)) {
        t = t.substring(l.raw.length);
        const u = n.at(-1);
        (u == null ? void 0 : u.type) === "text" ? (u.raw += `
` + l.raw, u.text += `
` + l.text, this.inlineQueue.pop(), this.inlineQueue.at(-1).src = u.text) : n.push(l);
        continue;
      }
      if (t) {
        const u = "Infinite loop on byte: " + t.charCodeAt(0);
        if (this.options.silent) {
          console.error(u);
          break;
        } else
          throw new Error(u);
      }
    }
    return this.state.top = !0, n;
  }
  inline(t, n = []) {
    return this.inlineQueue.push({ src: t, tokens: n }), n;
  }
  /**
   * Lexing/Compiling
   */
  inlineTokens(t, n = []) {
    var l, a, u;
    let s = t, r = null;
    if (this.tokens.links) {
      const f = Object.keys(this.tokens.links);
      if (f.length > 0)
        for (; (r = this.tokenizer.rules.inline.reflinkSearch.exec(s)) != null; )
          f.includes(r[0].slice(r[0].lastIndexOf("[") + 1, -1)) && (s = s.slice(0, r.index) + "[" + "a".repeat(r[0].length - 2) + "]" + s.slice(this.tokenizer.rules.inline.reflinkSearch.lastIndex));
    }
    for (; (r = this.tokenizer.rules.inline.anyPunctuation.exec(s)) != null; )
      s = s.slice(0, r.index) + "++" + s.slice(this.tokenizer.rules.inline.anyPunctuation.lastIndex);
    for (; (r = this.tokenizer.rules.inline.blockSkip.exec(s)) != null; )
      s = s.slice(0, r.index) + "[" + "a".repeat(r[0].length - 2) + "]" + s.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);
    let i = !1, o = "";
    for (; t; ) {
      i || (o = ""), i = !1;
      let f;
      if ((a = (l = this.options.extensions) == null ? void 0 : l.inline) != null && a.some((b) => (f = b.call({ lexer: this }, t, n)) ? (t = t.substring(f.raw.length), n.push(f), !0) : !1))
        continue;
      if (f = this.tokenizer.escape(t)) {
        t = t.substring(f.raw.length), n.push(f);
        continue;
      }
      if (f = this.tokenizer.tag(t)) {
        t = t.substring(f.raw.length), n.push(f);
        continue;
      }
      if (f = this.tokenizer.link(t)) {
        t = t.substring(f.raw.length), n.push(f);
        continue;
      }
      if (f = this.tokenizer.reflink(t, this.tokens.links)) {
        t = t.substring(f.raw.length);
        const b = n.at(-1);
        f.type === "text" && (b == null ? void 0 : b.type) === "text" ? (b.raw += f.raw, b.text += f.text) : n.push(f);
        continue;
      }
      if (f = this.tokenizer.emStrong(t, s, o)) {
        t = t.substring(f.raw.length), n.push(f);
        continue;
      }
      if (f = this.tokenizer.codespan(t)) {
        t = t.substring(f.raw.length), n.push(f);
        continue;
      }
      if (f = this.tokenizer.br(t)) {
        t = t.substring(f.raw.length), n.push(f);
        continue;
      }
      if (f = this.tokenizer.del(t)) {
        t = t.substring(f.raw.length), n.push(f);
        continue;
      }
      if (f = this.tokenizer.autolink(t)) {
        t = t.substring(f.raw.length), n.push(f);
        continue;
      }
      if (!this.state.inLink && (f = this.tokenizer.url(t))) {
        t = t.substring(f.raw.length), n.push(f);
        continue;
      }
      let _ = t;
      if ((u = this.options.extensions) != null && u.startInline) {
        let b = 1 / 0;
        const I = t.slice(1);
        let N;
        this.options.extensions.startInline.forEach((q) => {
          N = q.call({ lexer: this }, I), typeof N == "number" && N >= 0 && (b = Math.min(b, N));
        }), b < 1 / 0 && b >= 0 && (_ = t.substring(0, b + 1));
      }
      if (f = this.tokenizer.inlineText(_)) {
        t = t.substring(f.raw.length), f.raw.slice(-1) !== "_" && (o = f.raw.slice(-1)), i = !0;
        const b = n.at(-1);
        (b == null ? void 0 : b.type) === "text" ? (b.raw += f.raw, b.text += f.text) : n.push(f);
        continue;
      }
      if (t) {
        const b = "Infinite loop on byte: " + t.charCodeAt(0);
        if (this.options.silent) {
          console.error(b);
          break;
        } else
          throw new Error(b);
      }
    }
    return n;
  }
}, ys = class {
  // set by the parser
  constructor(e) {
    Se(this, "options");
    Se(this, "parser");
    this.options = e || dn;
  }
  space(e) {
    return "";
  }
  code({ text: e, lang: t, escaped: n }) {
    var i;
    const s = (i = (t || "").match(Xe.notSpaceStart)) == null ? void 0 : i[0], r = e.replace(Xe.endingNewline, "") + `
`;
    return s ? '<pre><code class="language-' + Ct(s) + '">' + (n ? r : Ct(r, !0)) + `</code></pre>
` : "<pre><code>" + (n ? r : Ct(r, !0)) + `</code></pre>
`;
  }
  blockquote({ tokens: e }) {
    return `<blockquote>
${this.parser.parse(e)}</blockquote>
`;
  }
  html({ text: e }) {
    return e;
  }
  heading({ tokens: e, depth: t }) {
    return `<h${t}>${this.parser.parseInline(e)}</h${t}>
`;
  }
  hr(e) {
    return `<hr>
`;
  }
  list(e) {
    const t = e.ordered, n = e.start;
    let s = "";
    for (let o = 0; o < e.items.length; o++) {
      const l = e.items[o];
      s += this.listitem(l);
    }
    const r = t ? "ol" : "ul", i = t && n !== 1 ? ' start="' + n + '"' : "";
    return "<" + r + i + `>
` + s + "</" + r + `>
`;
  }
  listitem(e) {
    var n;
    let t = "";
    if (e.task) {
      const s = this.checkbox({ checked: !!e.checked });
      e.loose ? ((n = e.tokens[0]) == null ? void 0 : n.type) === "paragraph" ? (e.tokens[0].text = s + " " + e.tokens[0].text, e.tokens[0].tokens && e.tokens[0].tokens.length > 0 && e.tokens[0].tokens[0].type === "text" && (e.tokens[0].tokens[0].text = s + " " + Ct(e.tokens[0].tokens[0].text), e.tokens[0].tokens[0].escaped = !0)) : e.tokens.unshift({
        type: "text",
        raw: s + " ",
        text: s + " ",
        escaped: !0
      }) : t += s + " ";
    }
    return t += this.parser.parse(e.tokens, !!e.loose), `<li>${t}</li>
`;
  }
  checkbox({ checked: e }) {
    return "<input " + (e ? 'checked="" ' : "") + 'disabled="" type="checkbox">';
  }
  paragraph({ tokens: e }) {
    return `<p>${this.parser.parseInline(e)}</p>
`;
  }
  table(e) {
    let t = "", n = "";
    for (let r = 0; r < e.header.length; r++)
      n += this.tablecell(e.header[r]);
    t += this.tablerow({ text: n });
    let s = "";
    for (let r = 0; r < e.rows.length; r++) {
      const i = e.rows[r];
      n = "";
      for (let o = 0; o < i.length; o++)
        n += this.tablecell(i[o]);
      s += this.tablerow({ text: n });
    }
    return s && (s = `<tbody>${s}</tbody>`), `<table>
<thead>
` + t + `</thead>
` + s + `</table>
`;
  }
  tablerow({ text: e }) {
    return `<tr>
${e}</tr>
`;
  }
  tablecell(e) {
    const t = this.parser.parseInline(e.tokens), n = e.header ? "th" : "td";
    return (e.align ? `<${n} align="${e.align}">` : `<${n}>`) + t + `</${n}>
`;
  }
  /**
   * span level renderer
   */
  strong({ tokens: e }) {
    return `<strong>${this.parser.parseInline(e)}</strong>`;
  }
  em({ tokens: e }) {
    return `<em>${this.parser.parseInline(e)}</em>`;
  }
  codespan({ text: e }) {
    return `<code>${Ct(e, !0)}</code>`;
  }
  br(e) {
    return "<br>";
  }
  del({ tokens: e }) {
    return `<del>${this.parser.parseInline(e)}</del>`;
  }
  link({ href: e, title: t, tokens: n }) {
    const s = this.parser.parseInline(n), r = Ki(e);
    if (r === null)
      return s;
    e = r;
    let i = '<a href="' + e + '"';
    return t && (i += ' title="' + Ct(t) + '"'), i += ">" + s + "</a>", i;
  }
  image({ href: e, title: t, text: n, tokens: s }) {
    s && (n = this.parser.parseInline(s, this.parser.textRenderer));
    const r = Ki(e);
    if (r === null)
      return Ct(n);
    e = r;
    let i = `<img src="${e}" alt="${n}"`;
    return t && (i += ` title="${Ct(t)}"`), i += ">", i;
  }
  text(e) {
    return "tokens" in e && e.tokens ? this.parser.parseInline(e.tokens) : "escaped" in e && e.escaped ? e.text : Ct(e.text);
  }
}, Kr = class {
  // no need for block level renderers
  strong({ text: e }) {
    return e;
  }
  em({ text: e }) {
    return e;
  }
  codespan({ text: e }) {
    return e;
  }
  del({ text: e }) {
    return e;
  }
  html({ text: e }) {
    return e;
  }
  text({ text: e }) {
    return e;
  }
  link({ text: e }) {
    return "" + e;
  }
  image({ text: e }) {
    return "" + e;
  }
  br() {
    return "";
  }
}, Mt = class pr {
  constructor(t) {
    Se(this, "options");
    Se(this, "renderer");
    Se(this, "textRenderer");
    this.options = t || dn, this.options.renderer = this.options.renderer || new ys(), this.renderer = this.options.renderer, this.renderer.options = this.options, this.renderer.parser = this, this.textRenderer = new Kr();
  }
  /**
   * Static Parse Method
   */
  static parse(t, n) {
    return new pr(n).parse(t);
  }
  /**
   * Static Parse Inline Method
   */
  static parseInline(t, n) {
    return new pr(n).parseInline(t);
  }
  /**
   * Parse Loop
   */
  parse(t, n = !0) {
    var r, i;
    let s = "";
    for (let o = 0; o < t.length; o++) {
      const l = t[o];
      if ((i = (r = this.options.extensions) == null ? void 0 : r.renderers) != null && i[l.type]) {
        const u = l, f = this.options.extensions.renderers[u.type].call({ parser: this }, u);
        if (f !== !1 || !["space", "hr", "heading", "code", "table", "blockquote", "list", "html", "paragraph", "text"].includes(u.type)) {
          s += f || "";
          continue;
        }
      }
      const a = l;
      switch (a.type) {
        case "space": {
          s += this.renderer.space(a);
          continue;
        }
        case "hr": {
          s += this.renderer.hr(a);
          continue;
        }
        case "heading": {
          s += this.renderer.heading(a);
          continue;
        }
        case "code": {
          s += this.renderer.code(a);
          continue;
        }
        case "table": {
          s += this.renderer.table(a);
          continue;
        }
        case "blockquote": {
          s += this.renderer.blockquote(a);
          continue;
        }
        case "list": {
          s += this.renderer.list(a);
          continue;
        }
        case "html": {
          s += this.renderer.html(a);
          continue;
        }
        case "paragraph": {
          s += this.renderer.paragraph(a);
          continue;
        }
        case "text": {
          let u = a, f = this.renderer.text(u);
          for (; o + 1 < t.length && t[o + 1].type === "text"; )
            u = t[++o], f += `
` + this.renderer.text(u);
          n ? s += this.renderer.paragraph({
            type: "paragraph",
            raw: f,
            text: f,
            tokens: [{ type: "text", raw: f, text: f, escaped: !0 }]
          }) : s += f;
          continue;
        }
        default: {
          const u = 'Token with "' + a.type + '" type was not found.';
          if (this.options.silent)
            return console.error(u), "";
          throw new Error(u);
        }
      }
    }
    return s;
  }
  /**
   * Parse Inline Tokens
   */
  parseInline(t, n = this.renderer) {
    var r, i;
    let s = "";
    for (let o = 0; o < t.length; o++) {
      const l = t[o];
      if ((i = (r = this.options.extensions) == null ? void 0 : r.renderers) != null && i[l.type]) {
        const u = this.options.extensions.renderers[l.type].call({ parser: this }, l);
        if (u !== !1 || !["escape", "html", "link", "image", "strong", "em", "codespan", "br", "del", "text"].includes(l.type)) {
          s += u || "";
          continue;
        }
      }
      const a = l;
      switch (a.type) {
        case "escape": {
          s += n.text(a);
          break;
        }
        case "html": {
          s += n.html(a);
          break;
        }
        case "link": {
          s += n.link(a);
          break;
        }
        case "image": {
          s += n.image(a);
          break;
        }
        case "strong": {
          s += n.strong(a);
          break;
        }
        case "em": {
          s += n.em(a);
          break;
        }
        case "codespan": {
          s += n.codespan(a);
          break;
        }
        case "br": {
          s += n.br(a);
          break;
        }
        case "del": {
          s += n.del(a);
          break;
        }
        case "text": {
          s += n.text(a);
          break;
        }
        default: {
          const u = 'Token with "' + a.type + '" type was not found.';
          if (this.options.silent)
            return console.error(u), "";
          throw new Error(u);
        }
      }
    }
    return s;
  }
}, Xs, is = (Xs = class {
  constructor(e) {
    Se(this, "options");
    Se(this, "block");
    this.options = e || dn;
  }
  /**
   * Process markdown before marked
   */
  preprocess(e) {
    return e;
  }
  /**
   * Process HTML after marked is finished
   */
  postprocess(e) {
    return e;
  }
  /**
   * Process all tokens before walk tokens
   */
  processAllTokens(e) {
    return e;
  }
  /**
   * Provide function to tokenize markdown
   */
  provideLexer() {
    return this.block ? Bt.lex : Bt.lexInline;
  }
  /**
   * Provide function to parse tokens
   */
  provideParser() {
    return this.block ? Mt.parse : Mt.parseInline;
  }
}, Se(Xs, "passThroughHooks", /* @__PURE__ */ new Set([
  "preprocess",
  "postprocess",
  "processAllTokens"
])), Xs), Ju = class {
  constructor(...e) {
    Se(this, "defaults", Dr());
    Se(this, "options", this.setOptions);
    Se(this, "parse", this.parseMarkdown(!0));
    Se(this, "parseInline", this.parseMarkdown(!1));
    Se(this, "Parser", Mt);
    Se(this, "Renderer", ys);
    Se(this, "TextRenderer", Kr);
    Se(this, "Lexer", Bt);
    Se(this, "Tokenizer", _s);
    Se(this, "Hooks", is);
    this.use(...e);
  }
  /**
   * Run callback for every token
   */
  walkTokens(e, t) {
    var s, r;
    let n = [];
    for (const i of e)
      switch (n = n.concat(t.call(this, i)), i.type) {
        case "table": {
          const o = i;
          for (const l of o.header)
            n = n.concat(this.walkTokens(l.tokens, t));
          for (const l of o.rows)
            for (const a of l)
              n = n.concat(this.walkTokens(a.tokens, t));
          break;
        }
        case "list": {
          const o = i;
          n = n.concat(this.walkTokens(o.items, t));
          break;
        }
        default: {
          const o = i;
          (r = (s = this.defaults.extensions) == null ? void 0 : s.childTokens) != null && r[o.type] ? this.defaults.extensions.childTokens[o.type].forEach((l) => {
            const a = o[l].flat(1 / 0);
            n = n.concat(this.walkTokens(a, t));
          }) : o.tokens && (n = n.concat(this.walkTokens(o.tokens, t)));
        }
      }
    return n;
  }
  use(...e) {
    const t = this.defaults.extensions || { renderers: {}, childTokens: {} };
    return e.forEach((n) => {
      const s = { ...n };
      if (s.async = this.defaults.async || s.async || !1, n.extensions && (n.extensions.forEach((r) => {
        if (!r.name)
          throw new Error("extension name required");
        if ("renderer" in r) {
          const i = t.renderers[r.name];
          i ? t.renderers[r.name] = function(...o) {
            let l = r.renderer.apply(this, o);
            return l === !1 && (l = i.apply(this, o)), l;
          } : t.renderers[r.name] = r.renderer;
        }
        if ("tokenizer" in r) {
          if (!r.level || r.level !== "block" && r.level !== "inline")
            throw new Error("extension level must be 'block' or 'inline'");
          const i = t[r.level];
          i ? i.unshift(r.tokenizer) : t[r.level] = [r.tokenizer], r.start && (r.level === "block" ? t.startBlock ? t.startBlock.push(r.start) : t.startBlock = [r.start] : r.level === "inline" && (t.startInline ? t.startInline.push(r.start) : t.startInline = [r.start]));
        }
        "childTokens" in r && r.childTokens && (t.childTokens[r.name] = r.childTokens);
      }), s.extensions = t), n.renderer) {
        const r = this.defaults.renderer || new ys(this.defaults);
        for (const i in n.renderer) {
          if (!(i in r))
            throw new Error(`renderer '${i}' does not exist`);
          if (["options", "parser"].includes(i))
            continue;
          const o = i, l = n.renderer[o], a = r[o];
          r[o] = (...u) => {
            let f = l.apply(r, u);
            return f === !1 && (f = a.apply(r, u)), f || "";
          };
        }
        s.renderer = r;
      }
      if (n.tokenizer) {
        const r = this.defaults.tokenizer || new _s(this.defaults);
        for (const i in n.tokenizer) {
          if (!(i in r))
            throw new Error(`tokenizer '${i}' does not exist`);
          if (["options", "rules", "lexer"].includes(i))
            continue;
          const o = i, l = n.tokenizer[o], a = r[o];
          r[o] = (...u) => {
            let f = l.apply(r, u);
            return f === !1 && (f = a.apply(r, u)), f;
          };
        }
        s.tokenizer = r;
      }
      if (n.hooks) {
        const r = this.defaults.hooks || new is();
        for (const i in n.hooks) {
          if (!(i in r))
            throw new Error(`hook '${i}' does not exist`);
          if (["options", "block"].includes(i))
            continue;
          const o = i, l = n.hooks[o], a = r[o];
          is.passThroughHooks.has(i) ? r[o] = (u) => {
            if (this.defaults.async)
              return Promise.resolve(l.call(r, u)).then((_) => a.call(r, _));
            const f = l.call(r, u);
            return a.call(r, f);
          } : r[o] = (...u) => {
            let f = l.apply(r, u);
            return f === !1 && (f = a.apply(r, u)), f;
          };
        }
        s.hooks = r;
      }
      if (n.walkTokens) {
        const r = this.defaults.walkTokens, i = n.walkTokens;
        s.walkTokens = function(o) {
          let l = [];
          return l.push(i.call(this, o)), r && (l = l.concat(r.call(this, o))), l;
        };
      }
      this.defaults = { ...this.defaults, ...s };
    }), this;
  }
  setOptions(e) {
    return this.defaults = { ...this.defaults, ...e }, this;
  }
  lexer(e, t) {
    return Bt.lex(e, t ?? this.defaults);
  }
  parser(e, t) {
    return Mt.parse(e, t ?? this.defaults);
  }
  parseMarkdown(e) {
    return (n, s) => {
      const r = { ...s }, i = { ...this.defaults, ...r }, o = this.onError(!!i.silent, !!i.async);
      if (this.defaults.async === !0 && r.async === !1)
        return o(new Error("marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise."));
      if (typeof n > "u" || n === null)
        return o(new Error("marked(): input parameter is undefined or null"));
      if (typeof n != "string")
        return o(new Error("marked(): input parameter is of type " + Object.prototype.toString.call(n) + ", string expected"));
      i.hooks && (i.hooks.options = i, i.hooks.block = e);
      const l = i.hooks ? i.hooks.provideLexer() : e ? Bt.lex : Bt.lexInline, a = i.hooks ? i.hooks.provideParser() : e ? Mt.parse : Mt.parseInline;
      if (i.async)
        return Promise.resolve(i.hooks ? i.hooks.preprocess(n) : n).then((u) => l(u, i)).then((u) => i.hooks ? i.hooks.processAllTokens(u) : u).then((u) => i.walkTokens ? Promise.all(this.walkTokens(u, i.walkTokens)).then(() => u) : u).then((u) => a(u, i)).then((u) => i.hooks ? i.hooks.postprocess(u) : u).catch(o);
      try {
        i.hooks && (n = i.hooks.preprocess(n));
        let u = l(n, i);
        i.hooks && (u = i.hooks.processAllTokens(u)), i.walkTokens && this.walkTokens(u, i.walkTokens);
        let f = a(u, i);
        return i.hooks && (f = i.hooks.postprocess(f)), f;
      } catch (u) {
        return o(u);
      }
    };
  }
  onError(e, t) {
    return (n) => {
      if (n.message += `
Please report this to https://github.com/markedjs/marked.`, e) {
        const s = "<p>An error occurred:</p><pre>" + Ct(n.message + "", !0) + "</pre>";
        return t ? Promise.resolve(s) : s;
      }
      if (t)
        return Promise.reject(n);
      throw n;
    };
  }
}, hn = new Ju();
function ue(e, t) {
  return hn.parse(e, t);
}
ue.options = ue.setOptions = function(e) {
  return hn.setOptions(e), ue.defaults = hn.defaults, ol(ue.defaults), ue;
};
ue.getDefaults = Dr;
ue.defaults = dn;
ue.use = function(...e) {
  return hn.use(...e), ue.defaults = hn.defaults, ol(ue.defaults), ue;
};
ue.walkTokens = function(e, t) {
  return hn.walkTokens(e, t);
};
ue.parseInline = hn.parseInline;
ue.Parser = Mt;
ue.parser = Mt.parse;
ue.Renderer = ys;
ue.TextRenderer = Kr;
ue.Lexer = Bt;
ue.lexer = Bt.lex;
ue.Tokenizer = _s;
ue.Hooks = is;
ue.parse = ue;
ue.options;
ue.setOptions;
ue.use;
ue.walkTokens;
ue.parseInline;
Mt.parse;
Bt.lex;
const vs = {
  API_URL: "https://api.chattermate.chat/api/v1",
  WS_URL: "wss://api.chattermate.chat"
};
function Qu(e) {
  const t = Be(() => ({
    backgroundColor: e.value.chat_background_color || "#ffffff",
    color: Kt(e.value.chat_background_color || "#ffffff") ? "#ffffff" : "#000000"
  })), n = Be(() => ({
    backgroundColor: e.value.chat_bubble_color || "#f34611",
    color: Kt(e.value.chat_bubble_color || "#f34611") ? "#FFFFFF" : "#000000"
  })), s = Be(() => {
    const u = e.value.chat_background_color || "#F8F9FA", f = pu(u, 20);
    return {
      backgroundColor: f,
      color: Kt(f) ? "#FFFFFF" : "#000000"
    };
  }), r = Be(() => ({
    backgroundColor: e.value.accent_color || "#f34611",
    color: Kt(e.value.accent_color || "#f34611") ? "#FFFFFF" : "#000000"
  })), i = Be(() => ({
    color: Kt(e.value.chat_background_color || "#F8F9FA") ? "#FFFFFF" : "#000000"
  })), o = Be(() => ({
    borderBottom: `1px solid ${Kt(e.value.chat_background_color || "#F8F9FA") ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)"}`
  })), l = Be(() => e.value.photo_url ? e.value.photo_url.includes("amazonaws.com") ? e.value.photo_url : `${vs.API_URL}${e.value.photo_url}` : ""), a = Be(() => {
    const u = e.value.chat_background_color || "#ffffff";
    return {
      boxShadow: `0 8px 5px ${Kt(u) ? "rgba(0, 0, 0, 0.24)" : "rgba(0, 0, 0, 0.12)"}`
    };
  });
  return {
    chatStyles: t,
    chatIconStyles: n,
    agentBubbleStyles: s,
    userBubbleStyles: r,
    messageNameStyles: i,
    headerBorderStyles: o,
    photoUrl: l,
    shadowStyle: a
  };
}
const Lt = /* @__PURE__ */ Object.create(null);
Lt.open = "0";
Lt.close = "1";
Lt.ping = "2";
Lt.pong = "3";
Lt.message = "4";
Lt.upgrade = "5";
Lt.noop = "6";
const os = /* @__PURE__ */ Object.create(null);
Object.keys(Lt).forEach((e) => {
  os[Lt[e]] = e;
});
const gr = { type: "error", data: "parser error" }, _l = typeof Blob == "function" || typeof Blob < "u" && Object.prototype.toString.call(Blob) === "[object BlobConstructor]", yl = typeof ArrayBuffer == "function", vl = (e) => typeof ArrayBuffer.isView == "function" ? ArrayBuffer.isView(e) : e && e.buffer instanceof ArrayBuffer, Zr = ({ type: e, data: t }, n, s) => _l && t instanceof Blob ? n ? s(t) : Yi(t, s) : yl && (t instanceof ArrayBuffer || vl(t)) ? n ? s(t) : Yi(new Blob([t]), s) : s(Lt[e] + (t || "")), Yi = (e, t) => {
  const n = new FileReader();
  return n.onload = function() {
    const s = n.result.split(",")[1];
    t("b" + (s || ""));
  }, n.readAsDataURL(e);
};
function Ji(e) {
  return e instanceof Uint8Array ? e : e instanceof ArrayBuffer ? new Uint8Array(e) : new Uint8Array(e.buffer, e.byteOffset, e.byteLength);
}
let Zs;
function Xu(e, t) {
  if (_l && e.data instanceof Blob)
    return e.data.arrayBuffer().then(Ji).then(t);
  if (yl && (e.data instanceof ArrayBuffer || vl(e.data)))
    return t(Ji(e.data));
  Zr(e, !1, (n) => {
    Zs || (Zs = new TextEncoder()), t(Zs.encode(n));
  });
}
const Qi = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", On = typeof Uint8Array > "u" ? [] : new Uint8Array(256);
for (let e = 0; e < Qi.length; e++)
  On[Qi.charCodeAt(e)] = e;
const ef = (e) => {
  let t = e.length * 0.75, n = e.length, s, r = 0, i, o, l, a;
  e[e.length - 1] === "=" && (t--, e[e.length - 2] === "=" && t--);
  const u = new ArrayBuffer(t), f = new Uint8Array(u);
  for (s = 0; s < n; s += 4)
    i = On[e.charCodeAt(s)], o = On[e.charCodeAt(s + 1)], l = On[e.charCodeAt(s + 2)], a = On[e.charCodeAt(s + 3)], f[r++] = i << 2 | o >> 4, f[r++] = (o & 15) << 4 | l >> 2, f[r++] = (l & 3) << 6 | a & 63;
  return u;
}, tf = typeof ArrayBuffer == "function", Gr = (e, t) => {
  if (typeof e != "string")
    return {
      type: "message",
      data: bl(e, t)
    };
  const n = e.charAt(0);
  return n === "b" ? {
    type: "message",
    data: nf(e.substring(1), t)
  } : os[n] ? e.length > 1 ? {
    type: os[n],
    data: e.substring(1)
  } : {
    type: os[n]
  } : gr;
}, nf = (e, t) => {
  if (tf) {
    const n = ef(e);
    return bl(n, t);
  } else
    return { base64: !0, data: e };
}, bl = (e, t) => {
  switch (t) {
    case "blob":
      return e instanceof Blob ? e : new Blob([e]);
    case "arraybuffer":
    default:
      return e instanceof ArrayBuffer ? e : e.buffer;
  }
}, wl = "", sf = (e, t) => {
  const n = e.length, s = new Array(n);
  let r = 0;
  e.forEach((i, o) => {
    Zr(i, !1, (l) => {
      s[o] = l, ++r === n && t(s.join(wl));
    });
  });
}, rf = (e, t) => {
  const n = e.split(wl), s = [];
  for (let r = 0; r < n.length; r++) {
    const i = Gr(n[r], t);
    if (s.push(i), i.type === "error")
      break;
  }
  return s;
};
function of() {
  return new TransformStream({
    transform(e, t) {
      Xu(e, (n) => {
        const s = n.length;
        let r;
        if (s < 126)
          r = new Uint8Array(1), new DataView(r.buffer).setUint8(0, s);
        else if (s < 65536) {
          r = new Uint8Array(3);
          const i = new DataView(r.buffer);
          i.setUint8(0, 126), i.setUint16(1, s);
        } else {
          r = new Uint8Array(9);
          const i = new DataView(r.buffer);
          i.setUint8(0, 127), i.setBigUint64(1, BigInt(s));
        }
        e.data && typeof e.data != "string" && (r[0] |= 128), t.enqueue(r), t.enqueue(n);
      });
    }
  });
}
let Gs;
function Qn(e) {
  return e.reduce((t, n) => t + n.length, 0);
}
function Xn(e, t) {
  if (e[0].length === t)
    return e.shift();
  const n = new Uint8Array(t);
  let s = 0;
  for (let r = 0; r < t; r++)
    n[r] = e[0][s++], s === e[0].length && (e.shift(), s = 0);
  return e.length && s < e[0].length && (e[0] = e[0].slice(s)), n;
}
function lf(e, t) {
  Gs || (Gs = new TextDecoder());
  const n = [];
  let s = 0, r = -1, i = !1;
  return new TransformStream({
    transform(o, l) {
      for (n.push(o); ; ) {
        if (s === 0) {
          if (Qn(n) < 1)
            break;
          const a = Xn(n, 1);
          i = (a[0] & 128) === 128, r = a[0] & 127, r < 126 ? s = 3 : r === 126 ? s = 1 : s = 2;
        } else if (s === 1) {
          if (Qn(n) < 2)
            break;
          const a = Xn(n, 2);
          r = new DataView(a.buffer, a.byteOffset, a.length).getUint16(0), s = 3;
        } else if (s === 2) {
          if (Qn(n) < 8)
            break;
          const a = Xn(n, 8), u = new DataView(a.buffer, a.byteOffset, a.length), f = u.getUint32(0);
          if (f > Math.pow(2, 21) - 1) {
            l.enqueue(gr);
            break;
          }
          r = f * Math.pow(2, 32) + u.getUint32(4), s = 3;
        } else {
          if (Qn(n) < r)
            break;
          const a = Xn(n, r);
          l.enqueue(Gr(i ? a : Gs.decode(a), t)), s = 0;
        }
        if (r === 0 || r > e) {
          l.enqueue(gr);
          break;
        }
      }
    }
  });
}
const kl = 4;
function Me(e) {
  if (e) return af(e);
}
function af(e) {
  for (var t in Me.prototype)
    e[t] = Me.prototype[t];
  return e;
}
Me.prototype.on = Me.prototype.addEventListener = function(e, t) {
  return this._callbacks = this._callbacks || {}, (this._callbacks["$" + e] = this._callbacks["$" + e] || []).push(t), this;
};
Me.prototype.once = function(e, t) {
  function n() {
    this.off(e, n), t.apply(this, arguments);
  }
  return n.fn = t, this.on(e, n), this;
};
Me.prototype.off = Me.prototype.removeListener = Me.prototype.removeAllListeners = Me.prototype.removeEventListener = function(e, t) {
  if (this._callbacks = this._callbacks || {}, arguments.length == 0)
    return this._callbacks = {}, this;
  var n = this._callbacks["$" + e];
  if (!n) return this;
  if (arguments.length == 1)
    return delete this._callbacks["$" + e], this;
  for (var s, r = 0; r < n.length; r++)
    if (s = n[r], s === t || s.fn === t) {
      n.splice(r, 1);
      break;
    }
  return n.length === 0 && delete this._callbacks["$" + e], this;
};
Me.prototype.emit = function(e) {
  this._callbacks = this._callbacks || {};
  for (var t = new Array(arguments.length - 1), n = this._callbacks["$" + e], s = 1; s < arguments.length; s++)
    t[s - 1] = arguments[s];
  if (n) {
    n = n.slice(0);
    for (var s = 0, r = n.length; s < r; ++s)
      n[s].apply(this, t);
  }
  return this;
};
Me.prototype.emitReserved = Me.prototype.emit;
Me.prototype.listeners = function(e) {
  return this._callbacks = this._callbacks || {}, this._callbacks["$" + e] || [];
};
Me.prototype.hasListeners = function(e) {
  return !!this.listeners(e).length;
};
const Ls = typeof Promise == "function" && typeof Promise.resolve == "function" ? (t) => Promise.resolve().then(t) : (t, n) => n(t, 0), ft = typeof self < "u" ? self : typeof window < "u" ? window : Function("return this")(), cf = "arraybuffer";
function xl(e, ...t) {
  return t.reduce((n, s) => (e.hasOwnProperty(s) && (n[s] = e[s]), n), {});
}
const uf = ft.setTimeout, ff = ft.clearTimeout;
function Ps(e, t) {
  t.useNativeTimers ? (e.setTimeoutFn = uf.bind(ft), e.clearTimeoutFn = ff.bind(ft)) : (e.setTimeoutFn = ft.setTimeout.bind(ft), e.clearTimeoutFn = ft.clearTimeout.bind(ft));
}
const hf = 1.33;
function df(e) {
  return typeof e == "string" ? pf(e) : Math.ceil((e.byteLength || e.size) * hf);
}
function pf(e) {
  let t = 0, n = 0;
  for (let s = 0, r = e.length; s < r; s++)
    t = e.charCodeAt(s), t < 128 ? n += 1 : t < 2048 ? n += 2 : t < 55296 || t >= 57344 ? n += 3 : (s++, n += 4);
  return n;
}
function Sl() {
  return Date.now().toString(36).substring(3) + Math.random().toString(36).substring(2, 5);
}
function gf(e) {
  let t = "";
  for (let n in e)
    e.hasOwnProperty(n) && (t.length && (t += "&"), t += encodeURIComponent(n) + "=" + encodeURIComponent(e[n]));
  return t;
}
function mf(e) {
  let t = {}, n = e.split("&");
  for (let s = 0, r = n.length; s < r; s++) {
    let i = n[s].split("=");
    t[decodeURIComponent(i[0])] = decodeURIComponent(i[1]);
  }
  return t;
}
class _f extends Error {
  constructor(t, n, s) {
    super(t), this.description = n, this.context = s, this.type = "TransportError";
  }
}
class Yr extends Me {
  /**
   * Transport abstract constructor.
   *
   * @param {Object} opts - options
   * @protected
   */
  constructor(t) {
    super(), this.writable = !1, Ps(this, t), this.opts = t, this.query = t.query, this.socket = t.socket, this.supportsBinary = !t.forceBase64;
  }
  /**
   * Emits an error.
   *
   * @param {String} reason
   * @param description
   * @param context - the error context
   * @return {Transport} for chaining
   * @protected
   */
  onError(t, n, s) {
    return super.emitReserved("error", new _f(t, n, s)), this;
  }
  /**
   * Opens the transport.
   */
  open() {
    return this.readyState = "opening", this.doOpen(), this;
  }
  /**
   * Closes the transport.
   */
  close() {
    return (this.readyState === "opening" || this.readyState === "open") && (this.doClose(), this.onClose()), this;
  }
  /**
   * Sends multiple packets.
   *
   * @param {Array} packets
   */
  send(t) {
    this.readyState === "open" && this.write(t);
  }
  /**
   * Called upon open
   *
   * @protected
   */
  onOpen() {
    this.readyState = "open", this.writable = !0, super.emitReserved("open");
  }
  /**
   * Called with data.
   *
   * @param {String} data
   * @protected
   */
  onData(t) {
    const n = Gr(t, this.socket.binaryType);
    this.onPacket(n);
  }
  /**
   * Called with a decoded packet.
   *
   * @protected
   */
  onPacket(t) {
    super.emitReserved("packet", t);
  }
  /**
   * Called upon close.
   *
   * @protected
   */
  onClose(t) {
    this.readyState = "closed", super.emitReserved("close", t);
  }
  /**
   * Pauses the transport, in order not to lose packets during an upgrade.
   *
   * @param onPause
   */
  pause(t) {
  }
  createUri(t, n = {}) {
    return t + "://" + this._hostname() + this._port() + this.opts.path + this._query(n);
  }
  _hostname() {
    const t = this.opts.hostname;
    return t.indexOf(":") === -1 ? t : "[" + t + "]";
  }
  _port() {
    return this.opts.port && (this.opts.secure && +(this.opts.port !== 443) || !this.opts.secure && Number(this.opts.port) !== 80) ? ":" + this.opts.port : "";
  }
  _query(t) {
    const n = gf(t);
    return n.length ? "?" + n : "";
  }
}
class yf extends Yr {
  constructor() {
    super(...arguments), this._polling = !1;
  }
  get name() {
    return "polling";
  }
  /**
   * Opens the socket (triggers polling). We write a PING message to determine
   * when the transport is open.
   *
   * @protected
   */
  doOpen() {
    this._poll();
  }
  /**
   * Pauses polling.
   *
   * @param {Function} onPause - callback upon buffers are flushed and transport is paused
   * @package
   */
  pause(t) {
    this.readyState = "pausing";
    const n = () => {
      this.readyState = "paused", t();
    };
    if (this._polling || !this.writable) {
      let s = 0;
      this._polling && (s++, this.once("pollComplete", function() {
        --s || n();
      })), this.writable || (s++, this.once("drain", function() {
        --s || n();
      }));
    } else
      n();
  }
  /**
   * Starts polling cycle.
   *
   * @private
   */
  _poll() {
    this._polling = !0, this.doPoll(), this.emitReserved("poll");
  }
  /**
   * Overloads onData to detect payloads.
   *
   * @protected
   */
  onData(t) {
    const n = (s) => {
      if (this.readyState === "opening" && s.type === "open" && this.onOpen(), s.type === "close")
        return this.onClose({ description: "transport closed by the server" }), !1;
      this.onPacket(s);
    };
    rf(t, this.socket.binaryType).forEach(n), this.readyState !== "closed" && (this._polling = !1, this.emitReserved("pollComplete"), this.readyState === "open" && this._poll());
  }
  /**
   * For polling, send a close packet.
   *
   * @protected
   */
  doClose() {
    const t = () => {
      this.write([{ type: "close" }]);
    };
    this.readyState === "open" ? t() : this.once("open", t);
  }
  /**
   * Writes a packets payload.
   *
   * @param {Array} packets - data packets
   * @protected
   */
  write(t) {
    this.writable = !1, sf(t, (n) => {
      this.doWrite(n, () => {
        this.writable = !0, this.emitReserved("drain");
      });
    });
  }
  /**
   * Generates uri for connection.
   *
   * @private
   */
  uri() {
    const t = this.opts.secure ? "https" : "http", n = this.query || {};
    return this.opts.timestampRequests !== !1 && (n[this.opts.timestampParam] = Sl()), !this.supportsBinary && !n.sid && (n.b64 = 1), this.createUri(t, n);
  }
}
let Cl = !1;
try {
  Cl = typeof XMLHttpRequest < "u" && "withCredentials" in new XMLHttpRequest();
} catch {
}
const vf = Cl;
function bf() {
}
class wf extends yf {
  /**
   * XHR Polling constructor.
   *
   * @param {Object} opts
   * @package
   */
  constructor(t) {
    if (super(t), typeof location < "u") {
      const n = location.protocol === "https:";
      let s = location.port;
      s || (s = n ? "443" : "80"), this.xd = typeof location < "u" && t.hostname !== location.hostname || s !== t.port;
    }
  }
  /**
   * Sends data.
   *
   * @param {String} data to send.
   * @param {Function} called upon flush.
   * @private
   */
  doWrite(t, n) {
    const s = this.request({
      method: "POST",
      data: t
    });
    s.on("success", n), s.on("error", (r, i) => {
      this.onError("xhr post error", r, i);
    });
  }
  /**
   * Starts a poll cycle.
   *
   * @private
   */
  doPoll() {
    const t = this.request();
    t.on("data", this.onData.bind(this)), t.on("error", (n, s) => {
      this.onError("xhr poll error", n, s);
    }), this.pollXhr = t;
  }
}
class It extends Me {
  /**
   * Request constructor
   *
   * @param {Object} options
   * @package
   */
  constructor(t, n, s) {
    super(), this.createRequest = t, Ps(this, s), this._opts = s, this._method = s.method || "GET", this._uri = n, this._data = s.data !== void 0 ? s.data : null, this._create();
  }
  /**
   * Creates the XHR object and sends the request.
   *
   * @private
   */
  _create() {
    var t;
    const n = xl(this._opts, "agent", "pfx", "key", "passphrase", "cert", "ca", "ciphers", "rejectUnauthorized", "autoUnref");
    n.xdomain = !!this._opts.xd;
    const s = this._xhr = this.createRequest(n);
    try {
      s.open(this._method, this._uri, !0);
      try {
        if (this._opts.extraHeaders) {
          s.setDisableHeaderCheck && s.setDisableHeaderCheck(!0);
          for (let r in this._opts.extraHeaders)
            this._opts.extraHeaders.hasOwnProperty(r) && s.setRequestHeader(r, this._opts.extraHeaders[r]);
        }
      } catch {
      }
      if (this._method === "POST")
        try {
          s.setRequestHeader("Content-type", "text/plain;charset=UTF-8");
        } catch {
        }
      try {
        s.setRequestHeader("Accept", "*/*");
      } catch {
      }
      (t = this._opts.cookieJar) === null || t === void 0 || t.addCookies(s), "withCredentials" in s && (s.withCredentials = this._opts.withCredentials), this._opts.requestTimeout && (s.timeout = this._opts.requestTimeout), s.onreadystatechange = () => {
        var r;
        s.readyState === 3 && ((r = this._opts.cookieJar) === null || r === void 0 || r.parseCookies(
          // @ts-ignore
          s.getResponseHeader("set-cookie")
        )), s.readyState === 4 && (s.status === 200 || s.status === 1223 ? this._onLoad() : this.setTimeoutFn(() => {
          this._onError(typeof s.status == "number" ? s.status : 0);
        }, 0));
      }, s.send(this._data);
    } catch (r) {
      this.setTimeoutFn(() => {
        this._onError(r);
      }, 0);
      return;
    }
    typeof document < "u" && (this._index = It.requestsCount++, It.requests[this._index] = this);
  }
  /**
   * Called upon error.
   *
   * @private
   */
  _onError(t) {
    this.emitReserved("error", t, this._xhr), this._cleanup(!0);
  }
  /**
   * Cleans up house.
   *
   * @private
   */
  _cleanup(t) {
    if (!(typeof this._xhr > "u" || this._xhr === null)) {
      if (this._xhr.onreadystatechange = bf, t)
        try {
          this._xhr.abort();
        } catch {
        }
      typeof document < "u" && delete It.requests[this._index], this._xhr = null;
    }
  }
  /**
   * Called upon load.
   *
   * @private
   */
  _onLoad() {
    const t = this._xhr.responseText;
    t !== null && (this.emitReserved("data", t), this.emitReserved("success"), this._cleanup());
  }
  /**
   * Aborts the request.
   *
   * @package
   */
  abort() {
    this._cleanup();
  }
}
It.requestsCount = 0;
It.requests = {};
if (typeof document < "u") {
  if (typeof attachEvent == "function")
    attachEvent("onunload", Xi);
  else if (typeof addEventListener == "function") {
    const e = "onpagehide" in ft ? "pagehide" : "unload";
    addEventListener(e, Xi, !1);
  }
}
function Xi() {
  for (let e in It.requests)
    It.requests.hasOwnProperty(e) && It.requests[e].abort();
}
const kf = function() {
  const e = Tl({
    xdomain: !1
  });
  return e && e.responseType !== null;
}();
class xf extends wf {
  constructor(t) {
    super(t);
    const n = t && t.forceBase64;
    this.supportsBinary = kf && !n;
  }
  request(t = {}) {
    return Object.assign(t, { xd: this.xd }, this.opts), new It(Tl, this.uri(), t);
  }
}
function Tl(e) {
  const t = e.xdomain;
  try {
    if (typeof XMLHttpRequest < "u" && (!t || vf))
      return new XMLHttpRequest();
  } catch {
  }
  if (!t)
    try {
      return new ft[["Active"].concat("Object").join("X")]("Microsoft.XMLHTTP");
    } catch {
    }
}
const El = typeof navigator < "u" && typeof navigator.product == "string" && navigator.product.toLowerCase() === "reactnative";
class Sf extends Yr {
  get name() {
    return "websocket";
  }
  doOpen() {
    const t = this.uri(), n = this.opts.protocols, s = El ? {} : xl(this.opts, "agent", "perMessageDeflate", "pfx", "key", "passphrase", "cert", "ca", "ciphers", "rejectUnauthorized", "localAddress", "protocolVersion", "origin", "maxPayload", "family", "checkServerIdentity");
    this.opts.extraHeaders && (s.headers = this.opts.extraHeaders);
    try {
      this.ws = this.createSocket(t, n, s);
    } catch (r) {
      return this.emitReserved("error", r);
    }
    this.ws.binaryType = this.socket.binaryType, this.addEventListeners();
  }
  /**
   * Adds event listeners to the socket
   *
   * @private
   */
  addEventListeners() {
    this.ws.onopen = () => {
      this.opts.autoUnref && this.ws._socket.unref(), this.onOpen();
    }, this.ws.onclose = (t) => this.onClose({
      description: "websocket connection closed",
      context: t
    }), this.ws.onmessage = (t) => this.onData(t.data), this.ws.onerror = (t) => this.onError("websocket error", t);
  }
  write(t) {
    this.writable = !1;
    for (let n = 0; n < t.length; n++) {
      const s = t[n], r = n === t.length - 1;
      Zr(s, this.supportsBinary, (i) => {
        try {
          this.doWrite(s, i);
        } catch {
        }
        r && Ls(() => {
          this.writable = !0, this.emitReserved("drain");
        }, this.setTimeoutFn);
      });
    }
  }
  doClose() {
    typeof this.ws < "u" && (this.ws.onerror = () => {
    }, this.ws.close(), this.ws = null);
  }
  /**
   * Generates uri for connection.
   *
   * @private
   */
  uri() {
    const t = this.opts.secure ? "wss" : "ws", n = this.query || {};
    return this.opts.timestampRequests && (n[this.opts.timestampParam] = Sl()), this.supportsBinary || (n.b64 = 1), this.createUri(t, n);
  }
}
const Ys = ft.WebSocket || ft.MozWebSocket;
class Cf extends Sf {
  createSocket(t, n, s) {
    return El ? new Ys(t, n, s) : n ? new Ys(t, n) : new Ys(t);
  }
  doWrite(t, n) {
    this.ws.send(n);
  }
}
class Tf extends Yr {
  get name() {
    return "webtransport";
  }
  doOpen() {
    try {
      this._transport = new WebTransport(this.createUri("https"), this.opts.transportOptions[this.name]);
    } catch (t) {
      return this.emitReserved("error", t);
    }
    this._transport.closed.then(() => {
      this.onClose();
    }).catch((t) => {
      this.onError("webtransport error", t);
    }), this._transport.ready.then(() => {
      this._transport.createBidirectionalStream().then((t) => {
        const n = lf(Number.MAX_SAFE_INTEGER, this.socket.binaryType), s = t.readable.pipeThrough(n).getReader(), r = of();
        r.readable.pipeTo(t.writable), this._writer = r.writable.getWriter();
        const i = () => {
          s.read().then(({ done: l, value: a }) => {
            l || (this.onPacket(a), i());
          }).catch((l) => {
          });
        };
        i();
        const o = { type: "open" };
        this.query.sid && (o.data = `{"sid":"${this.query.sid}"}`), this._writer.write(o).then(() => this.onOpen());
      });
    });
  }
  write(t) {
    this.writable = !1;
    for (let n = 0; n < t.length; n++) {
      const s = t[n], r = n === t.length - 1;
      this._writer.write(s).then(() => {
        r && Ls(() => {
          this.writable = !0, this.emitReserved("drain");
        }, this.setTimeoutFn);
      });
    }
  }
  doClose() {
    var t;
    (t = this._transport) === null || t === void 0 || t.close();
  }
}
const Ef = {
  websocket: Cf,
  webtransport: Tf,
  polling: xf
}, Af = /^(?:(?![^:@\/?#]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@\/?#]*)(?::([^:@\/?#]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/, Rf = [
  "source",
  "protocol",
  "authority",
  "userInfo",
  "user",
  "password",
  "host",
  "port",
  "relative",
  "path",
  "directory",
  "file",
  "query",
  "anchor"
];
function mr(e) {
  if (e.length > 8e3)
    throw "URI too long";
  const t = e, n = e.indexOf("["), s = e.indexOf("]");
  n != -1 && s != -1 && (e = e.substring(0, n) + e.substring(n, s).replace(/:/g, ";") + e.substring(s, e.length));
  let r = Af.exec(e || ""), i = {}, o = 14;
  for (; o--; )
    i[Rf[o]] = r[o] || "";
  return n != -1 && s != -1 && (i.source = t, i.host = i.host.substring(1, i.host.length - 1).replace(/;/g, ":"), i.authority = i.authority.replace("[", "").replace("]", "").replace(/;/g, ":"), i.ipv6uri = !0), i.pathNames = If(i, i.path), i.queryKey = Of(i, i.query), i;
}
function If(e, t) {
  const n = /\/{2,9}/g, s = t.replace(n, "/").split("/");
  return (t.slice(0, 1) == "/" || t.length === 0) && s.splice(0, 1), t.slice(-1) == "/" && s.splice(s.length - 1, 1), s;
}
function Of(e, t) {
  const n = {};
  return t.replace(/(?:^|&)([^&=]*)=?([^&]*)/g, function(s, r, i) {
    r && (n[r] = i);
  }), n;
}
const _r = typeof addEventListener == "function" && typeof removeEventListener == "function", ls = [];
_r && addEventListener("offline", () => {
  ls.forEach((e) => e());
}, !1);
class Jt extends Me {
  /**
   * Socket constructor.
   *
   * @param {String|Object} uri - uri or options
   * @param {Object} opts - options
   */
  constructor(t, n) {
    if (super(), this.binaryType = cf, this.writeBuffer = [], this._prevBufferLen = 0, this._pingInterval = -1, this._pingTimeout = -1, this._maxPayload = -1, this._pingTimeoutTime = 1 / 0, t && typeof t == "object" && (n = t, t = null), t) {
      const s = mr(t);
      n.hostname = s.host, n.secure = s.protocol === "https" || s.protocol === "wss", n.port = s.port, s.query && (n.query = s.query);
    } else n.host && (n.hostname = mr(n.host).host);
    Ps(this, n), this.secure = n.secure != null ? n.secure : typeof location < "u" && location.protocol === "https:", n.hostname && !n.port && (n.port = this.secure ? "443" : "80"), this.hostname = n.hostname || (typeof location < "u" ? location.hostname : "localhost"), this.port = n.port || (typeof location < "u" && location.port ? location.port : this.secure ? "443" : "80"), this.transports = [], this._transportsByName = {}, n.transports.forEach((s) => {
      const r = s.prototype.name;
      this.transports.push(r), this._transportsByName[r] = s;
    }), this.opts = Object.assign({
      path: "/engine.io",
      agent: !1,
      withCredentials: !1,
      upgrade: !0,
      timestampParam: "t",
      rememberUpgrade: !1,
      addTrailingSlash: !0,
      rejectUnauthorized: !0,
      perMessageDeflate: {
        threshold: 1024
      },
      transportOptions: {},
      closeOnBeforeunload: !1
    }, n), this.opts.path = this.opts.path.replace(/\/$/, "") + (this.opts.addTrailingSlash ? "/" : ""), typeof this.opts.query == "string" && (this.opts.query = mf(this.opts.query)), _r && (this.opts.closeOnBeforeunload && (this._beforeunloadEventListener = () => {
      this.transport && (this.transport.removeAllListeners(), this.transport.close());
    }, addEventListener("beforeunload", this._beforeunloadEventListener, !1)), this.hostname !== "localhost" && (this._offlineEventListener = () => {
      this._onClose("transport close", {
        description: "network connection lost"
      });
    }, ls.push(this._offlineEventListener))), this.opts.withCredentials && (this._cookieJar = void 0), this._open();
  }
  /**
   * Creates transport of the given type.
   *
   * @param {String} name - transport name
   * @return {Transport}
   * @private
   */
  createTransport(t) {
    const n = Object.assign({}, this.opts.query);
    n.EIO = kl, n.transport = t, this.id && (n.sid = this.id);
    const s = Object.assign({}, this.opts, {
      query: n,
      socket: this,
      hostname: this.hostname,
      secure: this.secure,
      port: this.port
    }, this.opts.transportOptions[t]);
    return new this._transportsByName[t](s);
  }
  /**
   * Initializes transport to use and starts probe.
   *
   * @private
   */
  _open() {
    if (this.transports.length === 0) {
      this.setTimeoutFn(() => {
        this.emitReserved("error", "No transports available");
      }, 0);
      return;
    }
    const t = this.opts.rememberUpgrade && Jt.priorWebsocketSuccess && this.transports.indexOf("websocket") !== -1 ? "websocket" : this.transports[0];
    this.readyState = "opening";
    const n = this.createTransport(t);
    n.open(), this.setTransport(n);
  }
  /**
   * Sets the current transport. Disables the existing one (if any).
   *
   * @private
   */
  setTransport(t) {
    this.transport && this.transport.removeAllListeners(), this.transport = t, t.on("drain", this._onDrain.bind(this)).on("packet", this._onPacket.bind(this)).on("error", this._onError.bind(this)).on("close", (n) => this._onClose("transport close", n));
  }
  /**
   * Called when connection is deemed open.
   *
   * @private
   */
  onOpen() {
    this.readyState = "open", Jt.priorWebsocketSuccess = this.transport.name === "websocket", this.emitReserved("open"), this.flush();
  }
  /**
   * Handles a packet.
   *
   * @private
   */
  _onPacket(t) {
    if (this.readyState === "opening" || this.readyState === "open" || this.readyState === "closing")
      switch (this.emitReserved("packet", t), this.emitReserved("heartbeat"), t.type) {
        case "open":
          this.onHandshake(JSON.parse(t.data));
          break;
        case "ping":
          this._sendPacket("pong"), this.emitReserved("ping"), this.emitReserved("pong"), this._resetPingTimeout();
          break;
        case "error":
          const n = new Error("server error");
          n.code = t.data, this._onError(n);
          break;
        case "message":
          this.emitReserved("data", t.data), this.emitReserved("message", t.data);
          break;
      }
  }
  /**
   * Called upon handshake completion.
   *
   * @param {Object} data - handshake obj
   * @private
   */
  onHandshake(t) {
    this.emitReserved("handshake", t), this.id = t.sid, this.transport.query.sid = t.sid, this._pingInterval = t.pingInterval, this._pingTimeout = t.pingTimeout, this._maxPayload = t.maxPayload, this.onOpen(), this.readyState !== "closed" && this._resetPingTimeout();
  }
  /**
   * Sets and resets ping timeout timer based on server pings.
   *
   * @private
   */
  _resetPingTimeout() {
    this.clearTimeoutFn(this._pingTimeoutTimer);
    const t = this._pingInterval + this._pingTimeout;
    this._pingTimeoutTime = Date.now() + t, this._pingTimeoutTimer = this.setTimeoutFn(() => {
      this._onClose("ping timeout");
    }, t), this.opts.autoUnref && this._pingTimeoutTimer.unref();
  }
  /**
   * Called on `drain` event
   *
   * @private
   */
  _onDrain() {
    this.writeBuffer.splice(0, this._prevBufferLen), this._prevBufferLen = 0, this.writeBuffer.length === 0 ? this.emitReserved("drain") : this.flush();
  }
  /**
   * Flush write buffers.
   *
   * @private
   */
  flush() {
    if (this.readyState !== "closed" && this.transport.writable && !this.upgrading && this.writeBuffer.length) {
      const t = this._getWritablePackets();
      this.transport.send(t), this._prevBufferLen = t.length, this.emitReserved("flush");
    }
  }
  /**
   * Ensure the encoded size of the writeBuffer is below the maxPayload value sent by the server (only for HTTP
   * long-polling)
   *
   * @private
   */
  _getWritablePackets() {
    if (!(this._maxPayload && this.transport.name === "polling" && this.writeBuffer.length > 1))
      return this.writeBuffer;
    let n = 1;
    for (let s = 0; s < this.writeBuffer.length; s++) {
      const r = this.writeBuffer[s].data;
      if (r && (n += df(r)), s > 0 && n > this._maxPayload)
        return this.writeBuffer.slice(0, s);
      n += 2;
    }
    return this.writeBuffer;
  }
  /**
   * Checks whether the heartbeat timer has expired but the socket has not yet been notified.
   *
   * Note: this method is private for now because it does not really fit the WebSocket API, but if we put it in the
   * `write()` method then the message would not be buffered by the Socket.IO client.
   *
   * @return {boolean}
   * @private
   */
  /* private */
  _hasPingExpired() {
    if (!this._pingTimeoutTime)
      return !0;
    const t = Date.now() > this._pingTimeoutTime;
    return t && (this._pingTimeoutTime = 0, Ls(() => {
      this._onClose("ping timeout");
    }, this.setTimeoutFn)), t;
  }
  /**
   * Sends a message.
   *
   * @param {String} msg - message.
   * @param {Object} options.
   * @param {Function} fn - callback function.
   * @return {Socket} for chaining.
   */
  write(t, n, s) {
    return this._sendPacket("message", t, n, s), this;
  }
  /**
   * Sends a message. Alias of {@link Socket#write}.
   *
   * @param {String} msg - message.
   * @param {Object} options.
   * @param {Function} fn - callback function.
   * @return {Socket} for chaining.
   */
  send(t, n, s) {
    return this._sendPacket("message", t, n, s), this;
  }
  /**
   * Sends a packet.
   *
   * @param {String} type: packet type.
   * @param {String} data.
   * @param {Object} options.
   * @param {Function} fn - callback function.
   * @private
   */
  _sendPacket(t, n, s, r) {
    if (typeof n == "function" && (r = n, n = void 0), typeof s == "function" && (r = s, s = null), this.readyState === "closing" || this.readyState === "closed")
      return;
    s = s || {}, s.compress = s.compress !== !1;
    const i = {
      type: t,
      data: n,
      options: s
    };
    this.emitReserved("packetCreate", i), this.writeBuffer.push(i), r && this.once("flush", r), this.flush();
  }
  /**
   * Closes the connection.
   */
  close() {
    const t = () => {
      this._onClose("forced close"), this.transport.close();
    }, n = () => {
      this.off("upgrade", n), this.off("upgradeError", n), t();
    }, s = () => {
      this.once("upgrade", n), this.once("upgradeError", n);
    };
    return (this.readyState === "opening" || this.readyState === "open") && (this.readyState = "closing", this.writeBuffer.length ? this.once("drain", () => {
      this.upgrading ? s() : t();
    }) : this.upgrading ? s() : t()), this;
  }
  /**
   * Called upon transport error
   *
   * @private
   */
  _onError(t) {
    if (Jt.priorWebsocketSuccess = !1, this.opts.tryAllTransports && this.transports.length > 1 && this.readyState === "opening")
      return this.transports.shift(), this._open();
    this.emitReserved("error", t), this._onClose("transport error", t);
  }
  /**
   * Called upon transport close.
   *
   * @private
   */
  _onClose(t, n) {
    if (this.readyState === "opening" || this.readyState === "open" || this.readyState === "closing") {
      if (this.clearTimeoutFn(this._pingTimeoutTimer), this.transport.removeAllListeners("close"), this.transport.close(), this.transport.removeAllListeners(), _r && (this._beforeunloadEventListener && removeEventListener("beforeunload", this._beforeunloadEventListener, !1), this._offlineEventListener)) {
        const s = ls.indexOf(this._offlineEventListener);
        s !== -1 && ls.splice(s, 1);
      }
      this.readyState = "closed", this.id = null, this.emitReserved("close", t, n), this.writeBuffer = [], this._prevBufferLen = 0;
    }
  }
}
Jt.protocol = kl;
class Lf extends Jt {
  constructor() {
    super(...arguments), this._upgrades = [];
  }
  onOpen() {
    if (super.onOpen(), this.readyState === "open" && this.opts.upgrade)
      for (let t = 0; t < this._upgrades.length; t++)
        this._probe(this._upgrades[t]);
  }
  /**
   * Probes a transport.
   *
   * @param {String} name - transport name
   * @private
   */
  _probe(t) {
    let n = this.createTransport(t), s = !1;
    Jt.priorWebsocketSuccess = !1;
    const r = () => {
      s || (n.send([{ type: "ping", data: "probe" }]), n.once("packet", (_) => {
        if (!s)
          if (_.type === "pong" && _.data === "probe") {
            if (this.upgrading = !0, this.emitReserved("upgrading", n), !n)
              return;
            Jt.priorWebsocketSuccess = n.name === "websocket", this.transport.pause(() => {
              s || this.readyState !== "closed" && (f(), this.setTransport(n), n.send([{ type: "upgrade" }]), this.emitReserved("upgrade", n), n = null, this.upgrading = !1, this.flush());
            });
          } else {
            const b = new Error("probe error");
            b.transport = n.name, this.emitReserved("upgradeError", b);
          }
      }));
    };
    function i() {
      s || (s = !0, f(), n.close(), n = null);
    }
    const o = (_) => {
      const b = new Error("probe error: " + _);
      b.transport = n.name, i(), this.emitReserved("upgradeError", b);
    };
    function l() {
      o("transport closed");
    }
    function a() {
      o("socket closed");
    }
    function u(_) {
      n && _.name !== n.name && i();
    }
    const f = () => {
      n.removeListener("open", r), n.removeListener("error", o), n.removeListener("close", l), this.off("close", a), this.off("upgrading", u);
    };
    n.once("open", r), n.once("error", o), n.once("close", l), this.once("close", a), this.once("upgrading", u), this._upgrades.indexOf("webtransport") !== -1 && t !== "webtransport" ? this.setTimeoutFn(() => {
      s || n.open();
    }, 200) : n.open();
  }
  onHandshake(t) {
    this._upgrades = this._filterUpgrades(t.upgrades), super.onHandshake(t);
  }
  /**
   * Filters upgrades, returning only those matching client transports.
   *
   * @param {Array} upgrades - server upgrades
   * @private
   */
  _filterUpgrades(t) {
    const n = [];
    for (let s = 0; s < t.length; s++)
      ~this.transports.indexOf(t[s]) && n.push(t[s]);
    return n;
  }
}
let Pf = class extends Lf {
  constructor(t, n = {}) {
    const s = typeof t == "object" ? t : n;
    (!s.transports || s.transports && typeof s.transports[0] == "string") && (s.transports = (s.transports || ["polling", "websocket", "webtransport"]).map((r) => Ef[r]).filter((r) => !!r)), super(t, s);
  }
};
function $f(e, t = "", n) {
  let s = e;
  n = n || typeof location < "u" && location, e == null && (e = n.protocol + "//" + n.host), typeof e == "string" && (e.charAt(0) === "/" && (e.charAt(1) === "/" ? e = n.protocol + e : e = n.host + e), /^(https?|wss?):\/\//.test(e) || (typeof n < "u" ? e = n.protocol + "//" + e : e = "https://" + e), s = mr(e)), s.port || (/^(http|ws)$/.test(s.protocol) ? s.port = "80" : /^(http|ws)s$/.test(s.protocol) && (s.port = "443")), s.path = s.path || "/";
  const i = s.host.indexOf(":") !== -1 ? "[" + s.host + "]" : s.host;
  return s.id = s.protocol + "://" + i + ":" + s.port + t, s.href = s.protocol + "://" + i + (n && n.port === s.port ? "" : ":" + s.port), s;
}
const Ff = typeof ArrayBuffer == "function", Nf = (e) => typeof ArrayBuffer.isView == "function" ? ArrayBuffer.isView(e) : e.buffer instanceof ArrayBuffer, Al = Object.prototype.toString, Bf = typeof Blob == "function" || typeof Blob < "u" && Al.call(Blob) === "[object BlobConstructor]", Mf = typeof File == "function" || typeof File < "u" && Al.call(File) === "[object FileConstructor]";
function Jr(e) {
  return Ff && (e instanceof ArrayBuffer || Nf(e)) || Bf && e instanceof Blob || Mf && e instanceof File;
}
function as(e, t) {
  if (!e || typeof e != "object")
    return !1;
  if (Array.isArray(e)) {
    for (let n = 0, s = e.length; n < s; n++)
      if (as(e[n]))
        return !0;
    return !1;
  }
  if (Jr(e))
    return !0;
  if (e.toJSON && typeof e.toJSON == "function" && arguments.length === 1)
    return as(e.toJSON(), !0);
  for (const n in e)
    if (Object.prototype.hasOwnProperty.call(e, n) && as(e[n]))
      return !0;
  return !1;
}
function Df(e) {
  const t = [], n = e.data, s = e;
  return s.data = yr(n, t), s.attachments = t.length, { packet: s, buffers: t };
}
function yr(e, t) {
  if (!e)
    return e;
  if (Jr(e)) {
    const n = { _placeholder: !0, num: t.length };
    return t.push(e), n;
  } else if (Array.isArray(e)) {
    const n = new Array(e.length);
    for (let s = 0; s < e.length; s++)
      n[s] = yr(e[s], t);
    return n;
  } else if (typeof e == "object" && !(e instanceof Date)) {
    const n = {};
    for (const s in e)
      Object.prototype.hasOwnProperty.call(e, s) && (n[s] = yr(e[s], t));
    return n;
  }
  return e;
}
function qf(e, t) {
  return e.data = vr(e.data, t), delete e.attachments, e;
}
function vr(e, t) {
  if (!e)
    return e;
  if (e && e._placeholder === !0) {
    if (typeof e.num == "number" && e.num >= 0 && e.num < t.length)
      return t[e.num];
    throw new Error("illegal attachments");
  } else if (Array.isArray(e))
    for (let n = 0; n < e.length; n++)
      e[n] = vr(e[n], t);
  else if (typeof e == "object")
    for (const n in e)
      Object.prototype.hasOwnProperty.call(e, n) && (e[n] = vr(e[n], t));
  return e;
}
const Vf = [
  "connect",
  "connect_error",
  "disconnect",
  "disconnecting",
  "newListener",
  "removeListener"
  // used by the Node.js EventEmitter
], Hf = 5;
var ce;
(function(e) {
  e[e.CONNECT = 0] = "CONNECT", e[e.DISCONNECT = 1] = "DISCONNECT", e[e.EVENT = 2] = "EVENT", e[e.ACK = 3] = "ACK", e[e.CONNECT_ERROR = 4] = "CONNECT_ERROR", e[e.BINARY_EVENT = 5] = "BINARY_EVENT", e[e.BINARY_ACK = 6] = "BINARY_ACK";
})(ce || (ce = {}));
class Uf {
  /**
   * Encoder constructor
   *
   * @param {function} replacer - custom replacer to pass down to JSON.parse
   */
  constructor(t) {
    this.replacer = t;
  }
  /**
   * Encode a packet as a single string if non-binary, or as a
   * buffer sequence, depending on packet type.
   *
   * @param {Object} obj - packet object
   */
  encode(t) {
    return (t.type === ce.EVENT || t.type === ce.ACK) && as(t) ? this.encodeAsBinary({
      type: t.type === ce.EVENT ? ce.BINARY_EVENT : ce.BINARY_ACK,
      nsp: t.nsp,
      data: t.data,
      id: t.id
    }) : [this.encodeAsString(t)];
  }
  /**
   * Encode packet as string.
   */
  encodeAsString(t) {
    let n = "" + t.type;
    return (t.type === ce.BINARY_EVENT || t.type === ce.BINARY_ACK) && (n += t.attachments + "-"), t.nsp && t.nsp !== "/" && (n += t.nsp + ","), t.id != null && (n += t.id), t.data != null && (n += JSON.stringify(t.data, this.replacer)), n;
  }
  /**
   * Encode packet as 'buffer sequence' by removing blobs, and
   * deconstructing packet into object with placeholders and
   * a list of buffers.
   */
  encodeAsBinary(t) {
    const n = Df(t), s = this.encodeAsString(n.packet), r = n.buffers;
    return r.unshift(s), r;
  }
}
function eo(e) {
  return Object.prototype.toString.call(e) === "[object Object]";
}
class Qr extends Me {
  /**
   * Decoder constructor
   *
   * @param {function} reviver - custom reviver to pass down to JSON.stringify
   */
  constructor(t) {
    super(), this.reviver = t;
  }
  /**
   * Decodes an encoded packet string into packet JSON.
   *
   * @param {String} obj - encoded packet
   */
  add(t) {
    let n;
    if (typeof t == "string") {
      if (this.reconstructor)
        throw new Error("got plaintext data when reconstructing a packet");
      n = this.decodeString(t);
      const s = n.type === ce.BINARY_EVENT;
      s || n.type === ce.BINARY_ACK ? (n.type = s ? ce.EVENT : ce.ACK, this.reconstructor = new jf(n), n.attachments === 0 && super.emitReserved("decoded", n)) : super.emitReserved("decoded", n);
    } else if (Jr(t) || t.base64)
      if (this.reconstructor)
        n = this.reconstructor.takeBinaryData(t), n && (this.reconstructor = null, super.emitReserved("decoded", n));
      else
        throw new Error("got binary data when not reconstructing a packet");
    else
      throw new Error("Unknown type: " + t);
  }
  /**
   * Decode a packet String (JSON data)
   *
   * @param {String} str
   * @return {Object} packet
   */
  decodeString(t) {
    let n = 0;
    const s = {
      type: Number(t.charAt(0))
    };
    if (ce[s.type] === void 0)
      throw new Error("unknown packet type " + s.type);
    if (s.type === ce.BINARY_EVENT || s.type === ce.BINARY_ACK) {
      const i = n + 1;
      for (; t.charAt(++n) !== "-" && n != t.length; )
        ;
      const o = t.substring(i, n);
      if (o != Number(o) || t.charAt(n) !== "-")
        throw new Error("Illegal attachments");
      s.attachments = Number(o);
    }
    if (t.charAt(n + 1) === "/") {
      const i = n + 1;
      for (; ++n && !(t.charAt(n) === "," || n === t.length); )
        ;
      s.nsp = t.substring(i, n);
    } else
      s.nsp = "/";
    const r = t.charAt(n + 1);
    if (r !== "" && Number(r) == r) {
      const i = n + 1;
      for (; ++n; ) {
        const o = t.charAt(n);
        if (o == null || Number(o) != o) {
          --n;
          break;
        }
        if (n === t.length)
          break;
      }
      s.id = Number(t.substring(i, n + 1));
    }
    if (t.charAt(++n)) {
      const i = this.tryParse(t.substr(n));
      if (Qr.isPayloadValid(s.type, i))
        s.data = i;
      else
        throw new Error("invalid payload");
    }
    return s;
  }
  tryParse(t) {
    try {
      return JSON.parse(t, this.reviver);
    } catch {
      return !1;
    }
  }
  static isPayloadValid(t, n) {
    switch (t) {
      case ce.CONNECT:
        return eo(n);
      case ce.DISCONNECT:
        return n === void 0;
      case ce.CONNECT_ERROR:
        return typeof n == "string" || eo(n);
      case ce.EVENT:
      case ce.BINARY_EVENT:
        return Array.isArray(n) && (typeof n[0] == "number" || typeof n[0] == "string" && Vf.indexOf(n[0]) === -1);
      case ce.ACK:
      case ce.BINARY_ACK:
        return Array.isArray(n);
    }
  }
  /**
   * Deallocates a parser's resources
   */
  destroy() {
    this.reconstructor && (this.reconstructor.finishedReconstruction(), this.reconstructor = null);
  }
}
class jf {
  constructor(t) {
    this.packet = t, this.buffers = [], this.reconPack = t;
  }
  /**
   * Method to be called when binary data received from connection
   * after a BINARY_EVENT packet.
   *
   * @param {Buffer | ArrayBuffer} binData - the raw binary data received
   * @return {null | Object} returns null if more binary data is expected or
   *   a reconstructed packet object if all buffers have been received.
   */
  takeBinaryData(t) {
    if (this.buffers.push(t), this.buffers.length === this.reconPack.attachments) {
      const n = qf(this.reconPack, this.buffers);
      return this.finishedReconstruction(), n;
    }
    return null;
  }
  /**
   * Cleans up binary packet reconstruction variables.
   */
  finishedReconstruction() {
    this.reconPack = null, this.buffers = [];
  }
}
const Wf = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Decoder: Qr,
  Encoder: Uf,
  get PacketType() {
    return ce;
  },
  protocol: Hf
}, Symbol.toStringTag, { value: "Module" }));
function vt(e, t, n) {
  return e.on(t, n), function() {
    e.off(t, n);
  };
}
const zf = Object.freeze({
  connect: 1,
  connect_error: 1,
  disconnect: 1,
  disconnecting: 1,
  // EventEmitter reserved events: https://nodejs.org/api/events.html#events_event_newlistener
  newListener: 1,
  removeListener: 1
});
class Rl extends Me {
  /**
   * `Socket` constructor.
   */
  constructor(t, n, s) {
    super(), this.connected = !1, this.recovered = !1, this.receiveBuffer = [], this.sendBuffer = [], this._queue = [], this._queueSeq = 0, this.ids = 0, this.acks = {}, this.flags = {}, this.io = t, this.nsp = n, s && s.auth && (this.auth = s.auth), this._opts = Object.assign({}, s), this.io._autoConnect && this.open();
  }
  /**
   * Whether the socket is currently disconnected
   *
   * @example
   * const socket = io();
   *
   * socket.on("connect", () => {
   *   console.log(socket.disconnected); // false
   * });
   *
   * socket.on("disconnect", () => {
   *   console.log(socket.disconnected); // true
   * });
   */
  get disconnected() {
    return !this.connected;
  }
  /**
   * Subscribe to open, close and packet events
   *
   * @private
   */
  subEvents() {
    if (this.subs)
      return;
    const t = this.io;
    this.subs = [
      vt(t, "open", this.onopen.bind(this)),
      vt(t, "packet", this.onpacket.bind(this)),
      vt(t, "error", this.onerror.bind(this)),
      vt(t, "close", this.onclose.bind(this))
    ];
  }
  /**
   * Whether the Socket will try to reconnect when its Manager connects or reconnects.
   *
   * @example
   * const socket = io();
   *
   * console.log(socket.active); // true
   *
   * socket.on("disconnect", (reason) => {
   *   if (reason === "io server disconnect") {
   *     // the disconnection was initiated by the server, you need to manually reconnect
   *     console.log(socket.active); // false
   *   }
   *   // else the socket will automatically try to reconnect
   *   console.log(socket.active); // true
   * });
   */
  get active() {
    return !!this.subs;
  }
  /**
   * "Opens" the socket.
   *
   * @example
   * const socket = io({
   *   autoConnect: false
   * });
   *
   * socket.connect();
   */
  connect() {
    return this.connected ? this : (this.subEvents(), this.io._reconnecting || this.io.open(), this.io._readyState === "open" && this.onopen(), this);
  }
  /**
   * Alias for {@link connect()}.
   */
  open() {
    return this.connect();
  }
  /**
   * Sends a `message` event.
   *
   * This method mimics the WebSocket.send() method.
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/send
   *
   * @example
   * socket.send("hello");
   *
   * // this is equivalent to
   * socket.emit("message", "hello");
   *
   * @return self
   */
  send(...t) {
    return t.unshift("message"), this.emit.apply(this, t), this;
  }
  /**
   * Override `emit`.
   * If the event is in `events`, it's emitted normally.
   *
   * @example
   * socket.emit("hello", "world");
   *
   * // all serializable datastructures are supported (no need to call JSON.stringify)
   * socket.emit("hello", 1, "2", { 3: ["4"], 5: Uint8Array.from([6]) });
   *
   * // with an acknowledgement from the server
   * socket.emit("hello", "world", (val) => {
   *   // ...
   * });
   *
   * @return self
   */
  emit(t, ...n) {
    var s, r, i;
    if (zf.hasOwnProperty(t))
      throw new Error('"' + t.toString() + '" is a reserved event name');
    if (n.unshift(t), this._opts.retries && !this.flags.fromQueue && !this.flags.volatile)
      return this._addToQueue(n), this;
    const o = {
      type: ce.EVENT,
      data: n
    };
    if (o.options = {}, o.options.compress = this.flags.compress !== !1, typeof n[n.length - 1] == "function") {
      const f = this.ids++, _ = n.pop();
      this._registerAckCallback(f, _), o.id = f;
    }
    const l = (r = (s = this.io.engine) === null || s === void 0 ? void 0 : s.transport) === null || r === void 0 ? void 0 : r.writable, a = this.connected && !(!((i = this.io.engine) === null || i === void 0) && i._hasPingExpired());
    return this.flags.volatile && !l || (a ? (this.notifyOutgoingListeners(o), this.packet(o)) : this.sendBuffer.push(o)), this.flags = {}, this;
  }
  /**
   * @private
   */
  _registerAckCallback(t, n) {
    var s;
    const r = (s = this.flags.timeout) !== null && s !== void 0 ? s : this._opts.ackTimeout;
    if (r === void 0) {
      this.acks[t] = n;
      return;
    }
    const i = this.io.setTimeoutFn(() => {
      delete this.acks[t];
      for (let l = 0; l < this.sendBuffer.length; l++)
        this.sendBuffer[l].id === t && this.sendBuffer.splice(l, 1);
      n.call(this, new Error("operation has timed out"));
    }, r), o = (...l) => {
      this.io.clearTimeoutFn(i), n.apply(this, l);
    };
    o.withError = !0, this.acks[t] = o;
  }
  /**
   * Emits an event and waits for an acknowledgement
   *
   * @example
   * // without timeout
   * const response = await socket.emitWithAck("hello", "world");
   *
   * // with a specific timeout
   * try {
   *   const response = await socket.timeout(1000).emitWithAck("hello", "world");
   * } catch (err) {
   *   // the server did not acknowledge the event in the given delay
   * }
   *
   * @return a Promise that will be fulfilled when the server acknowledges the event
   */
  emitWithAck(t, ...n) {
    return new Promise((s, r) => {
      const i = (o, l) => o ? r(o) : s(l);
      i.withError = !0, n.push(i), this.emit(t, ...n);
    });
  }
  /**
   * Add the packet to the queue.
   * @param args
   * @private
   */
  _addToQueue(t) {
    let n;
    typeof t[t.length - 1] == "function" && (n = t.pop());
    const s = {
      id: this._queueSeq++,
      tryCount: 0,
      pending: !1,
      args: t,
      flags: Object.assign({ fromQueue: !0 }, this.flags)
    };
    t.push((r, ...i) => s !== this._queue[0] ? void 0 : (r !== null ? s.tryCount > this._opts.retries && (this._queue.shift(), n && n(r)) : (this._queue.shift(), n && n(null, ...i)), s.pending = !1, this._drainQueue())), this._queue.push(s), this._drainQueue();
  }
  /**
   * Send the first packet of the queue, and wait for an acknowledgement from the server.
   * @param force - whether to resend a packet that has not been acknowledged yet
   *
   * @private
   */
  _drainQueue(t = !1) {
    if (!this.connected || this._queue.length === 0)
      return;
    const n = this._queue[0];
    n.pending && !t || (n.pending = !0, n.tryCount++, this.flags = n.flags, this.emit.apply(this, n.args));
  }
  /**
   * Sends a packet.
   *
   * @param packet
   * @private
   */
  packet(t) {
    t.nsp = this.nsp, this.io._packet(t);
  }
  /**
   * Called upon engine `open`.
   *
   * @private
   */
  onopen() {
    typeof this.auth == "function" ? this.auth((t) => {
      this._sendConnectPacket(t);
    }) : this._sendConnectPacket(this.auth);
  }
  /**
   * Sends a CONNECT packet to initiate the Socket.IO session.
   *
   * @param data
   * @private
   */
  _sendConnectPacket(t) {
    this.packet({
      type: ce.CONNECT,
      data: this._pid ? Object.assign({ pid: this._pid, offset: this._lastOffset }, t) : t
    });
  }
  /**
   * Called upon engine or manager `error`.
   *
   * @param err
   * @private
   */
  onerror(t) {
    this.connected || this.emitReserved("connect_error", t);
  }
  /**
   * Called upon engine `close`.
   *
   * @param reason
   * @param description
   * @private
   */
  onclose(t, n) {
    this.connected = !1, delete this.id, this.emitReserved("disconnect", t, n), this._clearAcks();
  }
  /**
   * Clears the acknowledgement handlers upon disconnection, since the client will never receive an acknowledgement from
   * the server.
   *
   * @private
   */
  _clearAcks() {
    Object.keys(this.acks).forEach((t) => {
      if (!this.sendBuffer.some((s) => String(s.id) === t)) {
        const s = this.acks[t];
        delete this.acks[t], s.withError && s.call(this, new Error("socket has been disconnected"));
      }
    });
  }
  /**
   * Called with socket packet.
   *
   * @param packet
   * @private
   */
  onpacket(t) {
    if (t.nsp === this.nsp)
      switch (t.type) {
        case ce.CONNECT:
          t.data && t.data.sid ? this.onconnect(t.data.sid, t.data.pid) : this.emitReserved("connect_error", new Error("It seems you are trying to reach a Socket.IO server in v2.x with a v3.x client, but they are not compatible (more information here: https://socket.io/docs/v3/migrating-from-2-x-to-3-0/)"));
          break;
        case ce.EVENT:
        case ce.BINARY_EVENT:
          this.onevent(t);
          break;
        case ce.ACK:
        case ce.BINARY_ACK:
          this.onack(t);
          break;
        case ce.DISCONNECT:
          this.ondisconnect();
          break;
        case ce.CONNECT_ERROR:
          this.destroy();
          const s = new Error(t.data.message);
          s.data = t.data.data, this.emitReserved("connect_error", s);
          break;
      }
  }
  /**
   * Called upon a server event.
   *
   * @param packet
   * @private
   */
  onevent(t) {
    const n = t.data || [];
    t.id != null && n.push(this.ack(t.id)), this.connected ? this.emitEvent(n) : this.receiveBuffer.push(Object.freeze(n));
  }
  emitEvent(t) {
    if (this._anyListeners && this._anyListeners.length) {
      const n = this._anyListeners.slice();
      for (const s of n)
        s.apply(this, t);
    }
    super.emit.apply(this, t), this._pid && t.length && typeof t[t.length - 1] == "string" && (this._lastOffset = t[t.length - 1]);
  }
  /**
   * Produces an ack callback to emit with an event.
   *
   * @private
   */
  ack(t) {
    const n = this;
    let s = !1;
    return function(...r) {
      s || (s = !0, n.packet({
        type: ce.ACK,
        id: t,
        data: r
      }));
    };
  }
  /**
   * Called upon a server acknowledgement.
   *
   * @param packet
   * @private
   */
  onack(t) {
    const n = this.acks[t.id];
    typeof n == "function" && (delete this.acks[t.id], n.withError && t.data.unshift(null), n.apply(this, t.data));
  }
  /**
   * Called upon server connect.
   *
   * @private
   */
  onconnect(t, n) {
    this.id = t, this.recovered = n && this._pid === n, this._pid = n, this.connected = !0, this.emitBuffered(), this.emitReserved("connect"), this._drainQueue(!0);
  }
  /**
   * Emit buffered events (received and emitted).
   *
   * @private
   */
  emitBuffered() {
    this.receiveBuffer.forEach((t) => this.emitEvent(t)), this.receiveBuffer = [], this.sendBuffer.forEach((t) => {
      this.notifyOutgoingListeners(t), this.packet(t);
    }), this.sendBuffer = [];
  }
  /**
   * Called upon server disconnect.
   *
   * @private
   */
  ondisconnect() {
    this.destroy(), this.onclose("io server disconnect");
  }
  /**
   * Called upon forced client/server side disconnections,
   * this method ensures the manager stops tracking us and
   * that reconnections don't get triggered for this.
   *
   * @private
   */
  destroy() {
    this.subs && (this.subs.forEach((t) => t()), this.subs = void 0), this.io._destroy(this);
  }
  /**
   * Disconnects the socket manually. In that case, the socket will not try to reconnect.
   *
   * If this is the last active Socket instance of the {@link Manager}, the low-level connection will be closed.
   *
   * @example
   * const socket = io();
   *
   * socket.on("disconnect", (reason) => {
   *   // console.log(reason); prints "io client disconnect"
   * });
   *
   * socket.disconnect();
   *
   * @return self
   */
  disconnect() {
    return this.connected && this.packet({ type: ce.DISCONNECT }), this.destroy(), this.connected && this.onclose("io client disconnect"), this;
  }
  /**
   * Alias for {@link disconnect()}.
   *
   * @return self
   */
  close() {
    return this.disconnect();
  }
  /**
   * Sets the compress flag.
   *
   * @example
   * socket.compress(false).emit("hello");
   *
   * @param compress - if `true`, compresses the sending data
   * @return self
   */
  compress(t) {
    return this.flags.compress = t, this;
  }
  /**
   * Sets a modifier for a subsequent event emission that the event message will be dropped when this socket is not
   * ready to send messages.
   *
   * @example
   * socket.volatile.emit("hello"); // the server may or may not receive it
   *
   * @returns self
   */
  get volatile() {
    return this.flags.volatile = !0, this;
  }
  /**
   * Sets a modifier for a subsequent event emission that the callback will be called with an error when the
   * given number of milliseconds have elapsed without an acknowledgement from the server:
   *
   * @example
   * socket.timeout(5000).emit("my-event", (err) => {
   *   if (err) {
   *     // the server did not acknowledge the event in the given delay
   *   }
   * });
   *
   * @returns self
   */
  timeout(t) {
    return this.flags.timeout = t, this;
  }
  /**
   * Adds a listener that will be fired when any event is emitted. The event name is passed as the first argument to the
   * callback.
   *
   * @example
   * socket.onAny((event, ...args) => {
   *   console.log(`got ${event}`);
   * });
   *
   * @param listener
   */
  onAny(t) {
    return this._anyListeners = this._anyListeners || [], this._anyListeners.push(t), this;
  }
  /**
   * Adds a listener that will be fired when any event is emitted. The event name is passed as the first argument to the
   * callback. The listener is added to the beginning of the listeners array.
   *
   * @example
   * socket.prependAny((event, ...args) => {
   *   console.log(`got event ${event}`);
   * });
   *
   * @param listener
   */
  prependAny(t) {
    return this._anyListeners = this._anyListeners || [], this._anyListeners.unshift(t), this;
  }
  /**
   * Removes the listener that will be fired when any event is emitted.
   *
   * @example
   * const catchAllListener = (event, ...args) => {
   *   console.log(`got event ${event}`);
   * }
   *
   * socket.onAny(catchAllListener);
   *
   * // remove a specific listener
   * socket.offAny(catchAllListener);
   *
   * // or remove all listeners
   * socket.offAny();
   *
   * @param listener
   */
  offAny(t) {
    if (!this._anyListeners)
      return this;
    if (t) {
      const n = this._anyListeners;
      for (let s = 0; s < n.length; s++)
        if (t === n[s])
          return n.splice(s, 1), this;
    } else
      this._anyListeners = [];
    return this;
  }
  /**
   * Returns an array of listeners that are listening for any event that is specified. This array can be manipulated,
   * e.g. to remove listeners.
   */
  listenersAny() {
    return this._anyListeners || [];
  }
  /**
   * Adds a listener that will be fired when any event is emitted. The event name is passed as the first argument to the
   * callback.
   *
   * Note: acknowledgements sent to the server are not included.
   *
   * @example
   * socket.onAnyOutgoing((event, ...args) => {
   *   console.log(`sent event ${event}`);
   * });
   *
   * @param listener
   */
  onAnyOutgoing(t) {
    return this._anyOutgoingListeners = this._anyOutgoingListeners || [], this._anyOutgoingListeners.push(t), this;
  }
  /**
   * Adds a listener that will be fired when any event is emitted. The event name is passed as the first argument to the
   * callback. The listener is added to the beginning of the listeners array.
   *
   * Note: acknowledgements sent to the server are not included.
   *
   * @example
   * socket.prependAnyOutgoing((event, ...args) => {
   *   console.log(`sent event ${event}`);
   * });
   *
   * @param listener
   */
  prependAnyOutgoing(t) {
    return this._anyOutgoingListeners = this._anyOutgoingListeners || [], this._anyOutgoingListeners.unshift(t), this;
  }
  /**
   * Removes the listener that will be fired when any event is emitted.
   *
   * @example
   * const catchAllListener = (event, ...args) => {
   *   console.log(`sent event ${event}`);
   * }
   *
   * socket.onAnyOutgoing(catchAllListener);
   *
   * // remove a specific listener
   * socket.offAnyOutgoing(catchAllListener);
   *
   * // or remove all listeners
   * socket.offAnyOutgoing();
   *
   * @param [listener] - the catch-all listener (optional)
   */
  offAnyOutgoing(t) {
    if (!this._anyOutgoingListeners)
      return this;
    if (t) {
      const n = this._anyOutgoingListeners;
      for (let s = 0; s < n.length; s++)
        if (t === n[s])
          return n.splice(s, 1), this;
    } else
      this._anyOutgoingListeners = [];
    return this;
  }
  /**
   * Returns an array of listeners that are listening for any event that is specified. This array can be manipulated,
   * e.g. to remove listeners.
   */
  listenersAnyOutgoing() {
    return this._anyOutgoingListeners || [];
  }
  /**
   * Notify the listeners for each packet sent
   *
   * @param packet
   *
   * @private
   */
  notifyOutgoingListeners(t) {
    if (this._anyOutgoingListeners && this._anyOutgoingListeners.length) {
      const n = this._anyOutgoingListeners.slice();
      for (const s of n)
        s.apply(this, t.data);
    }
  }
}
function xn(e) {
  e = e || {}, this.ms = e.min || 100, this.max = e.max || 1e4, this.factor = e.factor || 2, this.jitter = e.jitter > 0 && e.jitter <= 1 ? e.jitter : 0, this.attempts = 0;
}
xn.prototype.duration = function() {
  var e = this.ms * Math.pow(this.factor, this.attempts++);
  if (this.jitter) {
    var t = Math.random(), n = Math.floor(t * this.jitter * e);
    e = (Math.floor(t * 10) & 1) == 0 ? e - n : e + n;
  }
  return Math.min(e, this.max) | 0;
};
xn.prototype.reset = function() {
  this.attempts = 0;
};
xn.prototype.setMin = function(e) {
  this.ms = e;
};
xn.prototype.setMax = function(e) {
  this.max = e;
};
xn.prototype.setJitter = function(e) {
  this.jitter = e;
};
class br extends Me {
  constructor(t, n) {
    var s;
    super(), this.nsps = {}, this.subs = [], t && typeof t == "object" && (n = t, t = void 0), n = n || {}, n.path = n.path || "/socket.io", this.opts = n, Ps(this, n), this.reconnection(n.reconnection !== !1), this.reconnectionAttempts(n.reconnectionAttempts || 1 / 0), this.reconnectionDelay(n.reconnectionDelay || 1e3), this.reconnectionDelayMax(n.reconnectionDelayMax || 5e3), this.randomizationFactor((s = n.randomizationFactor) !== null && s !== void 0 ? s : 0.5), this.backoff = new xn({
      min: this.reconnectionDelay(),
      max: this.reconnectionDelayMax(),
      jitter: this.randomizationFactor()
    }), this.timeout(n.timeout == null ? 2e4 : n.timeout), this._readyState = "closed", this.uri = t;
    const r = n.parser || Wf;
    this.encoder = new r.Encoder(), this.decoder = new r.Decoder(), this._autoConnect = n.autoConnect !== !1, this._autoConnect && this.open();
  }
  reconnection(t) {
    return arguments.length ? (this._reconnection = !!t, t || (this.skipReconnect = !0), this) : this._reconnection;
  }
  reconnectionAttempts(t) {
    return t === void 0 ? this._reconnectionAttempts : (this._reconnectionAttempts = t, this);
  }
  reconnectionDelay(t) {
    var n;
    return t === void 0 ? this._reconnectionDelay : (this._reconnectionDelay = t, (n = this.backoff) === null || n === void 0 || n.setMin(t), this);
  }
  randomizationFactor(t) {
    var n;
    return t === void 0 ? this._randomizationFactor : (this._randomizationFactor = t, (n = this.backoff) === null || n === void 0 || n.setJitter(t), this);
  }
  reconnectionDelayMax(t) {
    var n;
    return t === void 0 ? this._reconnectionDelayMax : (this._reconnectionDelayMax = t, (n = this.backoff) === null || n === void 0 || n.setMax(t), this);
  }
  timeout(t) {
    return arguments.length ? (this._timeout = t, this) : this._timeout;
  }
  /**
   * Starts trying to reconnect if reconnection is enabled and we have not
   * started reconnecting yet
   *
   * @private
   */
  maybeReconnectOnOpen() {
    !this._reconnecting && this._reconnection && this.backoff.attempts === 0 && this.reconnect();
  }
  /**
   * Sets the current transport `socket`.
   *
   * @param {Function} fn - optional, callback
   * @return self
   * @public
   */
  open(t) {
    if (~this._readyState.indexOf("open"))
      return this;
    this.engine = new Pf(this.uri, this.opts);
    const n = this.engine, s = this;
    this._readyState = "opening", this.skipReconnect = !1;
    const r = vt(n, "open", function() {
      s.onopen(), t && t();
    }), i = (l) => {
      this.cleanup(), this._readyState = "closed", this.emitReserved("error", l), t ? t(l) : this.maybeReconnectOnOpen();
    }, o = vt(n, "error", i);
    if (this._timeout !== !1) {
      const l = this._timeout, a = this.setTimeoutFn(() => {
        r(), i(new Error("timeout")), n.close();
      }, l);
      this.opts.autoUnref && a.unref(), this.subs.push(() => {
        this.clearTimeoutFn(a);
      });
    }
    return this.subs.push(r), this.subs.push(o), this;
  }
  /**
   * Alias for open()
   *
   * @return self
   * @public
   */
  connect(t) {
    return this.open(t);
  }
  /**
   * Called upon transport open.
   *
   * @private
   */
  onopen() {
    this.cleanup(), this._readyState = "open", this.emitReserved("open");
    const t = this.engine;
    this.subs.push(
      vt(t, "ping", this.onping.bind(this)),
      vt(t, "data", this.ondata.bind(this)),
      vt(t, "error", this.onerror.bind(this)),
      vt(t, "close", this.onclose.bind(this)),
      // @ts-ignore
      vt(this.decoder, "decoded", this.ondecoded.bind(this))
    );
  }
  /**
   * Called upon a ping.
   *
   * @private
   */
  onping() {
    this.emitReserved("ping");
  }
  /**
   * Called with data.
   *
   * @private
   */
  ondata(t) {
    try {
      this.decoder.add(t);
    } catch (n) {
      this.onclose("parse error", n);
    }
  }
  /**
   * Called when parser fully decodes a packet.
   *
   * @private
   */
  ondecoded(t) {
    Ls(() => {
      this.emitReserved("packet", t);
    }, this.setTimeoutFn);
  }
  /**
   * Called upon socket error.
   *
   * @private
   */
  onerror(t) {
    this.emitReserved("error", t);
  }
  /**
   * Creates a new socket for the given `nsp`.
   *
   * @return {Socket}
   * @public
   */
  socket(t, n) {
    let s = this.nsps[t];
    return s ? this._autoConnect && !s.active && s.connect() : (s = new Rl(this, t, n), this.nsps[t] = s), s;
  }
  /**
   * Called upon a socket close.
   *
   * @param socket
   * @private
   */
  _destroy(t) {
    const n = Object.keys(this.nsps);
    for (const s of n)
      if (this.nsps[s].active)
        return;
    this._close();
  }
  /**
   * Writes a packet.
   *
   * @param packet
   * @private
   */
  _packet(t) {
    const n = this.encoder.encode(t);
    for (let s = 0; s < n.length; s++)
      this.engine.write(n[s], t.options);
  }
  /**
   * Clean up transport subscriptions and packet buffer.
   *
   * @private
   */
  cleanup() {
    this.subs.forEach((t) => t()), this.subs.length = 0, this.decoder.destroy();
  }
  /**
   * Close the current socket.
   *
   * @private
   */
  _close() {
    this.skipReconnect = !0, this._reconnecting = !1, this.onclose("forced close");
  }
  /**
   * Alias for close()
   *
   * @private
   */
  disconnect() {
    return this._close();
  }
  /**
   * Called when:
   *
   * - the low-level engine is closed
   * - the parser encountered a badly formatted packet
   * - all sockets are disconnected
   *
   * @private
   */
  onclose(t, n) {
    var s;
    this.cleanup(), (s = this.engine) === null || s === void 0 || s.close(), this.backoff.reset(), this._readyState = "closed", this.emitReserved("close", t, n), this._reconnection && !this.skipReconnect && this.reconnect();
  }
  /**
   * Attempt a reconnection.
   *
   * @private
   */
  reconnect() {
    if (this._reconnecting || this.skipReconnect)
      return this;
    const t = this;
    if (this.backoff.attempts >= this._reconnectionAttempts)
      this.backoff.reset(), this.emitReserved("reconnect_failed"), this._reconnecting = !1;
    else {
      const n = this.backoff.duration();
      this._reconnecting = !0;
      const s = this.setTimeoutFn(() => {
        t.skipReconnect || (this.emitReserved("reconnect_attempt", t.backoff.attempts), !t.skipReconnect && t.open((r) => {
          r ? (t._reconnecting = !1, t.reconnect(), this.emitReserved("reconnect_error", r)) : t.onreconnect();
        }));
      }, n);
      this.opts.autoUnref && s.unref(), this.subs.push(() => {
        this.clearTimeoutFn(s);
      });
    }
  }
  /**
   * Called upon successful reconnect.
   *
   * @private
   */
  onreconnect() {
    const t = this.backoff.attempts;
    this._reconnecting = !1, this.backoff.reset(), this.emitReserved("reconnect", t);
  }
}
const Rn = {};
function cs(e, t) {
  typeof e == "object" && (t = e, e = void 0), t = t || {};
  const n = $f(e, t.path || "/socket.io"), s = n.source, r = n.id, i = n.path, o = Rn[r] && i in Rn[r].nsps, l = t.forceNew || t["force new connection"] || t.multiplex === !1 || o;
  let a;
  return l ? a = new br(s, t) : (Rn[r] || (Rn[r] = new br(s, t)), a = Rn[r]), n.query && !t.query && (t.query = n.queryKey), a.socket(n.path, t);
}
Object.assign(cs, {
  Manager: br,
  Socket: Rl,
  io: cs,
  connect: cs
});
function Kf() {
  const e = he([]), t = he(!1), n = he(""), s = he(!1), r = he(!1), i = he(!1), o = he("connecting"), l = he(0), a = 5, u = he({}), f = he(null);
  let _ = null, b = null, I = null, N = null;
  const q = (M) => {
    const ke = localStorage.getItem("ctid");
    return _ = cs(`${vs.WS_URL}/widget`, {
      transports: ["websocket"],
      reconnection: !0,
      reconnectionAttempts: a,
      reconnectionDelay: 1e3,
      auth: ke ? {
        conversation_token: ke
      } : void 0
    }), _.on("connect", () => {
      o.value = "connected", l.value = 0;
    }), _.on("disconnect", () => {
      o.value === "connected" && (console.log("Socket disconnected, setting connection status to connecting"), o.value = "connecting");
    }), _.on("connect_error", () => {
      l.value++, console.error("Socket connection failed, attempt:", l.value, "connection status:", o.value), l.value >= a && (o.value = "failed");
    }), _.on("chat_response", (W) => {
      t.value = !1, W.type === "agent_message" ? e.value.push({
        message: W.message,
        message_type: "agent",
        created_at: (/* @__PURE__ */ new Date()).toISOString(),
        session_id: "",
        agent_name: W.agent_name,
        attributes: {
          end_chat: W.end_chat,
          end_chat_reason: W.end_chat_reason,
          end_chat_description: W.end_chat_description,
          request_rating: W.request_rating
        }
      }) : W.shopify_output && typeof W.shopify_output == "object" && W.shopify_output.products ? e.value.push({
        message: W.message,
        // Keep the accompanying text message
        message_type: "product",
        // Use 'product' type for rendering
        created_at: (/* @__PURE__ */ new Date()).toISOString(),
        session_id: "",
        agent_name: W.agent_name,
        // Assign the whole structured object
        shopify_output: W.shopify_output,
        // Remove the old flattened fields (product_id, product_title, etc.)
        attributes: {
          // Keep other attributes if needed
          end_chat: W.end_chat,
          request_rating: W.request_rating
        }
      }) : e.value.push({
        message: W.message,
        message_type: "bot",
        created_at: (/* @__PURE__ */ new Date()).toISOString(),
        session_id: "",
        agent_name: W.agent_name,
        attributes: {
          end_chat: W.end_chat,
          end_chat_reason: W.end_chat_reason,
          end_chat_description: W.end_chat_description,
          request_rating: W.request_rating
        }
      });
    }), _.on("handle_taken_over", (W) => {
      e.value.push({
        message: `${W.user_name} joined the conversation`,
        message_type: "system",
        created_at: (/* @__PURE__ */ new Date()).toISOString(),
        session_id: W.session_id
      }), u.value = {
        ...u.value,
        human_agent_name: W.user_name,
        human_agent_profile_pic: W.profile_picture
      }, b && b(W);
    }), _.on("error", oe), _.on("chat_history", qe), _.on("rating_submitted", fe), _.on("display_form", je), _.on("form_submitted", pt), _.on("workflow_state", Ze), _.on("workflow_proceeded", gt), _;
  }, we = async () => {
    try {
      return o.value = "connecting", l.value = 0, _ && (_.removeAllListeners(), _.disconnect(), _ = null), _ = q(""), new Promise((M) => {
        _ == null || _.on("connect", () => {
          M(!0);
        }), _ == null || _.on("connect_error", () => {
          l.value >= a && M(!1);
        });
      });
    } catch (M) {
      return console.error("Socket initialization failed:", M), o.value = "failed", !1;
    }
  }, ne = () => (_ && _.disconnect(), we()), de = (M) => {
    b = M;
  }, pe = (M) => {
    I = M;
  }, H = (M) => {
    N = M;
  }, oe = (M) => {
    t.value = !1, n.value = gu(M), s.value = !0, setTimeout(() => {
      s.value = !1, n.value = "";
    }, 5e3);
  }, qe = (M) => {
    if (M.type === "chat_history" && Array.isArray(M.messages)) {
      const ke = M.messages.map((W) => {
        var mt;
        const Te = {
          message: W.message,
          message_type: W.message_type,
          created_at: W.created_at,
          session_id: "",
          agent_name: W.agent_name || "",
          user_name: W.user_name || "",
          attributes: W.attributes || {}
        };
        return (mt = W.attributes) != null && mt.shopify_output && typeof W.attributes.shopify_output == "object" ? {
          ...Te,
          message_type: "product",
          shopify_output: W.attributes.shopify_output
        } : Te;
      });
      e.value = [
        ...ke.filter(
          (W) => !e.value.some(
            (Te) => Te.message === W.message && Te.created_at === W.created_at
          )
        ),
        ...e.value
      ];
    }
  }, fe = (M) => {
    M.success && e.value.push({
      message: "Thank you for your feedback!",
      message_type: "system",
      created_at: (/* @__PURE__ */ new Date()).toISOString(),
      session_id: ""
    });
  }, je = (M) => {
    var ke;
    console.log("Form display handler in composable:", M), t.value = !1, f.value = M.form_data, console.log("Set currentForm in handleDisplayForm:", f.value), ((ke = M.form_data) == null ? void 0 : ke.form_full_screen) === !0 ? (console.log("Full screen form detected, triggering workflow state callback"), I && I({
      type: "form",
      form_data: M.form_data,
      session_id: M.session_id
    })) : e.value.push({
      message: "",
      message_type: "form",
      created_at: (/* @__PURE__ */ new Date()).toISOString(),
      session_id: M.session_id,
      attributes: {
        form_data: M.form_data
      }
    });
  }, pt = (M) => {
    console.log("Form submitted confirmation received, clearing currentForm"), f.value = null, M.success && console.log("Form submitted successfully");
  }, Ze = (M) => {
    console.log("Workflow state received in composable:", M), (M.type === "form" || M.type === "display_form") && (console.log("Setting currentForm from workflow state:", M.form_data), f.value = M.form_data), I && I(M);
  }, gt = (M) => {
    console.log("Workflow proceeded in composable:", M), N && N(M);
  };
  return {
    messages: e,
    loading: t,
    errorMessage: n,
    showError: s,
    loadingHistory: r,
    hasStartedChat: i,
    connectionStatus: o,
    sendMessage: async (M, ke) => {
      !_ || !M.trim() || (u.value.human_agent_name || (t.value = !0), e.value.push({
        message: M,
        message_type: "user",
        created_at: (/* @__PURE__ */ new Date()).toISOString(),
        session_id: ""
      }), _.emit("chat", {
        message: M,
        email: ke
      }), i.value = !0);
    },
    loadChatHistory: async () => {
      if (_)
        try {
          r.value = !0, _.emit("get_chat_history");
        } catch (M) {
          console.error("Failed to load chat history:", M);
        } finally {
          r.value = !1;
        }
    },
    connect: we,
    reconnect: ne,
    cleanup: () => {
      _ && (_.removeAllListeners(), _.disconnect(), _ = null), b = null, I = null, N = null;
    },
    humanAgent: u,
    onTakeover: de,
    submitRating: async (M, ke) => {
      !_ || !M || _.emit("submit_rating", {
        rating: M,
        feedback: ke
      });
    },
    currentForm: f,
    submitForm: async (M) => {
      if (console.log("Submitting form in socket:", M), console.log("Current form in socket:", f.value), console.log("Socket in socket:", _), !_) {
        console.error("No socket available for form submission");
        return;
      }
      if (!M || Object.keys(M).length === 0) {
        console.error("No form data to submit");
        return;
      }
      console.log("Emitting submit_form event with data:", M), _.emit("submit_form", {
        form_data: M
      }), f.value = null;
    },
    getWorkflowState: async () => {
      _ && (console.log("Getting workflow state 12"), _.emit("get_workflow_state"));
    },
    proceedWorkflow: async () => {
      _ && _.emit("proceed_workflow", {});
    },
    onWorkflowState: pe,
    onWorkflowProceeded: H
  };
}
function Zf(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var Js = { exports: {} }, to;
function Gf() {
  return to || (to = 1, function(e) {
    (function() {
      function t(c, d, k) {
        return c.call.apply(c.bind, arguments);
      }
      function n(c, d, k) {
        if (!c) throw Error();
        if (2 < arguments.length) {
          var y = Array.prototype.slice.call(arguments, 2);
          return function() {
            var A = Array.prototype.slice.call(arguments);
            return Array.prototype.unshift.apply(A, y), c.apply(d, A);
          };
        }
        return function() {
          return c.apply(d, arguments);
        };
      }
      function s(c, d, k) {
        return s = Function.prototype.bind && Function.prototype.bind.toString().indexOf("native code") != -1 ? t : n, s.apply(null, arguments);
      }
      var r = Date.now || function() {
        return +/* @__PURE__ */ new Date();
      };
      function i(c, d) {
        this.a = c, this.o = d || c, this.c = this.o.document;
      }
      var o = !!window.FontFace;
      function l(c, d, k, y) {
        if (d = c.c.createElement(d), k) for (var A in k) k.hasOwnProperty(A) && (A == "style" ? d.style.cssText = k[A] : d.setAttribute(A, k[A]));
        return y && d.appendChild(c.c.createTextNode(y)), d;
      }
      function a(c, d, k) {
        c = c.c.getElementsByTagName(d)[0], c || (c = document.documentElement), c.insertBefore(k, c.lastChild);
      }
      function u(c) {
        c.parentNode && c.parentNode.removeChild(c);
      }
      function f(c, d, k) {
        d = d || [], k = k || [];
        for (var y = c.className.split(/\s+/), A = 0; A < d.length; A += 1) {
          for (var V = !1, z = 0; z < y.length; z += 1) if (d[A] === y[z]) {
            V = !0;
            break;
          }
          V || y.push(d[A]);
        }
        for (d = [], A = 0; A < y.length; A += 1) {
          for (V = !1, z = 0; z < k.length; z += 1) if (y[A] === k[z]) {
            V = !0;
            break;
          }
          V || d.push(y[A]);
        }
        c.className = d.join(" ").replace(/\s+/g, " ").replace(/^\s+|\s+$/, "");
      }
      function _(c, d) {
        for (var k = c.className.split(/\s+/), y = 0, A = k.length; y < A; y++) if (k[y] == d) return !0;
        return !1;
      }
      function b(c) {
        return c.o.location.hostname || c.a.location.hostname;
      }
      function I(c, d, k) {
        function y() {
          te && A && V && (te(z), te = null);
        }
        d = l(c, "link", { rel: "stylesheet", href: d, media: "all" });
        var A = !1, V = !0, z = null, te = k || null;
        o ? (d.onload = function() {
          A = !0, y();
        }, d.onerror = function() {
          A = !0, z = Error("Stylesheet failed to load"), y();
        }) : setTimeout(function() {
          A = !0, y();
        }, 0), a(c, "head", d);
      }
      function N(c, d, k, y) {
        var A = c.c.getElementsByTagName("head")[0];
        if (A) {
          var V = l(c, "script", { src: d }), z = !1;
          return V.onload = V.onreadystatechange = function() {
            z || this.readyState && this.readyState != "loaded" && this.readyState != "complete" || (z = !0, k && k(null), V.onload = V.onreadystatechange = null, V.parentNode.tagName == "HEAD" && A.removeChild(V));
          }, A.appendChild(V), setTimeout(function() {
            z || (z = !0, k && k(Error("Script load timeout")));
          }, y || 5e3), V;
        }
        return null;
      }
      function q() {
        this.a = 0, this.c = null;
      }
      function we(c) {
        return c.a++, function() {
          c.a--, de(c);
        };
      }
      function ne(c, d) {
        c.c = d, de(c);
      }
      function de(c) {
        c.a == 0 && c.c && (c.c(), c.c = null);
      }
      function pe(c) {
        this.a = c || "-";
      }
      pe.prototype.c = function(c) {
        for (var d = [], k = 0; k < arguments.length; k++) d.push(arguments[k].replace(/[\W_]+/g, "").toLowerCase());
        return d.join(this.a);
      };
      function H(c, d) {
        this.c = c, this.f = 4, this.a = "n";
        var k = (d || "n4").match(/^([nio])([1-9])$/i);
        k && (this.a = k[1], this.f = parseInt(k[2], 10));
      }
      function oe(c) {
        return je(c) + " " + (c.f + "00") + " 300px " + qe(c.c);
      }
      function qe(c) {
        var d = [];
        c = c.split(/,\s*/);
        for (var k = 0; k < c.length; k++) {
          var y = c[k].replace(/['"]/g, "");
          y.indexOf(" ") != -1 || /^\d/.test(y) ? d.push("'" + y + "'") : d.push(y);
        }
        return d.join(",");
      }
      function fe(c) {
        return c.a + c.f;
      }
      function je(c) {
        var d = "normal";
        return c.a === "o" ? d = "oblique" : c.a === "i" && (d = "italic"), d;
      }
      function pt(c) {
        var d = 4, k = "n", y = null;
        return c && ((y = c.match(/(normal|oblique|italic)/i)) && y[1] && (k = y[1].substr(0, 1).toLowerCase()), (y = c.match(/([1-9]00|normal|bold)/i)) && y[1] && (/bold/i.test(y[1]) ? d = 7 : /[1-9]00/.test(y[1]) && (d = parseInt(y[1].substr(0, 1), 10)))), k + d;
      }
      function Ze(c, d) {
        this.c = c, this.f = c.o.document.documentElement, this.h = d, this.a = new pe("-"), this.j = d.events !== !1, this.g = d.classes !== !1;
      }
      function gt(c) {
        c.g && f(c.f, [c.a.c("wf", "loading")]), et(c, "loading");
      }
      function wt(c) {
        if (c.g) {
          var d = _(c.f, c.a.c("wf", "active")), k = [], y = [c.a.c("wf", "loading")];
          d || k.push(c.a.c("wf", "inactive")), f(c.f, k, y);
        }
        et(c, "inactive");
      }
      function et(c, d, k) {
        c.j && c.h[d] && (k ? c.h[d](k.c, fe(k)) : c.h[d]());
      }
      function Ve() {
        this.c = {};
      }
      function Ht(c, d, k) {
        var y = [], A;
        for (A in d) if (d.hasOwnProperty(A)) {
          var V = c.c[A];
          V && y.push(V(d[A], k));
        }
        return y;
      }
      function se(c, d) {
        this.c = c, this.f = d, this.a = l(this.c, "span", { "aria-hidden": "true" }, this.f);
      }
      function X(c) {
        a(c.c, "body", c.a);
      }
      function re(c) {
        return "display:block;position:absolute;top:-9999px;left:-9999px;font-size:300px;width:auto;height:auto;line-height:normal;margin:0;padding:0;font-variant:normal;white-space:nowrap;font-family:" + qe(c.c) + ";" + ("font-style:" + je(c) + ";font-weight:" + (c.f + "00") + ";");
      }
      function M(c, d, k, y, A, V) {
        this.g = c, this.j = d, this.a = y, this.c = k, this.f = A || 3e3, this.h = V || void 0;
      }
      M.prototype.start = function() {
        var c = this.c.o.document, d = this, k = r(), y = new Promise(function(z, te) {
          function G() {
            r() - k >= d.f ? te() : c.fonts.load(oe(d.a), d.h).then(function(Ie) {
              1 <= Ie.length ? z() : setTimeout(G, 25);
            }, function() {
              te();
            });
          }
          G();
        }), A = null, V = new Promise(function(z, te) {
          A = setTimeout(te, d.f);
        });
        Promise.race([V, y]).then(function() {
          A && (clearTimeout(A), A = null), d.g(d.a);
        }, function() {
          d.j(d.a);
        });
      };
      function ke(c, d, k, y, A, V, z) {
        this.v = c, this.B = d, this.c = k, this.a = y, this.s = z || "BESbswy", this.f = {}, this.w = A || 3e3, this.u = V || null, this.m = this.j = this.h = this.g = null, this.g = new se(this.c, this.s), this.h = new se(this.c, this.s), this.j = new se(this.c, this.s), this.m = new se(this.c, this.s), c = new H(this.a.c + ",serif", fe(this.a)), c = re(c), this.g.a.style.cssText = c, c = new H(this.a.c + ",sans-serif", fe(this.a)), c = re(c), this.h.a.style.cssText = c, c = new H("serif", fe(this.a)), c = re(c), this.j.a.style.cssText = c, c = new H("sans-serif", fe(this.a)), c = re(c), this.m.a.style.cssText = c, X(this.g), X(this.h), X(this.j), X(this.m);
      }
      var W = { D: "serif", C: "sans-serif" }, Te = null;
      function mt() {
        if (Te === null) {
          var c = /AppleWebKit\/([0-9]+)(?:\.([0-9]+))/.exec(window.navigator.userAgent);
          Te = !!c && (536 > parseInt(c[1], 10) || parseInt(c[1], 10) === 536 && 11 >= parseInt(c[2], 10));
        }
        return Te;
      }
      ke.prototype.start = function() {
        this.f.serif = this.j.a.offsetWidth, this.f["sans-serif"] = this.m.a.offsetWidth, this.A = r(), sn(this);
      };
      function _t(c, d, k) {
        for (var y in W) if (W.hasOwnProperty(y) && d === c.f[W[y]] && k === c.f[W[y]]) return !0;
        return !1;
      }
      function sn(c) {
        var d = c.g.a.offsetWidth, k = c.h.a.offsetWidth, y;
        (y = d === c.f.serif && k === c.f["sans-serif"]) || (y = mt() && _t(c, d, k)), y ? r() - c.A >= c.w ? mt() && _t(c, d, k) && (c.u === null || c.u.hasOwnProperty(c.a.c)) ? ct(c, c.v) : ct(c, c.B) : kt(c) : ct(c, c.v);
      }
      function kt(c) {
        setTimeout(s(function() {
          sn(this);
        }, c), 50);
      }
      function ct(c, d) {
        setTimeout(s(function() {
          u(this.g.a), u(this.h.a), u(this.j.a), u(this.m.a), d(this.a);
        }, c), 0);
      }
      function st(c, d, k) {
        this.c = c, this.a = d, this.f = 0, this.m = this.j = !1, this.s = k;
      }
      var rt = null;
      st.prototype.g = function(c) {
        var d = this.a;
        d.g && f(d.f, [d.a.c("wf", c.c, fe(c).toString(), "active")], [d.a.c("wf", c.c, fe(c).toString(), "loading"), d.a.c("wf", c.c, fe(c).toString(), "inactive")]), et(d, "fontactive", c), this.m = !0, it(this);
      }, st.prototype.h = function(c) {
        var d = this.a;
        if (d.g) {
          var k = _(d.f, d.a.c("wf", c.c, fe(c).toString(), "active")), y = [], A = [d.a.c("wf", c.c, fe(c).toString(), "loading")];
          k || y.push(d.a.c("wf", c.c, fe(c).toString(), "inactive")), f(d.f, y, A);
        }
        et(d, "fontinactive", c), it(this);
      };
      function it(c) {
        --c.f == 0 && c.j && (c.m ? (c = c.a, c.g && f(c.f, [c.a.c("wf", "active")], [c.a.c("wf", "loading"), c.a.c("wf", "inactive")]), et(c, "active")) : wt(c.a));
      }
      function Ut(c) {
        this.j = c, this.a = new Ve(), this.h = 0, this.f = this.g = !0;
      }
      Ut.prototype.load = function(c) {
        this.c = new i(this.j, c.context || this.j), this.g = c.events !== !1, this.f = c.classes !== !1, g(this, new Ze(this.c, c), c);
      };
      function h(c, d, k, y, A) {
        var V = --c.h == 0;
        (c.f || c.g) && setTimeout(function() {
          var z = A || null, te = y || null || {};
          if (k.length === 0 && V) wt(d.a);
          else {
            d.f += k.length, V && (d.j = V);
            var G, Ie = [];
            for (G = 0; G < k.length; G++) {
              var xe = k[G], He = te[xe.c], ot = d.a, jt = xe;
              if (ot.g && f(ot.f, [ot.a.c("wf", jt.c, fe(jt).toString(), "loading")]), et(ot, "fontloading", jt), ot = null, rt === null) if (window.FontFace) {
                var jt = /Gecko.*Firefox\/(\d+)/.exec(window.navigator.userAgent), $s = /OS X.*Version\/10\..*Safari/.exec(window.navigator.userAgent) && /Apple/.exec(window.navigator.vendor);
                rt = jt ? 42 < parseInt(jt[1], 10) : !$s;
              } else rt = !1;
              rt ? ot = new M(s(d.g, d), s(d.h, d), d.c, xe, d.s, He) : ot = new ke(s(d.g, d), s(d.h, d), d.c, xe, d.s, z, He), Ie.push(ot);
            }
            for (G = 0; G < Ie.length; G++) Ie[G].start();
          }
        }, 0);
      }
      function g(c, d, k) {
        var A = [], y = k.timeout;
        gt(d);
        var A = Ht(c.a, k, c.c), V = new st(c.c, d, y);
        for (c.h = A.length, d = 0, k = A.length; d < k; d++) A[d].load(function(z, te, G) {
          h(c, V, z, te, G);
        });
      }
      function w(c, d) {
        this.c = c, this.a = d;
      }
      w.prototype.load = function(c) {
        function d() {
          if (V["__mti_fntLst" + y]) {
            var z = V["__mti_fntLst" + y](), te = [], G;
            if (z) for (var Ie = 0; Ie < z.length; Ie++) {
              var xe = z[Ie].fontfamily;
              z[Ie].fontStyle != null && z[Ie].fontWeight != null ? (G = z[Ie].fontStyle + z[Ie].fontWeight, te.push(new H(xe, G))) : te.push(new H(xe));
            }
            c(te);
          } else setTimeout(function() {
            d();
          }, 50);
        }
        var k = this, y = k.a.projectId, A = k.a.version;
        if (y) {
          var V = k.c.o;
          N(this.c, (k.a.api || "https://fast.fonts.net/jsapi") + "/" + y + ".js" + (A ? "?v=" + A : ""), function(z) {
            z ? c([]) : (V["__MonotypeConfiguration__" + y] = function() {
              return k.a;
            }, d());
          }).id = "__MonotypeAPIScript__" + y;
        } else c([]);
      };
      function C(c, d) {
        this.c = c, this.a = d;
      }
      C.prototype.load = function(c) {
        var d, k, y = this.a.urls || [], A = this.a.families || [], V = this.a.testStrings || {}, z = new q();
        for (d = 0, k = y.length; d < k; d++) I(this.c, y[d], we(z));
        var te = [];
        for (d = 0, k = A.length; d < k; d++) if (y = A[d].split(":"), y[1]) for (var G = y[1].split(","), Ie = 0; Ie < G.length; Ie += 1) te.push(new H(y[0], G[Ie]));
        else te.push(new H(y[0]));
        ne(z, function() {
          c(te, V);
        });
      };
      function T(c, d) {
        c ? this.c = c : this.c = S, this.a = [], this.f = [], this.g = d || "";
      }
      var S = "https://fonts.googleapis.com/css";
      function B(c, d) {
        for (var k = d.length, y = 0; y < k; y++) {
          var A = d[y].split(":");
          A.length == 3 && c.f.push(A.pop());
          var V = "";
          A.length == 2 && A[1] != "" && (V = ":"), c.a.push(A.join(V));
        }
      }
      function O(c) {
        if (c.a.length == 0) throw Error("No fonts to load!");
        if (c.c.indexOf("kit=") != -1) return c.c;
        for (var d = c.a.length, k = [], y = 0; y < d; y++) k.push(c.a[y].replace(/ /g, "+"));
        return d = c.c + "?family=" + k.join("%7C"), 0 < c.f.length && (d += "&subset=" + c.f.join(",")), 0 < c.g.length && (d += "&text=" + encodeURIComponent(c.g)), d;
      }
      function L(c) {
        this.f = c, this.a = [], this.c = {};
      }
      var E = { latin: "BESbswy", "latin-ext": "çöüğş", cyrillic: "йяЖ", greek: "αβΣ", khmer: "កខគ", Hanuman: "កខគ" }, U = { thin: "1", extralight: "2", "extra-light": "2", ultralight: "2", "ultra-light": "2", light: "3", regular: "4", book: "4", medium: "5", "semi-bold": "6", semibold: "6", "demi-bold": "6", demibold: "6", bold: "7", "extra-bold": "8", extrabold: "8", "ultra-bold": "8", ultrabold: "8", black: "9", heavy: "9", l: "3", r: "4", b: "7" }, F = { i: "i", italic: "i", n: "n", normal: "n" }, j = /^(thin|(?:(?:extra|ultra)-?)?light|regular|book|medium|(?:(?:semi|demi|extra|ultra)-?)?bold|black|heavy|l|r|b|[1-9]00)?(n|i|normal|italic)?$/;
      function K(c) {
        for (var d = c.f.length, k = 0; k < d; k++) {
          var y = c.f[k].split(":"), A = y[0].replace(/\+/g, " "), V = ["n4"];
          if (2 <= y.length) {
            var z, te = y[1];
            if (z = [], te) for (var te = te.split(","), G = te.length, Ie = 0; Ie < G; Ie++) {
              var xe;
              if (xe = te[Ie], xe.match(/^[\w-]+$/)) {
                var He = j.exec(xe.toLowerCase());
                if (He == null) xe = "";
                else {
                  if (xe = He[2], xe = xe == null || xe == "" ? "n" : F[xe], He = He[1], He == null || He == "") He = "4";
                  else var ot = U[He], He = ot || (isNaN(He) ? "4" : He.substr(0, 1));
                  xe = [xe, He].join("");
                }
              } else xe = "";
              xe && z.push(xe);
            }
            0 < z.length && (V = z), y.length == 3 && (y = y[2], z = [], y = y ? y.split(",") : z, 0 < y.length && (y = E[y[0]]) && (c.c[A] = y));
          }
          for (c.c[A] || (y = E[A]) && (c.c[A] = y), y = 0; y < V.length; y += 1) c.a.push(new H(A, V[y]));
        }
      }
      function ee(c, d) {
        this.c = c, this.a = d;
      }
      var ge = { Arimo: !0, Cousine: !0, Tinos: !0 };
      ee.prototype.load = function(c) {
        var d = new q(), k = this.c, y = new T(this.a.api, this.a.text), A = this.a.families;
        B(y, A);
        var V = new L(A);
        K(V), I(k, O(y), we(d)), ne(d, function() {
          c(V.a, V.c, ge);
        });
      };
      function ie(c, d) {
        this.c = c, this.a = d;
      }
      ie.prototype.load = function(c) {
        var d = this.a.id, k = this.c.o;
        d ? N(this.c, (this.a.api || "https://use.typekit.net") + "/" + d + ".js", function(y) {
          if (y) c([]);
          else if (k.Typekit && k.Typekit.config && k.Typekit.config.fn) {
            y = k.Typekit.config.fn;
            for (var A = [], V = 0; V < y.length; V += 2) for (var z = y[V], te = y[V + 1], G = 0; G < te.length; G++) A.push(new H(z, te[G]));
            try {
              k.Typekit.load({ events: !1, classes: !1, async: !0 });
            } catch {
            }
            c(A);
          }
        }, 2e3) : c([]);
      };
      function Fe(c, d) {
        this.c = c, this.f = d, this.a = [];
      }
      Fe.prototype.load = function(c) {
        var d = this.f.id, k = this.c.o, y = this;
        d ? (k.__webfontfontdeckmodule__ || (k.__webfontfontdeckmodule__ = {}), k.__webfontfontdeckmodule__[d] = function(A, V) {
          for (var z = 0, te = V.fonts.length; z < te; ++z) {
            var G = V.fonts[z];
            y.a.push(new H(G.name, pt("font-weight:" + G.weight + ";font-style:" + G.style)));
          }
          c(y.a);
        }, N(this.c, (this.f.api || "https://f.fontdeck.com/s/css/js/") + b(this.c) + "/" + d + ".js", function(A) {
          A && c([]);
        })) : c([]);
      };
      var Re = new Ut(window);
      Re.a.c.custom = function(c, d) {
        return new C(d, c);
      }, Re.a.c.fontdeck = function(c, d) {
        return new Fe(d, c);
      }, Re.a.c.monotype = function(c, d) {
        return new w(d, c);
      }, Re.a.c.typekit = function(c, d) {
        return new ie(d, c);
      }, Re.a.c.google = function(c, d) {
        return new ee(d, c);
      };
      var Oe = { load: s(Re.load, Re) };
      e.exports ? e.exports = Oe : (window.WebFont = Oe, window.WebFontConfig && Re.load(window.WebFontConfig));
    })();
  }(Js)), Js.exports;
}
var Yf = Gf();
const Jf = /* @__PURE__ */ Zf(Yf);
function Qf() {
  const e = he({}), t = he(""), n = (r) => {
    e.value = r, r.photo_url && (e.value.photo_url = r.photo_url), r.font_family && Jf.load({
      google: {
        families: [r.font_family]
      },
      active: () => {
        const i = document.querySelector(".chat-container");
        i && (i.style.fontFamily = `"${r.font_family}", system-ui, sans-serif`);
      }
    }), window.parent.postMessage({
      type: "CUSTOMIZATION_UPDATE",
      data: {
        chat_bubble_color: r.chat_bubble_color || "#f34611",
        chat_style: r.chat_style
      }
    }, "*");
  };
  return {
    customization: e,
    agentName: t,
    applyCustomization: n,
    initializeFromData: () => {
      const r = window.__INITIAL_DATA__;
      r && (n(r.customization || {}), t.value = r.agentName || "");
    }
  };
}
const Xf = {
  key: 0,
  class: "initializing-overlay"
}, eh = {
  key: 0,
  class: "connecting-message"
}, th = {
  key: 1,
  class: "failed-message"
}, nh = { class: "welcome-content" }, sh = { class: "welcome-header" }, rh = ["src", "alt"], ih = { class: "welcome-title" }, oh = { class: "welcome-subtitle" }, lh = { class: "welcome-input-container" }, ah = {
  key: 0,
  class: "email-input"
}, ch = ["disabled"], uh = { class: "welcome-message-input" }, fh = ["placeholder", "disabled"], hh = ["disabled"], dh = { class: "landing-page-content" }, ph = { class: "landing-page-header" }, gh = { class: "landing-page-heading" }, mh = { class: "landing-page-text" }, _h = { class: "landing-page-actions" }, yh = { class: "form-fullscreen-content" }, vh = {
  key: 0,
  class: "form-header"
}, bh = {
  key: 0,
  class: "form-title"
}, wh = {
  key: 1,
  class: "form-description"
}, kh = { class: "form-fields" }, xh = ["for"], Sh = {
  key: 0,
  class: "required-indicator"
}, Ch = ["id", "type", "placeholder", "required", "minlength", "maxlength", "value", "onInput", "onBlur", "autocomplete", "inputmode"], Th = ["id", "placeholder", "required", "min", "max", "value", "onInput"], Eh = ["id", "placeholder", "required", "minlength", "maxlength", "value", "onInput"], Ah = ["id", "required", "value", "onChange"], Rh = ["value"], Ih = {
  key: 4,
  class: "checkbox-field"
}, Oh = ["id", "required", "checked", "onChange"], Lh = { class: "checkbox-label" }, Ph = {
  key: 5,
  class: "radio-group"
}, $h = ["name", "value", "required", "checked", "onChange"], Fh = { class: "radio-label" }, Nh = {
  key: 6,
  class: "field-error"
}, Bh = { class: "form-actions" }, Mh = ["disabled"], Dh = {
  key: 0,
  class: "loading-spinner-inline"
}, qh = { key: 1 }, Vh = { class: "header-content" }, Hh = ["src", "alt"], Uh = { class: "header-info" }, jh = { class: "status" }, Wh = { class: "ask-anything-header" }, zh = ["src", "alt"], Kh = { class: "header-info" }, Zh = {
  key: 2,
  class: "loading-history"
}, Gh = {
  key: 0,
  class: "rating-content"
}, Yh = { class: "rating-prompt" }, Jh = ["onMouseover", "onMouseleave", "onClick", "disabled"], Qh = {
  key: 0,
  class: "feedback-wrapper"
}, Xh = { class: "feedback-section" }, ed = ["onUpdate:modelValue", "disabled"], td = { class: "feedback-counter" }, nd = ["onClick", "disabled"], sd = {
  key: 1,
  class: "submitted-feedback-wrapper"
}, rd = { class: "submitted-feedback" }, id = { class: "submitted-feedback-text" }, od = {
  key: 2,
  class: "submitted-message"
}, ld = {
  key: 1,
  class: "form-content"
}, ad = {
  key: 0,
  class: "form-header"
}, cd = {
  key: 0,
  class: "form-title"
}, ud = {
  key: 1,
  class: "form-description"
}, fd = { class: "form-fields" }, hd = ["for"], dd = {
  key: 0,
  class: "required-indicator"
}, pd = ["id", "type", "placeholder", "required", "minlength", "maxlength", "value", "onInput", "onBlur", "disabled", "autocomplete", "inputmode"], gd = ["id", "placeholder", "required", "min", "max", "value", "onInput", "disabled"], md = ["id", "placeholder", "required", "minlength", "maxlength", "value", "onInput", "disabled"], _d = ["id", "required", "value", "onChange", "disabled"], yd = ["value"], vd = {
  key: 4,
  class: "checkbox-field"
}, bd = ["id", "checked", "onChange", "disabled"], wd = ["for"], kd = {
  key: 5,
  class: "radio-field"
}, xd = ["id", "name", "value", "checked", "onChange", "disabled"], Sd = ["for"], Cd = {
  key: 6,
  class: "field-error"
}, Td = { class: "form-actions" }, Ed = ["onClick", "disabled"], Ad = {
  key: 2,
  class: "user-input-content"
}, Rd = {
  key: 0,
  class: "user-input-prompt"
}, Id = {
  key: 1,
  class: "user-input-form"
}, Od = ["onUpdate:modelValue", "onKeydown"], Ld = ["onClick", "disabled"], Pd = {
  key: 2,
  class: "user-input-submitted"
}, $d = {
  key: 0,
  class: "user-input-confirmation"
}, Fd = {
  key: 3,
  class: "product-message-container"
}, Nd = ["innerHTML"], Bd = {
  key: 1,
  class: "products-carousel"
}, Md = { class: "carousel-items" }, Dd = {
  key: 0,
  class: "product-image-compact"
}, qd = ["src", "alt"], Vd = { class: "product-info-compact" }, Hd = { class: "product-text-area" }, Ud = { class: "product-title-compact" }, jd = {
  key: 0,
  class: "product-variant-compact"
}, Wd = { class: "product-price-compact" }, zd = { class: "product-actions-compact" }, Kd = ["onClick"], Zd = {
  key: 2,
  class: "no-products-message"
}, Gd = {
  key: 3,
  class: "no-products-message"
}, Yd = ["innerHTML"], Jd = { class: "message-info" }, Qd = {
  key: 0,
  class: "agent-name"
}, Xd = {
  key: 0,
  class: "typing-indicator"
}, ep = {
  key: 0,
  class: "email-input"
}, tp = ["disabled"], np = { class: "message-input" }, sp = ["placeholder", "disabled"], rp = ["disabled"], ip = { class: "conversation-ended-message" }, op = {
  key: 7,
  class: "rating-dialog"
}, lp = { class: "rating-content" }, ap = { class: "star-rating" }, cp = ["onClick"], up = { class: "rating-actions" }, fp = ["disabled"], Qs = "ctid", hp = /* @__PURE__ */ Na({
  __name: "WidgetBuilder",
  props: {
    widgetId: {}
  },
  setup(e) {
    var ti;
    ue.setOptions({
      renderer: new ue.Renderer(),
      gfm: !0,
      breaks: !0
    });
    const t = new ue.Renderer(), n = t.link;
    t.link = (m, v, p) => n.call(t, m, v, p).replace(/^<a /, '<a target="_blank" rel="nofollow" '), ue.use({ renderer: t });
    const s = e, r = Be(() => {
      var m;
      return s.widgetId || ((m = window.__INITIAL_DATA__) == null ? void 0 : m.widgetId);
    }), {
      customization: i,
      agentName: o,
      applyCustomization: l,
      initializeFromData: a
    } = Qf(), {
      messages: u,
      loading: f,
      errorMessage: _,
      showError: b,
      loadingHistory: I,
      hasStartedChat: N,
      connectionStatus: q,
      sendMessage: we,
      loadChatHistory: ne,
      connect: de,
      reconnect: pe,
      cleanup: H,
      humanAgent: oe,
      onTakeover: qe,
      submitRating: fe,
      submitForm: je,
      currentForm: pt,
      getWorkflowState: Ze,
      proceedWorkflow: gt,
      onWorkflowState: wt,
      onWorkflowProceeded: et
    } = Kf(), Ve = he(""), Ht = he(!0), se = he(""), X = he(!1), re = (m) => {
      const v = m.target;
      Ve.value = v.value;
    };
    let M = null;
    const ke = () => {
      M && M.disconnect(), M = new MutationObserver((v) => {
        let p = !1, Z = !1;
        v.forEach((ve) => {
          if (ve.type === "childList") {
            const Y = Array.from(ve.addedNodes).some(
              (Ge) => {
                var Wt;
                return Ge.nodeType === Node.ELEMENT_NODE && (Ge.matches("input, textarea") || ((Wt = Ge.querySelector) == null ? void 0 : Wt.call(Ge, "input, textarea")));
              }
            ), Ee = Array.from(ve.removedNodes).some(
              (Ge) => {
                var Wt;
                return Ge.nodeType === Node.ELEMENT_NODE && (Ge.matches("input, textarea") || ((Wt = Ge.querySelector) == null ? void 0 : Wt.call(Ge, "input, textarea")));
              }
            );
            Y && (Z = !0, p = !0), Ee && (p = !0);
          }
        }), p && (clearTimeout(ke.timeoutId), ke.timeoutId = setTimeout(() => {
          Te();
        }, Z ? 50 : 100));
      });
      const m = document.querySelector(".widget-container") || document.body;
      M.observe(m, {
        childList: !0,
        subtree: !0
      });
    };
    ke.timeoutId = null;
    let W = [];
    const Te = () => {
      mt();
      const m = [
        '.widget-container input[type="text"]',
        '.chat-container input[type="text"]',
        ".message-input input",
        ".welcome-message-field",
        ".ask-anything-field",
        'input[placeholder*="message"]',
        'input[placeholder*="Type"]',
        'input[placeholder*="Ask"]',
        "input.message-input",
        "textarea",
        // More specific selectors for the widget context
        ".widget-container input",
        ".chat-input input",
        "input"
      ];
      let v = [];
      for (const p of m) {
        const Z = document.querySelectorAll(p);
        if (Z.length > 0) {
          v = Array.from(Z);
          break;
        }
      }
      v.length !== 0 && (W = v, v.forEach((p) => {
        p.addEventListener("input", _t, !0), p.addEventListener("keyup", _t, !0), p.addEventListener("change", _t, !0), p.addEventListener("keypress", sn, !0), p.addEventListener("keydown", kt, !0);
      }));
    }, mt = () => {
      W.forEach((m) => {
        m.removeEventListener("input", _t), m.removeEventListener("keyup", _t), m.removeEventListener("change", _t), m.removeEventListener("keypress", sn), m.removeEventListener("keydown", kt);
      }), W = [];
    }, _t = (m) => {
      const v = m.target;
      Ve.value = v.value;
    }, sn = (m) => {
      m.key === "Enter" && !m.shiftKey && (m.preventDefault(), m.stopPropagation(), E());
    }, kt = (m) => {
      m.key === "Enter" && !m.shiftKey && (m.preventDefault(), m.stopPropagation(), E());
    }, ct = he(!0), st = he(((ti = window.__INITIAL_DATA__) == null ? void 0 : ti.initialToken) || localStorage.getItem(Qs));
    Be(() => !!st.value), a();
    const rt = window.__INITIAL_DATA__;
    rt != null && rt.initialToken && (st.value = rt.initialToken, window.parent.postMessage({
      type: "TOKEN_UPDATE",
      token: rt.initialToken
    }, "*"), X.value = !0);
    const it = he(null), {
      chatStyles: Ut,
      chatIconStyles: h,
      agentBubbleStyles: g,
      userBubbleStyles: w,
      messageNameStyles: C,
      headerBorderStyles: T,
      photoUrl: S,
      shadowStyle: B
    } = Qu(i);
    Be(() => u.value.some(
      (m) => m.message_type === "form" && (!m.isSubmitted || m.isSubmitted === !1)
    ));
    const O = Be(() => {
      var m;
      return N.value && X.value || ut.value ? q.value === "connected" && !f.value : Tn(se.value.trim()) && q.value === "connected" && !f.value || ((m = window.__INITIAL_DATA__) == null ? void 0 : m.workflow);
    }), L = Be(() => q.value === "connected" ? ut.value ? "Ask me anything..." : "Type a message..." : "Connecting..."), E = async () => {
      if (!Ve.value.trim()) return;
      !N.value && se.value && await F(), await we(Ve.value, se.value), Ve.value = "";
      const m = document.querySelector('input[placeholder*="Type a message"]');
      m && (m.value = ""), setTimeout(() => {
        Te();
      }, 500);
    }, U = (m) => {
      m.key === "Enter" && !m.shiftKey && (m.preventDefault(), m.stopPropagation(), E());
    }, F = async () => {
      var m, v, p;
      try {
        if (!r.value)
          return console.error("Widget ID is not available"), !1;
        const Z = new URL(`${vs.API_URL}/widgets/${r.value}`);
        se.value.trim() && Tn(se.value.trim()) && Z.searchParams.append("email", se.value.trim());
        const ve = {
          Accept: "application/json",
          "Content-Type": "application/json"
        };
        st.value && (ve.Authorization = `Bearer ${st.value}`);
        const Y = await fetch(Z, {
          headers: ve
        });
        if (Y.status === 401)
          return X.value = !1, !1;
        const Ee = await Y.json();
        return Ee.token && (st.value = Ee.token, localStorage.setItem(Qs, Ee.token), window.parent.postMessage({ type: "TOKEN_UPDATE", token: Ee.token }, "*")), X.value = !0, await de() ? (await j(), (m = Ee.agent) != null && m.customization && l(Ee.agent.customization), Ee.agent && !(Ee != null && Ee.human_agent) && (o.value = Ee.agent.name), Ee != null && Ee.human_agent && (oe.value = Ee.human_agent), ((v = Ee.agent) == null ? void 0 : v.workflow) !== void 0 && (window.__INITIAL_DATA__ = window.__INITIAL_DATA__ || {}, window.__INITIAL_DATA__.workflow = Ee.agent.workflow), (p = Ee.agent) != null && p.workflow && (console.log("Getting workflow state after authorization"), await Ze()), !0) : (console.error("Failed to connect to chat service"), !1);
      } catch (Z) {
        return console.error("Error checking authorization:", Z), X.value = !1, !1;
      } finally {
        ct.value = !1;
      }
    }, j = async () => {
      !N.value && X.value && (N.value = !0, await ne());
    }, K = () => {
      it.value && (it.value.scrollTop = it.value.scrollHeight);
    };
    un(() => u.value, (m) => {
      Ao(() => {
        K();
      });
    }, { deep: !0 }), un(q, (m, v) => {
      m === "connected" && v !== "connected" && setTimeout(Te, 100);
    }), un(() => u.value.length, (m, v) => {
      m > 0 && v === 0 && setTimeout(Te, 100);
    }), un(() => u.value, (m) => {
      if (m.length > 0) {
        const v = m[m.length - 1];
        He(v);
      }
    }, { deep: !0 });
    const ee = async () => {
      await pe() && await F();
    }, ge = he(!1), ie = he(0), Fe = he(""), Re = he(""), Oe = he(0), c = he(!1), d = he({}), k = he(!1), y = he({}), A = he(!1), V = he(null), z = he("Start Chat"), te = he(!1), G = he(null);
    Be(() => {
      var v;
      const m = u.value[u.value.length - 1];
      return ((v = m == null ? void 0 : m.attributes) == null ? void 0 : v.request_rating) || !1;
    });
    const Ie = Be(() => {
      var v;
      if (!((v = window.__INITIAL_DATA__) != null && v.workflow))
        return !1;
      const m = u.value.find((p) => p.message_type === "rating");
      return (m == null ? void 0 : m.isSubmitted) === !0;
    }), xe = Be(() => oe.value.human_agent_profile_pic ? oe.value.human_agent_profile_pic.includes("amazonaws.com") ? oe.value.human_agent_profile_pic : `${vs.API_URL}${oe.value.human_agent_profile_pic}` : ""), He = (m) => {
      var v, p, Z;
      if ((v = m.attributes) != null && v.end_chat && ((p = m.attributes) != null && p.request_rating)) {
        const ve = m.agent_name || ((Z = oe.value) == null ? void 0 : Z.human_agent_name) || o.value || "our agent";
        u.value.push({
          message: `Rate the chat session that you had with ${ve}`,
          message_type: "rating",
          created_at: (/* @__PURE__ */ new Date()).toISOString(),
          session_id: m.session_id,
          agent_name: ve,
          showFeedback: !1
        }), Re.value = m.session_id;
      }
    }, ot = (m) => {
      c.value || (Oe.value = m);
    }, jt = () => {
      if (!c.value) {
        const m = u.value[u.value.length - 1];
        Oe.value = (m == null ? void 0 : m.selectedRating) || 0;
      }
    }, $s = async (m) => {
      if (!c.value) {
        Oe.value = m;
        const v = u.value[u.value.length - 1];
        v && v.message_type === "rating" && (v.showFeedback = !0, v.selectedRating = m);
      }
    }, Il = async (m, v, p = null) => {
      try {
        c.value = !0, await fe(v, p);
        const Z = u.value.find((ve) => ve.message_type === "rating");
        Z && (Z.isSubmitted = !0, Z.finalRating = v, Z.finalFeedback = p);
      } catch (Z) {
        console.error("Failed to submit rating:", Z);
      } finally {
        c.value = !1;
      }
    }, Ol = (m) => {
      const v = {};
      for (const p of m.fields) {
        const Z = d.value[p.name], ve = Fs(p, Z);
        ve && (v[p.name] = ve);
      }
      return y.value = v, Object.keys(v).length === 0;
    }, Ll = async (m) => {
      if (console.log("handleFormSubmit called with config:", m), console.log("Current form data:", d.value), console.log("isSubmittingForm:", k.value), k.value) {
        console.log("Form submission already in progress, returning");
        return;
      }
      console.log("Validating form...");
      const v = Ol(m);
      if (console.log("Form validation result:", v), console.log("Form errors:", y.value), !v) {
        console.log("Form validation failed, not submitting");
        return;
      }
      try {
        console.log("Starting form submission..."), k.value = !0, await je(d.value), console.log("Form submitted successfully");
        const p = u.value.findIndex(
          (Z) => Z.message_type === "form" && (!Z.isSubmitted || Z.isSubmitted === !1)
        );
        p !== -1 && (u.value.splice(p, 1), console.log("Removed form message from chat")), d.value = {}, y.value = {}, console.log("Cleared form data and errors");
      } catch (p) {
        console.error("Failed to submit form:", p);
      } finally {
        k.value = !1, console.log("Form submission completed");
      }
    }, tt = (m, v) => {
      var p, Z;
      if (console.log(`Field change: ${m} = `, v), d.value[m] = v, console.log("Updated formData:", d.value), v && v.toString().trim() !== "") {
        let ve = null;
        if ((p = G.value) != null && p.fields && (ve = G.value.fields.find((Y) => Y.name === m)), !ve && ((Z = pt.value) != null && Z.fields) && (ve = pt.value.fields.find((Y) => Y.name === m)), ve) {
          const Y = Fs(ve, v);
          Y ? (y.value[m] = Y, console.log(`Validation error for ${m}:`, Y)) : (delete y.value[m], console.log(`Validation passed for ${m}`));
        }
      } else
        delete y.value[m], console.log(`Cleared error for ${m}`);
    }, Pl = (m) => {
      const v = m.replace(/\D/g, "");
      return v.length >= 7 && v.length <= 15;
    }, Fs = (m, v) => {
      if (m.required && (!v || v.toString().trim() === ""))
        return `${m.label} is required`;
      if (!v || v.toString().trim() === "")
        return null;
      if (m.type === "email" && !Tn(v))
        return "Please enter a valid email address";
      if (m.type === "tel" && !Pl(v))
        return "Please enter a valid phone number";
      if ((m.type === "text" || m.type === "textarea") && m.minLength && v.length < m.minLength)
        return `${m.label} must be at least ${m.minLength} characters`;
      if ((m.type === "text" || m.type === "textarea") && m.maxLength && v.length > m.maxLength)
        return `${m.label} must not exceed ${m.maxLength} characters`;
      if (m.type === "number") {
        const p = parseFloat(v);
        if (isNaN(p))
          return `${m.label} must be a valid number`;
        if (m.minLength && p < m.minLength)
          return `${m.label} must be at least ${m.minLength}`;
        if (m.maxLength && p > m.maxLength)
          return `${m.label} must not exceed ${m.maxLength}`;
      }
      return null;
    }, $l = async () => {
      if (k.value || !G.value) {
        console.log("Already submitting or no form data, returning");
        return;
      }
      try {
        console.log("Starting full screen form submission..."), k.value = !0, y.value = {};
        let m = !1;
        for (const v of G.value.fields || []) {
          const p = d.value[v.name], Z = Fs(v, p);
          Z && (y.value[v.name] = Z, m = !0, console.log(`Validation error for field ${v.name}:`, Z));
        }
        if (console.log("Validation completed. Has errors:", m), console.log("Form errors:", y.value), m) {
          k.value = !1, console.log("Validation failed, not submitting");
          return;
        }
        console.log("Submitting form data:", d.value), await je(d.value), console.log("Full screen form submitted successfully"), te.value = !1, G.value = null, d.value = {}, console.log("Full screen form hidden and data cleared");
      } catch (m) {
        console.error("Failed to submit full screen form:", m);
      } finally {
        k.value = !1, console.log("Full screen form submission completed");
      }
    }, Fl = (m) => {
      m && window.parent.postMessage({
        type: "VIEW_PRODUCT",
        productId: m
      }, "*");
    }, Nl = (m) => m ? m.replace(/https?:\/\/[^\s\)]+/g, "[link removed]") : "", Bl = async () => {
      try {
        A.value = !1, V.value = null, await gt();
      } catch (m) {
        console.error("Failed to proceed workflow:", m);
      }
    }, Ns = async (m) => {
      try {
        if (!m.userInputValue || !m.userInputValue.trim())
          return;
        const v = m.userInputValue.trim();
        m.isSubmitted = !0, m.submittedValue = v, await we(v, se.value), console.log("User input submitted:", v);
      } catch (v) {
        console.error("Failed to submit user input:", v), m.isSubmitted = !1, m.submittedValue = null;
      }
    }, Xr = async () => {
      var m, v, p;
      try {
        let Z = 0;
        const ve = 50;
        for (; !((m = window.__INITIAL_DATA__) != null && m.widgetId) && Z < ve; )
          await new Promise((Ee) => setTimeout(Ee, 100)), Z++;
        return (v = window.__INITIAL_DATA__) != null && v.widgetId ? await F() ? ((p = window.__INITIAL_DATA__) != null && p.workflow && X.value && await Ze(), !0) : (console.log("$$$ isAuthorized false, setting connection status to connected"), q.value = "connected", !1) : (console.error("Widget data not available after waiting"), !1);
      } catch (Z) {
        return console.error("Failed to initialize widget:", Z), !1;
      }
    }, Ml = () => {
      qe(async () => {
        await F();
      }), window.addEventListener("message", (m) => {
        m.data.type === "SCROLL_TO_BOTTOM" && K(), m.data.type === "TOKEN_RECEIVED" && localStorage.setItem(Qs, m.data.token);
      }), wt((m) => {
        var v, p;
        if (console.log("Workflow state received in component:", m), console.log("Data type:", m.type), console.log("Form data:", m.form_data), z.value = m.button_text || "Start Chat", m.type === "landing_page")
          console.log("Setting landing page data:", m.landing_page_data), V.value = m.landing_page_data, A.value = !0, te.value = !1, console.log("Landing page state - show:", A.value, "data:", V.value);
        else if (m.type === "form" || m.type === "display_form")
          if (console.log("Form full screen flag:", (v = m.form_data) == null ? void 0 : v.form_full_screen), ((p = m.form_data) == null ? void 0 : p.form_full_screen) === !0)
            console.log("Setting full screen form data:", m.form_data), G.value = m.form_data, te.value = !0, A.value = !1, console.log("Full screen form state - show:", te.value);
          else {
            console.log("Regular form mode - adding form message to chat");
            const Z = {
              message: "",
              message_type: "form",
              attributes: {
                form_data: m.form_data
              },
              created_at: (/* @__PURE__ */ new Date()).toISOString(),
              isSubmitted: !1
            };
            u.value.findIndex(
              (Y) => Y.message_type === "form" && !Y.isSubmitted
            ) === -1 && u.value.push(Z), A.value = !1, te.value = !1;
          }
        else
          console.log("No special workflow state, hiding overlay forms"), A.value = !1, te.value = !1;
      }), et((m) => {
        console.log("Workflow proceeded:", m);
      });
    }, Dl = async () => {
      try {
        console.log("Starting new conversation - getting workflow state"), await Xr(), await Ze();
      } catch (m) {
        throw console.error("Failed to start new conversation:", m), m;
      }
    }, ql = async () => {
      Ie.value = !1, u.value = [], await Dl();
    };
    No(async () => {
      await Xr(), Ml(), ke(), (() => {
        const v = u.value.length > 0, p = q.value === "connected", Z = document.querySelector('input[type="text"], textarea') !== null;
        return v || p || Z;
      })() && setTimeout(Te, 100);
    }), Fr(() => {
      window.removeEventListener("message", (m) => {
        m.data.type === "SCROLL_TO_BOTTOM" && K();
      }), M && (M.disconnect(), M = null), ke.timeoutId && (clearTimeout(ke.timeoutId), ke.timeoutId = null), mt(), H();
    });
    const ut = Be(() => i.value.chat_style === "ASK_ANYTHING"), Vl = Be(() => {
      const m = {
        width: "100%",
        height: "580px",
        borderRadius: "var(--radius-lg)"
      };
      return window.innerWidth <= 768 && (m.width = "100vw", m.height = "100vh", m.borderRadius = "0", m.position = "fixed", m.top = "0", m.left = "0", m.bottom = "0", m.right = "0", m.maxWidth = "100vw", m.maxHeight = "100vh"), ut.value ? window.innerWidth <= 768 ? {
        ...m,
        width: "100vw",
        height: "100vh",
        maxWidth: "100vw",
        maxHeight: "100vh",
        minWidth: "unset",
        borderRadius: "0"
      } : window.innerWidth <= 1024 ? {
        ...m,
        width: "95%",
        maxWidth: "700px",
        minWidth: "500px",
        height: "650px"
      } : {
        ...m,
        width: "100%",
        maxWidth: "400px",
        minWidth: "400px",
        height: "580px"
      } : m;
    }), ei = Be(() => ut.value && u.value.length === 0);
    return (m, v) => (P(), $("div", {
      class: Le(["chat-container", { collapsed: !Ht.value, "ask-anything-style": ut.value }]),
      style: be({ ...D(B), ...Vl.value })
    }, [
      ct.value ? (P(), $("div", Xf, v[8] || (v[8] = [
        Ac('<div class="loading-spinner" data-v-d4752b97><div class="dot" data-v-d4752b97></div><div class="dot" data-v-d4752b97></div><div class="dot" data-v-d4752b97></div></div><div class="loading-text" data-v-d4752b97>Initializing chat...</div>', 2)
      ]))) : le("", !0),
      !ct.value && D(q) !== "connected" ? (P(), $("div", {
        key: 1,
        class: Le(["connection-status", D(q)])
      }, [
        D(q) === "connecting" ? (P(), $("div", eh, v[9] || (v[9] = [
          yt(" Connecting to chat service... ", -1),
          x("div", { class: "loading-dots" }, [
            x("div", { class: "dot" }),
            x("div", { class: "dot" }),
            x("div", { class: "dot" })
          ], -1)
        ]))) : D(q) === "failed" ? (P(), $("div", th, [
          v[10] || (v[10] = yt(" Connection failed. ", -1)),
          x("button", {
            onClick: ee,
            class: "reconnect-button"
          }, " Click here to reconnect ")
        ])) : le("", !0)
      ], 2)) : le("", !0),
      D(b) ? (P(), $("div", {
        key: 2,
        class: "error-alert",
        style: be(D(h))
      }, ae(D(_)), 5)) : le("", !0),
      ei.value ? (P(), $("div", {
        key: 3,
        class: "welcome-message-section",
        style: be(D(Ut))
      }, [
        x("div", nh, [
          x("div", sh, [
            D(S) ? (P(), $("img", {
              key: 0,
              src: D(S),
              alt: D(o),
              class: "welcome-avatar"
            }, null, 8, rh)) : le("", !0),
            x("h1", ih, ae(D(i).welcome_title || `Welcome to ${D(o)}`), 1),
            x("p", oh, ae(D(i).welcome_subtitle || "I'm here to help you with anything you need. What can I assist you with today?"), 1)
          ])
        ]),
        x("div", lh, [
          !D(N) && !X.value && !ut.value ? (P(), $("div", ah, [
            rn(x("input", {
              "onUpdate:modelValue": v[0] || (v[0] = (p) => se.value = p),
              type: "email",
              placeholder: "Enter your email address",
              disabled: D(f) || D(q) !== "connected",
              class: Le([{
                invalid: se.value.trim() && !D(Tn)(se.value.trim()),
                disabled: D(q) !== "connected"
              }, "welcome-email-input"])
            }, null, 10, ch), [
              [an, se.value]
            ])
          ])) : le("", !0),
          x("div", uh, [
            rn(x("input", {
              "onUpdate:modelValue": v[1] || (v[1] = (p) => Ve.value = p),
              type: "text",
              placeholder: L.value,
              onKeypress: U,
              onInput: re,
              onChange: re,
              disabled: !O.value,
              class: Le([{ disabled: !O.value }, "welcome-message-field"])
            }, null, 42, fh), [
              [an, Ve.value]
            ]),
            x("button", {
              class: "welcome-send-button",
              style: be(D(w)),
              onClick: E,
              disabled: !Ve.value.trim() || !O.value
            }, v[11] || (v[11] = [
              x("svg", {
                width: "20",
                height: "20",
                viewBox: "0 0 24 24",
                fill: "none",
                xmlns: "http://www.w3.org/2000/svg"
              }, [
                x("path", {
                  d: "M5 12L3 21L21 12L3 3L5 12ZM5 12L13 12",
                  stroke: "currentColor",
                  "stroke-width": "2",
                  "stroke-linecap": "round",
                  "stroke-linejoin": "round"
                })
              ], -1)
            ]), 12, hh)
          ])
        ]),
        x("div", {
          class: "powered-by-welcome",
          style: be(D(C))
        }, v[12] || (v[12] = [
          x("svg", {
            class: "chattermate-logo",
            width: "16",
            height: "16",
            viewBox: "0 0 60 60",
            fill: "none",
            xmlns: "http://www.w3.org/2000/svg"
          }, [
            x("path", {
              d: "M45 15H15C13.3431 15 12 16.3431 12 18V42C12 43.6569 13.3431 45 15 45H25L30 52L35 45H45C46.6569 45 48 43.6569 48 42V18C48 16.3431 46.6569 15 45 15Z",
              fill: "currentColor",
              opacity: "0.8"
            }),
            x("path", {
              d: "M36 27C36 27 32.5 26 30 26C27.5 26 24 27 24 31C24 35 27.5 36 30 36C32.5 36 36 35 36 35V33C36 33 33 34 31.5 34C30 34 27 33 27 31C27 29 30 28 31.5 28C33 28 36 29 36 29V27Z",
              fill: "currentColor"
            })
          ], -1),
          yt(" Powered by ChatterMate ", -1)
        ]), 4)
      ], 4)) : le("", !0),
      A.value && V.value ? (P(), $("div", {
        key: 4,
        class: "landing-page-fullscreen",
        style: be(D(Ut))
      }, [
        x("div", dh, [
          x("div", ph, [
            x("h2", gh, ae(V.value.heading), 1),
            x("div", mh, ae(V.value.content), 1)
          ]),
          x("div", _h, [
            x("button", {
              class: "landing-page-button",
              onClick: Bl
            }, ae(z.value), 1)
          ])
        ]),
        x("div", {
          class: "powered-by-landing",
          style: be(D(C))
        }, v[13] || (v[13] = [
          x("svg", {
            class: "chattermate-logo",
            width: "16",
            height: "16",
            viewBox: "0 0 60 60",
            fill: "none",
            xmlns: "http://www.w3.org/2000/svg"
          }, [
            x("path", {
              d: "M45 15H15C13.3431 15 12 16.3431 12 18V42C12 43.6569 13.3431 45 15 45H25L30 52L35 45H45C46.6569 45 48 43.6569 48 42V18C48 16.3431 46.6569 15 45 15Z",
              fill: "currentColor",
              opacity: "0.8"
            }),
            x("path", {
              d: "M36 27C36 27 32.5 26 30 26C27.5 26 24 27 24 31C24 35 27.5 36 30 36C32.5 36 36 35 36 35V33C36 33 33 34 31.5 34C30 34 27 33 27 31C27 29 30 28 31.5 28C33 28 36 29 36 29V27Z",
              fill: "currentColor"
            })
          ], -1),
          yt(" Powered by ChatterMate ", -1)
        ]), 4)
      ], 4)) : te.value && G.value ? (P(), $("div", {
        key: 5,
        class: "form-fullscreen",
        style: be(D(Ut))
      }, [
        x("div", yh, [
          G.value.title || G.value.description ? (P(), $("div", vh, [
            G.value.title ? (P(), $("h2", bh, ae(G.value.title), 1)) : le("", !0),
            G.value.description ? (P(), $("p", wh, ae(G.value.description), 1)) : le("", !0)
          ])) : le("", !0),
          x("div", kh, [
            (P(!0), $(Ne, null, xt(G.value.fields, (p) => {
              var Z, ve;
              return P(), $("div", {
                key: p.name,
                class: "form-field"
              }, [
                x("label", {
                  for: `fullscreen-form-${p.name}`,
                  class: "field-label"
                }, [
                  yt(ae(p.label) + " ", 1),
                  p.required ? (P(), $("span", Sh, "*")) : le("", !0)
                ], 8, xh),
                p.type === "text" || p.type === "email" || p.type === "tel" ? (P(), $("input", {
                  key: 0,
                  id: `fullscreen-form-${p.name}`,
                  type: p.type,
                  placeholder: p.placeholder || "",
                  required: p.required,
                  minlength: p.minLength,
                  maxlength: p.maxLength,
                  value: d.value[p.name] || "",
                  onInput: (Y) => tt(p.name, Y.target.value),
                  onBlur: (Y) => tt(p.name, Y.target.value),
                  class: Le(["form-input", { error: y.value[p.name] }]),
                  autocomplete: p.type === "email" ? "email" : p.type === "tel" ? "tel" : "off",
                  inputmode: p.type === "tel" ? "tel" : p.type === "email" ? "email" : "text"
                }, null, 42, Ch)) : p.type === "number" ? (P(), $("input", {
                  key: 1,
                  id: `fullscreen-form-${p.name}`,
                  type: "number",
                  placeholder: p.placeholder || "",
                  required: p.required,
                  min: p.minLength,
                  max: p.maxLength,
                  value: d.value[p.name] || "",
                  onInput: (Y) => tt(p.name, Y.target.value),
                  class: Le(["form-input", { error: y.value[p.name] }])
                }, null, 42, Th)) : p.type === "textarea" ? (P(), $("textarea", {
                  key: 2,
                  id: `fullscreen-form-${p.name}`,
                  placeholder: p.placeholder || "",
                  required: p.required,
                  minlength: p.minLength,
                  maxlength: p.maxLength,
                  value: d.value[p.name] || "",
                  onInput: (Y) => tt(p.name, Y.target.value),
                  class: Le(["form-textarea", { error: y.value[p.name] }]),
                  rows: "4"
                }, null, 42, Eh)) : p.type === "select" ? (P(), $("select", {
                  key: 3,
                  id: `fullscreen-form-${p.name}`,
                  required: p.required,
                  value: d.value[p.name] || "",
                  onChange: (Y) => tt(p.name, Y.target.value),
                  class: Le(["form-select", { error: y.value[p.name] }])
                }, [
                  v[14] || (v[14] = x("option", { value: "" }, "Please select...", -1)),
                  (P(!0), $(Ne, null, xt((Z = p.options) == null ? void 0 : Z.split(`
`).filter((Y) => Y.trim()), (Y) => (P(), $("option", {
                    key: Y,
                    value: Y.trim()
                  }, ae(Y.trim()), 9, Rh))), 128))
                ], 42, Ah)) : p.type === "checkbox" ? (P(), $("label", Ih, [
                  x("input", {
                    id: `fullscreen-form-${p.name}`,
                    type: "checkbox",
                    required: p.required,
                    checked: d.value[p.name] || !1,
                    onChange: (Y) => tt(p.name, Y.target.checked),
                    class: "form-checkbox"
                  }, null, 40, Oh),
                  x("span", Lh, ae(p.label), 1)
                ])) : p.type === "radio" ? (P(), $("div", Ph, [
                  (P(!0), $(Ne, null, xt((ve = p.options) == null ? void 0 : ve.split(`
`).filter((Y) => Y.trim()), (Y) => (P(), $("label", {
                    key: Y,
                    class: "radio-field"
                  }, [
                    x("input", {
                      type: "radio",
                      name: `fullscreen-form-${p.name}`,
                      value: Y.trim(),
                      required: p.required,
                      checked: d.value[p.name] === Y.trim(),
                      onChange: (Ee) => tt(p.name, Y.trim()),
                      class: "form-radio"
                    }, null, 40, $h),
                    x("span", Fh, ae(Y.trim()), 1)
                  ]))), 128))
                ])) : le("", !0),
                y.value[p.name] ? (P(), $("div", Nh, ae(y.value[p.name]), 1)) : le("", !0)
              ]);
            }), 128))
          ]),
          x("div", Bh, [
            x("button", {
              onClick: v[2] || (v[2] = () => {
                console.log("Submit button clicked!"), $l();
              }),
              disabled: k.value,
              class: "submit-form-button",
              style: be(D(w))
            }, [
              k.value ? (P(), $("span", Dh, v[15] || (v[15] = [
                x("div", { class: "dot" }, null, -1),
                x("div", { class: "dot" }, null, -1),
                x("div", { class: "dot" }, null, -1)
              ]))) : (P(), $("span", qh, ae(G.value.submit_button_text || "Submit"), 1))
            ], 12, Mh)
          ])
        ]),
        x("div", {
          class: "powered-by-landing",
          style: be(D(C))
        }, v[16] || (v[16] = [
          x("svg", {
            class: "chattermate-logo",
            width: "16",
            height: "16",
            viewBox: "0 0 60 60",
            fill: "none",
            xmlns: "http://www.w3.org/2000/svg"
          }, [
            x("path", {
              d: "M45 15H15C13.3431 15 12 16.3431 12 18V42C12 43.6569 13.3431 45 15 45H25L30 52L35 45H45C46.6569 45 48 43.6569 48 42V18C48 16.3431 46.6569 15 45 15Z",
              fill: "currentColor",
              opacity: "0.8"
            }),
            x("path", {
              d: "M36 27C36 27 32.5 26 30 26C27.5 26 24 27 24 31C24 35 27.5 36 30 36C32.5 36 36 35 36 35V33C36 33 33 34 31.5 34C30 34 27 33 27 31C27 29 30 28 31.5 28C33 28 36 29 36 29V27Z",
              fill: "currentColor"
            })
          ], -1),
          yt(" Powered by ChatterMate ", -1)
        ]), 4)
      ], 4)) : ei.value ? le("", !0) : (P(), $(Ne, { key: 6 }, [
        Ht.value ? (P(), $("div", {
          key: 0,
          class: Le(["chat-panel", { "ask-anything-chat": ut.value }]),
          style: be(D(Ut))
        }, [
          ut.value ? (P(), $("div", {
            key: 1,
            class: "ask-anything-top",
            style: be(D(T))
          }, [
            x("div", Wh, [
              xe.value || D(S) ? (P(), $("img", {
                key: 0,
                src: xe.value || D(S),
                alt: D(oe).human_agent_name || D(o),
                class: "header-avatar"
              }, null, 8, zh)) : le("", !0),
              x("div", Kh, [
                x("h3", {
                  style: be(D(C))
                }, ae(D(o)), 5),
                x("p", {
                  class: "ask-anything-subtitle",
                  style: be(D(C))
                }, ae(D(i).welcome_subtitle || "Ask me anything. I'm here to help."), 5)
              ])
            ])
          ], 4)) : (P(), $("div", {
            key: 0,
            class: "chat-header",
            style: be(D(T))
          }, [
            x("div", Vh, [
              xe.value || D(S) ? (P(), $("img", {
                key: 0,
                src: xe.value || D(S),
                alt: D(oe).human_agent_name || D(o),
                class: "header-avatar"
              }, null, 8, Hh)) : le("", !0),
              x("div", Uh, [
                x("h3", {
                  style: be(D(C))
                }, ae(D(oe).human_agent_name || D(o)), 5),
                x("div", jh, [
                  v[17] || (v[17] = x("span", { class: "status-indicator online" }, null, -1)),
                  x("span", {
                    class: "status-text",
                    style: be(D(C))
                  }, "Online", 4)
                ])
              ])
            ])
          ], 4)),
          D(I) ? (P(), $("div", Zh, v[18] || (v[18] = [
            x("div", { class: "loading-spinner" }, [
              x("div", { class: "dot" }),
              x("div", { class: "dot" }),
              x("div", { class: "dot" })
            ], -1)
          ]))) : le("", !0),
          x("div", {
            class: "chat-messages",
            ref_key: "messagesContainer",
            ref: it
          }, [
            (P(!0), $(Ne, null, xt(D(u), (p, Z) => {
              var ve, Y, Ee, Ge, Wt, ni, si, ri, ii, oi, li, ai, ci, ui, fi, hi, di;
              return P(), $("div", {
                key: Z,
                class: Le([
                  "message",
                  p.message_type === "bot" || p.message_type === "agent" ? "agent-message" : p.message_type === "system" ? "system-message" : p.message_type === "rating" ? "rating-message" : p.message_type === "form" ? "form-message" : p.message_type === "product" || p.shopify_output ? "product-message" : "user-message"
                ])
              }, [
                x("div", {
                  class: "message-bubble",
                  style: be(p.message_type === "system" || p.message_type === "rating" || p.message_type === "product" || p.shopify_output ? {} : p.message_type === "user" ? D(w) : D(g))
                }, [
                  p.message_type === "rating" ? (P(), $("div", Gh, [
                    x("p", Yh, "Rate the chat session that you had with " + ae(p.agent_name || D(oe).human_agent_name || D(o) || "our agent"), 1),
                    x("div", {
                      class: Le(["star-rating", { submitted: c.value || p.isSubmitted }])
                    }, [
                      (P(), $(Ne, null, xt(5, (R) => x("button", {
                        key: R,
                        class: Le(["star-button", {
                          warning: R <= (p.isSubmitted ? p.finalRating : Oe.value || p.selectedRating) && (p.isSubmitted ? p.finalRating : Oe.value || p.selectedRating) <= 3,
                          success: R <= (p.isSubmitted ? p.finalRating : Oe.value || p.selectedRating) && (p.isSubmitted ? p.finalRating : Oe.value || p.selectedRating) > 3,
                          selected: R <= (p.isSubmitted ? p.finalRating : Oe.value || p.selectedRating)
                        }]),
                        onMouseover: (zt) => !p.isSubmitted && ot(R),
                        onMouseleave: (zt) => !p.isSubmitted && jt,
                        onClick: (zt) => !p.isSubmitted && $s(R),
                        disabled: c.value || p.isSubmitted
                      }, " ★ ", 42, Jh)), 64))
                    ], 2),
                    p.showFeedback && !p.isSubmitted ? (P(), $("div", Qh, [
                      x("div", Xh, [
                        rn(x("input", {
                          "onUpdate:modelValue": (R) => p.feedback = R,
                          placeholder: "Please share your feedback (optional)",
                          disabled: c.value,
                          maxlength: "500",
                          class: "feedback-input"
                        }, null, 8, ed), [
                          [an, p.feedback]
                        ]),
                        x("div", td, ae(((ve = p.feedback) == null ? void 0 : ve.length) || 0) + "/500", 1)
                      ]),
                      x("button", {
                        onClick: (R) => Il(p.session_id, Oe.value, p.feedback),
                        disabled: c.value || !Oe.value,
                        class: "submit-rating-button",
                        style: be({ backgroundColor: D(i).accent_color || "var(--primary-color)" })
                      }, ae(c.value ? "Submitting..." : "Submit Rating"), 13, nd)
                    ])) : le("", !0),
                    p.isSubmitted && p.finalFeedback ? (P(), $("div", sd, [
                      x("div", rd, [
                        x("p", id, ae(p.finalFeedback), 1)
                      ])
                    ])) : p.isSubmitted ? (P(), $("div", od, " Thank you for your rating! ")) : le("", !0)
                  ])) : p.message_type === "form" ? (P(), $("div", ld, [
                    (Ee = (Y = p.attributes) == null ? void 0 : Y.form_data) != null && Ee.title || (Wt = (Ge = p.attributes) == null ? void 0 : Ge.form_data) != null && Wt.description ? (P(), $("div", ad, [
                      (si = (ni = p.attributes) == null ? void 0 : ni.form_data) != null && si.title ? (P(), $("h3", cd, ae(p.attributes.form_data.title), 1)) : le("", !0),
                      (ii = (ri = p.attributes) == null ? void 0 : ri.form_data) != null && ii.description ? (P(), $("p", ud, ae(p.attributes.form_data.description), 1)) : le("", !0)
                    ])) : le("", !0),
                    x("div", fd, [
                      (P(!0), $(Ne, null, xt((li = (oi = p.attributes) == null ? void 0 : oi.form_data) == null ? void 0 : li.fields, (R) => {
                        var zt, Bs;
                        return P(), $("div", {
                          key: R.name,
                          class: "form-field"
                        }, [
                          x("label", {
                            for: `form-${R.name}`,
                            class: "field-label"
                          }, [
                            yt(ae(R.label) + " ", 1),
                            R.required ? (P(), $("span", dd, "*")) : le("", !0)
                          ], 8, hd),
                          R.type === "text" || R.type === "email" || R.type === "tel" ? (P(), $("input", {
                            key: 0,
                            id: `form-${R.name}`,
                            type: R.type,
                            placeholder: R.placeholder || "",
                            required: R.required,
                            minlength: R.minLength,
                            maxlength: R.maxLength,
                            value: d.value[R.name] || "",
                            onInput: (Pe) => tt(R.name, Pe.target.value),
                            onBlur: (Pe) => tt(R.name, Pe.target.value),
                            class: Le(["form-input", { error: y.value[R.name] }]),
                            disabled: k.value,
                            autocomplete: R.type === "email" ? "email" : R.type === "tel" ? "tel" : "off",
                            inputmode: R.type === "tel" ? "tel" : R.type === "email" ? "email" : "text"
                          }, null, 42, pd)) : R.type === "number" ? (P(), $("input", {
                            key: 1,
                            id: `form-${R.name}`,
                            type: "number",
                            placeholder: R.placeholder || "",
                            required: R.required,
                            min: R.min,
                            max: R.max,
                            value: d.value[R.name] || "",
                            onInput: (Pe) => tt(R.name, Pe.target.value),
                            class: Le(["form-input", { error: y.value[R.name] }]),
                            disabled: k.value
                          }, null, 42, gd)) : R.type === "textarea" ? (P(), $("textarea", {
                            key: 2,
                            id: `form-${R.name}`,
                            placeholder: R.placeholder || "",
                            required: R.required,
                            minlength: R.minLength,
                            maxlength: R.maxLength,
                            value: d.value[R.name] || "",
                            onInput: (Pe) => tt(R.name, Pe.target.value),
                            class: Le(["form-textarea", { error: y.value[R.name] }]),
                            disabled: k.value,
                            rows: "3"
                          }, null, 42, md)) : R.type === "select" ? (P(), $("select", {
                            key: 3,
                            id: `form-${R.name}`,
                            required: R.required,
                            value: d.value[R.name] || "",
                            onChange: (Pe) => tt(R.name, Pe.target.value),
                            class: Le(["form-select", { error: y.value[R.name] }]),
                            disabled: k.value
                          }, [
                            v[19] || (v[19] = x("option", { value: "" }, "Select an option", -1)),
                            (P(!0), $(Ne, null, xt(((zt = R.options) == null ? void 0 : zt.split(",")) || [], (Pe) => (P(), $("option", {
                              key: Pe.trim(),
                              value: Pe.trim()
                            }, ae(Pe.trim()), 9, yd))), 128))
                          ], 42, _d)) : R.type === "checkbox" ? (P(), $("div", vd, [
                            x("input", {
                              id: `form-${R.name}`,
                              type: "checkbox",
                              checked: d.value[R.name] || !1,
                              onChange: (Pe) => tt(R.name, Pe.target.checked),
                              class: "form-checkbox",
                              disabled: k.value
                            }, null, 40, bd),
                            x("label", {
                              for: `form-${R.name}`,
                              class: "checkbox-label"
                            }, ae(R.placeholder || R.label), 9, wd)
                          ])) : R.type === "radio" ? (P(), $("div", kd, [
                            (P(!0), $(Ne, null, xt(((Bs = R.options) == null ? void 0 : Bs.split(",")) || [], (Pe) => (P(), $("div", {
                              key: Pe.trim(),
                              class: "radio-option"
                            }, [
                              x("input", {
                                id: `form-${R.name}-${Pe.trim()}`,
                                name: `form-${R.name}`,
                                type: "radio",
                                value: Pe.trim(),
                                checked: d.value[R.name] === Pe.trim(),
                                onChange: (yp) => tt(R.name, Pe.trim()),
                                class: "form-radio",
                                disabled: k.value
                              }, null, 40, xd),
                              x("label", {
                                for: `form-${R.name}-${Pe.trim()}`,
                                class: "radio-label"
                              }, ae(Pe.trim()), 9, Sd)
                            ]))), 128))
                          ])) : le("", !0),
                          y.value[R.name] ? (P(), $("div", Cd, ae(y.value[R.name]), 1)) : le("", !0)
                        ]);
                      }), 128))
                    ]),
                    x("div", Td, [
                      x("button", {
                        onClick: () => {
                          var R;
                          console.log("Regular form submit button clicked!"), Ll((R = p.attributes) == null ? void 0 : R.form_data);
                        },
                        disabled: k.value,
                        class: "form-submit-button",
                        style: be(D(w))
                      }, ae(k.value ? "Submitting..." : ((ci = (ai = p.attributes) == null ? void 0 : ai.form_data) == null ? void 0 : ci.submit_button_text) || "Submit"), 13, Ed)
                    ])
                  ])) : p.message_type === "user_input" ? (P(), $("div", Ad, [
                    (ui = p.attributes) != null && ui.prompt_message && p.attributes.prompt_message.trim() ? (P(), $("div", Rd, ae(p.attributes.prompt_message), 1)) : le("", !0),
                    p.isSubmitted ? (P(), $("div", Pd, [
                      v[20] || (v[20] = x("strong", null, "Your input:", -1)),
                      yt(" " + ae(p.submittedValue) + " ", 1),
                      (fi = p.attributes) != null && fi.confirmation_message && p.attributes.confirmation_message.trim() ? (P(), $("div", $d, ae(p.attributes.confirmation_message), 1)) : le("", !0)
                    ])) : (P(), $("div", Id, [
                      rn(x("textarea", {
                        "onUpdate:modelValue": (R) => p.userInputValue = R,
                        class: "user-input-textarea",
                        placeholder: "Type your message here...",
                        rows: "3",
                        onKeydown: [
                          Ui(Hi((R) => Ns(p), ["ctrl"]), ["enter"]),
                          Ui(Hi((R) => Ns(p), ["meta"]), ["enter"])
                        ]
                      }, null, 40, Od), [
                        [an, p.userInputValue]
                      ]),
                      x("button", {
                        class: "user-input-submit-button",
                        onClick: (R) => Ns(p),
                        disabled: !p.userInputValue || !p.userInputValue.trim()
                      }, " Submit ", 8, Ld)
                    ]))
                  ])) : p.shopify_output || p.message_type === "product" ? (P(), $("div", Fd, [
                    p.message ? (P(), $("div", {
                      key: 0,
                      innerHTML: D(ue)(Nl(p.message), { renderer: D(t) }),
                      class: "product-message-text"
                    }, null, 8, Nd)) : le("", !0),
                    (hi = p.shopify_output) != null && hi.products && p.shopify_output.products.length > 0 ? (P(), $("div", Bd, [
                      v[22] || (v[22] = x("h3", { class: "carousel-title" }, "Products", -1)),
                      x("div", Md, [
                        (P(!0), $(Ne, null, xt(p.shopify_output.products, (R) => {
                          var zt;
                          return P(), $("div", {
                            key: R.id,
                            class: "product-card-compact carousel-item"
                          }, [
                            (zt = R.image) != null && zt.src ? (P(), $("div", Dd, [
                              x("img", {
                                src: R.image.src,
                                alt: R.title,
                                class: "product-thumbnail"
                              }, null, 8, qd)
                            ])) : le("", !0),
                            x("div", Vd, [
                              x("div", Hd, [
                                x("div", Ud, ae(R.title), 1),
                                R.variant_title && R.variant_title !== "Default Title" ? (P(), $("div", jd, ae(R.variant_title), 1)) : le("", !0),
                                x("div", Wd, ae(R.price_formatted || `₹${R.price}`), 1)
                              ]),
                              x("div", zd, [
                                x("button", {
                                  class: "view-details-button-compact",
                                  onClick: (Bs) => Fl(R.id)
                                }, v[21] || (v[21] = [
                                  yt(" View product ", -1),
                                  x("span", { class: "external-link-icon" }, "↗", -1)
                                ]), 8, Kd)
                              ])
                            ])
                          ]);
                        }), 128))
                      ])
                    ])) : (di = p.shopify_output) != null && di.products && p.shopify_output.products.length === 0 ? (P(), $("div", Zd, v[23] || (v[23] = [
                      x("p", null, "No products found.", -1)
                    ]))) : p.shopify_output && !p.shopify_output.products ? (P(), $("div", Gd, v[24] || (v[24] = [
                      x("p", null, "No products to display.", -1)
                    ]))) : le("", !0)
                  ])) : (P(), $("div", {
                    key: 4,
                    innerHTML: D(ue)(p.message, { renderer: D(t) })
                  }, null, 8, Yd))
                ], 4),
                x("div", Jd, [
                  p.message_type === "user" ? (P(), $("span", Qd, " You ")) : le("", !0)
                ])
              ], 2);
            }), 128)),
            D(f) ? (P(), $("div", Xd, v[25] || (v[25] = [
              x("div", { class: "dot" }, null, -1),
              x("div", { class: "dot" }, null, -1),
              x("div", { class: "dot" }, null, -1)
            ]))) : le("", !0)
          ], 512),
          Ie.value ? (P(), $("div", {
            key: 4,
            class: "new-conversation-section",
            style: be(D(g))
          }, [
            x("div", ip, [
              v[27] || (v[27] = x("p", { class: "ended-text" }, "This chat has ended.", -1)),
              x("button", {
                class: "start-new-conversation-button",
                style: be(D(w)),
                onClick: ql
              }, " Click here to start a new conversation ", 4)
            ])
          ], 4)) : (P(), $("div", {
            key: 3,
            class: Le(["chat-input", { "ask-anything-input": ut.value }]),
            style: be(D(g))
          }, [
            !D(N) && !X.value && !ut.value ? (P(), $("div", ep, [
              rn(x("input", {
                "onUpdate:modelValue": v[3] || (v[3] = (p) => se.value = p),
                type: "email",
                placeholder: "Enter your email address to begin",
                disabled: D(f) || D(q) !== "connected",
                class: Le({
                  invalid: se.value.trim() && !D(Tn)(se.value.trim()),
                  disabled: D(q) !== "connected"
                })
              }, null, 10, tp), [
                [an, se.value]
              ])
            ])) : le("", !0),
            x("div", np, [
              rn(x("input", {
                "onUpdate:modelValue": v[4] || (v[4] = (p) => Ve.value = p),
                type: "text",
                placeholder: L.value,
                onKeypress: U,
                onInput: re,
                onChange: re,
                disabled: !O.value,
                class: Le({ disabled: !O.value, "ask-anything-field": ut.value })
              }, null, 42, sp), [
                [an, Ve.value]
              ]),
              x("button", {
                class: Le(["send-button", { "ask-anything-send": ut.value }]),
                style: be(D(w)),
                onClick: E,
                disabled: !Ve.value.trim() || !O.value
              }, v[26] || (v[26] = [
                x("svg", {
                  width: "20",
                  height: "20",
                  viewBox: "0 0 24 24",
                  fill: "none",
                  xmlns: "http://www.w3.org/2000/svg"
                }, [
                  x("path", {
                    d: "M5 12L3 21L21 12L3 3L5 12ZM5 12L13 12",
                    stroke: "currentColor",
                    "stroke-width": "2",
                    "stroke-linecap": "round",
                    "stroke-linejoin": "round"
                  })
                ], -1)
              ]), 14, rp)
            ])
          ], 6)),
          x("div", {
            class: "powered-by",
            style: be(D(C))
          }, v[28] || (v[28] = [
            x("svg", {
              class: "chattermate-logo",
              width: "16",
              height: "16",
              viewBox: "0 0 60 60",
              fill: "none",
              xmlns: "http://www.w3.org/2000/svg"
            }, [
              x("path", {
                d: "M45 15H15C13.3431 15 12 16.3431 12 18V42C12 43.6569 13.3431 45 15 45H25L30 52L35 45H45C46.6569 45 48 43.6569 48 42V18C48 16.3431 46.6569 15 45 15Z",
                fill: "currentColor",
                opacity: "0.8"
              }),
              x("path", {
                d: "M36 27C36 27 32.5 26 30 26C27.5 26 24 27 24 31C24 35 27.5 36 30 36C32.5 36 36 35 36 35V33C36 33 33 34 31.5 34C30 34 27 33 27 31C27 29 30 28 31.5 28C33 28 36 29 36 29V27Z",
                fill: "currentColor"
              })
            ], -1),
            yt(" Powered by ChatterMate ", -1)
          ]), 4)
        ], 6)) : le("", !0)
      ], 64)),
      ge.value ? (P(), $("div", op, [
        x("div", lp, [
          v[29] || (v[29] = x("h3", null, "Rate your conversation", -1)),
          x("div", ap, [
            (P(), $(Ne, null, xt(5, (p) => x("button", {
              key: p,
              onClick: (Z) => ie.value = p,
              class: Le([{ active: p <= ie.value }, "star-button"])
            }, " ★ ", 10, cp)), 64))
          ]),
          rn(x("textarea", {
            "onUpdate:modelValue": v[5] || (v[5] = (p) => Fe.value = p),
            placeholder: "Additional feedback (optional)",
            class: "rating-feedback"
          }, null, 512), [
            [an, Fe.value]
          ]),
          x("div", up, [
            x("button", {
              onClick: v[6] || (v[6] = (p) => m.submitRating(ie.value, Fe.value)),
              disabled: !ie.value,
              class: "submit-button",
              style: be(D(w))
            }, " Submit ", 12, fp),
            x("button", {
              onClick: v[7] || (v[7] = (p) => ge.value = !1),
              class: "skip-rating"
            }, " Skip ")
          ])
        ])
      ])) : le("", !0)
    ], 6));
  }
}), dp = (e, t) => {
  const n = e.__vccOpts || e;
  for (const [s, r] of t)
    n[s] = r;
  return n;
}, pp = /* @__PURE__ */ dp(hp, [["__scopeId", "data-v-d4752b97"]]);
window.process || (window.process = { env: { NODE_ENV: "production" } });
const gp = new URL(window.location.href), mp = gp.searchParams.get("widget_id"), _p = fu(pp, {
  widgetId: mp
});
_p.mount("#app");
