import { Observable } from 'rxjs/internal/Observable';

export interface IDataSourceGenerator {
  createDataSource(option: any): Observable<any>;
}
