import { PageRuntime } from './page.runtime';
import { GraphicWrapperRuntime } from './graphic.wrapper.runtime';
import { IRegionOption } from '@shared/file/component.option';

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

  addChild(graphic: GraphicWrapperRuntime) {
    this._graphicWrapper = graphic;
    this._$fill.append(graphic.$element);
  }

  init(regionOption: any) {
    this._regionOption = regionOption;
    this._refresh();
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
