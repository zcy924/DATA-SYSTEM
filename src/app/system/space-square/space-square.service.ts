import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable()
export class SpaceSquareService {
  url = environment.SERVER_URL;

  constructor(private http: HttpClient) {
  }

  getSpaceList(params: any): Observable<any> {
    return this.http.post(this.url + 'company/spaceSquareManage/qrySpaceList', params);
  }

  createSpace(params: any): Observable<any> {
    return this.http.post(this.url + 'company/spaceSquareManage/addSpace', params);
  }

  getLogo(params: any): Observable<any> {
    return this.http.post(this.url + 'logo/getLogo', params);
  }

}
