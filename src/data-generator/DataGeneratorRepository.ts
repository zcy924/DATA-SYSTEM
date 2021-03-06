import { JsonDataGenerator } from './JsonDataGenerator';
import { XmlDataGenerator } from './XmlDataGenerator';
import { GeneratorRepository } from '@data-studio/shared';

const repository = new GeneratorRepository('standard', '标准数据源生成器库');
repository.batchRegister([
  {
    id: 'json',
    generatorDef: JsonDataGenerator,
  },
  {
    id: 'xml',
    generatorDef: XmlDataGenerator,
  },
]);
export const generatorRepo = repository;
