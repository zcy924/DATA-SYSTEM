
import { JsonDataGenerator } from './JsonDataGenerator';
import { XmlDataGenerator } from './XmlDataGenerator';
import { GeneratorRepository } from '../data_visual/shared/generator/generator.repository';

const repository = new GeneratorRepository('standard', '标准数据源生成器库');
repository.batchRegister([
  {
    key: 'json',
    generatorDef: JsonDataGenerator,
  },
  {
    key: 'xml',
    generatorDef: XmlDataGenerator,
  }
]);
export const generatorRepo = repository;
