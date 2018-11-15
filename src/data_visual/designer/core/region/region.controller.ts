import { IGraphic } from '../../../shared/core/graphic/graphic';
import { GraphicWrapper } from '../graphic/graphic.wrapper';
import { IReportPage } from '../page/report/page.interface';
import { RegionModel, RegionState } from './region.model';
import { RegionView } from './region.view';
import { IRegion } from '../../../shared/core/region/region';


export abstract class RegionController implements IRegion {

  // 模型层
  protected _page: IReportPage;
  protected _model: RegionModel;
  protected _view: RegionView;
  protected _graphicWrapper: GraphicWrapper;

  private _methodMap: Map<string, Function> = new Map();

  get page(): IReportPage {
    return this._page;
  }

  get graphicWrapper(): GraphicWrapper {
    return this._graphicWrapper;
  }

  get $element() {
    return this._view.$element;
  }

  set state(param: RegionState) {
    this._model.state = param;
  }

  get state() {
    return this._model.state;
  }

  get index(): number {
    return this._model.zIndex;
  }

  init(regionOption: any) {

  }

  /**
   * 模型层关联，展现层关联
   * @param {IGraphic} graphic
   */
  addChild(graphic: GraphicWrapper) {
    this._graphicWrapper = graphic;
    this._view.$fill.append(graphic.$element);
  }

  updateTheme(theme: string) {
    if (this._graphicWrapper) {
      this._graphicWrapper.updateTheme(theme);
    }
  }

  setCoordinates(left, top) {
    this._model.setCoordinates(left, top);
    this._view.refresh();
  }

  setDimensions(width: number, height: number) {
    this._model.setDimensions(width, height);
    this._view.refresh();
    this._graphicWrapper && this._graphicWrapper.resize();
  }

  abstract getOption();

  addMethod(name: string, method: Function) {
    this._methodMap.set(name, method);
  }

  invoke(...args: Array<any>) {
    const name = args.shift();
    if (this._methodMap.has(name)) {
      return this._methodMap.get(name)(...args);
    }
  }

  /**
   * 1、销毁内部对象
   * 2、解除事件绑定
   * 3、解除当前对象的属性引用
   */
  destroy() {
    if (this._graphicWrapper) {
      this._graphicWrapper.destroy();
      this._graphicWrapper = null;
    }
    this._page.removeChild(this);
    this._page = null;

    this._methodMap.clear();

    this._view.destroy();
  }


}

