import { IDataGenerator } from './IDataGenerator';
import { Api } from './Api';
import { fromPromise } from 'rxjs/internal-compatibility';
import { map } from 'rxjs/operators';

export class XmlDataGenerator implements IDataGenerator {

  api: Api;

  constructor(api: Api) {
    this.api = api;
  }

  fetchData() {
    return fromPromise(fetch(
      this.api.url,
      {
        method: this.api.method,
        headers: this.api.headers,
        body: this.api.body
      },
    ));
  }
}
