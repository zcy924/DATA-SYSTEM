import { Subject } from 'rxjs/internal/Subject';

export class DesignerStorage {
  private static _instance: DesignerStorage;
  reportId: string;
  private _reportInfo: any;
  reportInfo$ = new Subject();

  static getInstance(): DesignerStorage {
    return this._instance || (this._instance = new DesignerStorage());
  }

  private constructor() {
  }

  set reportInfo(value: any) {
    this._reportInfo = value;
    this.reportInfo$.next(value);
  }

  get reportInfo() {
    return this._reportInfo;
  }
}


export const designerStorage = DesignerStorage.getInstance();
