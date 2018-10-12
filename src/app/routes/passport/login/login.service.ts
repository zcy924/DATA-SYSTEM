import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';

@Injectable()
export class LoginService {
  url = environment.SERVER_URL;
  // url = environment.TEST_URL;
  constructor(private httpClient: HttpClient) {}
  login(params): Observable<any> {
    return this.httpClient.post('10.2.215.53:8080/DVSP/system/login', params);
  }
}
