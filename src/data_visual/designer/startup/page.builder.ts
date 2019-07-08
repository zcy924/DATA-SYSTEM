import { ComponentRepositoryManager, GeneratorRepositoryManager, IFileStructure } from '@data-studio/shared';
import { VERSION_INFO } from '../core/structure/page/report/page.utils';
import { ReportPage } from '../core/structure/page/report/page.outer';
import * as _ from 'lodash';
import { StandardCompRepo } from '@data-studio/component/standard';
import { CustomCompRepo } from '@data-studio/component/custom';
import { standardGeneratorRepo } from '@data-studio/generator/mock';

export class ReportPageBuilder {

  private _compRepoManager = ComponentRepositoryManager.getInstance();
  private _geneRepoManager = GeneratorRepositoryManager.getInstance();

  constructor() {
    this._compRepoManager.addComponentRepository(StandardCompRepo);
    this._compRepoManager.addComponentRepository(CustomCompRepo);
    this._geneRepoManager.addRepository(standardGeneratorRepo);
  }

  build(mode: 'design' | 'runtime', file?: IFileStructure) {
    const ret = new ReportPage(mode);
    if (file && this._checkFile(file)) {
      ret.load(file);
    }
    return ret;
  }

  private _checkFile(file: IFileStructure): boolean {
    return this._checkVersion(file) && this._checkDependencies(file);
  }

  /**
   * 若版本号为空，则不可以打开
   * @param {IFileStructure} file
   * @returns {boolean}
   * @private
   */
  private _checkVersion(file: IFileStructure) {
    const version = _.get(file, 'manifest.version');
    return version ? VERSION_INFO.accept(version) : false;
  }

  private _checkDependencies(file: IFileStructure) {
    const { componentRepositories, generatorRepositories } =
      _.get(file, 'dependencies', { componentRepositories: [], generatorRepositories: [] });
    return this._compRepoManager.includes(componentRepositories)
      && this._geneRepoManager.includes(generatorRepositories);
  }
}

export const reportPageBuilder = new ReportPageBuilder();
