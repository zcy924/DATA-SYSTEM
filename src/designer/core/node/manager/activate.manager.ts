import { RegionController } from '../../../designer/core/region/region.controller';
import { ReportPageInner } from '../page/report/page.inner';
import { RegionState } from '../../../designer/core/region/region.model';

/**
 * 记录当前页面被激活的图表   并处理图标激活时 页面和图表状态的改变。
 */
export class ActivateManager {
  private _activatedRegion: RegionController;

  constructor(private _page: ReportPageInner) {

  }

  activate(region: RegionController) {
    // 改变图表自身状态
    region.state = RegionState.activated;
    // 改变页面状态
    // 改变激活辅助元素状态
    this._page.view.$element.addClass('activated');
    this._page.view.repaintMask(region.$element);
    this._activatedRegion = region;
  }

  deactivate() {
    if (this._activatedRegion) {
      this._activatedRegion.state = RegionState.default;
      this._page.view.$element.removeClass('activated');
      this._activatedRegion = null;
    }
  }

  regionResize(region: RegionController) {
    this._page.view.repaintMask(region.$element);
  }


  get regionActivated() {
    return !!this._activatedRegion;
  }

  destroy() {
    this._activatedRegion = null;
  }

}
