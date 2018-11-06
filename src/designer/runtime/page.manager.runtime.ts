import { PageRuntime } from './page.runtime';

export class PageManagerRuntime {
  private _pageArray: Array<PageRuntime> = [];
  addPage(page:PageRuntime){
    this._pageArray.push(page);
  }

  get pages():Array<PageRuntime>{
    return this._pageArray.slice(0);
  }

  destroy(){
    if(this._pageArray){
      this._pageArray.splice(0);
      this._pageArray=null;
    }
  }
}
