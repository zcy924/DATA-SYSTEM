import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';

@Injectable()
export class CompanyManageService {
  // url = environment.SERVER_URL;
  // url = environment.TEST_URL;
  url = '10.2.215.203:8080/dvsp/company/';
  constructor(private httpClient: HttpClient) {}

  getSpaceList(params): Observable<any> {
    return this.httpClient.post(this.url + 'spaceSquareManage/qrySpaceAdmin', params);
  }

  updateAdmins(params): Observable<any> {
    return this.httpClient.post(this.url + 'spaceSquareManage/qrySpaceAdmin', params);
  }

  getUserList(params): Observable<any> {
    return this.httpClient.post('localhost:8080/data-reporter/ipa/user/list', params);
  }

  createUser(params): Observable<any> {
    return this.httpClient.post('localhost:8080/data-reporter/ipa/user/add', params);
  }

  delUser(params): Observable<any> {
    return this.httpClient.post('localhost:8080/data-reporter/ipa/user/del', params);
  }

  getCompanyInfo(params): Observable<any> {
    return this.httpClient.post('localhost:8080/data-reporter/ipa/company/info', params);
  }



}
