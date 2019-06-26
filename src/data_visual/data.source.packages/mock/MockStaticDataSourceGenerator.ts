import { MockStaticDataSourceConfig } from './interface';
import { BehaviorSubject } from 'rxjs/index';
import { IDataSourceGenerator } from '@barca/shared/generator/generator';

export class MockStaticDataSourceGenerator implements IDataSourceGenerator {
  /**
   * 模拟静态数据源创建
   * @param config
   * @returns {Observable<any>}
   * @private
   */
  create(config: MockStaticDataSourceConfig) {
    return new BehaviorSubject(config.data);
  }
}
