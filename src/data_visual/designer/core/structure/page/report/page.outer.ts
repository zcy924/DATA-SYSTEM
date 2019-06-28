import { ReportPageKernel } from './page.kernel';
import { IReportPageInnerFacade } from './page.interface';
import * as _ from 'lodash';
import { Region } from '../../region/region';
import { ReportPageInnerFacadeImpl } from './page.inner.facade';
import { VERSION_INFO } from './page.utils';
import { Destroyable, IFileStructure } from '@barca/shared';
import { GraphicActionCreate } from '../../../operate/graphic.action.create';
import { addGraphicToPage, GraphicActionPaste } from '../../../operate/graphic.action.paste';

export class ReportPage extends Destroyable {

  private _pageKernel: ReportPageKernel;
  private _pageInnerFacade: IReportPageInnerFacade;

  constructor(mode: 'design' | 'runtime') {
    super();
    this._pageKernel = new ReportPageKernel(mode);
    this._pageKernel.init();
    this._pageInnerFacade = new ReportPageInnerFacadeImpl(this._pageKernel);
    this.addSubscription(() => {
      if (!this.destroyed) {
        this._pageKernel.destroy();
        this._pageKernel = null;
        this._pageInnerFacade.destroy();
        this._pageInnerFacade = null;
      }
    });
  }

  get mode(): 'design' | 'runtime' {
    return this._pageKernel.mode;
  }

  get $element() {
    return this._pageKernel.view.$element;
  }

  offset() {
    return this._pageKernel.view.offset();
  }

  get reportPage(): IReportPageInnerFacade {
    return this._pageInnerFacade;
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
      file.main.option && this._pageKernel.config.model.importOption(file.main.option);
      file.main.children && file.main.children.forEach((value) => {
        this._paste(value);
      });
    }
  }

  private _paste(graphicMeta) {
    addGraphicToPage(this._pageInnerFacade, graphicMeta);
  }

  save() {
    const main = {
      option: this._pageKernel.config.model.exportOption(),
      children: this._pageKernel.regionManager.saveAs(),
    };
    let keys = _.uniq(main.children.map((value, index, array) => {
        return value.graphic.dataSourceKey;
      })),
      paths = _.uniq(main.children.map((value, index, array) => {
        return value.graphic.graphicPath;
      }));

    const dataSourceConfigArray = this._pageKernel.dataSourceManager.getDataSourceConfigArray(keys);

    keys = this._pageKernel.dataSourceManager.getDependencies(keys);
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
   * @param configOption 创建图片的时候，会从外部传入图片信息
   */
  createGraphic(graphicName: string, x: number, y: number, configOption?: any) {
    this._pageKernel.actionManager.execute(new GraphicActionCreate(this._pageInnerFacade, graphicName, x, y, configOption));
  }

  paste(graphicMeta: any, x?: number, y?: number) {
    this._pageKernel.actionManager.execute(new GraphicActionPaste(this._pageInnerFacade, graphicMeta, x, y));
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

  enterFullScreen() {
    this._pageKernel.view.enterFullScreen();
  }
}
