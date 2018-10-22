import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';

@Injectable()
export class SpaceSquareService {
  url = environment.SERVER_URL;

  constructor(private http: HttpClient) {}

  getSpaceList(params: any): Observable<any> {
    return this.http.post(
      this.url + 'company/spaceSquareManage/qrySpaceList',
      params,
    );
  }

  createSpace(params: any): Observable<any> {
    return this.http.post(
      'http://10.2.215.191:8080/data-reporter/ipa/space/add',
      params,
    );
  }
}
