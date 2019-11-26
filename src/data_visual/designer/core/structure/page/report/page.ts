import * as _ from 'lodash';
import { Destroyable, IComponentOption, IFileStructure } from '@data-studio/shared';
import { ReportPageKernel } from './page.kernel';
import { IReportPage, IReportPageInner, OpenMode } from './page.interface';
import { Region } from '../../region/region';
import { VERSION_INFO } from './page.utils';
import { GraphicActionCreate } from '../../../operate/graphic.action.create';
import { GraphicActionPaste } from '../../../operate/graphic.action.paste';
import { addGraphicToPage } from '../../../operate/action.utils';

export class ReportPage extends Destroyable implements IReportPage {

  private _pageKernel: ReportPageKernel;

  constructor(mode: OpenMode) {
    super();
    this._pageKernel = new ReportPageKernel(mode);
    this._pageKernel.init();
    this.onDestroy(() => {
      this._pageKernel.destroy();
      this._pageKernel = null;
    });
  }

  get mode(): OpenMode {
    return this._pageKernel.mode;
  }

  get element() {
    return this._pageKernel.view.$element[0];
  }

  get $element() {
    return this._pageKernel.view.$element;
  }

  /**
   * 计算组件在页面中的位置
   */
  offset() {
    return this._pageKernel.view.offset();
  }

  get reportPage(): IReportPageInner {
    return this._pageKernel.asPageInner();
  }

  get actionManager() {
    return this._pageKernel && this._pageKernel.actionManager;
  }

  /**
   * 加载文件
   *
   * 检查文件结构/文件版本，判断传入的文件能否被打开
   * @param file
   */
  load(file: IFileStructure) {
    if (file.main) {
      file.main.option && this._pageKernel.pageConfigManager.model.importOption(file.main.option);
      file.main.children && file.main.children.forEach((componentOption: IComponentOption) => {
        addGraphicToPage(this._pageKernel.asPageInner(), componentOption);
      });
    }
  }

  save() {
    const main = {
      option: this._pageKernel.pageConfigManager.model.exportOption(),
      children: this._pageKernel.regionManager.saveAs(),
    };
    let keys = _.uniq(main.children.map((componentOption: IComponentOption, index, array) => {
        return componentOption.graphic.graphicOption.dataSourceConfigID;
      })),
      paths = _.uniq(main.children.map((value, index, array) => {
        return value.graphic.graphicPath;
      }));

    const dataSourceConfigArray = this._pageKernel.modelSourceManager.dataSourceManager.getDataSourceConfigArray(keys);

    keys = this._pageKernel.modelSourceManager.dataSourceManager.getDependencies(keys);
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
   *  创建新的图表
   * @param graphicName
   * @param x
   * @param y
   * @param configSourceOption 创建图片的时候，会从外部传入图片信息
   */
  createGraphic(graphicName: string, x: number, y: number, configSourceOption?: any) {
    this._pageKernel.actionManager.execute(new GraphicActionCreate(this._pageKernel.asPageInner(), graphicName, x/this._pageKernel.view.scale, y/this._pageKernel.view.scale, configSourceOption));
  }

  paste(componentOption: any, x?: number, y?: number) {
    this._pageKernel.actionManager.execute(new GraphicActionPaste(this._pageKernel.asPageInner(), componentOption, x, y));
  }

  enterFullScreen() {
    this.usable && this._pageKernel.view.enterFullScreen();
  }

  /**
   * 清空页面中的所有图表
   * 对于单个图表 释放数据源 释放配置源 解绑dom事件绑定
   */
  clear() {
    this._pageKernel.regionManager.regionArray.forEach((value: Region) => {
      value.destroy();
    });
  }
}
