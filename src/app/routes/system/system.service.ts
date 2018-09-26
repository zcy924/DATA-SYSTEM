import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable()
export class SystemService {
  constructor(private httpClient: HttpClient) {}
  test(): Observable<any> {
    return this.httpClient.get('http://10.2.215.213:8080/data-reporter/api/user');
  }
}
