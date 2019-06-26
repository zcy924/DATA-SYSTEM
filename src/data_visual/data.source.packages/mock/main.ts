import { MockDynamicDataSourceGenerator } from './MockDynamicDataSourceGenerator';
import { MockStaticDataSourceGenerator } from './MockStaticDataSourceGenerator';
import { GeneratorRepository } from '@barca/shared/repository/generator.repository';

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
