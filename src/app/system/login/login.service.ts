import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable()
export class LoginService {
  url = environment.SERVER_URL;
  constructor(private httpClient: HttpClient) {}
  login(params): Observable<any> {
    return this.httpClient.post(this.url + 'company/login', params);
  }
  platformLogin(params): Observable<any> {
    return this.httpClient.post(this.url + 'system/login', params);
  }
}
