import { MockStaticDataSourceConfig } from './interface';
import { BehaviorSubject } from 'rxjs/index';
import { IDataSourceGenerator } from '@data-studio/shared';

export class MockStaticDataSourceGenerator implements IDataSourceGenerator {
  /**
   * 模拟静态数据源创建
   * @param config
   * @returns {Observable<any>}
   * @private
   */
  generate(config: MockStaticDataSourceConfig) {
    return new BehaviorSubject(config.data);
  }
}
