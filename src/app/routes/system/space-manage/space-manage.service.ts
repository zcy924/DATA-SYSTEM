import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {catchError} from 'rxjs/operators';
import {environment} from '@env/environment';
import {Observable} from 'rxjs';

@Injectable()
export class SpaceManageService {
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

  delScreen(params): Observable<any> {
    return this.httpClient.post(this.url + 'spaceManage/dashBoard/delete', params);
  }

  delAllScreen(params): Observable<any> {
    return this.httpClient.post(this.url + 'spaceManage/dashBoard/alldel', params);
  }

  collectScreen(params): Observable<any> {
    return this.httpClient.post(this.url + 'selfCore/keepDashBoard/addKeep', params);
  }

  uncollectScreen(params): Observable<any> {
    return this.httpClient.post(this.url + 'selfCore/keepDashBoard/del', params);
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

  qryReportContent(params): Observable<any> {
    return this.httpClient.post(this.url + 'space/report/qryReportContent', params);
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

  /*************************************空间设置*************************************/
  modSpaceInfo(params): Observable<any> {
    return this.httpClient.post(this.url + 'company/spaceSquareManage/modInfo', params);
  }

  qrySpaceInfo(params): Observable<any> {
    return this.httpClient.post(this.url + 'company/spaceSquareManage/qryInfo', params);
  }


  /************************************* API 接口 *************************************/

  addApi(params): Observable<any> {
    return this.httpClient.post(this.url + '/DVSP/space/api/add', params);
  }

  modApi(params): Observable<any> {
    return this.httpClient.post(this.url + '/DVSP/space/api/mod', params);
  }

  queryApi(params): Observable<any> {
    return this.httpClient.post(this.url + '/DVSP/space/api/query', params);
  }

  qryDimList(params): Observable<any> {
    return this.httpClient.post(this.url + '/DVSP/space/api/qryDimList', params);
  }

  alldel(params): Observable<any> {
    return this.httpClient.post(this.url + '/DVSP/space/api/alldel', params);
  }


}
