const B = globalThis, ie = B.ShadowRoot && (B.ShadyCSS === void 0 || B.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, se = /* @__PURE__ */ Symbol(), ce = /* @__PURE__ */ new WeakMap();
let ke = class {
  constructor(e, i, s) {
    if (this._$cssResult$ = !0, s !== se) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = e, this.t = i;
  }
  get styleSheet() {
    let e = this.o;
    const i = this.t;
    if (ie && e === void 0) {
      const s = i !== void 0 && i.length === 1;
      s && (e = ce.get(i)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), s && ce.set(i, e));
    }
    return e;
  }
  toString() {
    return this.cssText;
  }
};
const Ne = (t) => new ke(typeof t == "string" ? t : t + "", void 0, se), G = (t, ...e) => {
  const i = t.length === 1 ? t[0] : e.reduce((s, r, n) => s + ((a) => {
    if (a._$cssResult$ === !0) return a.cssText;
    if (typeof a == "number") return a;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + a + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(r) + t[n + 1], t[0]);
  return new ke(i, t, se);
}, ze = (t, e) => {
  if (ie) t.adoptedStyleSheets = e.map((i) => i instanceof CSSStyleSheet ? i : i.styleSheet);
  else for (const i of e) {
    const s = document.createElement("style"), r = B.litNonce;
    r !== void 0 && s.setAttribute("nonce", r), s.textContent = i.cssText, t.appendChild(s);
  }
}, ue = ie ? (t) => t : (t) => t instanceof CSSStyleSheet ? ((e) => {
  let i = "";
  for (const s of e.cssRules) i += s.cssText;
  return Ne(i);
})(t) : t;
const { is: je, defineProperty: Fe, getOwnPropertyDescriptor: Be, getOwnPropertyNames: qe, getOwnPropertySymbols: We, getPrototypeOf: Ke } = Object, Z = globalThis, pe = Z.trustedTypes, Ge = pe ? pe.emptyScript : "", Ze = Z.reactiveElementPolyfillSupport, I = (t, e) => t, q = { toAttribute(t, e) {
  switch (e) {
    case Boolean:
      t = t ? Ge : null;
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
} }, re = (t, e) => !je(t, e), ve = { attribute: !0, type: String, converter: q, reflect: !1, useDefault: !1, hasChanged: re };
Symbol.metadata ??= /* @__PURE__ */ Symbol("metadata"), Z.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
let R = class extends HTMLElement {
  static addInitializer(e) {
    this._$Ei(), (this.l ??= []).push(e);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(e, i = ve) {
    if (i.state && (i.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((i = Object.create(i)).wrapped = !0), this.elementProperties.set(e, i), !i.noAccessor) {
      const s = /* @__PURE__ */ Symbol(), r = this.getPropertyDescriptor(e, s, i);
      r !== void 0 && Fe(this.prototype, e, r);
    }
  }
  static getPropertyDescriptor(e, i, s) {
    const { get: r, set: n } = Be(this.prototype, e) ?? { get() {
      return this[i];
    }, set(a) {
      this[i] = a;
    } };
    return { get: r, set(a) {
      const d = r?.call(this);
      n?.call(this, a), this.requestUpdate(e, d, s);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(e) {
    return this.elementProperties.get(e) ?? ve;
  }
  static _$Ei() {
    if (this.hasOwnProperty(I("elementProperties"))) return;
    const e = Ke(this);
    e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(I("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(I("properties"))) {
      const i = this.properties, s = [...qe(i), ...We(i)];
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
      for (const r of s) i.unshift(ue(r));
    } else e !== void 0 && i.push(ue(e));
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
    return ze(e, this.constructor.elementStyles), e;
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
      const d = a.fromAttribute(i, n.type);
      this[r] = d ?? this._$Ej?.get(r) ?? d, this._$Em = null;
    }
  }
  requestUpdate(e, i, s, r = !1, n) {
    if (e !== void 0) {
      const a = this.constructor;
      if (r === !1 && (n = this[e]), s ??= a.getPropertyOptions(e), !((s.hasChanged ?? re)(n, i) || s.useDefault && s.reflect && n === this._$Ej?.get(e) && !this.hasAttribute(a._$Eu(e, s)))) return;
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
        const { wrapped: a } = n, d = this[r];
        a !== !0 || this._$AL.has(r) || d === void 0 || this.C(r, void 0, n, d);
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
R.elementStyles = [], R.shadowRootOptions = { mode: "open" }, R[I("elementProperties")] = /* @__PURE__ */ new Map(), R[I("finalized")] = /* @__PURE__ */ new Map(), Ze?.({ ReactiveElement: R }), (Z.reactiveElementVersions ??= []).push("2.1.2");
const ne = globalThis, fe = (t) => t, W = ne.trustedTypes, me = W ? W.createPolicy("lit-html", { createHTML: (t) => t }) : void 0, Re = "$lit$", _ = `lit$${Math.random().toFixed(9).slice(2)}$`, Me = "?" + _, Ye = `<${Me}>`, k = document, V = () => k.createComment(""), U = (t) => t === null || typeof t != "object" && typeof t != "function", ae = Array.isArray, Je = (t) => ae(t) || typeof t?.[Symbol.iterator] == "function", X = `[ 	
\f\r]`, T = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, ge = /-->/g, be = />/g, C = RegExp(`>|${X}(?:([^\\s"'>=/]+)(${X}*=${X}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), ye = /'/g, we = /"/g, Le = /^(?:script|style|textarea|title)$/i, Xe = (t) => (e, ...i) => ({ _$litType$: t, strings: e, values: i }), c = Xe(1), E = /* @__PURE__ */ Symbol.for("lit-noChange"), l = /* @__PURE__ */ Symbol.for("lit-nothing"), $e = /* @__PURE__ */ new WeakMap(), P = k.createTreeWalker(k, 129);
function Oe(t, e) {
  if (!ae(t) || !t.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return me !== void 0 ? me.createHTML(e) : e;
}
const Qe = (t, e) => {
  const i = t.length - 1, s = [];
  let r, n = e === 2 ? "<svg>" : e === 3 ? "<math>" : "", a = T;
  for (let d = 0; d < i; d++) {
    const o = t[d];
    let u, p, h = -1, b = 0;
    for (; b < o.length && (a.lastIndex = b, p = a.exec(o), p !== null); ) b = a.lastIndex, a === T ? p[1] === "!--" ? a = ge : p[1] !== void 0 ? a = be : p[2] !== void 0 ? (Le.test(p[2]) && (r = RegExp("</" + p[2], "g")), a = C) : p[3] !== void 0 && (a = C) : a === C ? p[0] === ">" ? (a = r ?? T, h = -1) : p[1] === void 0 ? h = -2 : (h = a.lastIndex - p[2].length, u = p[1], a = p[3] === void 0 ? C : p[3] === '"' ? we : ye) : a === we || a === ye ? a = C : a === ge || a === be ? a = T : (a = C, r = void 0);
    const w = a === C && t[d + 1].startsWith("/>") ? " " : "";
    n += a === T ? o + Ye : h >= 0 ? (s.push(u), o.slice(0, h) + Re + o.slice(h) + _ + w) : o + _ + (h === -2 ? d : w);
  }
  return [Oe(t, n + (t[i] || "<?>") + (e === 2 ? "</svg>" : e === 3 ? "</math>" : "")), s];
};
class D {
  constructor({ strings: e, _$litType$: i }, s) {
    let r;
    this.parts = [];
    let n = 0, a = 0;
    const d = e.length - 1, o = this.parts, [u, p] = Qe(e, i);
    if (this.el = D.createElement(u, s), P.currentNode = this.el.content, i === 2 || i === 3) {
      const h = this.el.content.firstChild;
      h.replaceWith(...h.childNodes);
    }
    for (; (r = P.nextNode()) !== null && o.length < d; ) {
      if (r.nodeType === 1) {
        if (r.hasAttributes()) for (const h of r.getAttributeNames()) if (h.endsWith(Re)) {
          const b = p[a++], w = r.getAttribute(h).split(_), F = /([.?@])?(.*)/.exec(b);
          o.push({ type: 1, index: n, name: F[2], strings: w, ctor: F[1] === "." ? tt : F[1] === "?" ? it : F[1] === "@" ? st : Y }), r.removeAttribute(h);
        } else h.startsWith(_) && (o.push({ type: 6, index: n }), r.removeAttribute(h));
        if (Le.test(r.tagName)) {
          const h = r.textContent.split(_), b = h.length - 1;
          if (b > 0) {
            r.textContent = W ? W.emptyScript : "";
            for (let w = 0; w < b; w++) r.append(h[w], V()), P.nextNode(), o.push({ type: 2, index: ++n });
            r.append(h[b], V());
          }
        }
      } else if (r.nodeType === 8) if (r.data === Me) o.push({ type: 2, index: n });
      else {
        let h = -1;
        for (; (h = r.data.indexOf(_, h + 1)) !== -1; ) o.push({ type: 7, index: n }), h += _.length - 1;
      }
      n++;
    }
  }
  static createElement(e, i) {
    const s = k.createElement("template");
    return s.innerHTML = e, s;
  }
}
function L(t, e, i = t, s) {
  if (e === E) return e;
  let r = s !== void 0 ? i._$Co?.[s] : i._$Cl;
  const n = U(e) ? void 0 : e._$litDirective$;
  return r?.constructor !== n && (r?._$AO?.(!1), n === void 0 ? r = void 0 : (r = new n(t), r._$AT(t, i, s)), s !== void 0 ? (i._$Co ??= [])[s] = r : i._$Cl = r), r !== void 0 && (e = L(t, r._$AS(t, e.values), r, s)), e;
}
class et {
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
    const { el: { content: i }, parts: s } = this._$AD, r = (e?.creationScope ?? k).importNode(i, !0);
    P.currentNode = r;
    let n = P.nextNode(), a = 0, d = 0, o = s[0];
    for (; o !== void 0; ) {
      if (a === o.index) {
        let u;
        o.type === 2 ? u = new z(n, n.nextSibling, this, e) : o.type === 1 ? u = new o.ctor(n, o.name, o.strings, this, e) : o.type === 6 && (u = new rt(n, this, e)), this._$AV.push(u), o = s[++d];
      }
      a !== o?.index && (n = P.nextNode(), a++);
    }
    return P.currentNode = k, r;
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
    e = L(this, e, i), U(e) ? e === l || e == null || e === "" ? (this._$AH !== l && this._$AR(), this._$AH = l) : e !== this._$AH && e !== E && this._(e) : e._$litType$ !== void 0 ? this.$(e) : e.nodeType !== void 0 ? this.T(e) : Je(e) ? this.k(e) : this._(e);
  }
  O(e) {
    return this._$AA.parentNode.insertBefore(e, this._$AB);
  }
  T(e) {
    this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
  }
  _(e) {
    this._$AH !== l && U(this._$AH) ? this._$AA.nextSibling.data = e : this.T(k.createTextNode(e)), this._$AH = e;
  }
  $(e) {
    const { values: i, _$litType$: s } = e, r = typeof s == "number" ? this._$AC(e) : (s.el === void 0 && (s.el = D.createElement(Oe(s.h, s.h[0]), this.options)), s);
    if (this._$AH?._$AD === r) this._$AH.p(i);
    else {
      const n = new et(r, this), a = n.u(this.options);
      n.p(i), this.T(a), this._$AH = n;
    }
  }
  _$AC(e) {
    let i = $e.get(e.strings);
    return i === void 0 && $e.set(e.strings, i = new D(e)), i;
  }
  k(e) {
    ae(this._$AH) || (this._$AH = [], this._$AR());
    const i = this._$AH;
    let s, r = 0;
    for (const n of e) r === i.length ? i.push(s = new z(this.O(V()), this.O(V()), this, this.options)) : s = i[r], s._$AI(n), r++;
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
class Y {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(e, i, s, r, n) {
    this.type = 1, this._$AH = l, this._$AN = void 0, this.element = e, this.name = i, this._$AM = r, this.options = n, s.length > 2 || s[0] !== "" || s[1] !== "" ? (this._$AH = Array(s.length - 1).fill(new String()), this.strings = s) : this._$AH = l;
  }
  _$AI(e, i = this, s, r) {
    const n = this.strings;
    let a = !1;
    if (n === void 0) e = L(this, e, i, 0), a = !U(e) || e !== this._$AH && e !== E, a && (this._$AH = e);
    else {
      const d = e;
      let o, u;
      for (e = n[0], o = 0; o < n.length - 1; o++) u = L(this, d[s + o], i, o), u === E && (u = this._$AH[o]), a ||= !U(u) || u !== this._$AH[o], u === l ? e = l : e !== l && (e += (u ?? "") + n[o + 1]), this._$AH[o] = u;
    }
    a && !r && this.j(e);
  }
  j(e) {
    e === l ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
  }
}
class tt extends Y {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(e) {
    this.element[this.name] = e === l ? void 0 : e;
  }
}
class it extends Y {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(e) {
    this.element.toggleAttribute(this.name, !!e && e !== l);
  }
}
class st extends Y {
  constructor(e, i, s, r, n) {
    super(e, i, s, r, n), this.type = 5;
  }
  _$AI(e, i = this) {
    if ((e = L(this, e, i, 0) ?? l) === E) return;
    const s = this._$AH, r = e === l && s !== l || e.capture !== s.capture || e.once !== s.once || e.passive !== s.passive, n = e !== l && (s === l || r);
    r && this.element.removeEventListener(this.name, this, s), n && this.element.addEventListener(this.name, this, e), this._$AH = e;
  }
  handleEvent(e) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, e) : this._$AH.handleEvent(e);
  }
}
class rt {
  constructor(e, i, s) {
    this.element = e, this.type = 6, this._$AN = void 0, this._$AM = i, this.options = s;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(e) {
    L(this, e);
  }
}
const nt = ne.litHtmlPolyfillSupport;
nt?.(D, z), (ne.litHtmlVersions ??= []).push("3.3.3");
const at = (t, e, i) => {
  const s = i?.renderBefore ?? e;
  let r = s._$litPart$;
  if (r === void 0) {
    const n = i?.renderBefore ?? null;
    s._$litPart$ = r = new z(e.insertBefore(V(), n), n, void 0, i ?? {});
  }
  return r._$AI(t), r;
};
const oe = globalThis;
let A = class extends R {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    const e = super.createRenderRoot();
    return this.renderOptions.renderBefore ??= e.firstChild, e;
  }
  update(e) {
    const i = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = at(i, this.renderRoot, this.renderOptions);
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
A._$litElement$ = !0, A.finalized = !0, oe.litElementHydrateSupport?.({ LitElement: A });
const ot = oe.litElementPolyfillSupport;
ot?.({ LitElement: A });
(oe.litElementVersions ??= []).push("4.2.2");
const Te = { ATTRIBUTE: 1 }, de = (t) => (...e) => ({ _$litDirective$: t, values: e });
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
const He = "important", dt = " !" + He, Ie = de(class extends le {
  constructor(t) {
    if (super(t), t.type !== Te.ATTRIBUTE || t.name !== "style" || t.strings?.length > 2) throw Error("The `styleMap` directive must be used in the `style` attribute and must be the only part in the attribute.");
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
        const n = typeof r == "string" && r.endsWith(dt);
        s.includes("-") || n ? i.setProperty(s, n ? r.slice(0, -11) : r, n ? He : "") : i[s] = r;
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
const lt = { attribute: !0, type: String, converter: q, reflect: !1, hasChanged: re }, ht = (t = lt, e, i) => {
  const { kind: s, metadata: r } = i;
  let n = globalThis.litPropertyMetadata.get(r);
  if (n === void 0 && globalThis.litPropertyMetadata.set(r, n = /* @__PURE__ */ new Map()), s === "setter" && ((t = Object.create(t)).wrapped = !0), n.set(i.name, t), s === "accessor") {
    const { name: a } = i;
    return { set(d) {
      const o = e.get.call(this);
      e.set.call(this, d), this.requestUpdate(a, o, t, !0, d);
    }, init(d) {
      return d !== void 0 && this.C(a, void 0, t, d), d;
    } };
  }
  if (s === "setter") {
    const { name: a } = i;
    return function(d) {
      const o = this[a];
      e.call(this, d), this.requestUpdate(a, o, t, !0, d);
    };
  }
  throw Error("Unsupported decorator location: " + s);
};
function m(t) {
  return (e, i) => typeof i == "object" ? ht(t, e, i) : ((s, r, n) => {
    const a = r.hasOwnProperty(n);
    return r.constructor.createProperty(n, s), a ? Object.getOwnPropertyDescriptor(r, n) : void 0;
  })(t, e, i);
}
function v(t) {
  return m({ ...t, state: !0, attribute: !1 });
}
const he = "custom:ring-view", Q = "ring-view", ct = "Ring View", H = {
  default_mode: "last_recording",
  live_muted: !1,
  show_name: !1,
  aspect_ratio: "16:9",
  fit_mode: "cover"
}, ut = /* @__PURE__ */ new Set(["last_recording", "live"]), pt = /* @__PURE__ */ new Set(["auto", "16:9", "4:3", "1:1"]), vt = /* @__PURE__ */ new Set(["cover", "contain"]);
function _e(t, e) {
  if (typeof t != "string" || !t.startsWith("camera."))
    throw new Error(`${e} must be a camera entity.`);
}
function ft(t) {
  if (!t || typeof t != "object")
    throw new Error("Invalid card configuration.");
  if (_e(t.recording_entity, "Last recording entity"), _e(t.live_entity, "Live camera entity"), t.default_mode && !ut.has(t.default_mode))
    throw new Error("default_mode must be last_recording or live.");
  if (t.aspect_ratio && !pt.has(t.aspect_ratio))
    throw new Error("aspect_ratio is invalid.");
  if (t.fit_mode && !vt.has(t.fit_mode))
    throw new Error("fit_mode is invalid.");
}
function ee(t) {
  return ft(t), {
    type: t.type ?? he,
    recording_entity: t.recording_entity,
    live_entity: t.live_entity,
    name: t.name,
    default_mode: t.default_mode ?? H.default_mode,
    live_muted: t.live_muted ?? H.live_muted,
    show_name: t.show_name ?? H.show_name,
    aspect_ratio: t.aspect_ratio ?? H.aspect_ratio,
    fit_mode: t.fit_mode ?? H.fit_mode,
    grid_options: t.grid_options
  };
}
function Ae(t) {
  return t.default_mode;
}
function Ve(t) {
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
function mt(t) {
  return t === "auto" ? "16 / 9" : t.replace(":", " / ");
}
const gt = 9e3, Ee = /* @__PURE__ */ new WeakMap();
function Ue(t, e, i) {
  const s = e?.attributes.entity_picture;
  return typeof s == "string" && s.length > 0 ? t.hassUrl(s) : t.hassUrl(`/api/camera_proxy/${encodeURIComponent(i)}`);
}
async function bt(t, e, i, s) {
  const r = await yt(t, e), n = r.includes("?") ? "&" : "?";
  return `${r}${n}width=${xe(i)}&height=${xe(s)}`;
}
function xe(t) {
  return Math.max(1, Math.ceil(Number.isFinite(t) ? t : 1));
}
async function yt(t, e) {
  let i = Ee.get(t);
  i || (i = /* @__PURE__ */ new Map(), Ee.set(t, i));
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
    expiresAt: s + gt,
    promise: n
  });
  try {
    return await n;
  } catch (a) {
    throw i.delete(e), a;
  }
}
var wt = "M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z", $t = "M13.5,8H12V13L16.28,15.54L17,14.33L13.5,12.25V8M13,3A9,9 0 0,0 4,12H1L4.96,16.03L9,12H6A7,7 0 0,1 13,5A7,7 0 0,1 20,12A7,7 0 0,1 13,19C11.07,19 9.32,18.21 8.06,16.94L6.64,18.36C8.27,20 10.5,21 13,21A9,9 0 0,0 22,12A9,9 0 0,0 13,3", _t = "M19,19H5V5H19M19,3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5A2,2 0 0,0 19,3M13.96,12.29L11.21,15.83L9.25,13.47L6.5,17H17.5L13.96,12.29Z", At = "M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M10,16.5L16,12L10,7.5V16.5Z";
function te(t) {
  return t === "live" ? c`<span class="mode-icon mode-icon-live" aria-hidden="true"></span>` : c`
    <svg class="mode-icon mode-icon-recording" viewBox="0 0 24 24" aria-hidden="true">
      <path d=${$t}></path>
    </svg>
  `;
}
function Et(t) {
  return t === "live" ? "Live" : "Last recording";
}
const xt = de(class extends le {
  constructor(t) {
    if (super(t), t.type !== Te.ATTRIBUTE || t.name !== "class" || t.strings?.length > 2) throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.");
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
const St = {}, Ct = (t, e = St) => t._$AH = e;
const Se = de(class extends le {
  constructor() {
    super(...arguments), this.key = l;
  }
  render(t, e) {
    return this.key = t, e;
  }
  update(t, [e, i]) {
    return e !== this.key && (Ct(t), this.key = e), i;
  }
});
var Pt = Object.defineProperty, kt = Object.getOwnPropertyDescriptor, $ = (t, e, i, s) => {
  for (var r = s > 1 ? void 0 : s ? kt(e, i) : e, n = t.length - 1, a; n >= 0; n--)
    (a = t[n]) && (r = (s ? a(e, i, r) : a(r)) || r);
  return s && r && Pt(e, i, r), r;
};
const K = "ha-camera-stream", Rt = 8e3, Ce = "ring-view-native-layout";
async function Mt(t, e) {
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
async function De() {
  if (customElements.get(K)) return !0;
  try {
    await (await window.loadCardHelpers?.())?.importMoreInfoControl?.("camera");
  } catch {
  }
  return Mt(K, Rt);
}
let y = class extends A {
  constructor() {
    super(...arguments), this.controls = !0, this.muted = !0, this.allowExoPlayer = !0, this.fitMode = "cover", this.passiveSurface = !1, this.nativeAvailable = !!customElements.get(K), this.handledStreamEvents = /* @__PURE__ */ new WeakSet(), this.ready = !1, this.handleSurfaceClick = (t) => {
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
    const t = this.renderRoot.querySelector(K);
    t && this.attachEventListeners(t);
  }
  async loadNativeComponent() {
    const t = await De();
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
    if (t.getElementById(Ce)) return;
    const e = document.createElement("style");
    e.id = Ce, e.textContent = `
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
y.styles = G`
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
  m({ attribute: !1 })
], y.prototype, "stateObj", 2);
$([
  m({ type: Boolean })
], y.prototype, "controls", 2);
$([
  m({ type: Boolean })
], y.prototype, "muted", 2);
$([
  m({ type: Boolean, attribute: "allow-exoplayer" })
], y.prototype, "allowExoPlayer", 2);
$([
  m({ type: Number, attribute: !1 })
], y.prototype, "aspectRatio", 2);
$([
  m({ attribute: !1 })
], y.prototype, "fitMode", 2);
$([
  m({ type: Boolean, attribute: "passive-surface" })
], y.prototype, "passiveSurface", 2);
$([
  v()
], y.prototype, "nativeAvailable", 2);
y = $([
  J("ring-view-native-camera-adapter")
], y);
const Lt = G`
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
`, Ot = G`
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
`, Tt = G`
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
`, Ht = 2;
function M(t) {
  return !t || t.state === "unavailable" || t.state === "unknown";
}
function It(t) {
  return (Number(t?.attributes.supported_features ?? 0) & Ht) !== 0;
}
function Vt(t) {
  return !!(t?.attributes.video_url || t?.attributes.entity_picture);
}
function Ut(t, e) {
  if (!t || !e) return [];
  const i = t.states[e.recording_entity], s = t.states[e.live_entity], r = [];
  return M(i) ? r.push({
    kind: "recording",
    message: `${N(i, e.recording_entity)} is unavailable.`
  }) : Vt(i) || r.push({
    kind: "recording",
    message: "The last recording camera has neither a recording URL nor a usable camera image."
  }), M(s) ? r.push({
    kind: "live",
    message: `${N(s, e.live_entity)} is unavailable.`
  }) : It(s) || r.push({
    kind: "live",
    message: "The live camera does not advertise camera streaming support."
  }), customElements.get("ha-camera-stream") || r.push({
    kind: "compatibility",
    message: "Home Assistant’s native camera component is not loaded yet. The card will attempt to load it when opened."
  }), r;
}
function N(t, e) {
  return t?.attributes.friendly_name || e;
}
class Dt {
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
var Nt = Object.defineProperty, zt = Object.getOwnPropertyDescriptor, g = (t, e, i, s) => {
  for (var r = s > 1 ? void 0 : s ? zt(e, i) : e, n = t.length - 1, a; n >= 0; n--)
    (a = t[n]) && (r = (s ? a(e, i, r) : a(r)) || r);
  return s && r && Nt(e, i, r), r;
};
const jt = 20;
let f = class extends A {
  constructor() {
    super(...arguments), this.open = !1, this.mode = "last_recording", this.mediaStatus = "idle", this.session = 0, this.suspended = !1, this.recordingMuted = !1, this.liveMuted = !0, this.recordingVideoFailed = !1, this.retryCount = 0, this.statusAnnouncement = "", this.lifecycle = new Dt(), this.historyMarker = `ring-view-${Math.random().toString(36).slice(2)}`, this.ownsHistoryEntry = !1, this.audioFallbackAttempted = !1, this.recordingPlaybackPending = !1, this.recordingPlaybackStarted = !1, this.handleMediaReady = () => {
      this.lifecycle.clearTimeout(), this.mediaStatus = "ready", this.statusAnnouncement = this.mode === "live" ? this.liveAudioStatus() : this.recordingMuted ? "Last recording loaded. Audio is muted because the browser blocked audible autoplay." : "Last recording loaded. Audio is available.";
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
        this.lifecycle.clearTimeout(), this.mediaStatus = "compatibility", this.statusAnnouncement = "Native camera playback is unavailable.";
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
    M(e) && this.mediaStatus !== "error" && (this.lifecycle.dispose(), this.session = this.lifecycle.current(), this.mediaStatus = "error", this.statusAnnouncement = "Camera entity is unavailable.");
  }
  render() {
    if (!this.open || !this.hass || !this.config) return l;
    const t = this.dialogTitle(), e = this.config.aspect_ratio, i = {
      "--ring-view-aspect-ratio": e === "auto" ? "16 / 9" : e.replace(":", " / "),
      "--ring-view-fit-mode": this.config.fit_mode
    };
    return c`
      <div class="backdrop" @pointerdown=${this.handleBackdrop}></div>
      <section
        class="dialog"
        style=${Ie(i)}
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
                ${this.icon(wt)}
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
          ${te("last_recording")}
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
          ${te("live")}
        </button>
      </div>
    `;
  }
  renderMedia() {
    const t = this.activeEntity(), e = this.activeEntityId(), i = M(t), s = !i && !this.suspended, r = Ve(this.config.aspect_ratio), n = Ue(this.hass, t, e), a = this.mode === "last_recording" && typeof t?.attributes.video_url == "string" ? t.attributes.video_url : void 0, d = !!(s && a && !this.recordingVideoFailed);
    return c`
      <div
        class=${xt({
      "media-frame": !0,
      "auto-ratio": this.config.aspect_ratio === "auto"
    })}
        role="tabpanel"
        aria-labelledby=${this.mode === "live" ? "ring-view-tab-live" : "ring-view-tab-recording"}
      >
        <img class="poster" src=${n} alt="" aria-hidden="true" />
        ${s && !d && this.mediaStatus !== "compatibility" ? Se(
      `${e}:${this.session}`,
      c`
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
    ) : l}
        ${d ? Se(
      `${e}:${this.session}:recording-video`,
      c`
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
            <div class="state-title">${N(i, this.activeEntityId())}</div>
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
    return this.suspended ? c`
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
    !this.config || t === this.mode || (this.lifecycle.dispose(), this.mode = t, this.liveMuted = this.config.live_muted, this.retryCount = 0, this.audioFallbackAttempted = !1, this.recordingPlaybackPending = !1, this.recordingPlaybackStarted = !1, this.recordingMuted = !1, this.liveHasAudio = void 0, this.recordingVideoFailed = !1, this.statusAnnouncement = t === "live" ? "Live view selected." : "Last recording selected.", this.startMedia());
  }
  startMedia() {
    if (!this.open || this.suspended) {
      this.mediaStatus = "idle";
      return;
    }
    if (M(this.activeEntity())) {
      this.mediaStatus = "error", this.statusAnnouncement = "Camera entity is unavailable.";
      return;
    }
    this.mediaStatus = "pending", this.session = this.lifecycle.next(), this.lifecycle.scheduleTimeout(
      () => this.failMedia(!0),
      jt * 1e3
    );
  }
  liveAudioStatus() {
    return this.liveMuted ? "Live view connected. Audio is muted." : this.liveHasAudio === !0 ? "Live view connected. Audio is available." : this.liveHasAudio === !1 ? "Live view connected. No audio track was detected." : "Live view connected. Audio status is still being detected.";
  }
  failMedia(t) {
    if (t && this.mode === "live" && this.retryCount < 1) {
      this.retryCount += 1, this.statusAnnouncement = "Retrying Ring live view.", this.startMedia();
      return;
    }
    this.lifecycle.dispose(), this.session = this.lifecycle.current(), this.mediaStatus = "error", this.statusAnnouncement = this.mode === "live" ? "Live view could not be started." : "No Ring recording is currently available.";
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
    }), this.dispatchEvent(
      new CustomEvent("viewer-closed", { bubbles: !0, composed: !0 })
    ), t && this.opener?.focus(), this.opener = void 0);
  }
  icon(t) {
    return c`<svg viewBox="0 0 24 24" aria-hidden="true"><path d=${t}></path></svg>`;
  }
};
f.styles = Ot;
g([
  m({ attribute: !1 })
], f.prototype, "hass", 2);
g([
  m({ attribute: !1 })
], f.prototype, "config", 2);
g([
  m({ type: Boolean, reflect: !0 })
], f.prototype, "open", 2);
g([
  v()
], f.prototype, "mode", 2);
g([
  v()
], f.prototype, "mediaStatus", 2);
g([
  v()
], f.prototype, "session", 2);
g([
  v()
], f.prototype, "suspended", 2);
g([
  v()
], f.prototype, "recordingMuted", 2);
g([
  v()
], f.prototype, "liveMuted", 2);
g([
  v()
], f.prototype, "liveHasAudio", 2);
g([
  v()
], f.prototype, "recordingVideoFailed", 2);
g([
  v()
], f.prototype, "retryCount", 2);
g([
  v()
], f.prototype, "statusAnnouncement", 2);
f = g([
  J("ring-view-dialog")
], f);
var Ft = Object.defineProperty, Bt = Object.getOwnPropertyDescriptor, O = (t, e, i, s) => {
  for (var r = s > 1 ? void 0 : s ? Bt(e, i) : e, n = t.length - 1, a; n >= 0; n--)
    (a = t[n]) && (r = (s ? a(e, i, r) : a(r)) || r);
  return s && r && Ft(e, i, r), r;
};
const qt = 1e4, Wt = 640, Kt = 16 / 9, Pe = 16;
let x = class extends A {
  constructor() {
    super(...arguments), this.previewFailed = !1, this.previewIntersecting = !1, this.previewVisible = !1, this.previewRequestId = 0, this.openViewer = () => {
      const t = this.renderRoot.querySelector(".preview") ?? void 0;
      this.renderRoot.querySelector("ring-view-dialog")?.show(Ae(this.config), t);
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
    return await Promise.resolve().then(() => Qt), document.createElement("ring-view-editor");
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
    this.config = ee(t);
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
    const t = this.previewEntityId(), e = Ue(this.hass, this.hass.states[t], t);
    (t !== this.activePreviewEntityId || e !== this.lastFallbackPoster) && (this.activePreviewEntityId = t, this.lastFallbackPoster = e, this.lastPoster = e, this.lastPreviewSize = void 0, this.previewRequestId += 1, this.previewFailed = !1);
  }
  updated(t) {
    const e = t.has("config");
    (t.has("hass") || e) && this.previewVisible && this.refreshPreview(!0);
  }
  render() {
    if (!this.hass || !this.config) return l;
    const t = this.previewEntityId(), e = this.hass.states[t], i = this.config.name || N(this.hass.states[this.config.recording_entity], "Camera"), s = Ae(this.config), r = M(e), n = {
      "--ring-view-aspect-ratio": mt(this.config.aspect_ratio),
      "--ring-view-fit-mode": this.config.fit_mode
    };
    return c`
      <ha-card>
        <div
          class="preview"
          style=${Ie(n)}
          role="button"
          tabindex="0"
          aria-label=${`Open ${i} viewer — ${Et(s)}`}
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
          ${this.config.show_name ? c`<div class="name">${i}</div>` : l}
          <div
            class=${`mode-indicator ${s === "live" ? "live" : "recording"}`}
            aria-hidden="true"
          >
            ${te(s)}
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
        }, qt);
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
    const i = Math.max(1, window.devicePixelRatio || 1), s = e.clientWidth || e.getBoundingClientRect().width, r = s > 0 ? s : Wt, n = e.clientHeight || e.getBoundingClientRect().height, a = Ve(this.config.aspect_ratio) ?? Kt, d = n > 0 ? n : r / a, o = Math.ceil(r * i), u = Math.ceil(d * i);
    if (!t && this.lastPreviewSize && Math.abs(o - this.lastPreviewSize.width) < Pe && Math.abs(u - this.lastPreviewSize.height) < Pe)
      return;
    this.lastPreviewSize = { width: o, height: u };
    const p = this.previewEntityId(), h = this.hass, b = ++this.previewRequestId;
    try {
      const w = await bt(h, p, o, u);
      if (b !== this.previewRequestId || !this.isConnected || !this.previewVisible || this.previewEntityId() !== p)
        return;
      this.lastPoster = w, this.previewFailed = !1;
    } catch {
    }
  }
};
x.styles = Lt;
O([
  m({ attribute: !1 })
], x.prototype, "hass", 2);
O([
  m({ reflect: !0 })
], x.prototype, "layout", 2);
O([
  v()
], x.prototype, "config", 2);
O([
  v()
], x.prototype, "previewFailed", 2);
O([
  v()
], x.prototype, "lastPoster", 2);
x = O([
  J(Q)
], x);
window.customCards = window.customCards || [];
window.customCards.some((t) => t.type === Q) || window.customCards.push({
  type: Q,
  name: ct,
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
var Gt = Object.defineProperty, Zt = Object.getOwnPropertyDescriptor, j = (t, e, i, s) => {
  for (var r = s > 1 ? void 0 : s ? Zt(e, i) : e, n = t.length - 1, a; n >= 0; n--)
    (a = t[n]) && (r = (s ? a(e, i, r) : a(r)) || r);
  return s && r && Gt(e, i, r), r;
};
const Yt = [
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
    iconPath: At,
    schema: [
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
      { name: "live_muted", selector: { boolean: {} } }
    ]
  },
  {
    name: "card_appearance",
    type: "expandable",
    flatten: !0,
    iconPath: _t,
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
                  { value: "16:9", label: "Widescreen (16:9)" },
                  { value: "4:3", label: "Standard (4:3)" },
                  { value: "1:1", label: "Square (1:1)" },
                  { value: "auto", label: "Automatic" }
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
                  { value: "cover", label: "Crop to fill" },
                  { value: "contain", label: "Fit entire image" }
                ]
              }
            }
          }
        ]
      }
    ]
  }
], Jt = {
  recording_entity: "Last recording camera",
  live_entity: "Live camera",
  viewer_behavior: "Viewer behavior",
  default_mode: "Open viewer on",
  live_muted: "Start live audio muted",
  card_appearance: "Card appearance",
  name: "Camera name (optional)",
  show_name: "Show name on card",
  aspect_ratio: "Image shape",
  fit_mode: "Image crop"
}, Xt = {
  default_mode: "Opening directly on Live starts a Ring live session.",
  live_muted: "Leave off to start with sound when the browser allows it."
};
let S = class extends A {
  constructor() {
    super(...arguments), this.nativeChecked = !1, this.nativeAvailable = !1, this.computeLabel = (t) => Jt[t.name], this.computeHelper = (t) => Xt[t.name], this.valueChanged = (t) => {
      if (!this.config) return;
      const e = ee({
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
    this.config = ee(t);
  }
  connectedCallback() {
    super.connectedCallback(), De().then((t) => {
      this.isConnected && (this.nativeAvailable = t, this.nativeChecked = !0);
    });
  }
  render() {
    if (!this.hass || !this.config) return l;
    const t = Ut(this.hass, this.config).filter(
      (e) => e.kind !== "compatibility" || this.nativeChecked && !this.nativeAvailable
    );
    return c`
      ${t.length ? c`
            <div class="warnings" role="status" aria-label="Configuration warnings">
              ${t.map(
      (e) => c`
                  <ha-alert alert-type="warning">${e.message}</ha-alert>
                `
    )}
            </div>
          ` : l}
      <ha-form
        .hass=${this.hass}
        .data=${this.config}
        .schema=${Yt}
        .computeLabel=${this.computeLabel}
        .computeHelper=${this.computeHelper}
        @value-changed=${this.valueChanged}
      ></ha-form>
    `;
  }
};
S.styles = Tt;
j([
  m({ attribute: !1 })
], S.prototype, "hass", 2);
j([
  v()
], S.prototype, "config", 2);
j([
  v()
], S.prototype, "nativeChecked", 2);
j([
  v()
], S.prototype, "nativeAvailable", 2);
S = j([
  J("ring-view-editor")
], S);
const Qt = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get RingViewEditor() {
    return S;
  }
}, Symbol.toStringTag, { value: "Module" }));
export {
  x as RingView
};
