import {Api} from './Api';
import {fromPromise} from 'rxjs/internal-compatibility';
import {map} from 'rxjs/operators';
import {Observable} from "rxjs/internal/Observable";
import * as X2JS from 'x2js';
import { IDataSourceGenerator } from '@shared/core/data/data.source.generator';

export class XmlDataGenerator implements IDataSourceGenerator {

  createDataSource(api: any): Observable<any>{

    if (api.url === (null || '' || undefined)) {
      return;
    }

    let url = api.url;

    if (api.method === 'GET') {
      let paramsArray = [];
      if (api.params !== null) {
        Object.keys(api.params).forEach(key => paramsArray.push(key + '=' + api.params[key]));
        if (url.search(/\?/) === -1) {
          url += '?' + paramsArray.join('&');
        } else {
          url += '&' + paramsArray.join('&');
        }
      }
    } else if (api.method === 'POST') {
      const options = Object.assign({}, api);
      if(api.params){
        api['body'] = JSON.stringify(api.params);
      }
    }

    delete api.params;
    delete api.url;

    return fromPromise(fetch(url, api).then(response =>response.text())).pipe(map(response => {
      let x2js = new X2JS();
      return  x2js.xml2js(response);
    }));
  }

}
