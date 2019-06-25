import { ReportPageInner } from './page.inner';
import { session } from '../../../utils/session';
import { PageConfigComponent } from '../../../../components/page.config/page.config.component';
import { ComponentRef } from '@angular/core';
import { BasePageConfig } from '../../../../shared/core/page/page.config';
import { IReportPage } from './page.interface';
import { PageConfigRuntime } from '../../../../runtime/page.config.runtime';
import * as _ from 'lodash';
import { IFileStructure } from '../../../../shared/file/file.structure';
import { RegionController } from '../../region/region.controller';
import { graphicFactory } from '../../graphic/graphic.factory';
import { ReportPage } from './page';

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

  private static readonly _version = '1.0.0';
  private static readonly _versionPattern = /^\d+\.\d+\.\d+$/;
  private _pageInner: ReportPageInner;
  private _page: IReportPage;

  static get version() {
    return this._version;
  }

  private accept(versionNo: string): boolean {
    if (ReportPageOuter._versionPattern.test(versionNo)) {
      const [a, b, c] = versionNo.match(/\d+/g),
        [ta, tb, tc] = ReportPageOuter._version.match(/\d+/g);
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

  constructor(mode: 'design' | 'runtime') {
    this._pageInner = new ReportPageInner(mode);
    this._pageInner.init();
    this._page = new ReportPage(this._pageInner);
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

  get reportPage(): IReportPage {
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
    return version ? this.accept(version) : false;
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
        version: ReportPageOuter._version,
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
    this._pageInner.regionManager.regionArray.forEach((value: RegionController) => {
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
