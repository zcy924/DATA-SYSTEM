import { MockStaticDataSourceConfig } from './interface';
import { IDataSourceGenerator } from '@shared/core/data/data.source.generator';
import { BehaviorSubject } from 'rxjs/index';

export class MockStaticDataSourceGenerator implements IDataSourceGenerator {
  /**
   * 模拟静态数据源创建
   * @param config
   * @returns {Observable<any>}
   * @private
   */
  createDataSource(config: MockStaticDataSourceConfig) {
    return new BehaviorSubject(config.data);
  }
}
