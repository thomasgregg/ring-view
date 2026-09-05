export class StreamLifecycle {
  private generation = 0;
  private timeoutId?: number;

  public next(): number {
    this.clearTimeout();
    this.generation += 1;
    return this.generation;
  }

  public current(): number {
    return this.generation;
  }

  public scheduleTimeout(callback: () => void, milliseconds: number): void {
    this.clearTimeout();
    const generation = this.generation;
    this.timeoutId = window.setTimeout(() => {
      if (generation === this.generation) callback();
    }, milliseconds);
  }

  public clearTimeout(): void {
    if (this.timeoutId !== undefined) {
      window.clearTimeout(this.timeoutId);
      this.timeoutId = undefined;
    }
  }

  public dispose(): void {
    this.clearTimeout();
    this.generation += 1;
  }
}
