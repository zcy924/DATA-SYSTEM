import {Api} from './Api';
import {fromPromise} from 'rxjs/internal-compatibility';
import {map} from 'rxjs/operators';
import {Observable} from "rxjs/internal/Observable";
import * as X2JS from 'x2js';
import { IDataSourceGenerator } from '@shared/core/data/data.source.generator';

export class XmlDataGenerator implements IDataSourceGenerator {

  createDataSource(api: any): Observable<any>{
    if (api.headers === null || '') {
      api.headers = {
        Accept: 'text/plain, */*',
      }
    }
    if (api.method === 'GET') {
      const options = Object.assign({}, api);

      let url = options.url;
      delete options.url;
      let paramsArray = [];
      if (options.params !== null) {
        Object.keys(options.params).forEach(key => paramsArray.push(key + '=' + options.params[key]));
        if (url.search(/\?/) === -1) {
          url += '?' + paramsArray.join('&');
        } else {
          url += '&' + paramsArray.join('&');
        }
      }
      delete options.params;
      return fromPromise(fetch(url, options).then(response =>response.text())).pipe(map(response => {
        let x2js = new X2JS();
        const data = x2js.xml2js(response);
        return data;
      }));
    } else if (api.method === 'POST') {
      const options = Object.assign({}, api);

      let url = options.url;
      delete options.url;
      options['body'] = JSON.stringify(api.params);
      delete options.params;
      return fromPromise(fetch(url, options).then(response => response.json())).pipe(map(response => {
        console.log(response);
        let x2js = new X2JS();
        const data = x2js.xml2js(response);
        return data;
      }));
    }
  }

}
