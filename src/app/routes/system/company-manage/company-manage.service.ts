import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';

@Injectable()
export class CompanyManageService {
  url = environment.SERVER_URL;
  // url = environment.TEST_URL;

  constructor(private httpClient: HttpClient) {}

  getUserList(params): Observable<any> {
    return this.httpClient.post(this.url + 'user/list', params);
  }

  createUser(params): Observable<any> {
    return this.httpClient.post(this.url + 'user/add', params);
  }

}
