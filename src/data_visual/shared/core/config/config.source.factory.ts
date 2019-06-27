import {Observable} from 'rxjs';
import { Type } from '../../common';
import { ConfigSourceComponent } from './config.source.component';

export interface IConfigSourceFactory {
  getConfigSource(configSourceOption: IConfigSourceOption): Observable<any>;
}

export interface IConfigSourceOption {
  graphicId: string;
  graphicKey: Type<ConfigSourceComponent>;
  configOption: any;
}
