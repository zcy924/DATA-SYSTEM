import { ReportPageKernel } from './page.kernel';
import { session } from '../../../utils/session';
import { PageConfigComponent } from '../../../../components/page.config/page.config.component';
import { ComponentRef } from '@angular/core';
import { BasePageConfig } from '../../../../shared/core/page/page.config';
import { IReportPageInnerFacade } from './page.interface';
import { PageConfigRuntime } from '../../../../runtime/page.config.runtime';
import * as _ from 'lodash';
import { IFileStructure } from '../../../../shared/interface/file/file.structure';
import { Region } from '../../region/region';
import { graphicFactory } from '../../graphic/graphic.factory';
import { ReportPageInnerFacadeImpl } from './page.inner.facade';
import { VERSION_INFO } from './page.utils';

export class PageConfig {

  private _inner: BasePageConfig | ComponentRef<BasePageConfig>;

  constructor(private _mode: 'design' | 'runtime') {
    switch (_mode) {
      case 'design':
        this._inner = session.siderLeftComponent.forwardCreateCanvasConfig(PageConfigComponent);
        break;
      case 'runtime':
        this._inner = new PageConfigRuntime() as any;
        break;
    }
  }

  get model(): BasePageConfig {
    if (this._inner instanceof BasePageConfig) {
      return this._inner;
    } else {
      return this._inner.instance;
    }
  }

  show() {
    if (this._inner instanceof BasePageConfig) {

    } else {
      session.siderLeftComponent.attachDataProperty(this._inner.hostView);
    }
  }

  hide() {

  }

  destroy() {
    if (this._inner instanceof BasePageConfig) {
    } else {
      this._inner.destroy();
      this._inner = null;
    }
  }
}

export class ReportPageOuter {

  private _pageInner: ReportPageKernel;
  private _page: IReportPageInnerFacade;

  constructor(mode: 'design' | 'runtime') {
    this._pageInner = new ReportPageKernel(mode);
    this._pageInner.init();
    this._page = new ReportPageInnerFacadeImpl(this._pageInner);
  }

  get mode(): 'design' | 'runtime' {
    return this._pageInner.mode;
  }

  get $element() {
    return this._pageInner.view.$element;
  }

  offset() {
    return this._pageInner.view.offset();
  }

  get reportPage(): IReportPageInnerFacade {
    return this._page;
  }

  get actionManager() {
    return this._pageInner && this._pageInner.actionManager;
  }

  /**
   * 加载文件
   *
   * 检查文件结构/文件版本，判断传入的文件能否被打开
   * @param file
   */
  load(file: IFileStructure) {
    if (file.main && this._checkFile(file)) {
      file.main.option && this._pageInner.pageConfig.model.importOption(file.main.option);
      file.main.children && file.main.children.forEach((value) => {
        graphicFactory.paste(value);
      });
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
    return this._pageInner.compRepoManager.includes(componentRepositories)
      && this._pageInner.geneRepoManager.includes(generatorRepositories);
  }

  save() {
    const main = {
      option: this._pageInner.pageConfig.model.exportOption(),
      children: this._pageInner.regionManager.saveAs(),
    };
    let keys = _.uniq(main.children.map((value, index, array) => {
        return value.graphic.dataSourceKey;
      })),
      paths = _.uniq(main.children.map((value, index, array) => {
        return value.graphic.graphicPath;
      }));

    const dataSourceConfigArray = this._pageInner.dataSourceManager.getDataSourceConfigArray(keys);

    keys = this._pageInner.dataSourceManager.getDependencies(keys);
    paths = _.uniq(paths.map(value => value.split('$')[0]));
    console.log(JSON.stringify(keys), paths);
    return {
      manifest: {
        version: VERSION_INFO.version,
      },
      dependencies: {
        generatorRepositories: keys,
        componentRepositories: paths,
      },
      main,
      data: dataSourceConfigArray,
    };
  }

  /**
   * 清空页面中的所有图表
   * 对于单个图表 释放数据源 释放配置源 解绑dom事件绑定
   */
  clear() {
    this._pageInner.regionManager.regionArray.forEach((value: Region) => {
      value.destroy();
    });
  }

  enterFullScreen() {
    this._pageInner.view.enterFullScreen();
  }

  destroy() {
    if (this._page) {
      this._pageInner.destroy();
      this._pageInner = null;
      this._page.destroy();
      this._page = null;
    }
  }

}
