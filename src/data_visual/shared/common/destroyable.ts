/**
 * 谁创建 谁销毁，注意是否存在销毁时序（例如： A对象不能在B对象销毁前销毁）
 * 在创建的地方销毁
 */
export class Destroyable {
  private _destroyed = false;
  private _callbacksForDestroy: Array<Function> = [];

  get destroyed() {
    return this._destroyed;
  }

  protected onDestroy(callback: Function, order: number = 1) {
    if (this._destroyed) {
      throw new Error('该对象已经销毁！');
    } else {
      (callback as any)._order = order;
      this._callbacksForDestroy.push(callback);
    }
  }


  destroy() {
    if (!this._destroyed) {
      this._callbacksForDestroy.sort((a, b) => {
        return (a as any)._order - (b as any)._order;
      });
      this._callbacksForDestroy.forEach((callback: Function) => {
        try {
          delete (callback as any)._order;
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
