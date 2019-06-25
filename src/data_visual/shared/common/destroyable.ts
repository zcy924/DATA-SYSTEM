export class Destroyable {
  private _destroyed = false;
  private _callbacksForDestroy: Array<Function> = [];

  get destroyed() {
    return this._destroyed;
  }

  protected onDestroy(callback: Function) {
    if (this._destroyed) {
      throw new Error('该对象已经销毁！');
    } else {
      this._callbacksForDestroy.push(callback);
    }
  }

  protected addSubscription(callback: Function) {
    this.onDestroy(callback);
  }

  destroy() {
    if (!this._destroyed) {
      this._callbacksForDestroy.forEach((callback: Function) => {
        try {
          callback.apply(null);
        } catch (e) {
          console.error(e);
        }
      });
      this._callbacksForDestroy.splice(0);
      this._callbacksForDestroy = null;
      this._destroyed = true;
    }
  }
}
