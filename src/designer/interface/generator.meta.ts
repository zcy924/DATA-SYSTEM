import { Type } from './type';
import { IDataSourceGenerator } from '@shared/core/data/data.source.generator';

export interface IDataSourceGeneratorMeta {
  key: string;
  generatorDef: Type<IDataSourceGenerator>;
  generator?: IDataSourceGenerator;
}
