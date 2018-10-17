import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';

@Injectable()
export class CompanyManageService {
  // url = environment.SERVER_URL;
  // url = environment.TEST_URL;
  url = '10.2.72.22:8080/dvsp/company/';
  constructor(private httpClient: HttpClient) {}


  /***************************公司设置**************************/

  getCompanyInfo(params): Observable<any> {
    return this.httpClient.post(this.url + 'qryCompanyMsg', params);
  }

  updateCompanyInfo(params): Observable<any> {
    return this.httpClient.post(this.url + 'qryCompanyMsg', params);
  }

  /***************************空间设置**************************/

  getSpaceList(params): Observable<any> {
    return this.httpClient.post(this.url + 'spaceSquareManage/qrySpaceAdmin', params);
  }

  updateAdmins(params): Observable<any> {
    return this.httpClient.post(this.url + 'spaceSquareManage/spaceAdminUdt', params);
  }

  /***************************用户设置**************************/

  searchMisUsers(params): Observable<any> {
    return this.httpClient.post(this.url + 'companyUserDimQry', params);
  }

  getUserList(params): Observable<any> {
    return this.httpClient.post(this.url + 'qryCompanyUserList', params);
  }

  createUser(params): Observable<any> {
    return this.httpClient.post(this.url + 'addCompanyUser', params);
  }

  delUser(params): Observable<any> {
    return this.httpClient.post(this.url + 'companyUserDel', params);
  }




}
