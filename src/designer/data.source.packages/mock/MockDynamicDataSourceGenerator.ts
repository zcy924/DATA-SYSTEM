import { map, publishBehavior, refCount } from 'rxjs/operators';
import { interval } from 'rxjs/index';
import { MockDynamicDataSourceConfig } from '@core/data/data.source.interface';
import { IDataSourceGenerator } from '../../interface/data.source.generator';

export class MockDynamicDataSourceGenerator implements IDataSourceGenerator {
  /**
   * 模拟动态数据源
   * 1、当最后一个Observer停止监听的时候  撤销定时任务
   * 2、当有一个Observer开始监听 立即调用数据生成器  并开启定时任务
   * @param config
   * @private
   */
  createDataSource(config: MockDynamicDataSourceConfig) {
    const { intervalTime = 5000, dataGenerator } = config;
    const ticker = interval(intervalTime);
    return ticker
      .pipe(
        map((value, index) => {
          console.log('***');
          return dataGenerator();
        }),
        publishBehavior(dataGenerator()),
        refCount());
  }
}
