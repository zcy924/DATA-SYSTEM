import * as _ from 'lodash';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { ChangedItem, ModelEventTarget } from '../../event';

export abstract class DesignerGraphicConfig extends ModelEventTarget {
  option: any;
  protected _subject: Subject<any>;

  get configSource(): Observable<any> {
    return this._subject;
  }

  exportOption() {
    return _.cloneDeep(this.option);
  }

  importOption(option) {
    this._subject = new BehaviorSubject(null);
    if (option) {
      this.option = option;
    }
  }

  protected _update(changeItemArray: Array<ChangedItem>) {
    changeItemArray.forEach((value, index, array) => {
      this._trigger(value);
    });
  }
}
