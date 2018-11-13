import { Api } from './Api';
import { fromPromise } from 'rxjs/internal-compatibility';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs/internal/Observable';
import { IDataSourceGenerator } from '@shared/core/data/data.source.generator';

export class JsonDataGenerator implements IDataSourceGenerator {

  createDataSource(api: any): Observable<any> {

    // if (api.headers !== (null || '' || undefined)) {
    //   api.headers = JSON.parse(api.headers);
    // } else {
    //   api.headers = {
    //     Accept: 'application/json;charset=utf-8',
    //   };
    // }

    // if (api.params !== (null || '' || undefined)) {
    //   console.log(api.params)
    //   api.params = JSON.parse(api.params);
    // }

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
      if(api.params){
        api['body'] = JSON.stringify(api.params);
      }
    }

    delete api.params;
    delete api.url;

    return fromPromise(fetch(url, api).then(response => response.json())).pipe(map(response => response));
  }
}
