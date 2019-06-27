import { ComponentRepositoryManager, GeneratorRepositoryManager, IFileStructure } from '@barca/shared';
import { StandardCompRepo } from '../../../../../component.packages/standard';
import { CustomCompRepo } from '../../../../../component.packages/custom';
import { standardGeneratorRepo } from '../../../../../data.source.packages/mock';
import * as _ from 'lodash';
import { VERSION_INFO } from './page.utils';
import { ReportPageOuter } from './page.outer';

export class ReportPageBuilder {

  private _compRepoManager = ComponentRepositoryManager.getInstance();
  private _geneRepoManager = GeneratorRepositoryManager.getInstance();

  constructor() {
    this._compRepoManager.addComponentRepository(StandardCompRepo);
    this._compRepoManager.addComponentRepository(CustomCompRepo);
    this._geneRepoManager.addRepository(standardGeneratorRepo);
  }

  build(mode: 'design' | 'runtime', file: IFileStructure) {
    if (this._checkFile(file)) {
      const ret = new ReportPageOuter(mode);
      ret.load(file);
      return ret;
    }
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

const reportPageBuilder = new ReportPageBuilder();
