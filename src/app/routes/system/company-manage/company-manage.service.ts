import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';

@Injectable()
export class CompanyManageService {
  url = environment.SERVER_URL;
  // url = environment.TEST_URL;
  // url = '10.2.72.22:8080/dvsp/company/';
  constructor(private httpClient: HttpClient) {}

  /***************************公司设置**************************/

  getCompanyInfo(params): Observable<any> {
    return this.httpClient.post(this.url + 'company/qryCompanyMsg', params);
  }

  updateCompanyInfo(params): Observable<any> {
    return this.httpClient.post(this.url + 'company/companyAdminUdt', params);
  }

  /***************************空间设置**************************/

  getSpaceList(params): Observable<any> {
    return this.httpClient.post(
      this.url + 'company/spaceSquareManage/qrySpaceAdmin',
      params,
    );
  }

  searchFuzzySpaceList(params): Observable<any> {
    return this.httpClient.post(
      this.url + 'company/spaceSquareManage/qryDimSpaceAdmin',
      params,
    );
  }

  updateAdmins(params): Observable<any> {
    return this.httpClient.post(
      this.url + 'company/spaceSquareManage/spaceAdminUdt',
      params,
    );
  }

  createSpace(params: any): Observable<any> {
    return this.httpClient.post(
      this.url + 'company/spaceSquareManage/addSpace',
      params,
    );
  }

  delSpace(params): Observable<any> {
    return this.httpClient.post(
      this.url + 'company/spaceSquareManage/delSpace',
      params,
    );
  }
  /***************************用户设置**************************/

  searchFuzzyUsers(params): Observable<any> {
    return this.httpClient.post(this.url + 'company/companyUserDimQry', params);
  }

  getUserList(params): Observable<any> {
    return this.httpClient.post(
      this.url + 'company/qryCompanyUserList',
      params,
    );
  }

  createUser(params): Observable<any> {
    return this.httpClient.post(this.url + 'company/addCompanyUser', params);
  }

  delUser(params): Observable<any> {
    return this.httpClient.post(this.url + 'company/companyUserDel', params);
  }

}
