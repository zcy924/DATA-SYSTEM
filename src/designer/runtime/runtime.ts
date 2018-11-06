import { IFileStructure } from '../interface/file/file.structure';
import { PageRuntime } from './page.runtime';
import { ComponentRepository } from '../interface/component.repository';
import { ComponentRepositoryManager } from '../manager/component.repository.manager';

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

  private _pageArray: Array<PageRuntime> = [];

  public init() {
  }

  open(file: IFileStructure): PageRuntime {
    return this._createFile();
  }

  getPages(): Array<PageRuntime> {
    return null;
  }

  addCompRepository(repo: ComponentRepository) {
    new ComponentRepositoryManager();
  }

  removeCompRepository() {
  }

  destroy() {
  }

  private _createFile(): PageRuntime {
    const page = new PageRuntime();

    return page;
  }

}
