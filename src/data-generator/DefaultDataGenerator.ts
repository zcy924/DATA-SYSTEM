import { IDataGenerator } from './IDataGenerator';
import { Api } from './Api';
import { ajax, fromPromise } from 'rxjs/internal-compatibility';
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
        body: this.api.body,
      },
    )).pipe(map(response => {
      return response.json();
    }));

    return http$;
  }


  fetchData1() {
    return ajax({
      method: this.api.method,
      url: this.api.url,
      body: this.api.body ,
      headers:this.api.headers
    }).pipe(map(response => {
      console.log(response);
      return {a:'b'};
    }));
  }
}
