import { PageRuntime } from './page.runtime';
import { GraphicWrapperRuntime } from './graphic.wrapper.runtime';
import { IRegionOption } from '../interface/file/region.option';

const template = `
<div class="m-dashbox">
  <div class="g-fill u-graphic droppable"></div>
  </div>
`;

export class RegionRuntime {

  private _page: PageRuntime;
  private _graphicWrapper: GraphicWrapperRuntime;

  $element: JQuery;
  private _$fill: JQuery;

  private _regionOption: IRegionOption;

  get page(): PageRuntime {
    return this._page;
  }

  constructor(page: PageRuntime) {
    this._page = page;
    const $element = this.$element = $(template);
    this._$fill = $element.find('.g-fill');

    this._page.addChild(this);
  }

  init(regionOption: any) {
    this._regionOption = regionOption;
    this._refresh();
    const graphicWrapper = this._graphicWrapper = new GraphicWrapperRuntime(this);
    this._$fill.append(graphicWrapper.$element);
    graphicWrapper.init(regionOption);
  }

  updateTheme(theme: string) {
    if (this._graphicWrapper) {
      this._graphicWrapper.updateTheme(theme);
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

    // this._view.destroy();
  }

  private _refresh() {
    const model = this._regionOption;
    this.$element.css({
      width: model.width,
      height: model.height,
      left: model.left,
      top: model.top,
      zIndex: model.zIndex,
    });
  }


}
