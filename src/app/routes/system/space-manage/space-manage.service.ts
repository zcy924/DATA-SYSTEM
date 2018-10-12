import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';

@Injectable()
export class SpaceManageService {
  url = environment.SERVER_URL;
  constructor(private httpClient: HttpClient) {}
  addScreen(params): Observable<any> {
    return this.httpClient.post(
      '10.2.215.53:8080/DVSP/spaceManage/dashBoard/increase',
      params,
    );
  }
  getScreenList(params): Observable<any> {
    return this.httpClient.post(
      '10.2.215.53:8080/DVSP/spaceManage/dashBoard/listQry',
      params,
    );
  }
  modScreenInfo(params): Observable<any> {
    return this.httpClient.post(
      '10.2.215.53:8080/DVSP/spaceManage/dashBoard/contentUdt',
      params,
    );
  }
  // url = environment.TEST_URL;
  getReportList(params): Observable<any> {
    return this.httpClient.post(this.url + 'report/list', params);
  }

  delReport(params): Observable<any> {
    return this.httpClient.post(this.url + 'report/del', params);
  }

  createReport(params): Observable<any> {
    return this.httpClient.post(this.url + 'report/add', params);
  }
  // createCompany(params): Observable<any> {
  //   return this.httpClient.post(this.url + 'company/add', params);
  // }
}
