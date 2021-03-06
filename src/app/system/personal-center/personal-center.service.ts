import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {catchError} from 'rxjs/operators';
import {environment} from '../../../environments/environment';
import {Observable} from 'rxjs';

@Injectable()
export class PersonalCenterService {
  url = environment.SERVER_URL;

  constructor(private httpClient: HttpClient) {
  }

  /*********************************大屏*******************************************/

  qryScreenList(params): Observable<any> {
    return this.httpClient.post(this.url + 'selfCore/keepDashBoard/qryDashBoardList', params);
  }

  modSelfScreenInfo(params): Observable<any> {
    return this.httpClient.post(this.url + 'selfCore/keepDashBoard/editDashBoard', params);
  }

  delSelfScreen(params): Observable<any> {
    return this.httpClient.post(this.url + 'selfCore/keepDashBoard/del', params);
  }

  delSelfScreenList(params): Observable<any> {
    return this.httpClient.post(this.url + 'selfCore/keepDashBoard/alldel', params);
  }

  getScreenInfo(params): Observable<any> {
    return this.httpClient.post(this.url + 'selfCore/keepDashBoard/qryDashBoardContent', params);
  }

  collectScreen(params): Observable<any> {
    return this.httpClient.post(this.url + 'selfCore/keepDashBoard/addKeep', params);
  }

  uncollectScreen(params): Observable<any> {
    return this.httpClient.post(this.url + 'selfCore/keepDashBoard/del', params);
  }

  /*********************************用户*******************************************/
  getUserInfo(params): Observable<any> {
    return this.httpClient.post(this.url + 'selfCore/selfInfo/qrySelfInfo', params);
  }

  modUserInfo(params): Observable<any> {
    return this.httpClient.post(this.url + 'selfCore/selfInfo/modSelfInfo', params);
  }

  /*************************************报表*************************************/

  getSelfReportList(params): Observable<any> {
    return this.httpClient.post(this.url + 'selfCore/keepReport/qrySelfReportList', params);
  }

  qrySelfReportFolderListTree(params): Observable<any> {
    return this.httpClient.post(this.url + 'selfCore/keepReport/qrySelfReportFolderListTree', params);
  }

  qrySelfReportListTree(params): Observable<any> {
    return this.httpClient.post(this.url + 'selfCore/keepReport/qrySelfReportListTree', params);
  }

  getSelfReportInfo(params): Observable<any> {
    return this.httpClient.post(this.url + 'selfCore/keepReport/qrySelfReportContent', params);
  }

  delSelfReport(params): Observable<any> {
    return this.httpClient.post(this.url + 'selfCore/keepReport/delSelfReport', params);
  }

  delSelfReportList(params): Observable<any> {
    return this.httpClient.post(this.url + 'selfCore/keepReport/alldel', params);
  }

  modSelfReport(params): Observable<any> {
    return this.httpClient.post(this.url + 'selfCore/keepReport/modSelfReport', params);
  }

  addSelfReport(params): Observable<any> {
    return this.httpClient.post(this.url + 'selfCore/keepReport/addSelfReport', params);
  }

  addSelfFolder(params): Observable<any> {
    return this.httpClient.post(this.url + 'selfCore/keepReport/addSelfReportFolder', params);
  }

  qrySelfReportContent(params): Observable<any> {
    return this.httpClient.post(this.url + 'selfCore/keepReport/qrySelfReportContent', params);
  }


}
