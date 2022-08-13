import React from "react";

export default class Debouncer {
  actionCallback: (event: React.ChangeEvent<HTMLInputElement>) => void;
  delayTime: number;
  timeoutID: ReturnType<typeof window.setTimeout>;

  constructor(actionCallback: (event: React.ChangeEvent<HTMLInputElement>) => void, delayTime: number) {
    this.actionCallback = actionCallback;
    this.delayTime = delayTime;
    this.timeoutID = 0;
  }

  build() {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      clearTimeout(this.timeoutID);
      this.timeoutID = setTimeout(() => this.actionCallback(event), this.delayTime);
    };
  }
}
