import { IFileStructure } from '../shared/file/file.structure';
import { PageRuntime } from './page.runtime';
import { ComponentRepository } from '../shared/core/repository/component.repository';
import { ComponentRepositoryManager } from '../shared/manager/component.repository.manager';
import { PageManagerRuntime } from './page.manager.runtime';
import * as _ from 'lodash';
import { GeneratorRepositoryManager } from '../shared/manager/generator.repository.manager';
import { GeneratorRepository } from '@shared/core/repository/generator.repository';
import { DataSourceConfig } from '@core/../shared/core/data/data.source.config';
import { DataSourceConfigSet } from '@shared/core/data/data.source.config.set';
import { DataSourceManager } from '@shared/core/data/data.source.manager';

/**
 * 1、支持同时打开多个页面
 * 2、支持关闭页面和隐藏页面  隐藏的页面可以快速打开
 * 3、一个浏览器实例可以打开多个运行时
 * 4、支持对指定页面（大屏或报告）进行缩放
 *
 * 平台可以加载数据源生成器、数据源生成器包
 * 加载组件，加载组件库
 * 数据源是否支持参数
 *
 * 页面信息中要包含数据源的定义
 * 数据源生成器  数据源生成器参数 数据源描述
 * 同一个文件是否可以多次打开？
 *
 *
 */
export class Runtime {

  private static _runtime: Runtime;
  private static readonly _version = '1.0.0';
  private static readonly _versionPattern = /^\d+\.\d+\.\d+$/;

  private _pageManager = new PageManagerRuntime();
  private _compRepoManager = ComponentRepositoryManager.getInstance();
  private _geneRepoManager = GeneratorRepositoryManager.getInstance();

  static getInstance() {
    if (!this._runtime) {
      this._runtime = new Runtime();
    }
    return this._runtime;
  }


  static accept(versionNo: string): boolean {
    if (this._versionPattern.test(versionNo)) {
      const [a, b, c] = versionNo.match(/\d+/g),
        [ta, tb, tc] = this._version.match(/\d+/g);
      if (a === ta && parseInt(tb) >= parseInt(b)) {
        return true;
      } else {
        return false;
      }

    } else {
      console.log('版本号格式错误:' + versionNo);
      return false;
    }

  }

  public init() {
  }

  open(file: IFileStructure): PageRuntime {
    if (this._checkFile(file)) {
      return this._createFile(file);
    }
  }

  private _checkFile(file: IFileStructure): boolean {
    return this._checkVersion(file) && this._checkDependencies(file);
  }

  private _checkVersion(file: IFileStructure) {
    return Runtime.accept(_.get(file, 'manifest.version'));
  }

  private _checkDependencies(file: IFileStructure) {
    const { componentRepositories, generatorRepositories } =
      _.get(file, 'dependencies');
    return this._compRepoManager.includes(componentRepositories)
      && this._geneRepoManager.includes(generatorRepositories);
  }

  get pages(): Array<PageRuntime> {
    return this._pageManager.pages;
  }

  addComponentRepository(repo: ComponentRepository) {
    this._compRepoManager.addComponentRepository(repo);
  }

  removeComponentRepository() {
  }

  addGeneretorRepository(geneRepo: GeneratorRepository | Array<GeneratorRepository>) {
    if (_.isArray(geneRepo)) {
      geneRepo
        .forEach(value => this._geneRepoManager
          .addGeneratorRepository(value));
    } else {
      this._geneRepoManager.addGeneratorRepository(geneRepo);
    }

  }

  destroy() {
    if (this._compRepoManager) {
      this._compRepoManager.destroy();
      this._compRepoManager = null;
    }
  }

  private _createFile(file: IFileStructure): PageRuntime {
    const dataSourceConfigSet = new DataSourceConfigSet(file.data),
      dataSourceManager = new DataSourceManager(dataSourceConfigSet),
      page = new PageRuntime();

    this._pageManager.addPage(page);
    return page;
  }

}
