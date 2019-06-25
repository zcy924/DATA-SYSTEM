import { IAction } from './action';


export class ActionManager {
  private _actionArray: Array<IAction> = [];
  private _pointer = -1;

  constructor() {
  }

  /**
   * 是否可以撤销
   */
  get canBackward(): boolean {
    return this._pointer > -1;
  }

  /**
   * 是否可以重做、恢复
   */
  get canForward(): boolean {
    return this._pointer < this._actionArray.length - 1;
  }

  /**
   * 如果可以重做，则先删除掉可以重做的部分
   * @param {IAction} action
   */
  execute(action: IAction) {
    if (action) {
      if (this.canForward) {
        this._actionArray.splice(this._pointer + 1);
      }
      action.forward();
      this._actionArray.push(action);
      this._pointer++;
    }
  }

  backward() {
    if (this.canBackward) {
      this.current.backward();
      this._pointer--;
    }
  }

  forward() {
    if (this.canForward) {
      this._pointer++;
      try {
        this.current.forward();
      } catch (e) {
        console.error(e);
        this._pointer--;
      }

    }
  }

  protected get current(): IAction {
    return this._actionArray[this._pointer];
  }
}
