import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';

@Injectable()
export class PlatformManageService {
  url = environment.SERVER_URL;
  constructor(private httpClient: HttpClient) {}
  // getUser(): Observable<any> {
  //   return this.httpClient.get('http://10.2.215.213:8080/data-reporter/api/user');
  // }
}
