import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';

@Injectable()
export class CommService {
  url = environment.SERVER_URL;

  constructor(private httpClient: HttpClient) {
  }

  /***********************************大屏************************************/
  addScreen(params): Observable<any> {
    return this.httpClient.post(this.url + 'spaceManage/dashBoard/increase', params);
  }

  getScreenInfo(params): Observable<any> {
    return this.httpClient.post(this.url + 'spaceManage/dashBoard/contentQry', params);
  }

  getScreenList(params): Observable<any> {
    return this.httpClient.post(this.url + 'spaceManage/dashBoard/listQry', params);
  }

  modScreenInfo(params): Observable<any> {
    return this.httpClient.post(this.url + 'spaceManage/dashBoard/revise', params);
  }

  saveScreenContent(params): Observable<any> {
    return this.httpClient.post(this.url + 'spaceManage/dashBoard/contentUdt', params);
  }

  delScreen(params): Observable<any> {
    return this.httpClient.post(this.url + 'spaceManage/dashBoard/delete', params);
  }

  delAllScreen(params): Observable<any> {
    return this.httpClient.post(this.url + 'spaceManage/dashBoard/alldel', params);
  }

  /*************************************报表*************************************/

  qryReportTree(params): Observable<any> {
    return this.httpClient.post(this.url + 'space/report/qryReportListTree', params);
  }

  getReportList(params): Observable<any> {
    return this.httpClient.post(this.url + 'space/report/qryReportList', params);
  }

  delReport(params): Observable<any> {
    return this.httpClient.post(this.url + 'space/report/del', params);
  }

  createReport(params): Observable<any> {
    return this.httpClient.post(this.url + 'space/report/add', params);
  }

  modReport(params): Observable<any> {
    return this.httpClient.post(this.url + 'space/report/modReportContent', params);
  }

  /************************************角色***********************************/

  createRole(params): Observable<any> {
    return this.httpClient.post(this.url + 'space/spaceRole/add', params);
  }

  getRoleList(params): Observable<any> {
    return this.httpClient.post(this.url + 'space/spaceRole/qryList', params);
  }

  delRole(params): Observable<any> {
    return this.httpClient.post(this.url + 'space/spaceRole/del', params);
  }

  modRole(params): Observable<any> {
    return this.httpClient.post(this.url + 'space/spaceRole/mod', params);
  }

  qryUserListByRole(params): Observable<any> {
    return this.httpClient.post(this.url + 'space/spaceRole/qryRoleUser', params);
  }

  qryReportListByRole(params): Observable<any> {
    return this.httpClient.post(this.url + 'space/spaceRole/qryRoleReportTree', params);
  }

  /************************************用户*************************************/

  addUser(params): Observable<any> {
    return this.httpClient.post(this.url + 'space/spaceUser/add', params);
  }

  delUser(params): Observable<any> {
    return this.httpClient.post(this.url + 'space/spaceUser/del', params);
  }

  getUserListWithRoles(params): Observable<any> {
    return this.httpClient.post(this.url + 'space/spaceUser/qryList', params);
  }

  qryReportListByUser(params): Observable<any> {
    return this.httpClient.post(this.url + 'space/spaceUser/qrySpaceUserReportTree', params);
  }

  modUser(params): Observable<any> {
    return this.httpClient.post(this.url + 'space/spaceUser/mod', params);
  }
}
