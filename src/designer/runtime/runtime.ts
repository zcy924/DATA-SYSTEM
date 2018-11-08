import { IFileStructure } from '../shared/file/file.structure';
import { PageRuntime } from './page.runtime';
import { ComponentRepository } from '../shared/core/repository/component.repository';
import { ComponentRepositoryManager } from '../shared/manager/component.repository.manager';
import { PageManagerRuntime } from './page.manager.runtime';
import * as _ from 'lodash';
import { GeneratorRepositoryManager } from '../shared/manager/generator.repository.manager';

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

  private static readonly _version = '1.0.0';
  private static readonly _versionPattern = /^\d+\.\d+\.\d+$/;

  private _pageManager = new PageManagerRuntime();
  private _compRepoManager = new ComponentRepositoryManager();
  private _generatorRepoManager = new GeneratorRepositoryManager();

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
      return this._createFile();
    }
  }

  private _checkFile(file: IFileStructure): boolean {
    return this._checkVersion(file) && this._checkDependencies(file);
  }

  private _checkVersion(file: IFileStructure) {
    return Runtime.accept(_.get(file, 'manifest.version'));
  }

  private _checkDependencies(file: IFileStructure) {
    const { componentRepositories, dataSourceGeneratorRepositories } =
      _.get(file, 'dependencies');
    return this._compRepoManager.includes(componentRepositories)
      && this._generatorRepoManager.includes(dataSourceGeneratorRepositories);
  }

  get pages(): Array<PageRuntime> {
    return this._pageManager.pages;
  }

  addComponentRepository(repo: ComponentRepository) {
    this._compRepoManager.addComponentRepository(repo);
  }

  removeComponentRepository() {
  }

  destroy() {
    if (this._compRepoManager) {
      this._compRepoManager.destroy();
      this._compRepoManager = null;
    }
  }

  private _createFile(): PageRuntime {
    const page = new PageRuntime();

    this._pageManager.addPage(page);
    return page;
  }

}
