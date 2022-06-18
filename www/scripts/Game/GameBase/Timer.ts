
export class Timer {
  private ready: boolean = false;
  private timeout: number;
  constructor(timeout: number) {
    this.timeout = timeout
    setTimeout(() => {this.ready = true}, this.timeout);
  }
  isReady(): boolean {
    let ready = this.ready;
    if (this.ready) {
      this.ready = false;
      setTimeout(() => {this.ready = true}, this.timeout);
    }
    return ready;
  }
}