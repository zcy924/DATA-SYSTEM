import { Api } from './Api';
import { fromPromise } from 'rxjs/internal-compatibility';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs/internal/Observable';
import { IDataSourceGenerator } from '../data_visual/shared/core/data/data.source.generator';

export class JsonDataGenerator implements IDataSourceGenerator {

  createDataSource(api: any): Observable<any> {

    if (api.url === (null || '' || undefined)) {
      return;
    }
    let url = api.url;

    if (api.headers) {
      if(! (api.headers instanceof Object)){
        api.headers = JSON.parse(api.headers);
      }
    }

    if (api.method === 'GET') {

      let paramsArray = [];
      if (api.params) {
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

    return fromPromise(fetch(url, api).then(response => response.json())).pipe(map(response => response));
  }
}
