const K = globalThis, se = K.ShadowRoot && (K.ShadyCSS === void 0 || K.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, re = /* @__PURE__ */ Symbol(), ue = /* @__PURE__ */ new WeakMap();
let Le = class {
  constructor(e, i, s) {
    if (this._$cssResult$ = !0, s !== re) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = e, this.t = i;
  }
  get styleSheet() {
    let e = this.o;
    const i = this.t;
    if (se && e === void 0) {
      const s = i !== void 0 && i.length === 1;
      s && (e = ue.get(i)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), s && ue.set(i, e));
    }
    return e;
  }
  toString() {
    return this.cssText;
  }
};
const je = (t) => new Le(typeof t == "string" ? t : t + "", void 0, re), G = (t, ...e) => {
  const i = t.length === 1 ? t[0] : e.reduce((s, r, n) => s + ((a) => {
    if (a._$cssResult$ === !0) return a.cssText;
    if (typeof a == "number") return a;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + a + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(r) + t[n + 1], t[0]);
  return new Le(i, t, re);
}, Fe = (t, e) => {
  if (se) t.adoptedStyleSheets = e.map((i) => i instanceof CSSStyleSheet ? i : i.styleSheet);
  else for (const i of e) {
    const s = document.createElement("style"), r = K.litNonce;
    r !== void 0 && s.setAttribute("nonce", r), s.textContent = i.cssText, t.appendChild(s);
  }
}, pe = se ? (t) => t : (t) => t instanceof CSSStyleSheet ? ((e) => {
  let i = "";
  for (const s of e.cssRules) i += s.cssText;
  return je(i);
})(t) : t;
const { is: Ke, defineProperty: qe, getOwnPropertyDescriptor: We, getOwnPropertyNames: Ze, getOwnPropertySymbols: Ge, getPrototypeOf: Ye } = Object, Y = globalThis, ve = Y.trustedTypes, Je = ve ? ve.emptyScript : "", Xe = Y.reactiveElementPolyfillSupport, z = (t, e) => t, q = { toAttribute(t, e) {
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
} }, ne = (t, e) => !Ke(t, e), me = { attribute: !0, type: String, converter: q, reflect: !1, useDefault: !1, hasChanged: ne };
Symbol.metadata ??= /* @__PURE__ */ Symbol("metadata"), Y.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
let L = class extends HTMLElement {
  static addInitializer(e) {
    this._$Ei(), (this.l ??= []).push(e);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(e, i = me) {
    if (i.state && (i.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((i = Object.create(i)).wrapped = !0), this.elementProperties.set(e, i), !i.noAccessor) {
      const s = /* @__PURE__ */ Symbol(), r = this.getPropertyDescriptor(e, s, i);
      r !== void 0 && qe(this.prototype, e, r);
    }
  }
  static getPropertyDescriptor(e, i, s) {
    const { get: r, set: n } = We(this.prototype, e) ?? { get() {
      return this[i];
    }, set(a) {
      this[i] = a;
    } };
    return { get: r, set(a) {
      const l = r?.call(this);
      n?.call(this, a), this.requestUpdate(e, l, s);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(e) {
    return this.elementProperties.get(e) ?? me;
  }
  static _$Ei() {
    if (this.hasOwnProperty(z("elementProperties"))) return;
    const e = Ye(this);
    e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(z("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(z("properties"))) {
      const i = this.properties, s = [...Ze(i), ...Ge(i)];
      for (const r of s) this.createProperty(r, i[r]);
    }
    const e = this[Symbol.metadata];
    if (e !== null) {
      const i = litPropertyMetadata.get(e);
      if (i !== void 0) for (const [s, r] of i) this.elementProperties.set(s, r);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [i, s] of this.elementProperties) {
      const r = this._$Eu(i, s);
      r !== void 0 && this._$Eh.set(r, i);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(e) {
    const i = [];
    if (Array.isArray(e)) {
      const s = new Set(e.flat(1 / 0).reverse());
      for (const r of s) i.unshift(pe(r));
    } else e !== void 0 && i.push(pe(e));
    return i;
  }
  static _$Eu(e, i) {
    const s = i.attribute;
    return s === !1 ? void 0 : typeof s == "string" ? s : typeof e == "string" ? e.toLowerCase() : void 0;
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
    for (const s of i.keys()) this.hasOwnProperty(s) && (e.set(s, this[s]), delete this[s]);
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
  attributeChangedCallback(e, i, s) {
    this._$AK(e, s);
  }
  _$ET(e, i) {
    const s = this.constructor.elementProperties.get(e), r = this.constructor._$Eu(e, s);
    if (r !== void 0 && s.reflect === !0) {
      const n = (s.converter?.toAttribute !== void 0 ? s.converter : q).toAttribute(i, s.type);
      this._$Em = e, n == null ? this.removeAttribute(r) : this.setAttribute(r, n), this._$Em = null;
    }
  }
  _$AK(e, i) {
    const s = this.constructor, r = s._$Eh.get(e);
    if (r !== void 0 && this._$Em !== r) {
      const n = s.getPropertyOptions(r), a = typeof n.converter == "function" ? { fromAttribute: n.converter } : n.converter?.fromAttribute !== void 0 ? n.converter : q;
      this._$Em = r;
      const l = a.fromAttribute(i, n.type);
      this[r] = l ?? this._$Ej?.get(r) ?? l, this._$Em = null;
    }
  }
  requestUpdate(e, i, s, r = !1, n) {
    if (e !== void 0) {
      const a = this.constructor;
      if (r === !1 && (n = this[e]), s ??= a.getPropertyOptions(e), !((s.hasChanged ?? ne)(n, i) || s.useDefault && s.reflect && n === this._$Ej?.get(e) && !this.hasAttribute(a._$Eu(e, s)))) return;
      this.C(e, i, s);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(e, i, { useDefault: s, reflect: r, wrapped: n }, a) {
    s && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(e) && (this._$Ej.set(e, a ?? i ?? this[e]), n !== !0 || a !== void 0) || (this._$AL.has(e) || (this.hasUpdated || s || (i = void 0), this._$AL.set(e, i)), r === !0 && this._$Em !== e && (this._$Eq ??= /* @__PURE__ */ new Set()).add(e));
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
        for (const [r, n] of this._$Ep) this[r] = n;
        this._$Ep = void 0;
      }
      const s = this.constructor.elementProperties;
      if (s.size > 0) for (const [r, n] of s) {
        const { wrapped: a } = n, l = this[r];
        a !== !0 || this._$AL.has(r) || l === void 0 || this.C(r, void 0, n, l);
      }
    }
    let e = !1;
    const i = this._$AL;
    try {
      e = this.shouldUpdate(i), e ? (this.willUpdate(i), this._$EO?.forEach((s) => s.hostUpdate?.()), this.update(i)) : this._$EM();
    } catch (s) {
      throw e = !1, this._$EM(), s;
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
L.elementStyles = [], L.shadowRootOptions = { mode: "open" }, L[z("elementProperties")] = /* @__PURE__ */ new Map(), L[z("finalized")] = /* @__PURE__ */ new Map(), Xe?.({ ReactiveElement: L }), (Y.reactiveElementVersions ??= []).push("2.1.2");
const ae = globalThis, fe = (t) => t, W = ae.trustedTypes, ge = W ? W.createPolicy("lit-html", { createHTML: (t) => t }) : void 0, Me = "$lit$", A = `lit$${Math.random().toFixed(9).slice(2)}$`, Oe = "?" + A, Qe = `<${Oe}>`, R = document, V = () => R.createComment(""), U = (t) => t === null || typeof t != "object" && typeof t != "function", oe = Array.isArray, et = (t) => oe(t) || typeof t?.[Symbol.iterator] == "function", Q = `[ 	
\f\r]`, H = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, be = /-->/g, we = />/g, k = RegExp(`>|${Q}(?:([^\\s"'>=/]+)(${Q}*=${Q}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), _e = /'/g, ye = /"/g, Te = /^(?:script|style|textarea|title)$/i, tt = (t) => (e, ...i) => ({ _$litType$: t, strings: e, values: i }), u = tt(1), x = /* @__PURE__ */ Symbol.for("lit-noChange"), c = /* @__PURE__ */ Symbol.for("lit-nothing"), $e = /* @__PURE__ */ new WeakMap(), P = R.createTreeWalker(R, 129);
function He(t, e) {
  if (!oe(t) || !t.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return ge !== void 0 ? ge.createHTML(e) : e;
}
const it = (t, e) => {
  const i = t.length - 1, s = [];
  let r, n = e === 2 ? "<svg>" : e === 3 ? "<math>" : "", a = H;
  for (let l = 0; l < i; l++) {
    const d = t[l];
    let p, v, h = -1, w = 0;
    for (; w < d.length && (a.lastIndex = w, v = a.exec(d), v !== null); ) w = a.lastIndex, a === H ? v[1] === "!--" ? a = be : v[1] !== void 0 ? a = we : v[2] !== void 0 ? (Te.test(v[2]) && (r = RegExp("</" + v[2], "g")), a = k) : v[3] !== void 0 && (a = k) : a === k ? v[0] === ">" ? (a = r ?? H, h = -1) : v[1] === void 0 ? h = -2 : (h = a.lastIndex - v[2].length, p = v[1], a = v[3] === void 0 ? k : v[3] === '"' ? ye : _e) : a === ye || a === _e ? a = k : a === be || a === we ? a = H : (a = k, r = void 0);
    const y = a === k && t[l + 1].startsWith("/>") ? " " : "";
    n += a === H ? d + Qe : h >= 0 ? (s.push(p), d.slice(0, h) + Me + d.slice(h) + A + y) : d + A + (h === -2 ? l : y);
  }
  return [He(t, n + (t[i] || "<?>") + (e === 2 ? "</svg>" : e === 3 ? "</math>" : "")), s];
};
class D {
  constructor({ strings: e, _$litType$: i }, s) {
    let r;
    this.parts = [];
    let n = 0, a = 0;
    const l = e.length - 1, d = this.parts, [p, v] = it(e, i);
    if (this.el = D.createElement(p, s), P.currentNode = this.el.content, i === 2 || i === 3) {
      const h = this.el.content.firstChild;
      h.replaceWith(...h.childNodes);
    }
    for (; (r = P.nextNode()) !== null && d.length < l; ) {
      if (r.nodeType === 1) {
        if (r.hasAttributes()) for (const h of r.getAttributeNames()) if (h.endsWith(Me)) {
          const w = v[a++], y = r.getAttribute(h).split(A), F = /([.?@])?(.*)/.exec(w);
          d.push({ type: 1, index: n, name: F[2], strings: y, ctor: F[1] === "." ? rt : F[1] === "?" ? nt : F[1] === "@" ? at : J }), r.removeAttribute(h);
        } else h.startsWith(A) && (d.push({ type: 6, index: n }), r.removeAttribute(h));
        if (Te.test(r.tagName)) {
          const h = r.textContent.split(A), w = h.length - 1;
          if (w > 0) {
            r.textContent = W ? W.emptyScript : "";
            for (let y = 0; y < w; y++) r.append(h[y], V()), P.nextNode(), d.push({ type: 2, index: ++n });
            r.append(h[w], V());
          }
        }
      } else if (r.nodeType === 8) if (r.data === Oe) d.push({ type: 2, index: n });
      else {
        let h = -1;
        for (; (h = r.data.indexOf(A, h + 1)) !== -1; ) d.push({ type: 7, index: n }), h += A.length - 1;
      }
      n++;
    }
  }
  static createElement(e, i) {
    const s = R.createElement("template");
    return s.innerHTML = e, s;
  }
}
function O(t, e, i = t, s) {
  if (e === x) return e;
  let r = s !== void 0 ? i._$Co?.[s] : i._$Cl;
  const n = U(e) ? void 0 : e._$litDirective$;
  return r?.constructor !== n && (r?._$AO?.(!1), n === void 0 ? r = void 0 : (r = new n(t), r._$AT(t, i, s)), s !== void 0 ? (i._$Co ??= [])[s] = r : i._$Cl = r), r !== void 0 && (e = O(t, r._$AS(t, e.values), r, s)), e;
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
    const { el: { content: i }, parts: s } = this._$AD, r = (e?.creationScope ?? R).importNode(i, !0);
    P.currentNode = r;
    let n = P.nextNode(), a = 0, l = 0, d = s[0];
    for (; d !== void 0; ) {
      if (a === d.index) {
        let p;
        d.type === 2 ? p = new B(n, n.nextSibling, this, e) : d.type === 1 ? p = new d.ctor(n, d.name, d.strings, this, e) : d.type === 6 && (p = new ot(n, this, e)), this._$AV.push(p), d = s[++l];
      }
      a !== d?.index && (n = P.nextNode(), a++);
    }
    return P.currentNode = R, r;
  }
  p(e) {
    let i = 0;
    for (const s of this._$AV) s !== void 0 && (s.strings !== void 0 ? (s._$AI(e, s, i), i += s.strings.length - 2) : s._$AI(e[i])), i++;
  }
}
class B {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(e, i, s, r) {
    this.type = 2, this._$AH = c, this._$AN = void 0, this._$AA = e, this._$AB = i, this._$AM = s, this.options = r, this._$Cv = r?.isConnected ?? !0;
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
    e = O(this, e, i), U(e) ? e === c || e == null || e === "" ? (this._$AH !== c && this._$AR(), this._$AH = c) : e !== this._$AH && e !== x && this._(e) : e._$litType$ !== void 0 ? this.$(e) : e.nodeType !== void 0 ? this.T(e) : et(e) ? this.k(e) : this._(e);
  }
  O(e) {
    return this._$AA.parentNode.insertBefore(e, this._$AB);
  }
  T(e) {
    this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
  }
  _(e) {
    this._$AH !== c && U(this._$AH) ? this._$AA.nextSibling.data = e : this.T(R.createTextNode(e)), this._$AH = e;
  }
  $(e) {
    const { values: i, _$litType$: s } = e, r = typeof s == "number" ? this._$AC(e) : (s.el === void 0 && (s.el = D.createElement(He(s.h, s.h[0]), this.options)), s);
    if (this._$AH?._$AD === r) this._$AH.p(i);
    else {
      const n = new st(r, this), a = n.u(this.options);
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
    let s, r = 0;
    for (const n of e) r === i.length ? i.push(s = new B(this.O(V()), this.O(V()), this, this.options)) : s = i[r], s._$AI(n), r++;
    r < i.length && (this._$AR(s && s._$AB.nextSibling, r), i.length = r);
  }
  _$AR(e = this._$AA.nextSibling, i) {
    for (this._$AP?.(!1, !0, i); e !== this._$AB; ) {
      const s = fe(e).nextSibling;
      fe(e).remove(), e = s;
    }
  }
  setConnected(e) {
    this._$AM === void 0 && (this._$Cv = e, this._$AP?.(e));
  }
}
class J {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(e, i, s, r, n) {
    this.type = 1, this._$AH = c, this._$AN = void 0, this.element = e, this.name = i, this._$AM = r, this.options = n, s.length > 2 || s[0] !== "" || s[1] !== "" ? (this._$AH = Array(s.length - 1).fill(new String()), this.strings = s) : this._$AH = c;
  }
  _$AI(e, i = this, s, r) {
    const n = this.strings;
    let a = !1;
    if (n === void 0) e = O(this, e, i, 0), a = !U(e) || e !== this._$AH && e !== x, a && (this._$AH = e);
    else {
      const l = e;
      let d, p;
      for (e = n[0], d = 0; d < n.length - 1; d++) p = O(this, l[s + d], i, d), p === x && (p = this._$AH[d]), a ||= !U(p) || p !== this._$AH[d], p === c ? e = c : e !== c && (e += (p ?? "") + n[d + 1]), this._$AH[d] = p;
    }
    a && !r && this.j(e);
  }
  j(e) {
    e === c ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
  }
}
class rt extends J {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(e) {
    this.element[this.name] = e === c ? void 0 : e;
  }
}
class nt extends J {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(e) {
    this.element.toggleAttribute(this.name, !!e && e !== c);
  }
}
class at extends J {
  constructor(e, i, s, r, n) {
    super(e, i, s, r, n), this.type = 5;
  }
  _$AI(e, i = this) {
    if ((e = O(this, e, i, 0) ?? c) === x) return;
    const s = this._$AH, r = e === c && s !== c || e.capture !== s.capture || e.once !== s.once || e.passive !== s.passive, n = e !== c && (s === c || r);
    r && this.element.removeEventListener(this.name, this, s), n && this.element.addEventListener(this.name, this, e), this._$AH = e;
  }
  handleEvent(e) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, e) : this._$AH.handleEvent(e);
  }
}
class ot {
  constructor(e, i, s) {
    this.element = e, this.type = 6, this._$AN = void 0, this._$AM = i, this.options = s;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(e) {
    O(this, e);
  }
}
const dt = ae.litHtmlPolyfillSupport;
dt?.(D, B), (ae.litHtmlVersions ??= []).push("3.3.3");
const lt = (t, e, i) => {
  const s = i?.renderBefore ?? e;
  let r = s._$litPart$;
  if (r === void 0) {
    const n = i?.renderBefore ?? null;
    s._$litPart$ = r = new B(e.insertBefore(V(), n), n, void 0, i ?? {});
  }
  return r._$AI(t), r;
};
const de = globalThis;
let E = class extends L {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    const e = super.createRenderRoot();
    return this.renderOptions.renderBefore ??= e.firstChild, e;
  }
  update(e) {
    const i = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = lt(i, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    super.connectedCallback(), this._$Do?.setConnected(!0);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._$Do?.setConnected(!1);
  }
  render() {
    return x;
  }
};
E._$litElement$ = !0, E.finalized = !0, de.litElementHydrateSupport?.({ LitElement: E });
const ct = de.litElementPolyfillSupport;
ct?.({ LitElement: E });
(de.litElementVersions ??= []).push("4.2.2");
const Ie = { ATTRIBUTE: 1 }, le = (t) => (...e) => ({ _$litDirective$: t, values: e });
let ce = class {
  constructor(e) {
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AT(e, i, s) {
    this._$Ct = e, this._$AM = i, this._$Ci = s;
  }
  _$AS(e, i) {
    return this.update(e, i);
  }
  update(e, i) {
    return this.render(...i);
  }
};
const ze = "important", ht = " !" + ze, Ve = le(class extends ce {
  constructor(t) {
    if (super(t), t.type !== Ie.ATTRIBUTE || t.name !== "style" || t.strings?.length > 2) throw Error("The `styleMap` directive must be used in the `style` attribute and must be the only part in the attribute.");
  }
  render(t) {
    return Object.keys(t).reduce((e, i) => {
      const s = t[i];
      return s == null ? e : e + `${i = i.includes("-") ? i : i.replace(/(?:^(webkit|moz|ms|o)|)(?=[A-Z])/g, "-$&").toLowerCase()}:${s};`;
    }, "");
  }
  update(t, [e]) {
    const { style: i } = t.element;
    if (this.ft === void 0) return this.ft = new Set(Object.keys(e)), this.render(e);
    for (const s of this.ft) e[s] == null && (this.ft.delete(s), s.includes("-") ? i.removeProperty(s) : i[s] = null);
    for (const s in e) {
      const r = e[s];
      if (r != null) {
        this.ft.add(s);
        const n = typeof r == "string" && r.endsWith(ht);
        s.includes("-") || n ? i.setProperty(s, n ? r.slice(0, -11) : r, n ? ze : "") : i[s] = r;
      }
    }
    return x;
  }
});
const X = (t) => (e, i) => {
  i !== void 0 ? i.addInitializer(() => {
    customElements.define(t, e);
  }) : customElements.define(t, e);
};
const ut = { attribute: !0, type: String, converter: q, reflect: !1, hasChanged: ne }, pt = (t = ut, e, i) => {
  const { kind: s, metadata: r } = i;
  let n = globalThis.litPropertyMetadata.get(r);
  if (n === void 0 && globalThis.litPropertyMetadata.set(r, n = /* @__PURE__ */ new Map()), s === "setter" && ((t = Object.create(t)).wrapped = !0), n.set(i.name, t), s === "accessor") {
    const { name: a } = i;
    return { set(l) {
      const d = e.get.call(this);
      e.set.call(this, l), this.requestUpdate(a, d, t, !0, l);
    }, init(l) {
      return l !== void 0 && this.C(a, void 0, t, l), l;
    } };
  }
  if (s === "setter") {
    const { name: a } = i;
    return function(l) {
      const d = this[a];
      e.call(this, l), this.requestUpdate(a, d, t, !0, l);
    };
  }
  throw Error("Unsupported decorator location: " + s);
};
function g(t) {
  return (e, i) => typeof i == "object" ? pt(t, e, i) : ((s, r, n) => {
    const a = r.hasOwnProperty(n);
    return r.constructor.createProperty(n, s), a ? Object.getOwnPropertyDescriptor(r, n) : void 0;
  })(t, e, i);
}
function m(t) {
  return g({ ...t, state: !0, attribute: !1 });
}
const vt = {
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
  "editor.live_muted": "Live-Audio stumm starten",
  "editor.card_appearance": "Kartendarstellung",
  "editor.name": "Kameraname",
  "editor.show_name": "Namen auf Karte anzeigen",
  "editor.aspect_ratio": "Bildformat",
  "editor.fit_mode": "Bildanpassung",
  "editor.helper_default_mode": "Beim direkten Öffnen der Live-Ansicht wird eine Ring-Live-Sitzung gestartet.",
  "editor.helper_live_muted": "Deaktiviert lassen, um – sofern vom Browser erlaubt – mit Ton zu starten.",
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
  "config.aspect_ratio": "aspect_ratio ist ungültig.",
  "config.fit_mode": "fit_mode ist ungültig.",
  "viewer.close_aria": "Kameraansicht schließen",
  "viewer.camera_view": "Kameraansicht",
  "viewer.entity_unavailable": "Kamera-Entität ist nicht verfügbar.",
  "viewer.suspended": "Wiedergabe pausiert, solange dieser Tab ausgeblendet ist.",
  "viewer.connecting_live": "Ring-Live-Ansicht wird verbunden…",
  "viewer.loading_recording": "Letzte Aufnahme wird geladen…",
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
}, mt = {
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
  "editor.live_muted": "Start live audio muted",
  "editor.card_appearance": "Card appearance",
  "editor.name": "Camera name",
  "editor.show_name": "Show name on card",
  "editor.aspect_ratio": "Image shape",
  "editor.fit_mode": "Image crop",
  "editor.helper_default_mode": "Opening directly on Live starts a Ring live session.",
  "editor.helper_live_muted": "Leave off to start with sound when the browser allows it.",
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
  "config.aspect_ratio": "aspect_ratio is invalid.",
  "config.fit_mode": "fit_mode is invalid.",
  "viewer.close_aria": "Close camera viewer",
  "viewer.camera_view": "Camera view",
  "viewer.entity_unavailable": "Camera entity is unavailable.",
  "viewer.suspended": "Playback paused while this tab is hidden.",
  "viewer.connecting_live": "Connecting to Ring live view…",
  "viewer.loading_recording": "Loading last recording…",
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
  de: vt,
  en: mt
};
function ft(t) {
  const e = typeof document > "u" ? void 0 : document.documentElement.lang, i = typeof navigator > "u" ? void 0 : navigator.language;
  return t?.language || t?.locale?.language || e || i || "en";
}
function gt(t) {
  return ft(t).trim().toLowerCase().split(/[-_]/)[0] === "de" ? "de" : "en";
}
function o(t, e, i = {}) {
  return (Ae[gt(t)][e] ?? Ae.en[e]).replace(
    /\{([a-z_]+)\}/gi,
    (r, n) => n in i ? String(i[n]) : r
  );
}
function Ue(t, e, i) {
  return t?.localize?.(e) || o(t, i);
}
const he = "custom:ring-view", ee = "ring-view", bt = "Ring View", I = {
  default_mode: "last_recording",
  live_muted: !1,
  show_name: !1,
  aspect_ratio: "16:9",
  fit_mode: "cover"
}, wt = /* @__PURE__ */ new Set(["last_recording", "live"]), _t = /* @__PURE__ */ new Set(["auto", "16:9", "4:3", "1:1"]), yt = /* @__PURE__ */ new Set(["cover", "contain"]);
function Ee(t, e) {
  if (typeof t != "string" || !t.startsWith("camera."))
    throw new Error(
      o(void 0, "config.entity_required", {
        label: o(void 0, e)
      })
    );
}
function $t(t) {
  if (!t || typeof t != "object")
    throw new Error(o(void 0, "config.invalid"));
  if (Ee(t.recording_entity, "config.recording_entity"), Ee(t.live_entity, "config.live_entity"), t.default_mode && !wt.has(t.default_mode))
    throw new Error(o(void 0, "config.default_mode"));
  if (t.aspect_ratio && !_t.has(t.aspect_ratio))
    throw new Error(o(void 0, "config.aspect_ratio"));
  if (t.fit_mode && !yt.has(t.fit_mode))
    throw new Error(o(void 0, "config.fit_mode"));
}
function te(t) {
  return $t(t), {
    type: t.type ?? he,
    recording_entity: t.recording_entity,
    live_entity: t.live_entity,
    name: t.name,
    default_mode: t.default_mode ?? I.default_mode,
    live_muted: t.live_muted ?? I.live_muted,
    show_name: t.show_name ?? I.show_name,
    aspect_ratio: t.aspect_ratio ?? I.aspect_ratio,
    fit_mode: t.fit_mode ?? I.fit_mode,
    grid_options: t.grid_options
  };
}
function xe(t) {
  return t.default_mode;
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
function At(t) {
  return t === "auto" ? "16 / 9" : t.replace(":", " / ");
}
const Et = 9e3, Se = /* @__PURE__ */ new WeakMap();
function Ne(t, e, i) {
  const s = e?.attributes.entity_picture;
  return typeof s == "string" && s.length > 0 ? t.hassUrl(s) : t.hassUrl(`/api/camera_proxy/${encodeURIComponent(i)}`);
}
async function xt(t, e, i, s) {
  const r = await St(t, e), n = r.includes("?") ? "&" : "?";
  return `${r}${n}width=${Ce(i)}&height=${Ce(s)}`;
}
function Ce(t) {
  return Math.max(1, Math.ceil(Number.isFinite(t) ? t : 1));
}
async function St(t, e) {
  let i = Se.get(t);
  i || (i = /* @__PURE__ */ new Map(), Se.set(t, i));
  const s = Date.now(), r = i.get(e);
  if (r && r.expiresAt > s) return r.promise;
  const n = t.callWS({
    type: "auth/sign_path",
    path: `/api/camera_proxy/${encodeURIComponent(e)}`
  }).then((a) => {
    if (!a || typeof a.path != "string" || a.path.length === 0)
      throw new Error("Home Assistant did not return a signed camera path.");
    return t.hassUrl(a.path);
  });
  i.set(e, {
    expiresAt: s + Et,
    promise: n
  });
  try {
    return await n;
  } catch (a) {
    throw i.delete(e), a;
  }
}
var Ct = "M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z", kt = "M13.5,8H12V13L16.28,15.54L17,14.33L13.5,12.25V8M13,3A9,9 0 0,0 4,12H1L4.96,16.03L9,12H6A7,7 0 0,1 13,5A7,7 0 0,1 20,12A7,7 0 0,1 13,19C11.07,19 9.32,18.21 8.06,16.94L6.64,18.36C8.27,20 10.5,21 13,21A9,9 0 0,0 22,12A9,9 0 0,0 13,3", Pt = "M19,19H5V5H19M19,3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5A2,2 0 0,0 19,3M13.96,12.29L11.21,15.83L9.25,13.47L6.5,17H17.5L13.96,12.29Z", Rt = "M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M10,16.5L16,12L10,7.5V16.5Z";
function ie(t) {
  return t === "live" ? u`<span class="mode-icon mode-icon-live" aria-hidden="true"></span>` : u`
    <svg class="mode-icon mode-icon-recording" viewBox="0 0 24 24" aria-hidden="true">
      <path d=${kt}></path>
    </svg>
  `;
}
function Lt(t, e) {
  return o(
    e,
    t === "live" ? "common.live" : "common.last_recording"
  );
}
const Mt = le(class extends ce {
  constructor(t) {
    if (super(t), t.type !== Ie.ATTRIBUTE || t.name !== "class" || t.strings?.length > 2) throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.");
  }
  render(t) {
    return " " + Object.keys(t).filter((e) => t[e]).join(" ") + " ";
  }
  update(t, [e]) {
    if (this.st === void 0) {
      this.st = /* @__PURE__ */ new Set(), t.strings !== void 0 && (this.nt = new Set(t.strings.join(" ").split(/\s/).filter((s) => s !== "")));
      for (const s in e) e[s] && !this.nt?.has(s) && this.st.add(s);
      return this.render(e);
    }
    const i = t.element.classList;
    for (const s of this.st) s in e || (i.remove(s), this.st.delete(s));
    for (const s in e) {
      const r = !!e[s];
      r === this.st.has(s) || this.nt?.has(s) || (r ? (i.add(s), this.st.add(s)) : (i.remove(s), this.st.delete(s)));
    }
    return x;
  }
});
const Ot = {}, Tt = (t, e = Ot) => t._$AH = e;
const ke = le(class extends ce {
  constructor() {
    super(...arguments), this.key = c;
  }
  render(t, e) {
    return this.key = t, e;
  }
  update(t, [e, i]) {
    return e !== this.key && (Tt(t), this.key = e), i;
  }
});
var Ht = Object.defineProperty, It = Object.getOwnPropertyDescriptor, $ = (t, e, i, s) => {
  for (var r = s > 1 ? void 0 : s ? It(e, i) : e, n = t.length - 1, a; n >= 0; n--)
    (a = t[n]) && (r = (s ? a(e, i, r) : a(r)) || r);
  return s && r && Ht(e, i, r), r;
};
const Z = "ha-camera-stream", zt = 8e3, Pe = "ring-view-native-layout";
async function Vt(t, e) {
  if (customElements.get(t)) return !0;
  let i;
  try {
    return await Promise.race([
      customElements.whenDefined(t),
      new Promise((s, r) => {
        i = window.setTimeout(() => r(new Error("timeout")), e);
      })
    ]), !!customElements.get(t);
  } catch {
    return !1;
  } finally {
    i !== void 0 && window.clearTimeout(i);
  }
}
async function Be() {
  if (customElements.get(Z)) return !0;
  try {
    await (await window.loadCardHelpers?.())?.importMoreInfoControl?.("camera");
  } catch {
  }
  return Vt(Z, zt);
}
let _ = class extends E {
  constructor() {
    super(...arguments), this.controls = !0, this.muted = !0, this.allowExoPlayer = !0, this.fitMode = "cover", this.passiveSurface = !1, this.nativeAvailable = !!customElements.get(Z), this.handledStreamEvents = /* @__PURE__ */ new WeakSet(), this.ready = !1, this.handleSurfaceClick = (t) => {
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
    const t = this.renderRoot.querySelector(Z);
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
_.styles = G`
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
  g({ attribute: !1 })
], _.prototype, "stateObj", 2);
$([
  g({ type: Boolean })
], _.prototype, "controls", 2);
$([
  g({ type: Boolean })
], _.prototype, "muted", 2);
$([
  g({ type: Boolean, attribute: "allow-exoplayer" })
], _.prototype, "allowExoPlayer", 2);
$([
  g({ type: Number, attribute: !1 })
], _.prototype, "aspectRatio", 2);
$([
  g({ attribute: !1 })
], _.prototype, "fitMode", 2);
$([
  g({ type: Boolean, attribute: "passive-surface" })
], _.prototype, "passiveSurface", 2);
$([
  m()
], _.prototype, "nativeAvailable", 2);
_ = $([
  X("ring-view-native-camera-adapter")
], _);
const Ut = G`
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
    inset-inline: 0;
    bottom: 0;
    padding: 24px 16px 14px;
    overflow: hidden;
    color: var(--ha-picture-card-text-color, #fff);
    background: linear-gradient(transparent, rgba(0, 0, 0, 0.72));
    font-size: var(--ha-font-size-l, 16px);
    font-weight: 500;
    line-height: 20px;
    text-overflow: ellipsis;
    white-space: nowrap;
    pointer-events: none;
  }

  .mode-indicator {
    position: absolute;
    inset-inline-end: 12px;
    top: 12px;
    box-sizing: border-box;
    display: grid;
    width: 32px;
    height: 32px;
    place-items: center;
    border: 1px solid rgba(255, 255, 255, 0.22);
    border-radius: 50%;
    color: #fff;
    background: rgba(20, 24, 28, 0.68);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    pointer-events: none;
  }

  .mode-indicator .mode-icon-recording {
    width: 18px;
    height: 18px;
    fill: currentColor;
  }

  .mode-indicator .mode-icon-live {
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: var(--error-color, #db4437);
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.55);
  }

  @media (prefers-reduced-motion: reduce) {
    .preview:active::after {
      display: none;
    }
  }
`, Dt = G`
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
`, Nt = G`
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
`, Bt = 2;
function M(t) {
  return !t || t.state === "unavailable" || t.state === "unknown";
}
function jt(t) {
  return (Number(t?.attributes.supported_features ?? 0) & Bt) !== 0;
}
function Ft(t) {
  return !!(t?.attributes.video_url || t?.attributes.entity_picture);
}
function Kt(t, e) {
  if (!t || !e) return [];
  const i = t.states[e.recording_entity], s = t.states[e.live_entity], r = [];
  return M(i) ? r.push({
    kind: "recording",
    message: o(t, "warning.unavailable", {
      name: N(i, e.recording_entity)
    })
  }) : Ft(i) || r.push({
    kind: "recording",
    message: o(t, "warning.recording_media")
  }), M(s) ? r.push({
    kind: "live",
    message: o(t, "warning.unavailable", {
      name: N(s, e.live_entity)
    })
  }) : jt(s) || r.push({
    kind: "live",
    message: o(t, "warning.live_stream")
  }), customElements.get("ha-camera-stream") || r.push({
    kind: "compatibility",
    message: o(t, "warning.compatibility")
  }), r;
}
function N(t, e) {
  return t?.attributes.friendly_name || e;
}
class qt {
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
    const s = this.generation;
    this.timeoutId = window.setTimeout(() => {
      s === this.generation && e();
    }, i);
  }
  clearTimeout() {
    this.timeoutId !== void 0 && (window.clearTimeout(this.timeoutId), this.timeoutId = void 0);
  }
  dispose() {
    this.clearTimeout(), this.generation += 1;
  }
}
var Wt = Object.defineProperty, Zt = Object.getOwnPropertyDescriptor, b = (t, e, i, s) => {
  for (var r = s > 1 ? void 0 : s ? Zt(e, i) : e, n = t.length - 1, a; n >= 0; n--)
    (a = t[n]) && (r = (s ? a(e, i, r) : a(r)) || r);
  return s && r && Wt(e, i, r), r;
};
const Gt = 20;
let f = class extends E {
  constructor() {
    super(...arguments), this.open = !1, this.mode = "last_recording", this.mediaStatus = "idle", this.session = 0, this.suspended = !1, this.recordingMuted = !1, this.liveMuted = !0, this.recordingVideoFailed = !1, this.retryCount = 0, this.statusAnnouncement = "", this.lifecycle = new qt(), this.historyMarker = `ring-view-${Math.random().toString(36).slice(2)}`, this.ownsHistoryEntry = !1, this.audioFallbackAttempted = !1, this.recordingPlaybackPending = !1, this.recordingPlaybackStarted = !1, this.handleMediaReady = () => {
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
      const i = e[0], s = e[e.length - 1], r = this.shadowRoot?.activeElement;
      t.shiftKey && r === i ? (t.preventDefault(), s.focus()) : !t.shiftKey && r === s && (t.preventDefault(), i.focus());
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
    !this.config || !this.hass || this.open || (this.opener = e, this.mode = t, this.liveMuted = this.config.live_muted, this.retryCount = 0, this.audioFallbackAttempted = !1, this.recordingPlaybackPending = !1, this.recordingPlaybackStarted = !1, this.recordingMuted = !1, this.liveHasAudio = void 0, this.recordingVideoFailed = !1, this.suspended = !1, this.open = !0, this.pushHistoryEntry(), this.attachGlobalListeners(), this.startMedia(), this.updateComplete.then(() => this.focusInitialControl()));
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
    M(e) && this.mediaStatus !== "error" && (this.lifecycle.dispose(), this.session = this.lifecycle.current(), this.mediaStatus = "error", this.statusAnnouncement = o(this.hass, "viewer.entity_unavailable"));
  }
  render() {
    if (!this.open || !this.hass || !this.config) return c;
    const t = this.dialogTitle(), e = this.config.aspect_ratio, i = {
      "--ring-view-aspect-ratio": e === "auto" ? "16 / 9" : e.replace(":", " / "),
      "--ring-view-fit-mode": this.config.fit_mode
    };
    return u`
      <div class="backdrop" @pointerdown=${this.handleBackdrop}></div>
      <section
        class="dialog"
        style=${Ve(i)}
        role="dialog"
        aria-modal="true"
        aria-labelledby="ring-view-dialog-title"
        @keydown=${this.handleKeyDown}
      >
        <div class="body">
          ${this.renderMedia()}
          <header class="header">
            <h2 id="ring-view-dialog-title">${t}</h2>
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
                ${this.icon(Ct)}
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
          ${ie("last_recording")}
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
          ${ie("live")}
        </button>
      </div>
    `;
  }
  renderMedia() {
    const t = this.activeEntity(), e = this.activeEntityId(), i = M(t), s = !i && !this.suspended, r = De(this.config.aspect_ratio), n = Ne(this.hass, t, e), a = this.mode === "last_recording" && typeof t?.attributes.video_url == "string" ? t.attributes.video_url : void 0, l = !!(s && a && !this.recordingVideoFailed);
    return u`
      <div
        class=${Mt({
      "media-frame": !0,
      "auto-ratio": this.config.aspect_ratio === "auto"
    })}
        role="tabpanel"
        aria-labelledby=${this.mode === "live" ? "ring-view-tab-live" : "ring-view-tab-recording"}
      >
        <img class="poster" src=${n} alt="" aria-hidden="true" />
        ${s && !l && this.mediaStatus !== "compatibility" ? ke(
      `${e}:${this.session}`,
      u`
                <ring-view-native-camera-adapter
                  class=${this.mediaStatus === "pending" ? "pending" : ""}
                  .stateObj=${t}
                  .controls=${!0}
                  .muted=${this.mode === "live" ? this.liveMuted : this.recordingMuted}
                  .allowExoPlayer=${!0}
                  .aspectRatio=${r}
                  .fitMode=${this.config.fit_mode}
                  .passiveSurface=${this.mode === "live"}
                  @native-media-ready=${this.handleMediaReady}
                  @native-media-error=${this.handleMediaError}
                  @native-media-capabilities=${this.handleMediaCapabilities}
                ></ring-view-native-camera-adapter>
              `
    ) : c}
        ${l ? ke(
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
    !this.config || t === this.mode || (this.lifecycle.dispose(), this.mode = t, this.liveMuted = this.config.live_muted, this.retryCount = 0, this.audioFallbackAttempted = !1, this.recordingPlaybackPending = !1, this.recordingPlaybackStarted = !1, this.recordingMuted = !1, this.liveHasAudio = void 0, this.recordingVideoFailed = !1, this.statusAnnouncement = o(
      this.hass,
      t === "live" ? "viewer.mode_selected_live" : "viewer.mode_selected_recording"
    ), this.startMedia());
  }
  startMedia() {
    if (!this.open || this.suspended) {
      this.mediaStatus = "idle";
      return;
    }
    if (M(this.activeEntity())) {
      this.mediaStatus = "error", this.statusAnnouncement = o(this.hass, "viewer.entity_unavailable");
      return;
    }
    this.mediaStatus = "pending", this.session = this.lifecycle.next(), this.lifecycle.scheduleTimeout(
      () => this.failMedia(!0),
      Gt * 1e3
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
    !this.open && !this.isConnected || (this.lifecycle.dispose(), this.session = this.lifecycle.current(), this.mediaStatus = "idle", this.open = !1, this.suspended = !1, this.recordingPlaybackPending = !1, this.recordingPlaybackStarted = !1, this.recordingMuted = !1, this.liveHasAudio = void 0, this.recordingVideoFailed = !1, this.detachGlobalListeners(), document.fullscreenElement && document.exitFullscreen().catch(() => {
    }), this.dispatchEvent(
      new CustomEvent("viewer-closed", { bubbles: !0, composed: !0 })
    ), t && this.opener?.focus(), this.opener = void 0);
  }
  icon(t) {
    return u`<svg viewBox="0 0 24 24" aria-hidden="true"><path d=${t}></path></svg>`;
  }
};
f.styles = Dt;
b([
  g({ attribute: !1 })
], f.prototype, "hass", 2);
b([
  g({ attribute: !1 })
], f.prototype, "config", 2);
b([
  g({ type: Boolean, reflect: !0 })
], f.prototype, "open", 2);
b([
  m()
], f.prototype, "mode", 2);
b([
  m()
], f.prototype, "mediaStatus", 2);
b([
  m()
], f.prototype, "session", 2);
b([
  m()
], f.prototype, "suspended", 2);
b([
  m()
], f.prototype, "recordingMuted", 2);
b([
  m()
], f.prototype, "liveMuted", 2);
b([
  m()
], f.prototype, "liveHasAudio", 2);
b([
  m()
], f.prototype, "recordingVideoFailed", 2);
b([
  m()
], f.prototype, "retryCount", 2);
b([
  m()
], f.prototype, "statusAnnouncement", 2);
f = b([
  X("ring-view-dialog")
], f);
var Yt = Object.defineProperty, Jt = Object.getOwnPropertyDescriptor, T = (t, e, i, s) => {
  for (var r = s > 1 ? void 0 : s ? Jt(e, i) : e, n = t.length - 1, a; n >= 0; n--)
    (a = t[n]) && (r = (s ? a(e, i, r) : a(r)) || r);
  return s && r && Yt(e, i, r), r;
};
const Xt = 1e4, Qt = 640, ei = 16 / 9, Re = 16;
let S = class extends E {
  constructor() {
    super(...arguments), this.previewFailed = !1, this.previewIntersecting = !1, this.previewVisible = !1, this.previewRequestId = 0, this.openViewer = () => {
      const t = this.renderRoot.querySelector(".preview") ?? void 0;
      this.renderRoot.querySelector("ring-view-dialog")?.show(xe(this.config), t);
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
    return await Promise.resolve().then(() => ai), document.createElement("ring-view-editor");
  }
  static getStubConfig(t) {
    const e = Object.keys(t?.states ?? {}).filter((r) => r.startsWith("camera.")), i = e.find(
      (r) => (Number(t?.states[r]?.attributes.supported_features ?? 0) & 2) !== 0
    ) ?? e.find((r) => /live(_view)?$/i.test(r)) ?? e[1] ?? "camera.live_view", s = e.find(
      (r) => r !== i && (Number(t?.states[r]?.attributes.supported_features ?? 0) & 2) === 0
    ) ?? e.find((r) => r !== i) ?? e[0] ?? "camera.latest_recording";
    return {
      type: he,
      recording_entity: s,
      live_entity: i
    };
  }
  setConfig(t) {
    this.config = te(t);
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
      this.isConnected && this.setupPreviewLifecycle();
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
    if (!this.hass || !this.config) return;
    const t = this.previewEntityId(), e = Ne(this.hass, this.hass.states[t], t);
    (t !== this.activePreviewEntityId || e !== this.lastFallbackPoster) && (this.activePreviewEntityId = t, this.lastFallbackPoster = e, this.lastPoster = e, this.lastPreviewSize = void 0, this.previewRequestId += 1, this.previewFailed = !1);
  }
  updated(t) {
    const e = t.has("config");
    (t.has("hass") || e) && this.previewVisible && this.refreshPreview(!0);
  }
  render() {
    if (!this.hass || !this.config) return c;
    const t = this.previewEntityId(), e = this.hass.states[t], i = this.config.name || N(
      this.hass.states[this.config.recording_entity],
      o(this.hass, "common.camera")
    ), s = xe(this.config), r = M(e), n = {
      "--ring-view-aspect-ratio": At(this.config.aspect_ratio),
      "--ring-view-fit-mode": this.config.fit_mode
    };
    return u`
      <ha-card>
        <div
          class="preview"
          style=${Ve(n)}
          role="button"
          tabindex="0"
          aria-label=${o(this.hass, "card.open_viewer", {
      name: i,
      mode: Lt(s, this.hass)
    })}
          title=${o(
      this.hass,
      s === "live" ? "card.open_live" : "card.open_recording"
    )}
          @click=${this.openViewer}
          @keydown=${this.handleKeyDown}
        >
          ${!r && !this.previewFailed ? u`
                <img
                  src=${this.lastPoster ?? ""}
                  alt=${o(this.hass, "card.preview_alt", { name: i })}
                  @error=${this.handlePreviewError}
                />
              ` : u`<div class="placeholder">
                ${o(this.hass, "card.preview_unavailable")}
              </div>`}
          ${this.config.show_name ? u`<div class="name">${i}</div>` : c}
          <div
            class=${`mode-indicator ${s === "live" ? "live" : "recording"}`}
            aria-hidden="true"
          >
            ${ie(s)}
          </div>
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
    return this.config.recording_entity;
  }
  setupPreviewLifecycle() {
    if (this.previewIntersectionObserver || this.previewResizeObserver) return;
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
    const t = this.previewIntersecting && document.visibilityState !== "hidden";
    if (t !== this.previewVisible) {
      if (this.previewVisible = t, t) {
        this.refreshPreview(!0), this.previewRefreshTimer = window.setInterval(() => {
          this.refreshPreview(!0);
        }, Xt);
        return;
      }
      this.stopPreviewRefreshTimer(), this.previewRequestId += 1;
    }
  }
  stopPreviewRefreshTimer() {
    this.previewRefreshTimer !== void 0 && (window.clearInterval(this.previewRefreshTimer), this.previewRefreshTimer = void 0);
  }
  async refreshPreview(t) {
    if (!this.previewVisible || !this.hass || !this.config) return;
    const e = this.renderRoot.querySelector(".preview");
    if (!e) return;
    const i = Math.max(1, window.devicePixelRatio || 1), s = e.clientWidth || e.getBoundingClientRect().width, r = s > 0 ? s : Qt, n = e.clientHeight || e.getBoundingClientRect().height, a = De(this.config.aspect_ratio) ?? ei, l = n > 0 ? n : r / a, d = Math.ceil(r * i), p = Math.ceil(l * i);
    if (!t && this.lastPreviewSize && Math.abs(d - this.lastPreviewSize.width) < Re && Math.abs(p - this.lastPreviewSize.height) < Re)
      return;
    this.lastPreviewSize = { width: d, height: p };
    const v = this.previewEntityId(), h = this.hass, w = ++this.previewRequestId;
    try {
      const y = await xt(h, v, d, p);
      if (w !== this.previewRequestId || !this.isConnected || !this.previewVisible || this.previewEntityId() !== v)
        return;
      this.lastPoster = y, this.previewFailed = !1;
    } catch {
    }
  }
};
S.styles = Ut;
T([
  g({ attribute: !1 })
], S.prototype, "hass", 2);
T([
  g({ reflect: !0 })
], S.prototype, "layout", 2);
T([
  m()
], S.prototype, "config", 2);
T([
  m()
], S.prototype, "previewFailed", 2);
T([
  m()
], S.prototype, "lastPoster", 2);
S = T([
  X(ee)
], S);
window.customCards = window.customCards || [];
window.customCards.some((t) => t.type === ee) || window.customCards.push({
  type: ee,
  name: bt,
  description: o(void 0, "card.description"),
  preview: !0,
  getEntitySuggestion: (t, e) => {
    if (!e.startsWith("camera.")) return null;
    const i = Object.keys(t.states).find(
      (s) => s !== e && s.startsWith("camera.") && /live(_view)?$/i.test(s)
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
var ti = Object.defineProperty, ii = Object.getOwnPropertyDescriptor, j = (t, e, i, s) => {
  for (var r = s > 1 ? void 0 : s ? ii(e, i) : e, n = t.length - 1, a; n >= 0; n--)
    (a = t[n]) && (r = (s ? a(e, i, r) : a(r)) || r);
  return s && r && ti(e, i, r), r;
};
function si(t) {
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
      iconPath: Rt,
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
        { name: "live_muted", selector: { boolean: {} } }
      ]
    },
    {
      name: "card_appearance",
      type: "expandable",
      flatten: !0,
      iconPath: Pt,
      schema: [
        { name: "name", selector: { text: {} } },
        { name: "show_name", selector: { boolean: {} } },
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
const ri = {
  recording_entity: "editor.recording_entity",
  live_entity: "editor.live_entity",
  viewer_behavior: "editor.viewer_behavior",
  default_mode: "editor.default_mode",
  live_muted: "editor.live_muted",
  card_appearance: "editor.card_appearance",
  name: "editor.name",
  show_name: "editor.show_name",
  aspect_ratio: "editor.aspect_ratio",
  fit_mode: "editor.fit_mode"
}, ni = {
  default_mode: "editor.helper_default_mode",
  live_muted: "editor.helper_live_muted"
};
let C = class extends E {
  constructor() {
    super(...arguments), this.nativeChecked = !1, this.nativeAvailable = !1, this.computeLabel = (t) => {
      const e = ri[t.name];
      if (!e) return;
      const i = o(this.hass, e);
      if (t.name !== "name") return i;
      const s = Ue(
        this.hass,
        "ui.panel.lovelace.editor.card.config.optional",
        "common.optional"
      );
      return `${i} (${s})`;
    }, this.computeHelper = (t) => {
      const e = ni[t.name];
      return e ? o(this.hass, e) : void 0;
    }, this.valueChanged = (t) => {
      if (!this.config) return;
      const e = te({
        ...this.config,
        ...t.detail.value
      });
      this.config = e;
      const i = Object.fromEntries(
        Object.entries(e).filter(([, s]) => s !== void 0)
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
    this.config = te(t);
  }
  connectedCallback() {
    super.connectedCallback(), Be().then((t) => {
      this.isConnected && (this.nativeAvailable = t, this.nativeChecked = !0);
    });
  }
  render() {
    if (!this.hass || !this.config) return c;
    const t = Kt(this.hass, this.config).filter(
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
        .schema=${si(this.hass)}
        .computeLabel=${this.computeLabel}
        .computeHelper=${this.computeHelper}
        @value-changed=${this.valueChanged}
      ></ha-form>
    `;
  }
};
C.styles = Nt;
j([
  g({ attribute: !1 })
], C.prototype, "hass", 2);
j([
  m()
], C.prototype, "config", 2);
j([
  m()
], C.prototype, "nativeChecked", 2);
j([
  m()
], C.prototype, "nativeAvailable", 2);
C = j([
  X("ring-view-editor")
], C);
const ai = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get RingViewEditor() {
    return C;
  }
}, Symbol.toStringTag, { value: "Module" }));
export {
  S as RingView
};
