import { GraphicWrapperRuntime } from './graphic.wrapper.runtime';
import { PageRuntime } from './page.runtime';
import { RegionOption } from '@core/node/region/region.model';

const template = `
<div class="m-dashbox">
  <div class="g-fill u-graphic droppable"></div>
  </div>
`;

export class RegionRuntime {

  private _graphicWrapper;

  $element: JQuery;
  private _$fill: JQuery;

  private _regionOption: RegionOption;

  get page(): PageRuntime {
    return this._page;
  }

  constructor(private _page: PageRuntime) {
    const $element = this.$element = $(template);
    this._$fill = $element.find('.g-fill');

    this._page.addChild(this);
  }

  init(regionOption: any) {
    this._regionOption = regionOption;
  }

  addChild(graphic: GraphicWrapperRuntime) {
    this._graphicWrapper = graphic;
    this._$fill.append(graphic.$element);
  }

  updateTheme(theme: string) {
    if (this._graphicWrapper) {
      this._graphicWrapper.updateTheme(theme);
    }
  }

  render() {
    const model = this._regionOption;
    this.$element.css({
      width: model.width,
      height: model.height,
      left: model.left,
      top: model.top,
      zIndex: model.zIndex,
    });
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
}
