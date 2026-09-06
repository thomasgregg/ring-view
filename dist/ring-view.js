const F = globalThis, re = F.ShadowRoot && (F.ShadyCSS === void 0 || F.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, se = /* @__PURE__ */ Symbol(), ue = /* @__PURE__ */ new WeakMap();
let Le = class {
  constructor(e, i, r) {
    if (this._$cssResult$ = !0, r !== se) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = e, this.t = i;
  }
  get styleSheet() {
    let e = this.o;
    const i = this.t;
    if (re && e === void 0) {
      const r = i !== void 0 && i.length === 1;
      r && (e = ue.get(i)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), r && ue.set(i, e));
    }
    return e;
  }
  toString() {
    return this.cssText;
  }
};
const je = (t) => new Le(typeof t == "string" ? t : t + "", void 0, se), Z = (t, ...e) => {
  const i = t.length === 1 ? t[0] : e.reduce((r, s, n) => r + ((a) => {
    if (a._$cssResult$ === !0) return a.cssText;
    if (typeof a == "number") return a;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + a + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(s) + t[n + 1], t[0]);
  return new Le(i, t, se);
}, Fe = (t, e) => {
  if (re) t.adoptedStyleSheets = e.map((i) => i instanceof CSSStyleSheet ? i : i.styleSheet);
  else for (const i of e) {
    const r = document.createElement("style"), s = F.litNonce;
    s !== void 0 && r.setAttribute("nonce", s), r.textContent = i.cssText, t.appendChild(r);
  }
}, pe = re ? (t) => t : (t) => t instanceof CSSStyleSheet ? ((e) => {
  let i = "";
  for (const r of e.cssRules) i += r.cssText;
  return je(i);
})(t) : t;
const { is: qe, defineProperty: We, getOwnPropertyDescriptor: Ge, getOwnPropertyNames: Ze, getOwnPropertySymbols: Ye, getPrototypeOf: Xe } = Object, Y = globalThis, ve = Y.trustedTypes, Je = ve ? ve.emptyScript : "", Qe = Y.reactiveElementPolyfillSupport, z = (t, e) => t, q = { toAttribute(t, e) {
  switch (e) {
    case Boolean:
      t = t ? Je : null;
      break;
    case Object:
    case Array:
      t = t == null ? t : JSON.stringify(t);
  }
  return t;
}, fromAttribute(t, e) {
  let i = t;
  switch (e) {
    case Boolean:
      i = t !== null;
      break;
    case Number:
      i = t === null ? null : Number(t);
      break;
    case Object:
    case Array:
      try {
        i = JSON.parse(t);
      } catch {
        i = null;
      }
  }
  return i;
} }, ne = (t, e) => !qe(t, e), me = { attribute: !0, type: String, converter: q, reflect: !1, useDefault: !1, hasChanged: ne };
Symbol.metadata ??= /* @__PURE__ */ Symbol("metadata"), Y.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
let M = class extends HTMLElement {
  static addInitializer(e) {
    this._$Ei(), (this.l ??= []).push(e);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(e, i = me) {
    if (i.state && (i.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((i = Object.create(i)).wrapped = !0), this.elementProperties.set(e, i), !i.noAccessor) {
      const r = /* @__PURE__ */ Symbol(), s = this.getPropertyDescriptor(e, r, i);
      s !== void 0 && We(this.prototype, e, s);
    }
  }
  static getPropertyDescriptor(e, i, r) {
    const { get: s, set: n } = Ge(this.prototype, e) ?? { get() {
      return this[i];
    }, set(a) {
      this[i] = a;
    } };
    return { get: s, set(a) {
      const l = s?.call(this);
      n?.call(this, a), this.requestUpdate(e, l, r);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(e) {
    return this.elementProperties.get(e) ?? me;
  }
  static _$Ei() {
    if (this.hasOwnProperty(z("elementProperties"))) return;
    const e = Xe(this);
    e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(z("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(z("properties"))) {
      const i = this.properties, r = [...Ze(i), ...Ye(i)];
      for (const s of r) this.createProperty(s, i[s]);
    }
    const e = this[Symbol.metadata];
    if (e !== null) {
      const i = litPropertyMetadata.get(e);
      if (i !== void 0) for (const [r, s] of i) this.elementProperties.set(r, s);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [i, r] of this.elementProperties) {
      const s = this._$Eu(i, r);
      s !== void 0 && this._$Eh.set(s, i);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(e) {
    const i = [];
    if (Array.isArray(e)) {
      const r = new Set(e.flat(1 / 0).reverse());
      for (const s of r) i.unshift(pe(s));
    } else e !== void 0 && i.push(pe(e));
    return i;
  }
  static _$Eu(e, i) {
    const r = i.attribute;
    return r === !1 ? void 0 : typeof r == "string" ? r : typeof e == "string" ? e.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    this._$ES = new Promise((e) => this.enableUpdating = e), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), this.constructor.l?.forEach((e) => e(this));
  }
  addController(e) {
    (this._$EO ??= /* @__PURE__ */ new Set()).add(e), this.renderRoot !== void 0 && this.isConnected && e.hostConnected?.();
  }
  removeController(e) {
    this._$EO?.delete(e);
  }
  _$E_() {
    const e = /* @__PURE__ */ new Map(), i = this.constructor.elementProperties;
    for (const r of i.keys()) this.hasOwnProperty(r) && (e.set(r, this[r]), delete this[r]);
    e.size > 0 && (this._$Ep = e);
  }
  createRenderRoot() {
    const e = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return Fe(e, this.constructor.elementStyles), e;
  }
  connectedCallback() {
    this.renderRoot ??= this.createRenderRoot(), this.enableUpdating(!0), this._$EO?.forEach((e) => e.hostConnected?.());
  }
  enableUpdating(e) {
  }
  disconnectedCallback() {
    this._$EO?.forEach((e) => e.hostDisconnected?.());
  }
  attributeChangedCallback(e, i, r) {
    this._$AK(e, r);
  }
  _$ET(e, i) {
    const r = this.constructor.elementProperties.get(e), s = this.constructor._$Eu(e, r);
    if (s !== void 0 && r.reflect === !0) {
      const n = (r.converter?.toAttribute !== void 0 ? r.converter : q).toAttribute(i, r.type);
      this._$Em = e, n == null ? this.removeAttribute(s) : this.setAttribute(s, n), this._$Em = null;
    }
  }
  _$AK(e, i) {
    const r = this.constructor, s = r._$Eh.get(e);
    if (s !== void 0 && this._$Em !== s) {
      const n = r.getPropertyOptions(s), a = typeof n.converter == "function" ? { fromAttribute: n.converter } : n.converter?.fromAttribute !== void 0 ? n.converter : q;
      this._$Em = s;
      const l = a.fromAttribute(i, n.type);
      this[s] = l ?? this._$Ej?.get(s) ?? l, this._$Em = null;
    }
  }
  requestUpdate(e, i, r, s = !1, n) {
    if (e !== void 0) {
      const a = this.constructor;
      if (s === !1 && (n = this[e]), r ??= a.getPropertyOptions(e), !((r.hasChanged ?? ne)(n, i) || r.useDefault && r.reflect && n === this._$Ej?.get(e) && !this.hasAttribute(a._$Eu(e, r)))) return;
      this.C(e, i, r);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(e, i, { useDefault: r, reflect: s, wrapped: n }, a) {
    r && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(e) && (this._$Ej.set(e, a ?? i ?? this[e]), n !== !0 || a !== void 0) || (this._$AL.has(e) || (this.hasUpdated || r || (i = void 0), this._$AL.set(e, i)), s === !0 && this._$Em !== e && (this._$Eq ??= /* @__PURE__ */ new Set()).add(e));
  }
  async _$EP() {
    this.isUpdatePending = !0;
    try {
      await this._$ES;
    } catch (i) {
      Promise.reject(i);
    }
    const e = this.scheduleUpdate();
    return e != null && await e, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if (this.renderRoot ??= this.createRenderRoot(), this._$Ep) {
        for (const [s, n] of this._$Ep) this[s] = n;
        this._$Ep = void 0;
      }
      const r = this.constructor.elementProperties;
      if (r.size > 0) for (const [s, n] of r) {
        const { wrapped: a } = n, l = this[s];
        a !== !0 || this._$AL.has(s) || l === void 0 || this.C(s, void 0, n, l);
      }
    }
    let e = !1;
    const i = this._$AL;
    try {
      e = this.shouldUpdate(i), e ? (this.willUpdate(i), this._$EO?.forEach((r) => r.hostUpdate?.()), this.update(i)) : this._$EM();
    } catch (r) {
      throw e = !1, this._$EM(), r;
    }
    e && this._$AE(i);
  }
  willUpdate(e) {
  }
  _$AE(e) {
    this._$EO?.forEach((i) => i.hostUpdated?.()), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(e)), this.updated(e);
  }
  _$EM() {
    this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = !1;
  }
  get updateComplete() {
    return this.getUpdateComplete();
  }
  getUpdateComplete() {
    return this._$ES;
  }
  shouldUpdate(e) {
    return !0;
  }
  update(e) {
    this._$Eq &&= this._$Eq.forEach((i) => this._$ET(i, this[i])), this._$EM();
  }
  updated(e) {
  }
  firstUpdated(e) {
  }
};
M.elementStyles = [], M.shadowRootOptions = { mode: "open" }, M[z("elementProperties")] = /* @__PURE__ */ new Map(), M[z("finalized")] = /* @__PURE__ */ new Map(), Qe?.({ ReactiveElement: M }), (Y.reactiveElementVersions ??= []).push("2.1.2");
const ae = globalThis, fe = (t) => t, W = ae.trustedTypes, ge = W ? W.createPolicy("lit-html", { createHTML: (t) => t }) : void 0, Me = "$lit$", E = `lit$${Math.random().toFixed(9).slice(2)}$`, Te = "?" + E, et = `<${Te}>`, L = document, V = () => L.createComment(""), U = (t) => t === null || typeof t != "object" && typeof t != "function", oe = Array.isArray, tt = (t) => oe(t) || typeof t?.[Symbol.iterator] == "function", Q = `[ 	
\f\r]`, H = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, _e = /-->/g, we = />/g, P = RegExp(`>|${Q}(?:([^\\s"'>=/]+)(${Q}*=${Q}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), be = /'/g, ye = /"/g, Oe = /^(?:script|style|textarea|title)$/i, it = (t) => (e, ...i) => ({ _$litType$: t, strings: e, values: i }), u = it(1), S = /* @__PURE__ */ Symbol.for("lit-noChange"), c = /* @__PURE__ */ Symbol.for("lit-nothing"), $e = /* @__PURE__ */ new WeakMap(), R = L.createTreeWalker(L, 129);
function Ie(t, e) {
  if (!oe(t) || !t.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return ge !== void 0 ? ge.createHTML(e) : e;
}
const rt = (t, e) => {
  const i = t.length - 1, r = [];
  let s, n = e === 2 ? "<svg>" : e === 3 ? "<math>" : "", a = H;
  for (let l = 0; l < i; l++) {
    const d = t[l];
    let p, v, h = -1, w = 0;
    for (; w < d.length && (a.lastIndex = w, v = a.exec(d), v !== null); ) w = a.lastIndex, a === H ? v[1] === "!--" ? a = _e : v[1] !== void 0 ? a = we : v[2] !== void 0 ? (Oe.test(v[2]) && (s = RegExp("</" + v[2], "g")), a = P) : v[3] !== void 0 && (a = P) : a === P ? v[0] === ">" ? (a = s ?? H, h = -1) : v[1] === void 0 ? h = -2 : (h = a.lastIndex - v[2].length, p = v[1], a = v[3] === void 0 ? P : v[3] === '"' ? ye : be) : a === ye || a === be ? a = P : a === _e || a === we ? a = H : (a = P, s = void 0);
    const y = a === P && t[l + 1].startsWith("/>") ? " " : "";
    n += a === H ? d + et : h >= 0 ? (r.push(p), d.slice(0, h) + Me + d.slice(h) + E + y) : d + E + (h === -2 ? l : y);
  }
  return [Ie(t, n + (t[i] || "<?>") + (e === 2 ? "</svg>" : e === 3 ? "</math>" : "")), r];
};
class D {
  constructor({ strings: e, _$litType$: i }, r) {
    let s;
    this.parts = [];
    let n = 0, a = 0;
    const l = e.length - 1, d = this.parts, [p, v] = rt(e, i);
    if (this.el = D.createElement(p, r), R.currentNode = this.el.content, i === 2 || i === 3) {
      const h = this.el.content.firstChild;
      h.replaceWith(...h.childNodes);
    }
    for (; (s = R.nextNode()) !== null && d.length < l; ) {
      if (s.nodeType === 1) {
        if (s.hasAttributes()) for (const h of s.getAttributeNames()) if (h.endsWith(Me)) {
          const w = v[a++], y = s.getAttribute(h).split(E), j = /([.?@])?(.*)/.exec(w);
          d.push({ type: 1, index: n, name: j[2], strings: y, ctor: j[1] === "." ? nt : j[1] === "?" ? at : j[1] === "@" ? ot : X }), s.removeAttribute(h);
        } else h.startsWith(E) && (d.push({ type: 6, index: n }), s.removeAttribute(h));
        if (Oe.test(s.tagName)) {
          const h = s.textContent.split(E), w = h.length - 1;
          if (w > 0) {
            s.textContent = W ? W.emptyScript : "";
            for (let y = 0; y < w; y++) s.append(h[y], V()), R.nextNode(), d.push({ type: 2, index: ++n });
            s.append(h[w], V());
          }
        }
      } else if (s.nodeType === 8) if (s.data === Te) d.push({ type: 2, index: n });
      else {
        let h = -1;
        for (; (h = s.data.indexOf(E, h + 1)) !== -1; ) d.push({ type: 7, index: n }), h += E.length - 1;
      }
      n++;
    }
  }
  static createElement(e, i) {
    const r = L.createElement("template");
    return r.innerHTML = e, r;
  }
}
function O(t, e, i = t, r) {
  if (e === S) return e;
  let s = r !== void 0 ? i._$Co?.[r] : i._$Cl;
  const n = U(e) ? void 0 : e._$litDirective$;
  return s?.constructor !== n && (s?._$AO?.(!1), n === void 0 ? s = void 0 : (s = new n(t), s._$AT(t, i, r)), r !== void 0 ? (i._$Co ??= [])[r] = s : i._$Cl = s), s !== void 0 && (e = O(t, s._$AS(t, e.values), s, r)), e;
}
class st {
  constructor(e, i) {
    this._$AV = [], this._$AN = void 0, this._$AD = e, this._$AM = i;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(e) {
    const { el: { content: i }, parts: r } = this._$AD, s = (e?.creationScope ?? L).importNode(i, !0);
    R.currentNode = s;
    let n = R.nextNode(), a = 0, l = 0, d = r[0];
    for (; d !== void 0; ) {
      if (a === d.index) {
        let p;
        d.type === 2 ? p = new B(n, n.nextSibling, this, e) : d.type === 1 ? p = new d.ctor(n, d.name, d.strings, this, e) : d.type === 6 && (p = new dt(n, this, e)), this._$AV.push(p), d = r[++l];
      }
      a !== d?.index && (n = R.nextNode(), a++);
    }
    return R.currentNode = L, s;
  }
  p(e) {
    let i = 0;
    for (const r of this._$AV) r !== void 0 && (r.strings !== void 0 ? (r._$AI(e, r, i), i += r.strings.length - 2) : r._$AI(e[i])), i++;
  }
}
class B {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(e, i, r, s) {
    this.type = 2, this._$AH = c, this._$AN = void 0, this._$AA = e, this._$AB = i, this._$AM = r, this.options = s, this._$Cv = s?.isConnected ?? !0;
  }
  get parentNode() {
    let e = this._$AA.parentNode;
    const i = this._$AM;
    return i !== void 0 && e?.nodeType === 11 && (e = i.parentNode), e;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(e, i = this) {
    e = O(this, e, i), U(e) ? e === c || e == null || e === "" ? (this._$AH !== c && this._$AR(), this._$AH = c) : e !== this._$AH && e !== S && this._(e) : e._$litType$ !== void 0 ? this.$(e) : e.nodeType !== void 0 ? this.T(e) : tt(e) ? this.k(e) : this._(e);
  }
  O(e) {
    return this._$AA.parentNode.insertBefore(e, this._$AB);
  }
  T(e) {
    this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
  }
  _(e) {
    this._$AH !== c && U(this._$AH) ? this._$AA.nextSibling.data = e : this.T(L.createTextNode(e)), this._$AH = e;
  }
  $(e) {
    const { values: i, _$litType$: r } = e, s = typeof r == "number" ? this._$AC(e) : (r.el === void 0 && (r.el = D.createElement(Ie(r.h, r.h[0]), this.options)), r);
    if (this._$AH?._$AD === s) this._$AH.p(i);
    else {
      const n = new st(s, this), a = n.u(this.options);
      n.p(i), this.T(a), this._$AH = n;
    }
  }
  _$AC(e) {
    let i = $e.get(e.strings);
    return i === void 0 && $e.set(e.strings, i = new D(e)), i;
  }
  k(e) {
    oe(this._$AH) || (this._$AH = [], this._$AR());
    const i = this._$AH;
    let r, s = 0;
    for (const n of e) s === i.length ? i.push(r = new B(this.O(V()), this.O(V()), this, this.options)) : r = i[s], r._$AI(n), s++;
    s < i.length && (this._$AR(r && r._$AB.nextSibling, s), i.length = s);
  }
  _$AR(e = this._$AA.nextSibling, i) {
    for (this._$AP?.(!1, !0, i); e !== this._$AB; ) {
      const r = fe(e).nextSibling;
      fe(e).remove(), e = r;
    }
  }
  setConnected(e) {
    this._$AM === void 0 && (this._$Cv = e, this._$AP?.(e));
  }
}
class X {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(e, i, r, s, n) {
    this.type = 1, this._$AH = c, this._$AN = void 0, this.element = e, this.name = i, this._$AM = s, this.options = n, r.length > 2 || r[0] !== "" || r[1] !== "" ? (this._$AH = Array(r.length - 1).fill(new String()), this.strings = r) : this._$AH = c;
  }
  _$AI(e, i = this, r, s) {
    const n = this.strings;
    let a = !1;
    if (n === void 0) e = O(this, e, i, 0), a = !U(e) || e !== this._$AH && e !== S, a && (this._$AH = e);
    else {
      const l = e;
      let d, p;
      for (e = n[0], d = 0; d < n.length - 1; d++) p = O(this, l[r + d], i, d), p === S && (p = this._$AH[d]), a ||= !U(p) || p !== this._$AH[d], p === c ? e = c : e !== c && (e += (p ?? "") + n[d + 1]), this._$AH[d] = p;
    }
    a && !s && this.j(e);
  }
  j(e) {
    e === c ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
  }
}
class nt extends X {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(e) {
    this.element[this.name] = e === c ? void 0 : e;
  }
}
class at extends X {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(e) {
    this.element.toggleAttribute(this.name, !!e && e !== c);
  }
}
class ot extends X {
  constructor(e, i, r, s, n) {
    super(e, i, r, s, n), this.type = 5;
  }
  _$AI(e, i = this) {
    if ((e = O(this, e, i, 0) ?? c) === S) return;
    const r = this._$AH, s = e === c && r !== c || e.capture !== r.capture || e.once !== r.once || e.passive !== r.passive, n = e !== c && (r === c || s);
    s && this.element.removeEventListener(this.name, this, r), n && this.element.addEventListener(this.name, this, e), this._$AH = e;
  }
  handleEvent(e) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, e) : this._$AH.handleEvent(e);
  }
}
class dt {
  constructor(e, i, r) {
    this.element = e, this.type = 6, this._$AN = void 0, this._$AM = i, this.options = r;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(e) {
    O(this, e);
  }
}
const lt = ae.litHtmlPolyfillSupport;
lt?.(D, B), (ae.litHtmlVersions ??= []).push("3.3.3");
const ct = (t, e, i) => {
  const r = i?.renderBefore ?? e;
  let s = r._$litPart$;
  if (s === void 0) {
    const n = i?.renderBefore ?? null;
    r._$litPart$ = s = new B(e.insertBefore(V(), n), n, void 0, i ?? {});
  }
  return s._$AI(t), s;
};
const de = globalThis;
let x = class extends M {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    const e = super.createRenderRoot();
    return this.renderOptions.renderBefore ??= e.firstChild, e;
  }
  update(e) {
    const i = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = ct(i, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    super.connectedCallback(), this._$Do?.setConnected(!0);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._$Do?.setConnected(!1);
  }
  render() {
    return S;
  }
};
x._$litElement$ = !0, x.finalized = !0, de.litElementHydrateSupport?.({ LitElement: x });
const ht = de.litElementPolyfillSupport;
ht?.({ LitElement: x });
(de.litElementVersions ??= []).push("4.2.2");
const He = { ATTRIBUTE: 1 }, le = (t) => (...e) => ({ _$litDirective$: t, values: e });
let ce = class {
  constructor(e) {
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AT(e, i, r) {
    this._$Ct = e, this._$AM = i, this._$Ci = r;
  }
  _$AS(e, i) {
    return this.update(e, i);
  }
  update(e, i) {
    return this.render(...i);
  }
};
const ze = "important", ut = " !" + ze, Ve = le(class extends ce {
  constructor(t) {
    if (super(t), t.type !== He.ATTRIBUTE || t.name !== "style" || t.strings?.length > 2) throw Error("The `styleMap` directive must be used in the `style` attribute and must be the only part in the attribute.");
  }
  render(t) {
    return Object.keys(t).reduce((e, i) => {
      const r = t[i];
      return r == null ? e : e + `${i = i.includes("-") ? i : i.replace(/(?:^(webkit|moz|ms|o)|)(?=[A-Z])/g, "-$&").toLowerCase()}:${r};`;
    }, "");
  }
  update(t, [e]) {
    const { style: i } = t.element;
    if (this.ft === void 0) return this.ft = new Set(Object.keys(e)), this.render(e);
    for (const r of this.ft) e[r] == null && (this.ft.delete(r), r.includes("-") ? i.removeProperty(r) : i[r] = null);
    for (const r in e) {
      const s = e[r];
      if (s != null) {
        this.ft.add(r);
        const n = typeof s == "string" && s.endsWith(ut);
        r.includes("-") || n ? i.setProperty(r, n ? s.slice(0, -11) : s, n ? ze : "") : i[r] = s;
      }
    }
    return S;
  }
});
const J = (t) => (e, i) => {
  i !== void 0 ? i.addInitializer(() => {
    customElements.define(t, e);
  }) : customElements.define(t, e);
};
const pt = { attribute: !0, type: String, converter: q, reflect: !1, hasChanged: ne }, vt = (t = pt, e, i) => {
  const { kind: r, metadata: s } = i;
  let n = globalThis.litPropertyMetadata.get(s);
  if (n === void 0 && globalThis.litPropertyMetadata.set(s, n = /* @__PURE__ */ new Map()), r === "setter" && ((t = Object.create(t)).wrapped = !0), n.set(i.name, t), r === "accessor") {
    const { name: a } = i;
    return { set(l) {
      const d = e.get.call(this);
      e.set.call(this, l), this.requestUpdate(a, d, t, !0, l);
    }, init(l) {
      return l !== void 0 && this.C(a, void 0, t, l), l;
    } };
  }
  if (r === "setter") {
    const { name: a } = i;
    return function(l) {
      const d = this[a];
      e.call(this, l), this.requestUpdate(a, d, t, !0, l);
    };
  }
  throw Error("Unsupported decorator location: " + r);
};
function _(t) {
  return (e, i) => typeof i == "object" ? vt(t, e, i) : ((r, s, n) => {
    const a = s.hasOwnProperty(n);
    return s.constructor.createProperty(n, r), a ? Object.getOwnPropertyDescriptor(s, n) : void 0;
  })(t, e, i);
}
function m(t) {
  return _({ ...t, state: !0, attribute: !1 });
}
const mt = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900" role="img" aria-label="Synthetic camera preview">
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#8fb6c9"/>
      <stop offset="1" stop-color="#d8d0bd"/>
    </linearGradient>
    <linearGradient id="ground" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#6f8068"/>
      <stop offset="1" stop-color="#445641"/>
    </linearGradient>
    <filter id="soft" x="-30%" y="-30%" width="160%" height="160%">
      <feDropShadow dx="0" dy="14" stdDeviation="20" flood-opacity=".24"/>
    </filter>
  </defs>
  <rect width="1600" height="900" fill="url(#sky)"/>
  <rect y="570" width="1600" height="330" fill="url(#ground)"/>
  <path d="M490 900 690 560h210l220 340z" fill="#c6c1b6"/>
  <rect x="245" y="215" width="1110" height="470" rx="12" fill="#c8c0b1" filter="url(#soft)"/>
  <rect x="650" y="285" width="300" height="400" fill="#35464d"/>
  <rect x="686" y="325" width="228" height="188" rx="5" fill="#85aab5"/>
  <path d="M800 325v188M686 419h228" stroke="#d7e2e2" stroke-width="12" opacity=".72"/>
  <circle cx="894" cy="565" r="14" fill="#d8b64e"/>
  <g fill="#344d34">
    <circle cx="315" cy="600" r="120"/><circle cx="455" cy="635" r="95"/>
    <circle cx="1230" cy="595" r="125"/><circle cx="1370" cy="640" r="100"/>
  </g>
  <g opacity=".16" stroke="#fff" stroke-width="2">
    <path d="M0 140h1600M0 300h1600M0 460h1600M0 620h1600M0 780h1600"/>
    <path d="M200 0v900M600 0v900M1000 0v900M1400 0v900"/>
  </g>
</svg>
`, ft = {
  "common.camera": "Kamera",
  "common.close": "Schließen",
  "common.last_recording": "Letzte Aufnahme",
  "common.live": "Live",
  "common.optional": "optional",
  "common.retry": "Erneut versuchen",
  "editor.recording_entity": "Kamera für letzte Aufnahme",
  "editor.live_entity": "Live-Kamera",
  "editor.viewer_behavior": "Anzeigeverhalten",
  "editor.default_mode": "Ansicht öffnen mit",
  "editor.remember_last_mode": "Zuletzt gewählte Ansicht merken",
  "editor.autoplay_recording": "Aufnahme automatisch abspielen",
  "editor.live_muted": "Live-Audio stumm starten",
  "editor.card_appearance": "Kartendarstellung",
  "editor.name": "Kameraname",
  "editor.show_name": "Kameranamen anzeigen",
  "editor.preview_source": "Vorschaubild der Karte",
  "editor.aspect_ratio": "Bildformat",
  "editor.fit_mode": "Bildanpassung",
  "editor.helper_default_mode": "Beim direkten Öffnen der Live-Ansicht wird eine Ring-Live-Sitzung gestartet.",
  "editor.helper_remember_last_mode": "Verwendet die zuletzt gewählte Ansicht anstelle der Startansicht.",
  "editor.helper_autoplay_recording": "Deaktivieren, um vor dem Laden der Aufnahme eine Wiedergabetaste anzuzeigen.",
  "editor.helper_live_muted": "Deaktiviert lassen, um – sofern vom Browser erlaubt – mit Ton zu starten.",
  "editor.helper_show_name": "Wird oben links auf der Karte und in der Kameraansicht angezeigt.",
  "editor.helper_preview_source": "Verwendet immer ein Standbild und bindet auf dem Dashboard keinen Livestream ein.",
  "editor.preview_recording": "Standbild der letzten Aufnahme",
  "editor.preview_live": "Standbild der Live-Kamera",
  "editor.preview_default": "Der Startansicht folgen",
  "editor.aspect_widescreen": "Breitbild (16:9)",
  "editor.aspect_standard": "Standard (4:3)",
  "editor.aspect_square": "Quadratisch (1:1)",
  "editor.aspect_auto": "Automatisch",
  "editor.fit_cover": "Zuschneiden und ausfüllen",
  "editor.fit_contain": "Gesamtes Bild einpassen",
  "editor.warnings": "Konfigurationswarnungen",
  "card.open_viewer": "Kameraansicht „{name}“ öffnen — {mode}",
  "card.open_live": "Live-Ansicht öffnen",
  "card.open_recording": "Letzte Aufnahme öffnen",
  "card.preview_alt": "Vorschau für {name}",
  "card.preview_unavailable": "Kameravorschau nicht verfügbar",
  "card.description": "Letzte Aufnahme ansehen und einen separaten Live-Kamerastream starten.",
  "warning.unavailable": "{name} ist nicht verfügbar.",
  "warning.recording_media": "Die Kamera für die letzte Aufnahme liefert weder eine Aufnahme-URL noch ein verwendbares Kamerabild.",
  "warning.live_stream": "Die Live-Kamera meldet keine Unterstützung für Kamera-Streaming.",
  "warning.compatibility": "Die native Kamerakomponente von Home Assistant ist noch nicht geladen. Die Karte versucht, sie beim Öffnen zu laden.",
  "config.invalid": "Ungültige Kartenkonfiguration.",
  "config.entity_required": "{label} muss eine Kamera-Entität sein.",
  "config.recording_entity": "Entität für letzte Aufnahme",
  "config.live_entity": "Live-Kamera-Entität",
  "config.default_mode": "default_mode muss last_recording oder live sein.",
  "config.preview_source": "preview_source ist ungültig.",
  "config.aspect_ratio": "aspect_ratio ist ungültig.",
  "config.fit_mode": "fit_mode ist ungültig.",
  "viewer.close_aria": "Kameraansicht schließen",
  "viewer.camera_view": "Kameraansicht",
  "viewer.entity_unavailable": "Kamera-Entität ist nicht verfügbar.",
  "viewer.suspended": "Wiedergabe pausiert, solange dieser Tab ausgeblendet ist.",
  "viewer.connecting_live": "Ring-Live-Ansicht wird verbunden…",
  "viewer.loading_recording": "Letzte Aufnahme wird geladen…",
  "viewer.play_recording": "Letzte Aufnahme abspielen",
  "viewer.native_unavailable_title": "Native Kamerawiedergabe ist nicht verfügbar.",
  "viewer.native_unavailable_detail": "Diese Home-Assistant-Version stellt die erwartete Kamerakomponente nicht bereit.",
  "viewer.open_ha_camera": "Home-Assistant-Kamera öffnen",
  "viewer.live_failed": "Live-Ansicht konnte nicht gestartet werden.",
  "viewer.recording_unavailable": "Derzeit ist keine Ring-Aufnahme verfügbar.",
  "viewer.ring_protect": "Möglicherweise ist ein Ring-Protect-Abonnement erforderlich.",
  "viewer.switch_live": "Zu Live wechseln",
  "viewer.switch_recording": "Zur letzten Aufnahme wechseln",
  "viewer.mode_selected_live": "Live-Ansicht ausgewählt.",
  "viewer.mode_selected_recording": "Letzte Aufnahme ausgewählt.",
  "viewer.recording_loaded_muted": "Letzte Aufnahme geladen. Audio ist stummgeschaltet, weil der Browser die automatische Wiedergabe mit Ton blockiert hat.",
  "viewer.recording_loaded_audio": "Letzte Aufnahme geladen. Audio ist verfügbar.",
  "viewer.live_connected_audio": "Live-Ansicht verbunden. Audio ist verfügbar.",
  "viewer.live_connected_no_audio": "Live-Ansicht verbunden. Keine Audiospur erkannt.",
  "viewer.live_connected_muted": "Live-Ansicht verbunden. Audio ist stummgeschaltet.",
  "viewer.live_detecting_audio": "Live-Ansicht verbunden. Audiostatus wird noch ermittelt.",
  "viewer.trying_ha": "Wiedergabe über die Home-Assistant-Kamera wird versucht.",
  "viewer.recording_audio_blocked": "Der Browser hat das Audio der Aufnahme blockiert. Erneuter Versuch ohne Ton.",
  "viewer.live_audio_muted": "Live-Audio wurde stummgeschaltet, damit die Wiedergabe starten kann.",
  "viewer.retrying_live": "Ring-Live-Ansicht wird erneut versucht."
}, gt = {
  "common.camera": "Camera",
  "common.close": "Close",
  "common.last_recording": "Last recording",
  "common.live": "Live",
  "common.optional": "optional",
  "common.retry": "Retry",
  "editor.recording_entity": "Last recording camera",
  "editor.live_entity": "Live camera",
  "editor.viewer_behavior": "Viewer behavior",
  "editor.default_mode": "Open viewer on",
  "editor.remember_last_mode": "Remember last selected view",
  "editor.autoplay_recording": "Play recording automatically",
  "editor.live_muted": "Start live audio muted",
  "editor.card_appearance": "Card appearance",
  "editor.name": "Camera name",
  "editor.show_name": "Show camera name",
  "editor.preview_source": "Card preview image",
  "editor.aspect_ratio": "Image shape",
  "editor.fit_mode": "Image crop",
  "editor.helper_default_mode": "Opening directly on Live starts a Ring live session.",
  "editor.helper_remember_last_mode": "Uses the most recent choice instead of the opening view.",
  "editor.helper_autoplay_recording": "Turn off to show a Play button before loading the recording.",
  "editor.helper_live_muted": "Leave off to start with sound when the browser allows it.",
  "editor.helper_show_name": "Shown at the top left of both the card and viewer.",
  "editor.helper_preview_source": "Always uses a still image and never mounts a live stream on the dashboard.",
  "editor.preview_recording": "Last recording snapshot",
  "editor.preview_live": "Live camera snapshot",
  "editor.preview_default": "Follow opening view",
  "editor.aspect_widescreen": "Widescreen (16:9)",
  "editor.aspect_standard": "Standard (4:3)",
  "editor.aspect_square": "Square (1:1)",
  "editor.aspect_auto": "Automatic",
  "editor.fit_cover": "Crop to fill",
  "editor.fit_contain": "Fit entire image",
  "editor.warnings": "Configuration warnings",
  "card.open_viewer": "Open {name} viewer — {mode}",
  "card.open_live": "Open live view",
  "card.open_recording": "Open last recording",
  "card.preview_alt": "{name} preview",
  "card.preview_unavailable": "Camera preview unavailable",
  "card.description": "View the latest recording and start a separate live camera stream.",
  "warning.unavailable": "{name} is unavailable.",
  "warning.recording_media": "The last recording camera has neither a recording URL nor a usable camera image.",
  "warning.live_stream": "The live camera does not advertise camera streaming support.",
  "warning.compatibility": "Home Assistant’s native camera component is not loaded yet. The card will attempt to load it when opened.",
  "config.invalid": "Invalid card configuration.",
  "config.entity_required": "{label} must be a camera entity.",
  "config.recording_entity": "Last recording entity",
  "config.live_entity": "Live camera entity",
  "config.default_mode": "default_mode must be last_recording or live.",
  "config.preview_source": "preview_source is invalid.",
  "config.aspect_ratio": "aspect_ratio is invalid.",
  "config.fit_mode": "fit_mode is invalid.",
  "viewer.close_aria": "Close camera viewer",
  "viewer.camera_view": "Camera view",
  "viewer.entity_unavailable": "Camera entity is unavailable.",
  "viewer.suspended": "Playback paused while this tab is hidden.",
  "viewer.connecting_live": "Connecting to Ring live view…",
  "viewer.loading_recording": "Loading last recording…",
  "viewer.play_recording": "Play last recording",
  "viewer.native_unavailable_title": "Native camera playback is unavailable.",
  "viewer.native_unavailable_detail": "This Home Assistant version did not provide the expected camera component.",
  "viewer.open_ha_camera": "Open Home Assistant camera",
  "viewer.live_failed": "Live view could not be started.",
  "viewer.recording_unavailable": "No Ring recording is currently available.",
  "viewer.ring_protect": "A Ring Protect subscription may be required.",
  "viewer.switch_live": "Switch to Live",
  "viewer.switch_recording": "Switch to Last recording",
  "viewer.mode_selected_live": "Live view selected.",
  "viewer.mode_selected_recording": "Last recording selected.",
  "viewer.recording_loaded_muted": "Last recording loaded. Audio is muted because the browser blocked audible autoplay.",
  "viewer.recording_loaded_audio": "Last recording loaded. Audio is available.",
  "viewer.live_connected_audio": "Live view connected. Audio is available.",
  "viewer.live_connected_no_audio": "Live view connected. No audio track was detected.",
  "viewer.live_connected_muted": "Live view connected. Audio is muted.",
  "viewer.live_detecting_audio": "Live view connected. Audio status is still being detected.",
  "viewer.trying_ha": "Trying Home Assistant camera playback.",
  "viewer.recording_audio_blocked": "The browser blocked recording audio. Retrying muted.",
  "viewer.live_audio_muted": "Live audio was muted so playback can start.",
  "viewer.retrying_live": "Retrying Ring live view."
}, Ae = {
  de: ft,
  en: gt
};
function _t(t) {
  const e = typeof document > "u" ? void 0 : document.documentElement.lang, i = typeof navigator > "u" ? void 0 : navigator.language;
  return t?.language || t?.locale?.language || e || i || "en";
}
function wt(t) {
  return _t(t).trim().toLowerCase().split(/[-_]/)[0] === "de" ? "de" : "en";
}
function o(t, e, i = {}) {
  return (Ae[wt(t)][e] ?? Ae.en[e]).replace(
    /\{([a-z_]+)\}/gi,
    (s, n) => n in i ? String(i[n]) : s
  );
}
function Ue(t, e, i) {
  return t?.localize?.(e) || o(t, i);
}
const he = "custom:ring-view", te = "ring-view", bt = "Ring View", A = {
  default_mode: "last_recording",
  remember_last_mode: !1,
  autoplay_recording: !0,
  live_muted: !1,
  show_name: !1,
  preview_source: "last_recording",
  aspect_ratio: "16:9",
  fit_mode: "cover"
}, yt = /* @__PURE__ */ new Set(["last_recording", "live"]), $t = /* @__PURE__ */ new Set(["last_recording", "live", "default"]), At = /* @__PURE__ */ new Set(["auto", "16:9", "4:3", "1:1"]), Et = /* @__PURE__ */ new Set(["cover", "contain"]);
function Ee(t, e) {
  if (typeof t != "string" || !t.startsWith("camera."))
    throw new Error(
      o(void 0, "config.entity_required", {
        label: o(void 0, e)
      })
    );
}
function xt(t) {
  if (!t || typeof t != "object")
    throw new Error(o(void 0, "config.invalid"));
  if (Ee(t.recording_entity, "config.recording_entity"), Ee(t.live_entity, "config.live_entity"), t.default_mode && !yt.has(t.default_mode))
    throw new Error(o(void 0, "config.default_mode"));
  if (t.preview_source && !$t.has(t.preview_source))
    throw new Error(o(void 0, "config.preview_source"));
  if (t.aspect_ratio && !At.has(t.aspect_ratio))
    throw new Error(o(void 0, "config.aspect_ratio"));
  if (t.fit_mode && !Et.has(t.fit_mode))
    throw new Error(o(void 0, "config.fit_mode"));
}
function ie(t) {
  return xt(t), {
    type: t.type ?? he,
    recording_entity: t.recording_entity,
    live_entity: t.live_entity,
    name: t.name,
    default_mode: t.default_mode ?? A.default_mode,
    remember_last_mode: t.remember_last_mode ?? A.remember_last_mode,
    autoplay_recording: t.autoplay_recording ?? A.autoplay_recording,
    live_muted: t.live_muted ?? A.live_muted,
    show_name: t.show_name ?? A.show_name,
    preview_source: t.preview_source ?? A.preview_source,
    aspect_ratio: t.aspect_ratio ?? A.aspect_ratio,
    fit_mode: t.fit_mode ?? A.fit_mode,
    grid_options: t.grid_options
  };
}
function De(t) {
  switch (t) {
    case "16:9":
      return 16 / 9;
    case "4:3":
      return 4 / 3;
    case "1:1":
      return 1;
    default:
      return;
  }
}
function St(t) {
  return t === "auto" ? "16 / 9" : t.replace(":", " / ");
}
const kt = 9e3, xe = /* @__PURE__ */ new WeakMap();
function Ne(t, e, i) {
  const r = e?.attributes.entity_picture;
  return typeof r == "string" && r.length > 0 ? t.hassUrl(r) : t.hassUrl(`/api/camera_proxy/${encodeURIComponent(i)}`);
}
async function Ct(t, e, i, r) {
  const s = await Pt(t, e), n = s.includes("?") ? "&" : "?";
  return `${s}${n}width=${Se(i)}&height=${Se(r)}`;
}
function Se(t) {
  return Math.max(1, Math.ceil(Number.isFinite(t) ? t : 1));
}
async function Pt(t, e) {
  let i = xe.get(t);
  i || (i = /* @__PURE__ */ new Map(), xe.set(t, i));
  const r = Date.now(), s = i.get(e);
  if (s && s.expiresAt > r) return s.promise;
  const n = t.callWS({
    type: "auth/sign_path",
    path: `/api/camera_proxy/${encodeURIComponent(e)}`
  }).then((a) => {
    if (!a || typeof a.path != "string" || a.path.length === 0)
      throw new Error("Home Assistant did not return a signed camera path.");
    return t.hassUrl(a.path);
  });
  i.set(e, {
    expiresAt: r + kt,
    promise: n
  });
  try {
    return await n;
  } catch (a) {
    throw i.delete(e), a;
  }
}
var Rt = "M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z", Lt = "M13.5,8H12V13L16.28,15.54L17,14.33L13.5,12.25V8M13,3A9,9 0 0,0 4,12H1L4.96,16.03L9,12H6A7,7 0 0,1 13,5A7,7 0 0,1 20,12A7,7 0 0,1 13,19C11.07,19 9.32,18.21 8.06,16.94L6.64,18.36C8.27,20 10.5,21 13,21A9,9 0 0,0 22,12A9,9 0 0,0 13,3", Mt = "M19,19H5V5H19M19,3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5A2,2 0 0,0 19,3M13.96,12.29L11.21,15.83L9.25,13.47L6.5,17H17.5L13.96,12.29Z", Tt = "M8,5.14V19.14L19,12.14L8,5.14Z", Ot = "M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M10,16.5L16,12L10,7.5V16.5Z";
function ke(t) {
  return t === "live" ? u`<span class="mode-icon mode-icon-live" aria-hidden="true"></span>` : u`
    <svg class="mode-icon mode-icon-recording" viewBox="0 0 24 24" aria-hidden="true">
      <path d=${Lt}></path>
    </svg>
  `;
}
function It(t, e) {
  return o(
    e,
    t === "live" ? "common.live" : "common.last_recording"
  );
}
const Ht = le(class extends ce {
  constructor(t) {
    if (super(t), t.type !== He.ATTRIBUTE || t.name !== "class" || t.strings?.length > 2) throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.");
  }
  render(t) {
    return " " + Object.keys(t).filter((e) => t[e]).join(" ") + " ";
  }
  update(t, [e]) {
    if (this.st === void 0) {
      this.st = /* @__PURE__ */ new Set(), t.strings !== void 0 && (this.nt = new Set(t.strings.join(" ").split(/\s/).filter((r) => r !== "")));
      for (const r in e) e[r] && !this.nt?.has(r) && this.st.add(r);
      return this.render(e);
    }
    const i = t.element.classList;
    for (const r of this.st) r in e || (i.remove(r), this.st.delete(r));
    for (const r in e) {
      const s = !!e[r];
      s === this.st.has(r) || this.nt?.has(r) || (s ? (i.add(r), this.st.add(r)) : (i.remove(r), this.st.delete(r)));
    }
    return S;
  }
});
const zt = {}, Vt = (t, e = zt) => t._$AH = e;
const Ce = le(class extends ce {
  constructor() {
    super(...arguments), this.key = c;
  }
  render(t, e) {
    return this.key = t, e;
  }
  update(t, [e, i]) {
    return e !== this.key && (Vt(t), this.key = e), i;
  }
});
var Ut = Object.defineProperty, Dt = Object.getOwnPropertyDescriptor, $ = (t, e, i, r) => {
  for (var s = r > 1 ? void 0 : r ? Dt(e, i) : e, n = t.length - 1, a; n >= 0; n--)
    (a = t[n]) && (s = (r ? a(e, i, s) : a(s)) || s);
  return r && s && Ut(e, i, s), s;
};
const G = "ha-camera-stream", Nt = 8e3, Pe = "ring-view-native-layout";
async function Bt(t, e) {
  if (customElements.get(t)) return !0;
  let i;
  try {
    return await Promise.race([
      customElements.whenDefined(t),
      new Promise((r, s) => {
        i = window.setTimeout(() => s(new Error("timeout")), e);
      })
    ]), !!customElements.get(t);
  } catch {
    return !1;
  } finally {
    i !== void 0 && window.clearTimeout(i);
  }
}
async function Be() {
  if (customElements.get(G)) return !0;
  try {
    await (await window.loadCardHelpers?.())?.importMoreInfoControl?.("camera");
  } catch {
  }
  return Bt(G, Nt);
}
let b = class extends x {
  constructor() {
    super(...arguments), this.controls = !0, this.muted = !0, this.allowExoPlayer = !0, this.fitMode = "cover", this.passiveSurface = !1, this.nativeAvailable = !!customElements.get(G), this.handledStreamEvents = /* @__PURE__ */ new WeakSet(), this.ready = !1, this.handleSurfaceClick = (t) => {
      if (!this.passiveSurface || t.detail === 0 || !this.eventHost) return;
      const e = this.eventHost.getBoundingClientRect(), i = this.controls ? 64 : 0;
      t.clientY >= e.bottom - i || (t.preventDefault(), t.stopImmediatePropagation());
    }, this.handleNativeLoad = (t) => {
      t instanceof CustomEvent && this.handleReady();
    }, this.handleStreams = (t) => {
      if (this.handledStreamEvents.has(t)) return;
      this.handledStreamEvents.add(t);
      const e = t.detail;
      this.dispatchEvent(
        new CustomEvent("native-media-capabilities", {
          detail: {
            hasAudio: e?.hasAudio,
            hasVideo: e?.hasVideo
          },
          bubbles: !0,
          composed: !0
        })
      ), e?.hasVideo === !0 && this.handleReady();
    }, this.handleShadowLoad = (t) => {
      t.target instanceof HTMLImageElement && this.detectReadyMedia(this.eventRoot);
    }, this.handleReady = () => {
      this.ready || (this.ready = !0, this.dispatchEvent(
        new CustomEvent("native-media-ready", { bubbles: !0, composed: !0 })
      ));
    };
  }
  connectedCallback() {
    super.connectedCallback(), this.loadNativeComponent();
  }
  disconnectedCallback() {
    this.detachEventListeners(), this.replaceChildren(), super.disconnectedCallback();
  }
  render() {
    return !this.nativeAvailable || !this.stateObj ? c : u`
      <ha-camera-stream
        .stateObj=${this.stateObj}
        .controls=${this.controls}
        .muted=${this.muted}
        .allowExoPlayer=${this.allowExoPlayer}
        .aspectRatio=${this.aspectRatio}
        .fitMode=${this.fitMode}
      ></ha-camera-stream>
    `;
  }
  updated() {
    if (!this.nativeAvailable) return;
    const t = this.renderRoot.querySelector(G);
    t && this.attachEventListeners(t);
  }
  async loadNativeComponent() {
    const t = await Be();
    if (this.isConnected) {
      if (!t) {
        this.dispatchFailure("component-unavailable");
        return;
      }
      this.nativeAvailable = !0, await this.updateComplete;
    }
  }
  attachEventListeners(t) {
    const e = t.shadowRoot;
    if (t.style.setProperty("--ring-view-native-fit-mode", this.fitMode), t === this.eventHost && e === this.eventRoot) {
      e && this.prepareNativeRoot(e), this.detectReadyMedia(e ?? void 0);
      return;
    }
    this.detachEventListeners(), this.eventHost = t, t.addEventListener("click", this.handleSurfaceClick, !0), t.addEventListener("load", this.handleNativeLoad, !0), t.addEventListener("streams", this.handleStreams, !0), e && (this.eventRoot = e, e.addEventListener("streams", this.handleStreams, !0), e.addEventListener("load", this.handleShadowLoad, !0), this.mediaObserver = new MutationObserver(() => {
      this.prepareNativeRoot(e), this.detectReadyMedia(e);
    }), this.mediaObserver.observe(e, { childList: !0, subtree: !0 }), this.prepareNativeRoot(e), this.detectReadyMedia(e));
  }
  prepareNativeRoot(t) {
    if (t.getElementById(Pe)) return;
    const e = document.createElement("style");
    e.id = Pe, e.textContent = `
      :host {
        display: block;
        width: 100%;
        height: 100%;
        min-width: 0;
        min-height: 0;
        overflow: hidden;
      }

      img,
      ha-hls-player,
      ha-web-rtc-player {
        display: block;
        width: 100% !important;
        height: 100% !important;
        min-width: 0;
        min-height: 0;
        object-fit: var(--ring-view-native-fit-mode, cover) !important;
      }

      ha-web-rtc-player {
        --video-max-height: 100%;
      }
    `, t.append(e);
  }
  detachEventListeners() {
    this.mediaObserver?.disconnect(), this.mediaObserver = void 0, this.eventHost?.removeEventListener("click", this.handleSurfaceClick, !0), this.eventHost?.removeEventListener("load", this.handleNativeLoad, !0), this.eventHost?.removeEventListener(
      "streams",
      this.handleStreams,
      !0
    ), this.eventHost = void 0, this.eventRoot?.removeEventListener(
      "streams",
      this.handleStreams,
      !0
    ), this.eventRoot?.removeEventListener("load", this.handleShadowLoad, !0), this.eventRoot = void 0;
  }
  detectReadyMedia(t) {
    const e = t?.querySelector("img");
    e?.complete && e.naturalWidth > 0 && this.handleReady();
  }
  dispatchFailure(t) {
    this.dispatchEvent(
      new CustomEvent("native-media-error", {
        detail: t,
        bubbles: !0,
        composed: !0
      })
    );
  }
};
b.styles = Z`
    :host {
      display: block;
      width: 100%;
      height: 100%;
      min-width: 0;
      min-height: 0;
      overflow: hidden;
      background: transparent;
    }

    ha-camera-stream {
      display: block;
      width: 100%;
      height: 100%;
    }
  `;
$([
  _({ attribute: !1 })
], b.prototype, "stateObj", 2);
$([
  _({ type: Boolean })
], b.prototype, "controls", 2);
$([
  _({ type: Boolean })
], b.prototype, "muted", 2);
$([
  _({ type: Boolean, attribute: "allow-exoplayer" })
], b.prototype, "allowExoPlayer", 2);
$([
  _({ type: Number, attribute: !1 })
], b.prototype, "aspectRatio", 2);
$([
  _({ attribute: !1 })
], b.prototype, "fitMode", 2);
$([
  _({ type: Boolean, attribute: "passive-surface" })
], b.prototype, "passiveSurface", 2);
$([
  m()
], b.prototype, "nativeAvailable", 2);
b = $([
  J("ring-view-native-camera-adapter")
], b);
const Kt = Z`
  :host {
    display: block;
    min-width: 0;
    height: 100%;
  }

  ha-card {
    display: block;
    position: relative;
    height: 100%;
    min-height: 120px;
    min-width: 0;
    overflow: hidden;
    border-radius: var(--ha-card-border-radius, 12px);
    background: var(--ha-card-background, var(--card-background-color, #fff));
    box-shadow: var(--ha-card-box-shadow, none);
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
  }

  .preview {
    position: relative;
    display: block;
    width: 100%;
    height: 100%;
    min-height: 120px;
    aspect-ratio: var(--ring-view-aspect-ratio, 16 / 9);
    overflow: hidden;
    outline: none;
    background: #000;
  }

  :host([layout="grid"]) .preview {
    aspect-ratio: auto;
  }

  .preview:focus-visible {
    outline: 3px solid var(--primary-color, #03a9f4);
    outline-offset: -3px;
  }

  .preview:active::after {
    content: "";
    position: absolute;
    inset: 0;
    background: rgba(255, 255, 255, 0.08);
    pointer-events: none;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: var(--ring-view-fit-mode, cover);
    display: block;
    background: #000;
  }

  .placeholder {
    position: absolute;
    inset: 0;
    display: grid;
    place-items: center;
    padding: 24px;
    box-sizing: border-box;
    color: rgba(255, 255, 255, 0.88);
    background: linear-gradient(145deg, #202a31, #11171b);
    text-align: center;
    font-size: 14px;
  }

  .name {
    position: absolute;
    inset: 12px auto auto 16px;
    max-width: calc(100% - 76px);
    padding: 0;
    overflow: hidden;
    color: var(--ha-picture-card-text-color, #fff);
    background: none;
    font-size: var(--ha-font-size-l, 16px);
    font-weight: 500;
    line-height: 20px;
    text-overflow: ellipsis;
    text-shadow: 0 1px 4px rgba(0, 0, 0, 0.82);
    white-space: nowrap;
    pointer-events: none;
  }

  @media (prefers-reduced-motion: reduce) {
    .preview:active::after {
      display: none;
    }
  }
`, jt = Z`
  :host {
    position: fixed;
    inset: 0;
    z-index: 999;
    display: none;
    min-width: 0;
    color: var(--primary-text-color, #212121);
    font-family: var(--ha-font-family-body, Roboto, sans-serif);
  }

  :host([open]) {
    display: block;
  }

  .backdrop {
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.58);
    backdrop-filter: blur(2px);
    -webkit-backdrop-filter: blur(2px);
  }

  .dialog {
    position: absolute;
    inset: 50% auto auto 50%;
    display: flex;
    width: min(1180px, calc(100vw - 32px));
    max-height: calc(100dvh - 32px);
    min-width: 0;
    overflow: hidden;
    border: 1px solid rgba(255, 255, 255, 0.16);
    border-radius: var(--ha-dialog-border-radius, var(--ha-card-border-radius, 20px));
    background: #000;
    box-shadow: var(--ha-dialog-box-shadow, 0 24px 72px rgba(0, 0, 0, 0.48));
    transform: translate(-50%, -50%);
  }

  .header {
    position: absolute;
    inset: 0 0 auto;
    z-index: 5;
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    align-items: center;
    min-height: 72px;
    padding: 14px 16px 18px 20px;
    box-sizing: border-box;
    gap: 12px;
    background: linear-gradient(rgba(0, 0, 0, 0.7), transparent);
    pointer-events: none;
  }

  h2 {
    margin: 0;
    max-width: calc(50% - 72px);
    overflow: hidden;
    color: #fff;
    font-size: var(--ha-font-size-xl, 20px);
    font-weight: 500;
    line-height: 28px;
    text-overflow: ellipsis;
    text-shadow: 0 1px 4px rgba(0, 0, 0, 0.72);
    white-space: nowrap;
  }

  .header-actions {
    grid-column: 2;
    display: flex;
    align-items: center;
    gap: 2px;
    pointer-events: auto;
  }

  button {
    font: inherit;
  }

  .icon-button {
    width: 44px;
    height: 44px;
    display: inline-grid;
    place-items: center;
    flex: 0 0 auto;
    padding: 0;
    border: 0;
    border-radius: 50%;
    color: #fff;
    background: transparent;
    cursor: pointer;
  }

  .icon-button:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  .icon-button:focus-visible,
  .mode-button:focus-visible,
  .action-button:focus-visible {
    outline: 3px solid var(--primary-color, #03a9f4);
    outline-offset: 3px;
  }

  svg {
    width: 24px;
    height: 24px;
    fill: currentColor;
  }

  .body {
    position: relative;
    display: block;
    flex: 1 1 auto;
    min-height: 0;
    overflow: hidden;
    background: #000;
  }

  .mode-switch {
    position: absolute;
    z-index: 5;
    top: 14px;
    inset-inline-start: 50%;
    display: flex;
    align-items: center;
    gap: 2px;
    transform: translateX(-50%);
    pointer-events: auto;
  }

  .mode-button {
    display: inline-grid;
    width: 44px;
    height: 44px;
    flex: 0 0 auto;
    padding: 0;
    place-items: center;
    border: 0;
    border-radius: 50%;
    color: rgba(255, 255, 255, 0.72);
    background: transparent;
    cursor: pointer;
  }

  .mode-button:hover {
    color: #fff;
    background: rgba(255, 255, 255, 0.08);
  }

  .mode-button[aria-selected="true"] {
    color: #fff;
    background: rgba(255, 255, 255, 0.14);
  }

  .mode-button.live[aria-selected="true"] {
    color: #fff;
    background: rgba(219, 68, 55, 0.16);
    background: color-mix(in srgb, var(--error-color, #db4437) 16%, transparent);
  }

  .mode-button svg {
    width: 20px;
    height: 20px;
  }

  .mode-button .mode-icon-live {
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: var(--error-color, #db4437);
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.55);
  }

  .media-frame {
    position: relative;
    width: 100%;
    min-width: 0;
    min-height: min(56.25vw, 360px);
    max-height: calc(100dvh - 32px);
    aspect-ratio: var(--ring-view-aspect-ratio, 16 / 9);
    overflow: hidden;
    background: #000;
  }

  .media-frame.auto-ratio {
    aspect-ratio: 16 / 9;
  }

  .poster,
  ring-view-native-camera-adapter,
  .video-fallback {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    display: block;
    object-fit: var(--ring-view-fit-mode, cover);
  }

  .poster,
  .video-fallback {
    background: #000;
  }

  ring-view-native-camera-adapter {
    background: transparent;
  }

  ring-view-native-camera-adapter.pending {
    opacity: 0.01;
  }

  .state-layer {
    position: absolute;
    inset: 0;
    display: grid;
    place-items: center;
    padding: 24px;
    box-sizing: border-box;
    color: #fff;
    background: rgba(0, 0, 0, 0.42);
    text-align: center;
    z-index: 2;
  }

  .state-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    width: min(440px, 100%);
  }

  .spinner {
    width: 30px;
    height: 30px;
    border: 3px solid rgba(255, 255, 255, 0.3);
    border-top-color: #fff;
    border-radius: 50%;
    animation: spin 0.85s linear infinite;
  }

  .state-title {
    font-size: 16px;
    font-weight: 600;
    line-height: 22px;
  }

  .state-detail {
    color: rgba(255, 255, 255, 0.78);
    font-size: 13px;
    line-height: 19px;
  }

  .state-actions {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 8px;
  }

  .action-button {
    min-height: 44px;
    padding: 8px 16px;
    border: 1px solid rgba(255, 255, 255, 0.56);
    border-radius: 10px;
    color: #fff;
    background: rgba(0, 0, 0, 0.38);
    font-weight: 600;
    cursor: pointer;
  }

  .play-recording {
    display: inline-flex;
    align-items: center;
    gap: 8px;
  }

  .play-recording svg {
    width: 20px;
    height: 20px;
  }

  .play-layer {
    background: rgba(0, 0, 0, 0.18);
  }

  .action-button.primary {
    border-color: var(--primary-color, #03a9f4);
    background: var(--primary-color, #03a9f4);
  }

  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  @media (max-width: 600px) {
    .dialog {
      inset: 0;
      width: 100vw;
      height: 100dvh;
      max-height: none;
      border-radius: 0;
      transform: none;
      border: 0;
    }

    .header {
      min-height: calc(64px + env(safe-area-inset-top));
      padding: calc(10px + env(safe-area-inset-top))
        calc(10px + env(safe-area-inset-right)) 14px
        calc(16px + env(safe-area-inset-left));
    }

    .body {
      width: 100%;
      height: 100%;
    }

    .media-frame {
      top: 50%;
      min-height: 180px;
      max-height: none;
      transform: translateY(-50%);
    }

    .mode-switch {
      top: calc(10px + env(safe-area-inset-top));
    }
  }

  @media (max-height: 500px) and (orientation: landscape) {
    .body {
      position: relative;
      flex: 1 1 auto;
      overflow: hidden;
    }

    .media-frame {
      top: 0;
      height: 100%;
      min-height: 0;
      max-height: none;
      aspect-ratio: auto;
      transform: none;
    }

  }

  @media (prefers-reduced-motion: reduce) {
    .spinner {
      animation: none;
      border-color: rgba(255, 255, 255, 0.7);
    }
  }
`, Ft = Z`
  :host {
    display: block;
    min-width: 0;
    color: var(--primary-text-color, #212121);
  }

  ha-form {
    display: block;
    min-width: 0;
  }

  .warnings {
    display: grid;
    gap: 8px;
    margin: 0 0 12px;
  }
`, qt = 2;
function T(t) {
  return !t || t.state === "unavailable" || t.state === "unknown";
}
function Wt(t) {
  return (Number(t?.attributes.supported_features ?? 0) & qt) !== 0;
}
function Gt(t) {
  return !!(t?.attributes.video_url || t?.attributes.entity_picture);
}
function Zt(t, e) {
  if (!t || !e) return [];
  const i = t.states[e.recording_entity], r = t.states[e.live_entity], s = [];
  return T(i) ? s.push({
    kind: "recording",
    message: o(t, "warning.unavailable", {
      name: N(i, e.recording_entity)
    })
  }) : Gt(i) || s.push({
    kind: "recording",
    message: o(t, "warning.recording_media")
  }), T(r) ? s.push({
    kind: "live",
    message: o(t, "warning.unavailable", {
      name: N(r, e.live_entity)
    })
  }) : Wt(r) || s.push({
    kind: "live",
    message: o(t, "warning.live_stream")
  }), customElements.get("ha-camera-stream") || s.push({
    kind: "compatibility",
    message: o(t, "warning.compatibility")
  }), s;
}
function N(t, e) {
  return t?.attributes.friendly_name || e;
}
const Yt = "ring-view:mode:";
function Ke(t) {
  return `${Yt}${t.recording_entity}|${t.live_entity}`;
}
function ee(t) {
  if (!t.remember_last_mode) return t.default_mode;
  try {
    const e = window.localStorage.getItem(Ke(t));
    return e === "live" || e === "last_recording" ? e : t.default_mode;
  } catch {
    return t.default_mode;
  }
}
function Xt(t, e) {
  if (t.remember_last_mode)
    try {
      window.localStorage.setItem(Ke(t), e);
    } catch {
    }
}
class Jt {
  constructor() {
    this.generation = 0;
  }
  next() {
    return this.clearTimeout(), this.generation += 1, this.generation;
  }
  current() {
    return this.generation;
  }
  scheduleTimeout(e, i) {
    this.clearTimeout();
    const r = this.generation;
    this.timeoutId = window.setTimeout(() => {
      r === this.generation && e();
    }, i);
  }
  clearTimeout() {
    this.timeoutId !== void 0 && (window.clearTimeout(this.timeoutId), this.timeoutId = void 0);
  }
  dispose() {
    this.clearTimeout(), this.generation += 1;
  }
}
var Qt = Object.defineProperty, ei = Object.getOwnPropertyDescriptor, g = (t, e, i, r) => {
  for (var s = r > 1 ? void 0 : r ? ei(e, i) : e, n = t.length - 1, a; n >= 0; n--)
    (a = t[n]) && (s = (r ? a(e, i, s) : a(s)) || s);
  return r && s && Qt(e, i, s), s;
};
const ti = 20;
let f = class extends x {
  constructor() {
    super(...arguments), this.open = !1, this.mode = "last_recording", this.mediaStatus = "idle", this.session = 0, this.suspended = !1, this.recordingMuted = !1, this.recordingStarted = !0, this.liveMuted = !0, this.recordingVideoFailed = !1, this.retryCount = 0, this.statusAnnouncement = "", this.lifecycle = new Jt(), this.historyMarker = `ring-view-${Math.random().toString(36).slice(2)}`, this.ownsHistoryEntry = !1, this.audioFallbackAttempted = !1, this.recordingPlaybackPending = !1, this.recordingPlaybackStarted = !1, this.handleMediaReady = () => {
      this.lifecycle.clearTimeout(), this.mediaStatus = "ready", this.statusAnnouncement = this.mode === "live" ? this.liveAudioStatus() : this.recordingMuted ? o(this.hass, "viewer.recording_loaded_muted") : o(this.hass, "viewer.recording_loaded_audio");
    }, this.handleMediaCapabilities = (t) => {
      this.mode !== "live" || typeof t.detail?.hasAudio != "boolean" || this.liveMuted && t.detail.hasAudio === !1 || (this.liveHasAudio = this.liveHasAudio === !0 || t.detail.hasAudio, this.mediaStatus === "ready" && this.liveHasAudio ? this.statusAnnouncement = o(this.hass, "viewer.live_connected_audio") : this.mediaStatus === "ready" && this.liveHasAudio === !1 && (this.statusAnnouncement = o(this.hass, "viewer.live_connected_no_audio")));
    }, this.handleRecordingVideoError = () => {
      this.mode === "last_recording" && (this.recordingPlaybackPending = !1, this.recordingPlaybackStarted = !1, this.recordingVideoFailed = !0, this.statusAnnouncement = o(this.hass, "viewer.trying_ha"), this.startMedia());
    }, this.handleRecordingCanPlay = (t) => {
      if (this.mode !== "last_recording" || this.recordingPlaybackPending || this.recordingPlaybackStarted || !(t.currentTarget instanceof HTMLVideoElement))
        return;
      const e = t.currentTarget;
      this.recordingPlaybackPending = !0, e.play().then(() => {
        this.recordingPlaybackPending = !1, this.recordingPlaybackStarted = !0, this.handleMediaReady();
      }).catch(() => {
        if (!this.open || this.mode !== "last_recording" || !e.isConnected) {
          this.recordingPlaybackPending = !1;
          return;
        }
        if (!this.recordingMuted) {
          this.recordingMuted = !0, e.muted = !0, this.statusAnnouncement = o(
            this.hass,
            "viewer.recording_audio_blocked"
          ), e.play().then(() => {
            this.recordingPlaybackPending = !1, this.recordingPlaybackStarted = !0, this.handleMediaReady();
          }).catch(() => {
            this.recordingPlaybackPending = !1, this.handleRecordingVideoError();
          });
          return;
        }
        this.recordingPlaybackPending = !1, this.handleRecordingVideoError();
      });
    }, this.handleMediaError = (t) => {
      if (t.detail === "component-unavailable") {
        this.lifecycle.clearTimeout(), this.mediaStatus = "compatibility", this.statusAnnouncement = o(
          this.hass,
          "viewer.native_unavailable_title"
        );
        return;
      }
      if (this.mode === "live" && !this.liveMuted && !this.audioFallbackAttempted) {
        this.audioFallbackAttempted = !0, this.liveMuted = !0, this.statusAnnouncement = o(this.hass, "viewer.live_audio_muted"), this.startMedia();
        return;
      }
      this.failMedia(!1);
    }, this.retry = () => {
      this.retryCount = 0, this.audioFallbackAttempted = !1, this.recordingPlaybackPending = !1, this.recordingPlaybackStarted = !1, this.recordingMuted = !1, this.liveHasAudio = void 0, this.recordingVideoFailed = !1, this.startMedia();
    }, this.startRecording = () => {
      this.mode !== "last_recording" || this.recordingStarted || (this.recordingStarted = !0, this.startMedia());
    }, this.openMoreInfo = () => {
      this.dispatchEvent(
        new CustomEvent("hass-more-info", {
          detail: { entityId: this.activeEntityId() },
          bubbles: !0,
          composed: !0
        })
      );
    }, this.handleBackdrop = (t) => {
      t.target === t.currentTarget && this.close();
    }, this.handleKeyDown = (t) => {
      if (t.key !== "Tab") return;
      const e = this.focusableElements();
      if (e.length === 0) return;
      const i = e[0], r = e[e.length - 1], s = this.shadowRoot?.activeElement;
      t.shiftKey && s === i ? (t.preventDefault(), r.focus()) : !t.shiftKey && s === r && (t.preventDefault(), i.focus());
    }, this.handleTabKeyDown = (t) => {
      if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(t.key)) return;
      t.preventDefault();
      const e = t.key === "ArrowLeft" || t.key === "Home" ? "last_recording" : "live";
      this.selectMode(e), this.updateComplete.then(() => {
        const i = e === "live" ? ".mode-button.live" : ".mode-button.recording";
        this.renderRoot.querySelector(i)?.focus();
      });
    }, this.handlePopState = () => {
      this.ownsHistoryEntry = !1, this.open && this.finishClose();
    }, this.handleDocumentKeyDown = (t) => {
      t.key === "Escape" && (document.fullscreenElement || (t.preventDefault(), t.stopPropagation(), this.close()));
    }, this.handleVisibilityChange = () => {
      this.open && (document.hidden ? (this.lifecycle.dispose(), this.session = this.lifecycle.current(), this.suspended = !0, this.mediaStatus = "idle") : this.suspended && (this.suspended = !1, this.startMedia()));
    };
  }
  show(t, e) {
    !this.config || !this.hass || this.open || (this.opener = e, this.mode = t, this.liveMuted = this.config.live_muted, this.recordingStarted = t === "live" || this.config.autoplay_recording, this.retryCount = 0, this.audioFallbackAttempted = !1, this.recordingPlaybackPending = !1, this.recordingPlaybackStarted = !1, this.recordingMuted = !1, this.liveHasAudio = void 0, this.recordingVideoFailed = !1, this.suspended = !1, this.open = !0, this.pushHistoryEntry(), this.attachGlobalListeners(), this.startMedia(), this.updateComplete.then(() => this.focusInitialControl()));
  }
  close() {
    this.open && (this.ownsHistoryEntry && history.state?.ringView === this.historyMarker && (this.ownsHistoryEntry = !1, history.back()), this.finishClose());
  }
  disconnectedCallback() {
    this.finishClose(!1), super.disconnectedCallback();
  }
  willUpdate(t) {
    if (!this.open || !t.has("hass") || !this.config) return;
    const e = this.activeEntity();
    T(e) && this.mediaStatus !== "error" && (this.lifecycle.dispose(), this.session = this.lifecycle.current(), this.mediaStatus = "error", this.statusAnnouncement = o(this.hass, "viewer.entity_unavailable"));
  }
  render() {
    if (!this.open || !this.hass || !this.config) return c;
    const t = this.dialogTitle(), e = this.config.show_name, i = this.config.aspect_ratio, r = {
      "--ring-view-aspect-ratio": i === "auto" ? "16 / 9" : i.replace(":", " / "),
      "--ring-view-fit-mode": this.config.fit_mode
    };
    return u`
      <div class="backdrop" @pointerdown=${this.handleBackdrop}></div>
      <section
        class="dialog"
        style=${Ve(r)}
        role="dialog"
        aria-modal="true"
        aria-labelledby=${e ? "ring-view-dialog-title" : c}
        aria-label=${e ? c : o(this.hass, "viewer.camera_view")}
        @keydown=${this.handleKeyDown}
      >
        <div class="body">
          ${this.renderMedia()}
          <header class="header">
            ${e ? u`<h2 id="ring-view-dialog-title">${t}</h2>` : c}
            <div class="header-actions">
              <button
                class="icon-button close"
                type="button"
                aria-label=${o(this.hass, "viewer.close_aria")}
                title=${Ue(
      this.hass,
      "ui.common.close",
      "common.close"
    )}
                @click=${this.close}
              >
                ${this.icon(Rt)}
              </button>
            </div>
          </header>
          ${this.renderModeSwitch()}
        </div>
        <div class="sr-only" aria-live="polite" aria-atomic="true">
          ${this.statusAnnouncement}
        </div>
      </section>
    `;
  }
  renderModeSwitch() {
    return u`
      <div
        class="mode-switch"
        role="tablist"
        aria-label=${o(this.hass, "viewer.camera_view")}
      >
        <button
          id="ring-view-tab-recording"
          class="mode-button recording"
          type="button"
          role="tab"
          aria-label=${o(this.hass, "common.last_recording")}
          title=${o(this.hass, "common.last_recording")}
          aria-selected=${String(this.mode === "last_recording")}
          tabindex=${this.mode === "last_recording" ? "0" : "-1"}
          @click=${() => this.selectMode("last_recording")}
          @keydown=${this.handleTabKeyDown}
        >
          ${ke("last_recording")}
        </button>
        <button
          id="ring-view-tab-live"
          class="mode-button live"
          type="button"
          role="tab"
          aria-label=${o(this.hass, "common.live")}
          title=${o(this.hass, "common.live")}
          aria-selected=${String(this.mode === "live")}
          tabindex=${this.mode === "live" ? "0" : "-1"}
          @click=${() => this.selectMode("live")}
          @keydown=${this.handleTabKeyDown}
        >
          ${ke("live")}
        </button>
      </div>
    `;
  }
  renderMedia() {
    const t = this.activeEntity(), e = this.activeEntityId(), i = T(t), r = !i && !this.suspended && (this.mode === "live" || this.recordingStarted), s = De(this.config.aspect_ratio), n = Ne(this.hass, t, e), a = this.mode === "last_recording" && typeof t?.attributes.video_url == "string" ? t.attributes.video_url : void 0, l = !!(r && a && !this.recordingVideoFailed);
    return u`
      <div
        class=${Ht({
      "media-frame": !0,
      "auto-ratio": this.config.aspect_ratio === "auto"
    })}
        role="tabpanel"
        aria-labelledby=${this.mode === "live" ? "ring-view-tab-live" : "ring-view-tab-recording"}
      >
        <img class="poster" src=${n} alt="" aria-hidden="true" />
        ${r && !l && this.mediaStatus !== "compatibility" ? Ce(
      `${e}:${this.session}`,
      u`
                <ring-view-native-camera-adapter
                  class=${this.mediaStatus === "pending" ? "pending" : ""}
                  .stateObj=${t}
                  .controls=${!0}
                  .muted=${this.mode === "live" ? this.liveMuted : this.recordingMuted}
                  .allowExoPlayer=${!0}
                  .aspectRatio=${s}
                  .fitMode=${this.config.fit_mode}
                  .passiveSurface=${this.mode === "live"}
                  @native-media-ready=${this.handleMediaReady}
                  @native-media-error=${this.handleMediaError}
                  @native-media-capabilities=${this.handleMediaCapabilities}
                ></ring-view-native-camera-adapter>
              `
    ) : c}
        ${l ? Ce(
      `${e}:${this.session}:recording-video`,
      u`
              <video
                class="video-fallback"
                src=${a}
                poster=${n}
                playsinline
                autoplay
                preload="auto"
                controls
                .muted=${this.recordingMuted}
                @canplay=${this.handleRecordingCanPlay}
                @error=${this.handleRecordingVideoError}
              ></video>
            `
    ) : c}
        ${this.renderStateLayer(i, l)}
      </div>
    `;
  }
  renderStateLayer(t, e) {
    if (t) {
      const i = this.activeEntity();
      return u`
        <div class="state-layer" role="status">
          <div class="state-card">
            <div class="state-title">${N(i, this.activeEntityId())}</div>
            <div class="state-detail">
              ${o(this.hass, "viewer.entity_unavailable")}
            </div>
            <div class="state-actions">
              <button class="action-button primary" type="button" @click=${this.retry}>
                ${o(this.hass, "common.retry")}
              </button>
              ${this.renderAlternateModeButton()}
            </div>
          </div>
        </div>
      `;
    }
    return this.suspended ? u`
        <div class="state-layer" role="status">
          <div class="state-card">
            <div class="state-title">
              ${o(this.hass, "viewer.suspended")}
            </div>
          </div>
        </div>
      ` : this.mode === "last_recording" && !this.recordingStarted ? u`
        <div class="state-layer play-layer">
          <button
            class="action-button primary play-recording"
            type="button"
            aria-label=${o(this.hass, "viewer.play_recording")}
            @click=${this.startRecording}
          >
            ${this.icon(Tt)}
            <span>${o(this.hass, "viewer.play_recording")}</span>
          </button>
        </div>
      ` : this.mediaStatus === "pending" ? u`
        <div class="state-layer" role="status">
          <div class="state-card">
            <div class="spinner" aria-hidden="true"></div>
            <div class="state-title">
              ${this.mode === "live" ? o(this.hass, "viewer.connecting_live") : o(this.hass, "viewer.loading_recording")}
            </div>
          </div>
        </div>
      ` : this.mediaStatus === "compatibility" && !e ? u`
        <div class="state-layer" role="alert">
          <div class="state-card">
            <div class="state-title">
              ${o(this.hass, "viewer.native_unavailable_title")}
            </div>
            <div class="state-detail">
              ${o(this.hass, "viewer.native_unavailable_detail")}
            </div>
            <div class="state-actions">
              <button class="action-button primary" type="button" @click=${this.openMoreInfo}>
                ${o(this.hass, "viewer.open_ha_camera")}
              </button>
              ${this.renderAlternateModeButton()}
            </div>
          </div>
        </div>
      ` : this.mediaStatus === "error" ? u`
        <div class="state-layer" role="alert">
          <div class="state-card">
            <div class="state-title">
              ${this.mode === "live" ? o(this.hass, "viewer.live_failed") : o(this.hass, "viewer.recording_unavailable")}
            </div>
            ${this.mode === "last_recording" ? u`<div class="state-detail">
                  ${o(this.hass, "viewer.ring_protect")}
                </div>` : c}
            <div class="state-actions">
              <button class="action-button primary" type="button" @click=${this.retry}>
                ${o(this.hass, "common.retry")}
              </button>
              ${this.renderAlternateModeButton()}
            </div>
          </div>
        </div>
      ` : c;
  }
  renderAlternateModeButton() {
    const t = this.mode === "live" ? "last_recording" : "live";
    return u`
      <button class="action-button" type="button" @click=${() => this.selectMode(t)}>
        ${o(
      this.hass,
      t === "live" ? "viewer.switch_live" : "viewer.switch_recording"
    )}
      </button>
    `;
  }
  selectMode(t) {
    !this.config || t === this.mode || (this.lifecycle.dispose(), this.mode = t, Xt(this.config, t), this.liveMuted = this.config.live_muted, this.recordingStarted = t === "live" || this.config.autoplay_recording, this.retryCount = 0, this.audioFallbackAttempted = !1, this.recordingPlaybackPending = !1, this.recordingPlaybackStarted = !1, this.recordingMuted = !1, this.liveHasAudio = void 0, this.recordingVideoFailed = !1, this.statusAnnouncement = o(
      this.hass,
      t === "live" ? "viewer.mode_selected_live" : "viewer.mode_selected_recording"
    ), this.startMedia());
  }
  startMedia() {
    if (!this.open || this.suspended) {
      this.mediaStatus = "idle";
      return;
    }
    if (this.mode === "last_recording" && !this.recordingStarted) {
      this.mediaStatus = "idle";
      return;
    }
    if (T(this.activeEntity())) {
      this.mediaStatus = "error", this.statusAnnouncement = o(this.hass, "viewer.entity_unavailable");
      return;
    }
    this.mediaStatus = "pending", this.session = this.lifecycle.next(), this.lifecycle.scheduleTimeout(
      () => this.failMedia(!0),
      ti * 1e3
    );
  }
  liveAudioStatus() {
    return this.liveMuted ? o(this.hass, "viewer.live_connected_muted") : this.liveHasAudio === !0 ? o(this.hass, "viewer.live_connected_audio") : this.liveHasAudio === !1 ? o(this.hass, "viewer.live_connected_no_audio") : o(this.hass, "viewer.live_detecting_audio");
  }
  failMedia(t) {
    if (t && this.mode === "live" && this.retryCount < 1) {
      this.retryCount += 1, this.statusAnnouncement = o(this.hass, "viewer.retrying_live"), this.startMedia();
      return;
    }
    this.lifecycle.dispose(), this.session = this.lifecycle.current(), this.mediaStatus = "error", this.statusAnnouncement = this.mode === "live" ? o(this.hass, "viewer.live_failed") : o(this.hass, "viewer.recording_unavailable");
  }
  activeEntityId() {
    return this.mode === "live" ? this.config.live_entity : this.config.recording_entity;
  }
  activeEntity() {
    return this.hass?.states[this.activeEntityId()];
  }
  dialogTitle() {
    return this.config?.name ? this.config.name : N(
      this.hass?.states[this.config.recording_entity],
      o(this.hass, "common.camera")
    );
  }
  focusableElements() {
    return Array.from(
      this.renderRoot.querySelectorAll(
        'button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])'
      )
    ).filter((t) => t.offsetParent !== null);
  }
  focusInitialControl() {
    this.renderRoot.querySelector(".close")?.focus();
  }
  pushHistoryEntry() {
    try {
      const t = history.state && typeof history.state == "object" ? history.state : {};
      history.pushState(
        { ...t, ringView: this.historyMarker },
        "",
        location.href
      ), this.ownsHistoryEntry = !0;
    } catch {
      this.ownsHistoryEntry = !1;
    }
  }
  attachGlobalListeners() {
    window.addEventListener("popstate", this.handlePopState), document.addEventListener("keydown", this.handleDocumentKeyDown, !0), document.addEventListener("visibilitychange", this.handleVisibilityChange);
  }
  detachGlobalListeners() {
    window.removeEventListener("popstate", this.handlePopState), document.removeEventListener("keydown", this.handleDocumentKeyDown, !0), document.removeEventListener("visibilitychange", this.handleVisibilityChange);
  }
  finishClose(t = !0) {
    !this.open && !this.isConnected || (this.lifecycle.dispose(), this.session = this.lifecycle.current(), this.mediaStatus = "idle", this.open = !1, this.suspended = !1, this.recordingPlaybackPending = !1, this.recordingPlaybackStarted = !1, this.recordingStarted = !0, this.recordingMuted = !1, this.liveHasAudio = void 0, this.recordingVideoFailed = !1, this.detachGlobalListeners(), document.fullscreenElement && document.exitFullscreen().catch(() => {
    }), this.dispatchEvent(
      new CustomEvent("viewer-closed", { bubbles: !0, composed: !0 })
    ), t && this.opener?.focus(), this.opener = void 0);
  }
  icon(t) {
    return u`<svg viewBox="0 0 24 24" aria-hidden="true"><path d=${t}></path></svg>`;
  }
};
f.styles = jt;
g([
  _({ attribute: !1 })
], f.prototype, "hass", 2);
g([
  _({ attribute: !1 })
], f.prototype, "config", 2);
g([
  _({ type: Boolean, reflect: !0 })
], f.prototype, "open", 2);
g([
  m()
], f.prototype, "mode", 2);
g([
  m()
], f.prototype, "mediaStatus", 2);
g([
  m()
], f.prototype, "session", 2);
g([
  m()
], f.prototype, "suspended", 2);
g([
  m()
], f.prototype, "recordingMuted", 2);
g([
  m()
], f.prototype, "recordingStarted", 2);
g([
  m()
], f.prototype, "liveMuted", 2);
g([
  m()
], f.prototype, "liveHasAudio", 2);
g([
  m()
], f.prototype, "recordingVideoFailed", 2);
g([
  m()
], f.prototype, "retryCount", 2);
g([
  m()
], f.prototype, "statusAnnouncement", 2);
f = g([
  J("ring-view-dialog")
], f);
var ii = Object.defineProperty, ri = Object.getOwnPropertyDescriptor, I = (t, e, i, r) => {
  for (var s = r > 1 ? void 0 : r ? ri(e, i) : e, n = t.length - 1, a; n >= 0; n--)
    (a = t[n]) && (s = (r ? a(e, i, s) : a(s)) || s);
  return r && s && ii(e, i, s), s;
};
const si = 1e4, ni = 640, ai = 16 / 9, Re = 16, oi = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(
  mt
)}`;
let k = class extends x {
  constructor() {
    super(...arguments), this.previewFailed = !1, this.previewIntersecting = !1, this.previewVisible = !1, this.previewRequestId = 0, this.openViewer = () => {
      const t = this.renderRoot.querySelector(".preview") ?? void 0;
      this.renderRoot.querySelector("ring-view-dialog")?.show(ee(this.config), t);
    }, this.handleKeyDown = (t) => {
      t.key !== "Enter" && t.key !== " " || (t.preventDefault(), this.openViewer());
    }, this.handlePreviewError = () => {
      this.previewFailed = !0;
    }, this.handleViewerClosed = () => {
      this.requestUpdate();
    }, this.handleDocumentVisibility = () => {
      this.updatePreviewVisibility();
    };
  }
  static async getConfigElement() {
    return await Promise.resolve().then(() => pi), document.createElement("ring-view-editor");
  }
  static getStubConfig(t) {
    const e = Object.keys(t?.states ?? {}).filter((s) => s.startsWith("camera.")), i = e.find(
      (s) => (Number(t?.states[s]?.attributes.supported_features ?? 0) & 2) !== 0
    ) ?? e.find((s) => /live(_view)?$/i.test(s)) ?? e[1] ?? "camera.live_view", r = e.find(
      (s) => s !== i && (Number(t?.states[s]?.attributes.supported_features ?? 0) & 2) === 0
    ) ?? e.find((s) => s !== i) ?? e[0] ?? "camera.latest_recording";
    return {
      type: he,
      recording_entity: r,
      live_entity: i
    };
  }
  setConfig(t) {
    this.config = ie(t);
  }
  getCardSize() {
    return 3;
  }
  getGridOptions() {
    return {
      columns: 12,
      rows: 3,
      min_columns: 6,
      min_rows: 2,
      ...this.config?.grid_options
    };
  }
  connectedCallback() {
    super.connectedCallback(), this.updateComplete.then(() => {
      this.isConnected && !this.isInCardPicker() && this.setupPreviewLifecycle();
    });
  }
  disconnectedCallback() {
    this.renderRoot.querySelector("ring-view-dialog")?.close(), this.teardownPreviewLifecycle(), super.disconnectedCallback();
  }
  shouldUpdate(t) {
    for (const i of t.keys())
      if (i !== "hass") return !0;
    if (!t.has("hass") || !this.hass || !this.config) return !1;
    const e = t.get("hass");
    return e ? e.language !== this.hass.language || e.locale?.language !== this.hass.locale?.language || e.states[this.config.recording_entity] !== this.hass.states[this.config.recording_entity] || e.states[this.config.live_entity] !== this.hass.states[this.config.live_entity] : !0;
  }
  willUpdate() {
    if (!this.hass || !this.config || this.isInCardPicker()) return;
    const t = this.previewEntityId(), e = Ne(this.hass, this.hass.states[t], t);
    (t !== this.activePreviewEntityId || e !== this.lastFallbackPoster) && (this.activePreviewEntityId = t, this.lastFallbackPoster = e, this.lastPoster = e, this.lastPreviewSize = void 0, this.previewRequestId += 1, this.previewFailed = !1);
  }
  updated(t) {
    const e = t.has("config");
    !this.isInCardPicker() && (t.has("hass") || e) && this.previewVisible && this.refreshPreview(!0);
  }
  render() {
    if (!this.hass || !this.config) return c;
    const t = this.previewEntityId(), e = this.hass.states[t], i = this.config.name || N(
      this.hass.states[this.config.recording_entity],
      o(this.hass, "common.camera")
    ), r = ee(this.config), s = this.isInCardPicker(), n = s ? !1 : T(e), a = {
      "--ring-view-aspect-ratio": St(this.config.aspect_ratio),
      "--ring-view-fit-mode": this.config.fit_mode
    };
    return u`
      <ha-card>
        <div
          class="preview"
          style=${Ve(a)}
          role="button"
          tabindex="0"
          aria-label=${o(this.hass, "card.open_viewer", {
      name: i,
      mode: It(r, this.hass)
    })}
          title=${o(
      this.hass,
      r === "live" ? "card.open_live" : "card.open_recording"
    )}
          @click=${this.openViewer}
          @keydown=${this.handleKeyDown}
        >
          ${!n && !this.previewFailed ? u`
                <img
                  src=${s ? oi : this.lastPoster ?? ""}
                  alt=${o(this.hass, "card.preview_alt", { name: i })}
                  @error=${this.handlePreviewError}
                />
              ` : u`<div class="placeholder">
                ${o(this.hass, "card.preview_unavailable")}
              </div>`}
          ${this.config.show_name ? u`<div class="name">${i}</div>` : c}
        </div>
      </ha-card>
      <ring-view-dialog
        .hass=${this.hass}
        .config=${this.config}
        @viewer-closed=${this.handleViewerClosed}
      ></ring-view-dialog>
    `;
  }
  previewEntityId() {
    const t = this.config.preview_source;
    return (t === "default" ? ee(this.config) : t) === "live" ? this.config.live_entity : this.config.recording_entity;
  }
  setupPreviewLifecycle() {
    if (this.isInCardPicker() || this.previewIntersectionObserver || this.previewResizeObserver) return;
    const t = this.renderRoot.querySelector(".preview");
    t && (typeof IntersectionObserver > "u" ? this.previewIntersecting = !0 : (this.previewIntersectionObserver = new IntersectionObserver((e) => {
      const i = e[e.length - 1];
      i && (this.previewIntersecting = i.isIntersecting || i.intersectionRatio > 0, this.updatePreviewVisibility());
    }), this.previewIntersectionObserver.observe(t)), typeof ResizeObserver < "u" && (this.previewResizeObserver = new ResizeObserver(() => {
      !this.previewVisible || this.previewResizeFrame !== void 0 || (this.previewResizeFrame = window.requestAnimationFrame(() => {
        this.previewResizeFrame = void 0, this.refreshPreview(!1);
      }));
    }), this.previewResizeObserver.observe(t)), document.addEventListener("visibilitychange", this.handleDocumentVisibility), this.updatePreviewVisibility());
  }
  teardownPreviewLifecycle() {
    this.previewIntersectionObserver?.disconnect(), this.previewResizeObserver?.disconnect(), this.previewIntersectionObserver = void 0, this.previewResizeObserver = void 0, document.removeEventListener("visibilitychange", this.handleDocumentVisibility), this.stopPreviewRefreshTimer(), this.previewResizeFrame !== void 0 && (window.cancelAnimationFrame(this.previewResizeFrame), this.previewResizeFrame = void 0), this.previewVisible = !1, this.previewIntersecting = !1, this.previewRequestId += 1;
  }
  updatePreviewVisibility() {
    if (this.isInCardPicker()) return;
    const t = this.previewIntersecting && document.visibilityState !== "hidden";
    if (t !== this.previewVisible) {
      if (this.previewVisible = t, t) {
        this.refreshPreview(!0), this.previewRefreshTimer = window.setInterval(() => {
          this.refreshPreview(!0);
        }, si);
        return;
      }
      this.stopPreviewRefreshTimer(), this.previewRequestId += 1;
    }
  }
  stopPreviewRefreshTimer() {
    this.previewRefreshTimer !== void 0 && (window.clearInterval(this.previewRefreshTimer), this.previewRefreshTimer = void 0);
  }
  async refreshPreview(t) {
    if (this.isInCardPicker() || !this.previewVisible || !this.hass || !this.config) return;
    const e = this.renderRoot.querySelector(".preview");
    if (!e) return;
    const i = Math.max(1, window.devicePixelRatio || 1), r = e.clientWidth || e.getBoundingClientRect().width, s = r > 0 ? r : ni, n = e.clientHeight || e.getBoundingClientRect().height, a = De(this.config.aspect_ratio) ?? ai, l = n > 0 ? n : s / a, d = Math.ceil(s * i), p = Math.ceil(l * i);
    if (!t && this.lastPreviewSize && Math.abs(d - this.lastPreviewSize.width) < Re && Math.abs(p - this.lastPreviewSize.height) < Re)
      return;
    this.lastPreviewSize = { width: d, height: p };
    const v = this.previewEntityId(), h = this.hass, w = ++this.previewRequestId;
    try {
      const y = await Ct(h, v, d, p);
      if (w !== this.previewRequestId || !this.isConnected || !this.previewVisible || this.previewEntityId() !== v)
        return;
      this.lastPoster = y, this.previewFailed = !1;
    } catch {
    }
  }
  /**
   * Home Assistant mounts picker previews inside `hui-card-picker`. Keep that
   * catalog surface representative without exposing a user's camera image.
   * The standard `preview` property is also used while editing dashboards, so
   * the ancestor check intentionally distinguishes the picker from edit mode.
   */
  isInCardPicker() {
    let t = this.parentNode ?? this.getRootNode();
    for (; t; ) {
      if (t instanceof Element && t.localName === "hui-card-picker") return !0;
      t = t instanceof ShadowRoot ? t.host : t.parentNode;
    }
    return !1;
  }
};
k.styles = Kt;
I([
  _({ attribute: !1 })
], k.prototype, "hass", 2);
I([
  _({ reflect: !0 })
], k.prototype, "layout", 2);
I([
  m()
], k.prototype, "config", 2);
I([
  m()
], k.prototype, "previewFailed", 2);
I([
  m()
], k.prototype, "lastPoster", 2);
k = I([
  J(te)
], k);
window.customCards = window.customCards || [];
window.customCards.some((t) => t.type === te) || window.customCards.push({
  type: te,
  name: bt,
  description: o(void 0, "card.description"),
  preview: !0,
  getEntitySuggestion: (t, e) => {
    if (!e.startsWith("camera.")) return null;
    const i = Object.keys(t.states).find(
      (r) => r !== e && r.startsWith("camera.") && /live(_view)?$/i.test(r)
    );
    return i ? {
      config: {
        type: he,
        recording_entity: e,
        live_entity: i
      }
    } : null;
  }
});
var di = Object.defineProperty, li = Object.getOwnPropertyDescriptor, K = (t, e, i, r) => {
  for (var s = r > 1 ? void 0 : r ? li(e, i) : e, n = t.length - 1, a; n >= 0; n--)
    (a = t[n]) && (s = (r ? a(e, i, s) : a(s)) || s);
  return r && s && di(e, i, s), s;
};
function ci(t) {
  return [
    {
      name: "recording_entity",
      required: !0,
      selector: { entity: { domain: "camera" } }
    },
    {
      name: "live_entity",
      required: !0,
      selector: { entity: { domain: "camera" } }
    },
    {
      name: "viewer_behavior",
      type: "expandable",
      flatten: !0,
      iconPath: Ot,
      schema: [
        {
          name: "default_mode",
          selector: {
            select: {
              mode: "dropdown",
              options: [
                {
                  value: "last_recording",
                  label: o(t, "common.last_recording")
                },
                { value: "live", label: o(t, "common.live") }
              ]
            }
          }
        },
        { name: "remember_last_mode", selector: { boolean: {} } },
        { name: "autoplay_recording", selector: { boolean: {} } },
        { name: "live_muted", selector: { boolean: {} } }
      ]
    },
    {
      name: "card_appearance",
      type: "expandable",
      flatten: !0,
      iconPath: Mt,
      schema: [
        { name: "name", selector: { text: {} } },
        { name: "show_name", selector: { boolean: {} } },
        {
          name: "preview_source",
          selector: {
            select: {
              mode: "dropdown",
              options: [
                {
                  value: "last_recording",
                  label: o(t, "editor.preview_recording")
                },
                {
                  value: "live",
                  label: o(t, "editor.preview_live")
                },
                {
                  value: "default",
                  label: o(t, "editor.preview_default")
                }
              ]
            }
          }
        },
        {
          name: "",
          type: "grid",
          schema: [
            {
              name: "aspect_ratio",
              selector: {
                select: {
                  mode: "dropdown",
                  options: [
                    {
                      value: "16:9",
                      label: o(t, "editor.aspect_widescreen")
                    },
                    {
                      value: "4:3",
                      label: o(t, "editor.aspect_standard")
                    },
                    {
                      value: "1:1",
                      label: o(t, "editor.aspect_square")
                    },
                    {
                      value: "auto",
                      label: o(t, "editor.aspect_auto")
                    }
                  ]
                }
              }
            },
            {
              name: "fit_mode",
              selector: {
                select: {
                  mode: "dropdown",
                  options: [
                    {
                      value: "cover",
                      label: o(t, "editor.fit_cover")
                    },
                    {
                      value: "contain",
                      label: o(t, "editor.fit_contain")
                    }
                  ]
                }
              }
            }
          ]
        }
      ]
    }
  ];
}
const hi = {
  recording_entity: "editor.recording_entity",
  live_entity: "editor.live_entity",
  viewer_behavior: "editor.viewer_behavior",
  default_mode: "editor.default_mode",
  remember_last_mode: "editor.remember_last_mode",
  autoplay_recording: "editor.autoplay_recording",
  live_muted: "editor.live_muted",
  card_appearance: "editor.card_appearance",
  name: "editor.name",
  show_name: "editor.show_name",
  preview_source: "editor.preview_source",
  aspect_ratio: "editor.aspect_ratio",
  fit_mode: "editor.fit_mode"
}, ui = {
  default_mode: "editor.helper_default_mode",
  remember_last_mode: "editor.helper_remember_last_mode",
  autoplay_recording: "editor.helper_autoplay_recording",
  live_muted: "editor.helper_live_muted",
  show_name: "editor.helper_show_name",
  preview_source: "editor.helper_preview_source"
};
let C = class extends x {
  constructor() {
    super(...arguments), this.nativeChecked = !1, this.nativeAvailable = !1, this.computeLabel = (t) => {
      const e = hi[t.name];
      if (!e) return;
      const i = o(this.hass, e);
      if (t.name !== "name") return i;
      const r = Ue(
        this.hass,
        "ui.panel.lovelace.editor.card.config.optional",
        "common.optional"
      );
      return `${i} (${r})`;
    }, this.computeHelper = (t) => {
      const e = ui[t.name];
      return e ? o(this.hass, e) : void 0;
    }, this.valueChanged = (t) => {
      if (!this.config) return;
      const e = ie({
        ...this.config,
        ...t.detail.value
      });
      this.config = e;
      const i = Object.fromEntries(
        Object.entries(e).filter(([, r]) => r !== void 0)
      );
      this.dispatchEvent(
        new CustomEvent("config-changed", {
          detail: { config: i },
          bubbles: !0,
          composed: !0
        })
      );
    };
  }
  setConfig(t) {
    this.config = ie(t);
  }
  connectedCallback() {
    super.connectedCallback(), Be().then((t) => {
      this.isConnected && (this.nativeAvailable = t, this.nativeChecked = !0);
    });
  }
  render() {
    if (!this.hass || !this.config) return c;
    const t = Zt(this.hass, this.config).filter(
      (e) => e.kind !== "compatibility" || this.nativeChecked && !this.nativeAvailable
    );
    return u`
      ${t.length ? u`
            <div
              class="warnings"
              role="status"
              aria-label=${o(this.hass, "editor.warnings")}
            >
              ${t.map(
      (e) => u`
                  <ha-alert alert-type="warning">${e.message}</ha-alert>
                `
    )}
            </div>
          ` : c}
      <ha-form
        .hass=${this.hass}
        .data=${this.config}
        .schema=${ci(this.hass)}
        .computeLabel=${this.computeLabel}
        .computeHelper=${this.computeHelper}
        @value-changed=${this.valueChanged}
      ></ha-form>
    `;
  }
};
C.styles = Ft;
K([
  _({ attribute: !1 })
], C.prototype, "hass", 2);
K([
  m()
], C.prototype, "config", 2);
K([
  m()
], C.prototype, "nativeChecked", 2);
K([
  m()
], C.prototype, "nativeAvailable", 2);
C = K([
  J("ring-view-editor")
], C);
const pi = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get RingViewEditor() {
    return C;
  }
}, Symbol.toStringTag, { value: "Module" }));
export {
  k as RingView
};
