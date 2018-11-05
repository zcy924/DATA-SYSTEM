import { IFileStructure } from '../interface/file/file.structure';
import { PageRuntime } from './page.runtime';

/**
 * 1、支持同时打开多个页面
 *
 */
export class Runtime {

  private _pageArray: Array<PageRuntime> = [];

  public init() {
  }

  open(file: IFileStructure): PageRuntime {
    return this._createFile();
  }

  getFiles() {
  }

  addCompRepository() {

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
