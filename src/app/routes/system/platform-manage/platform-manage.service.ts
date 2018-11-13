import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';

@Injectable()
export class PlatformManageService {

  // url = environment.SERVER_URL;
  url = '127.0.0.1:8080/dvsp/';

  constructor(private httpClient: HttpClient) {
  }

  getCompanyList(params): Observable<any> {
    return this.httpClient.post(this.url + 'company/companyListQry', params);
  }

  createCompany(params): Observable<any> {
    return this.httpClient.post(this.url + 'company/addCompany', params);
  }
}
