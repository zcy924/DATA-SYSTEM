import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';

@Injectable()
export class SpaceManageService {

  url = environment.SERVER_URL;
  // url = environment.TEST_URL;

  constructor(private httpClient: HttpClient) {}

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
