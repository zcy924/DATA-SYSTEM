import * as _ from 'lodash';
import { StandardCompRepo } from '@data-studio/component/standard';
import { CustomCompRepo } from '@data-studio/component/custom';
import { mockGeneratorRepo } from '@data-studio/generator/mock';
import { componentManager, generatorManager, IFileStructure } from '@data-studio/shared';
import { VERSION_INFO } from '../core/structure/page/report/page.utils';
import { ReportPage } from '../core/structure/page/report/page';
import { standardGeneratorRepo } from '@data-studio/generator/standard';

export class ReportPageBuilder {

  private _componentManager = componentManager;
  private _generatorManager = generatorManager;

  constructor() {
    this._componentManager.addRepository(StandardCompRepo);
    this._componentManager.addRepository(CustomCompRepo);
    this._generatorManager.addRepository([standardGeneratorRepo, mockGeneratorRepo]);
  }

  /**
   * 根据模式构建page对象
   * @param mode
   * @param file
   */
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
   * 版本号验证
   * 若版本号为空，则不可以打开
   * @param {IFileStructure} file
   * @returns {boolean}
   * @private
   */
  private _checkVersion(file: IFileStructure) {
    return VERSION_INFO.accept(_.get(file, 'manifest.version'));
  }

  private _checkDependencies(file: IFileStructure) {
    const { componentRepositories, generatorRepositories } =
      _.get(file, 'dependencies', { componentRepositories: [], generatorRepositories: [] });
    return this._componentManager.includes(componentRepositories)
      && this._generatorManager.includes(generatorRepositories);
  }
}

export const reportPageBuilder = new ReportPageBuilder();
