import {IDataGenerator} from './IDataGenerator';
import {Api} from './Api';
import {fromPromise} from 'rxjs/internal-compatibility';
import {map} from 'rxjs/operators';
import {Observable} from "rxjs/internal/Observable";

export class DefaultDataGenerator implements IDataGenerator {

  api: Api;
  http$: Observable<any>;

  constructor(api: Api) {
    this.api = api;
  }

  // fetchData() {
  //   const http$ = fromPromise(fetch(
  //     this.api.url,
  //     {
  //       method: this.api.method,
  //       headers: this.api.headers,
  //       body: this.api.params
  //     },
  //   ).then(response => response.json())).pipe(map(response => {
  //     return response;
  //   }));
  //
  //   return http$;
  // }

  fetchData() {
    if (this.api.method === 'GET') {
      const options = Object.assign({}, this.api);
      delete options.generator;
      let url = options.url;
      delete options.url;
      let paramsArray = [];
      Object.keys(options.params).forEach(key => paramsArray.push(key + '=' + options.params[key]));
      if (url.search(/\?/) === -1) {
        url += '?' + paramsArray.join('&');
      } else {
        url += '&' + paramsArray.join('&');
      }
      delete options.params;
      this.http$ = fromPromise(fetch(url, options).then(response => response.json())).pipe(map(response => response));
    } else if (this.api.method === 'POST') {
      const options = Object.assign({}, this.api);
      delete options.generator;
      let url = options.url;
      delete options.url;
      options['body'] = JSON.stringify(this.api.params);
      delete options.params;
      console.log(options);
      this.http$ = fromPromise(fetch(url, options).then(response => response.json())).pipe(map(response => response));
    }
    return this.http$;
  }
}
