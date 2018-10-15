import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';

@Injectable()
export class SpaceSquareService {
  url = environment.SERVER_URL;

  constructor(private http: HttpClient) {}

  getSpaceList(params: any): Observable<any> {
    return this.http.post(this.url + 'space/list', params);
  }
}
