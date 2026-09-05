const B = globalThis, ie = B.ShadowRoot && (B.ShadyCSS === void 0 || B.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, se = /* @__PURE__ */ Symbol(), ue = /* @__PURE__ */ new WeakMap();
let Me = class {
  constructor(e, i, s) {
    if (this._$cssResult$ = !0, s !== se) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = e, this.t = i;
  }
  get styleSheet() {
    let e = this.o;
    const i = this.t;
    if (ie && e === void 0) {
      const s = i !== void 0 && i.length === 1;
      s && (e = ue.get(i)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), s && ue.set(i, e));
    }
    return e;
  }
  toString() {
    return this.cssText;
  }
};
const Fe = (t) => new Me(typeof t == "string" ? t : t + "", void 0, se), Z = (t, ...e) => {
  const i = t.length === 1 ? t[0] : e.reduce((s, r, o) => s + ((a) => {
    if (a._$cssResult$ === !0) return a.cssText;
    if (typeof a == "number") return a;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + a + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(r) + t[o + 1], t[0]);
  return new Me(i, t, se);
}, Be = (t, e) => {
  if (ie) t.adoptedStyleSheets = e.map((i) => i instanceof CSSStyleSheet ? i : i.styleSheet);
  else for (const i of e) {
    const s = document.createElement("style"), r = B.litNonce;
    r !== void 0 && s.setAttribute("nonce", r), s.textContent = i.cssText, t.appendChild(s);
  }
}, ve = ie ? (t) => t : (t) => t instanceof CSSStyleSheet ? ((e) => {
  let i = "";
  for (const s of e.cssRules) i += s.cssText;
  return Fe(i);
})(t) : t;
const { is: qe, defineProperty: We, getOwnPropertyDescriptor: Ke, getOwnPropertyNames: Ge, getOwnPropertySymbols: Ze, getPrototypeOf: Ye } = Object, Y = globalThis, me = Y.trustedTypes, Xe = me ? me.emptyScript : "", Je = Y.reactiveElementPolyfillSupport, V = (t, e) => t, q = { toAttribute(t, e) {
  switch (e) {
    case Boolean:
      t = t ? Xe : null;
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
} }, re = (t, e) => !qe(t, e), fe = { attribute: !0, type: String, converter: q, reflect: !1, useDefault: !1, hasChanged: re };
Symbol.metadata ??= /* @__PURE__ */ Symbol("metadata"), Y.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
let M = class extends HTMLElement {
  static addInitializer(e) {
    this._$Ei(), (this.l ??= []).push(e);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(e, i = fe) {
    if (i.state && (i.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((i = Object.create(i)).wrapped = !0), this.elementProperties.set(e, i), !i.noAccessor) {
      const s = /* @__PURE__ */ Symbol(), r = this.getPropertyDescriptor(e, s, i);
      r !== void 0 && We(this.prototype, e, r);
    }
  }
  static getPropertyDescriptor(e, i, s) {
    const { get: r, set: o } = Ke(this.prototype, e) ?? { get() {
      return this[i];
    }, set(a) {
      this[i] = a;
    } };
    return { get: r, set(a) {
      const d = r?.call(this);
      o?.call(this, a), this.requestUpdate(e, d, s);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(e) {
    return this.elementProperties.get(e) ?? fe;
  }
  static _$Ei() {
    if (this.hasOwnProperty(V("elementProperties"))) return;
    const e = Ye(this);
    e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(V("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(V("properties"))) {
      const i = this.properties, s = [...Ge(i), ...Ze(i)];
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
      for (const r of s) i.unshift(ve(r));
    } else e !== void 0 && i.push(ve(e));
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
    return Be(e, this.constructor.elementStyles), e;
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
      const o = (s.converter?.toAttribute !== void 0 ? s.converter : q).toAttribute(i, s.type);
      this._$Em = e, o == null ? this.removeAttribute(r) : this.setAttribute(r, o), this._$Em = null;
    }
  }
  _$AK(e, i) {
    const s = this.constructor, r = s._$Eh.get(e);
    if (r !== void 0 && this._$Em !== r) {
      const o = s.getPropertyOptions(r), a = typeof o.converter == "function" ? { fromAttribute: o.converter } : o.converter?.fromAttribute !== void 0 ? o.converter : q;
      this._$Em = r;
      const d = a.fromAttribute(i, o.type);
      this[r] = d ?? this._$Ej?.get(r) ?? d, this._$Em = null;
    }
  }
  requestUpdate(e, i, s, r = !1, o) {
    if (e !== void 0) {
      const a = this.constructor;
      if (r === !1 && (o = this[e]), s ??= a.getPropertyOptions(e), !((s.hasChanged ?? re)(o, i) || s.useDefault && s.reflect && o === this._$Ej?.get(e) && !this.hasAttribute(a._$Eu(e, s)))) return;
      this.C(e, i, s);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(e, i, { useDefault: s, reflect: r, wrapped: o }, a) {
    s && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(e) && (this._$Ej.set(e, a ?? i ?? this[e]), o !== !0 || a !== void 0) || (this._$AL.has(e) || (this.hasUpdated || s || (i = void 0), this._$AL.set(e, i)), r === !0 && this._$Em !== e && (this._$Eq ??= /* @__PURE__ */ new Set()).add(e));
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
        for (const [r, o] of this._$Ep) this[r] = o;
        this._$Ep = void 0;
      }
      const s = this.constructor.elementProperties;
      if (s.size > 0) for (const [r, o] of s) {
        const { wrapped: a } = o, d = this[r];
        a !== !0 || this._$AL.has(r) || d === void 0 || this.C(r, void 0, o, d);
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
M.elementStyles = [], M.shadowRootOptions = { mode: "open" }, M[V("elementProperties")] = /* @__PURE__ */ new Map(), M[V("finalized")] = /* @__PURE__ */ new Map(), Je?.({ ReactiveElement: M }), (Y.reactiveElementVersions ??= []).push("2.1.2");
const oe = globalThis, ge = (t) => t, W = oe.trustedTypes, be = W ? W.createPolicy("lit-html", { createHTML: (t) => t }) : void 0, Le = "$lit$", x = `lit$${Math.random().toFixed(9).slice(2)}$`, He = "?" + x, Qe = `<${He}>`, R = document, U = () => R.createComment(""), D = (t) => t === null || typeof t != "object" && typeof t != "function", ae = Array.isArray, et = (t) => ae(t) || typeof t?.[Symbol.iterator] == "function", Q = `[ 	
\f\r]`, I = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, ye = /-->/g, we = />/g, k = RegExp(`>|${Q}(?:([^\\s"'>=/]+)(${Q}*=${Q}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), _e = /'/g, $e = /"/g, Te = /^(?:script|style|textarea|title)$/i, tt = (t) => (e, ...i) => ({ _$litType$: t, strings: e, values: i }), c = tt(1), E = /* @__PURE__ */ Symbol.for("lit-noChange"), l = /* @__PURE__ */ Symbol.for("lit-nothing"), xe = /* @__PURE__ */ new WeakMap(), P = R.createTreeWalker(R, 129);
function Oe(t, e) {
  if (!ae(t) || !t.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return be !== void 0 ? be.createHTML(e) : e;
}
const it = (t, e) => {
  const i = t.length - 1, s = [];
  let r, o = e === 2 ? "<svg>" : e === 3 ? "<math>" : "", a = I;
  for (let d = 0; d < i; d++) {
    const n = t[d];
    let p, u, h = -1, b = 0;
    for (; b < n.length && (a.lastIndex = b, u = a.exec(n), u !== null); ) b = a.lastIndex, a === I ? u[1] === "!--" ? a = ye : u[1] !== void 0 ? a = we : u[2] !== void 0 ? (Te.test(u[2]) && (r = RegExp("</" + u[2], "g")), a = k) : u[3] !== void 0 && (a = k) : a === k ? u[0] === ">" ? (a = r ?? I, h = -1) : u[1] === void 0 ? h = -2 : (h = a.lastIndex - u[2].length, p = u[1], a = u[3] === void 0 ? k : u[3] === '"' ? $e : _e) : a === $e || a === _e ? a = k : a === ye || a === we ? a = I : (a = k, r = void 0);
    const w = a === k && t[d + 1].startsWith("/>") ? " " : "";
    o += a === I ? n + Qe : h >= 0 ? (s.push(p), n.slice(0, h) + Le + n.slice(h) + x + w) : n + x + (h === -2 ? d : w);
  }
  return [Oe(t, o + (t[i] || "<?>") + (e === 2 ? "</svg>" : e === 3 ? "</math>" : "")), s];
};
class N {
  constructor({ strings: e, _$litType$: i }, s) {
    let r;
    this.parts = [];
    let o = 0, a = 0;
    const d = e.length - 1, n = this.parts, [p, u] = it(e, i);
    if (this.el = N.createElement(p, s), P.currentNode = this.el.content, i === 2 || i === 3) {
      const h = this.el.content.firstChild;
      h.replaceWith(...h.childNodes);
    }
    for (; (r = P.nextNode()) !== null && n.length < d; ) {
      if (r.nodeType === 1) {
        if (r.hasAttributes()) for (const h of r.getAttributeNames()) if (h.endsWith(Le)) {
          const b = u[a++], w = r.getAttribute(h).split(x), F = /([.?@])?(.*)/.exec(b);
          n.push({ type: 1, index: o, name: F[2], strings: w, ctor: F[1] === "." ? rt : F[1] === "?" ? ot : F[1] === "@" ? at : X }), r.removeAttribute(h);
        } else h.startsWith(x) && (n.push({ type: 6, index: o }), r.removeAttribute(h));
        if (Te.test(r.tagName)) {
          const h = r.textContent.split(x), b = h.length - 1;
          if (b > 0) {
            r.textContent = W ? W.emptyScript : "";
            for (let w = 0; w < b; w++) r.append(h[w], U()), P.nextNode(), n.push({ type: 2, index: ++o });
            r.append(h[b], U());
          }
        }
      } else if (r.nodeType === 8) if (r.data === He) n.push({ type: 2, index: o });
      else {
        let h = -1;
        for (; (h = r.data.indexOf(x, h + 1)) !== -1; ) n.push({ type: 7, index: o }), h += x.length - 1;
      }
      o++;
    }
  }
  static createElement(e, i) {
    const s = R.createElement("template");
    return s.innerHTML = e, s;
  }
}
function H(t, e, i = t, s) {
  if (e === E) return e;
  let r = s !== void 0 ? i._$Co?.[s] : i._$Cl;
  const o = D(e) ? void 0 : e._$litDirective$;
  return r?.constructor !== o && (r?._$AO?.(!1), o === void 0 ? r = void 0 : (r = new o(t), r._$AT(t, i, s)), s !== void 0 ? (i._$Co ??= [])[s] = r : i._$Cl = r), r !== void 0 && (e = H(t, r._$AS(t, e.values), r, s)), e;
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
    let o = P.nextNode(), a = 0, d = 0, n = s[0];
    for (; n !== void 0; ) {
      if (a === n.index) {
        let p;
        n.type === 2 ? p = new z(o, o.nextSibling, this, e) : n.type === 1 ? p = new n.ctor(o, n.name, n.strings, this, e) : n.type === 6 && (p = new nt(o, this, e)), this._$AV.push(p), n = s[++d];
      }
      a !== n?.index && (o = P.nextNode(), a++);
    }
    return P.currentNode = R, r;
  }
  p(e) {
    let i = 0;
    for (const s of this._$AV) s !== void 0 && (s.strings !== void 0 ? (s._$AI(e, s, i), i += s.strings.length - 2) : s._$AI(e[i])), i++;
  }
}
class z {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(e, i, s, r) {
    this.type = 2, this._$AH = l, this._$AN = void 0, this._$AA = e, this._$AB = i, this._$AM = s, this.options = r, this._$Cv = r?.isConnected ?? !0;
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
    e = H(this, e, i), D(e) ? e === l || e == null || e === "" ? (this._$AH !== l && this._$AR(), this._$AH = l) : e !== this._$AH && e !== E && this._(e) : e._$litType$ !== void 0 ? this.$(e) : e.nodeType !== void 0 ? this.T(e) : et(e) ? this.k(e) : this._(e);
  }
  O(e) {
    return this._$AA.parentNode.insertBefore(e, this._$AB);
  }
  T(e) {
    this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
  }
  _(e) {
    this._$AH !== l && D(this._$AH) ? this._$AA.nextSibling.data = e : this.T(R.createTextNode(e)), this._$AH = e;
  }
  $(e) {
    const { values: i, _$litType$: s } = e, r = typeof s == "number" ? this._$AC(e) : (s.el === void 0 && (s.el = N.createElement(Oe(s.h, s.h[0]), this.options)), s);
    if (this._$AH?._$AD === r) this._$AH.p(i);
    else {
      const o = new st(r, this), a = o.u(this.options);
      o.p(i), this.T(a), this._$AH = o;
    }
  }
  _$AC(e) {
    let i = xe.get(e.strings);
    return i === void 0 && xe.set(e.strings, i = new N(e)), i;
  }
  k(e) {
    ae(this._$AH) || (this._$AH = [], this._$AR());
    const i = this._$AH;
    let s, r = 0;
    for (const o of e) r === i.length ? i.push(s = new z(this.O(U()), this.O(U()), this, this.options)) : s = i[r], s._$AI(o), r++;
    r < i.length && (this._$AR(s && s._$AB.nextSibling, r), i.length = r);
  }
  _$AR(e = this._$AA.nextSibling, i) {
    for (this._$AP?.(!1, !0, i); e !== this._$AB; ) {
      const s = ge(e).nextSibling;
      ge(e).remove(), e = s;
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
  constructor(e, i, s, r, o) {
    this.type = 1, this._$AH = l, this._$AN = void 0, this.element = e, this.name = i, this._$AM = r, this.options = o, s.length > 2 || s[0] !== "" || s[1] !== "" ? (this._$AH = Array(s.length - 1).fill(new String()), this.strings = s) : this._$AH = l;
  }
  _$AI(e, i = this, s, r) {
    const o = this.strings;
    let a = !1;
    if (o === void 0) e = H(this, e, i, 0), a = !D(e) || e !== this._$AH && e !== E, a && (this._$AH = e);
    else {
      const d = e;
      let n, p;
      for (e = o[0], n = 0; n < o.length - 1; n++) p = H(this, d[s + n], i, n), p === E && (p = this._$AH[n]), a ||= !D(p) || p !== this._$AH[n], p === l ? e = l : e !== l && (e += (p ?? "") + o[n + 1]), this._$AH[n] = p;
    }
    a && !r && this.j(e);
  }
  j(e) {
    e === l ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
  }
}
class rt extends X {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(e) {
    this.element[this.name] = e === l ? void 0 : e;
  }
}
class ot extends X {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(e) {
    this.element.toggleAttribute(this.name, !!e && e !== l);
  }
}
class at extends X {
  constructor(e, i, s, r, o) {
    super(e, i, s, r, o), this.type = 5;
  }
  _$AI(e, i = this) {
    if ((e = H(this, e, i, 0) ?? l) === E) return;
    const s = this._$AH, r = e === l && s !== l || e.capture !== s.capture || e.once !== s.once || e.passive !== s.passive, o = e !== l && (s === l || r);
    r && this.element.removeEventListener(this.name, this, s), o && this.element.addEventListener(this.name, this, e), this._$AH = e;
  }
  handleEvent(e) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, e) : this._$AH.handleEvent(e);
  }
}
class nt {
  constructor(e, i, s) {
    this.element = e, this.type = 6, this._$AN = void 0, this._$AM = i, this.options = s;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(e) {
    H(this, e);
  }
}
const dt = oe.litHtmlPolyfillSupport;
dt?.(N, z), (oe.litHtmlVersions ??= []).push("3.3.3");
const lt = (t, e, i) => {
  const s = i?.renderBefore ?? e;
  let r = s._$litPart$;
  if (r === void 0) {
    const o = i?.renderBefore ?? null;
    s._$litPart$ = r = new z(e.insertBefore(U(), o), o, void 0, i ?? {});
  }
  return r._$AI(t), r;
};
const ne = globalThis;
let A = class extends M {
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
    return E;
  }
};
A._$litElement$ = !0, A.finalized = !0, ne.litElementHydrateSupport?.({ LitElement: A });
const ct = ne.litElementPolyfillSupport;
ct?.({ LitElement: A });
(ne.litElementVersions ??= []).push("4.2.2");
const Ie = { ATTRIBUTE: 1 }, de = (t) => (...e) => ({ _$litDirective$: t, values: e });
let le = class {
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
const Ve = "important", ht = " !" + Ve, ce = de(class extends le {
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
        const o = typeof r == "string" && r.endsWith(ht);
        s.includes("-") || o ? i.setProperty(s, o ? r.slice(0, -11) : r, o ? Ve : "") : i[s] = r;
      }
    }
    return E;
  }
});
const J = (t) => (e, i) => {
  i !== void 0 ? i.addInitializer(() => {
    customElements.define(t, e);
  }) : customElements.define(t, e);
};
const pt = { attribute: !0, type: String, converter: q, reflect: !1, hasChanged: re }, ut = (t = pt, e, i) => {
  const { kind: s, metadata: r } = i;
  let o = globalThis.litPropertyMetadata.get(r);
  if (o === void 0 && globalThis.litPropertyMetadata.set(r, o = /* @__PURE__ */ new Map()), s === "setter" && ((t = Object.create(t)).wrapped = !0), o.set(i.name, t), s === "accessor") {
    const { name: a } = i;
    return { set(d) {
      const n = e.get.call(this);
      e.set.call(this, d), this.requestUpdate(a, n, t, !0, d);
    }, init(d) {
      return d !== void 0 && this.C(a, void 0, t, d), d;
    } };
  }
  if (s === "setter") {
    const { name: a } = i;
    return function(d) {
      const n = this[a];
      e.call(this, d), this.requestUpdate(a, n, t, !0, d);
    };
  }
  throw Error("Unsupported decorator location: " + s);
};
function g(t) {
  return (e, i) => typeof i == "object" ? ut(t, e, i) : ((s, r, o) => {
    const a = r.hasOwnProperty(o);
    return r.constructor.createProperty(o, s), a ? Object.getOwnPropertyDescriptor(r, o) : void 0;
  })(t, e, i);
}
function v(t) {
  return g({ ...t, state: !0, attribute: !1 });
}
const he = "custom:ring-view", ee = "ring-view", vt = "Ring View", _ = {
  default_mode: "last_recording",
  remember_last_mode: !1,
  autoplay_recording: !0,
  preview: {
    source: "last_recording",
    show_name: !1,
    show_mode_badge: !0
  },
  appearance: {
    aspect_ratio: "16:9",
    fit_mode: "cover"
  },
  viewer: {
    show_controls: !0,
    live_muted: !1,
    close_on_escape: !0
  },
  performance: {
    suspend_when_hidden: !0,
    live_timeout_seconds: 20,
    retry_live_once: !0,
    debug: !1
  }
}, mt = /* @__PURE__ */ new Set(["last_recording", "live"]), ft = /* @__PURE__ */ new Set(["last_recording", "live", "default"]), gt = /* @__PURE__ */ new Set(["auto", "16:9", "4:3", "1:1"]), bt = /* @__PURE__ */ new Set(["cover", "contain", "fill"]);
function Ae(t, e) {
  if (typeof t != "string" || !t.startsWith("camera."))
    throw new Error(`${e} must be a camera entity.`);
}
function yt(t) {
  if (!t || typeof t != "object")
    throw new Error("Invalid card configuration.");
  if (Ae(t.recording_entity, "Last recording entity"), Ae(t.live_entity, "Live camera entity"), t.default_mode && !mt.has(t.default_mode))
    throw new Error("default_mode must be last_recording or live.");
  if (t.preview?.source && !ft.has(t.preview.source))
    throw new Error("preview.source is invalid.");
  if (t.appearance?.aspect_ratio && !gt.has(t.appearance.aspect_ratio))
    throw new Error("appearance.aspect_ratio is invalid.");
  if (t.appearance?.fit_mode && !bt.has(t.appearance.fit_mode))
    throw new Error("appearance.fit_mode is invalid.");
  const e = t.performance?.live_timeout_seconds;
  if (e !== void 0 && (!Number.isFinite(e) || e < 10 || e > 60))
    throw new Error("performance.live_timeout_seconds must be between 10 and 60.");
}
function te(t) {
  return yt(t), {
    type: t.type ?? he,
    recording_entity: t.recording_entity,
    live_entity: t.live_entity,
    name: t.name,
    default_mode: t.default_mode ?? _.default_mode,
    remember_last_mode: t.remember_last_mode ?? _.remember_last_mode,
    autoplay_recording: t.autoplay_recording ?? _.autoplay_recording,
    preview: { ..._.preview, ...t.preview },
    appearance: {
      aspect_ratio: t.appearance?.aspect_ratio ?? _.appearance.aspect_ratio,
      fit_mode: t.appearance?.fit_mode ?? _.appearance.fit_mode
    },
    viewer: {
      show_controls: t.viewer?.show_controls ?? _.viewer.show_controls,
      live_muted: t.viewer?.live_muted ?? _.viewer.live_muted,
      close_on_escape: t.viewer?.close_on_escape ?? _.viewer.close_on_escape
    },
    performance: { ..._.performance, ...t.performance },
    grid_options: t.grid_options
  };
}
function Ue(t) {
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
function De(t) {
  return t === "auto" ? "16 / 9" : t.replace(":", " / ");
}
const wt = 9e3, Ee = /* @__PURE__ */ new WeakMap();
function pe(t, e, i) {
  const s = e?.attributes.entity_picture;
  return typeof s == "string" && s.length > 0 ? t.hassUrl(s) : t.hassUrl(`/api/camera_proxy/${encodeURIComponent(i)}`);
}
async function _t(t, e, i, s) {
  const r = await $t(t, e), o = r.includes("?") ? "&" : "?";
  return `${r}${o}width=${Se(i)}&height=${Se(s)}`;
}
function Se(t) {
  return Math.max(1, Math.ceil(Number.isFinite(t) ? t : 1));
}
async function $t(t, e) {
  let i = Ee.get(t);
  i || (i = /* @__PURE__ */ new Map(), Ee.set(t, i));
  const s = Date.now(), r = i.get(e);
  if (r && r.expiresAt > s) return r.promise;
  const o = t.callWS({
    type: "auth/sign_path",
    path: `/api/camera_proxy/${encodeURIComponent(e)}`
  }).then((a) => {
    if (!a || typeof a.path != "string" || a.path.length === 0)
      throw new Error("Home Assistant did not return a signed camera path.");
    return t.hassUrl(a.path);
  });
  i.set(e, {
    expiresAt: s + wt,
    promise: o
  });
  try {
    return await o;
  } catch (a) {
    throw i.delete(e), a;
  }
}
var xt = "M12,2L1,21H23M12,6L19.53,19H4.47M11,10V14H13V10M11,16V18H13V16", At = "M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z", Et = "M13.5,8H12V13L16.28,15.54L17,14.33L13.5,12.25V8M13,3A9,9 0 0,0 4,12H1L4.96,16.03L9,12H6A7,7 0 0,1 13,5A7,7 0 0,1 20,12A7,7 0 0,1 13,19C11.07,19 9.32,18.21 8.06,16.94L6.64,18.36C8.27,20 10.5,21 13,21A9,9 0 0,0 22,12A9,9 0 0,0 13,3", St = "M8,5.14V19.14L19,12.14L8,5.14Z";
function K(t) {
  return t === "live" ? c`<span class="mode-icon mode-icon-live" aria-hidden="true"></span>` : c`
    <svg class="mode-icon mode-icon-recording" viewBox="0 0 24 24" aria-hidden="true">
      <path d=${Et}></path>
    </svg>
  `;
}
function Ne(t) {
  return t === "live" ? "Live" : "Last recording";
}
const Ct = de(class extends le {
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
    return E;
  }
});
const kt = {}, Pt = (t, e = kt) => t._$AH = e;
const Ce = de(class extends le {
  constructor() {
    super(...arguments), this.key = l;
  }
  render(t, e) {
    return this.key = t, e;
  }
  update(t, [e, i]) {
    return e !== this.key && (Pt(t), this.key = e), i;
  }
});
var Rt = Object.defineProperty, Mt = Object.getOwnPropertyDescriptor, $ = (t, e, i, s) => {
  for (var r = s > 1 ? void 0 : s ? Mt(e, i) : e, o = t.length - 1, a; o >= 0; o--)
    (a = t[o]) && (r = (s ? a(e, i, r) : a(r)) || r);
  return s && r && Rt(e, i, r), r;
};
const G = "ha-camera-stream", Lt = 8e3, ke = "ring-view-native-layout";
async function Ht(t, e) {
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
async function ze() {
  if (customElements.get(G)) return !0;
  try {
    await (await window.loadCardHelpers?.())?.importMoreInfoControl?.("camera");
  } catch {
  }
  return Ht(G, Lt);
}
let y = class extends A {
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
    return !this.nativeAvailable || !this.stateObj ? l : c`
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
    const t = await ze();
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
    if (t.getElementById(ke)) return;
    const e = document.createElement("style");
    e.id = ke, e.textContent = `
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
y.styles = Z`
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
], y.prototype, "stateObj", 2);
$([
  g({ type: Boolean })
], y.prototype, "controls", 2);
$([
  g({ type: Boolean })
], y.prototype, "muted", 2);
$([
  g({ type: Boolean, attribute: "allow-exoplayer" })
], y.prototype, "allowExoPlayer", 2);
$([
  g({ type: Number, attribute: !1 })
], y.prototype, "aspectRatio", 2);
$([
  g({ attribute: !1 })
], y.prototype, "fitMode", 2);
$([
  g({ type: Boolean, attribute: "passive-surface" })
], y.prototype, "passiveSurface", 2);
$([
  v()
], y.prototype, "nativeAvailable", 2);
y = $([
  J("ring-view-native-camera-adapter")
], y);
const Tt = Z`
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
`, Ot = Z`
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
`, It = Z`
  :host {
    display: block;
    min-width: 0;
    container-type: inline-size;
    color: var(--primary-text-color, #212121);
  }

  .editor-layout {
    display: grid;
    grid-template-columns: minmax(320px, 1.1fr) minmax(280px, 0.9fr);
    align-items: start;
    gap: 24px;
    min-width: 0;
    padding: 4px 0 16px;
  }

  .settings-pane {
    display: grid;
    gap: 12px;
    min-width: 0;
  }

  .settings-group {
    min-width: 0;
    margin: 0;
    padding: 16px;
    box-sizing: border-box;
    border: 1px solid var(--divider-color, rgba(127, 127, 127, 0.2));
    border-radius: var(--ha-card-border-radius, 14px);
    background: var(--card-background-color, var(--ha-card-background, #fff));
  }

  h3 {
    margin: 0 0 12px;
    color: var(--primary-text-color, #212121);
    font-size: 14px;
    font-weight: 650;
    line-height: 20px;
    letter-spacing: 0.01em;
  }

  details {
    padding-block: 0;
  }

  summary {
    min-height: 52px;
    display: flex;
    align-items: center;
    padding: 0 16px;
    color: var(--primary-text-color, #212121);
    font-size: 14px;
    font-weight: 650;
    cursor: pointer;
  }

  .details-content {
    padding: 0 16px 16px;
  }

  .form-stack {
    display: grid;
    gap: 8px;
  }

  ha-form {
    display: block;
    min-width: 0;
  }

  .warnings {
    display: grid;
    gap: 8px;
    margin: 0;
  }

  .warning {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    padding: 12px;
    border-radius: var(--ha-card-border-radius, 12px);
    color: var(--primary-text-color, #212121);
    background: color-mix(
      in srgb,
      var(--warning-color, #ff9800) 14%,
      var(--card-background-color, #fff)
    );
    font-size: 13px;
    line-height: 18px;
  }

  .warning svg {
    width: 20px;
    height: 20px;
    flex: 0 0 auto;
    fill: var(--warning-color, #ff9800);
  }

  .preview-pane {
    min-width: 0;
  }

  .preview-sticky {
    position: sticky;
    top: 16px;
  }

  .preview-heading {
    margin: 0 0 10px;
    color: var(--secondary-text-color, #6b6b6b);
    font-size: 12px;
    font-weight: 650;
    line-height: 18px;
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }

  .preview-card {
    position: relative;
    width: 100%;
    min-height: 160px;
    aspect-ratio: var(--ring-view-editor-aspect-ratio, 16 / 9);
    overflow: hidden;
    border: 1px solid var(--divider-color, rgba(127, 127, 127, 0.2));
    border-radius: var(--ha-card-border-radius, 14px);
    background: #000;
    box-shadow: var(--ha-card-box-shadow, 0 2px 8px rgba(0, 0, 0, 0.14));
  }

  .preview-card img {
    width: 100%;
    height: 100%;
    display: block;
    object-fit: var(--ring-view-editor-fit-mode, cover);
    background: #000;
  }

  .preview-name {
    position: absolute;
    inset: auto 0 0;
    padding: 28px 14px 12px;
    overflow: hidden;
    color: #fff;
    background: linear-gradient(transparent, rgba(0, 0, 0, 0.76));
    font-size: 14px;
    font-weight: 600;
    line-height: 20px;
    text-overflow: ellipsis;
    text-shadow: 0 1px 3px rgba(0, 0, 0, 0.6);
    white-space: nowrap;
    pointer-events: none;
  }

  .preview-mode-indicator {
    position: absolute;
    top: 10px;
    inset-inline-end: 10px;
    display: grid;
    width: 32px;
    height: 32px;
    place-items: center;
    box-sizing: border-box;
    border: 1px solid rgba(255, 255, 255, 0.22);
    border-radius: 50%;
    color: #fff;
    background: rgba(14, 18, 22, 0.66);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.24);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    pointer-events: none;
  }

  .preview-mode-indicator .mode-icon-recording {
    width: 18px;
    height: 18px;
    fill: currentColor;
  }

  .preview-mode-indicator .mode-icon-live {
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: var(--error-color, #db4437);
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.55);
  }

  @container (max-width: 720px) {
    .editor-layout {
      grid-template-columns: minmax(0, 1fr);
      gap: 18px;
    }

    .preview-pane {
      order: -1;
    }

    .preview-sticky {
      position: static;
    }
  }

  @media (max-width: 600px) {
    .editor-layout {
      grid-template-columns: minmax(0, 1fr);
      gap: 16px;
    }

    .preview-pane {
      order: -1;
    }

    .preview-sticky {
      position: static;
    }

    .settings-group {
      padding: 14px;
    }

    details.settings-group {
      padding: 0;
    }
  }
`, Vt = 2;
function L(t) {
  return !t || t.state === "unavailable" || t.state === "unknown";
}
function Ut(t) {
  return (Number(t?.attributes.supported_features ?? 0) & Vt) !== 0;
}
function Dt(t) {
  return !!(t?.attributes.video_url || t?.attributes.entity_picture);
}
function Nt(t, e) {
  if (!t || !e) return [];
  const i = t.states[e.recording_entity], s = t.states[e.live_entity], r = [];
  return L(i) ? r.push({
    kind: "recording",
    message: `${T(i, e.recording_entity)} is unavailable.`
  }) : Dt(i) || r.push({
    kind: "recording",
    message: "The last recording camera has neither a recording URL nor a usable camera image."
  }), L(s) ? r.push({
    kind: "live",
    message: `${T(s, e.live_entity)} is unavailable.`
  }) : Ut(s) || r.push({
    kind: "live",
    message: "The live camera does not advertise camera streaming support."
  }), customElements.get("ha-camera-stream") || r.push({
    kind: "compatibility",
    message: "Home Assistant’s native camera component is not loaded yet. The card will attempt to load it when opened."
  }), r;
}
function T(t, e) {
  return t?.attributes.friendly_name || e;
}
const zt = "ring-view:mode:";
function je(t) {
  return `${zt}${t.recording_entity}|${t.live_entity}`;
}
function Pe(t) {
  if (!t.remember_last_mode)
    return t.default_mode;
  try {
    const e = window.localStorage.getItem(je(t));
    return e === "live" || e === "last_recording" ? e : t.default_mode;
  } catch {
    return t.default_mode;
  }
}
function jt(t, e) {
  if (t.remember_last_mode)
    try {
      window.localStorage.setItem(je(t), e);
    } catch {
    }
}
class Ft {
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
var Bt = Object.defineProperty, qt = Object.getOwnPropertyDescriptor, f = (t, e, i, s) => {
  for (var r = s > 1 ? void 0 : s ? qt(e, i) : e, o = t.length - 1, a; o >= 0; o--)
    (a = t[o]) && (r = (s ? a(e, i, r) : a(r)) || r);
  return s && r && Bt(e, i, r), r;
};
let m = class extends A {
  constructor() {
    super(...arguments), this.open = !1, this.mode = "last_recording", this.mediaStatus = "idle", this.session = 0, this.suspended = !1, this.recordingStarted = !0, this.recordingMuted = !1, this.liveMuted = !0, this.recordingVideoFailed = !1, this.retryCount = 0, this.statusAnnouncement = "", this.lifecycle = new Ft(), this.historyMarker = `ring-view-${Math.random().toString(36).slice(2)}`, this.ownsHistoryEntry = !1, this.audioFallbackAttempted = !1, this.recordingPlaybackPending = !1, this.recordingPlaybackStarted = !1, this.startRecording = () => {
      this.recordingStarted = !0, this.startMedia();
    }, this.handleMediaReady = () => {
      this.lifecycle.clearTimeout(), this.mediaStatus = "ready", this.statusAnnouncement = this.mode === "live" ? this.liveAudioStatus() : this.recordingMuted ? "Last recording loaded. Audio is muted because the browser blocked audible autoplay." : "Last recording loaded. Audio is available.", this.debugLog(`Media ready: ${this.mode}`);
    }, this.handleMediaCapabilities = (t) => {
      this.mode !== "live" || typeof t.detail?.hasAudio != "boolean" || this.liveMuted && t.detail.hasAudio === !1 || (this.liveHasAudio = this.liveHasAudio === !0 || t.detail.hasAudio, this.mediaStatus === "ready" && this.liveHasAudio ? this.statusAnnouncement = "Live view connected. Audio is available." : this.mediaStatus === "ready" && this.liveHasAudio === !1 && (this.statusAnnouncement = "Live view connected. No audio track was detected."));
    }, this.handleRecordingVideoError = () => {
      this.mode === "last_recording" && (this.recordingPlaybackPending = !1, this.recordingPlaybackStarted = !1, this.recordingVideoFailed = !0, this.statusAnnouncement = "Trying Home Assistant camera playback.", this.startMedia());
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
          this.recordingMuted = !0, e.muted = !0, this.statusAnnouncement = "The browser blocked recording audio. Retrying muted.", e.play().then(() => {
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
        this.lifecycle.clearTimeout(), this.mediaStatus = "compatibility", this.statusAnnouncement = "Native camera playback is unavailable.", this.debugLog("Native camera component unavailable");
        return;
      }
      if (this.mode === "live" && !this.liveMuted && !this.audioFallbackAttempted) {
        this.audioFallbackAttempted = !0, this.liveMuted = !0, this.statusAnnouncement = "Live audio was muted so playback can start.", this.startMedia();
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
      t.key !== "Escape" || !this.config?.viewer.close_on_escape || document.fullscreenElement || (t.preventDefault(), t.stopPropagation(), this.close());
    }, this.handleVisibilityChange = () => {
      !this.open || !this.config?.performance.suspend_when_hidden || (document.hidden ? (this.lifecycle.dispose(), this.session = this.lifecycle.current(), this.suspended = !0, this.mediaStatus = "idle") : this.suspended && (this.suspended = !1, this.startMedia()));
    };
  }
  show(t, e) {
    !this.config || !this.hass || this.open || (this.opener = e, this.mode = t, this.liveMuted = this.config.viewer.live_muted, this.recordingStarted = t === "live" || this.config.autoplay_recording, this.retryCount = 0, this.audioFallbackAttempted = !1, this.recordingPlaybackPending = !1, this.recordingPlaybackStarted = !1, this.recordingMuted = !1, this.liveHasAudio = void 0, this.recordingVideoFailed = !1, this.suspended = !1, this.open = !0, this.debugLog("Viewer opened"), this.pushHistoryEntry(), this.attachGlobalListeners(), this.startMedia(), this.updateComplete.then(() => this.focusInitialControl()));
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
    L(e) && this.mediaStatus !== "error" && (this.lifecycle.dispose(), this.session = this.lifecycle.current(), this.mediaStatus = "error", this.statusAnnouncement = "Camera entity is unavailable.");
  }
  render() {
    if (!this.open || !this.hass || !this.config) return l;
    const t = this.dialogTitle(), e = this.config.appearance.aspect_ratio, i = {
      "--ring-view-aspect-ratio": e === "auto" ? "16 / 9" : e.replace(":", " / "),
      "--ring-view-fit-mode": this.config.appearance.fit_mode
    };
    return c`
      <div class="backdrop" @pointerdown=${this.handleBackdrop}></div>
      <section
        class="dialog"
        style=${ce(i)}
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
                aria-label="Close camera viewer"
                title="Close"
                @click=${this.close}
              >
                ${this.icon(At)}
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
    return c`
      <div class="mode-switch" role="tablist" aria-label="Camera view">
        <button
          id="ring-view-tab-recording"
          class="mode-button recording"
          type="button"
          role="tab"
          aria-label="Last recording"
          title="Last recording"
          aria-selected=${String(this.mode === "last_recording")}
          tabindex=${this.mode === "last_recording" ? "0" : "-1"}
          @click=${() => this.selectMode("last_recording")}
          @keydown=${this.handleTabKeyDown}
        >
          ${K("last_recording")}
        </button>
        <button
          id="ring-view-tab-live"
          class="mode-button live"
          type="button"
          role="tab"
          title="Live"
          aria-selected=${String(this.mode === "live")}
          tabindex=${this.mode === "live" ? "0" : "-1"}
          @click=${() => this.selectMode("live")}
          @keydown=${this.handleTabKeyDown}
        >
          ${K("live")}
        </button>
      </div>
    `;
  }
  renderMedia() {
    const t = this.activeEntity(), e = this.activeEntityId(), i = L(t), s = !i && this.recordingStarted && !this.suspended, r = Ue(this.config.appearance.aspect_ratio), o = pe(this.hass, t, e), a = this.mode === "last_recording" && typeof t?.attributes.video_url == "string" ? t.attributes.video_url : void 0, d = !!(s && a && !this.recordingVideoFailed);
    return c`
      <div
        class=${Ct({
      "media-frame": !0,
      "auto-ratio": this.config.appearance.aspect_ratio === "auto"
    })}
        role="tabpanel"
        aria-labelledby=${this.mode === "live" ? "ring-view-tab-live" : "ring-view-tab-recording"}
      >
        <img class="poster" src=${o} alt="" aria-hidden="true" />
        ${s && !d && this.mediaStatus !== "compatibility" ? Ce(
      `${e}:${this.session}`,
      c`
                <ring-view-native-camera-adapter
                  class=${this.mediaStatus === "pending" ? "pending" : ""}
                  .stateObj=${t}
                  .controls=${this.config.viewer.show_controls}
                  .muted=${this.mode === "live" ? this.liveMuted : this.recordingMuted}
                  .allowExoPlayer=${!0}
                  .aspectRatio=${r}
                  .fitMode=${this.config.appearance.fit_mode}
                  .passiveSurface=${this.mode === "live"}
                  @native-media-ready=${this.handleMediaReady}
                  @native-media-error=${this.handleMediaError}
                  @native-media-capabilities=${this.handleMediaCapabilities}
                ></ring-view-native-camera-adapter>
              `
    ) : l}
        ${d ? Ce(
      `${e}:${this.session}:recording-video`,
      c`
              <video
                class="video-fallback"
                src=${a}
                poster=${o}
                playsinline
                autoplay
                preload="auto"
                ?controls=${this.config.viewer.show_controls}
                .muted=${this.recordingMuted}
                @canplay=${this.handleRecordingCanPlay}
                @error=${this.handleRecordingVideoError}
              ></video>
            `
    ) : l}
        ${this.renderStateLayer(i, d)}
      </div>
    `;
  }
  renderStateLayer(t, e) {
    if (t) {
      const i = this.activeEntity();
      return c`
        <div class="state-layer" role="status">
          <div class="state-card">
            <div class="state-title">${T(i, this.activeEntityId())}</div>
            <div class="state-detail">Camera entity is unavailable.</div>
            <div class="state-actions">
              <button class="action-button primary" type="button" @click=${this.retry}>
                Retry
              </button>
              ${this.renderAlternateModeButton()}
            </div>
          </div>
        </div>
      `;
    }
    return this.mode === "last_recording" && !this.recordingStarted ? c`
        <div class="state-layer">
          <div class="state-card">
            <button
              class="action-button primary"
              type="button"
              aria-label="Play last recording"
              @click=${this.startRecording}
            >
              ${this.icon(St)} Play last recording
            </button>
          </div>
        </div>
      ` : this.suspended ? c`
        <div class="state-layer" role="status">
          <div class="state-card">
            <div class="state-title">Playback paused while this tab is hidden.</div>
          </div>
        </div>
      ` : this.mediaStatus === "pending" ? c`
        <div class="state-layer" role="status">
          <div class="state-card">
            <div class="spinner" aria-hidden="true"></div>
            <div class="state-title">
              ${this.mode === "live" ? "Connecting to Ring live view…" : "Loading last recording…"}
            </div>
          </div>
        </div>
      ` : this.mediaStatus === "compatibility" && !e ? c`
        <div class="state-layer" role="alert">
          <div class="state-card">
            <div class="state-title">Native camera playback is unavailable.</div>
            <div class="state-detail">
              This Home Assistant version did not provide the expected camera component.
            </div>
            <div class="state-actions">
              <button class="action-button primary" type="button" @click=${this.openMoreInfo}>
                Open Home Assistant camera
              </button>
              ${this.renderAlternateModeButton()}
            </div>
          </div>
        </div>
      ` : this.mediaStatus === "error" ? c`
        <div class="state-layer" role="alert">
          <div class="state-card">
            <div class="state-title">
              ${this.mode === "live" ? "Live view could not be started." : "No Ring recording is currently available."}
            </div>
            ${this.mode === "last_recording" ? c`<div class="state-detail">A Ring Protect subscription may be required.</div>` : l}
            <div class="state-actions">
              <button class="action-button primary" type="button" @click=${this.retry}>
                Retry
              </button>
              ${this.renderAlternateModeButton()}
            </div>
          </div>
        </div>
      ` : l;
  }
  renderAlternateModeButton() {
    const t = this.mode === "live" ? "last_recording" : "live";
    return c`
      <button class="action-button" type="button" @click=${() => this.selectMode(t)}>
        ${t === "live" ? "Switch to Live" : "Switch to Last recording"}
      </button>
    `;
  }
  selectMode(t) {
    !this.config || t === this.mode || (this.lifecycle.dispose(), this.mode = t, jt(this.config, t), this.recordingStarted = t === "live" || this.config.autoplay_recording, this.liveMuted = this.config.viewer.live_muted, this.retryCount = 0, this.audioFallbackAttempted = !1, this.recordingPlaybackPending = !1, this.recordingPlaybackStarted = !1, this.recordingMuted = !1, this.liveHasAudio = void 0, this.recordingVideoFailed = !1, this.statusAnnouncement = t === "live" ? "Live view selected." : "Last recording selected.", this.debugLog(`Mode selected: ${t}`), this.startMedia());
  }
  startMedia() {
    if (!this.open || this.suspended || !this.recordingStarted) {
      this.mediaStatus = "idle";
      return;
    }
    if (L(this.activeEntity())) {
      this.mediaStatus = "error", this.statusAnnouncement = "Camera entity is unavailable.";
      return;
    }
    this.mediaStatus = "pending", this.session = this.lifecycle.next();
    const t = this.config?.performance.live_timeout_seconds ?? 20;
    this.lifecycle.scheduleTimeout(
      () => this.failMedia(!0),
      t * 1e3
    );
  }
  liveAudioStatus() {
    return this.liveMuted ? "Live view connected. Audio is muted." : this.liveHasAudio === !0 ? "Live view connected. Audio is available." : this.liveHasAudio === !1 ? "Live view connected. No audio track was detected." : "Live view connected. Audio status is still being detected.";
  }
  failMedia(t) {
    if (t && this.mode === "live" && this.config?.performance.retry_live_once && this.retryCount < 1) {
      this.retryCount += 1, this.statusAnnouncement = "Retrying Ring live view.", this.startMedia();
      return;
    }
    this.lifecycle.dispose(), this.session = this.lifecycle.current(), this.mediaStatus = "error", this.statusAnnouncement = this.mode === "live" ? "Live view could not be started." : "No Ring recording is currently available.", this.debugLog(`Media failed: ${this.mode}`);
  }
  activeEntityId() {
    return this.mode === "live" ? this.config.live_entity : this.config.recording_entity;
  }
  activeEntity() {
    return this.hass?.states[this.activeEntityId()];
  }
  dialogTitle() {
    return this.config?.name ? this.config.name : T(
      this.hass?.states[this.config.recording_entity],
      "Camera"
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
    }), this.debugLog("Viewer closed"), this.dispatchEvent(
      new CustomEvent("viewer-closed", { bubbles: !0, composed: !0 })
    ), t && this.opener?.focus(), this.opener = void 0);
  }
  icon(t) {
    return c`<svg viewBox="0 0 24 24" aria-hidden="true"><path d=${t}></path></svg>`;
  }
  debugLog(t) {
    this.config?.performance.debug && console.debug("[ring-view]", t);
  }
};
m.styles = Ot;
f([
  g({ attribute: !1 })
], m.prototype, "hass", 2);
f([
  g({ attribute: !1 })
], m.prototype, "config", 2);
f([
  g({ type: Boolean, reflect: !0 })
], m.prototype, "open", 2);
f([
  v()
], m.prototype, "mode", 2);
f([
  v()
], m.prototype, "mediaStatus", 2);
f([
  v()
], m.prototype, "session", 2);
f([
  v()
], m.prototype, "suspended", 2);
f([
  v()
], m.prototype, "recordingStarted", 2);
f([
  v()
], m.prototype, "recordingMuted", 2);
f([
  v()
], m.prototype, "liveMuted", 2);
f([
  v()
], m.prototype, "liveHasAudio", 2);
f([
  v()
], m.prototype, "recordingVideoFailed", 2);
f([
  v()
], m.prototype, "retryCount", 2);
f([
  v()
], m.prototype, "statusAnnouncement", 2);
m = f([
  J("ring-view-dialog")
], m);
var Wt = Object.defineProperty, Kt = Object.getOwnPropertyDescriptor, O = (t, e, i, s) => {
  for (var r = s > 1 ? void 0 : s ? Kt(e, i) : e, o = t.length - 1, a; o >= 0; o--)
    (a = t[o]) && (r = (s ? a(e, i, r) : a(r)) || r);
  return s && r && Wt(e, i, r), r;
};
const Gt = 1e4, Zt = 640, Yt = 16 / 9, Re = 16;
let S = class extends A {
  constructor() {
    super(...arguments), this.previewFailed = !1, this.previewIntersecting = !1, this.previewVisible = !1, this.previewRequestId = 0, this.openViewer = () => {
      const t = this.renderRoot.querySelector(".preview") ?? void 0;
      this.renderRoot.querySelector("ring-view-dialog")?.show(Pe(this.config), t);
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
    return await Promise.resolve().then(() => li), document.createElement("ring-view-editor");
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
    return e ? e.states[this.config.recording_entity] !== this.hass.states[this.config.recording_entity] || e.states[this.config.live_entity] !== this.hass.states[this.config.live_entity] : !0;
  }
  willUpdate() {
    if (!this.hass || !this.config) return;
    const t = this.previewEntityId(), e = pe(this.hass, this.hass.states[t], t);
    (t !== this.activePreviewEntityId || e !== this.lastFallbackPoster) && (this.activePreviewEntityId = t, this.lastFallbackPoster = e, this.lastPoster = e, this.lastPreviewSize = void 0, this.previewRequestId += 1, this.previewFailed = !1);
  }
  updated(t) {
    const e = t.has("config");
    (t.has("hass") || e) && this.previewVisible && this.refreshPreview(!0);
  }
  render() {
    if (!this.hass || !this.config) return l;
    const t = this.previewEntityId(), e = this.hass.states[t], i = this.config.name || T(this.hass.states[this.config.recording_entity], "Camera"), s = Pe(this.config), r = L(e), o = {
      "--ring-view-aspect-ratio": De(this.config.appearance.aspect_ratio),
      "--ring-view-fit-mode": this.config.appearance.fit_mode
    };
    return c`
      <ha-card>
        <div
          class="preview"
          style=${ce(o)}
          role="button"
          tabindex="0"
          aria-label=${`Open ${i} viewer — ${Ne(s)}`}
          title=${s === "live" ? "Open live view" : "Open last recording"}
          @click=${this.openViewer}
          @keydown=${this.handleKeyDown}
        >
          ${!r && !this.previewFailed ? c`
                <img
                  src=${this.lastPoster ?? ""}
                  alt=${`${i} preview`}
                  @error=${this.handlePreviewError}
                />
              ` : c`<div class="placeholder">Camera preview unavailable</div>`}
          ${this.config.preview.show_name ? c`<div class="name">${i}</div>` : l}
          ${this.config.preview.show_mode_badge ? c`
                <div
                  class=${`mode-indicator ${s === "live" ? "live" : "recording"}`}
                  aria-hidden="true"
                >
                  ${K(s)}
                </div>
              ` : l}
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
    const t = this.config.preview.source;
    return (t === "default" ? this.config.default_mode : t === "live" ? "live" : "last_recording") === "live" ? this.config.live_entity : this.config.recording_entity;
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
        }, Gt);
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
    const i = Math.max(1, window.devicePixelRatio || 1), s = e.clientWidth || e.getBoundingClientRect().width, r = s > 0 ? s : Zt, o = e.clientHeight || e.getBoundingClientRect().height, a = Ue(this.config.appearance.aspect_ratio) ?? Yt, d = o > 0 ? o : r / a, n = Math.ceil(r * i), p = Math.ceil(d * i);
    if (!t && this.lastPreviewSize && Math.abs(n - this.lastPreviewSize.width) < Re && Math.abs(p - this.lastPreviewSize.height) < Re)
      return;
    this.lastPreviewSize = { width: n, height: p };
    const u = this.previewEntityId(), h = this.hass, b = ++this.previewRequestId;
    try {
      const w = await _t(h, u, n, p);
      if (b !== this.previewRequestId || !this.isConnected || !this.previewVisible || this.previewEntityId() !== u)
        return;
      this.lastPoster = w, this.previewFailed = !1;
    } catch {
    }
  }
};
S.styles = Tt;
O([
  g({ attribute: !1 })
], S.prototype, "hass", 2);
O([
  g({ reflect: !0 })
], S.prototype, "layout", 2);
O([
  v()
], S.prototype, "config", 2);
O([
  v()
], S.prototype, "previewFailed", 2);
O([
  v()
], S.prototype, "lastPoster", 2);
S = O([
  J(ee)
], S);
window.customCards = window.customCards || [];
window.customCards.some((t) => t.type === ee) || window.customCards.push({
  type: ee,
  name: vt,
  description: "View the latest recording and start a separate live camera stream.",
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
var Xt = Object.defineProperty, Jt = Object.getOwnPropertyDescriptor, j = (t, e, i, s) => {
  for (var r = s > 1 ? void 0 : s ? Jt(e, i) : e, o = t.length - 1, a; o >= 0; o--)
    (a = t[o]) && (r = (s ? a(e, i, r) : a(r)) || r);
  return s && r && Xt(e, i, r), r;
};
const Qt = [
  {
    name: "recording_entity",
    required: !0,
    selector: { entity: { domain: "camera" } }
  },
  {
    name: "live_entity",
    required: !0,
    selector: { entity: { domain: "camera" } }
  }
], ei = [
  {
    name: "default_mode",
    selector: {
      select: {
        mode: "dropdown",
        options: [
          { value: "last_recording", label: "Last recording" },
          { value: "live", label: "Live" }
        ]
      }
    }
  },
  { name: "remember_last_mode", selector: { boolean: {} } },
  { name: "autoplay_recording", selector: { boolean: {} } }
], ti = [
  {
    name: "source",
    selector: {
      select: {
        mode: "dropdown",
        options: [
          { value: "last_recording", label: "Last recording snapshot" },
          { value: "live", label: "Live camera snapshot" },
          { value: "default", label: "Follow default view" }
        ]
      }
    }
  },
  { name: "show_mode_badge", selector: { boolean: {} } }
], ii = [
  { name: "show_name", selector: { boolean: {} } }
], si = [
  { name: "name", selector: { text: {} } }
], ri = [
  {
    name: "aspect_ratio",
    selector: {
      select: {
        mode: "dropdown",
        options: [
          { value: "auto", label: "Automatic" },
          { value: "16:9", label: "16:9" },
          { value: "4:3", label: "4:3" },
          { value: "1:1", label: "1:1" }
        ]
      }
    }
  },
  {
    name: "fit_mode",
    selector: {
      select: {
        mode: "dropdown",
        options: ["cover", "contain", "fill"].map((t) => ({
          value: t,
          label: t[0].toUpperCase() + t.slice(1)
        }))
      }
    }
  }
], oi = [
  { name: "show_controls", selector: { boolean: {} } },
  { name: "live_muted", selector: { boolean: {} } },
  { name: "close_on_escape", selector: { boolean: {} } }
], ai = [
  {
    name: "live_timeout_seconds",
    selector: {
      number: { min: 10, max: 60, step: 1, mode: "box", unit_of_measurement: "s" }
    }
  },
  { name: "retry_live_once", selector: { boolean: {} } },
  { name: "suspend_when_hidden", selector: { boolean: {} } },
  { name: "debug", selector: { boolean: {} } }
], ni = {
  recording_entity: "Last recording entity",
  live_entity: "Live camera entity",
  default_mode: "Default view",
  remember_last_mode: "Remember the last selected view",
  autoplay_recording: "Autoplay last recording",
  source: "Preview image",
  show_name: "Show camera name",
  show_mode_badge: "Show view icon",
  name: "Camera name",
  aspect_ratio: "Aspect ratio",
  fit_mode: "Image fit",
  show_controls: "Show native media controls",
  live_muted: "Start live audio muted",
  close_on_escape: "Close on Escape",
  live_timeout_seconds: "Live connection timeout",
  retry_live_once: "Retry live connection automatically",
  suspend_when_hidden: "Pause when browser tab is hidden",
  debug: "Debug logging"
}, di = {
  recording_entity: "Camera entity containing the most recent recording.",
  live_entity: "Camera entity used for the live stream.",
  default_mode: "Starting with Live will create a Ring live session whenever the card is opened.",
  source: "This is always a still image and never starts a live stream.",
  name: "Leave blank to use the friendly name of the recording entity.",
  debug: "Logs lifecycle events only; camera URLs and tokens are never logged."
};
let C = class extends A {
  constructor() {
    super(...arguments), this.nativeChecked = !1, this.nativeAvailable = !1, this.computeLabel = (t) => ni[t.name], this.computeHelper = (t) => di[t.name], this.valueChanged = (t) => {
      if (!this.config) return;
      const e = t.currentTarget.dataset.target, i = t.detail.value, s = e === "root" ? { ...this.config, ...i } : {
        ...this.config,
        [e]: { ...this.config[e], ...i }
      };
      this.config = te(s), this.dispatchEvent(
        new CustomEvent("config-changed", {
          detail: { config: s },
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
    super.connectedCallback(), ze().then((t) => {
      this.isConnected && (this.nativeAvailable = t, this.nativeChecked = !0);
    });
  }
  render() {
    if (!this.hass || !this.config) return l;
    const t = Nt(this.hass, this.config).filter(
      (e) => e.kind !== "compatibility" || this.nativeChecked && !this.nativeAvailable
    );
    return c`
      <div class="editor-layout">
        <div class="settings-pane">
          ${t.length ? c`
                <div class="warnings" role="status" aria-label="Configuration warnings">
                  ${t.map(
      (e) => c`
                      <div class="warning">
                        <svg viewBox="0 0 24 24" aria-hidden="true">
                          <path d=${xt}></path>
                        </svg>
                        <span>${e.message}</span>
                      </div>
                    `
    )}
                </div>
              ` : l}

          ${this.section("Sources", this.config, Qt, "root")}
          ${this.section("Playback", this.config, ei, "root")}
          <section class="settings-group">
            <h3>Card appearance</h3>
            <div class="form-stack">
              ${this.form(this.config.preview, ti, "preview")}
              ${this.form(this.config.appearance, ri, "appearance")}
            </div>
          </section>
          <section class="settings-group">
            <h3>Labels</h3>
            <div class="form-stack">
              ${this.form(this.config.preview, ii, "preview")}
              ${this.config.preview.show_name ? this.form(this.config, si, "root") : l}
            </div>
          </section>
          <details class="settings-group">
            <summary>Viewer controls</summary>
            <div class="details-content form-stack">
              ${this.form(this.config.viewer, oi, "viewer")}
            </div>
          </details>
          <details class="settings-group">
            <summary>Advanced</summary>
            <div class="details-content">
              ${this.form(this.config.performance, ai, "performance")}
            </div>
          </details>
        </div>
        ${this.renderPreview()}
      </div>
    `;
  }
  section(t, e, i, s) {
    return c`
      <section class="settings-group">
        <h3>${t}</h3>
        ${this.form(e, i, s)}
      </section>
    `;
  }
  renderPreview() {
    const t = this.config.preview.source, e = t === "default" ? this.config.default_mode : t === "live" ? "live" : "last_recording", i = e === "live" ? this.config.live_entity : this.config.recording_entity, s = this.hass.states[i], r = this.config.name || T(this.hass.states[this.config.recording_entity], "Camera"), o = {
      "--ring-view-editor-aspect-ratio": De(
        this.config.appearance.aspect_ratio
      ),
      "--ring-view-editor-fit-mode": this.config.appearance.fit_mode
    };
    return c`
      <aside class="preview-pane" aria-label="Dashboard preview">
        <div class="preview-sticky">
          <div class="preview-heading">Dashboard preview</div>
          <div class="preview-card" style=${ce(o)}>
            <img src=${pe(this.hass, s, i)} alt=${`${r} preview`} />
            ${this.config.preview.show_name ? c`<div class="preview-name">${r}</div>` : l}
            ${this.config.preview.show_mode_badge ? c`
                  <div
                    class=${`preview-mode-indicator ${e === "live" ? "live" : "recording"}`}
                    title=${Ne(e)}
                    aria-hidden="true"
                  >
                    ${K(e)}
                  </div>
                ` : l}
          </div>
        </div>
      </aside>
    `;
  }
  form(t, e, i) {
    return c`
      <ha-form
        .hass=${this.hass}
        .data=${t}
        .schema=${e}
        .computeLabel=${this.computeLabel}
        .computeHelper=${this.computeHelper}
        data-target=${i}
        @value-changed=${this.valueChanged}
      ></ha-form>
    `;
  }
};
C.styles = It;
j([
  g({ attribute: !1 })
], C.prototype, "hass", 2);
j([
  v()
], C.prototype, "config", 2);
j([
  v()
], C.prototype, "nativeChecked", 2);
j([
  v()
], C.prototype, "nativeAvailable", 2);
C = j([
  J("ring-view-editor")
], C);
const li = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get RingViewEditor() {
    return C;
  }
}, Symbol.toStringTag, { value: "Module" }));
export {
  S as RingView
};
