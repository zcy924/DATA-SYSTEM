import {IDataGenerator} from "./IDataGenerator";
import {Api} from "./Api";
import {Observable} from "rxjs/internal/Observable";

export class TextDataGenerator implements IDataGenerator {
  api: Api;
  http$:Observable<any>;

  constructor(api:Api) {
    this.api = api;
  }

  fetchData(): Observable<any> {
    return this.http$;
  }
}
