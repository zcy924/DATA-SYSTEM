export class Destroyable {
  private _destroyed: boolean = false;
  private _destroyCallbacks: Array<Function> = [];

  get destroyed() {
    return this._destroyed;
  }

  onDestroy(callback: Function) {
    if (this._destroyed) {
      throw new Error('该对象已经销毁！');
    } else {
      this._destroyCallbacks.push(callback);
    }
  }

  destroy() {
    while (this._destroyCallbacks.length > 0) {
      this._destroyCallbacks.pop()();
    }
    this._destroyed = true;
  }
}
