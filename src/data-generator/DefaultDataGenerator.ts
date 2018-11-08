import { IDataGenerator } from './IDataGenerator';
import { Api } from './Api';
import { fromPromise } from 'rxjs/internal-compatibility';
import { map } from 'rxjs/operators';

export class DefaultDataGenerator implements IDataGenerator{

  api: Api;

  constructor(api: Api) {
    this.api = api;
  }

  fetchData() {
    const http$ = fromPromise(fetch(
      this.api.url,
      {
        method: this.api.method,
        headers: this.api.headers,
        body: this.api.body
      },
    ).then(response=>response.json())).pipe(map(response => {
      return response;
    }));

    return http$;
  }
}
