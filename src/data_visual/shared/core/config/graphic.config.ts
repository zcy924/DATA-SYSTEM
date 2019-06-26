import { Observable, Subject } from 'rxjs';
import { ModelEventTarget } from '../../event';

export abstract class GraphicConfig extends ModelEventTarget {
  protected _subject: Subject<any>;

  abstract importOption(option: any);

  exportOption() {
  }

  get configSource(): Observable<any> {
    return this._subject;
  }
}





