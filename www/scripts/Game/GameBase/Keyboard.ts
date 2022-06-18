
export class Keyboard {
  private events: Array<KeyboardEvent>;
  constructor () {
    this.events = new Array<KeyboardEvent>();
    //console.log(this.events);
    document.addEventListener("keydown", (evt) => this.keyboardListener(evt));
    document.addEventListener("keypress", (evt) => this.keyboardListener(evt));
    document.addEventListener("keyup", (evt) => this.keyboardListener(evt));
  }
  private keyboardListener(event : KeyboardEvent) {
    this.events.push(event);
  }
  public getEvents() : Array<KeyboardEvent> {
    let currEvenets = Object.assign([], this.events);
    this.events.length = 0;
    return currEvenets;
  }

}