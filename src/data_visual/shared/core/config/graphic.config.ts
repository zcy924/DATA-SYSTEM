import * as _ from 'lodash';
import { Observable, Subject } from 'rxjs';
import { ModelEventTarget } from '../event/model.event';


export abstract class GraphicConfig extends ModelEventTarget {
  private _destroyed = false;
  private _callbacksOnDestroy: Array<Function> = [];
  protected _subject: Subject<any>;

  abstract importOption(option: any);

  exportOption() {
  }

  get configSource(): Observable<any> {
    return this._subject;
  }

  get destroyed(): boolean {
    return this._destroyed;
  }

  onDestroy(callback: Function) {
    if (_.isFunction(callback)) {
      this._callbacksOnDestroy.push(callback);
    }
  }

  destroy() {
    super.destroy();
    while (this._callbacksOnDestroy.length) {
      this._callbacksOnDestroy.pop()();
    }
    this._destroyed = true;
  }
}





