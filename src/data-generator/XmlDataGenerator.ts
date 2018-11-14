import {Api} from './Api';
import {fromPromise} from 'rxjs/internal-compatibility';
import {map} from 'rxjs/operators';
import {Observable} from "rxjs/internal/Observable";
import * as X2JS from 'x2js';
import { IDataSourceGenerator } from '../data_visual/shared/core/data/data.source.generator';

export class XmlDataGenerator implements IDataSourceGenerator {

  createDataSource(api: any): Observable<any>{

    if (api.url === (null || '' || undefined)) {
      return;
    }

    let url = api.url;

    if (api.headers !== null && api.headers !== '' && api.headers !== undefined) {
      if(! (api.headers instanceof Object)){
        api.headers = JSON.parse(api.headers);
      }
    }

    if (api.method === 'GET') {
      let paramsArray = [];
      if (api.params !== null && api.params !== '' && api.params !== undefined) {
        let params;
        if(api.params instanceof Object){
          params = api.params;
        }else{
          params = JSON.parse(api.params);
        }
        Object.keys(params).forEach(key => paramsArray.push(key + '=' + params[key]));
        if (url.search(/\?/) === -1) {
          url += '?' + paramsArray.join('&');
        } else {
          url += '&' + paramsArray.join('&');
        }
      }
    } else if (api.method === 'POST') {
      if(api.params){
        if (api.params instanceof Object){
          api['body'] = JSON.stringify(api.params);
        }else{
          api['body'] = api.params;
        }
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
