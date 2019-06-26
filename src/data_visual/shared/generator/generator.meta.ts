import { Type } from '../common/type';
import { IDataSourceGenerator } from './generator';

export interface IDataSourceGeneratorMeta {
  key: string;
  generatorDef: Type<IDataSourceGenerator>;
  generator?: IDataSourceGenerator;
}
