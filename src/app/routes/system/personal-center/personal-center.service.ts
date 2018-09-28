import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';

@Injectable()
export class PersonalCenterService {
  url = environment.SERVER_URL;
  constructor(private httpClient: HttpClient) {}
  getUser(): Observable<any> {
    return this.httpClient.post('http://127.0.0.1:3000/system/login', {
      username: 'admin',
      password: 'abcd1234',
    });
  }
}
