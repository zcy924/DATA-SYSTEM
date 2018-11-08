import { GeneratorRepository } from '../../shared/core/repository/generator.repository';
import { MockDynamicDataSourceGenerator } from './MockDynamicDataSourceGenerator';
import { MockStaticDataSourceGenerator } from './MockStaticDataSourceGenerator';

const geneRepo = new GeneratorRepository('standard', '标准数据源生成器库');
geneRepo.batchRegister([
  {
    key: 'mockDynamic',
    generatorDef: MockDynamicDataSourceGenerator,
  },
  {
    key: 'mockStatic',
    generatorDef: MockStaticDataSourceGenerator,
  },
]);
export const standardGeneratorRepo = geneRepo;
