import { Observable } from 'rxjs/internal/Observable';

/**
 * 数据源生成器（数据源工厂）
 */
export interface IDataSourceGenerator {
  /**
   * 根据选项信息生成数据源
   * @param option
   */
  generate(option: any): Observable<any>;
}
