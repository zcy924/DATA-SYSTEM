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
      this.url + 'spaceManage/dashBoard/increase',
      params,
    );
  }
  getScreenList(params): Observable<any> {
    return this.httpClient.post(
      this.url + 'spaceManage/dashBoard/listQry',
      params,
    );
  }
  modScreenInfo(params): Observable<any> {
    return this.httpClient.post(
      this.url + 'spaceManage/dashBoard/revise',
      params,
    );
  }
  delScreen(params): Observable<any> {
    return this.httpClient.post(
      this.url + 'spaceManage/dashBoard/delete',
      params,
    );
  }
  delAllScreen(params): Observable<any> {
    return this.httpClient.post(
      this.url + 'spaceManage/dashBoard/alldel',
      params,
    );
  }

  getReportList(params): Observable<any> {
    return this.httpClient.post(
      this.url + 'space/report/qryReportList',
      params,
    );
  }

  delReport(params): Observable<any> {
    return this.httpClient.post(this.url + 'space/report/del', params);
  }

  createReport(params): Observable<any> {
    return this.httpClient.post(this.url + 'space/report/add', params);
  }

  modReport(params): Observable<any> {
    return this.httpClient.post(
      this.url + 'space/report/modReportContent',
      params,
    );
  }
}