import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable()
export class SapaceSquareService {
  constructor(private http: HttpClient) {
  }

  getSpaceList(params: any): Observable<any> {
    return this.http.post('http://localhost:8080/data-reporter/api/list', params);
  }



}
