import { IGraphic } from '../../../../shared/core/graphic/graphic';
import { GraphicWrapper } from '../graphic/graphic.wrapper';
import { IReportPageInnerFacade } from '../page/report/page.interface';
import { RegionModel, RegionState } from './region.model';
import { RegionView } from './region.view';
import { IRegion } from '../../../../shared/core/region/region';
import { Destroyable, Coordinates, Dimensions, Rectangle } from '@barca/shared';


export abstract class Region extends Destroyable implements IRegion {

  // 模型层
  protected _page: IReportPageInnerFacade;
  protected _model: RegionModel;
  protected _view: RegionView;
  protected _graphicWrapper: GraphicWrapper;

  private _methodMap: Map<string, Function> = new Map();

  protected constructor() {
    super();
    this.onDestroy(() => {
      // 1、销毁内部对象
      // 2、解除事件绑定
      // 3、解除当前对象的属性引用
      if (this._graphicWrapper) {
        this._graphicWrapper.destroy();
        this._graphicWrapper = null;
      }
      this._page.removeChild(this);
      this._page = null;

      this._methodMap.clear();

      this._view.destroy();
    });
  }

  get $element() {
    return this._view.$element;
  }

  get page(): IReportPageInnerFacade {
    return this._page;
  }

  get graphicWrapper(): GraphicWrapper {
    return this._graphicWrapper;
  }

  get index(): number {
    return this._model.zIndex;
  }

  set coordinates(coordinates: Coordinates) {
    this._model.coordinates = coordinates;
    this.sync();
  }

  set dimensions(dimensions: Dimensions) {
    this._model.dimensions = dimensions;
    this.sync();
    this._graphicWrapper && this._graphicWrapper.resize();
  }

  set rectangle(value: Rectangle) {
    this._model.rectangle = value;
    this.sync();
    setTimeout(() => {
      this._graphicWrapper && this._graphicWrapper.resize();
    }, 200);
  }

  set state(param: RegionState) {
    this._model.state = param;
  }

  get state() {
    return this._model.state;
  }

  init(regionOption: any) {

  }

  abstract sync();

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

  addMethod(name: string, method: Function) {
    this._methodMap.set(name, method);
  }

  invoke(...args: Array<any>) {
    const name = args.shift();
    if (this._methodMap.has(name)) {
      return this._methodMap.get(name)(...args);
    }
  }

  abstract getOption();

}

