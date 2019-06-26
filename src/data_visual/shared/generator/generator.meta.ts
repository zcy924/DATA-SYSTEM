import { Type } from '../common/type';
import { IDataSourceGenerator } from './generator';

/**
 * 数据源生成器配置
 */
export interface IDataSourceGeneratorMeta {
  key: string;
  generatorDef: Type<IDataSourceGenerator>;
  generator?: IDataSourceGenerator;
}
