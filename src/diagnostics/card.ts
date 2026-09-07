import { LitElement, css, html, nothing } from "lit";
import { customElement, state } from "lit/decorators.js";
import { version } from "../../package.json";
import { diagnosticReport, diagnosticsActive, diagnosticsHaveEvents, startDiagnostics, stopDiagnostics, subscribeDiagnostics } from "./recorder";

// Separate opt-in panel for the temporary prerelease; the viewer is untouched.
@customElement("ring-view-diagnostics")
export class RingViewDiagnostics extends LitElement {
  static styles = css`
    :host { display: block; }
    ha-card { display: block; padding: 20px; }
    h2 { font-size: 20px; margin: 0 0 8px; }
    p { line-height: 1.5; }
    small { color: var(--secondary-text-color); }
    .actions { display: flex; flex-wrap: wrap; gap: 12px; }
    button { min-height: 44px; padding: 8px 16px; font: inherit; border-radius: 10px;
      border: 1px solid var(--divider-color, #888); background: var(--card-background-color, white);
      color: var(--primary-text-color, #222); cursor: pointer; }
    button:focus-visible { outline: 2px solid var(--primary-color, #03a9f4); outline-offset: 2px; }
    textarea { width: 100%; box-sizing: border-box; min-height: 180px; margin-top: 12px;
      font-size: 16px; background: var(--card-background-color, white); color: var(--primary-text-color, #222); }
  `;
  @state() private report = "";
  @state() private message = "";
  private unsubscribe?: () => void;

  public setConfig(): void { /* This diagnostic panel has no entity configuration. */ }
  public getCardSize(): number { return 4; }
  public getGridOptions() { return { columns: 12, rows: "auto" }; }
  public connectedCallback(): void {
    super.connectedCallback();
    this.unsubscribe = subscribeDiagnostics(() => this.requestUpdate());
  }
  public disconnectedCallback(): void {
    this.unsubscribe?.();
    this.unsubscribe = undefined;
    // Do not end a test when HA rearranges cards; it stops after 2 minutes.
    super.disconnectedCallback();
  }
  protected render() {
    return html`<ha-card>
      <h2>Playback diagnostic</h2><small>Ring View ${version} · temporary test build</small>
      <p>Start the test, open the camera, select Last recording and tap the picture.
        Then close the viewer and copy the report here. Do not rotate or reload during this test.</p>
      <p>No recording links, camera names, credentials, images or audio are collected.
        Anonymous source fingerprints and link timing help match the failure.
        The report stays in this page until you copy it.</p>
      <div class="actions">
        <button @click=${this.start}>${diagnosticsActive() ? "Restart test" : "Start test"}</button>
        <button @click=${this.copy} ?disabled=${!diagnosticsHaveEvents()}>Copy report</button>
      </div>
      <p role="status">${this.message || (diagnosticsActive() ? "Test running (maximum 2 minutes)." : diagnosticsHaveEvents() ? "Test stopped. Copy the report before reloading this page." : "Ready. Start the test before opening the camera.")}</p>
      ${this.report ? html`<label>Diagnostic report
        <textarea readonly .value=${this.report} @focus=${(event: FocusEvent) => (event.target as HTMLTextAreaElement).select()}></textarea>
      </label>` : nothing}
    </ha-card>`;
  }
  private start = (): void => {
    this.report = "";
    this.message = "";
    startDiagnostics();
  };
  private copy = async (): Promise<void> => {
    stopDiagnostics();
    this.report = diagnosticReport();
    try {
      await navigator.clipboard.writeText(this.report);
      this.message = "Report copied. Paste it into our conversation.";
    } catch {
      this.message = "Automatic copy was blocked. Select the report below and copy it manually.";
    }
  };
}
