var Re = "M11,15H13V17H11V15M11,7H13V13H11V7M12,2C6.47,2 2,6.5 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20Z", Et = "M10,21H14A2,2 0 0,1 12,23A2,2 0 0,1 10,21M21,19V20H3V19L5,17V11C5,7.9 7.03,5.17 10,4.29C10,4.19 10,4.1 10,4A2,2 0 0,1 12,2A2,2 0 0,1 14,4C14,4.1 14,4.19 14,4.29C16.97,5.17 19,7.9 19,11V17L21,19M17,11A5,5 0 0,0 12,6A5,5 0 0,0 7,11V18H17V11M19.75,3.19L18.33,4.61C20.04,6.3 21,8.6 21,11H23C23,8.07 21.84,5.25 19.75,3.19M1,11H3C3,8.6 3.96,6.3 5.67,4.61L4.25,3.19C2.16,5.25 1,8.07 1,11Z", ii = "M9,12C9,11.19 9.3,10.5 9.89,9.89C10.5,9.3 11.19,9 12,9C12.81,9 13.5,9.3 14.11,9.89C14.7,10.5 15,11.19 15,12C15,12.81 14.7,13.5 14.11,14.11C13.5,14.7 12.81,15 12,15C11.19,15 10.5,14.7 9.89,14.11C9.3,13.5 9,12.81 9,12M5.53,8.44L7.31,10.22L5.53,12L7.31,13.78L5.53,15.56L2,12L5.53,8.44M8.44,18.47L10.22,16.69L12,18.47L13.78,16.69L15.56,18.47L12,22L8.44,18.47M18.47,15.56L16.69,13.78L18.47,12L16.69,10.22L18.47,8.44L22,12L18.47,15.56M15.56,5.53L13.78,7.31L12,5.53L10.22,7.31L8.44,5.53L12,2L15.56,5.53Z", Ct = "M20,4H16.83L15,2H9L7.17,4H4A2,2 0 0,0 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V6A2,2 0 0,0 20,4M20,18H4V6H8.05L9.88,4H14.12L15.95,6H20V18M12,7A5,5 0 0,0 7,12A5,5 0 0,0 12,17A5,5 0 0,0 17,12A5,5 0 0,0 12,7M12,15A3,3 0 0,1 9,12A3,3 0 0,1 12,9A3,3 0 0,1 15,12A3,3 0 0,1 12,15Z", et = "M12 2C6.5 2 2 6.5 2 12S6.5 22 12 22 22 17.5 22 12 17.5 2 12 2M12 20C7.59 20 4 16.41 4 12S7.59 4 12 4 20 7.59 20 12 16.41 20 12 20M16.59 7.58L10 14.17L7.41 11.59L6 13L10 17L18 9L16.59 7.58Z", ri = "M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z", ni = "M16,11H18V13H16V11M12,3H19C20.11,3 21,3.89 21,5V19H22V21H2V19H10V5C10,3.89 10.89,3 12,3M12,5V19H19V5H12Z", tt = "M12,3C10.89,3 10,3.89 10,5H3V19H2V21H22V19H21V5C21,3.89 20.11,3 19,3H12M12,5H19V19H12V5M5,11H7V13H5V11Z", oi = "M14 15C14 16.11 13.11 17 12 17S10 16.11 10 15 10.9 13 12 13 14 13.9 14 15M18 4V20C18 21.1 17.11 22 16 22H8C6.9 22 6 21.11 6 20V4C6 2.9 6.9 2 8 2H16C17.11 2 18 2.9 18 4M10.5 7C10.5 7.83 11.17 8.5 12 8.5S13.5 7.83 13.5 7 12.83 5.5 12 5.5 10.5 6.17 10.5 7M16 10H8V20H16V10Z", si = "M5,5H10V7H7V10H5V5M14,5H19V10H17V7H14V5M17,14H19V19H14V17H17V14M10,17V19H5V14H7V17H10Z", ai = "M13.5,8H12V13L16.28,15.54L17,14.33L13.5,12.25V8M13,3A9,9 0 0,0 4,12H1L4.96,16.03L9,12H6A7,7 0 0,1 13,5A7,7 0 0,1 20,12A7,7 0 0,1 13,19C11.07,19 9.32,18.21 8.06,16.94L6.64,18.36C8.27,20 10.5,21 13,21A9,9 0 0,0 22,12A9,9 0 0,0 13,3", it = "M12,4V2A10,10 0 0,0 2,12H4A8,8 0 0,1 12,4Z", Mt = "M10 13C11.1 13 12 13.89 12 15C12 16.11 11.11 17 10 17S8 16.11 8 15 8.9 13 10 13M18 1C15.24 1 13 3.24 13 6V8H4C2.9 8 2 8.9 2 10V20C2 21.1 2.9 22 4 22H16C17.1 22 18 21.1 18 20V10C18 8.9 17.1 8 16 8H15V6C15 4.34 16.34 3 18 3S21 4.34 21 6V8H23V6C23 3.24 20.76 1 18 1M16 10V20H4V10H16Z", Lt = "M12,2A3,3 0 0,1 15,5V11A3,3 0 0,1 12,14A3,3 0 0,1 9,11V5A3,3 0 0,1 12,2M19,11C19,14.53 16.39,17.44 13,17.93V21H11V17.93C7.61,17.44 5,14.53 5,11H7A5,5 0 0,0 12,16A5,5 0 0,0 17,11H19Z", Pt = "M19,11C19,12.19 18.66,13.3 18.1,14.28L16.87,13.05C17.14,12.43 17.3,11.74 17.3,11H19M15,11.16L9,5.18V5A3,3 0 0,1 12,2A3,3 0 0,1 15,5V11L15,11.16M4.27,3L21,19.73L19.73,21L15.54,16.81C14.77,17.27 13.91,17.58 13,17.72V21H11V17.72C7.72,17.23 5,14.41 5,11H6.7C6.7,14 9.24,16.1 12,16.1C12.81,16.1 13.6,15.91 14.31,15.58L12.65,13.92L12,14A3,3 0 0,1 9,11V10.28L3,4.27L4.27,3Z", di = "M12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2C17.5,2 22,6 22,11A6,6 0 0,1 16,17H14.2C13.9,17 13.7,17.2 13.7,17.5C13.7,17.6 13.8,17.7 13.8,17.8C14.2,18.3 14.4,18.9 14.4,19.5C14.5,20.9 13.4,22 12,22M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20C12.3,20 12.5,19.8 12.5,19.5C12.5,19.3 12.4,19.2 12.4,19.1C12,18.6 11.8,18.1 11.8,17.5C11.8,16.1 12.9,15 14.3,15H16A4,4 0 0,0 20,11C20,7.1 16.4,4 12,4M6.5,10C7.3,10 8,10.7 8,11.5C8,12.3 7.3,13 6.5,13C5.7,13 5,12.3 5,11.5C5,10.7 5.7,10 6.5,10M9.5,6C10.3,6 11,6.7 11,7.5C11,8.3 10.3,9 9.5,9C8.7,9 8,8.3 8,7.5C8,6.7 8.7,6 9.5,6M14.5,6C15.3,6 16,6.7 16,7.5C16,8.3 15.3,9 14.5,9C13.7,9 13,8.3 13,7.5C13,6.7 13.7,6 14.5,6M17.5,10C18.3,10 19,10.7 19,11.5C19,12.3 18.3,13 17.5,13C16.7,13 16,12.3 16,11.5C16,10.7 16.7,10 17.5,10Z", Dt = "M8,5.14V19.14L19,12.14L8,5.14Z", ci = "M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M10,16.5L16,12L10,7.5V16.5Z";
const ce = globalThis, Oe = ce.ShadowRoot && (ce.ShadyCSS === void 0 || ce.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, ze = /* @__PURE__ */ Symbol(), rt = /* @__PURE__ */ new WeakMap();
let It = class {
  constructor(t, i, r) {
    if (this._$cssResult$ = !0, r !== ze) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = i;
  }
  get styleSheet() {
    let t = this.o;
    const i = this.t;
    if (Oe && t === void 0) {
      const r = i !== void 0 && i.length === 1;
      r && (t = rt.get(i)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), r && rt.set(i, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const li = (e) => new It(typeof e == "string" ? e : e + "", void 0, ze), Z = (e, ...t) => {
  const i = e.length === 1 ? e[0] : t.reduce((r, n, o) => r + ((a) => {
    if (a._$cssResult$ === !0) return a.cssText;
    if (typeof a == "number") return a;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + a + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(n) + e[o + 1], e[0]);
  return new It(i, e, ze);
}, hi = (e, t) => {
  if (Oe) e.adoptedStyleSheets = t.map((i) => i instanceof CSSStyleSheet ? i : i.styleSheet);
  else for (const i of t) {
    const r = document.createElement("style"), n = ce.litNonce;
    n !== void 0 && r.setAttribute("nonce", n), r.textContent = i.cssText, e.appendChild(r);
  }
}, nt = Oe ? (e) => e : (e) => e instanceof CSSStyleSheet ? ((t) => {
  let i = "";
  for (const r of t.cssRules) i += r.cssText;
  return li(i);
})(e) : e;
const { is: ui, defineProperty: pi, getOwnPropertyDescriptor: vi, getOwnPropertyNames: gi, getOwnPropertySymbols: fi, getPrototypeOf: mi } = Object, we = globalThis, ot = we.trustedTypes, _i = ot ? ot.emptyScript : "", bi = we.reactiveElementPolyfillSupport, J = (e, t) => e, pe = { toAttribute(e, t) {
  switch (t) {
    case Boolean:
      e = e ? _i : null;
      break;
    case Object:
    case Array:
      e = e == null ? e : JSON.stringify(e);
  }
  return e;
}, fromAttribute(e, t) {
  let i = e;
  switch (t) {
    case Boolean:
      i = e !== null;
      break;
    case Number:
      i = e === null ? null : Number(e);
      break;
    case Object:
    case Array:
      try {
        i = JSON.parse(e);
      } catch {
        i = null;
      }
  }
  return i;
} }, Fe = (e, t) => !ui(e, t), st = { attribute: !0, type: String, converter: pe, reflect: !1, useDefault: !1, hasChanged: Fe };
Symbol.metadata ??= /* @__PURE__ */ Symbol("metadata"), we.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
let W = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ??= []).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, i = st) {
    if (i.state && (i.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((i = Object.create(i)).wrapped = !0), this.elementProperties.set(t, i), !i.noAccessor) {
      const r = /* @__PURE__ */ Symbol(), n = this.getPropertyDescriptor(t, r, i);
      n !== void 0 && pi(this.prototype, t, n);
    }
  }
  static getPropertyDescriptor(t, i, r) {
    const { get: n, set: o } = vi(this.prototype, t) ?? { get() {
      return this[i];
    }, set(a) {
      this[i] = a;
    } };
    return { get: n, set(a) {
      const d = n?.call(this);
      o?.call(this, a), this.requestUpdate(t, d, r);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? st;
  }
  static _$Ei() {
    if (this.hasOwnProperty(J("elementProperties"))) return;
    const t = mi(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(J("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(J("properties"))) {
      const i = this.properties, r = [...gi(i), ...fi(i)];
      for (const n of r) this.createProperty(n, i[n]);
    }
    const t = this[Symbol.metadata];
    if (t !== null) {
      const i = litPropertyMetadata.get(t);
      if (i !== void 0) for (const [r, n] of i) this.elementProperties.set(r, n);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [i, r] of this.elementProperties) {
      const n = this._$Eu(i, r);
      n !== void 0 && this._$Eh.set(n, i);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(t) {
    const i = [];
    if (Array.isArray(t)) {
      const r = new Set(t.flat(1 / 0).reverse());
      for (const n of r) i.unshift(nt(n));
    } else t !== void 0 && i.push(nt(t));
    return i;
  }
  static _$Eu(t, i) {
    const r = i.attribute;
    return r === !1 ? void 0 : typeof r == "string" ? r : typeof t == "string" ? t.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    this._$ES = new Promise((t) => this.enableUpdating = t), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), this.constructor.l?.forEach((t) => t(this));
  }
  addController(t) {
    (this._$EO ??= /* @__PURE__ */ new Set()).add(t), this.renderRoot !== void 0 && this.isConnected && t.hostConnected?.();
  }
  removeController(t) {
    this._$EO?.delete(t);
  }
  _$E_() {
    const t = /* @__PURE__ */ new Map(), i = this.constructor.elementProperties;
    for (const r of i.keys()) this.hasOwnProperty(r) && (t.set(r, this[r]), delete this[r]);
    t.size > 0 && (this._$Ep = t);
  }
  createRenderRoot() {
    const t = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return hi(t, this.constructor.elementStyles), t;
  }
  connectedCallback() {
    this.renderRoot ??= this.createRenderRoot(), this.enableUpdating(!0), this._$EO?.forEach((t) => t.hostConnected?.());
  }
  enableUpdating(t) {
  }
  disconnectedCallback() {
    this._$EO?.forEach((t) => t.hostDisconnected?.());
  }
  attributeChangedCallback(t, i, r) {
    this._$AK(t, r);
  }
  _$ET(t, i) {
    const r = this.constructor.elementProperties.get(t), n = this.constructor._$Eu(t, r);
    if (n !== void 0 && r.reflect === !0) {
      const o = (r.converter?.toAttribute !== void 0 ? r.converter : pe).toAttribute(i, r.type);
      this._$Em = t, o == null ? this.removeAttribute(n) : this.setAttribute(n, o), this._$Em = null;
    }
  }
  _$AK(t, i) {
    const r = this.constructor, n = r._$Eh.get(t);
    if (n !== void 0 && this._$Em !== n) {
      const o = r.getPropertyOptions(n), a = typeof o.converter == "function" ? { fromAttribute: o.converter } : o.converter?.fromAttribute !== void 0 ? o.converter : pe;
      this._$Em = n;
      const d = a.fromAttribute(i, o.type);
      this[n] = d ?? this._$Ej?.get(n) ?? d, this._$Em = null;
    }
  }
  requestUpdate(t, i, r, n = !1, o) {
    if (t !== void 0) {
      const a = this.constructor;
      if (n === !1 && (o = this[t]), r ??= a.getPropertyOptions(t), !((r.hasChanged ?? Fe)(o, i) || r.useDefault && r.reflect && o === this._$Ej?.get(t) && !this.hasAttribute(a._$Eu(t, r)))) return;
      this.C(t, i, r);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(t, i, { useDefault: r, reflect: n, wrapped: o }, a) {
    r && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(t) && (this._$Ej.set(t, a ?? i ?? this[t]), o !== !0 || a !== void 0) || (this._$AL.has(t) || (this.hasUpdated || r || (i = void 0), this._$AL.set(t, i)), n === !0 && this._$Em !== t && (this._$Eq ??= /* @__PURE__ */ new Set()).add(t));
  }
  async _$EP() {
    this.isUpdatePending = !0;
    try {
      await this._$ES;
    } catch (i) {
      Promise.reject(i);
    }
    const t = this.scheduleUpdate();
    return t != null && await t, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if (this.renderRoot ??= this.createRenderRoot(), this._$Ep) {
        for (const [n, o] of this._$Ep) this[n] = o;
        this._$Ep = void 0;
      }
      const r = this.constructor.elementProperties;
      if (r.size > 0) for (const [n, o] of r) {
        const { wrapped: a } = o, d = this[n];
        a !== !0 || this._$AL.has(n) || d === void 0 || this.C(n, void 0, o, d);
      }
    }
    let t = !1;
    const i = this._$AL;
    try {
      t = this.shouldUpdate(i), t ? (this.willUpdate(i), this._$EO?.forEach((r) => r.hostUpdate?.()), this.update(i)) : this._$EM();
    } catch (r) {
      throw t = !1, this._$EM(), r;
    }
    t && this._$AE(i);
  }
  willUpdate(t) {
  }
  _$AE(t) {
    this._$EO?.forEach((i) => i.hostUpdated?.()), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(t)), this.updated(t);
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
  shouldUpdate(t) {
    return !0;
  }
  update(t) {
    this._$Eq &&= this._$Eq.forEach((i) => this._$ET(i, this[i])), this._$EM();
  }
  updated(t) {
  }
  firstUpdated(t) {
  }
};
W.elementStyles = [], W.shadowRootOptions = { mode: "open" }, W[J("elementProperties")] = /* @__PURE__ */ new Map(), W[J("finalized")] = /* @__PURE__ */ new Map(), bi?.({ ReactiveElement: W }), (we.reactiveElementVersions ??= []).push("2.1.2");
const Ne = globalThis, at = (e) => e, ve = Ne.trustedTypes, dt = ve ? ve.createPolicy("lit-html", { createHTML: (e) => e }) : void 0, Vt = "$lit$", I = `lit$${Math.random().toFixed(9).slice(2)}$`, Ut = "?" + I, wi = `<${Ut}>`, F = document, ee = () => F.createComment(""), te = (e) => e === null || typeof e != "object" && typeof e != "function", qe = Array.isArray, yi = (e) => qe(e) || typeof e?.[Symbol.iterator] == "function", Te = `[ 	
\f\r]`, Q = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, ct = /-->/g, lt = />/g, H = RegExp(`>|${Te}(?:([^\\s"'>=/]+)(${Te}*=${Te}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), ht = /'/g, ut = /"/g, Ht = /^(?:script|style|textarea|title)$/i, ki = (e) => (t, ...i) => ({ _$litType$: e, strings: t, values: i }), h = ki(1), V = /* @__PURE__ */ Symbol.for("lit-noChange"), l = /* @__PURE__ */ Symbol.for("lit-nothing"), pt = /* @__PURE__ */ new WeakMap(), O = F.createTreeWalker(F, 129);
function Ot(e, t) {
  if (!qe(e) || !e.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return dt !== void 0 ? dt.createHTML(t) : t;
}
const Ai = (e, t) => {
  const i = e.length - 1, r = [];
  let n, o = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", a = Q;
  for (let d = 0; d < i; d++) {
    const c = e[d];
    let p, u, v = -1, b = 0;
    for (; b < c.length && (a.lastIndex = b, u = a.exec(c), u !== null); ) b = a.lastIndex, a === Q ? u[1] === "!--" ? a = ct : u[1] !== void 0 ? a = lt : u[2] !== void 0 ? (Ht.test(u[2]) && (n = RegExp("</" + u[2], "g")), a = H) : u[3] !== void 0 && (a = H) : a === H ? u[0] === ">" ? (a = n ?? Q, v = -1) : u[1] === void 0 ? v = -2 : (v = a.lastIndex - u[2].length, p = u[1], a = u[3] === void 0 ? H : u[3] === '"' ? ut : ht) : a === ut || a === ht ? a = H : a === ct || a === lt ? a = Q : (a = H, n = void 0);
    const k = a === H && e[d + 1].startsWith("/>") ? " " : "";
    o += a === Q ? c + wi : v >= 0 ? (r.push(p), c.slice(0, v) + Vt + c.slice(v) + I + k) : c + I + (v === -2 ? d : k);
  }
  return [Ot(e, o + (e[i] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), r];
};
class ie {
  constructor({ strings: t, _$litType$: i }, r) {
    let n;
    this.parts = [];
    let o = 0, a = 0;
    const d = t.length - 1, c = this.parts, [p, u] = Ai(t, i);
    if (this.el = ie.createElement(p, r), O.currentNode = this.el.content, i === 2 || i === 3) {
      const v = this.el.content.firstChild;
      v.replaceWith(...v.childNodes);
    }
    for (; (n = O.nextNode()) !== null && c.length < d; ) {
      if (n.nodeType === 1) {
        if (n.hasAttributes()) for (const v of n.getAttributeNames()) if (v.endsWith(Vt)) {
          const b = u[a++], k = n.getAttribute(v).split(I), R = /([.?@])?(.*)/.exec(b);
          c.push({ type: 1, index: o, name: R[2], strings: k, ctor: R[1] === "." ? Ri : R[1] === "?" ? Ti : R[1] === "@" ? $i : ye }), n.removeAttribute(v);
        } else v.startsWith(I) && (c.push({ type: 6, index: o }), n.removeAttribute(v));
        if (Ht.test(n.tagName)) {
          const v = n.textContent.split(I), b = v.length - 1;
          if (b > 0) {
            n.textContent = ve ? ve.emptyScript : "";
            for (let k = 0; k < b; k++) n.append(v[k], ee()), O.nextNode(), c.push({ type: 2, index: ++o });
            n.append(v[b], ee());
          }
        }
      } else if (n.nodeType === 8) if (n.data === Ut) c.push({ type: 2, index: o });
      else {
        let v = -1;
        for (; (v = n.data.indexOf(I, v + 1)) !== -1; ) c.push({ type: 7, index: o }), v += I.length - 1;
      }
      o++;
    }
  }
  static createElement(t, i) {
    const r = F.createElement("template");
    return r.innerHTML = t, r;
  }
}
function j(e, t, i = e, r) {
  if (t === V) return t;
  let n = r !== void 0 ? i._$Co?.[r] : i._$Cl;
  const o = te(t) ? void 0 : t._$litDirective$;
  return n?.constructor !== o && (n?._$AO?.(!1), o === void 0 ? n = void 0 : (n = new o(e), n._$AT(e, i, r)), r !== void 0 ? (i._$Co ??= [])[r] = n : i._$Cl = n), n !== void 0 && (t = j(e, n._$AS(e, t.values), n, r)), t;
}
class Si {
  constructor(t, i) {
    this._$AV = [], this._$AN = void 0, this._$AD = t, this._$AM = i;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(t) {
    const { el: { content: i }, parts: r } = this._$AD, n = (t?.creationScope ?? F).importNode(i, !0);
    O.currentNode = n;
    let o = O.nextNode(), a = 0, d = 0, c = r[0];
    for (; c !== void 0; ) {
      if (a === c.index) {
        let p;
        c.type === 2 ? p = new oe(o, o.nextSibling, this, t) : c.type === 1 ? p = new c.ctor(o, c.name, c.strings, this, t) : c.type === 6 && (p = new xi(o, this, t)), this._$AV.push(p), c = r[++d];
      }
      a !== c?.index && (o = O.nextNode(), a++);
    }
    return O.currentNode = F, n;
  }
  p(t) {
    let i = 0;
    for (const r of this._$AV) r !== void 0 && (r.strings !== void 0 ? (r._$AI(t, r, i), i += r.strings.length - 2) : r._$AI(t[i])), i++;
  }
}
class oe {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(t, i, r, n) {
    this.type = 2, this._$AH = l, this._$AN = void 0, this._$AA = t, this._$AB = i, this._$AM = r, this.options = n, this._$Cv = n?.isConnected ?? !0;
  }
  get parentNode() {
    let t = this._$AA.parentNode;
    const i = this._$AM;
    return i !== void 0 && t?.nodeType === 11 && (t = i.parentNode), t;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(t, i = this) {
    t = j(this, t, i), te(t) ? t === l || t == null || t === "" ? (this._$AH !== l && this._$AR(), this._$AH = l) : t !== this._$AH && t !== V && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : yi(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== l && te(this._$AH) ? this._$AA.nextSibling.data = t : this.T(F.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    const { values: i, _$litType$: r } = t, n = typeof r == "number" ? this._$AC(t) : (r.el === void 0 && (r.el = ie.createElement(Ot(r.h, r.h[0]), this.options)), r);
    if (this._$AH?._$AD === n) this._$AH.p(i);
    else {
      const o = new Si(n, this), a = o.u(this.options);
      o.p(i), this.T(a), this._$AH = o;
    }
  }
  _$AC(t) {
    let i = pt.get(t.strings);
    return i === void 0 && pt.set(t.strings, i = new ie(t)), i;
  }
  k(t) {
    qe(this._$AH) || (this._$AH = [], this._$AR());
    const i = this._$AH;
    let r, n = 0;
    for (const o of t) n === i.length ? i.push(r = new oe(this.O(ee()), this.O(ee()), this, this.options)) : r = i[n], r._$AI(o), n++;
    n < i.length && (this._$AR(r && r._$AB.nextSibling, n), i.length = n);
  }
  _$AR(t = this._$AA.nextSibling, i) {
    for (this._$AP?.(!1, !0, i); t !== this._$AB; ) {
      const r = at(t).nextSibling;
      at(t).remove(), t = r;
    }
  }
  setConnected(t) {
    this._$AM === void 0 && (this._$Cv = t, this._$AP?.(t));
  }
}
class ye {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, i, r, n, o) {
    this.type = 1, this._$AH = l, this._$AN = void 0, this.element = t, this.name = i, this._$AM = n, this.options = o, r.length > 2 || r[0] !== "" || r[1] !== "" ? (this._$AH = Array(r.length - 1).fill(new String()), this.strings = r) : this._$AH = l;
  }
  _$AI(t, i = this, r, n) {
    const o = this.strings;
    let a = !1;
    if (o === void 0) t = j(this, t, i, 0), a = !te(t) || t !== this._$AH && t !== V, a && (this._$AH = t);
    else {
      const d = t;
      let c, p;
      for (t = o[0], c = 0; c < o.length - 1; c++) p = j(this, d[r + c], i, c), p === V && (p = this._$AH[c]), a ||= !te(p) || p !== this._$AH[c], p === l ? t = l : t !== l && (t += (p ?? "") + o[c + 1]), this._$AH[c] = p;
    }
    a && !n && this.j(t);
  }
  j(t) {
    t === l ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class Ri extends ye {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === l ? void 0 : t;
  }
}
class Ti extends ye {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== l);
  }
}
class $i extends ye {
  constructor(t, i, r, n, o) {
    super(t, i, r, n, o), this.type = 5;
  }
  _$AI(t, i = this) {
    if ((t = j(this, t, i, 0) ?? l) === V) return;
    const r = this._$AH, n = t === l && r !== l || t.capture !== r.capture || t.once !== r.once || t.passive !== r.passive, o = t !== l && (r === l || n);
    n && this.element.removeEventListener(this.name, this, r), o && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class xi {
  constructor(t, i, r) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = i, this.options = r;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    j(this, t);
  }
}
const Ei = Ne.litHtmlPolyfillSupport;
Ei?.(ie, oe), (Ne.litHtmlVersions ??= []).push("3.3.3");
const Ci = (e, t, i) => {
  const r = i?.renderBefore ?? t;
  let n = r._$litPart$;
  if (n === void 0) {
    const o = i?.renderBefore ?? null;
    r._$litPart$ = n = new oe(t.insertBefore(ee(), o), o, void 0, i ?? {});
  }
  return n._$AI(e), n;
};
const Be = globalThis;
let M = class extends W {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    const t = super.createRenderRoot();
    return this.renderOptions.renderBefore ??= t.firstChild, t;
  }
  update(t) {
    const i = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = Ci(i, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    super.connectedCallback(), this._$Do?.setConnected(!0);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._$Do?.setConnected(!1);
  }
  render() {
    return V;
  }
};
M._$litElement$ = !0, M.finalized = !0, Be.litElementHydrateSupport?.({ LitElement: M });
const Mi = Be.litElementPolyfillSupport;
Mi?.({ LitElement: M });
(Be.litElementVersions ??= []).push("4.2.2");
const zt = { ATTRIBUTE: 1 }, Ke = (e) => (...t) => ({ _$litDirective$: e, values: t });
let We = class {
  constructor(t) {
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AT(t, i, r) {
    this._$Ct = t, this._$AM = i, this._$Ci = r;
  }
  _$AS(t, i) {
    return this.update(t, i);
  }
  update(t, i) {
    return this.render(...i);
  }
};
const Ft = "important", Li = " !" + Ft, xe = Ke(class extends We {
  constructor(e) {
    if (super(e), e.type !== zt.ATTRIBUTE || e.name !== "style" || e.strings?.length > 2) throw Error("The `styleMap` directive must be used in the `style` attribute and must be the only part in the attribute.");
  }
  render(e) {
    return Object.keys(e).reduce((t, i) => {
      const r = e[i];
      return r == null ? t : t + `${i = i.includes("-") ? i : i.replace(/(?:^(webkit|moz|ms|o)|)(?=[A-Z])/g, "-$&").toLowerCase()}:${r};`;
    }, "");
  }
  update(e, [t]) {
    const { style: i } = e.element;
    if (this.ft === void 0) return this.ft = new Set(Object.keys(t)), this.render(t);
    for (const r of this.ft) t[r] == null && (this.ft.delete(r), r.includes("-") ? i.removeProperty(r) : i[r] = null);
    for (const r in t) {
      const n = t[r];
      if (n != null) {
        this.ft.add(r);
        const o = typeof n == "string" && n.endsWith(Li);
        r.includes("-") || o ? i.setProperty(r, o ? n.slice(0, -11) : n, o ? Ft : "") : i[r] = n;
      }
    }
    return V;
  }
});
const G = (e) => (t, i) => {
  i !== void 0 ? i.addInitializer(() => {
    customElements.define(e, t);
  }) : customElements.define(e, t);
};
const Pi = { attribute: !0, type: String, converter: pe, reflect: !1, hasChanged: Fe }, Di = (e = Pi, t, i) => {
  const { kind: r, metadata: n } = i;
  let o = globalThis.litPropertyMetadata.get(n);
  if (o === void 0 && globalThis.litPropertyMetadata.set(n, o = /* @__PURE__ */ new Map()), r === "setter" && ((e = Object.create(e)).wrapped = !0), o.set(i.name, e), r === "accessor") {
    const { name: a } = i;
    return { set(d) {
      const c = t.get.call(this);
      t.set.call(this, d), this.requestUpdate(a, c, e, !0, d);
    }, init(d) {
      return d !== void 0 && this.C(a, void 0, e, d), d;
    } };
  }
  if (r === "setter") {
    const { name: a } = i;
    return function(d) {
      const c = this[a];
      t.call(this, d), this.requestUpdate(a, c, e, !0, d);
    };
  }
  throw Error("Unsupported decorator location: " + r);
};
function _(e) {
  return (t, i) => typeof i == "object" ? Di(e, t, i) : ((r, n, o) => {
    const a = n.hasOwnProperty(o);
    return n.constructor.createProperty(o, r), a ? Object.getOwnPropertyDescriptor(n, o) : void 0;
  })(e, t, i);
}
function g(e) {
  return _({ ...e, state: !0, attribute: !1 });
}
const Ii = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900" role="img" aria-label="Synthetic camera preview">
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
`, Vi = {
  "common.camera": "Kamera",
  "common.close": "Schließen",
  "common.last_recording": "Letzte Aufnahme",
  "common.live": "Live",
  "common.optional": "optional",
  "common.retry": "Erneut versuchen",
  "editor.recording_entity": "Aufnahmequelle",
  "editor.recording_selection": "Ring-MQTT-Aufnahme",
  "editor.recording_selection_newest": "Neuestes Ereignis (automatisch)",
  "editor.recording_selection_selected": "Ausgewähltes Ereignis (manuell)",
  "editor.live_entity": "Live-Kamera",
  "editor.snapshot_entity": "Kamera für Geräte-Schnappschuss",
  "editor.snapshots": "Schnappschüsse",
  "editor.show_snapshot_button": "Schnappschuss-Schaltfläche anzeigen",
  "editor.snapshot_directory": "Speicherordner",
  "editor.helper_snapshot_directory_public": "Dateien im Ordner www können öffentlich zugänglich sein.",
  "editor.helper_snapshot_directory_custom": "Dieser benutzerdefinierte Ordner muss möglicherweise zuerst in Home Assistant freigegeben werden.",
  "editor.dashboard_preview": "Dashboard-Karte",
  "editor.dashboard_behavior": "Dashboard-Verhalten",
  "editor.dashboard_behavior_viewer": "Vollbildansicht öffnen",
  "editor.dashboard_behavior_interactive": "Kamera in der Karte steuern",
  "editor.dashboard_start": "Medien automatisch starten",
  "editor.dashboard_start_on_demand": "Nein — auf Tippen warten",
  "editor.dashboard_recording_muted": "Aufnahmen stumm starten",
  "editor.dashboard_live_muted": "Live stumm starten",
  "editor.viewer_behavior": "Vollbildansicht",
  "editor.default_mode": "Ansicht öffnen mit",
  "editor.remember_last_mode": "Zuletzt gewählte Ansicht merken",
  "editor.autoplay_recording": "Aufnahme automatisch abspielen",
  "editor.recording_muted": "Aufnahmen stumm starten",
  "editor.live_muted": "Live stumm starten",
  "editor.doorbell_features": "Türklingelfunktionen",
  "editor.two_way_audio": "Zwei-Wege-Audio aktivieren",
  "editor.doorbell_entity": "Türklingel-Entität",
  "editor.door_access": "Türzugang",
  "editor.door_entity": "Türschloss",
  "editor.door_contact_entity": "Türkontaktsensor",
  "editor.door_action": "Aktion beim Drücken",
  "editor.door_action_unlock": "Entriegeln",
  "editor.door_action_open": "Tür öffnen",
  "editor.door_control_visibility": "Bedienelement anzeigen in",
  "editor.door_visibility_live": "Nur Live-Ansicht — empfohlen",
  "editor.door_visibility_all": "Live-Ansicht und Aufnahmen",
  "editor.door_hold_to_activate": "Zum Aktivieren halten",
  "editor.door_control_location": "Ort der Türsteuerung",
  "editor.door_location_viewer": "Nur Vollbildansicht",
  "editor.door_location_dashboard": "Dashboard und Vollbildansicht",
  "editor.card_appearance": "Kartendarstellung",
  "editor.name": "Kameraname",
  "editor.show_name": "Kameranamen anzeigen",
  "editor.last_activity_entity": "Zeitstempel der letzten Aktivität",
  "editor.show_action_button_labels": "Text auf Sprech- und Türtasten anzeigen",
  "editor.preview_source": "Bildquelle",
  "editor.preview_fallback": "Wenn Aufnahmezeiten nicht vergleichbar sind",
  "editor.aspect_ratio": "Bildformat",
  "editor.fit_mode": "Bildanpassung",
  "editor.helper_dashboard_behavior": "Behalte die gewohnte Vorschau oder zeige die Kamerasteuerung direkt auf dem Dashboard.",
  "editor.helper_recording_entity": "Wähle die offizielle Ring-Kamera „Letzte Aufnahme“ oder Ring-MQTT „Event Select“.",
  "editor.helper_recording_selection": "Automatisch verwendet die von „Letzte Aktivität“ gemeldete Kategorie, um das neueste Klingel-, Bewegungs-, Personen- oder On-Demand-Ereignis auszuwählen. Manuell behält die Event-Select-Auswahl bei.",
  "editor.helper_live_entity": "Wähle die offizielle Ring-Kamera „Live-Ansicht“ oder eine Home-Assistant-Kamera, die mit dem Live-RTSP-Pfad von Ring-MQTT eingerichtet wurde.",
  "editor.helper_dashboard_start": "Bei Bedarf wird die ausgewählte Ansicht als Standbild angezeigt. Medien starten erst nach Tippen auf das Bild oder eine Ansichtssteuerung.",
  "editor.helper_dashboard_recording_muted": "Empfohlen für automatische Starts auf Smartphones und Wand-Tablets. Aktiviere den Ton bei Bedarf über die Mediensteuerung.",
  "editor.helper_dashboard_live_muted": "Empfohlen für automatische Starts auf Smartphones und Wand-Tablets. Aktiviere den Ton bei Bedarf über die Mediensteuerung.",
  "editor.helper_default_mode": "Beim direkten Öffnen der Live-Ansicht wird eine Ring-Live-Sitzung gestartet.",
  "editor.helper_remember_last_mode": "Verwendet die zuletzt gewählte Ansicht anstelle der Startansicht.",
  "editor.helper_autoplay_recording": "Deaktivieren, um vor dem Laden der Aufnahme auf ein Tippen auf das Kamerabild zu warten.",
  "editor.helper_recording_muted": "Deaktiviert lassen, um mit Ton zu starten. Die Autoplay-Regeln des Browsers können trotzdem ein Tippen erfordern.",
  "editor.helper_live_muted": "Deaktiviert lassen, um mit Ton zu starten. Die Autoplay-Regeln des Browsers können trotzdem ein Tippen erfordern.",
  "editor.helper_two_way_audio": "Erfordert die offizielle Ring-Live-Ansicht-Kamera und verwendet eine WebRTC-Sitzung für Video, Zuhören und Push-to-Talk.",
  "editor.helper_doorbell_entity": "Wähle ein offizielles Ring-Türklingelereignis oder einen binären Ring-MQTT-Klingelsensor. Zeigt einen Klingelhinweis, ohne den Kamerastream zu starten oder zu ersetzen.",
  "editor.helper_door_entity": "Wähle ein Home-Assistant-Schloss für eine Türaktion. Leer lassen, um den Türzugang zu deaktivieren.",
  "editor.helper_door_contact_entity": "Zeigt den physischen Türzustand: geschlossen, offen oder unbekannt. Eine offene Tür ändert die Aktion zum nicht bedienbaren Status „Tür offen“.",
  "editor.helper_door_action": "Öffnen gibt bei unterstützten Schlössern die Falle frei. Entriegeln löst nur das Schloss.",
  "editor.helper_door_control_visibility": "Nur Live ist die sicherere Voreinstellung. Live und Aufnahmen hält das Bedienelement auch über historischem Material aktiv.",
  "editor.helper_door_hold_to_activate": "Vor Ablauf der 1,6 Sekunden loslassen, um abzubrechen. Wenn deaktiviert, betätigt ein einzelnes Tippen die Tür.",
  "editor.helper_door_control_location": "Lege fest, wo die Türaktion erscheint. Nur Vollbild ist für gemeinsam genutzte Dashboards sicherer.",
  "editor.helper_show_name": "Wird oben links auf der Karte und in der Kameraansicht angezeigt.",
  "editor.helper_last_activity_entity": "Zeigt oben links eine relative Zeit an, bei sichtbarem Kameranamen darunter. Wähle einen Zeitstempel-Sensor, eine Ereignis-Entität, einen Datum-und-Uhrzeit-Helfer oder einen Ring-MQTT-Klingel- oder Bewegungssensor.",
  "editor.helper_show_action_button_labels": "Deaktivieren, um auf der Dashboard-Karte und in der Vollbildansicht nur Symbole für Sprechen und Tür anzuzeigen. Barrierefreie Bezeichnungen und Status bleiben verfügbar.",
  "editor.helper_preview_source": "Verwendet immer ein Standbild und bindet auf dem Dashboard keinen Livestream ein.",
  "editor.helper_snapshot_entity": "Wähle die von Ring-MQTT oder einer anderen Integration bereitgestellte Schnappschuss-Kamera.",
  "editor.helper_preview_fallback": "Wird verwendet, wenn beide Bilder verfügbar sind, ihre Aufnahmezeiten aber nicht zuverlässig verglichen werden können.",
  "editor.preview_recording": "Standbild der letzten Aufnahme",
  "editor.preview_live": "Standbild der Live-Kamera",
  "editor.preview_default": "Der Startansicht folgen",
  "editor.preview_snapshot": "Geräte-Schnappschuss",
  "editor.preview_newest": "Neuester Schnappschuss oder Aufnahme",
  "editor.fallback_recording": "Letzte Aufnahme",
  "editor.fallback_snapshot": "Geräte-Schnappschuss",
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
  "activity.relative": "Aktivität · {time}",
  "activity.accessible": "Letzte Aktivität, {time}",
  "activity.title": "Letzte Aktivität: {time}",
  "warning.unavailable": "{name} ist nicht verfügbar.",
  "warning.recording_media": "Die Aufnahmequelle liefert weder eine abspielbare Aufnahme-URL noch ein verwendbares Kamerabild.",
  "warning.live_stream": "Die Live-Kamera meldet keine Unterstützung für Kamera-Streaming.",
  "warning.talkback_unsupported": "Zwei-Wege-Audio erfordert die offizielle Ring-Live-Ansicht-Kamera. Video bleibt verfügbar und vorhandenes eingehendes Audio bleibt unbeeinträchtigt.",
  "warning.doorbell_event": "Das ausgewählte Türklingelereignis unterstützt den Ereignistyp ring nicht.",
  "warning.door_open_unsupported": "Das ausgewählte Schloss unterstützt das Öffnen der Türfalle nicht. Wähle Entriegeln oder ein kompatibles Schloss.",
  "warning.snapshot_required": "Wähle eine Kamera für Geräte-Schnappschüsse aus, um diese Vorschauoption zu verwenden.",
  "warning.activity_timestamp": "Die ausgewählte Entität für die letzte Aktivität liefert derzeit kein gültiges Aktivitätsdatum mit Uhrzeit.",
  "warning.compatibility": "Die native Kamerakomponente von Home Assistant ist noch nicht geladen. Die Karte versucht, sie beim Öffnen zu laden.",
  "config.invalid": "Ungültige Kartenkonfiguration.",
  "config.entity_required": "{label} muss eine Kamera-Entität sein.",
  "config.recording_source_required": "Die Aufnahmequelle muss eine Kamera- oder Auswahl-Entität sein.",
  "config.recording_entity": "Entität für letzte Aufnahme",
  "config.recording_selection": "recording_selection muss newest oder selected sein.",
  "config.live_entity": "Live-Kamera-Entität",
  "config.snapshot_entity": "Entität für Geräte-Schnappschuss",
  "config.snapshot_directory_required": "snapshot_directory ist erforderlich.",
  "config.snapshot_directory_absolute": "snapshot_directory muss ein absoluter Pfad sein, der mit / beginnt.",
  "config.snapshot_directory_root": "snapshot_directory darf nicht das Stammverzeichnis des Dateisystems sein.",
  "config.snapshot_directory_unsafe": "snapshot_directory enthält einen unsicheren oder nicht unterstützten Pfadabschnitt.",
  "config.last_activity_entity": "last_activity_entity muss eine gültige Entitäts-ID sein.",
  "config.default_mode": "default_mode muss last_recording oder live sein.",
  "config.preview_source": "preview_source ist ungültig.",
  "config.preview_fallback": "preview_fallback muss last_recording oder snapshot sein.",
  "config.aspect_ratio": "aspect_ratio ist ungültig.",
  "config.fit_mode": "fit_mode ist ungültig.",
  "config.doorbell_entity": "doorbell_entity muss eine Ereignis- oder Binärsensor-Entität sein.",
  "config.door_entity": "door_entity muss eine Schloss-Entität sein.",
  "config.door_contact_entity": "door_contact_entity muss eine Binärsensor-Entität sein.",
  "config.door_action": "door_action muss unlock oder open sein.",
  "config.door_control_visibility": "door_control_visibility muss live_only oder all_views sein.",
  "config.door_control_location": "door_control_location muss viewer_only oder dashboard_and_viewer sein.",
  "config.dashboard_behavior": "dashboard_behavior muss open_viewer oder interactive sein.",
  "config.dashboard_start": "dashboard_start muss on_demand, last_recording oder live sein.",
  "ring.alert": "Jemand ist an der Tür",
  "ring.open_live": "Live-Ansicht öffnen",
  "viewer.close_aria": "Kameraansicht schließen",
  "viewer.expand_aria": "Kameraansicht im Vollbild öffnen",
  "viewer.camera_view": "Kameraansicht",
  "viewer.entity_unavailable": "Kamera-Entität ist nicht verfügbar.",
  "viewer.suspended": "Wiedergabe pausiert, solange dieser Tab ausgeblendet ist.",
  "viewer.connecting_live": "Ring-Live-Ansicht wird verbunden…",
  "viewer.loading_recording": "Letzte Aufnahme wird geladen…",
  "viewer.play_recording": "Letzte Aufnahme abspielen",
  "viewer.start_live": "Live-Ansicht starten",
  "viewer.resume_live": "Live-Ansicht fortsetzen",
  "viewer.native_unavailable_title": "Native Kamerawiedergabe ist nicht verfügbar.",
  "viewer.native_unavailable_detail": "Diese Home-Assistant-Version stellt die erwartete Kamerakomponente nicht bereit.",
  "viewer.open_ha_camera": "Home-Assistant-Kamera öffnen",
  "viewer.live_failed": "Live-Ansicht konnte nicht gestartet werden.",
  "viewer.recording_unavailable": "Derzeit ist keine Ring-Aufnahme verfügbar.",
  "viewer.recording_unavailable_short": "Aufnahme nicht verfügbar",
  "viewer.recording_refresh_timeout": "Ring-MQTT hat nicht rechtzeitig eine neue Aufnahme-URL bereitgestellt.",
  "viewer.recording_refresh_failed": "Home Assistant konnte die Ring-MQTT-Aufnahme-URL nicht aktualisieren.",
  "viewer.recording_selection_missing": "Wähle zuerst ein Ereignis in der Ring-MQTT-Entität „Event Select“ aus.",
  "viewer.recording_playback_failed": "Die ausgewählte Ring-MQTT-Aufnahme konnte nicht abgespielt werden.",
  "viewer.recording_source_unsupported": "Diese Auswahl-Entität liefert weder eine abspielbare Aufnahme-URL noch ein erkanntes Ring-MQTT-Bedienelement „Event Select“.",
  "viewer.ring_protect": "Möglicherweise ist ein Ring-Protect-Abonnement erforderlich.",
  "viewer.switch_live": "Zu Live wechseln",
  "viewer.switch_recording": "Zur letzten Aufnahme wechseln",
  "viewer.mode_selected_live": "Live-Ansicht ausgewählt.",
  "viewer.mode_selected_recording": "Letzte Aufnahme ausgewählt.",
  "snapshot.take": "Schnappschuss aufnehmen",
  "snapshot.saving": "Schnappschuss wird aufgenommen",
  "snapshot.saved": "Schnappschuss gespeichert",
  "snapshot.unavailable": "Schnappschuss-Kamera nicht verfügbar.",
  "snapshot.write_failed": "Home Assistant kann nicht in den Schnappschuss-Ordner schreiben.",
  "snapshot.camera_failed": "Die Kamera konnte keinen Schnappschuss bereitstellen.",
  "snapshot.refresh_unavailable": "Das Ring-MQTT-Bedienelement zum Aktualisieren des Schnappschusses ist nicht verfügbar.",
  "snapshot.connection_failed": "Home Assistant ist nicht verfügbar. Versuche es erneut, sobald die Verbindung wiederhergestellt ist.",
  "snapshot.permission_failed": "Du bist nicht berechtigt, diesen Schnappschuss aufzunehmen.",
  "snapshot.timeout": "Zeitüberschreitung bei der Schnappschuss-Anfrage.",
  "snapshot.failed": "Der Schnappschuss konnte nicht gespeichert werden.",
  "viewer.recording_loaded_muted": "Letzte Aufnahme stummgeladen. Aktiviere den Ton über die Videosteuerung.",
  "viewer.recording_loaded_audio": "Letzte Aufnahme geladen. Audio ist verfügbar.",
  "viewer.live_connected_audio": "Live-Ansicht verbunden. Audio ist verfügbar.",
  "viewer.live_connected_no_audio": "Live-Ansicht verbunden. Keine Audiospur erkannt.",
  "viewer.live_connected_muted": "Live-Ansicht verbunden. Audio ist stummgeschaltet.",
  "viewer.live_detecting_audio": "Live-Ansicht verbunden. Audiostatus wird noch ermittelt.",
  "viewer.trying_ha": "Wiedergabe über die Home-Assistant-Kamera wird versucht.",
  "viewer.refreshing_recording": "Ring-MQTT-Aufnahme-URL wird aktualisiert…",
  "viewer.preparing_latest_recording": "Neueste Ring-MQTT-Aufnahme wird vorbereitet…",
  "viewer.preparing_compatible_recording": "Kompatible Ring-MQTT-Aufnahme wird vorbereitet…",
  "viewer.recording_audio_blocked": "Der Browser hat die automatische Wiedergabe mit Ton blockiert. Drücke Wiedergabe, um die Aufnahme zu starten.",
  "viewer.recording_manual_playback": "Die Aufnahme ist bereit. Starte sie über die Videosteuerung.",
  "viewer.retrying_live": "Live-Ansicht wird erneut verbunden…",
  "talkback.connecting": "Video und eingehendes Audio werden verbunden.",
  "talkback.connecting_short": "Verbindung wird hergestellt…",
  "talkback.requesting_microphone": "Mikrofon wird angefordert",
  "talkback.hold_to_talk": "Zum Sprechen halten",
  "talkback.release_to_stop": "Zum Beenden loslassen",
  "talkback.release_short": "Loslassen",
  "talkback.permission_denied": "Mikrofonzugriff abgelehnt.",
  "talkback.no_microphone": "Kein Mikrofon gefunden.",
  "talkback.microphone_busy": "Mikrofon nicht verfügbar.",
  "talkback.microphone_ended": "Mikrofon gestoppt.",
  "talkback.https_required": "Mikrofonzugriff erfordert HTTPS.",
  "talkback.playback_muted": "Der Browser hat die Live-Ansicht stumm gestartet. Ton kann über die Videosteuerung aktiviert werden.",
  "talkback.temporarily_disconnected": "Verbindung unterbrochen. Wiederherstellung derselben Sitzung wird abgewartet.",
  "talkback.webrtc_unavailable": "Dieser Browser oder die Home-Assistant-Verbindung kann Zwei-Wege-Audio nicht starten.",
  "door.actions": "Besucheraktionen",
  "door.hold_to_unlock": "Zum Entriegeln halten",
  "door.hold_to_open": "Zum Öffnen halten",
  "door.unlock": "Entriegeln",
  "door.open": "Tür öffnen",
  "door.unlocking": "Wird entriegelt…",
  "door.opening": "Tür wird geöffnet…",
  "door.unlocked": "Tür entriegelt",
  "door.opened": "Tür geöffnet",
  "door.unavailable": "Tür nicht verfügbar",
  "door.jammed": "Türschloss blockiert",
  "door.open_unsupported": "Öffnen nicht unterstützt",
  "door.contact_open": "Tür offen",
  "door.contact_unknown": "Status unbekannt",
  "door.open_when_ready": "Öffnen, wenn bereit",
  "door.unlock_when_ready": "Entriegeln, wenn bereit",
  "door.open_when_ready_aria": "Tür kann geöffnet werden, sobald das Live-Video verbunden ist",
  "door.unlock_when_ready_aria": "Tür kann entriegelt werden, sobald das Live-Video verbunden ist",
  "door.unlock_failed": "Die Tür konnte nicht entriegelt werden.",
  "door.open_failed": "Die Tür konnte nicht geöffnet werden."
}, Ui = {
  "common.camera": "Camera",
  "common.close": "Close",
  "common.last_recording": "Last recording",
  "common.live": "Live",
  "common.optional": "optional",
  "common.retry": "Retry",
  "editor.recording_entity": "Recording source",
  "editor.recording_selection": "Ring-MQTT recording",
  "editor.recording_selection_newest": "Newest event (automatic)",
  "editor.recording_selection_selected": "Selected event (manual)",
  "editor.live_entity": "Live camera",
  "editor.snapshot_entity": "Device snapshot camera",
  "editor.snapshots": "Snapshots",
  "editor.show_snapshot_button": "Show snapshot button",
  "editor.snapshot_directory": "Save folder",
  "editor.helper_snapshot_directory_public": "Files in www can be publicly accessible.",
  "editor.helper_snapshot_directory_custom": "This custom folder may need to be allowed in Home Assistant first.",
  "editor.dashboard_preview": "Dashboard card",
  "editor.dashboard_behavior": "Dashboard behavior",
  "editor.dashboard_behavior_viewer": "Open fullscreen viewer",
  "editor.dashboard_behavior_interactive": "Control camera in card",
  "editor.dashboard_start": "Start media automatically",
  "editor.dashboard_start_on_demand": "No — wait for a tap",
  "editor.dashboard_recording_muted": "Start recordings muted",
  "editor.dashboard_live_muted": "Start Live muted",
  "editor.viewer_behavior": "Fullscreen viewer",
  "editor.default_mode": "Open viewer on",
  "editor.remember_last_mode": "Remember last selected view",
  "editor.autoplay_recording": "Play recording automatically",
  "editor.recording_muted": "Start recordings muted",
  "editor.live_muted": "Start Live muted",
  "editor.doorbell_features": "Doorbell features",
  "editor.two_way_audio": "Enable two-way audio",
  "editor.doorbell_entity": "Doorbell entity",
  "editor.door_access": "Door access",
  "editor.door_entity": "Door lock",
  "editor.door_contact_entity": "Door contact sensor",
  "editor.door_action": "Action when pressed",
  "editor.door_action_unlock": "Unlock",
  "editor.door_action_open": "Open door",
  "editor.door_control_visibility": "Show control in",
  "editor.door_visibility_live": "Live view only — recommended",
  "editor.door_visibility_all": "Live and recordings",
  "editor.door_hold_to_activate": "Require hold to activate",
  "editor.door_control_location": "Door control location",
  "editor.door_location_viewer": "Fullscreen viewer only",
  "editor.door_location_dashboard": "Dashboard and fullscreen",
  "editor.card_appearance": "Card appearance",
  "editor.name": "Camera name",
  "editor.show_name": "Show camera name",
  "editor.last_activity_entity": "Last activity timestamp",
  "editor.show_action_button_labels": "Show Talk and door button text",
  "editor.preview_source": "Image source",
  "editor.preview_fallback": "If capture times cannot be compared",
  "editor.aspect_ratio": "Image shape",
  "editor.fit_mode": "Image fit",
  "editor.helper_dashboard_behavior": "Keep the familiar preview, or put camera controls directly on the dashboard.",
  "editor.helper_recording_entity": "Choose the official Ring Last recording camera or Ring-MQTT Event Select.",
  "editor.helper_recording_selection": "Automatic uses the category reported by Last activity to choose the newest Ding, Motion, Person, or on-demand event. Manual preserves the Event Select choice.",
  "editor.helper_live_entity": "Choose the official Ring Live view camera or a Home Assistant camera configured from Ring-MQTT’s live RTSP path.",
  "editor.helper_dashboard_start": "On demand shows the selected view as a still image and starts media only after you tap the image or a view control.",
  "editor.helper_dashboard_recording_muted": "Recommended for automatic starts on phones and wall tablets. Turn sound on in the media controls when needed.",
  "editor.helper_dashboard_live_muted": "Recommended for automatic starts on phones and wall tablets. Turn sound on in the media controls when needed.",
  "editor.helper_default_mode": "Opening directly on Live starts a Ring live session.",
  "editor.helper_remember_last_mode": "Uses the most recent choice instead of the opening view.",
  "editor.helper_autoplay_recording": "Turn off to wait for a tap on the camera image before loading the recording.",
  "editor.helper_recording_muted": "Leave off to start with sound. Browser autoplay rules may still require a tap.",
  "editor.helper_live_muted": "Leave off to start with sound. Browser autoplay rules may still require a tap.",
  "editor.helper_two_way_audio": "Requires the official Ring Live view camera and uses one WebRTC session for video, listening, and push-to-talk.",
  "editor.helper_doorbell_entity": "Choose an official Ring doorbell event or a Ring-MQTT binary Ding sensor. Shows an incoming-ring alert without starting or replacing the camera stream.",
  "editor.helper_door_entity": "Choose a Home Assistant lock to add a door action. Leave empty to disable door access.",
  "editor.helper_door_contact_entity": "Shows the physical door state: closed, open, or unknown. An open door changes the action to a non-interactive Door open status.",
  "editor.helper_door_action": "Open releases the latch on supported locks. Unlock only releases the lock.",
  "editor.helper_door_control_visibility": "Live only is the safer default. Live and recordings keeps the control active over historical footage.",
  "editor.helper_door_hold_to_activate": "Release before the 1.6-second hold completes to cancel. Turning this off makes a single tap operate the door.",
  "editor.helper_door_control_location": "Choose where the door action appears. Fullscreen only is safer for shared dashboards.",
  "editor.helper_show_name": "Shown at the top left of both the card and viewer.",
  "editor.helper_last_activity_entity": "Shows relative time at the top left, below the camera name when it is visible. Choose a timestamp sensor, event entity, Date and/or time helper, or a Ring-MQTT Ding or motion sensor.",
  "editor.helper_show_action_button_labels": "Turn off to show icon-only Talk and door buttons in both the dashboard card and fullscreen viewer. Accessible names and status remain available.",
  "editor.helper_preview_source": "Always uses a still image and never mounts a live stream on the dashboard.",
  "editor.helper_snapshot_entity": "Choose the snapshot camera provided by Ring-MQTT or another integration.",
  "editor.helper_preview_fallback": "Used when both images are available but their capture times cannot be reliably compared.",
  "editor.preview_recording": "Last recording snapshot",
  "editor.preview_live": "Live camera snapshot",
  "editor.preview_default": "Follow opening view",
  "editor.preview_snapshot": "Device snapshot",
  "editor.preview_newest": "Newest snapshot or recording",
  "editor.fallback_recording": "Last recording",
  "editor.fallback_snapshot": "Device snapshot",
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
  "activity.relative": "Activity · {time}",
  "activity.accessible": "Last activity, {time}",
  "activity.title": "Last activity: {time}",
  "warning.unavailable": "{name} is unavailable.",
  "warning.recording_media": "The recording source has neither a playable recording URL nor a usable camera image.",
  "warning.live_stream": "The live camera does not advertise camera streaming support.",
  "warning.talkback_unsupported": "Two-way audio requires the official Ring Live view camera. Video remains available, and any incoming audio is unaffected.",
  "warning.doorbell_event": "The selected doorbell event does not advertise the ring event type.",
  "warning.door_open_unsupported": "The selected lock does not advertise support for opening the door latch. Choose Unlock or a compatible lock.",
  "warning.snapshot_required": "Select a device snapshot camera to use this preview option.",
  "warning.activity_timestamp": "The selected last activity entity does not currently provide a valid activity date and time.",
  "warning.compatibility": "Home Assistant’s native camera component is not loaded yet. The card will attempt to load it when opened.",
  "config.invalid": "Invalid card configuration.",
  "config.entity_required": "{label} must be a camera entity.",
  "config.recording_source_required": "Recording source must be a camera or select entity.",
  "config.recording_entity": "Last recording entity",
  "config.recording_selection": "recording_selection must be newest or selected.",
  "config.live_entity": "Live camera entity",
  "config.snapshot_entity": "Device snapshot entity",
  "config.snapshot_directory_required": "snapshot_directory is required.",
  "config.snapshot_directory_absolute": "snapshot_directory must be an absolute path starting with /.",
  "config.snapshot_directory_root": "snapshot_directory cannot be the filesystem root.",
  "config.snapshot_directory_unsafe": "snapshot_directory contains an unsafe or unsupported path segment.",
  "config.last_activity_entity": "last_activity_entity must be a valid entity ID.",
  "config.default_mode": "default_mode must be last_recording or live.",
  "config.preview_source": "preview_source is invalid.",
  "config.preview_fallback": "preview_fallback must be last_recording or snapshot.",
  "config.aspect_ratio": "aspect_ratio is invalid.",
  "config.fit_mode": "fit_mode is invalid.",
  "config.doorbell_entity": "doorbell_entity must be an event or binary sensor entity.",
  "config.door_entity": "door_entity must be a lock entity.",
  "config.door_contact_entity": "door_contact_entity must be a binary sensor entity.",
  "config.door_action": "door_action must be unlock or open.",
  "config.door_control_visibility": "door_control_visibility must be live_only or all_views.",
  "config.door_control_location": "door_control_location must be viewer_only or dashboard_and_viewer.",
  "config.dashboard_behavior": "dashboard_behavior must be open_viewer or interactive.",
  "config.dashboard_start": "dashboard_start must be on_demand, last_recording, or live.",
  "ring.alert": "Someone is at the door",
  "ring.open_live": "Open live view",
  "viewer.close_aria": "Close camera viewer",
  "viewer.expand_aria": "Open fullscreen camera viewer",
  "viewer.camera_view": "Camera view",
  "viewer.entity_unavailable": "Camera entity is unavailable.",
  "viewer.suspended": "Playback paused while this tab is hidden.",
  "viewer.connecting_live": "Connecting to Ring live view…",
  "viewer.loading_recording": "Loading last recording…",
  "viewer.play_recording": "Play last recording",
  "viewer.start_live": "Start live view",
  "viewer.resume_live": "Resume live view",
  "viewer.native_unavailable_title": "Native camera playback is unavailable.",
  "viewer.native_unavailable_detail": "This Home Assistant version did not provide the expected camera component.",
  "viewer.open_ha_camera": "Open Home Assistant camera",
  "viewer.live_failed": "Live view could not be started.",
  "viewer.recording_unavailable": "No Ring recording is currently available.",
  "viewer.recording_unavailable_short": "Recording unavailable",
  "viewer.recording_refresh_timeout": "Ring-MQTT did not provide a fresh recording URL in time.",
  "viewer.recording_refresh_failed": "Home Assistant could not refresh the Ring-MQTT recording URL.",
  "viewer.recording_selection_missing": "Choose an event in the Ring-MQTT Event Select entity first.",
  "viewer.recording_playback_failed": "The selected Ring-MQTT recording could not be played.",
  "viewer.recording_source_unsupported": "This select entity does not expose a playable recording URL or a recognized Ring-MQTT Event Select control.",
  "viewer.ring_protect": "A Ring Protect subscription may be required.",
  "viewer.switch_live": "Switch to Live",
  "viewer.switch_recording": "Switch to Last recording",
  "viewer.mode_selected_live": "Live view selected.",
  "viewer.mode_selected_recording": "Last recording selected.",
  "snapshot.take": "Take snapshot",
  "snapshot.saving": "Taking snapshot",
  "snapshot.saved": "Snapshot saved",
  "snapshot.unavailable": "Snapshot camera unavailable.",
  "snapshot.write_failed": "Home Assistant cannot write to the snapshot folder.",
  "snapshot.camera_failed": "The camera could not provide a snapshot.",
  "snapshot.refresh_unavailable": "The Ring-MQTT snapshot refresh control is unavailable.",
  "snapshot.connection_failed": "Home Assistant is unavailable. Try again when it reconnects.",
  "snapshot.permission_failed": "You do not have permission to take this snapshot.",
  "snapshot.timeout": "The snapshot request timed out.",
  "snapshot.failed": "The snapshot could not be saved.",
  "viewer.recording_loaded_muted": "Last recording loaded muted. Use the video controls for sound.",
  "viewer.recording_loaded_audio": "Last recording loaded. Audio is available.",
  "viewer.live_connected_audio": "Live view connected. Audio is available.",
  "viewer.live_connected_no_audio": "Live view connected. No audio track was detected.",
  "viewer.live_connected_muted": "Live view connected. Audio is muted.",
  "viewer.live_detecting_audio": "Live view connected. Audio status is still being detected.",
  "viewer.trying_ha": "Trying Home Assistant camera playback.",
  "viewer.refreshing_recording": "Refreshing the Ring-MQTT recording URL…",
  "viewer.preparing_latest_recording": "Preparing the newest Ring-MQTT recording…",
  "viewer.preparing_compatible_recording": "Preparing a compatible Ring-MQTT recording…",
  "viewer.recording_audio_blocked": "The browser blocked automatic playback with sound. Press Play to start the recording.",
  "viewer.recording_manual_playback": "The recording is ready. Use the video controls to play it.",
  "viewer.retrying_live": "Reconnecting live view…",
  "talkback.connecting": "Connecting video and incoming audio.",
  "talkback.connecting_short": "Connecting…",
  "talkback.requesting_microphone": "Requesting microphone",
  "talkback.hold_to_talk": "Hold to talk",
  "talkback.release_to_stop": "Release to stop",
  "talkback.release_short": "Release",
  "talkback.permission_denied": "Microphone permission denied.",
  "talkback.no_microphone": "No microphone found.",
  "talkback.microphone_busy": "Microphone unavailable.",
  "talkback.microphone_ended": "Microphone stopped.",
  "talkback.https_required": "Microphone access requires HTTPS.",
  "talkback.playback_muted": "The browser started live view muted. Use the video controls to enable sound.",
  "talkback.temporarily_disconnected": "Connection interrupted. Waiting for the same session to recover.",
  "talkback.webrtc_unavailable": "This browser or Home Assistant connection cannot start two-way audio.",
  "door.actions": "Visitor actions",
  "door.hold_to_unlock": "Hold to unlock",
  "door.hold_to_open": "Hold to open",
  "door.unlock": "Unlock",
  "door.open": "Open door",
  "door.unlocking": "Unlocking…",
  "door.opening": "Opening…",
  "door.unlocked": "Door unlocked",
  "door.opened": "Door opened",
  "door.unavailable": "Door unavailable",
  "door.jammed": "Lock jammed",
  "door.open_unsupported": "Open unsupported",
  "door.contact_open": "Door open",
  "door.contact_unknown": "Status unknown",
  "door.open_when_ready": "Open when ready",
  "door.unlock_when_ready": "Unlock when ready",
  "door.open_when_ready_aria": "Open door available after live video connects",
  "door.unlock_when_ready_aria": "Unlock available after live video connects",
  "door.unlock_failed": "Couldn’t unlock the door.",
  "door.open_failed": "Couldn’t open the door."
}, vt = {
  de: Vi,
  en: Ui
};
function Hi(e) {
  const t = typeof document > "u" ? void 0 : document.documentElement.lang, i = typeof navigator > "u" ? void 0 : navigator.language;
  return e?.language || e?.locale?.language || t || i || "en";
}
function Nt(e) {
  return Hi(e).trim().toLowerCase().split(/[-_]/)[0] === "de" ? "de" : "en";
}
function s(e, t, i = {}) {
  return (vt[Nt(e)][t] ?? vt.en[t]).replace(
    /\{([a-z_]+)\}/gi,
    (n, o) => o in i ? String(i[o]) : n
  );
}
function qt(e, t, i) {
  return e?.localize?.(t) || s(e, i);
}
function Oi(e) {
  return e?.platform === "ring" ? "official_ring" : e?.platform === "mqtt" ? "mqtt" : "other";
}
function N(e, t, i) {
  const r = e.entities?.[i];
  return {
    role: t,
    entityId: i,
    entity: e.states[i],
    registry: r,
    provider: Oi(r),
    deviceId: r?.device_id ?? void 0
  };
}
function je(e, t) {
  const i = e.entities?.[t]?.device_id;
  return i ? Object.values(e.entities ?? {}).filter((r) => r.device_id === i && r.disabled_by == null && !!e.states[r.entity_id]).map((r) => r.entity_id).sort() : [];
}
function ge(e, t, i) {
  const r = je(e, t).filter((n) => {
    const o = e.states[n], a = e.entities?.[n];
    return !!(o && a && i(n, o, a));
  });
  return r.length === 1 ? r[0] : void 0;
}
const zi = /^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2})(?::(\d{2})(?:\.(\d{1,9}))?)?(Z|[+-]\d{2}:?\d{2})?$/i, Fi = /^-?\d+(?:\.\d+)?$/, Ni = 1e11, qi = [
  "lastDingTime",
  "lastMotionTime",
  "lastDing",
  "lastMotion"
], Bt = /* @__PURE__ */ new Set(["unknown", "unavailable"]);
function Bi(e) {
  const t = Number(e[1]), i = Number(e[2]), r = Number(e[3]), n = Number(e[4]), o = Number(e[5]), a = Number(e[6] ?? 0), d = new Date(Date.UTC(t, i, 0)).getUTCDate();
  return i >= 1 && i <= 12 && r >= 1 && r <= d && n >= 0 && n <= 23 && o >= 0 && o <= 59 && a >= 0 && a <= 59;
}
function T(e) {
  if (typeof e != "string" && typeof e != "number") return;
  const t = String(e).trim();
  if (!t || ["unknown", "unavailable", "none", "null"].includes(t.toLowerCase()))
    return;
  if (Fi.test(t)) {
    const o = Number(t);
    if (!Number.isFinite(o)) return;
    const a = Math.abs(o) < Ni ? o * 1e3 : o;
    return Number.isFinite(new Date(a).getTime()) ? a : void 0;
  }
  const i = t.match(zi);
  if (!i || !Bi(i)) return;
  const r = t.includes(" ") ? t.replace(" ", "T") : t, n = Date.parse(r);
  return Number.isFinite(n) ? n : void 0;
}
function Ki(e) {
  return T(e?.state);
}
function le(e) {
  const t = e.filter((i) => i !== void 0);
  return t.length > 0 ? Math.max(...t) : void 0;
}
function gt(e) {
  if (!(!e || Bt.has(e.state)))
    return le(
      qi.map(
        (t) => T(e.attributes[t])
      )
    );
}
function z(e, t) {
  const i = e.states[t], r = i && !Bt.has(i.state), n = r ? [Ki(i)] : [];
  if (!t.startsWith("binary_sensor.") || (r && n.push(gt(i)), N(e, "activity", t).provider !== "mqtt")) return le(n);
  for (const a of je(e, t))
    a === t || !a.startsWith("binary_sensor.") || N(e, "activity", a).provider !== "mqtt" || n.push(gt(e.states[a]));
  return le(n);
}
function Wi(e) {
  const t = Math.abs(e);
  return t < 60 ? { unit: "second", seconds: 1 } : t < 3600 ? { unit: "minute", seconds: 60 } : t < 86400 ? { unit: "hour", seconds: 3600 } : t < 2629746 ? { unit: "day", seconds: 86400 } : t < 31556952 ? { unit: "month", seconds: 2629746 } : { unit: "year", seconds: 31556952 };
}
function ji(e, t) {
  const i = Math.trunc(e / t);
  return Object.is(i, -0) ? 0 : i;
}
function Kt(e, t, i = Date.now()) {
  const r = Nt(e), n = (t - i) / 1e3, { unit: o, seconds: a } = Wi(n), d = ji(n, a), c = new Intl.RelativeTimeFormat(r, {
    numeric: "auto",
    style: "short"
  }).format(d, o), p = r === "en" ? c.replace(/\b(sec|min|hr)\./g, "$1") : c, u = new Intl.RelativeTimeFormat(r, {
    numeric: "auto",
    style: "long"
  }).format(d, o), v = new Intl.DateTimeFormat(r, {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(t);
  return {
    relative: s(e, "activity.relative", { time: p }),
    accessible: s(e, "activity.accessible", {
      time: u
    }),
    title: s(e, "activity.title", { time: v })
  };
}
var Zi = Object.defineProperty, Gi = Object.getOwnPropertyDescriptor, Ze = (e, t, i, r) => {
  for (var n = r > 1 ? void 0 : r ? Gi(t, i) : t, o = e.length - 1, a; o >= 0; o--)
    (a = e[o]) && (n = (r ? a(t, i, n) : a(n)) || n);
  return r && n && Zi(t, i, n), n;
};
const Qi = 3e4;
let re = class extends M {
  disconnectedCallback() {
    this.clearRefreshTimer(), super.disconnectedCallback();
  }
  render() {
    const e = this.hass && this.entityId ? z(this.hass, this.entityId) : void 0;
    if (e === void 0) return l;
    const t = Kt(this.hass, e);
    return h`
      <span aria-label=${t.accessible} title=${t.title}>
        ${t.relative}
      </span>
    `;
  }
  updated() {
    this.clearRefreshTimer(), (this.hass && this.entityId ? z(this.hass, this.entityId) : void 0) !== void 0 && (this.refreshTimer = window.setTimeout(() => {
      this.refreshTimer = void 0, this.requestUpdate(), this.dispatchEvent(
        new CustomEvent("ring-view-activity-tick", {
          bubbles: !0,
          composed: !0
        })
      );
    }, Qi));
  }
  clearRefreshTimer() {
    this.refreshTimer !== void 0 && (window.clearTimeout(this.refreshTimer), this.refreshTimer = void 0);
  }
};
re.styles = Z`
    :host {
      display: block;
      min-width: 0;
      overflow: hidden;
      color: var(--ring-view-activity-color, rgba(255, 255, 255, 0.84));
      font-size: var(--ring-view-activity-font-size, 12px);
      font-weight: 500;
      line-height: var(--ring-view-activity-line-height, 16px);
      text-shadow: 0 1px 4px rgba(0, 0, 0, 0.82);
      white-space: nowrap;
      pointer-events: auto;
    }

    span {
      display: block;
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  `;
Ze([
  _({ attribute: !1 })
], re.prototype, "hass", 2);
Ze([
  _({ attribute: "entity-id" })
], re.prototype, "entityId", 2);
re = Ze([
  G("ring-view-activity-time")
], re);
const Yi = [
  "video_url",
  "recordingUrl",
  "recording_url"
], Ji = [
  "eventId",
  "event_id",
  "last_video_id"
], Xi = 3e4, er = {
  ding: "Ding",
  motion: "Motion",
  person: "Person",
  on_demand: "On-demand"
};
function tr(e) {
  const t = e.trim().toLowerCase();
  return t === "" || t.includes("<recording not found>") || t.includes("<transcoding in progress>");
}
function ke(e) {
  if (e)
    for (const t of Yi) {
      const i = e.attributes[t];
      if (!(typeof i != "string" || tr(i)))
        return i.trim();
    }
}
function ir(e) {
  let t;
  try {
    t = new URL(e, "http://homeassistant.local");
  } catch {
    return;
  }
  const i = /* @__PURE__ */ new Map();
  t.searchParams.forEach((k, R) => {
    i.set(R.toLowerCase(), k);
  });
  const r = i.get("x-amz-date"), n = Number(i.get("x-amz-expires"));
  if (!r || !Number.isFinite(n) || n < 0) return;
  const o = /^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})Z$/i.exec(r);
  if (!o) return;
  const [, a, d, c, p, u, v] = o, b = Date.UTC(
    Number(a),
    Number(d) - 1,
    Number(c),
    Number(p),
    Number(u),
    Number(v)
  );
  return Number.isFinite(b) ? b + n * 1e3 : void 0;
}
function B(e, t = Date.now()) {
  const i = ke(e);
  if (!i) return !1;
  const r = ir(i);
  return r === void 0 || r - t > Xi;
}
function Y(e) {
  if (!e) return;
  const t = ke(e), i = e.attributes.eventId ?? e.attributes.event_id;
  if (t) return `${String(i ?? "")}:${t}`;
  for (const r of ["last_video_id", "entity_picture"]) {
    const n = e.attributes[r];
    if (typeof n == "string" && n !== "") return `${r}:${n}`;
    if (typeof n == "number" && Number.isFinite(n))
      return `${r}:${n}`;
  }
}
function rr(e) {
  if (e) {
    for (const t of Ji) {
      const i = e.attributes[t];
      if (typeof i == "string" && i.trim() !== "")
        return `${t}:${i.trim()}`;
      if (typeof i == "number" && Number.isFinite(i))
        return `${t}:${String(i)}`;
    }
    return e.last_updated ? `updated:${e.last_updated}` : void 0;
  }
}
function ft(e) {
  const t = e?.state.trim(), i = e?.attributes.options;
  if (!t || /\s\(transcoded\)$/i.test(t) || !Array.isArray(i))
    return;
  const r = `${t} (Transcoded)`.toLowerCase();
  return i.find(
    (o) => typeof o == "string" && o.toLowerCase() === r
  );
}
function nr(e) {
  if (typeof e == "string")
    switch (e.trim().toLowerCase().replace(/[\s-]+/g, "_")) {
      case "ding":
      case "ring":
      case "doorbell":
        return "ding";
      case "motion":
        return "motion";
      case "person":
        return "person";
      case "on_demand":
      case "ondemand":
        return "on_demand";
      default:
        return;
    }
}
function or(e) {
  for (const t of [
    e.attributes.created_at,
    e.attributes.timestamp,
    e.attributes.event_timestamp,
    e.state
  ]) {
    const i = T(t);
    if (i !== void 0) return i;
  }
}
function sr(e) {
  if (!e || e.state === "unknown" || e.state === "unavailable")
    return [];
  const t = [], i = nr(
    e.attributes.category ?? e.attributes.event_type ?? e.attributes.eventType
  ), r = or(e);
  if (i && r !== void 0) {
    const a = e.attributes.recording_status;
    t.push({
      category: i,
      timestamp: r,
      recordingReady: typeof a != "string" || a.trim().toLowerCase() === "ready"
    });
  }
  const n = T(
    e.attributes.lastDingTime ?? e.attributes.lastDing
  );
  n !== void 0 && t.push({
    category: "ding",
    timestamp: n,
    recordingReady: !0
  });
  const o = T(
    e.attributes.lastMotionTime ?? e.attributes.lastMotion
  );
  return o !== void 0 && t.push({
    category: e.attributes.personDetected === !0 ? "person" : "motion",
    timestamp: o,
    recordingReady: !0
  }), t;
}
function ar(e, t) {
  return [.../* @__PURE__ */ new Set([
    t,
    ...je(e, t)
  ])].flatMap(
    (n) => sr(e.states[n])
  ).reduce(
    (n, o) => n === void 0 || o.timestamp > n.timestamp ? o : n,
    void 0
  );
}
function dr(e, t, i, r = !1) {
  if (!t || !i) return;
  const n = ar(e, t), o = i.attributes.options;
  if (!n || !Array.isArray(o)) return;
  const a = `${er[n.category]} 1`, d = o.find(
    (u) => typeof u == "string" && u.toLowerCase() === a.toLowerCase()
  ), c = o.find(
    (u) => typeof u == "string" && u.toLowerCase() === `${a} (transcoded)`.toLowerCase()
  ), p = r ? c ?? d : d ?? c;
  if (p)
    return {
      option: p,
      marker: `${n.category}:${String(n.timestamp)}`,
      recordingReady: n.recordingReady
    };
}
function X(e, t) {
  if (!t.startsWith("select.")) return !1;
  const i = N(e, "recording", t);
  if (i.provider !== "mqtt") return !1;
  const r = i.registry?.unique_id?.toLowerCase(), n = i.registry?.original_name?.trim().toLowerCase();
  return r?.endsWith("_event_select") === !0 || n === "event select" || "recordingUrl" in (i.entity?.attributes ?? {}) || "eventId" in (i.entity?.attributes ?? {});
}
function mt(e, t) {
  if (!t) return !1;
  const i = e.states[t]?.state;
  return i !== void 0 && i !== "unavailable" && i !== "unknown";
}
function Wt(e, t) {
  return t.recording_entity.startsWith("camera.") ? t.recording_entity : mt(e, t.snapshot_entity) ? t.snapshot_entity : (mt(e, t.live_entity), t.live_entity);
}
const cr = 2, lr = 1;
function y(e) {
  return !e || e.state === "unavailable" || e.state === "unknown";
}
function jt(e) {
  return (Number(e?.attributes.supported_features ?? 0) & cr) !== 0;
}
function Ee(e, t) {
  return N(e, "live", t).provider === "official_ring" && jt(e.states[t]);
}
function he(e) {
  return (Number(e?.attributes.supported_features ?? 0) & lr) !== 0;
}
function hr(e) {
  return !!(ke(e) || e?.attributes.entity_picture);
}
function ur(e, t) {
  if (!e || !t) return [];
  const i = e.states[t.recording_entity], r = e.states[t.live_entity], n = [];
  if (y(i) ? n.push({
    kind: "recording",
    message: s(e, "warning.unavailable", {
      name: x(i, t.recording_entity)
    })
  }) : hr(i) || n.push({
    kind: "recording",
    message: s(e, "warning.recording_media")
  }), y(r) ? n.push({
    kind: "live",
    message: s(e, "warning.unavailable", {
      name: x(r, t.live_entity)
    })
  }) : jt(r) ? t.two_way_audio && !Ee(e, t.live_entity) && n.push({
    kind: "talkback",
    message: s(e, "warning.talkback_unsupported")
  }) : n.push({
    kind: "live",
    message: s(e, "warning.live_stream")
  }), t.snapshot_entity && ["snapshot", "newest"].includes(t.preview_source)) {
    const o = e.states[t.snapshot_entity];
    y(o) && n.push({
      kind: "snapshot",
      message: s(e, "warning.unavailable", {
        name: x(o, t.snapshot_entity)
      })
    });
  } else ["snapshot", "newest"].includes(t.preview_source) && n.push({
    kind: "snapshot",
    message: s(e, "warning.snapshot_required")
  });
  if (t.last_activity_entity) {
    const o = e.states[t.last_activity_entity];
    y(o) ? n.push({
      kind: "last_activity",
      message: s(e, "warning.unavailable", {
        name: x(o, t.last_activity_entity)
      })
    }) : z(e, t.last_activity_entity) === void 0 && n.push({
      kind: "last_activity",
      message: s(e, "warning.activity_timestamp")
    });
  }
  if (t.doorbell_entity) {
    const o = e.states[t.doorbell_entity];
    y(o) ? n.push({
      kind: "doorbell",
      message: s(e, "warning.unavailable", {
        name: x(o, t.doorbell_entity)
      })
    }) : Array.isArray(o?.attributes.event_types) && !o.attributes.event_types.includes("ring") && n.push({
      kind: "doorbell",
      message: s(e, "warning.doorbell_event")
    });
  }
  if (t.door_entity) {
    const o = e.states[t.door_entity];
    y(o) ? n.push({
      kind: "door",
      message: s(e, "warning.unavailable", {
        name: x(o, t.door_entity)
      })
    }) : t.door_action === "open" && !he(o) && n.push({
      kind: "door",
      message: s(e, "warning.door_open_unsupported")
    });
  }
  if (t.door_contact_entity) {
    const o = e.states[t.door_contact_entity];
    y(o) && n.push({
      kind: "door_contact",
      message: s(e, "warning.unavailable", {
        name: x(o, t.door_contact_entity)
      })
    });
  }
  return customElements.get("ha-camera-stream") || n.push({
    kind: "compatibility",
    message: s(e, "warning.compatibility")
  }), n;
}
function x(e, t) {
  return e?.attributes.friendly_name || t;
}
const pr = [
  "timestamp",
  "capture_timestamp",
  "captured_at",
  "recorded_at",
  "last_recording_at",
  "recording_timestamp"
];
function vr(e) {
  if (typeof e == "number")
    return !Number.isFinite(e) || e <= 0 ? void 0 : e < 1e12 ? e * 1e3 : e;
  if (typeof e != "string" || e.trim() === "") return;
  const t = Number(e);
  if (Number.isFinite(t) && t > 0)
    return t < 1e12 ? t * 1e3 : t;
  const i = Date.parse(e);
  return Number.isFinite(i) && i > 0 ? i : void 0;
}
function fe(e) {
  if (e)
    for (const t of pr) {
      const i = vr(e.attributes[t]);
      if (i !== void 0) return i;
    }
}
function gr(e) {
  return Y(e);
}
function P(e, t) {
  return Wt(e, t);
}
function fr(e, t, i) {
  const r = t.recording_entity, n = t.snapshot_entity;
  if (!n) return P(e, t);
  const o = e.states[r], a = e.states[n], d = !y(o), c = !y(a);
  if (d && !c)
    return P(e, t);
  if (c && !d) return n;
  if (d && c) {
    const p = fe(o), u = fe(a);
    if (p !== void 0 && u !== void 0)
      return p !== u ? u > p ? n : P(e, t) : t.preview_fallback === "snapshot" ? n : P(e, t);
    if (i !== void 0)
      return i === "snapshot" ? n : P(e, t);
  }
  return t.preview_fallback === "snapshot" ? n : P(e, t);
}
function mr(e, t, i, r) {
  switch (t.preview_source) {
    case "live":
      return t.live_entity;
    case "snapshot":
      return t.snapshot_entity ?? P(e, t);
    case "newest":
      return fr(e, t, r);
    case "default":
      return i === "live" ? t.live_entity : P(e, t);
    default:
      return P(e, t);
  }
}
const _r = "/media/ring-view";
function Ae(e) {
  const t = e.trim();
  return t.length > 1 ? t.replace(/\/+$/, "") : t;
}
function br(e) {
  if (typeof e != "string" || e.trim() === "") return "required";
  const t = Ae(e);
  if (!t.startsWith("/")) return "absolute";
  if (t === "/") return "root";
  if (/[\u0000-\u001f\u007f]/.test(t) || t.includes("{{") || t.includes("}}") || t.split("/").some((i) => i === "." || i === ".."))
    return "unsafe";
}
function wr(e) {
  const t = Ae(e);
  if (t === "/config/www" || t.startsWith("/config/www/"))
    return "public";
  if (!(t === "/media" || t.startsWith("/media/")))
    return "custom";
}
function yr(e, t) {
  return t.snapshot_entity && !y(e.states[t.snapshot_entity]) ? t.snapshot_entity : y(e.states[t.live_entity]) ? void 0 : t.live_entity;
}
function _t(e, t) {
  return fe(e.states[t]);
}
function kr(e, t) {
  if (N(e, "snapshot", t).provider !== "mqtt")
    return;
  const i = ge(
    e,
    t,
    (r, n, o) => r.startsWith("button.") && o.platform === "mqtt" && (o.unique_id?.endsWith("_take_snapshot") === !0 || o.original_name === "Take Snapshot")
  );
  return i || ge(
    e,
    t,
    (r, n, o) => r.startsWith("button.") && o.platform === "mqtt"
  );
}
function Ar(e, t) {
  if (N(e, "snapshot", t).provider !== "mqtt")
    return;
  const i = ge(
    e,
    t,
    (r, n, o) => r.startsWith("camera.") && o.platform === "mqtt" && (o.unique_id?.endsWith("_snapshot") === !0 || o.original_name === "Snapshot")
  );
  return i || ge(
    e,
    t,
    (r, n, o) => r.startsWith("camera.") && o.platform === "mqtt"
  );
}
function Sr(e, t) {
  return N(e, "snapshot", t).provider === "mqtt";
}
function Rr(e, t) {
  const i = e.states[t.live_entity];
  return (t.name || x(i, t.live_entity.split(".", 2)[1] || "ring-camera")).normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-{2,}/g, "-").replace(/^-+|-+$/g, "") || "ring-camera";
}
function K(e, t) {
  return e.find((i) => i.type === t)?.value ?? "00";
}
function Tr(e, t) {
  const i = Number.isFinite(e.getTime()) ? e : /* @__PURE__ */ new Date(0), r = {
    timeZone: t,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23"
  };
  let n;
  try {
    n = new Intl.DateTimeFormat("en-CA", r).formatToParts(i);
  } catch {
    delete r.timeZone, n = new Intl.DateTimeFormat("en-CA", r).formatToParts(i);
  }
  const o = String(i.getMilliseconds()).padStart(3, "0");
  return [
    `${K(n, "year")}-${K(n, "month")}-${K(n, "day")}`,
    `${K(n, "hour")}-${K(n, "minute")}-${K(n, "second")}-${o}`
  ].join("_");
}
function $r(e, t, i = /* @__PURE__ */ new Date()) {
  const r = Ae(t.snapshot_directory), n = Tr(i, e.config?.time_zone);
  return `${r}/${Rr(e, t)}_${n}.jpg`;
}
const Ge = "custom:ring-view", Ce = "ring-view", xr = "Ring View", w = {
  default_mode: "last_recording",
  recording_selection: "newest",
  remember_last_mode: !1,
  autoplay_recording: !0,
  recording_muted: !1,
  live_muted: !1,
  two_way_audio: !1,
  door_action: "unlock",
  door_control_visibility: "live_only",
  door_control_location: "viewer_only",
  door_hold_to_activate: !0,
  dashboard_behavior: "open_viewer",
  dashboard_start: "on_demand",
  dashboard_recording_muted: !0,
  dashboard_live_muted: !0,
  show_name: !1,
  show_action_button_labels: !0,
  preview_source: "last_recording",
  preview_fallback: "last_recording",
  show_snapshot_button: !1,
  snapshot_directory: _r,
  aspect_ratio: "auto",
  fit_mode: "contain"
}, Er = /* @__PURE__ */ new Set(["last_recording", "live"]), Cr = /* @__PURE__ */ new Set(["newest", "selected"]), Mr = /* @__PURE__ */ new Set([
  "last_recording",
  "live",
  "default",
  "snapshot",
  "newest"
]), Lr = /* @__PURE__ */ new Set(["last_recording", "snapshot"]), Pr = /* @__PURE__ */ new Set(["auto", "16:9", "4:3", "1:1"]), Dr = /* @__PURE__ */ new Set(["cover", "contain"]), Ir = /* @__PURE__ */ new Set(["unlock", "open"]), Vr = /* @__PURE__ */ new Set(["live_only", "all_views"]), Ur = /* @__PURE__ */ new Set([
  "viewer_only",
  "dashboard_and_viewer"
]), Hr = /* @__PURE__ */ new Set(["open_viewer", "interactive"]), Or = /* @__PURE__ */ new Set(["on_demand", "last_recording", "live"]), zr = ["event.", "binary_sensor."];
function bt(e, t) {
  if (typeof e != "string" || !e.startsWith("camera."))
    throw new Error(
      s(void 0, "config.entity_required", {
        label: s(void 0, t)
      })
    );
}
function Fr(e) {
  if (typeof e != "string" || !e.startsWith("camera.") && !e.startsWith("select."))
    throw new Error(s(void 0, "config.recording_source_required"));
}
function Nr(e) {
  if (!e || typeof e != "object")
    throw new Error(s(void 0, "config.invalid"));
  if (Fr(e.recording_entity), bt(e.live_entity, "config.live_entity"), e.snapshot_entity !== void 0 && e.snapshot_entity !== "" && bt(e.snapshot_entity, "config.snapshot_entity"), e.last_activity_entity !== void 0 && e.last_activity_entity !== "" && (typeof e.last_activity_entity != "string" || !/^[a-z0-9_]+\.[a-z0-9_]+$/i.test(e.last_activity_entity)))
    throw new Error(s(void 0, "config.last_activity_entity"));
  if (e.default_mode && !Er.has(e.default_mode))
    throw new Error(s(void 0, "config.default_mode"));
  if (e.recording_selection && !Cr.has(e.recording_selection))
    throw new Error(s(void 0, "config.recording_selection"));
  if (e.preview_source && !Mr.has(e.preview_source))
    throw new Error(s(void 0, "config.preview_source"));
  if (e.preview_fallback && !Lr.has(e.preview_fallback))
    throw new Error(s(void 0, "config.preview_fallback"));
  if (e.snapshot_directory !== void 0) {
    const t = br(e.snapshot_directory);
    if (t)
      throw new Error(
        s(void 0, `config.snapshot_directory_${t}`)
      );
  }
  if (e.aspect_ratio && !Pr.has(e.aspect_ratio))
    throw new Error(s(void 0, "config.aspect_ratio"));
  if (e.fit_mode && !Dr.has(e.fit_mode))
    throw new Error(s(void 0, "config.fit_mode"));
  if (e.doorbell_entity !== void 0 && e.doorbell_entity !== "" && (typeof e.doorbell_entity != "string" || !zr.some((t) => e.doorbell_entity.startsWith(t))))
    throw new Error(s(void 0, "config.doorbell_entity"));
  if (e.door_entity !== void 0 && e.door_entity !== "" && (typeof e.door_entity != "string" || !e.door_entity.startsWith("lock.")))
    throw new Error(s(void 0, "config.door_entity"));
  if (e.door_contact_entity !== void 0 && e.door_contact_entity !== "" && (typeof e.door_contact_entity != "string" || !e.door_contact_entity.startsWith("binary_sensor.")))
    throw new Error(s(void 0, "config.door_contact_entity"));
  if (e.door_action && !Ir.has(e.door_action))
    throw new Error(s(void 0, "config.door_action"));
  if (e.door_control_visibility && !Vr.has(e.door_control_visibility))
    throw new Error(s(void 0, "config.door_control_visibility"));
  if (e.door_control_location && !Ur.has(e.door_control_location))
    throw new Error(s(void 0, "config.door_control_location"));
  if (e.dashboard_behavior && !Hr.has(e.dashboard_behavior))
    throw new Error(s(void 0, "config.dashboard_behavior"));
  if (e.dashboard_start && !Or.has(e.dashboard_start))
    throw new Error(s(void 0, "config.dashboard_start"));
}
function Me(e) {
  return Nr(e), {
    type: e.type ?? Ge,
    recording_entity: e.recording_entity,
    recording_selection: e.recording_selection ?? w.recording_selection,
    live_entity: e.live_entity,
    snapshot_entity: e.snapshot_entity || void 0,
    last_activity_entity: e.last_activity_entity || void 0,
    name: e.name,
    default_mode: e.default_mode ?? w.default_mode,
    remember_last_mode: e.remember_last_mode ?? w.remember_last_mode,
    autoplay_recording: e.autoplay_recording ?? w.autoplay_recording,
    recording_muted: e.recording_muted ?? w.recording_muted,
    live_muted: e.live_muted ?? w.live_muted,
    two_way_audio: e.two_way_audio ?? w.two_way_audio,
    doorbell_entity: e.doorbell_entity || void 0,
    door_entity: e.door_entity || void 0,
    door_contact_entity: e.door_contact_entity || void 0,
    door_action: e.door_action ?? w.door_action,
    door_control_visibility: e.door_control_visibility ?? w.door_control_visibility,
    door_control_location: e.door_control_location ?? w.door_control_location,
    door_hold_to_activate: e.door_hold_to_activate ?? w.door_hold_to_activate,
    dashboard_behavior: e.dashboard_behavior ?? w.dashboard_behavior,
    dashboard_start: e.dashboard_start ?? w.dashboard_start,
    dashboard_recording_muted: e.dashboard_recording_muted ?? w.dashboard_recording_muted,
    dashboard_live_muted: e.dashboard_live_muted ?? w.dashboard_live_muted,
    show_name: e.show_name ?? w.show_name,
    show_action_button_labels: e.show_action_button_labels ?? w.show_action_button_labels,
    preview_source: e.preview_source ?? w.preview_source,
    preview_fallback: e.preview_fallback ?? w.preview_fallback,
    show_snapshot_button: e.show_snapshot_button ?? w.show_snapshot_button,
    snapshot_directory: Ae(
      e.snapshot_directory ?? w.snapshot_directory
    ),
    aspect_ratio: e.aspect_ratio ?? w.aspect_ratio,
    fit_mode: e.fit_mode ?? w.fit_mode,
    grid_options: e.grid_options
  };
}
function Le(e) {
  switch (e) {
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
function Zt(e, t) {
  const i = t !== void 0 && Number.isFinite(t) && t > 0 ? t : void 0;
  return e === "auto" ? i?.toString() ?? "16 / 9" : e.replace(":", " / ");
}
const Qe = "ring-view-live-entity", Ye = "ring-view-recording-entity", Je = "ring-view-mode", me = "ring-view-ringing-until";
function Gt() {
  return `${window.location.pathname}${window.location.search}${window.location.hash}`;
}
function Pe(e = window.location.search) {
  const t = e instanceof URLSearchParams ? e : new URLSearchParams(e), i = t.get(Qe), r = t.get(Ye), n = t.get(Je);
  if (!i?.startsWith("camera.") || !r?.startsWith("camera.") && !r?.startsWith("select.") || n !== "live" && n !== "last_recording")
    return;
  const o = t.get(me), a = o === null ? void 0 : Number(o);
  return {
    liveEntity: i,
    recordingEntity: r,
    mode: n,
    ringingUntil: a !== void 0 && Number.isFinite(a) ? a : void 0
  };
}
function De(e, t) {
  return e?.liveEntity === t.live_entity && e.recordingEntity === t.recording_entity;
}
function qr(e, t) {
  const i = new URL(e, window.location.origin);
  return i.searchParams.set(Qe, t.liveEntity), i.searchParams.set(Ye, t.recordingEntity), i.searchParams.set(Je, t.mode), t.ringingUntil !== void 0 && t.ringingUntil > Date.now() ? i.searchParams.set(me, String(t.ringingUntil)) : i.searchParams.delete(me), `${i.pathname}${i.search}${i.hash}`;
}
function Qt(e) {
  const t = new URL(e, window.location.origin);
  return t.searchParams.delete(Qe), t.searchParams.delete(Ye), t.searchParams.delete(Je), t.searchParams.delete(me), `${t.pathname}${t.search}${t.hash}`;
}
function Ie(e, t) {
  try {
    const i = window.history.state && typeof window.history.state == "object" ? window.history.state : {};
    let r = i;
    if (t === null) {
      const { refreshUrl: n, ...o } = i;
      r = o;
    } else t !== void 0 && (r = { ...i, refreshUrl: t });
    window.history.replaceState(
      r,
      "",
      e
    );
  } catch {
  }
}
const Xe = "ring-view-dialog", ue = 12e3;
let ne;
function Br(e) {
  ne = e;
}
function Kr(e) {
  ne === e && (ne = void 0);
}
function Wr(e) {
  return !e.restored || !ne?.isOpenFor(e) ? !1 : (ne.adoptRestoredDialog(e), !0);
}
function $e(e, t) {
  if (Wr(t)) return;
  const i = Qt(Gt());
  Ie(i), e.dispatchEvent(
    new CustomEvent("show-dialog", {
      detail: {
        dialogTag: Xe,
        dialogImport: () => Promise.resolve().then(() => Pn),
        dialogParams: { ...t, returnUrl: i },
        addHistory: !0
      },
      bubbles: !0,
      composed: !0
    })
  );
}
const jr = 9e3, wt = /* @__PURE__ */ new WeakMap();
function Yt(e, t, i, r) {
  const n = t?.attributes.entity_picture, o = typeof n == "string" && n.length > 0 ? e.hassUrl(n) : e.hassUrl(`/api/camera_proxy/${encodeURIComponent(i)}`);
  if (!r) return o;
  const a = o.includes("?") ? "&" : "?";
  return `${o}${a}ring_view_media=${encodeURIComponent(r)}`;
}
async function Zr(e, t, i, r) {
  const n = await Jt(e, t), o = n.includes("?") ? "&" : "?";
  return `${n}${o}width=${Ve(i)}&height=${Ve(r)}`;
}
async function Gr(e, t, i) {
  const r = await Jt(e, t), n = r.includes("?") ? "&" : "?";
  return `${r}${n}width=${Ve(i)}`;
}
function Ve(e) {
  return Math.max(1, Math.ceil(Number.isFinite(e) ? e : 1));
}
async function Jt(e, t) {
  let i = wt.get(e);
  i || (i = /* @__PURE__ */ new Map(), wt.set(e, i));
  const r = Date.now(), n = i.get(t);
  if (n && n.expiresAt > r) return n.promise;
  const o = e.callWS({
    type: "auth/sign_path",
    path: `/api/camera_proxy/${encodeURIComponent(t)}`
  }).then((a) => {
    if (!a || typeof a.path != "string" || a.path.length === 0)
      throw new Error("Home Assistant did not return a signed camera path.");
    return e.hassUrl(a.path);
  });
  i.set(t, {
    expiresAt: r + jr,
    promise: o
  });
  try {
    return await o;
  } catch (a) {
    throw i.delete(t), a;
  }
}
function yt(e) {
  return e === "live" ? h`<span class="mode-icon mode-icon-live" aria-hidden="true"></span>` : h`
    <svg class="mode-icon mode-icon-recording" viewBox="0 0 24 24" aria-hidden="true">
      <path d=${ai}></path>
    </svg>
  `;
}
function Qr(e, t) {
  return s(
    t,
    e === "live" ? "common.live" : "common.last_recording"
  );
}
const Yr = Z`
  :host {
    --ring-view-focus-color: rgba(255, 255, 255, 0.92);
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

  ha-card.interactive {
    cursor: default;
  }

  ha-card.safe-preview {
    cursor: default;
  }

  .inline-shell {
    position: relative;
    width: 100%;
    height: 100%;
    min-height: 120px;
    aspect-ratio: var(--ring-view-aspect-ratio, 16 / 9);
    overflow: hidden;
    background: #000;
  }

  :host([layout="grid"]):not([intrinsic-grid-height]) .inline-shell {
    aspect-ratio: auto;
  }

  :host([layout="grid"][intrinsic-grid-height]),
  :host([layout="grid"][intrinsic-grid-height]) ha-card,
  :host([layout="grid"][intrinsic-grid-height]) .inline-shell {
    height: auto;
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

  :host([layout="grid"]):not([intrinsic-grid-height]) .preview {
    aspect-ratio: auto;
  }

  :host([layout="grid"][intrinsic-grid-height]) .preview {
    height: auto;
  }

  .preview:focus-visible {
    outline: 3px solid var(--ring-view-focus-color);
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

  .header-copy {
    position: absolute;
    inset: 12px auto auto 16px;
    display: grid;
    min-width: 0;
    max-width: calc(100% - 76px);
    overflow: hidden;
    --ring-view-activity-color: rgba(255, 255, 255, 0.84);
    --ring-view-activity-font-size: 12px;
    --ring-view-activity-line-height: 16px;
  }

  .name {
    min-width: 0;
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

  .ring-alert {
    position: absolute;
    inset: auto 12px 12px;
    display: flex;
    min-height: 42px;
    align-items: center;
    justify-content: center;
    gap: 9px;
    padding: 7px 13px;
    box-sizing: border-box;
    border: 1px solid rgba(255, 255, 255, 0.42);
    border-radius: 999px;
    color: #fff;
    background: rgba(198, 40, 40, 0.9);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.35);
    font-size: 14px;
    font-weight: 600;
    line-height: 18px;
    pointer-events: none;
  }

  .ring-alert svg {
    width: 20px;
    height: 20px;
    flex: 0 0 auto;
    fill: currentColor;
  }

  @media (prefers-reduced-motion: reduce) {
    .preview:active::after {
      display: none;
    }
  }
`, Jr = Z`
  :host {
    --ring-view-control-size: 44px;
    --ring-view-primary-size: 48px;
    --ring-view-control-surface: rgba(0, 0, 0, 0.3);
    --ring-view-control-lift-top: rgba(255, 255, 255, 0.08);
    --ring-view-control-lift-bottom: rgba(255, 255, 255, 0.045);
    --ring-view-action-surface: rgba(0, 0, 0, 0.48);
    --ring-view-message-surface: rgba(10, 10, 10, 0.78);
    --ring-view-focus-color: rgba(255, 255, 255, 0.92);
    --ring-view-live-color: #ff3b30;
    --ring-view-ring-color: #ffb020;
    --ring-view-success-color: #50d890;
    --ring-view-error-color: #ff6b6b;
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
    width: min(
      1180px,
      calc(100vw - 32px),
      var(--ring-view-dialog-height-limited-width, 1180px)
    );
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
    grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
    align-items: center;
    min-height: 72px;
    padding: 14px 16px 18px 20px;
    box-sizing: border-box;
    gap: 12px;
    background: linear-gradient(rgba(0, 0, 0, 0.7), transparent);
    pointer-events: none;
  }

  .header-copy {
    grid-column: 1;
    grid-row: 1;
    display: grid;
    align-content: center;
    min-width: 0;
    max-width: 100%;
    overflow: hidden;
    --ring-view-activity-color: rgba(255, 255, 255, 0.84);
    --ring-view-activity-font-size: 13px;
    --ring-view-activity-line-height: 18px;
  }

  h2 {
    min-width: 0;
    margin: 0;
    max-width: 100%;
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
    grid-column: 3;
    grid-row: 1;
    display: flex;
    align-items: center;
    justify-self: end;
    min-height: var(--ring-view-control-size);
    gap: 8px;
    overflow: visible;
    background: transparent;
    pointer-events: auto;
  }

  .camera-actions {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .ring-indicator {
    width: var(--ring-view-control-size);
    height: var(--ring-view-control-size);
    display: inline-grid;
    place-items: center;
    flex: 0 0 auto;
    border-radius: 50%;
    color: var(--ring-view-ring-color);
    background: var(--ring-view-control-surface);
    box-shadow: none;
    pointer-events: none;
  }

  .ring-indicator svg {
    width: 22px;
    height: 22px;
    animation: ring-once 550ms ease-out 1;
  }

  button {
    font: inherit;
  }

  .icon-button {
    position: relative;
    width: var(--ring-view-control-size);
    height: var(--ring-view-control-size);
    display: inline-grid;
    place-items: center;
    flex: 0 0 auto;
    padding: 0;
    border: 0;
    border-radius: 50%;
    color: #fff;
    background: transparent;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
    transition: color 140ms ease, opacity 140ms ease;
  }

  .snapshot-action,
  .chrome-action {
    background: var(--ring-view-control-surface);
  }

  .icon-button::before,
  .mode-button::before {
    content: "";
    position: absolute;
    inset: 4px;
    z-index: 0;
    border-radius: 50%;
    background: transparent;
    transition: background 140ms ease, box-shadow 140ms ease, transform 100ms ease;
  }

  .icon-button > svg,
  .mode-button > svg,
  .mode-button > .mode-icon-live {
    position: relative;
    z-index: 1;
  }

  .icon-button:hover:not(:disabled)::before,
  .mode-button:hover::before {
    background: rgba(255, 255, 255, 0.13);
  }

  .icon-button:active:not(:disabled)::before,
  .mode-button:active::before {
    background: rgba(255, 255, 255, 0.18);
    transform: scale(0.92);
  }

  .icon-button:disabled {
    color: rgba(255, 255, 255, 0.38);
    cursor: default;
  }

  .icon-button:disabled:hover {
    background: transparent;
  }

  .icon-button:disabled::before {
    background: transparent;
  }

  .snapshot-action.working svg {
    animation: spin 0.85s linear infinite;
  }

  .snapshot-action.success {
    color: var(--ring-view-success-color);
  }

  .snapshot-action.success::before {
    background: rgba(22, 128, 75, 0.28);
  }

  .snapshot-action.error {
    color: var(--ring-view-error-color);
  }

  .snapshot-action.error::before {
    background: rgba(166, 35, 35, 0.34);
  }

  .icon-button:focus-visible,
  .mode-button:focus-visible,
  .action-button:focus-visible {
    outline: none;
  }

  .icon-button:focus-visible::before,
  .mode-button:focus-visible::before {
    box-shadow: 0 0 0 3px var(--ring-view-focus-color);
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
    grid-column: 2;
    grid-row: 1;
    display: flex;
    align-items: center;
    justify-self: center;
    min-height: var(--ring-view-control-size);
    gap: 0;
    overflow: visible;
    border-radius: 28px;
    background: var(--ring-view-control-surface);
    pointer-events: auto;
  }

  .mode-button {
    position: relative;
    display: inline-grid;
    width: var(--ring-view-control-size);
    height: var(--ring-view-control-size);
    flex: 0 0 auto;
    padding: 0;
    place-items: center;
    border: 0;
    border-radius: 50%;
    color: #fff;
    background: transparent;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
  }

  .mode-button:hover {
    color: #fff;
    background: transparent;
  }

  .mode-button[aria-selected="true"] {
    color: #fff;
    background: transparent;
  }

  .mode-button[aria-selected="true"]::before {
    background: rgba(255, 255, 255, 0.17);
  }

  .mode-button[aria-selected="true"]:hover::before {
    background: rgba(255, 255, 255, 0.22);
  }

  .mode-button.live[aria-selected="true"] {
    color: #fff;
    background: transparent;
  }

  .mode-button svg {
    width: 20px;
    height: 20px;
  }

  .mode-button .mode-icon-live {
    width: 17px;
    height: 17px;
    border-radius: 50%;
    background: var(--ring-view-live-color);
    box-shadow: none;
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

  .poster,
  ring-view-native-camera-adapter,
  ring-view-ring-webrtc-player,
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

  ring-view-native-camera-adapter.pending,
  ring-view-ring-webrtc-player.pending {
    opacity: 0.01;
  }

  .video-fallback.pending {
    opacity: 0;
  }

  .video-fallback.controls-hidden {
    cursor: pointer;
  }

  .video-fallback.controls-hidden:focus-visible {
    outline: 3px solid var(--ring-view-focus-color);
    outline-offset: -3px;
  }

  .initial-start-surface {
    position: absolute;
    inset: 0;
    z-index: 1;
    width: 100%;
    height: 100%;
    padding: 0;
    border: 0;
    background: transparent;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
  }

  .initial-start-surface:hover {
    background: rgba(255, 255, 255, 0.035);
  }

  .initial-start-surface:active {
    background: rgba(255, 255, 255, 0.07);
  }

  .initial-start-surface:focus-visible {
    outline: 3px solid var(--ring-view-focus-color);
    outline-offset: -4px;
  }

  .visitor-controls {
    position: absolute;
    z-index: 7;
    inset: auto 16px 72px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    pointer-events: none;
  }

  .visitor-action-dock {
    display: flex;
    height: var(--ring-view-primary-size);
    max-width: 100%;
    align-items: center;
    justify-content: center;
    gap: 0;
    padding: 0;
    overflow: hidden;
    border: 0;
    border-radius: 28px;
    color: #fff;
    background: var(--ring-view-control-surface);
    box-shadow: none;
    pointer-events: auto;
  }

  .visitor-action {
    position: relative;
    height: var(--ring-view-primary-size);
    min-height: var(--ring-view-primary-size);
    display: inline-flex;
    min-width: 112px;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 0 15px;
    overflow: hidden;
    border: 0;
    border-radius: 999px;
    color: #fff;
    background: transparent;
    font-size: 15px;
    font-weight: 600;
    line-height: 20px;
    white-space: nowrap;
    cursor: pointer;
    touch-action: none;
    user-select: none;
    -webkit-user-select: none;
    -webkit-tap-highlight-color: transparent;
    transition: color 140ms ease, opacity 140ms ease, transform 100ms ease;
  }

  .visitor-action::before {
    content: "";
    position: absolute;
    inset: 4px;
    z-index: 0;
    border-radius: calc((var(--ring-view-primary-size) - 8px) / 2);
    background: transparent;
    transition: background 140ms ease, box-shadow 140ms ease, transform 100ms ease;
  }

  .visitor-action > * {
    position: relative;
    z-index: 2;
  }

  .visitor-action > span {
    min-width: 0;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .visitor-action:hover:not(:disabled)::before {
    background: rgba(255, 255, 255, 0.13);
  }

  .visitor-action:active:not(:disabled)::before {
    transform: scale(0.97);
  }

  .door-action:active::before {
    transform: none;
  }

  .visitor-action:focus-visible {
    z-index: 2;
    outline: none;
  }

  .visitor-action:focus-visible::before {
    box-shadow: 0 0 0 3px var(--ring-view-focus-color);
  }

  .visitor-action:disabled {
    color: rgba(255, 255, 255, 0.4);
    cursor: default;
  }

  .visitor-action:disabled::before {
    background: transparent;
  }

  .visitor-action svg {
    width: 23px;
    height: 23px;
    flex: 0 0 auto;
  }

  .talk-action.active {
    background: transparent;
  }

  .talk-action.active::before {
    background: rgba(255, 59, 48, 0.82);
  }

  .talk-action.active:hover::before {
    background: rgba(255, 59, 48, 0.9);
  }

  .talk-action {
    width: 142px;
    max-width: 142px;
  }

  .door-action svg {
    color: #fff;
  }

  .door-action {
    width: 168px;
    min-width: 168px;
    max-width: 168px;
  }

  .visitor-action-dock.icon-only .visitor-action {
    width: var(--ring-view-primary-size);
    min-width: var(--ring-view-primary-size);
    max-width: var(--ring-view-primary-size);
    gap: 0;
    padding: 0;
  }

  .door-action-copy {
    display: inline-flex;
    min-width: 0;
    flex-direction: column;
    align-items: flex-start;
    overflow: hidden;
  }

  .door-action-copy > span {
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .door-contact-state {
    color: rgba(255, 255, 255, 0.58);
    font-size: 10px;
    font-weight: 500;
    line-height: 12px;
  }

  .door-action.contact-open {
    color: var(--ring-view-ring-color);
    background: transparent;
  }

  .door-action.contact-open::before {
    background: rgba(255, 176, 32, 0.2);
  }

  .door-action.contact-open:disabled {
    color: #fff;
  }

  .door-action::after {
    content: "";
    position: absolute;
    top: 4px;
    bottom: 4px;
    left: 4px;
    z-index: 1;
    width: 0;
    border-radius: calc((var(--ring-view-primary-size) - 8px) / 2) 0 0
      calc((var(--ring-view-primary-size) - 8px) / 2);
    background: rgba(255, 176, 32, 0.58);
    pointer-events: none;
  }

  .visitor-action-dock.icon-only .door-action::after {
    border-radius: calc((var(--ring-view-primary-size) - 8px) / 2);
  }

  .door-action.holding::after {
    animation: door-hold 1600ms linear forwards;
  }

  .door-action.working {
    color: #ffe0a4;
    background: transparent;
  }

  .door-action.working svg {
    animation: spin 0.85s linear infinite;
  }

  .door-action.success {
    color: var(--ring-view-success-color);
    background: transparent;
  }

  .door-action.success::before {
    background: rgba(38, 145, 91, 0.24);
  }

  .door-action.success svg {
    color: currentColor;
  }

  .door-action.error {
    color: #fff;
    background: transparent;
  }

  .door-action.error::before {
    background: rgba(199, 51, 51, 0.62);
  }

  .state-layer {
    position: absolute;
    inset: 0;
    display: grid;
    place-items: center;
    padding: 24px;
    box-sizing: border-box;
    color: #fff;
    background: rgba(0, 0, 0, 0.28);
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

  .viewer-feedback-layer {
    z-index: 6;
    padding: 76px 24px;
    background: transparent;
    pointer-events: none;
  }

  .viewer-feedback-layer .state-card {
    width: auto;
    max-width: min(430px, 100%);
    min-height: 44px;
    justify-content: center;
    padding: 11px 15px;
    box-sizing: border-box;
    border-radius: 22px;
    background: var(--ring-view-message-surface);
    pointer-events: auto;
  }

  .viewer-feedback-layer .state-title {
    font-size: 14px;
    line-height: 19px;
    text-align: left;
  }

  .doorbell-alert-layer {
    z-index: 6;
    background: transparent;
    pointer-events: none;
  }

  .doorbell-alert-layer .state-actions {
    pointer-events: auto;
  }

  .loading-state .state-card {
    width: auto;
    flex-direction: row;
    gap: 11px;
  }

  .spinner {
    width: 26px;
    height: 26px;
    flex: 0 0 auto;
    border: 2.5px solid rgba(255, 255, 255, 0.3);
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
    min-height: var(--ring-view-control-size);
    padding: 0 16px;
    border: 0;
    border-radius: calc(var(--ring-view-control-size) / 2);
    color: #fff;
    background: var(--ring-view-action-surface);
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
  }

  .action-button:hover {
    background-color: rgba(0, 0, 0, 0.64);
  }

  .action-button:focus-visible {
    outline: 3px solid var(--ring-view-focus-color);
    outline-offset: 3px;
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
    background: var(--ring-view-action-surface);
  }

  .mode-switch,
  .ring-indicator,
  .snapshot-action,
  .chrome-action,
  .visitor-action-dock,
  .viewer-feedback-layer .state-card,
  .action-button {
    background-image: linear-gradient(
      180deg,
      var(--ring-view-control-lift-top),
      var(--ring-view-control-lift-bottom)
    );
    backdrop-filter: blur(16px) saturate(120%);
    -webkit-backdrop-filter: blur(16px) saturate(120%);
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

  @keyframes door-hold {
    from {
      width: 0;
    }
    to {
      width: calc(100% - 8px);
    }
  }

  @keyframes ring-once {
    0%,
    100% {
      transform: rotate(0);
    }
    25% {
      transform: rotate(10deg);
    }
    55% {
      transform: rotate(-9deg);
    }
    80% {
      transform: rotate(4deg);
    }
  }

  @media (max-width: 600px) {
    :host {
      --ring-view-control-size: 48px;
    }

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
      --ring-view-camera-action-offset: 0px;
      display: block;
      min-height: calc(64px + env(safe-area-inset-top));
      padding: calc(10px + env(safe-area-inset-top))
        calc(10px + env(safe-area-inset-right)) 14px
        calc(16px + env(safe-area-inset-left));
    }

    .header.camera-actions-one {
      --ring-view-camera-action-offset: calc(var(--ring-view-control-size) + 8px);
    }

    .header.camera-actions-two {
      --ring-view-camera-action-offset: calc(2 * var(--ring-view-control-size) + 16px);
    }

    .header-copy {
      position: absolute;
      top: calc(12px + env(safe-area-inset-top));
      right: calc(
        176px + var(--ring-view-camera-action-offset)
        + env(safe-area-inset-right)
      );
      left: calc(16px + env(safe-area-inset-left));
    }

    .mode-switch {
      position: absolute;
      top: calc(10px + env(safe-area-inset-top));
      right: calc(
        68px + var(--ring-view-camera-action-offset)
        + env(safe-area-inset-right)
      );
      transform: none;
    }

    .header-actions {
      position: absolute;
      top: calc(10px + env(safe-area-inset-top));
      right: calc(10px + env(safe-area-inset-right));
      display: flex;
      min-height: var(--ring-view-control-size);
      gap: 8px;
      background: transparent;
    }

    .camera-actions {
      display: flex;
    }

    .header-actions .chrome-action {
      position: relative;
      inset: auto;
      background-color: var(--ring-view-control-surface);
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

    .visitor-controls {
      right: max(8px, env(safe-area-inset-right));
      bottom: max(64px, calc(56px + env(safe-area-inset-bottom)));
      left: max(8px, env(safe-area-inset-left));
    }

    .visitor-action {
      gap: 7px;
      font-size: 14px;
    }
  }

  @media (max-width: 600px) and (orientation: portrait) {
    :host(:not([inline])) {
      --ring-view-control-lift-top: rgba(255, 255, 255, 0.14);
      --ring-view-control-lift-bottom: rgba(255, 255, 255, 0.09);
    }

    :host(:not([inline])) .header-copy {
      right: calc(
        50% + var(--ring-view-control-size) + 8px
      );
    }

    :host(:not([inline])) .mode-switch {
      right: auto;
      left: 50%;
      transform: translateX(-50%);
    }
  }

  @media (max-width: 452px) and (orientation: portrait) {
    :host(:not([inline])) .header.camera-actions-two {
      min-height: calc(124px + env(safe-area-inset-top));
    }

    :host(:not([inline])) .header.camera-actions-two .mode-switch {
      top: calc(66px + env(safe-area-inset-top));
    }
  }

  @media (max-width: 340px) and (orientation: portrait) {
    :host(:not([inline])) .header.camera-actions-one {
      min-height: calc(124px + env(safe-area-inset-top));
    }

    :host(:not([inline])) .header.camera-actions-one .mode-switch {
      top: calc(66px + env(safe-area-inset-top));
    }
  }

  @media (max-height: 500px) and (orientation: landscape) {
    .dialog {
      inset: 0;
      width: 100vw;
      height: 100dvh;
      max-height: none;
      border: 0;
      border-radius: 0;
      transform: none;
    }

    .header {
      min-height: calc(64px + env(safe-area-inset-top));
      padding: calc(10px + env(safe-area-inset-top))
        calc(10px + env(safe-area-inset-right)) 14px
        calc(16px + env(safe-area-inset-left));
    }

    .body {
      position: relative;
      flex: 1 1 auto;
      width: 100%;
      height: 100%;
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

    .visitor-controls {
      right: max(8px, env(safe-area-inset-right));
      bottom: max(72px, calc(64px + env(safe-area-inset-bottom)));
      left: max(8px, env(safe-area-inset-left));
    }
  }

  @media (max-width: 340px) {
    .visitor-action {
      gap: 6px;
      padding-inline: 10px;
      font-size: 13px;
    }
  }

  @media (max-width: 360px) {
    .header.camera-actions-two .header-copy {
      display: none;
    }
  }

  @media (max-width: 290px) {
    .visitor-action {
      min-width: var(--ring-view-control-size);
      padding-inline: 8px;
    }

    .visitor-action > span {
      display: none;
    }

    .talk-action,
    .door-action {
      width: var(--ring-view-control-size);
      min-width: var(--ring-view-control-size);
      max-width: var(--ring-view-control-size);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .spinner {
      animation: none;
      border-color: rgba(255, 255, 255, 0.7);
    }

    .talk-action.active {
      transform: none;
    }

    .ring-indicator svg {
      animation: none;
    }

    .icon-button,
    .icon-button::before,
    .mode-button::before,
    .visitor-action,
    .visitor-action::before {
      transition: none;
    }

    .door-action.holding::after,
    .door-action.working svg,
    .snapshot-action.working svg {
      animation: none;
    }

    .door-action.holding::after {
      width: calc(100% - 8px);
    }
  }

  @media (forced-colors: active) {
    .mode-switch,
    .ring-indicator,
    .snapshot-action,
    .chrome-action,
    .visitor-action-dock,
    .viewer-feedback-layer .state-card,
    .action-button {
      border: 1px solid ButtonText;
      color: ButtonText;
      background: ButtonFace;
      forced-color-adjust: none;
    }

    .icon-button:focus-visible::before,
    .mode-button:focus-visible::before,
    .visitor-action:focus-visible::before {
      box-shadow: 0 0 0 3px Highlight;
    }

    .icon-button:focus-visible,
    .mode-button:focus-visible,
    .visitor-action:focus-visible {
      outline: 3px solid Highlight;
      outline-offset: -4px;
      forced-color-adjust: none;
    }

    .mode-button[aria-selected="true"] {
      color: HighlightText;
    }

    .mode-button[aria-selected="true"]::before,
    .talk-action.active::before,
    .door-action.holding::after {
      background: Highlight;
      forced-color-adjust: none;
    }

    .mode-button .mode-icon-live {
      background: LinkText;
      forced-color-adjust: none;
    }

    .ring-indicator {
      color: LinkText;
      forced-color-adjust: none;
    }
  }

  :host([inline]) {
    position: relative;
    inset: auto;
    z-index: auto;
    display: block;
    width: 100%;
    height: 100%;
    min-height: 120px;
  }

  :host([inline]) .dialog {
    position: relative;
    inset: auto;
    width: 100%;
    height: 100%;
    max-height: none;
    border: 0;
    border-radius: 0;
    box-shadow: none;
    transform: none;
  }

  :host([inline]) .body {
    width: 100%;
    height: 100%;
    container-name: ring-view-inline;
    container-type: size;
  }

  :host([inline]) .media-frame {
    top: auto;
    width: 100%;
    height: 100%;
    min-height: 120px;
    max-height: none;
    transform: none;
  }

  :host([inline]) .header {
    --ring-view-header-actions-width: var(--ring-view-control-size);
    display: grid;
    grid-template-columns:
      minmax(0, 1fr) auto
      minmax(var(--ring-view-header-actions-width), 1fr);
    min-height: 64px;
    padding: 10px 10px 14px 16px;
  }

  :host([inline]) .header.camera-actions-one {
    --ring-view-header-actions-width: calc(
      2 * var(--ring-view-control-size) + 8px
    );
  }

  :host([inline]) .header.camera-actions-two {
    --ring-view-header-actions-width: calc(
      3 * var(--ring-view-control-size) + 16px
    );
  }

  :host([inline]) .header-copy {
    position: static;
  }

  :host([inline]) .mode-switch {
    position: static;
    transform: none;
  }

  :host([inline]) .header-actions {
    position: static;
    display: flex;
    width: auto;
    min-height: var(--ring-view-control-size);
    flex-direction: row;
    gap: 8px;
    background: transparent;
    transform: none;
  }

  :host([inline]) .camera-actions {
    display: flex;
  }

  :host([inline]) .header-actions .expand {
    position: relative;
    inset: auto;
    background-color: var(--ring-view-control-surface);
  }

  :host([inline]) h2 {
    font-size: var(--ha-font-size-l, 16px);
    line-height: 20px;
  }

  :host([inline]) .header-copy {
    --ring-view-activity-font-size: 12px;
    --ring-view-activity-line-height: 16px;
  }

  :host([inline]) .visitor-controls {
    right: 8px;
    bottom: 8px;
    left: 8px;
  }

  :host([inline]) .state-layer.with-visitor-controls {
    padding: 64px 16px;
  }

  :host([inline]) .state-layer.with-visitor-controls .state-card {
    width: auto;
    max-width: 100%;
    flex-direction: row;
    justify-content: center;
    gap: 10px;
  }

  :host([inline]) .doorbell-alert-layer.with-visitor-controls .state-card {
    flex-direction: column;
    gap: 8px;
  }

  :host([inline]) .state-layer.with-visitor-controls .spinner {
    flex: 0 0 auto;
  }

  @container ring-view-inline (max-height: 220px) {
    :host([inline]) .blocking-state {
      place-items: center;
      padding: 64px 12px 8px;
    }

    :host([inline]) .blocking-state .state-card {
      gap: 6px;
    }

    :host([inline]) .blocking-state .state-title {
      font-size: 14px;
      line-height: 18px;
    }

    :host([inline]) .blocking-state .state-detail {
      display: none;
    }

    :host([inline]) .blocking-state .action-button {
      min-height: 40px;
      padding-inline: 14px;
    }

    :host([inline]) .body:has(.state-layer.with-visitor-controls) .visitor-controls {
      visibility: hidden;
      pointer-events: none;
    }
  }
`, Xr = Z`
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
`, en = "ring-view:mode:";
function Xt(e) {
  return `${en}${e.recording_entity}|${e.live_entity}`;
}
function ae(e) {
  if (!e.remember_last_mode) return e.default_mode;
  try {
    const t = window.localStorage.getItem(Xt(e));
    return t === "live" || t === "last_recording" ? t : e.default_mode;
  } catch {
    return e.default_mode;
  }
}
function tn(e, t) {
  if (e.remember_last_mode)
    try {
      window.localStorage.setItem(Xt(e), t);
    } catch {
    }
}
const C = Ke(class extends We {
  constructor(e) {
    if (super(e), e.type !== zt.ATTRIBUTE || e.name !== "class" || e.strings?.length > 2) throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.");
  }
  render(e) {
    return " " + Object.keys(e).filter((t) => e[t]).join(" ") + " ";
  }
  update(e, [t]) {
    if (this.st === void 0) {
      this.st = /* @__PURE__ */ new Set(), e.strings !== void 0 && (this.nt = new Set(e.strings.join(" ").split(/\s/).filter((r) => r !== "")));
      for (const r in t) t[r] && !this.nt?.has(r) && this.st.add(r);
      return this.render(t);
    }
    const i = e.element.classList;
    for (const r of this.st) r in t || (i.remove(r), this.st.delete(r));
    for (const r in t) {
      const n = !!t[r];
      n === this.st.has(r) || this.nt?.has(r) || (n ? (i.add(r), this.st.add(r)) : (i.remove(r), this.st.delete(r)));
    }
    return V;
  }
});
const rn = {}, nn = (e, t = rn) => e._$AH = t;
const kt = Ke(class extends We {
  constructor() {
    super(...arguments), this.key = l;
  }
  render(e, t) {
    return this.key = e, t;
  }
  update(e, [t, i]) {
    return t !== this.key && (nn(e), this.key = t), i;
  }
}), on = "ring-view-media-aspect-ratio", sn = 1e-3;
function At(e, t) {
  if (!(!Number.isFinite(e) || !Number.isFinite(t) || e <= 0 || t <= 0))
    return e / t;
}
function q(e) {
  return e instanceof HTMLVideoElement ? At(e.videoWidth, e.videoHeight) : At(e.naturalWidth, e.naturalHeight);
}
function Se(e, t) {
  return e === void 0 || t === void 0 ? e === t : Math.abs(e - t) <= sn * Math.max(e, t);
}
function _e(e) {
  return new CustomEvent(on, {
    detail: { aspectRatio: e },
    bubbles: !0,
    composed: !0
  });
}
var an = Object.defineProperty, dn = Object.getOwnPropertyDescriptor, D = (e, t, i, r) => {
  for (var n = r > 1 ? void 0 : r ? dn(t, i) : t, o = e.length - 1, a; o >= 0; o--)
    (a = e[o]) && (n = (r ? a(t, i, n) : a(n)) || n);
  return r && n && an(t, i, n), n;
};
const be = "ha-camera-stream", cn = 8e3, St = "ring-view-native-layout";
async function ln(e, t) {
  if (customElements.get(e)) return !0;
  let i;
  try {
    return await Promise.race([
      customElements.whenDefined(e),
      new Promise((r, n) => {
        i = window.setTimeout(() => n(new Error("timeout")), t);
      })
    ]), !!customElements.get(e);
  } catch {
    return !1;
  } finally {
    i !== void 0 && window.clearTimeout(i);
  }
}
async function ei() {
  if (customElements.get(be)) return !0;
  try {
    await (await window.loadCardHelpers?.())?.importMoreInfoControl?.("camera");
  } catch {
  }
  return ln(be, cn);
}
let E = class extends M {
  constructor() {
    super(...arguments), this.controls = !0, this.muted = !0, this.allowExoPlayer = !0, this.fitMode = "cover", this.passiveSurface = !1, this.nativeAvailable = !!customElements.get(be), this.observedMedia = /* @__PURE__ */ new Set(), this.handledStreamEvents = /* @__PURE__ */ new WeakSet(), this.ready = !1, this.handleSurfaceClick = (e) => {
      if (!this.passiveSurface || e.detail === 0 || !this.eventHost) return;
      const t = this.eventHost.getBoundingClientRect(), i = this.controls ? 64 : 0;
      e.clientY >= t.bottom - i || (e.preventDefault(), e.stopImmediatePropagation());
    }, this.handleNativeLoad = (e) => {
      e instanceof CustomEvent && this.handleReady();
    }, this.handleStreams = (e) => {
      if (this.handledStreamEvents.has(e)) return;
      this.handledStreamEvents.add(e);
      const t = e.detail;
      this.dispatchEvent(
        new CustomEvent("native-media-capabilities", {
          detail: {
            hasAudio: t?.hasAudio,
            hasVideo: t?.hasVideo
          },
          bubbles: !0,
          composed: !0
        })
      ), t?.hasVideo === !0 && this.handleReady(), this.eventRoot && (this.observeNativeMedia(this.eventRoot), this.detectReadyMedia(this.eventRoot));
    }, this.handleShadowLoad = (e) => {
      e.target instanceof HTMLImageElement && this.detectReadyMedia(this.eventRoot);
    }, this.handleObservedMediaDimensions = (e) => {
      (e.currentTarget instanceof HTMLImageElement || e.currentTarget instanceof HTMLVideoElement) && this.observedMedia.has(e.currentTarget) && this.detectReadyMedia(this.eventRoot);
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
    return !this.nativeAvailable || !this.stateObj ? l : h`
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
    const e = this.renderRoot.querySelector(be);
    e && this.attachEventListeners(e);
  }
  async loadNativeComponent() {
    const e = await ei();
    if (this.isConnected) {
      if (!e) {
        this.dispatchFailure("component-unavailable");
        return;
      }
      this.nativeAvailable = !0, await this.updateComplete;
    }
  }
  attachEventListeners(e) {
    const t = e.shadowRoot;
    if (e.style.setProperty("--ring-view-native-fit-mode", this.fitMode), e === this.eventHost && t === this.eventRoot) {
      t && this.prepareNativeRoot(t), this.detectReadyMedia(t ?? void 0);
      return;
    }
    this.detachEventListeners(), this.eventHost = e, e.addEventListener("click", this.handleSurfaceClick, !0), e.addEventListener("load", this.handleNativeLoad, !0), e.addEventListener("streams", this.handleStreams, !0), t && (this.eventRoot = t, t.addEventListener("streams", this.handleStreams, !0), t.addEventListener("load", this.handleShadowLoad, !0), this.mediaObserver = new MutationObserver(() => {
      this.observeNativeMedia(t), this.prepareNativeRoot(t), this.detectReadyMedia(t);
    }), this.mediaObserver.observe(t, { childList: !0, subtree: !0 }), this.observeNativeMedia(t), this.prepareNativeRoot(t), this.detectReadyMedia(t));
  }
  observeNativeMedia(e) {
    const t = [e], i = /* @__PURE__ */ new Set();
    for (; t.length > 0; ) {
      const r = t.pop();
      i.has(r) || (i.add(r), this.mediaObserver?.observe(r, { childList: !0, subtree: !0 }), r.querySelectorAll("*").forEach((n) => {
        (n instanceof HTMLImageElement || n instanceof HTMLVideoElement) && !this.observedMedia.has(n) && (this.observedMedia.add(n), n.addEventListener("load", this.handleObservedMediaDimensions), n.addEventListener("loadedmetadata", this.handleObservedMediaDimensions), n.addEventListener("resize", this.handleObservedMediaDimensions), n.addEventListener("error", this.handleObservedMediaDimensions)), n.shadowRoot && t.push(n.shadowRoot);
      }));
    }
  }
  prepareNativeRoot(e) {
    if (e.getElementById(St)) return;
    const t = document.createElement("style");
    t.id = St, t.textContent = `
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
    `, e.append(t);
  }
  detachEventListeners() {
    this.mediaObserver?.disconnect(), this.mediaObserver = void 0, this.observedMedia.forEach((e) => {
      e.removeEventListener("load", this.handleObservedMediaDimensions), e.removeEventListener("loadedmetadata", this.handleObservedMediaDimensions), e.removeEventListener("resize", this.handleObservedMediaDimensions), e.removeEventListener("error", this.handleObservedMediaDimensions);
    }), this.observedMedia.clear(), this.lastAspectRatio = void 0, this.eventHost?.removeEventListener("click", this.handleSurfaceClick, !0), this.eventHost?.removeEventListener("load", this.handleNativeLoad, !0), this.eventHost?.removeEventListener(
      "streams",
      this.handleStreams,
      !0
    ), this.eventHost = void 0, this.eventRoot?.removeEventListener(
      "streams",
      this.handleStreams,
      !0
    ), this.eventRoot?.removeEventListener("load", this.handleShadowLoad, !0), this.eventRoot = void 0;
  }
  detectReadyMedia(e) {
    if (!e) return;
    this.observeNativeMedia(e);
    const t = [], i = [];
    this.observedMedia.forEach((n) => {
      if (!n.isConnected) {
        n.removeEventListener("load", this.handleObservedMediaDimensions), n.removeEventListener("loadedmetadata", this.handleObservedMediaDimensions), n.removeEventListener("resize", this.handleObservedMediaDimensions), n.removeEventListener("error", this.handleObservedMediaDimensions), this.observedMedia.delete(n);
        return;
      }
      n instanceof HTMLImageElement && n.complete && n.naturalWidth > 0 && this.handleReady(), q(n) !== void 0 && (n instanceof HTMLVideoElement ? n.error || i.push(n) : t.push(n));
    });
    const r = i[i.length - 1] ?? t[t.length - 1];
    r && this.reportMediaAspectRatio(r);
  }
  reportMediaAspectRatio(e) {
    const t = q(e);
    t === void 0 || Se(this.lastAspectRatio, t) || (this.lastAspectRatio = t, this.dispatchEvent(_e(t)));
  }
  dispatchFailure(e) {
    this.dispatchEvent(
      new CustomEvent("native-media-error", {
        detail: e,
        bubbles: !0,
        composed: !0
      })
    );
  }
};
E.styles = Z`
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
D([
  _({ attribute: !1 })
], E.prototype, "stateObj", 2);
D([
  _({ type: Boolean })
], E.prototype, "controls", 2);
D([
  _({ type: Boolean })
], E.prototype, "muted", 2);
D([
  _({ type: Boolean, attribute: "allow-exoplayer" })
], E.prototype, "allowExoPlayer", 2);
D([
  _({ type: Number, attribute: !1 })
], E.prototype, "aspectRatio", 2);
D([
  _({ attribute: !1 })
], E.prototype, "fitMode", 2);
D([
  _({ type: Boolean, attribute: "passive-surface" })
], E.prototype, "passiveSurface", 2);
D([
  g()
], E.prototype, "nativeAvailable", 2);
E = D([
  G("ring-view-native-camera-adapter")
], E);
const hn = (e) => e ?? l;
var un = Object.defineProperty, pn = Object.getOwnPropertyDescriptor, S = (e, t, i, r) => {
  for (var n = r > 1 ? void 0 : r ? pn(t, i) : t, o = e.length - 1, a; o >= 0; o--)
    (a = e[o]) && (n = (r ? a(t, i, n) : a(n)) || n);
  return r && n && un(t, i, n), n;
};
const vn = 3e3;
function gn(e, t) {
  if (t instanceof DOMException) {
    if (t.name === "NotAllowedError") return s(e, "talkback.permission_denied");
    if (t.name === "NotFoundError") return s(e, "talkback.no_microphone");
    if (t.name === "NotReadableError") return s(e, "talkback.microphone_busy");
  }
  return t instanceof Error ? t.message : String(t);
}
let A = class extends M {
  constructor() {
    super(...arguments), this.entityId = "", this.muted = !1, this.fitMode = "cover", this.externalControls = !1, this.microphoneState = "not-requested", this.connectionState = "starting", this.statusMessage = "", this.statusKind = "status", this.actualMuted = !1, this.playbackBlocked = !1, this.readyDispatched = !1, this.connectionToken = 0, this.startAttempted = !1, this.pendingLocalCandidates = [], this.pendingRemoteCandidates = [], this.playbackRequestPending = !1, this.startQueued = !1, this.keyboardPressed = !1, this.externalPressed = !1, this.pressToken = 0, this.stopTalking = () => {
      const e = this.externalPressed;
      this.externalPressed = !1, e && (this.pressToken += 1);
      const t = this.localStream?.getAudioTracks()[0];
      t && (t.enabled = !1), this.microphoneState === "active" && (this.microphoneState = "ready", this.showStatusMessage(""));
    }, this.startTalking = () => {
      if (this.externalPressed || this.connectionState !== "connected" || !this.readyDispatched || this.playbackBlocked)
        return;
      this.externalPressed = !0;
      const e = ++this.pressToken;
      this.startTalkingForPress(e);
    }, this.ensureMicrophone = async () => {
      if (this.connectionState !== "connected" || !this.audioSender)
        return !1;
      if (["ready", "active"].includes(this.microphoneState))
        return !0;
      if (this.microphoneRequest)
        return this.microphoneRequest;
      if (!window.isSecureContext || !navigator.mediaDevices?.getUserMedia)
        return this.microphoneState = "unsupported", this.showStatusMessage(s(this.hass, "talkback.https_required"), "error"), !1;
      const e = this.connectionToken;
      this.microphoneState = "requesting", this.showStatusMessage("");
      const t = (async () => {
        let i;
        try {
          if (i = await navigator.mediaDevices.getUserMedia({
            audio: {
              channelCount: 1,
              echoCancellation: !0,
              noiseSuppression: !0,
              autoGainControl: !0
            },
            video: !1
          }), e !== this.connectionToken || !this.audioSender)
            return i.getTracks().forEach((n) => n.stop()), !1;
          const r = i.getAudioTracks()[0];
          if (!r) throw new Error(s(this.hass, "talkback.no_microphone"));
          return r.enabled = !1, r.addEventListener("ended", () => {
            e !== this.connectionToken || this.localStream !== i || (this.cancelActivePress(), this.localStream = void 0, this.microphoneState = "failed", this.showStatusMessage(s(this.hass, "talkback.microphone_ended"), "error"));
          }), await this.audioSender.replaceTrack(r), e !== this.connectionToken ? (i.getTracks().forEach((n) => n.stop()), !1) : (this.localStream?.getTracks().forEach((n) => n.stop()), this.localStream = i, this.microphoneState = "ready", this.showStatusMessage(""), !0);
        } catch (r) {
          return i?.getTracks().forEach((n) => n.stop()), e !== this.connectionToken || (this.microphoneState = "failed", this.showStatusMessage(gn(this.hass, r), "error")), !1;
        }
      })();
      this.microphoneRequest = t;
      try {
        return await t;
      } finally {
        this.microphoneRequest === t && (this.microphoneRequest = void 0);
      }
    }, this.handleTalkPointerDown = (e) => {
      if (e.button !== 0 || !e.isPrimary || this.isTalkPressed()) return;
      e.preventDefault(), e.currentTarget?.setPointerCapture?.(e.pointerId), this.activePointerId = e.pointerId;
      const t = ++this.pressToken;
      this.startTalkingForPress(t);
    }, this.handleTalkPointerEnd = (e) => {
      this.activePointerId === e.pointerId && (this.activePointerId = void 0, this.pressToken += 1, this.stopTalking());
    }, this.handleTalkKeyDown = (e) => {
      if ((e.key === " " || e.key === "Enter") && !e.repeat && !this.isTalkPressed()) {
        e.preventDefault(), this.keyboardPressed = !0;
        const t = ++this.pressToken;
        this.startTalkingForPress(t);
      }
    }, this.handleTalkKeyUp = (e) => {
      (e.key === " " || e.key === "Enter") && this.keyboardPressed && (e.preventDefault(), this.keyboardPressed = !1, this.pressToken += 1, this.stopTalking());
    }, this.handleWindowBlur = () => this.cancelActivePress(), this.handlePageHide = () => {
      this.clearStatusMessageTimeout(), this.requestLiveResume();
    }, this.handleVisibilityChange = () => {
      document.hidden && this.cancelActivePress();
    }, this.resumePlayback = () => {
      const e = this.renderRoot.querySelector("video");
      if (!e || this.playbackRequestPending) return;
      const t = this.connectionToken;
      this.playbackRequestPending = !0, e.play().catch((i) => {
        t === this.connectionToken && this.handlePlaybackRejection(i);
      }).finally(() => {
        t === this.connectionToken && (this.playbackRequestPending = !1);
      });
    }, this.handlePlaying = () => {
      if (!this.peerConnection || !this.isConnected) return;
      const e = this.renderRoot.querySelector("video");
      e && this.reportVideoAspectRatio(e);
      const t = this.playbackBlocked;
      this.shadowRoot?.activeElement?.classList.contains("playback-resume") && this.renderRoot.querySelector("video")?.focus(), this.playbackBlocked = !1, !(this.readyDispatched && !t) && (this.readyDispatched = !0, this.dispatchEvent(
        new CustomEvent("ring-webrtc-ready", { bubbles: !0, composed: !0 })
      ));
    }, this.handleVideoDimensions = (e) => {
      e.currentTarget instanceof HTMLVideoElement && e.currentTarget === this.renderRoot.querySelector("video") && this.reportVideoAspectRatio(e.currentTarget);
    }, this.requestLiveResume = () => {
      this.connectionToken += 1, this.disposeSession(), this.dispatchEvent(new CustomEvent("ring-webrtc-resume", {
        bubbles: !0,
        composed: !0
      }));
    };
  }
  connectedCallback() {
    super.connectedCallback(), window.addEventListener("blur", this.handleWindowBlur), window.addEventListener("pagehide", this.handlePageHide), document.addEventListener("visibilitychange", this.handleVisibilityChange);
  }
  disconnectedCallback() {
    window.removeEventListener("blur", this.handleWindowBlur), window.removeEventListener("pagehide", this.handlePageHide), document.removeEventListener("visibilitychange", this.handleVisibilityChange), this.clearStatusMessageTimeout(), this.connectionToken += 1, this.disposeSession(), super.disconnectedCallback();
  }
  willUpdate(e) {
    e.has("muted") && (this.actualMuted = this.muted);
  }
  updated(e) {
    if (e.has("muted")) {
      const n = this.renderRoot.querySelector("video");
      n && (n.muted = this.actualMuted);
    }
    if (this.signalingConnection && this.hass?.connection !== this.signalingConnection) {
      this.requestLiveResume();
      return;
    }
    const t = e;
    (t.has("microphoneState") || t.has("connectionState") || t.has("readyDispatched") || t.has("playbackBlocked") || e.has("externalControls")) && this.dispatchTalkbackState();
    const i = e.has("entityId") && this.startedEntityId !== this.entityId, r = e.has("hass") && !this.startAttempted && !!this.hass;
    i && this.startAttempted ? this.queueSessionStart(!0) : (i || r) && this.hass && this.entityId && this.queueSessionStart(!1);
  }
  queueSessionStart(e) {
    this.startQueued || (this.startQueued = !0, queueMicrotask(() => {
      this.startQueued = !1, this.isConnected && (e ? this.restartSession() : this.startSession());
    }));
  }
  render() {
    const e = this.microphoneState === "active", t = this.microphoneState === "requesting", i = this.connectionState === "connected", r = `--ring-view-talkback-fit-mode: ${this.fitMode}`, n = t ? s(this.hass, "talkback.requesting_microphone") : e ? s(this.hass, "talkback.release_to_stop") : s(this.hass, "talkback.hold_to_talk");
    return h`
      <video
        style=${r}
        autoplay
        playsinline
        controls
        poster=${hn(this.poster)}
        .muted=${this.actualMuted}
        @loadedmetadata=${this.handleVideoDimensions}
        @resize=${this.handleVideoDimensions}
        @playing=${this.handlePlaying}
      ></video>
      ${this.playbackBlocked ? h`
        <button class="playback-resume" type="button" tabindex="0" @click=${this.resumePlayback}>
          ${this.icon(Dt)}
          <span>${s(this.hass, "viewer.resume_live")}</span>
        </button>
      ` : l}
      ${!this.externalControls && i && this.readyDispatched && !this.playbackBlocked ? h`<div class="talkback-controls">
        <button
          class=${C({ "talk-button": !0, active: e })}
          type="button"
          aria-label=${n}
          aria-pressed=${String(e)}
          @contextmenu=${(o) => o.preventDefault()}
          @pointerdown=${this.handleTalkPointerDown}
          @pointerup=${this.handleTalkPointerEnd}
          @pointercancel=${this.handleTalkPointerEnd}
          @lostpointercapture=${this.handleTalkPointerEnd}
          @keydown=${this.handleTalkKeyDown}
          @keyup=${this.handleTalkKeyUp}
        >
          ${this.icon(e ? Lt : Pt)}
          <span>${n}</span>
        </button>
      </div>` : l}
      ${!this.externalControls && this.statusMessage && !this.playbackBlocked ? h`<div
            class="session-status"
            role=${this.statusKind === "error" ? "alert" : "status"}
            aria-live=${this.statusKind === "error" ? "assertive" : "polite"}
          >
            ${this.statusMessage}
          </div>` : l}
    `;
  }
  async restartSession() {
    const e = ++this.connectionToken;
    await this.disposeSession(), !(e !== this.connectionToken || !this.isConnected) && (this.startAttempted = !1, await this.startSession());
  }
  async startSession() {
    if (this.startAttempted || !this.hass || !this.entityId) return;
    if (!this.hass.connection || typeof RTCPeerConnection > "u") {
      this.dispatchFailure(s(this.hass, "talkback.webrtc_unavailable"));
      return;
    }
    this.startAttempted = !0, this.startedEntityId = this.entityId;
    const e = ++this.connectionToken, t = this.hass.connection;
    if (t.connected === !1) {
      this.requestLiveResume();
      return;
    }
    this.signalingConnection = t, t.addEventListener?.("disconnected", this.requestLiveResume), this.connectionState = "starting", this.microphoneState = "not-requested", this.showStatusMessage(s(this.hass, "talkback.connecting")), this.readyDispatched = !1, this.playbackBlocked = !1, this.pendingLocalCandidates = [], this.pendingRemoteCandidates = [], this.sessionId = void 0;
    try {
      const i = await this.hass.callWS({
        type: "camera/webrtc/get_client_config",
        entity_id: this.entityId
      });
      if (e !== this.connectionToken) return;
      const r = new RTCPeerConnection(i.configuration ?? {});
      this.peerConnection = r, this.remoteStream = new MediaStream(), i.dataChannel && r.createDataChannel(i.dataChannel), r.ontrack = (a) => this.handleRemoteTrack(a, e), r.onicecandidate = (a) => {
        a.candidate?.candidate && this.handleLocalCandidate(a.candidate, e);
      }, r.onconnectionstatechange = () => this.handleConnectionState(e);
      const n = r.addTransceiver("audio", {
        direction: "sendrecv"
      });
      this.audioSender = n.sender, r.addTransceiver("video", { direction: "recvonly" });
      const o = await r.createOffer();
      if (await r.setLocalDescription(o), e !== this.connectionToken || !r.localDescription?.sdp) return;
      this.unsubscribePromise = Promise.resolve(
        t.subscribeMessage(
          (a) => {
            this.handleSignalMessage(a, e);
          },
          {
            type: "camera/webrtc/offer",
            entity_id: this.entityId,
            offer: r.localDescription.sdp
          },
          {
            // A camera offer belongs to this peer only. HA's ordinary event
            // subscriptions auto-resubscribe, but replaying this offer would
            // give a previously negotiated peer a different Ring session.
            resubscribe: !1,
            preCheck: () => e === this.connectionToken && this.isConnected
          }
        )
      ), await this.unsubscribePromise;
    } catch (i) {
      e === this.connectionToken && this.fail(i instanceof Error ? i.message : String(i));
    }
  }
  async startTalkingForPress(e) {
    if (this.connectionState !== "connected" || !await this.ensureMicrophone() || e !== this.pressToken || !this.isTalkPressed() || document.hidden)
      return;
    const i = this.localStream?.getAudioTracks()[0];
    i && (i.enabled = !0, this.microphoneState = "active", this.showStatusMessage(""));
  }
  isTalkPressed() {
    return this.activePointerId !== void 0 || this.keyboardPressed || this.externalPressed;
  }
  cancelActivePress() {
    this.activePointerId = void 0, this.keyboardPressed = !1, this.externalPressed = !1, this.pressToken += 1, this.stopTalking();
  }
  async handleSignalMessage(e, t) {
    if (!(t !== this.connectionToken || !this.peerConnection))
      try {
        if (e.type === "session") {
          if (this.sessionId && this.sessionId !== e.session_id) {
            this.requestLiveResume();
            return;
          }
          this.sessionId = e.session_id, await this.flushLocalCandidates(t);
        } else if (e.type === "answer")
          !this.peerConnection.remoteDescription && this.peerConnection.signalingState !== "closed" && (await this.peerConnection.setRemoteDescription({ type: "answer", sdp: e.answer }), await this.flushRemoteCandidates(t));
        else if (e.type === "candidate") {
          const i = e.candidate.sdpMid != null || e.candidate.sdpMLineIndex != null ? e.candidate : { ...e.candidate, sdpMid: "0" };
          this.peerConnection.remoteDescription ? await this.peerConnection.addIceCandidate(i) : this.pendingRemoteCandidates.push(i);
        } else e.type === "error" && this.fail(e.message || e.code || s(this.hass, "viewer.live_failed"));
      } catch (i) {
        t === this.connectionToken && this.fail(i instanceof Error ? i.message : String(i));
      }
  }
  async handleLocalCandidate(e, t) {
    if (t !== this.connectionToken) return;
    const i = e.toJSON();
    if (!this.sessionId) {
      this.pendingLocalCandidates.push(i);
      return;
    }
    try {
      await this.sendCandidate(i, t);
    } catch (r) {
      t === this.connectionToken && this.fail(r instanceof Error ? r.message : String(r));
    }
  }
  async sendCandidate(e, t) {
    t !== this.connectionToken || !this.sessionId || !this.hass || await this.hass.callWS({
      type: "camera/webrtc/candidate",
      entity_id: this.entityId,
      session_id: this.sessionId,
      candidate: e
    });
  }
  async flushLocalCandidates(e) {
    const t = this.pendingLocalCandidates.splice(0);
    for (const i of t) await this.sendCandidate(i, e);
  }
  async flushRemoteCandidates(e) {
    const t = this.pendingRemoteCandidates.splice(0);
    for (const i of t) {
      if (e !== this.connectionToken || !this.peerConnection) return;
      await this.peerConnection.addIceCandidate(i);
    }
  }
  handleRemoteTrack(e, t) {
    if (t !== this.connectionToken || !this.remoteStream) return;
    this.remoteStream.getTracks().includes(e.track) || this.remoteStream.addTrack(e.track), e.track.kind === "audio" && this.dispatchEvent(
      new CustomEvent("ring-webrtc-capabilities", {
        detail: { hasAudio: !0, hasVideo: !0 },
        bubbles: !0,
        composed: !0
      })
    );
    const i = this.renderRoot.querySelector("video");
    i && (i.srcObject !== this.remoteStream && (i.srcObject = this.remoteStream), e.track.kind === "video" && i.play().catch(() => this.retryPlaybackMuted(i, t)));
  }
  retryPlaybackMuted(e, t) {
    t === this.connectionToken && (this.actualMuted = !0, e.muted = !0, this.showStatusMessage(s(this.hass, "talkback.playback_muted")), queueMicrotask(() => {
      t !== this.connectionToken || !e.isConnected || e.play().catch((i) => {
        t === this.connectionToken && this.handlePlaybackRejection(i);
      });
    }));
  }
  handlePlaybackRejection(e) {
    if (e instanceof DOMException && ["NotAllowedError", "AbortError"].includes(e.name)) {
      this.cancelActivePress(), this.playbackBlocked = !0, this.showStatusMessage(""), this.dispatchEvent(new CustomEvent("ring-webrtc-playback-blocked", {
        bubbles: !0,
        composed: !0
      }));
      return;
    }
    this.fail(s(this.hass, "viewer.live_failed"));
  }
  reportVideoAspectRatio(e) {
    const t = q(e);
    t === void 0 || Se(this.lastAspectRatio, t) || (this.lastAspectRatio = t, this.dispatchEvent(_e(t)));
  }
  handleConnectionState(e) {
    e !== this.connectionToken || !this.peerConnection || (this.connectionState = this.peerConnection.connectionState, this.connectionState === "connected" ? this.showStatusMessage("") : this.connectionState === "disconnected" ? (this.cancelActivePress(), this.showStatusMessage(s(this.hass, "talkback.temporarily_disconnected"))) : this.connectionState === "failed" && this.fail(s(this.hass, "viewer.live_failed")));
  }
  fail(e) {
    const t = ++this.connectionToken;
    this.disposeSession(), !(t !== this.connectionToken || !this.isConnected) && (this.connectionState = "failed", this.showStatusMessage(e, "error"), this.dispatchFailure(e));
  }
  showStatusMessage(e, t = "status") {
    this.clearStatusMessageTimeout(), this.statusMessage = e, this.statusKind = t, this.dispatchEvent(
      new CustomEvent("ring-webrtc-status", {
        detail: { message: e, kind: t },
        bubbles: !0,
        composed: !0
      })
    ), e && (this.statusMessageTimeout = window.setTimeout(() => {
      this.statusMessageTimeout = void 0, this.showStatusMessage("");
    }, vn));
  }
  dispatchTalkbackState() {
    const e = {
      ready: this.connectionState === "connected" && this.readyDispatched && !this.playbackBlocked,
      requesting: this.microphoneState === "requesting",
      talking: this.microphoneState === "active"
    };
    this.dispatchEvent(
      new CustomEvent("ring-talkback-state", {
        detail: e,
        bubbles: !0,
        composed: !0
      })
    );
  }
  clearStatusMessageTimeout() {
    this.statusMessageTimeout !== void 0 && (window.clearTimeout(this.statusMessageTimeout), this.statusMessageTimeout = void 0);
  }
  dispatchFailure(e) {
    this.dispatchEvent(
      new CustomEvent("ring-webrtc-error", {
        detail: { message: e },
        bubbles: !0,
        composed: !0
      })
    );
  }
  async disposeSession() {
    this.cancelActivePress();
    const e = this.signalingConnection;
    this.signalingConnection = void 0, e && queueMicrotask(() => {
      e.removeEventListener?.("disconnected", this.requestLiveResume);
    }), this.microphoneRequest = void 0, this.playbackRequestPending = !1, this.readyDispatched = !1, this.playbackBlocked = !1;
    const t = this.unsubscribePromise;
    this.unsubscribePromise = void 0, this.peerConnection && (this.peerConnection.ontrack = null, this.peerConnection.onicecandidate = null, this.peerConnection.onconnectionstatechange = null, this.peerConnection.close(), this.peerConnection = void 0), this.localStream?.getTracks().forEach((r) => r.stop()), this.remoteStream?.getTracks().forEach((r) => r.stop()), this.localStream = void 0, this.remoteStream = void 0, this.audioSender = void 0, this.sessionId = void 0, this.pendingLocalCandidates = [], this.pendingRemoteCandidates = [];
    const i = this.renderRoot.querySelector("video");
    if (i && (i.pause(), i.srcObject = null, i.removeAttribute("src"), i.load()), t)
      try {
        await (await t)();
      } catch {
      }
  }
  icon(e) {
    return h`<svg viewBox="0 0 24 24" aria-hidden="true"><path d=${e}></path></svg>`;
  }
};
A.styles = Z`
    :host {
      position: absolute;
      inset: 0;
      display: block;
      width: 100%;
      height: 100%;
      min-width: 0;
      min-height: 0;
      overflow: hidden;
      background: #000;
    }

    video {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: var(--ring-view-talkback-fit-mode, cover);
      background: #000;
    }

    .talkback-controls {
      position: absolute;
      z-index: 4;
      inset: auto 16px 10px;
      display: flex;
      justify-content: center;
      pointer-events: none;
    }

    button {
      display: inline-flex;
      min-height: 46px;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 9px 16px;
      border: 1px solid rgba(255, 255, 255, 0.45);
      border-radius: 999px;
      color: #fff;
      background: rgba(18, 18, 18, 0.78);
      box-shadow: 0 4px 18px rgba(0, 0, 0, 0.35);
      font: inherit;
      font-size: 14px;
      font-weight: 600;
      white-space: nowrap;
      cursor: pointer;
      pointer-events: auto;
      touch-action: none;
      user-select: none;
      -webkit-user-select: none;
      -webkit-tap-highlight-color: transparent;
    }

    button:hover {
      background: rgba(36, 36, 36, 0.9);
    }

    button:focus-visible {
      outline: 3px solid var(--ring-view-focus-color, rgba(255, 255, 255, 0.92));
      outline-offset: 3px;
    }

    button.talk-button.active {
      border-color: var(--error-color, #db4437);
      background: var(--error-color, #db4437);
      transform: scale(0.98);
    }

    svg {
      width: 21px;
      height: 21px;
      flex: 0 0 auto;
      fill: currentColor;
    }

    .session-status {
      position: absolute;
      z-index: 4;
      inset: 50% auto auto 50%;
      max-width: min(560px, calc(100% - 32px));
      padding: 6px 10px;
      box-sizing: border-box;
      overflow: hidden;
      border-radius: 999px;
      color: rgba(255, 255, 255, 0.92);
      background: rgba(0, 0, 0, 0.66);
      font-size: 12px;
      line-height: 16px;
      text-align: center;
      transform: translate(-50%, -50%);
      white-space: normal;
      pointer-events: none;
    }

    .playback-resume {
      position: absolute;
      z-index: 4;
      top: 50%;
      left: 50%;
      max-width: calc(100% - 32px);
      transform: translate(-50%, -50%);
      white-space: normal;
      min-height: 44px;
      border: 0;
      border-radius: 999px;
      background: rgba(0, 0, 0, 0.48);
      box-shadow: none;
      touch-action: manipulation;
    }

    .playback-resume:hover {
      background: rgba(0, 0, 0, 0.64);
    }

    .playback-resume:focus-visible {
      outline-color: var(--ring-view-focus-color, rgba(255, 255, 255, 0.92));
    }

    @media (max-width: 600px) {
      .talkback-controls {
        inset-inline: max(12px, env(safe-area-inset-right))
          max(12px, env(safe-area-inset-left));
        bottom: 8px;
      }
    }

    @media (max-height: 500px) and (orientation: landscape) {
      .talkback-controls {
        bottom: max(8px, env(safe-area-inset-bottom));
      }
    }

    @media (prefers-reduced-motion: reduce) {
      button.talk-button.active {
        transform: none;
      }
    }
  `;
S([
  _({ attribute: !1 })
], A.prototype, "hass", 2);
S([
  _({ attribute: !1 })
], A.prototype, "entityId", 2);
S([
  _({ type: Boolean })
], A.prototype, "muted", 2);
S([
  _({ attribute: !1 })
], A.prototype, "fitMode", 2);
S([
  _({ attribute: !1 })
], A.prototype, "poster", 2);
S([
  _({ type: Boolean })
], A.prototype, "externalControls", 2);
S([
  g()
], A.prototype, "microphoneState", 2);
S([
  g()
], A.prototype, "connectionState", 2);
S([
  g()
], A.prototype, "statusMessage", 2);
S([
  g()
], A.prototype, "statusKind", 2);
S([
  g()
], A.prototype, "actualMuted", 2);
S([
  g()
], A.prototype, "playbackBlocked", 2);
S([
  g()
], A.prototype, "readyDispatched", 2);
A = S([
  G("ring-view-ring-webrtc-player")
], A);
const Rt = /* @__PURE__ */ new Set(["unknown", "unavailable"]), fn = 12e3;
function ti(e, t, i, r = Date.now()) {
  if (!i || Rt.has(i.state)) return !1;
  if (!t || Rt.has(t.state))
    return mn(e, i, r);
  if (e.startsWith("binary_sensor.")) {
    if (t.state === "off" && i.state === "on") return !0;
    if (t.state !== "on" || i.state !== "on") return !1;
    const a = He(t), d = He(i);
    if (Tt(t) || Tt(i))
      return a !== void 0 && d !== void 0 && d > a;
    const c = T(t.last_updated), p = T(i.last_updated);
    return c !== void 0 && p !== void 0 && p > c;
  }
  if (!e.startsWith("event.") || i.attributes.event_type !== void 0 && i.attributes.event_type !== "ring")
    return !1;
  const n = T(t.state), o = T(i.state);
  return o === void 0 ? !1 : n === void 0 ? Ue(o, r) : o > n;
}
function mn(e, t, i) {
  return e.startsWith("binary_sensor.") ? t.state !== "on" ? !1 : Ue(He(t), i) : e.startsWith("event.") && (t.attributes.event_type === void 0 || t.attributes.event_type === "ring") && Ue(T(t.state), i);
}
function Ue(e, t) {
  if (e === void 0) return !1;
  const i = t - e;
  return i >= -5e3 && i <= fn;
}
function He(e) {
  const t = [
    T(e.attributes.lastDingTime),
    T(e.attributes.lastDing)
  ].filter((i) => i !== void 0);
  return t.length > 0 ? Math.max(...t) : void 0;
}
function Tt(e) {
  return e.attributes.lastDingTime !== void 0 || e.attributes.lastDing !== void 0;
}
class _n {
  constructor() {
    this.generation = 0;
  }
  next() {
    return this.clearTimeout(), this.generation += 1, this.generation;
  }
  current() {
    return this.generation;
  }
  scheduleTimeout(t, i) {
    this.clearTimeout();
    const r = this.generation;
    this.timeoutId = window.setTimeout(() => {
      r === this.generation && t();
    }, i);
  }
  clearTimeout() {
    this.timeoutId !== void 0 && (window.clearTimeout(this.timeoutId), this.timeoutId = void 0);
  }
  dispose() {
    this.clearTimeout(), this.generation += 1;
  }
}
var bn = Object.defineProperty, wn = Object.getOwnPropertyDescriptor, m = (e, t, i, r) => {
  for (var n = r > 1 ? void 0 : r ? wn(t, i) : t, o = e.length - 1, a; o >= 0; o--)
    (a = e[o]) && (n = (r ? a(t, i, n) : a(n)) || n);
  return r && n && bn(t, i, n), n;
};
const yn = 20, kn = 2500, An = 2500, Sn = 1600, Rn = 2e3, Tn = 3e3, $n = 2e3, xn = 3e3, En = 15e3, Cn = 7e4, Mn = 1250;
function $t() {
  return typeof navigator > "u" ? !1 : /iPad|iPhone|iPod/i.test(navigator.userAgent) ? !0 : navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1;
}
function Ln(e) {
  const t = e instanceof Error ? e.message.toLowerCase() : String(e).toLowerCase();
  return /timeout|timed out/.test(t) ? "snapshot.timeout" : /unauthorized|forbidden|permission denied/.test(t) ? "snapshot.permission_failed" : /cannot write|can't write|no access to path|read-only|readonly/.test(t) ? "snapshot.write_failed" : /connection|websocket|service api unavailable/.test(t) ? "snapshot.connection_failed" : /no image|could not provide|not supported|snapshot unavailable/.test(t) ? "snapshot.camera_failed" : /refresh control unavailable/.test(t) ? "snapshot.refresh_unavailable" : "snapshot.failed";
}
let f = class extends M {
  constructor() {
    super(...arguments), this.open = !1, this.inline = !1, this.ringing = !1, this.mode = "last_recording", this.mediaStatus = "idle", this.session = 0, this.suspended = !1, this.recordingMuted = !1, this.recordingStarted = !0, this.recordingControlsVisible = !0, this.recordingEnded = !1, this.liveMuted = !0, this.recordingVideoFailed = !1, this.recordingPreparationActive = !1, this.retryCount = 0, this.statusAnnouncement = "", this.talkbackReady = !1, this.talkbackRequesting = !1, this.talkbackTalking = !1, this.doorActionStatus = "idle", this.snapshotActionStatus = "idle", this.inlineStarted = !0, this.lifecycle = new _n(), this.recordingPlayback = /* @__PURE__ */ new WeakSet(), this.recordingPaused = !1, this.automaticLiveRetry = !0, this.pageUnloading = !1, this.talkKeyboardPressed = !1, this.doorKeyboardPressed = !1, this.doorActionToken = 0, this.snapshotActionToken = 0, this.recordingRefreshAttempted = !1, this.recordingTranscodeFallbackAttempted = !1, this.recordingRefreshToken = 0, this.inlineVisible = !1, this.inlineActive = !1, this.takeSnapshot = async () => {
      const e = this.hass, t = this.config, i = this.snapshotEntityId();
      if (!e || !t || !i || !this.shouldShowSnapshotAction() || this.snapshotActionStatus === "working")
        return;
      this.clearSnapshotFeedback(), this.snapshotActionStatus = "working";
      const r = ++this.snapshotActionToken;
      try {
        if (e.connection?.connected === !1 || !e.callService)
          throw new Error("Home Assistant service API unavailable");
        const n = kr(e, i);
        if (Sr(e, i) && !n)
          throw new Error("Ring-MQTT snapshot refresh control unavailable");
        if (n) {
          const a = this.waitForSnapshotUpdate(
            i,
            _t(e, i)
          );
          try {
            await e.callService(
              "button",
              "press",
              {},
              { entity_id: n }
            );
          } catch (c) {
            throw this.finishPendingSnapshotUpdate("cancelled"), c;
          }
          const d = await a;
          if (d !== "updated") {
            if (d === "cancelled") return;
            throw new Error("Snapshot refresh timed out");
          }
        }
        if (await e.callService(
          "camera",
          "snapshot",
          { filename: $r(e, t) },
          { entity_id: i }
        ), r !== this.snapshotActionToken || !this.open) return;
        const o = s(this.hass, "snapshot.saved");
        this.snapshotActionStatus = "success", this.snapshotFeedbackMessage = o, this.clearViewerFeedback("snapshot"), this.statusAnnouncement = o, this.snapshotFeedbackTimer = window.setTimeout(() => {
          r === this.snapshotActionToken && (this.snapshotFeedbackTimer = void 0, this.snapshotFeedbackMessage = void 0, this.snapshotActionStatus = "idle");
        }, $n);
      } catch (n) {
        if (r !== this.snapshotActionToken || !this.open) return;
        const o = s(this.hass, Ln(n));
        this.snapshotActionStatus = "error", this.snapshotFeedbackMessage = o, this.setViewerFeedback("snapshot", o, "error"), this.statusAnnouncement = o, this.snapshotFeedbackTimer = window.setTimeout(() => {
          r === this.snapshotActionToken && (this.snapshotFeedbackTimer = void 0, this.snapshotFeedbackMessage = void 0, this.snapshotActionStatus = "idle");
        }, xn);
      }
    }, this.handleTalkbackState = (e) => {
      e.currentTarget === this.renderRoot.querySelector("ring-view-ring-webrtc-player") && (e.detail.ready || this.cancelTalkPress(e.currentTarget), this.talkbackReady = e.detail.ready, this.talkbackRequesting = e.detail.requesting, this.talkbackTalking = e.detail.talking);
    }, this.handleTalkPointerDown = (e) => {
      e.button !== 0 || !e.isPrimary || this.talkPointerId !== void 0 || !this.talkbackReady || (e.preventDefault(), e.currentTarget?.setPointerCapture?.(e.pointerId), this.talkPointerId = e.pointerId, this.talkbackPlayer()?.startTalking());
    }, this.handleTalkPointerEnd = (e) => {
      this.talkPointerId === e.pointerId && (this.talkPointerId = void 0, this.talkbackPlayer()?.stopTalking());
    }, this.handleTalkKeyDown = (e) => {
      ![" ", "Enter"].includes(e.key) || e.repeat || this.talkKeyboardPressed || !this.talkbackReady || (e.preventDefault(), this.talkKeyboardPressed = !0, this.talkbackPlayer()?.startTalking());
    }, this.handleTalkKeyUp = (e) => {
      ![" ", "Enter"].includes(e.key) || !this.talkKeyboardPressed || (e.preventDefault(), this.talkKeyboardPressed = !1, this.talkbackPlayer()?.stopTalking());
    }, this.handleDoorPointerDown = (e) => {
      !this.config?.door_hold_to_activate || e.button !== 0 || !e.isPrimary || this.doorPointerId !== void 0 || this.doorActionDisabled() || (e.preventDefault(), e.currentTarget?.setPointerCapture?.(e.pointerId), this.doorPointerId = e.pointerId, this.beginDoorHold());
    }, this.handleDoorPointerEnd = (e) => {
      this.doorPointerId === e.pointerId && (this.doorPointerId = void 0, this.cancelDoorHold());
    }, this.handleDoorKeyDown = (e) => {
      !this.config?.door_hold_to_activate || ![" ", "Enter"].includes(e.key) || e.repeat || this.doorKeyboardPressed || this.doorActionDisabled() || (e.preventDefault(), this.doorKeyboardPressed = !0, this.beginDoorHold());
    }, this.handleDoorKeyUp = (e) => {
      ![" ", "Enter"].includes(e.key) || !this.doorKeyboardPressed || (e.preventDefault(), this.doorKeyboardPressed = !1, this.cancelDoorHold());
    }, this.handleDoorClick = () => {
      this.config?.door_hold_to_activate || this.doorActionDisabled() || this.executeDoorAction();
    }, this.handlePosterLoad = (e) => {
      !(e.currentTarget instanceof HTMLImageElement) || e.currentTarget !== this.renderRoot.querySelector(".media-frame > .poster") || e.currentTarget.dataset.entityId !== this.activePosterEntityId() || this.applyAutoAspectRatio(q(e.currentTarget), "poster");
    }, this.handleRecordingDimensions = (e) => {
      !(e.currentTarget instanceof HTMLVideoElement) || this.mode !== "last_recording" || e.currentTarget !== this.renderRoot.querySelector(".video-fallback") || this.applyAutoAspectRatio(q(e.currentTarget), "media");
    }, this.handlePlayerAspectRatio = (e) => {
      e.stopPropagation();
      const t = e.composedPath()[0], i = this.renderRoot.querySelector(
        "ring-view-native-camera-adapter, ring-view-ring-webrtc-player"
      );
      !(t instanceof HTMLElement) || t !== i || t.localName === "ring-view-native-camera-adapter" && t.stateObj?.entity_id !== this.activeEntityId() || t.localName === "ring-view-ring-webrtc-player" && t.entityId !== this.activeEntityId() || this.applyAutoAspectRatio(e.detail.aspectRatio, "media");
    }, this.handleMediaReady = (e) => {
      this.acceptsMediaEvent(e) && (this.clearAutomaticLiveRecovery(), this.lifecycle.clearTimeout(), this.mediaStatus = "ready", this.statusAnnouncement = this.mode === "live" ? this.liveAudioStatus() : this.recordingMuted ? s(this.hass, "viewer.recording_loaded_muted") : s(this.hass, "viewer.recording_loaded_audio"));
    }, this.handleMediaCapabilities = (e) => {
      this.mode !== "live" || typeof e.detail?.hasAudio != "boolean" || this.liveMuted && e.detail.hasAudio === !1 || (this.liveHasAudio = this.liveHasAudio === !0 || e.detail.hasAudio, this.mediaStatus === "ready" && this.liveHasAudio ? this.statusAnnouncement = s(this.hass, "viewer.live_connected_audio") : this.mediaStatus === "ready" && this.liveHasAudio === !1 && (this.statusAnnouncement = s(this.hass, "viewer.live_connected_no_audio")));
    }, this.handleRecordingVideoError = (e) => {
      if (!(this.mode !== "last_recording" || !this.acceptsMediaEvent(e))) {
        if (this.hass && X(this.hass, this.activeEntityId())) {
          const t = Y(this.activeEntity());
          if (t !== void 0 && B(this.activeEntity()) && this.recordingPlaybackRetriedSource !== t) {
            this.recordingPlaybackRetriedSource = t, this.lifecycle.dispose(), this.recordingVideoFailed = !1, this.statusAnnouncement = s(this.hass, "viewer.loading_recording"), this.startMedia();
            return;
          }
          const i = ft(this.activeEntity());
          if (i !== void 0 && !this.recordingTranscodeFallbackAttempted) {
            this.recordingTranscodeFallbackAttempted = !0, this.recordingRefreshAttempted = !0, this.recordingVideoFailed = !0, this.refreshRingMqttRecording(i);
            return;
          }
          this.recordingVideoFailed = !0, this.statusAnnouncement = s(this.hass, "viewer.refreshing_recording"), this.startMedia();
          return;
        }
        if (this.activeEntityId().startsWith("select.")) {
          this.failRecordingPreparation("viewer.recording_playback_failed");
          return;
        }
        this.recordingVideoFailed = !0, this.statusAnnouncement = s(this.hass, "viewer.trying_ha"), this.startMedia();
      }
    }, this.handleRecordingCanPlay = (e) => {
      const t = e.currentTarget, i = this.session;
      !(t instanceof HTMLVideoElement) || this.recordingPlayback.has(t) || !this.isCurrentRecording(t, i) || (this.recordingPlayback.add(t), this.playRecording(t, i));
    }, this.handleRecordingPlay = (e) => {
      const t = e.currentTarget;
      !(t instanceof HTMLVideoElement) || !this.isCurrentRecording(t, this.session) || (this.clearRecordingControlsTimer(), this.recordingEnded = !1, this.recordingPaused = !1, this.recordingControlsVisible = !0, t.controls = !0, this.statusAnnouncement = s(
        this.hass,
        this.recordingMuted ? "viewer.recording_loaded_muted" : "viewer.recording_loaded_audio"
      ));
    }, this.handleRecordingVolumeChange = (e) => {
      const t = e.currentTarget;
      !(t instanceof HTMLVideoElement) || !this.isCurrentRecording(t, this.session) || (this.recordingMuted = t.muted);
    }, this.handleRecordingPause = (e) => {
      const t = e.currentTarget;
      !(t instanceof HTMLVideoElement) || !this.isCurrentRecording(t, this.session) || (this.recordingPaused = !0, t.ended || (this.recordingEnded = !1), this.scheduleRecordingControlsHide(t, this.session));
    }, this.handleRecordingEnded = (e) => {
      const t = e.currentTarget;
      !(t instanceof HTMLVideoElement) || !this.isCurrentRecording(t, this.session) || (this.recordingPaused = !0, this.recordingEnded = !0, this.scheduleRecordingControlsHide(t, this.session));
    }, this.handleRecordingSurfaceClick = (e) => {
      const t = e.currentTarget;
      !(t instanceof HTMLVideoElement) || t.controls || (e.preventDefault(), e.stopPropagation(), this.resumeRecordingFromSurface(t));
    }, this.handleRecordingSurfaceKeyDown = (e) => {
      const t = e.currentTarget;
      if (t instanceof HTMLVideoElement) {
        if (t.controls) {
          this.handleRecordingControlsInteraction(e);
          return;
        }
        ["Enter", " "].includes(e.key) && (e.preventDefault(), e.stopPropagation(), this.resumeRecordingFromSurface(t));
      }
    }, this.handleRecordingControlsInteraction = (e) => {
      const t = e.currentTarget;
      !(t instanceof HTMLVideoElement) || !t.controls || !this.recordingPaused || !this.isCurrentRecording(t, this.session) || this.scheduleRecordingControlsHide(t, this.session);
    }, this.handleMediaError = (e) => {
      !this.acceptsMediaEvent(e) || e.detail !== "component-unavailable" || (this.clearAutomaticLiveRecovery(), this.lifecycle.clearTimeout(), this.mediaStatus = "compatibility", this.statusAnnouncement = s(this.hass, "viewer.native_unavailable_title"));
    }, this.handleRingWebRtcError = (e) => {
      !this.acceptsMediaEvent(e) || this.mode !== "live" || !this.config?.two_way_audio || this.failMedia();
    }, this.handleRingWebRtcStatus = (e) => {
      e.currentTarget !== this.renderRoot.querySelector("ring-view-ring-webrtc-player") || this.mode !== "live" || !this.config?.two_way_audio || (e.detail.message ? this.setViewerFeedback(
        "session",
        e.detail.message,
        e.detail.kind
      ) : this.clearViewerFeedback("session"));
    }, this.handleLiveResumeRequired = (e) => {
      !this.acceptsMediaEvent(e) || this.mode !== "live" || this.waitForLiveResume();
    }, this.tryAutomaticLiveResume = () => {
      if (this.automaticLiveRecovery !== "waiting" || !this.open || !this.isConnected || this.mode !== "live" || this.mediaStatus !== "awaiting-resume" || this.pageUnloading) return;
      const e = this.hass?.connection;
      this.recoveryConnection !== e && (this.recoveryConnection?.removeEventListener?.("ready", this.handleRecoveryConnectionReady), this.recoveryConnection = e, e?.addEventListener?.("ready", this.handleRecoveryConnectionReady)), !(document.hidden || e?.connected === !1 || this.config?.two_way_audio && !e || y(this.activeEntity())) && (this.clearAutomaticLiveRecovery(), this.automaticLiveRecovery = "attempting", this.liveMuted = !0, this.statusAnnouncement = s(this.hass, "viewer.connecting_live"), this.startMedia());
    }, this.handleRecoveryConnectionReady = () => {
      queueMicrotask(this.tryAutomaticLiveResume);
    }, this.resumeLive = () => {
      !this.open || this.mode !== "live" || this.mediaStatus !== "awaiting-resume" || (this.inline && this.claimInlineLive(!0), this.clearAutomaticLiveRecovery(), this.resetMediaAttempt(), this.startMedia(), this.updateComplete.then(() => this.focusInitialControl()));
    }, this.handlePlaybackBlocked = (e) => {
      !this.acceptsMediaEvent(e) || this.mode !== "live" || (this.lifecycle.clearTimeout(), this.mediaStatus = "playback-blocked", this.statusAnnouncement = s(this.hass, "viewer.resume_live"));
    }, this.retry = () => {
      this.clearAutomaticLiveRecovery(), this.resetMediaAttempt(), this.startMedia();
    }, this.startRecording = () => {
      this.mode !== "last_recording" || this.recordingStarted || (this.inlineStarted = !0, this.recordingStarted = !0, this.startMedia());
    }, this.startInlineLive = () => {
      !this.inline || this.mode !== "live" || this.inlineStarted || (this.inlineStarted = !0, this.startMedia());
    }, this.openMoreInfo = () => {
      this.dispatchEvent(
        new CustomEvent("hass-more-info", {
          detail: { entityId: this.activeEntityId() },
          bubbles: !0,
          composed: !0
        })
      );
    }, this.handleBackdrop = (e) => {
      e.target === e.currentTarget && this.close();
    }, this.expand = () => {
      !this.inline || !this.config || this.dispatchEvent(
        new CustomEvent("ring-view-expand", {
          detail: { mode: this.mode, ringingUntil: this.ringingUntil },
          bubbles: !0,
          composed: !0
        })
      );
    }, this.handleKeyDown = (e) => {
      if (this.inline) return;
      if (e.key === "Escape") {
        if (document.fullscreenElement) return;
        e.preventDefault(), e.stopPropagation(), this.close();
        return;
      }
      if (e.key !== "Tab") return;
      const t = this.focusableElements();
      if (t.length === 0) return;
      const i = t[0], r = t[t.length - 1];
      let n = this.shadowRoot?.activeElement;
      for (; n?.shadowRoot?.activeElement; ) n = n.shadowRoot.activeElement;
      e.shiftKey && n === i ? (e.preventDefault(), r.focus()) : !e.shiftKey && n === r && (e.preventDefault(), i.focus());
    }, this.handleTabKeyDown = (e) => {
      if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(e.key)) return;
      e.preventDefault();
      const t = e.key === "ArrowLeft" || e.key === "Home" ? "last_recording" : "live";
      this.selectMode(t), this.updateComplete.then(() => {
        const i = t === "live" ? ".mode-button.live" : ".mode-button.recording";
        this.renderRoot.querySelector(i)?.focus();
      });
    }, this.handleWindowBlur = () => {
      this.cancelDoorHold(), this.cancelTalkPress();
    }, this.handlePageHide = () => {
      if (this.pageUnloading = !0, this.cancelRecordingPreparation(!0), this.resetVisitorActions(), this.resetSnapshotAction(), this.inline) {
        this.suspendInline();
        return;
      }
      !this.open || this.mode !== "live" || (this.renderRoot.querySelector("ring-view-ring-webrtc-player")?.stopTalking(), this.waitForLiveResume());
    }, this.handlePageShow = (e) => {
      const t = this.pageUnloading;
      if (this.pageUnloading = !1, this.inline) {
        this.updateInlineActivity();
        return;
      }
      t && e.persisted && this.open && this.mode === "live" && this.prepareAutomaticLiveResume();
    }, this.handleVisibilityChange = () => {
      if (this.open) {
        if (this.inline) {
          this.updateInlineActivity();
          return;
        }
        if (document.hidden && this.cancelDoorHold(), this.automaticLiveRecovery === "waiting") {
          this.tryAutomaticLiveResume();
          return;
        }
        if (document.hidden && this.automaticLiveRecovery === "attempting") {
          this.waitForLiveResume();
          return;
        }
        if (this.mediaStatus !== "awaiting-resume") {
          if (this.mode === "live" && this.config?.two_way_audio) {
            document.hidden && this.renderRoot.querySelector("ring-view-ring-webrtc-player")?.stopTalking();
            return;
          }
          document.hidden ? (this.cancelRecordingPreparation(!0), this.lifecycle.dispose(), this.session = this.lifecycle.current(), this.suspended = !0, this.mediaStatus = "idle") : this.suspended && (this.suspended = !1, this.startMedia());
        }
      }
    };
  }
  showDialog(e) {
    if (this.hass) {
      if (e.restored && this.isOpenFor(e)) {
        this.adoptRestoredDialog(e), this.syncUrl();
        return;
      }
      this.open && this.finishClose(!1, !1), this.inline = !1, this.config = e.config, this.resetAutoAspectRatio(), this.opener = e.opener, this.returnUrl = e.returnUrl ?? Qt(Gt()), this.mode = e.mode, this.liveMuted = e.restored && this.mode === "live" ? !0 : this.config.live_muted, this.recordingStarted = this.mode === "live" || this.config.autoplay_recording, this.resetMediaAttempt(), this.automaticLiveRetry = !e.restored, this.pageUnloading = !1, this.suspended = !1, this.statusAnnouncement = "", this.resetVisitorActions(), this.resetSnapshotAction(), this.lastDoorbellEntity = this.config.doorbell_entity ? this.hass.states[this.config.doorbell_entity] : void 0, this.setRingingUntil(e.ringingUntil), this.open = !0, Br(this), this.syncUrl(), this.attachGlobalListeners(), e.restored && this.mode === "live" ? this.prepareAutomaticLiveResume() : this.startMedia(), this.updateComplete.then(() => this.focusInitialControl());
    }
  }
  showInline(e) {
    if (this.hass) {
      if (this.inline && this.open && this.config === e.config) {
        this.setRingingUntil(e.ringingUntil);
        return;
      }
      this.open && this.finishClose(!1, !1), this.inline = !0, this.config = e.config, this.resetAutoAspectRatio(!0), this.mode = e.start === "live" ? "live" : e.start === "last_recording" ? "last_recording" : e.mode, this.liveMuted = this.config.dashboard_live_muted, this.inlineStarted = e.start !== "on_demand", this.recordingStarted = this.mode === "live" || this.inlineStarted, this.resetMediaAttempt(), this.automaticLiveRetry = !0, this.pageUnloading = !1, this.suspended = !this.inlineActive, this.statusAnnouncement = "", this.resetVisitorActions(), this.resetSnapshotAction(), this.lastDoorbellEntity = this.config.doorbell_entity ? this.hass.states[this.config.doorbell_entity] : void 0, this.setRingingUntil(e.ringingUntil), this.open = !0, this.attachGlobalListeners(), this.inlineStarted && this.inlineActive && this.startMedia();
    }
  }
  setInlineVisible(e) {
    this.inlineVisible = e, this.updateInlineActivity();
  }
  stopInline() {
    this.inline && this.finishClose(!1, !1);
  }
  isOpenFor(e) {
    return !!(this.open && this.config && this.config.live_entity === e.config.live_entity && this.config.recording_entity === e.config.recording_entity && this.mode === e.mode);
  }
  adoptRestoredDialog(e) {
    e.opener && (this.opener = e.opener), e.ringingUntil !== void 0 && e.ringingUntil > Date.now() && (this.ringingUntil === void 0 || e.ringingUntil > this.ringingUntil) && this.setRingingUntil(e.ringingUntil);
  }
  closeDialog() {
    return this.finishClose(), !0;
  }
  close() {
    this.closeDialog();
  }
  disconnectedCallback() {
    this.finishClose(!1, !1), super.disconnectedCallback();
  }
  willUpdate(e) {
    if (!this.open || !this.config || e.has("hass") && (this.observePendingSnapshotUpdate(), this.observePendingRecordingUpdate(), this.detectDoorbellEvent(e.get("hass")), this.prepareNewestRingMqttRecording()) || !e.has("hass")) return;
    this.config.door_entity && this.doorActionDisabled() && this.cancelDoorHold();
    const t = this.activeEntity();
    y(t) && this.mediaStatus !== "error" && (this.clearAutomaticLiveRecovery(), this.lifecycle.dispose(), this.releaseInlineLive(), this.session = this.lifecycle.current(), this.mediaStatus = "error", this.statusAnnouncement = s(this.hass, "viewer.entity_unavailable")), this.tryAutomaticLiveResume();
  }
  render() {
    if (!this.open || !this.hass || !this.config) return l;
    const e = this.dialogTitle(), t = this.config.show_name, i = this.config.last_activity_entity ? z(this.hass, this.config.last_activity_entity) !== void 0 : !1, r = Le(this.config.aspect_ratio) ?? this.autoAspectRatio ?? 16 / 9, n = {
      "--ring-view-aspect-ratio": Zt(
        this.config.aspect_ratio,
        this.autoAspectRatio
      ),
      "--ring-view-dialog-height-limited-width": `calc((100dvh - 32px) * ${r})`,
      "--ring-view-fit-mode": this.config.fit_mode
    }, o = Number(this.ringing) + Number(this.shouldShowSnapshotAction());
    return h`
      ${this.inline ? l : h`<div class="backdrop" @pointerdown=${this.handleBackdrop}></div>`}
      <section
        class="dialog"
        style=${xe(n)}
        role=${this.inline ? "region" : "dialog"}
        aria-modal=${this.inline ? l : "true"}
        aria-labelledby=${t ? "ring-view-dialog-title" : l}
        aria-label=${t ? l : s(this.hass, "viewer.camera_view")}
        @keydown=${this.handleKeyDown}
      >
        <div class="body">
          ${this.renderMedia()}
          <header
            class=${C({
      header: !0,
      "camera-actions-one": o === 1,
      "camera-actions-two": o === 2
    })}
          >
            ${t || i ? h`
                  <div class="header-copy">
                    ${t ? h`<h2 id="ring-view-dialog-title">${e}</h2>` : l}
                    ${i ? h`
                          <ring-view-activity-time
                            .hass=${this.hass}
                            .entityId=${this.config.last_activity_entity}
                          ></ring-view-activity-time>
                        ` : l}
                  </div>
                ` : l}
            <div class="header-actions">
              ${o > 0 ? h`
                    <div class="camera-actions">
                      ${this.renderRingIndicator()} ${this.renderSnapshotAction()}
                    </div>
                  ` : l}
              <button
                class=${this.inline ? "icon-button chrome-action expand" : "icon-button chrome-action close"}
                type="button"
                aria-label=${s(
      this.hass,
      this.inline ? "viewer.expand_aria" : "viewer.close_aria"
    )}
                title=${this.inline ? s(this.hass, "viewer.expand_aria") : qt(
      this.hass,
      "ui.common.close",
      "common.close"
    )}
                @click=${this.inline ? this.expand : this.close}
              >
                ${this.icon(this.inline ? si : ri)}
              </button>
            </div>
            ${this.renderModeSwitch()}
          </header>
          ${this.renderVisitorActions()}
        </div>
        <div class="sr-only" aria-live="polite" aria-atomic="true">
          ${this.statusAnnouncement}
        </div>
      </section>
    `;
  }
  renderRingIndicator() {
    if (!this.ringing) return l;
    const e = s(this.hass, "ring.alert");
    return h`
      <span
        class="ring-indicator"
        role="status"
        aria-live="polite"
        aria-label=${e}
        title=${e}
      >
        ${this.icon(Et)}
        <span class="sr-only">${e}</span>
      </span>
    `;
  }
  renderModeSwitch() {
    const e = this.mode === "last_recording", t = this.mode === "live", i = s(this.hass, "common.last_recording"), r = s(this.hass, "common.live");
    return h`
      <div
        class="mode-switch"
        role="tablist"
        aria-label=${s(this.hass, "viewer.camera_view")}
      >
        <button
          id="ring-view-tab-recording"
          class="mode-button recording"
          type="button"
          role="tab"
          aria-label=${i}
          title=${i}
          aria-selected=${String(e)}
          tabindex=${this.mode === "last_recording" ? "0" : "-1"}
          @click=${() => this.selectMode("last_recording")}
          @keydown=${this.handleTabKeyDown}
        >
          ${yt("last_recording")}
        </button>
        <button
          id="ring-view-tab-live"
          class="mode-button live"
          type="button"
          role="tab"
          aria-label=${r}
          title=${r}
          aria-selected=${String(t)}
          tabindex=${this.mode === "live" ? "0" : "-1"}
          @click=${() => this.selectMode("live")}
          @keydown=${this.handleTabKeyDown}
        >
          ${yt("live")}
        </button>
      </div>
    `;
  }
  renderSnapshotAction() {
    if (!this.shouldShowSnapshotAction()) return l;
    const e = this.snapshotEntityId(), t = this.hass?.connection?.connected !== !1, i = this.snapshotActionStatus === "working", r = i || !e || !t, n = t ? e ? this.snapshotActionStatus === "working" ? "snapshot.saving" : this.snapshotActionStatus === "success" ? "snapshot.saved" : this.snapshotActionStatus === "error" ? this.snapshotFeedbackMessage ? void 0 : "snapshot.failed" : "snapshot.take" : "snapshot.unavailable" : "snapshot.connection_failed", o = n ? s(this.hass, n) : this.snapshotFeedbackMessage, a = this.snapshotActionStatus === "working" ? it : this.snapshotActionStatus === "success" ? et : this.snapshotActionStatus === "error" ? Re : Ct;
    return h`
      <button
        class=${C({
      "icon-button": !0,
      "snapshot-action": !0,
      working: i,
      success: this.snapshotActionStatus === "success",
      error: this.snapshotActionStatus === "error"
    })}
        type="button"
        aria-label=${o}
        aria-busy=${String(i)}
        title=${o}
        ?disabled=${r}
        @click=${this.takeSnapshot}
      >
        ${this.icon(a)}
      </button>
    `;
  }
  shouldShowSnapshotAction() {
    return !!(this.config?.show_snapshot_button && this.mode === "live" && (!this.inline || this.inlineStarted));
  }
  snapshotEntityId() {
    return this.hass && this.config ? yr(this.hass, this.config) : void 0;
  }
  clearSnapshotFeedback() {
    this.snapshotFeedbackTimer !== void 0 && (window.clearTimeout(this.snapshotFeedbackTimer), this.snapshotFeedbackTimer = void 0), this.snapshotFeedbackMessage = void 0, this.clearViewerFeedback("snapshot"), ["success", "error"].includes(this.snapshotActionStatus) && (this.snapshotActionStatus = "idle");
  }
  resetSnapshotAction() {
    this.finishPendingSnapshotUpdate("cancelled"), this.clearSnapshotFeedback(), this.snapshotActionToken += 1, this.snapshotActionStatus = "idle";
  }
  waitForSnapshotUpdate(e, t) {
    return this.finishPendingSnapshotUpdate("cancelled"), new Promise((i) => {
      const r = window.setTimeout(() => {
        this.finishPendingSnapshotUpdate("timeout");
      }, En);
      this.pendingSnapshotUpdate = { entityId: e, baseline: t, timer: r, resolve: i };
    });
  }
  observePendingSnapshotUpdate() {
    const e = this.pendingSnapshotUpdate;
    if (!e || !this.hass) return;
    const t = _t(this.hass, e.entityId);
    t !== void 0 && t !== e.baseline && this.finishPendingSnapshotUpdate("updated");
  }
  finishPendingSnapshotUpdate(e) {
    const t = this.pendingSnapshotUpdate;
    t && (this.pendingSnapshotUpdate = void 0, window.clearTimeout(t.timer), t.resolve(e));
  }
  renderVisitorActions() {
    const e = this.shouldShowDoorControl(), t = this.shouldShowTalkControl();
    if (!e && !t) return l;
    const i = e ? this.doorActionDisabled() : !0, r = this.doorActionLabel(), n = this.doorActionAriaLabel(r), o = this.doorActionIcon(), a = e ? this.doorContactState() : void 0, d = a === "open", c = a === "unknown", p = s(this.hass, "door.contact_unknown"), u = this.config?.show_action_button_labels ?? !0, v = this.talkbackRequesting ? s(this.hass, "talkback.requesting_microphone") : this.talkbackTalking ? s(this.hass, "talkback.release_to_stop") : this.talkbackReady ? s(this.hass, "talkback.hold_to_talk") : s(this.hass, "talkback.connecting_short"), b = this.talkbackTalking ? s(this.hass, "talkback.release_short") : v, k = c ? `${n}. ${p}` : n;
    return h`
      <div class="visitor-controls">
        <div
          class=${C({
      "visitor-action-dock": !0,
      "door-only": e && !t,
      "talk-only": t && !e,
      "icon-only": !u
    })}
          role="group"
          aria-label=${s(this.hass, "door.actions")}
        >
          ${t ? h`
                <button
                  class=${C({
      "visitor-action": !0,
      "talk-action": !0,
      active: this.talkbackTalking
    })}
                  type="button"
                  aria-label=${v}
                  title=${v}
                  aria-pressed=${String(this.talkbackTalking)}
                  ?disabled=${!this.talkbackReady}
                  @contextmenu=${(R) => R.preventDefault()}
                  @pointerdown=${this.handleTalkPointerDown}
                  @pointerup=${this.handleTalkPointerEnd}
                  @pointercancel=${this.handleTalkPointerEnd}
                  @lostpointercapture=${this.handleTalkPointerEnd}
                  @keydown=${this.handleTalkKeyDown}
                  @keyup=${this.handleTalkKeyUp}
                >
                  ${this.icon(this.talkbackTalking ? Lt : Pt)}
                  ${u ? h`<span>${b}</span>` : l}
                </button>
              ` : l}
          ${e ? h`
                <button
                  class=${C({
      "visitor-action": !0,
      "door-action": !0,
      "contact-open": d,
      "contact-unknown": c,
      holding: !d && this.doorActionStatus === "holding",
      working: !d && this.doorActionStatus === "working",
      success: !d && this.doorActionStatus === "success",
      error: !d && this.doorActionStatus === "error"
    })}
                  type="button"
                  aria-label=${k}
                  title=${k}
                  aria-busy=${String(this.doorActionStatus === "working")}
                  aria-describedby=${this.viewerFeedback?.source === "door" ? "ring-view-door-feedback" : l}
                  ?disabled=${i}
                  @contextmenu=${(R) => R.preventDefault()}
                  @click=${this.handleDoorClick}
                  @pointerdown=${this.handleDoorPointerDown}
                  @pointerup=${this.handleDoorPointerEnd}
                  @pointercancel=${this.handleDoorPointerEnd}
                  @lostpointercapture=${this.handleDoorPointerEnd}
                  @keydown=${this.handleDoorKeyDown}
                  @keyup=${this.handleDoorKeyUp}
                >
                  ${this.icon(o)}
                  ${u ? h`
                        <span class="door-action-copy">
                          <span>${r}</span>
                          ${c ? h`<span class="door-contact-state"
                                >${p}</span
                              >` : l}
                        </span>
                      ` : l}
                </button>
              ` : l}
        </div>
      </div>
    `;
  }
  shouldShowDoorControl() {
    return !!(this.config?.door_entity && (!this.inline || this.config.door_control_location === "dashboard_and_viewer") && (!this.inline || this.config.door_control_visibility === "all_views" || ["pending", "retrying", "ready", "playback-blocked"].includes(
      this.mediaStatus
    )) && (this.mode === "live" || this.config.door_control_visibility === "all_views"));
  }
  shouldShowTalkControl() {
    return !!(this.mode === "live" && this.config?.two_way_audio && this.hass && Ee(this.hass, this.config.live_entity) && ["pending", "ready", "playback-blocked"].includes(this.mediaStatus));
  }
  doorEntity() {
    const e = this.config?.door_entity;
    return e ? this.hass?.states[e] : void 0;
  }
  doorContactState() {
    const e = this.config?.door_contact_entity;
    if (!e) return;
    const t = this.hass?.states[e]?.state;
    return t === "on" || t === "open" ? "open" : t === "off" || t === "closed" ? "closed" : "unknown";
  }
  doorActionDisabled() {
    const e = this.doorEntity();
    return !this.config?.door_entity || this.doorContactState() === "open" || y(e) || e?.state === "jammed" || this.doorActionStatus === "working" || this.doorActionStatus === "success" || this.doorWaitingForLiveVideo() ? !0 : this.config.door_action === "open" ? !he(e) || ["open", "opening"].includes(e?.state ?? "") : ["unlocked", "unlocking", "open", "opening"].includes(e?.state ?? "");
  }
  doorActionLabel() {
    const e = this.doorEntity();
    return this.doorContactState() === "open" ? s(this.hass, "door.contact_open") : y(e) ? s(this.hass, "door.unavailable") : e?.state === "jammed" ? s(this.hass, "door.jammed") : this.config?.door_action === "open" && !he(e) ? s(this.hass, "door.open_unsupported") : this.doorWaitingForLiveVideo() ? s(
      this.hass,
      this.config?.door_action === "open" ? "door.open_when_ready" : "door.unlock_when_ready"
    ) : this.doorActionStatus === "working" || this.config?.door_action === "unlock" && e?.state === "unlocking" || this.config?.door_action === "open" && e?.state === "opening" ? s(
      this.hass,
      this.config?.door_action === "open" ? "door.opening" : "door.unlocking"
    ) : this.doorActionStatus === "success" ? s(
      this.hass,
      this.config?.door_action === "open" ? "door.opened" : "door.unlocked"
    ) : this.config?.door_action === "open" && e?.state === "open" ? s(this.hass, "door.opened") : this.config?.door_action === "unlock" && ["unlocked", "open"].includes(e?.state ?? "") ? s(this.hass, "door.unlocked") : this.config?.door_hold_to_activate ? s(
      this.hass,
      this.config.door_action === "open" ? "door.hold_to_open" : "door.hold_to_unlock"
    ) : s(
      this.hass,
      this.config?.door_action === "open" ? "door.open" : "door.unlock"
    );
  }
  doorActionAriaLabel(e) {
    return this.doorWaitingForLiveVideo() ? s(
      this.hass,
      this.config?.door_action === "open" ? "door.open_when_ready_aria" : "door.unlock_when_ready_aria"
    ) : e;
  }
  doorWaitingForLiveVideo() {
    return !!(this.inline && this.config?.door_control_visibility === "live_only" && this.mode === "live" && this.mediaStatus !== "ready");
  }
  doorActionIcon() {
    const e = this.doorEntity(), t = this.doorContactState();
    return t === "open" ? tt : t === "closed" ? ni : t === "unknown" || y(e) || e?.state === "jammed" || this.config?.door_action === "open" && !he(e) || this.doorActionStatus === "error" ? Re : this.doorActionStatus === "working" ? it : this.doorActionStatus === "success" ? et : this.config?.door_action === "open" ? tt : Mt;
  }
  talkbackPlayer() {
    return this.shadowRoot?.querySelector("ring-view-ring-webrtc-player") ?? null;
  }
  cancelTalkPress(e = this.talkbackPlayer()) {
    this.talkPointerId = void 0, this.talkKeyboardPressed = !1, e?.stopTalking();
  }
  beginDoorHold() {
    this.doorHoldTimer !== void 0 || this.doorActionDisabled() || (this.clearDoorFeedback(), this.doorActionStatus = "holding", this.doorHoldTimer = window.setTimeout(() => {
      this.doorHoldTimer = void 0, this.doorPointerId = void 0, this.doorKeyboardPressed = !1, this.executeDoorAction();
    }, Sn));
  }
  cancelDoorHold() {
    this.doorHoldTimer !== void 0 && (window.clearTimeout(this.doorHoldTimer), this.doorHoldTimer = void 0), this.doorPointerId = void 0, this.doorKeyboardPressed = !1, this.doorActionStatus === "holding" && (this.doorActionStatus = "idle");
  }
  async executeDoorAction() {
    const e = this.hass, t = this.config?.door_entity, i = this.config?.door_action;
    if (!e || !t || !i || this.doorActionDisabled() || document.hidden) {
      this.cancelDoorHold();
      return;
    }
    this.cancelDoorHold(), this.clearDoorFeedback(), this.doorActionStatus = "working";
    const r = ++this.doorActionToken;
    try {
      if (!e.callService) throw new Error("Home Assistant service API unavailable");
      if (await e.callService("lock", i, { entity_id: t }), r !== this.doorActionToken || !this.open) return;
      const n = s(
        this.hass,
        i === "open" ? "door.opened" : "door.unlocked"
      );
      this.doorActionStatus = "success", this.clearViewerFeedback("door"), this.statusAnnouncement = n, this.doorFeedbackTimer = window.setTimeout(() => {
        r === this.doorActionToken && (this.doorFeedbackTimer = void 0, this.clearViewerFeedback("door"), this.doorActionStatus = "idle");
      }, Rn);
    } catch {
      if (r !== this.doorActionToken || !this.open) return;
      const n = s(
        this.hass,
        i === "open" ? "door.open_failed" : "door.unlock_failed"
      );
      this.doorActionStatus = "error", this.setViewerFeedback("door", n, "error"), this.statusAnnouncement = n, this.doorFeedbackTimer = window.setTimeout(() => {
        r === this.doorActionToken && (this.doorFeedbackTimer = void 0, this.clearViewerFeedback("door"), this.doorActionStatus = "idle");
      }, Tn);
    }
  }
  clearDoorFeedback() {
    this.doorFeedbackTimer !== void 0 && (window.clearTimeout(this.doorFeedbackTimer), this.doorFeedbackTimer = void 0), this.clearViewerFeedback("door"), ["success", "error"].includes(this.doorActionStatus) && (this.doorActionStatus = "idle");
  }
  resetVisitorActions() {
    this.cancelTalkPress(), this.cancelDoorHold(), this.clearDoorFeedback(), this.doorActionToken += 1, this.doorActionStatus = "idle", this.talkbackReady = !1, this.talkbackRequesting = !1, this.talkbackTalking = !1, this.clearViewerFeedback("session");
  }
  setViewerFeedback(e, t, i) {
    this.viewerFeedback = { source: e, message: t, kind: i };
  }
  clearViewerFeedback(e) {
    this.viewerFeedback?.source === e && (this.viewerFeedback = void 0);
  }
  renderMedia() {
    const e = this.activeEntity(), t = this.activeEntityId(), i = y(e), r = !i && !this.suspended && (this.mode === "live" || this.recordingStarted), n = Le(this.config.aspect_ratio), o = this.activePosterEntityId(), a = this.mode === "last_recording" ? rr(e) : void 0, d = Yt(
      this.hass,
      this.hass.states[o],
      o,
      a
    ), c = this.mode === "last_recording" ? ke(e) : void 0, p = this.mode === "last_recording" && t.startsWith("select."), u = r && ["pending", "ready", "playback-blocked"].includes(this.mediaStatus), v = !!(u && c && !this.recordingVideoFailed && !this.recordingPreparationActive), b = u && !v && !p, k = !!(r && this.mode === "live" && this.config.two_way_audio && Ee(this.hass, t)), R = !!(this.inline && !this.inlineStarted || this.mode === "last_recording" && !this.recordingStarted);
    return h`
      <div
        class="media-frame"
        role="tabpanel"
        @ring-view-media-aspect-ratio=${this.handlePlayerAspectRatio}
        aria-labelledby=${this.mode === "live" ? "ring-view-tab-live" : "ring-view-tab-recording"}
      >
        <img
          class="poster"
          data-entity-id=${o}
          src=${d}
          alt=""
          aria-hidden="true"
          @load=${this.handlePosterLoad}
        />
        ${R ? h`
              <button
                class="initial-start-surface"
                type="button"
                aria-label=${s(
      this.hass,
      this.mode === "live" ? "viewer.start_live" : "viewer.play_recording"
    )}
                title=${s(
      this.hass,
      this.mode === "live" ? "viewer.start_live" : "viewer.play_recording"
    )}
                @click=${this.mode === "live" ? this.startInlineLive : this.startRecording}
              ></button>
            ` : l}
        ${b ? kt(
      `${t}:${this.session}`,
      h`
                ${k ? h`
                      <ring-view-ring-webrtc-player
                        class=${this.mediaStatus === "pending" ? "pending" : ""}
                        .hass=${this.hass}
                        .entityId=${t}
                        .muted=${this.liveMuted}
                        .fitMode=${this.config.fit_mode}
                        .poster=${d}
                        .externalControls=${!0}
                        @ring-webrtc-ready=${this.handleMediaReady}
                        @ring-webrtc-error=${this.handleRingWebRtcError}
                        @ring-webrtc-resume=${this.handleLiveResumeRequired}
                        @ring-webrtc-playback-blocked=${this.handlePlaybackBlocked}
                        @ring-webrtc-capabilities=${this.handleMediaCapabilities}
                        @ring-talkback-state=${this.handleTalkbackState}
                        @ring-webrtc-status=${this.handleRingWebRtcStatus}
                      ></ring-view-ring-webrtc-player>
                    ` : h`
                      <ring-view-native-camera-adapter
                        class=${this.mediaStatus === "pending" ? "pending" : ""}
                        .stateObj=${e}
                        .controls=${!0}
                        .muted=${this.mode === "live" ? this.liveMuted : this.recordingMuted}
                        .allowExoPlayer=${!0}
                        .aspectRatio=${n}
                        .fitMode=${this.config.fit_mode}
                        .passiveSurface=${this.mode === "live"}
                        @native-media-ready=${this.handleMediaReady}
                        @native-media-error=${this.handleMediaError}
                        @native-media-capabilities=${this.handleMediaCapabilities}
                      ></ring-view-native-camera-adapter>
                    `}
              `
    ) : l}
        ${v ? kt(
      `${t}:${this.session}:recording-video`,
      h`
              <video
                .defaultMuted=${this.recordingMuted}
                .muted=${this.recordingMuted}
                .src=${c}
                class=${C({
        "video-fallback": !0,
        pending: this.mediaStatus === "pending",
        "controls-hidden": !this.recordingControlsVisible
      })}
                poster=${d}
                playsinline
                autoplay
                preload="auto"
                .controls=${this.recordingControlsVisible}
                tabindex="0"
                aria-label=${this.recordingControlsVisible ? l : s(this.hass, "viewer.play_recording")}
                @canplay=${this.handleRecordingCanPlay}
                @loadedmetadata=${this.handleRecordingDimensions}
                @resize=${this.handleRecordingDimensions}
                @error=${this.handleRecordingVideoError}
                @play=${this.handleRecordingPlay}
                @volumechange=${this.handleRecordingVolumeChange}
                @pause=${this.handleRecordingPause}
                @ended=${this.handleRecordingEnded}
                @click=${this.handleRecordingSurfaceClick}
                @keydown=${this.handleRecordingSurfaceKeyDown}
                @pointerdown=${this.handleRecordingControlsInteraction}
                @pointermove=${this.handleRecordingControlsInteraction}
                @focus=${this.handleRecordingControlsInteraction}
              ></video>
            `
    ) : l}
        ${this.renderStateLayer(i, v)}
      </div>
    `;
  }
  renderStateLayer(e, t) {
    if (this.ringing && (this.mode !== "live" || this.inline && !this.inlineStarted)) {
      const r = this.shouldShowDoorControl() || this.shouldShowTalkControl();
      return h`
        <div
          class=${C({
        "state-layer": !0,
        "doorbell-alert-layer": !0,
        "with-visitor-controls": r
      })}
          role="status"
          aria-live="polite"
        >
          <div class="state-card">
            <div class="state-actions">
              <button
                class="action-button primary"
                type="button"
                @click=${() => this.selectMode("live")}
              >
                ${s(this.hass, "ring.open_live")}
              </button>
            </div>
          </div>
        </div>
      `;
    }
    if (e) {
      const r = this.activeEntity();
      return h`
        <div class="state-layer blocking-state unavailable-state" role="status">
          <div class="state-card">
            <div class="state-title">${x(r, this.activeEntityId())}</div>
            <div class="state-detail">
              ${s(this.hass, "viewer.entity_unavailable")}
            </div>
            <div class="state-actions">
              <button class="action-button primary" type="button" @click=${this.retry}>
                ${s(this.hass, "common.retry")}
              </button>
              ${this.inline ? l : this.renderAlternateModeButton()}
            </div>
          </div>
        </div>
      `;
    }
    if (this.suspended)
      return h`
        <div class="state-layer blocking-state suspended-state" role="status">
          <div class="state-card">
            <div class="state-title">
              ${s(this.hass, "viewer.suspended")}
            </div>
          </div>
        </div>
      `;
    if (this.inline && !this.inlineStarted) return l;
    if (this.mode === "live" && this.mediaStatus === "awaiting-resume")
      return h`
        <div class="state-layer play-layer resume-state">
          <button class="action-button primary play-recording resume-live" type="button"
            @click=${this.resumeLive}>
            ${this.icon(Dt)}
            <span>${s(this.hass, "viewer.resume_live")}</span>
          </button>
        </div>
      `;
    if (this.mediaStatus === "pending" || this.mediaStatus === "retrying") {
      const r = this.shouldShowDoorControl() || this.shouldShowTalkControl();
      return h`
        <div
          class=${C({
        "state-layer": !0,
        "loading-state": !0,
        "with-visitor-controls": r
      })}
          role="status"
        >
          <div class="state-card">
            <div class="spinner" aria-hidden="true"></div>
            <div class="state-title">
              ${this.mediaStatus === "retrying" ? s(this.hass, "viewer.retrying_live") : this.mode === "live" ? s(this.hass, "viewer.connecting_live") : s(this.hass, "viewer.loading_recording")}
            </div>
          </div>
        </div>
      `;
    }
    if (this.mediaStatus === "compatibility" && !t)
      return h`
        <div class="state-layer blocking-state compatibility-state" role="alert">
          <div class="state-card">
            <div class="state-title">
              ${s(this.hass, "viewer.native_unavailable_title")}
            </div>
            <div class="state-detail">
              ${s(this.hass, "viewer.native_unavailable_detail")}
            </div>
            <div class="state-actions">
              <button class="action-button primary" type="button" @click=${this.openMoreInfo}>
                ${s(this.hass, "viewer.open_ha_camera")}
              </button>
              ${this.inline ? l : this.renderAlternateModeButton()}
            </div>
          </div>
        </div>
      `;
    if (this.mediaStatus === "error") {
      const r = this.recordingFailureDetail ?? s(this.hass, "viewer.ring_protect"), n = this.mode === "live" ? s(this.hass, "viewer.live_failed") : s(
        this.hass,
        this.inline ? "viewer.recording_unavailable_short" : "viewer.recording_unavailable"
      );
      return h`
        <div class="state-layer blocking-state error-state" role="alert">
          <div class="state-card">
            <div class="state-title">
              ${n}
            </div>
            ${this.mode === "last_recording" ? h`<div class="state-detail">
                  ${r}
                </div>` : l}
            <div class="state-actions">
              <button class="action-button primary" type="button" @click=${this.retry}>
                ${s(this.hass, "common.retry")}
              </button>
              ${this.inline ? l : this.renderAlternateModeButton()}
            </div>
          </div>
        </div>
      `;
    }
    if (this.viewerFeedback) {
      const r = this.shouldShowDoorControl() || this.shouldShowTalkControl(), n = this.viewerFeedback.source === "door" ? "ring-view-door-feedback" : void 0;
      return h`
        <div
          class=${C({
        "state-layer": !0,
        "viewer-feedback-layer": !0,
        "snapshot-error-layer": this.viewerFeedback.source === "snapshot",
        "door-error-layer": this.viewerFeedback.source === "door",
        "session-message-layer": this.viewerFeedback.source === "session",
        "with-visitor-controls": r
      })}
          role=${this.viewerFeedback.kind === "error" ? "alert" : "status"}
          aria-live=${this.viewerFeedback.kind === "error" ? "assertive" : "polite"}
        >
          <div class="state-card">
            <div id=${n ?? l} class="state-title">
              ${this.viewerFeedback.message}
            </div>
          </div>
        </div>
      `;
    }
    return l;
  }
  renderAlternateModeButton() {
    const e = this.mode === "live" ? "last_recording" : "live";
    return h`
      <button class="action-button" type="button" @click=${() => this.selectMode(e)}>
        ${s(
      this.hass,
      e === "live" ? "viewer.switch_live" : "viewer.switch_recording"
    )}
      </button>
    `;
  }
  selectMode(e) {
    if (this.config) {
      if (e === this.mode) {
        this.inline && !this.inlineStarted && (this.inlineStarted = !0, this.recordingStarted = !0, this.resetMediaAttempt(), this.startMedia());
        return;
      }
      this.resetVisitorActions(), this.resetSnapshotAction(), this.clearAutomaticLiveRecovery(), this.lifecycle.dispose(), this.releaseInlineLive(), this.automaticLiveRetry = !0, this.resetAutoAspectRatio(!0), this.mode = e, tn(this.config, e), this.liveMuted = this.inline ? this.config.dashboard_live_muted : this.config.live_muted, this.inlineStarted = !0, this.recordingStarted = this.inline ? !0 : e === "live" || this.config.autoplay_recording, this.resetMediaAttempt(), this.statusAnnouncement = s(
        this.hass,
        e === "live" ? "viewer.mode_selected_live" : "viewer.mode_selected_recording"
      ), this.syncUrl(), this.startMedia();
    }
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
    if (this.inline && !this.inlineStarted) {
      this.mediaStatus = "idle";
      return;
    }
    if (y(this.activeEntity())) {
      this.mediaStatus = "error", this.statusAnnouncement = s(this.hass, "viewer.entity_unavailable");
      return;
    }
    const e = this.mode === "last_recording" && this.hass && X(this.hass, this.activeEntityId());
    if (e && this.prepareNewestRingMqttRecording()) return;
    const t = e && $t() ? ft(this.activeEntity()) : void 0;
    if (t !== void 0 && !this.recordingTranscodeFallbackAttempted) {
      this.recordingTranscodeFallbackAttempted = !0, this.recordingRefreshAttempted = !0, this.refreshRingMqttRecording(t);
      return;
    }
    if (this.mode === "last_recording" && e && (!B(this.activeEntity()) || this.recordingVideoFailed)) {
      if (this.recordingRefreshAttempted) {
        this.failRecordingPreparation("viewer.recording_playback_failed");
        return;
      }
      this.recordingRefreshAttempted = !0, this.refreshRingMqttRecording();
      return;
    }
    if (this.mode === "last_recording" && this.activeEntityId().startsWith("select.") && !B(this.activeEntity())) {
      this.failRecordingPreparation("viewer.recording_source_unsupported");
      return;
    }
    if (this.inline && this.mode === "live" && !this.claimInlineLive()) {
      this.waitForLiveResume();
      return;
    }
    this.mode === "last_recording" && this.resetRecordingControls(), this.recordingPreparationActive = !1, this.recordingFailureDetail = void 0, this.mediaStatus = "pending", this.session = this.lifecycle.next(), this.lifecycle.scheduleTimeout(
      () => this.failMedia(),
      yn * 1e3
    );
  }
  resetMediaAttempt() {
    this.cancelRecordingPreparation(!0), this.newestRecordingMarker = void 0, this.cancelTalkPress(), this.resetRecordingControls(), this.retryCount = 0, this.recordingMuted = this.mode === "last_recording" && !!this.config && (this.inline ? this.config.dashboard_recording_muted : this.config.recording_muted), this.liveHasAudio = void 0, this.recordingVideoFailed = !1, this.recordingPlaybackRetriedSource = void 0, this.talkbackReady = !1, this.talkbackRequesting = !1, this.talkbackTalking = !1;
  }
  prepareNewestRingMqttRecording() {
    if (!this.open || this.suspended || !this.hass || !this.config || this.mode !== "last_recording" || !this.recordingStarted || this.inline && !this.inlineStarted || this.config.recording_selection !== "newest" || !X(this.hass, this.activeEntityId()) || this.recordingPreparationActive)
      return !1;
    const e = this.activeEntity(), t = $t() || /\s\(transcoded\)$/i.test(e?.state.trim() ?? ""), i = dr(
      this.hass,
      this.config.last_activity_entity,
      e,
      t
    );
    return !i || this.newestRecordingMarker === i.marker && e?.state.trim() === i.option ? !1 : (this.newestRecordingMarker = i.marker, this.recordingRefreshAttempted = !1, this.recordingTranscodeFallbackAttempted = !1, this.recordingPlaybackRetriedSource = void 0, this.recordingVideoFailed = !1, this.refreshRingMqttRecording(i.option, {
      allowUnchangedReady: i.recordingReady && e?.state.trim() === i.option,
      statusKey: "viewer.preparing_latest_recording"
    }), !0);
  }
  applyAutoAspectRatio(e, t) {
    this.config?.aspect_ratio !== "auto" || e === void 0 || t === "poster" && this.autoAspectRatioSource === "media" || (this.autoAspectRatioSource = t, !Se(this.autoAspectRatio, e) && (this.autoAspectRatio = e, this.inline && this.dispatchEvent(_e(e))));
  }
  resetAutoAspectRatio(e = !1) {
    this.autoAspectRatio = void 0, this.autoAspectRatioSource = void 0, e && this.inline && this.dispatchEvent(_e());
  }
  async refreshRingMqttRecording(e, t = {}) {
    const i = this.hass, r = this.activeEntityId(), n = this.activeEntity(), o = e ?? n?.state.trim();
    if (!i || !this.config || !o || o === "unknown" || o === "unavailable") {
      this.failRecordingPreparation("viewer.recording_selection_missing");
      return;
    }
    if (i.connection?.connected === !1 || !i.callService) {
      this.failRecordingPreparation("viewer.recording_refresh_failed");
      return;
    }
    this.finishPendingRecordingUpdate("cancelled");
    const a = ++this.recordingRefreshToken, d = Y(n), c = t.allowUnchangedReady ?? (this.recordingVideoFailed && B(n));
    this.recordingPreparationActive = !0, this.recordingVideoFailed = !1, this.recordingFailureDetail = void 0, this.lifecycle.dispose(), this.session = this.lifecycle.current(), this.mediaStatus = "pending", this.statusAnnouncement = s(
      this.hass,
      t.statusKey ?? (e && e !== n?.state.trim() ? "viewer.preparing_compatible_recording" : "viewer.refreshing_recording")
    );
    const p = this.waitForRecordingUpdate(
      r,
      d
    );
    Promise.resolve().then(() => i.callService(
      "select",
      "select_option",
      { option: o },
      { entity_id: r }
    )).then(() => {
      if (!c || a !== this.recordingRefreshToken) return;
      const v = this.pendingRecordingUpdate;
      !v || v.entityId !== r || (v.settleTimer = window.setTimeout(() => {
        const b = this.hass?.states[r];
        a === this.recordingRefreshToken && B(b) && Y(b) === d && this.finishPendingRecordingUpdate("unchanged");
      }, Mn));
    }).catch(() => {
      a === this.recordingRefreshToken && this.open && this.finishPendingRecordingUpdate("failed");
    });
    const u = await p;
    if (!(a !== this.recordingRefreshToken || !this.open || this.mode !== "last_recording" || this.activeEntityId() !== r) && (this.recordingPreparationActive = !1, u !== "cancelled")) {
      if (u === "failed") {
        this.failRecordingPreparation("viewer.recording_refresh_failed");
        return;
      }
      if (u === "timeout") {
        this.failRecordingPreparation("viewer.recording_refresh_timeout");
        return;
      }
      this.recordingVideoFailed = !1, this.startMedia();
    }
  }
  waitForRecordingUpdate(e, t) {
    return this.finishPendingRecordingUpdate("cancelled"), new Promise((i) => {
      const r = window.setTimeout(() => {
        this.finishPendingRecordingUpdate("timeout");
      }, Cn);
      this.pendingRecordingUpdate = { entityId: e, baseline: t, timer: r, resolve: i };
    });
  }
  observePendingRecordingUpdate() {
    const e = this.pendingRecordingUpdate;
    if (!e || !this.hass) return;
    const t = this.hass.states[e.entityId], i = Y(t);
    i !== void 0 && i !== e.baseline && B(t) && this.finishPendingRecordingUpdate("updated");
  }
  finishPendingRecordingUpdate(e) {
    const t = this.pendingRecordingUpdate;
    t && (this.pendingRecordingUpdate = void 0, window.clearTimeout(t.timer), t.settleTimer !== void 0 && window.clearTimeout(t.settleTimer), t.resolve(e));
  }
  cancelRecordingPreparation(e = !1) {
    this.recordingRefreshToken += 1, this.finishPendingRecordingUpdate("cancelled"), this.recordingPreparationActive = !1, e && (this.recordingRefreshAttempted = !1, this.recordingTranscodeFallbackAttempted = !1, this.recordingVideoFailed = !1, this.recordingFailureDetail = void 0);
  }
  failRecordingPreparation(e) {
    this.finishPendingRecordingUpdate("cancelled"), this.recordingPreparationActive = !1, this.lifecycle.dispose(), this.session = this.lifecycle.current(), this.mediaStatus = "error", this.recordingFailureDetail = s(this.hass, e), this.statusAnnouncement = this.recordingFailureDetail;
  }
  acceptsMediaEvent(e) {
    return this.open && ["pending", "ready", "playback-blocked"].includes(this.mediaStatus) && (!e || e.currentTarget instanceof HTMLElement && e.currentTarget.isConnected);
  }
  liveAudioStatus() {
    return this.liveMuted ? s(this.hass, "viewer.live_connected_muted") : this.liveHasAudio === !0 ? s(this.hass, "viewer.live_connected_audio") : this.liveHasAudio === !1 ? s(this.hass, "viewer.live_connected_no_audio") : s(this.hass, "viewer.live_detecting_audio");
  }
  resumeRecordingFromSurface(e) {
    if (this.isCurrentRecording(e, this.session)) {
      if (this.clearRecordingControlsTimer(), this.recordingEnded || e.ended)
        try {
          e.currentTime = 0;
        } catch {
        }
      this.recordingEnded = !1, this.recordingPaused = !1, this.recordingControlsVisible = !0, e.controls = !0, e.play().catch(() => {
      });
    }
  }
  scheduleRecordingControlsHide(e, t) {
    this.clearRecordingControlsTimer(), this.recordingControlsTimer = window.setTimeout(() => {
      this.recordingControlsTimer = void 0, this.isCurrentRecording(e, t) && (e.controls = !1, this.recordingControlsVisible = !1);
    }, An);
  }
  resetRecordingControls() {
    this.clearRecordingControlsTimer(), this.recordingControlsVisible = !0, this.recordingEnded = !1, this.recordingPaused = !1;
  }
  clearRecordingControlsTimer() {
    this.recordingControlsTimer !== void 0 && (window.clearTimeout(this.recordingControlsTimer), this.recordingControlsTimer = void 0);
  }
  isCurrentRecording(e, t) {
    return this.acceptsMediaEvent() && this.mode === "last_recording" && t === this.lifecycle.current() && e.isConnected && e === this.renderRoot.querySelector(".video-fallback");
  }
  async playRecording(e, t) {
    try {
      await e.play();
    } catch {
      if (!this.isCurrentRecording(e, t)) return;
      this.lifecycle.clearTimeout(), this.recordingPaused = !0, this.recordingControlsVisible = !0, e.controls = !0, this.mediaStatus = "ready", this.statusAnnouncement = s(
        this.hass,
        this.recordingMuted ? "viewer.recording_manual_playback" : "viewer.recording_audio_blocked"
      );
      return;
    }
    this.isCurrentRecording(e, t) && this.handleMediaReady();
  }
  waitForLiveResume() {
    this.cancelTalkPress(), this.clearAutomaticLiveRecovery(), this.lifecycle.dispose(), this.releaseInlineLive(), this.session = this.lifecycle.current(), this.automaticLiveRetry = !1, this.mediaStatus = "awaiting-resume", this.talkbackReady = !1, this.talkbackRequesting = !1, this.talkbackTalking = !1, this.statusAnnouncement = s(this.hass, "viewer.resume_live");
  }
  prepareAutomaticLiveResume() {
    this.waitForLiveResume(), this.automaticLiveRecovery = "waiting", this.tryAutomaticLiveResume();
  }
  clearAutomaticLiveRecovery() {
    this.automaticLiveRecovery = void 0, this.recoveryConnection?.removeEventListener?.("ready", this.handleRecoveryConnectionReady), this.recoveryConnection = void 0;
  }
  failMedia() {
    if (this.cancelTalkPress(), this.automaticLiveRecovery === "attempting") {
      this.waitForLiveResume();
      return;
    }
    if (this.automaticLiveRetry && this.mode === "live" && this.retryCount < 1) {
      this.retryCount += 1, this.scheduleLiveReconnect(kn);
      return;
    }
    this.lifecycle.dispose(), this.releaseInlineLive(), this.session = this.lifecycle.current(), this.mediaStatus = "error", this.statusAnnouncement = this.mode === "live" ? s(this.hass, "viewer.live_failed") : s(this.hass, "viewer.recording_unavailable");
  }
  scheduleLiveReconnect(e) {
    this.lifecycle.dispose(), this.session = this.lifecycle.current(), this.mediaStatus = "retrying", this.statusAnnouncement = s(this.hass, "viewer.retrying_live"), this.lifecycle.scheduleTimeout(() => this.startMedia(), e);
  }
  activeEntityId() {
    return this.mode === "live" ? this.config.live_entity : this.config.recording_entity;
  }
  activePosterEntityId() {
    return this.mode === "last_recording" ? Wt(this.hass, this.config) : this.activeEntityId();
  }
  activeEntity() {
    return this.hass?.states[this.activeEntityId()];
  }
  dialogTitle() {
    return this.config?.name ? this.config.name : x(
      this.hass?.states[this.config.recording_entity],
      s(this.hass, "common.camera")
    );
  }
  focusableElements() {
    const e = 'button:not([disabled]), [href], video[controls], [tabindex]:not([tabindex="-1"])';
    return Array.from(
      this.renderRoot.querySelectorAll(
        `${e}, ring-view-ring-webrtc-player`
      )
    ).flatMap(
      (t) => t.localName === "ring-view-ring-webrtc-player" ? t.classList.contains("pending") ? [] : Array.from(t.shadowRoot?.querySelectorAll(e) ?? []) : [t]
    ).filter((t) => t.offsetParent !== null);
  }
  focusInitialControl() {
    this.inline || this.renderRoot.querySelector(".close")?.focus();
  }
  attachGlobalListeners() {
    document.addEventListener("visibilitychange", this.handleVisibilityChange), window.addEventListener("pagehide", this.handlePageHide), window.addEventListener("pageshow", this.handlePageShow), window.addEventListener("blur", this.handleWindowBlur);
  }
  detachGlobalListeners() {
    document.removeEventListener("visibilitychange", this.handleVisibilityChange), window.removeEventListener("pagehide", this.handlePageHide), window.removeEventListener("pageshow", this.handlePageShow), window.removeEventListener("blur", this.handleWindowBlur);
  }
  updateInlineActivity() {
    const e = !!(this.inlineVisible && document.visibilityState !== "hidden" && !this.pageUnloading);
    if (e !== this.inlineActive && (this.inlineActive = e, !(!this.inline || !this.open))) {
      if (!e) {
        this.suspendInline();
        return;
      }
      this.suspended = !1, this.inlineStarted && this.startMedia();
    }
  }
  suspendInline() {
    this.inlineActive = !1, !(!this.inline || !this.open) && (this.resetVisitorActions(), this.clearAutomaticLiveRecovery(), this.cancelRecordingPreparation(!0), this.lifecycle.dispose(), this.releaseInlineLive(), this.session = this.lifecycle.current(), this.suspended = !0, this.mediaStatus = "idle");
  }
  detectDoorbellEvent(e) {
    const t = this.config?.doorbell_entity;
    if (!t || !this.hass) return;
    const i = this.hass.states[t], r = e?.states[t] ?? this.lastDoorbellEntity;
    this.lastDoorbellEntity = i, ti(t, r, i) && this.setRingingUntil(Date.now() + ue);
  }
  setRingingUntil(e) {
    this.ringAlertTimer !== void 0 && (window.clearTimeout(this.ringAlertTimer), this.ringAlertTimer = void 0);
    const t = e === void 0 ? 0 : e - Date.now();
    if (this.ringingUntil = t > 0 ? e : void 0, this.ringing = t > 0, !this.ringing) {
      this.syncUrl();
      return;
    }
    this.ringAlertTimer = window.setTimeout(() => {
      this.ringing = !1, this.ringingUntil = void 0, this.ringAlertTimer = void 0, this.syncUrl();
    }, t);
  }
  syncUrl() {
    if (this.inline || !this.open || !this.config || !this.returnUrl) return;
    const e = qr(this.returnUrl, {
      liveEntity: this.config.live_entity,
      recordingEntity: this.config.recording_entity,
      mode: this.mode,
      ringingUntil: this.ringingUntil
    });
    Ie(e, e);
  }
  finishClose(e = !0, t = !0) {
    if (!this.open) return;
    const i = this.inline;
    this.clearAutomaticLiveRecovery();
    const r = this.opener, n = this.returnUrl, o = this.config;
    this.renderRoot.querySelector("ring-view-ring-webrtc-player")?.stopTalking(), this.lifecycle.dispose(), this.releaseInlineLive(), this.session = this.lifecycle.current(), this.mediaStatus = "idle", this.open = !1, Kr(this), this.suspended = !1, this.resetMediaAttempt(), this.automaticLiveRetry = !0, this.recordingStarted = !0, this.statusAnnouncement = "", this.resetVisitorActions(), this.resetSnapshotAction(), this.setRingingUntil(), this.lastDoorbellEntity = void 0, this.detachGlobalListeners(), document.fullscreenElement && document.exitFullscreen().catch(() => {
    }), t && n && o && De(Pe(), o) && Ie(n, null), i || this.dispatchEvent(
      new CustomEvent("viewer-closed", { bubbles: !0, composed: !0 })
    ), t && this.dispatchEvent(
      new CustomEvent("dialog-closed", {
        detail: { dialog: Xe },
        bubbles: !0,
        composed: !0
      })
    ), this.config = void 0, this.returnUrl = void 0, this.inlineStarted = !0, e && r?.isConnected && r.focus(), this.opener = void 0;
  }
  icon(e) {
    return h`<svg viewBox="0 0 24 24" aria-hidden="true"><path d=${e}></path></svg>`;
  }
  claimInlineLive(e = !1) {
    const t = this.config?.live_entity;
    if (!this.inline || !t) return !0;
    const i = de.get(t);
    if (i && i !== this) {
      if (!e) return !1;
      i.pauseForInlineTakeover();
    }
    return de.set(t, this), !0;
  }
  releaseInlineLive() {
    const e = this.config?.live_entity;
    e && de.get(e) === this && de.delete(e);
  }
  pauseForInlineTakeover() {
    !this.inline || !this.open || this.mode !== "live" || (this.resetVisitorActions(), this.clearAutomaticLiveRecovery(), this.lifecycle.dispose(), this.releaseInlineLive(), this.session = this.lifecycle.current(), this.automaticLiveRetry = !1, this.mediaStatus = "awaiting-resume", this.statusAnnouncement = s(this.hass, "viewer.resume_live"));
  }
};
f.styles = Jr;
m([
  _({ attribute: !1 })
], f.prototype, "hass", 2);
m([
  _({ attribute: !1 })
], f.prototype, "config", 2);
m([
  _({ type: Boolean, reflect: !0 })
], f.prototype, "open", 2);
m([
  _({ type: Boolean, reflect: !0 })
], f.prototype, "inline", 2);
m([
  g()
], f.prototype, "ringing", 2);
m([
  g()
], f.prototype, "mode", 2);
m([
  g()
], f.prototype, "mediaStatus", 2);
m([
  g()
], f.prototype, "session", 2);
m([
  g()
], f.prototype, "suspended", 2);
m([
  g()
], f.prototype, "recordingMuted", 2);
m([
  g()
], f.prototype, "recordingStarted", 2);
m([
  g()
], f.prototype, "recordingControlsVisible", 2);
m([
  g()
], f.prototype, "recordingEnded", 2);
m([
  g()
], f.prototype, "liveMuted", 2);
m([
  g()
], f.prototype, "liveHasAudio", 2);
m([
  g()
], f.prototype, "recordingVideoFailed", 2);
m([
  g()
], f.prototype, "recordingPreparationActive", 2);
m([
  g()
], f.prototype, "recordingFailureDetail", 2);
m([
  g()
], f.prototype, "retryCount", 2);
m([
  g()
], f.prototype, "statusAnnouncement", 2);
m([
  g()
], f.prototype, "talkbackReady", 2);
m([
  g()
], f.prototype, "talkbackRequesting", 2);
m([
  g()
], f.prototype, "talkbackTalking", 2);
m([
  g()
], f.prototype, "doorActionStatus", 2);
m([
  g()
], f.prototype, "snapshotActionStatus", 2);
m([
  g()
], f.prototype, "snapshotFeedbackMessage", 2);
m([
  g()
], f.prototype, "viewerFeedback", 2);
m([
  g()
], f.prototype, "inlineStarted", 2);
m([
  g()
], f.prototype, "autoAspectRatio", 2);
f = m([
  G(Xe)
], f);
const de = /* @__PURE__ */ new Map(), Pn = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get RingViewDialog() {
    return f;
  }
}, Symbol.toStringTag, { value: "Module" }));
var Dn = Object.defineProperty, In = Object.getOwnPropertyDescriptor, L = (e, t, i, r) => {
  for (var n = r > 1 ? void 0 : r ? In(t, i) : t, o = e.length - 1, a; o >= 0; o--)
    (a = e[o]) && (n = (r ? a(t, i, n) : a(n)) || n);
  return r && n && Dn(t, i, n), n;
};
const Vn = 1e4, Un = 640, Hn = 16 / 9, xt = 16, On = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(
  Ii
)}`;
let $ = class extends M {
  constructor() {
    super(...arguments), this.preview = !1, this.intrinsicGridHeight = !1, this.previewFailed = !1, this.ringAlertVisible = !1, this.previewIntersecting = !1, this.previewVisible = !1, this.previewRequestId = 0, this.lastRingAlertAt = 0, this.previewMarkersInitialized = !1, this.inlinePausedForViewer = !1, this.refreshActivityLabel = () => {
      this.requestUpdate();
    }, this.openViewer = () => {
      if (this.preview || this.isInCardPicker()) return;
      this.updateRingAlert();
      const e = this.renderRoot.querySelector(".preview") ?? void 0;
      $e(e ?? this, {
        config: this.config,
        mode: this.ringAlertVisible ? "live" : ae(this.config),
        opener: e,
        ringingUntil: this.ringAlertVisible ? this.lastRingAlertAt + ue : void 0
      });
    }, this.openExpandedViewer = (e) => {
      if (!this.config) return;
      e.stopPropagation();
      const t = e.currentTarget;
      t.stopInline(), this.inlinePausedForViewer = !0, $e(t, {
        config: this.config,
        mode: e.detail.mode,
        opener: t,
        ringingUntil: e.detail.ringingUntil
      });
    }, this.handleViewerClosed = () => {
      this.inlinePausedForViewer && (this.inlinePausedForViewer = !1, this.updateComplete.then(() => this.initializeInlineViewer()));
    }, this.handleKeyDown = (e) => {
      e.key !== "Enter" && e.key !== " " || (e.preventDefault(), this.openViewer());
    }, this.handlePreviewError = () => {
      this.previewFailed = !0;
    }, this.handlePreviewLoad = (e) => {
      !(e.currentTarget instanceof HTMLImageElement) || e.currentTarget.dataset.entityId !== this.previewEntityId() || this.applyAutoAspectRatio(q(e.currentTarget));
    }, this.handleInlineAspectRatio = (e) => {
      e.currentTarget === this.renderRoot.querySelector("ring-view-dialog[inline]") && this.applyAutoAspectRatio(e.detail.aspectRatio);
    }, this.handleDocumentVisibility = () => {
      this.updatePreviewVisibility();
    };
  }
  static async getConfigElement() {
    return await Promise.resolve().then(() => Kn), document.createElement("ring-view-editor");
  }
  static getStubConfig(e) {
    const t = Object.keys(e?.states ?? {}).filter((d) => d.startsWith("camera.")), i = t.find(
      (d) => (Number(e?.states[d]?.attributes.supported_features ?? 0) & 2) !== 0
    ) ?? t.find((d) => /live(_view)?$/i.test(d)) ?? t[1] ?? "camera.live_view", r = t.find(
      (d) => d !== i && e?.entities?.[d]?.platform === "ring" && (Number(e.states[d]?.attributes.supported_features ?? 0) & 2) === 0
    ), n = Object.keys(e?.states ?? {}).find(
      (d) => e ? X(e, d) : !1
    ), o = r ?? n ?? t.find(
      (d) => d !== i && (Number(e?.states[d]?.attributes.supported_features ?? 0) & 2) === 0
    ) ?? t.find((d) => d !== i) ?? t[0] ?? "camera.latest_recording", a = e && o === n ? Ar(e, o) : void 0;
    return {
      type: Ge,
      recording_entity: o,
      live_entity: i,
      ...a ? { snapshot_entity: a } : {},
      grid_options: { rows: "auto" }
    };
  }
  setConfig(e) {
    const t = Me(e);
    this.intrinsicGridHeight = t.grid_options?.rows === "auto" || t.grid_options?.rows === void 0 && t.aspect_ratio === "auto", t.aspect_ratio !== this.config?.aspect_ratio && (this.autoAspectRatio = void 0), (t.recording_entity !== this.config?.recording_entity || t.snapshot_entity !== this.config?.snapshot_entity) && (this.previewMarkersInitialized = !1, this.recordingMarker = void 0, this.snapshotTimestamp = void 0, this.latestObservedPreviewSource = void 0), this.config = t;
  }
  getCardSize() {
    return 3;
  }
  getGridOptions() {
    const e = this.config?.grid_options, t = e?.rows === "auto" || e?.rows === void 0 && this.config?.aspect_ratio === "auto", i = {
      ...e,
      columns: e?.columns === "full" ? "full" : Math.max(12, e?.columns ?? 12),
      min_columns: 12,
      ...e?.max_columns !== void 0 ? { max_columns: Math.max(12, e.max_columns) } : {}
    };
    return t ? (e?.rows === void 0 && delete i.rows, e?.min_rows === void 0 ? delete i.min_rows : i.min_rows = Math.max(3, e.min_rows), e?.max_rows !== void 0 && (i.max_rows = Math.max(3, e.max_rows)), i) : (i.rows = Math.max(
      3,
      typeof e?.rows == "number" ? e.rows : 3
    ), i.min_rows = Math.max(3, e?.min_rows ?? 3), e?.max_rows !== void 0 && (i.max_rows = Math.max(3, e.max_rows)), i);
  }
  connectedCallback() {
    super.connectedCallback(), document.addEventListener("viewer-closed", this.handleViewerClosed), this.updateRingAlert(), this.updateComplete.then(() => {
      !this.isConnected || this.isInCardPicker() || (this.setupPreviewLifecycle(), this.initializeInlineViewer());
    });
  }
  disconnectedCallback() {
    document.removeEventListener("viewer-closed", this.handleViewerClosed), this.teardownPreviewLifecycle(), this.clearRingAlertTimer(), this.restoreViewerTimer !== void 0 && (window.clearTimeout(this.restoreViewerTimer), this.restoreViewerTimer = void 0), super.disconnectedCallback();
  }
  shouldUpdate(e) {
    for (const i of e.keys())
      if (i !== "hass") return !0;
    if (!e.has("hass") || !this.hass || !this.config) return !1;
    const t = e.get("hass");
    return t ? t.language !== this.hass.language || t.locale?.language !== this.hass.locale?.language || t.states[this.config.recording_entity] !== this.hass.states[this.config.recording_entity] || t.states[this.config.live_entity] !== this.hass.states[this.config.live_entity] || this.config.snapshot_entity !== void 0 && t.states[this.config.snapshot_entity] !== this.hass.states[this.config.snapshot_entity] || this.config.last_activity_entity !== void 0 && z(t, this.config.last_activity_entity) !== z(this.hass, this.config.last_activity_entity) || this.config.doorbell_entity !== void 0 && t.states[this.config.doorbell_entity] !== this.hass.states[this.config.doorbell_entity] || this.config.door_entity !== void 0 && t.states[this.config.door_entity] !== this.hass.states[this.config.door_entity] || this.config.door_contact_entity !== void 0 && t.states[this.config.door_contact_entity] !== this.hass.states[this.config.door_contact_entity] : !0;
  }
  willUpdate(e) {
    if (!this.hass || !this.config || (this.observePreviewMedia(), e.has("hass") && this.detectDoorbellEvent(e.get("hass")), this.isInCardPicker())) return;
    const t = this.previewEntityId(), i = Yt(this.hass, this.hass.states[t], t);
    (t !== this.activePreviewEntityId || i !== this.lastFallbackPoster) && (this.activePreviewEntityId = t, this.lastFallbackPoster = i, this.lastPoster = i, this.lastPreviewSize = void 0, this.previewRequestId += 1, this.previewFailed = !1, this.autoAspectRatio = void 0);
  }
  updated(e) {
    const t = e.has("config");
    (t || e.has("preview")) && !this.isInCardPicker() && (this.teardownPreviewLifecycle(), this.setupPreviewLifecycle()), !this.isInCardPicker() && this.config?.dashboard_behavior === "open_viewer" && (e.has("hass") || t) && this.previewVisible && this.refreshPreview(!0), !this.isInCardPicker() && this.hass && this.config && this.scheduleViewerRestore(), t && this.config?.aspect_ratio === "auto" && this.readPreviewAspectRatio(), !this.isInCardPicker() && !this.preview && this.config?.dashboard_behavior === "interactive" && this.initializeInlineViewer();
  }
  render() {
    if (!this.hass || !this.config) return l;
    const e = this.previewEntityId(), t = this.hass.states[e], i = this.config.name || x(
      this.hass.states[this.config.recording_entity],
      s(this.hass, "common.camera")
    ), r = this.ringAlertVisible ? "live" : ae(this.config), n = this.isInCardPicker(), o = n || this.preview, a = n ? !1 : y(t), d = {
      "--ring-view-aspect-ratio": Zt(
        this.config.aspect_ratio,
        this.autoAspectRatio
      ),
      "--ring-view-fit-mode": this.config.fit_mode
    };
    if (this.config.dashboard_behavior === "interactive" && !o)
      return h`
        <ha-card class="interactive">
          <div class="inline-shell" style=${xe(d)}>
            <ring-view-dialog
              inline
              .hass=${this.hass}
              @ring-view-expand=${this.openExpandedViewer}
              @ring-view-media-aspect-ratio=${this.handleInlineAspectRatio}
            ></ring-view-dialog>
          </div>
        </ha-card>
      `;
    const c = !o, p = this.config.last_activity_entity ? z(this.hass, this.config.last_activity_entity) : void 0, u = p === void 0 ? void 0 : Kt(this.hass, p), v = c ? s(this.hass, "card.open_viewer", {
      name: i,
      mode: Qr(r, this.hass)
    }) : s(this.hass, "card.preview_alt", { name: i }), b = u ? `${v}. ${u.accessible}.` : v;
    return h`
      <ha-card class=${o ? "safe-preview" : l}>
        <div
          class="preview"
          style=${xe(d)}
          role=${c ? "button" : "img"}
          tabindex=${c ? "0" : l}
          aria-label=${b}
          title=${c ? s(
      this.hass,
      r === "live" ? "card.open_live" : "card.open_recording"
    ) : l}
          @click=${c ? this.openViewer : void 0}
          @keydown=${c ? this.handleKeyDown : void 0}
        >
          ${!a && !this.previewFailed ? h`
                <img
                  data-entity-id=${e}
                  src=${n ? On : this.lastPoster ?? ""}
                  alt=${s(this.hass, "card.preview_alt", { name: i })}
                  @load=${this.handlePreviewLoad}
                  @error=${this.handlePreviewError}
                />
              ` : h`<div class="placeholder">
                ${s(this.hass, "card.preview_unavailable")}
              </div>`}
          ${this.config.show_name || u ? h`
                <div class="header-copy">
                  ${this.config.show_name ? h`<div class="name">${i}</div>` : l}
                  ${u ? h`
                        <ring-view-activity-time
                          aria-hidden="true"
                          .hass=${this.hass}
                          .entityId=${this.config.last_activity_entity}
                          @ring-view-activity-tick=${this.refreshActivityLabel}
                        ></ring-view-activity-time>
                      ` : l}
                </div>
              ` : l}
          ${this.ringAlertVisible ? h`<div class="ring-alert" role="status">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d=${Et}></path>
                </svg>
                <span>${s(this.hass, "ring.alert")}</span>
              </div>` : l}
        </div>
      </ha-card>
    `;
  }
  previewEntityId() {
    return mr(
      this.hass,
      this.config,
      ae(this.config),
      this.latestObservedPreviewSource
    );
  }
  observePreviewMedia() {
    const e = gr(
      this.hass?.states[this.config.recording_entity]
    ), t = fe(
      this.config.snapshot_entity ? this.hass?.states[this.config.snapshot_entity] : void 0
    );
    if (!this.previewMarkersInitialized) {
      this.previewMarkersInitialized = !0, this.recordingMarker = e, this.snapshotTimestamp = t;
      return;
    }
    const i = e !== void 0 && e !== this.recordingMarker, r = t !== void 0 && t !== this.snapshotTimestamp;
    i !== r ? this.latestObservedPreviewSource = i ? "last_recording" : "snapshot" : i && (this.latestObservedPreviewSource = void 0), this.recordingMarker = e, this.snapshotTimestamp = t;
  }
  initializeInlineViewer() {
    if (!this.hass || !this.config || this.inlinePausedForViewer) return;
    const e = this.renderRoot.querySelector(
      "ring-view-dialog[inline]"
    );
    e && (e.hass = this.hass, e.showInline({
      config: this.config,
      mode: ae(this.config),
      start: this.config.dashboard_start,
      ringingUntil: this.ringAlertVisible ? this.lastRingAlertAt + ue : void 0
    }), e.setInlineVisible(this.previewVisible));
  }
  scheduleViewerRestore() {
    if (this.restoreViewerTimer !== void 0 || !this.config) return;
    const e = Pe();
    De(e, this.config) && (this.restoreViewerTimer = window.setTimeout(() => {
      if (this.restoreViewerTimer = void 0, !this.isConnected || !this.hass || !this.config) return;
      const t = Pe();
      if (!De(t, this.config)) return;
      const i = this.renderRoot.querySelector(".preview") ?? void 0;
      this.config.dashboard_behavior === "interactive" && (this.renderRoot.querySelector("ring-view-dialog[inline]")?.stopInline(), this.inlinePausedForViewer = !0), $e(i ?? this, {
        config: this.config,
        mode: t.mode,
        opener: i,
        restored: !0,
        ringingUntil: t.ringingUntil !== void 0 && t.ringingUntil > Date.now() ? t.ringingUntil : void 0
      });
    }, 0));
  }
  detectDoorbellEvent(e) {
    const t = this.config?.doorbell_entity;
    if (!t || !this.hass) return;
    const i = e?.states[t], r = this.hass.states[t];
    if (!ti(t, i, r)) return;
    const n = Date.now();
    this.lastRingAlertAt = n, this.updateRingAlert();
  }
  updateRingAlert() {
    this.clearRingAlertTimer();
    const e = this.lastRingAlertAt + ue - Date.now();
    this.ringAlertVisible = this.lastRingAlertAt > 0 && e > 0, this.ringAlertVisible && this.isConnected && (this.ringAlertTimer = window.setTimeout(() => this.updateRingAlert(), e));
  }
  clearRingAlertTimer() {
    this.ringAlertTimer !== void 0 && (window.clearTimeout(this.ringAlertTimer), this.ringAlertTimer = void 0);
  }
  readPreviewAspectRatio() {
    const e = this.renderRoot.querySelector(".preview > img");
    e?.complete && this.applyAutoAspectRatio(q(e));
  }
  applyAutoAspectRatio(e) {
    this.config?.aspect_ratio !== "auto" || Se(this.autoAspectRatio, e) || (this.autoAspectRatio = e);
  }
  setupPreviewLifecycle() {
    if (this.isInCardPicker() || this.previewIntersectionObserver || this.previewResizeObserver) return;
    const e = this.renderRoot.querySelector(
      ".preview, .inline-shell"
    );
    e && (typeof IntersectionObserver > "u" ? this.previewIntersecting = !0 : (this.previewIntersectionObserver = new IntersectionObserver((t) => {
      const i = t[t.length - 1];
      i && (this.previewIntersecting = i.isIntersecting || i.intersectionRatio > 0, this.updatePreviewVisibility());
    }), this.previewIntersectionObserver.observe(e)), typeof ResizeObserver < "u" && (this.previewResizeObserver = new ResizeObserver(() => {
      !this.previewVisible || this.previewResizeFrame !== void 0 || (this.previewResizeFrame = window.requestAnimationFrame(() => {
        this.previewResizeFrame = void 0, this.refreshPreview(!1);
      }));
    }), this.previewResizeObserver.observe(e)), document.addEventListener("visibilitychange", this.handleDocumentVisibility), this.updatePreviewVisibility());
  }
  teardownPreviewLifecycle() {
    this.renderRoot.querySelector("ring-view-dialog[inline]")?.setInlineVisible(!1), this.previewIntersectionObserver?.disconnect(), this.previewResizeObserver?.disconnect(), this.previewIntersectionObserver = void 0, this.previewResizeObserver = void 0, document.removeEventListener("visibilitychange", this.handleDocumentVisibility), this.stopPreviewRefreshTimer(), this.previewResizeFrame !== void 0 && (window.cancelAnimationFrame(this.previewResizeFrame), this.previewResizeFrame = void 0), this.previewVisible = !1, this.previewIntersecting = !1, this.previewRequestId += 1;
  }
  updatePreviewVisibility() {
    if (this.isInCardPicker()) return;
    const e = this.previewIntersecting && document.visibilityState !== "hidden";
    if (e !== this.previewVisible) {
      if (this.previewVisible = e, this.config?.dashboard_behavior === "interactive" && !this.preview) {
        this.stopPreviewRefreshTimer(), this.renderRoot.querySelector("ring-view-dialog[inline]")?.setInlineVisible(e);
        return;
      }
      if (e) {
        this.refreshPreview(!0), this.previewRefreshTimer = window.setInterval(() => {
          this.refreshPreview(!0);
        }, Vn);
        return;
      }
      this.stopPreviewRefreshTimer(), this.previewRequestId += 1;
    }
  }
  stopPreviewRefreshTimer() {
    this.previewRefreshTimer !== void 0 && (window.clearInterval(this.previewRefreshTimer), this.previewRefreshTimer = void 0);
  }
  async refreshPreview(e) {
    if (this.isInCardPicker() || !this.previewVisible || !this.hass || !this.config) return;
    const t = this.renderRoot.querySelector(".preview");
    if (!t) return;
    const i = Math.max(1, window.devicePixelRatio || 1), r = t.clientWidth || t.getBoundingClientRect().width, n = r > 0 ? r : Un, o = t.clientHeight || t.getBoundingClientRect().height, a = Le(this.config.aspect_ratio) ?? Hn, d = o > 0 ? o : n / a, c = Math.ceil(n * i), p = Math.ceil(d * i);
    if (!e && this.lastPreviewSize && Math.abs(c - this.lastPreviewSize.width) < xt && Math.abs(p - this.lastPreviewSize.height) < xt)
      return;
    this.lastPreviewSize = { width: c, height: p };
    const u = this.previewEntityId(), v = this.hass, b = ++this.previewRequestId;
    try {
      const k = this.config.aspect_ratio === "auto" ? await Gr(v, u, c) : await Zr(v, u, c, p);
      if (b !== this.previewRequestId || !this.isConnected || !this.previewVisible || this.previewEntityId() !== u)
        return;
      this.lastPoster = k, this.previewFailed = !1;
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
    let e = this.parentNode ?? this.getRootNode();
    for (; e; ) {
      if (e instanceof Element && e.localName === "hui-card-picker") return !0;
      e = e instanceof ShadowRoot ? e.host : e.parentNode;
    }
    return !1;
  }
};
$.styles = Yr;
L([
  _({ attribute: !1 })
], $.prototype, "hass", 2);
L([
  _({ reflect: !0 })
], $.prototype, "layout", 2);
L([
  _({ type: Boolean })
], $.prototype, "preview", 2);
L([
  _({
    type: Boolean,
    reflect: !0,
    attribute: "intrinsic-grid-height"
  })
], $.prototype, "intrinsicGridHeight", 2);
L([
  g()
], $.prototype, "config", 2);
L([
  g()
], $.prototype, "previewFailed", 2);
L([
  g()
], $.prototype, "lastPoster", 2);
L([
  g()
], $.prototype, "autoAspectRatio", 2);
L([
  g()
], $.prototype, "ringAlertVisible", 2);
$ = L([
  G(Ce)
], $);
window.customCards = window.customCards || [];
window.customCards.some((e) => e.type === Ce) || window.customCards.push({
  type: Ce,
  name: xr,
  description: s(void 0, "card.description"),
  preview: !0,
  getEntitySuggestion: (e, t) => {
    if (!t.startsWith("camera.")) return null;
    const i = Object.keys(e.states).find(
      (r) => r !== t && r.startsWith("camera.") && /live(_view)?$/i.test(r)
    );
    return i ? {
      config: {
        type: Ge,
        recording_entity: t,
        live_entity: i
      }
    } : null;
  }
});
var zn = Object.defineProperty, Fn = Object.getOwnPropertyDescriptor, se = (e, t, i, r) => {
  for (var n = r > 1 ? void 0 : r ? Fn(t, i) : t, o = e.length - 1, a; o >= 0; o--)
    (a = e[o]) && (n = (r ? a(t, i, n) : a(n)) || n);
  return r && n && zn(t, i, n), n;
};
function Nn(e, t) {
  const i = [
    {
      name: "dashboard_behavior",
      required: !0,
      selector: {
        select: {
          mode: "dropdown",
          options: [
            {
              value: "open_viewer",
              label: s(e, "editor.dashboard_behavior_viewer")
            },
            {
              value: "interactive",
              label: s(e, "editor.dashboard_behavior_interactive")
            }
          ]
        }
      }
    }
  ];
  t.dashboard_behavior === "interactive" ? i.push(
    {
      name: "dashboard_start",
      required: !0,
      selector: {
        select: {
          mode: "dropdown",
          options: [
            {
              value: "on_demand",
              label: s(e, "editor.dashboard_start_on_demand")
            },
            {
              value: "last_recording",
              label: s(e, "common.last_recording")
            },
            { value: "live", label: s(e, "common.live") }
          ]
        }
      }
    },
    { name: "dashboard_recording_muted", selector: { boolean: {} } },
    { name: "dashboard_live_muted", selector: { boolean: {} } }
  ) : i.push(
    {
      name: "preview_source",
      required: !0,
      selector: {
        select: {
          mode: "dropdown",
          options: [
            {
              value: "last_recording",
              label: s(e, "editor.preview_recording")
            },
            {
              value: "live",
              label: s(e, "editor.preview_live")
            },
            {
              value: "default",
              label: s(e, "editor.preview_default")
            },
            {
              value: "snapshot",
              label: s(e, "editor.preview_snapshot")
            },
            {
              value: "newest",
              label: s(e, "editor.preview_newest")
            }
          ]
        }
      }
    }
  ), t.dashboard_behavior === "open_viewer" && t.preview_source === "newest" && i.push({
    name: "preview_fallback",
    required: !0,
    selector: {
      select: {
        mode: "dropdown",
        options: [
          {
            value: "last_recording",
            label: s(e, "editor.fallback_recording")
          },
          {
            value: "snapshot",
            label: s(e, "editor.fallback_snapshot")
          }
        ]
      }
    }
  });
  const r = [
    {
      name: "door_entity",
      selector: { entity: { domain: "lock" } }
    }
  ];
  return t.door_entity && (r.push(
    {
      name: "door_contact_entity",
      selector: { entity: { domain: "binary_sensor" } }
    },
    {
      name: "door_action",
      required: !0,
      selector: {
        select: {
          mode: "dropdown",
          options: [
            {
              value: "unlock",
              label: s(e, "editor.door_action_unlock")
            },
            {
              value: "open",
              label: s(e, "editor.door_action_open")
            }
          ]
        }
      }
    },
    {
      name: "door_control_visibility",
      required: !0,
      selector: {
        select: {
          mode: "dropdown",
          options: [
            {
              value: "live_only",
              label: s(e, "editor.door_visibility_live")
            },
            {
              value: "all_views",
              label: s(e, "editor.door_visibility_all")
            }
          ]
        }
      }
    }
  ), r.push({
    name: "door_hold_to_activate",
    selector: { boolean: {} }
  }), t.dashboard_behavior === "interactive" && r.push({
    name: "door_control_location",
    required: !0,
    selector: {
      select: {
        mode: "dropdown",
        options: [
          {
            value: "viewer_only",
            label: s(e, "editor.door_location_viewer")
          },
          {
            value: "dashboard_and_viewer",
            label: s(e, "editor.door_location_dashboard")
          }
        ]
      }
    }
  })), [
    {
      name: "recording_entity",
      required: !0,
      selector: {
        entity: {
          filter: [{ domain: "camera" }, { domain: "select" }]
        }
      }
    },
    ...X(e, t.recording_entity) ? [{
      name: "recording_selection",
      required: !0,
      selector: {
        select: {
          mode: "dropdown",
          options: [
            {
              value: "newest",
              label: s(e, "editor.recording_selection_newest")
            },
            {
              value: "selected",
              label: s(e, "editor.recording_selection_selected")
            }
          ]
        }
      }
    }] : [],
    {
      name: "live_entity",
      required: !0,
      selector: { entity: { domain: "camera" } }
    },
    {
      name: "dashboard_preview",
      type: "expandable",
      flatten: !0,
      iconPath: ii,
      schema: i
    },
    {
      name: "viewer_behavior",
      type: "expandable",
      flatten: !0,
      iconPath: ci,
      schema: [
        {
          name: "default_mode",
          selector: {
            select: {
              mode: "dropdown",
              options: [
                {
                  value: "last_recording",
                  label: s(e, "common.last_recording")
                },
                { value: "live", label: s(e, "common.live") }
              ]
            }
          }
        },
        { name: "remember_last_mode", selector: { boolean: {} } },
        { name: "autoplay_recording", selector: { boolean: {} } },
        { name: "recording_muted", selector: { boolean: {} } },
        { name: "live_muted", selector: { boolean: {} } },
        { name: "two_way_audio", selector: { boolean: {} } }
      ]
    },
    {
      name: "snapshots",
      type: "expandable",
      flatten: !0,
      iconPath: Ct,
      schema: [
        {
          name: "snapshot_entity",
          required: t.dashboard_behavior === "open_viewer" && ["snapshot", "newest"].includes(t.preview_source),
          selector: { entity: { domain: "camera" } }
        },
        { name: "show_snapshot_button", selector: { boolean: {} } },
        ...t.show_snapshot_button ? [{
          name: "snapshot_directory",
          required: !0,
          selector: { text: {} }
        }] : []
      ]
    },
    {
      name: "doorbell_features",
      type: "expandable",
      flatten: !0,
      iconPath: oi,
      schema: [
        {
          name: "doorbell_entity",
          selector: {
            entity: {
              filter: [
                { domain: "event", device_class: "doorbell" },
                { domain: "binary_sensor" }
              ]
            }
          }
        }
      ]
    },
    {
      name: "door_access",
      type: "expandable",
      flatten: !0,
      iconPath: Mt,
      schema: r
    },
    {
      name: "card_appearance",
      type: "expandable",
      flatten: !0,
      iconPath: di,
      schema: [
        { name: "show_name", selector: { boolean: {} } },
        ...t.show_name ? [
          {
            name: "name",
            selector: { text: {} }
          }
        ] : [],
        {
          name: "last_activity_entity",
          selector: {
            entity: {
              filter: [
                { domain: "sensor" },
                { domain: "event" },
                { domain: "input_datetime" },
                { domain: "binary_sensor" }
              ]
            }
          }
        },
        { name: "show_action_button_labels", selector: { boolean: {} } },
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
                      value: "auto",
                      label: s(e, "editor.aspect_auto")
                    },
                    {
                      value: "16:9",
                      label: s(e, "editor.aspect_widescreen")
                    },
                    {
                      value: "4:3",
                      label: s(e, "editor.aspect_standard")
                    },
                    {
                      value: "1:1",
                      label: s(e, "editor.aspect_square")
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
                      value: "contain",
                      label: s(e, "editor.fit_contain")
                    },
                    {
                      value: "cover",
                      label: s(e, "editor.fit_cover")
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
const qn = {
  recording_entity: "editor.recording_entity",
  recording_selection: "editor.recording_selection",
  live_entity: "editor.live_entity",
  snapshot_entity: "editor.snapshot_entity",
  snapshots: "editor.snapshots",
  show_snapshot_button: "editor.show_snapshot_button",
  snapshot_directory: "editor.snapshot_directory",
  dashboard_preview: "editor.dashboard_preview",
  dashboard_behavior: "editor.dashboard_behavior",
  dashboard_start: "editor.dashboard_start",
  dashboard_recording_muted: "editor.dashboard_recording_muted",
  dashboard_live_muted: "editor.dashboard_live_muted",
  viewer_behavior: "editor.viewer_behavior",
  default_mode: "editor.default_mode",
  remember_last_mode: "editor.remember_last_mode",
  autoplay_recording: "editor.autoplay_recording",
  recording_muted: "editor.recording_muted",
  live_muted: "editor.live_muted",
  doorbell_features: "editor.doorbell_features",
  two_way_audio: "editor.two_way_audio",
  doorbell_entity: "editor.doorbell_entity",
  door_access: "editor.door_access",
  door_entity: "editor.door_entity",
  door_contact_entity: "editor.door_contact_entity",
  door_action: "editor.door_action",
  door_control_visibility: "editor.door_control_visibility",
  door_hold_to_activate: "editor.door_hold_to_activate",
  door_control_location: "editor.door_control_location",
  card_appearance: "editor.card_appearance",
  name: "editor.name",
  show_name: "editor.show_name",
  last_activity_entity: "editor.last_activity_entity",
  show_action_button_labels: "editor.show_action_button_labels",
  preview_source: "editor.preview_source",
  preview_fallback: "editor.preview_fallback",
  aspect_ratio: "editor.aspect_ratio",
  fit_mode: "editor.fit_mode"
}, Bn = {
  recording_entity: "editor.helper_recording_entity",
  recording_selection: "editor.helper_recording_selection",
  live_entity: "editor.helper_live_entity",
  dashboard_behavior: "editor.helper_dashboard_behavior",
  dashboard_start: "editor.helper_dashboard_start",
  dashboard_recording_muted: "editor.helper_dashboard_recording_muted",
  dashboard_live_muted: "editor.helper_dashboard_live_muted",
  default_mode: "editor.helper_default_mode",
  remember_last_mode: "editor.helper_remember_last_mode",
  autoplay_recording: "editor.helper_autoplay_recording",
  recording_muted: "editor.helper_recording_muted",
  live_muted: "editor.helper_live_muted",
  two_way_audio: "editor.helper_two_way_audio",
  doorbell_entity: "editor.helper_doorbell_entity",
  door_entity: "editor.helper_door_entity",
  door_contact_entity: "editor.helper_door_contact_entity",
  door_action: "editor.helper_door_action",
  door_control_visibility: "editor.helper_door_control_visibility",
  door_hold_to_activate: "editor.helper_door_hold_to_activate",
  door_control_location: "editor.helper_door_control_location",
  show_name: "editor.helper_show_name",
  last_activity_entity: "editor.helper_last_activity_entity",
  show_action_button_labels: "editor.helper_show_action_button_labels",
  preview_source: "editor.helper_preview_source",
  snapshot_entity: "editor.helper_snapshot_entity",
  preview_fallback: "editor.helper_preview_fallback"
};
let U = class extends M {
  constructor() {
    super(...arguments), this.nativeChecked = !1, this.nativeAvailable = !1, this.computeLabel = (e) => {
      const t = qn[e.name];
      if (!t) return;
      const i = s(this.hass, t);
      if (e.required || ![
        "name",
        "snapshot_entity",
        "door_contact_entity",
        "last_activity_entity"
      ].includes(
        e.name
      )) return i;
      const r = qt(
        this.hass,
        "ui.panel.lovelace.editor.card.config.optional",
        "common.optional"
      );
      return `${i} (${r})`;
    }, this.computeHelper = (e) => {
      if (e.name === "snapshot_directory" && this.config) {
        const i = wr(this.config.snapshot_directory);
        return i === "public" ? s(this.hass, "editor.helper_snapshot_directory_public") : i === "custom" ? s(this.hass, "editor.helper_snapshot_directory_custom") : void 0;
      }
      const t = Bn[e.name];
      return t ? s(this.hass, t) : void 0;
    }, this.valueChanged = (e) => {
      if (!this.config) return;
      const t = Me({
        ...this.config,
        ...e.detail.value
      });
      this.config = t;
      const i = /* @__PURE__ */ new Set([
        "door_contact_entity",
        "door_action",
        "door_control_visibility",
        "door_hold_to_activate",
        "door_control_location"
      ]), r = Object.fromEntries(
        Object.entries(t).filter(
          ([n, o]) => o !== void 0 && (n !== "recording_selection" || t.recording_entity.startsWith("select.")) && (!!t.door_entity || !i.has(n))
        )
      );
      this.dispatchEvent(
        new CustomEvent("config-changed", {
          detail: { config: r },
          bubbles: !0,
          composed: !0
        })
      );
    };
  }
  setConfig(e) {
    this.config = Me(e);
  }
  connectedCallback() {
    super.connectedCallback(), ei().then((e) => {
      this.isConnected && (this.nativeAvailable = e, this.nativeChecked = !0);
    });
  }
  render() {
    if (!this.hass || !this.config) return l;
    const e = ur(this.hass, this.config).filter(
      (t) => t.kind !== "compatibility" || this.nativeChecked && !this.nativeAvailable
    );
    return h`
      ${e.length ? h`
            <div
              class="warnings"
              role="status"
              aria-label=${s(this.hass, "editor.warnings")}
            >
              ${e.map(
      (t) => h`
                  <ha-alert alert-type="warning">${t.message}</ha-alert>
                `
    )}
            </div>
          ` : l}
      <ha-form
        .hass=${this.hass}
        .data=${this.config}
        .schema=${Nn(this.hass, this.config)}
        .computeLabel=${this.computeLabel}
        .computeHelper=${this.computeHelper}
        @value-changed=${this.valueChanged}
      ></ha-form>
    `;
  }
};
U.styles = Xr;
se([
  _({ attribute: !1 })
], U.prototype, "hass", 2);
se([
  g()
], U.prototype, "config", 2);
se([
  g()
], U.prototype, "nativeChecked", 2);
se([
  g()
], U.prototype, "nativeAvailable", 2);
U = se([
  G("ring-view-editor")
], U);
const Kn = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get RingViewEditor() {
    return U;
  }
}, Symbol.toStringTag, { value: "Module" }));
export {
  $ as RingView
};
