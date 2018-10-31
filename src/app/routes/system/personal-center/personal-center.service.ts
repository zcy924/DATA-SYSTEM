import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {catchError} from 'rxjs/operators';
import {environment} from '@env/environment';
import {Observable} from 'rxjs';

@Injectable()
export class PersonalCenterService {
  url = environment.SERVER_URL;

  constructor(private httpClient: HttpClient) {
  }

  getUser(): Observable<any> {
    return this.httpClient.post('http://127.0.0.1:3000/system/login', {
      username: 'admin',
      password: 'abcd1234',
    });
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

  /*********************************大屏*******************************************/
  modScreenInfo(params): Observable<any> {
    return this.httpClient.post(this.url + 'spaceManage/dashBoard/revise', params);
  }

  qryScreenList(params): Observable<any> {
    return this.httpClient.post(this.url + 'selfCore/keepDashBoard/qryDashBoardList', params);
  }


}
