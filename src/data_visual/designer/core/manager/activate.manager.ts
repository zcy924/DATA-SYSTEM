import { Region } from '../structure/region/region';
import { ReportPageKernel } from '../structure/page/report/page.kernel';
import { Destroyable, RegionState } from '@data-studio/shared';

/**
 * 每一个设计时页面都有一个ActivateManager用来管理当前被激活的区域
 * 记录当前页面被激活的图表   并处理图标激活时 页面和图表状态的改变。
 */
export class ActivateManager extends Destroyable {
  private _activatedRegion: Region;

  constructor(private _page: ReportPageKernel) {
    super();
    this.onDestroy(() => {
      this._activatedRegion = null;
      this._page = null;
    });
  }

  activate(region: Region) {
    if (this.usable && region.usable) {
      // 改变图表自身状态
      region.state = RegionState.activated;
      // 改变页面状态
      // 改变激活辅助元素状态
      this._page.view.$element.addClass('activated');
      this._page.view.repaintMask(region.$element);
      this._activatedRegion = region;
    }
  }

  deactivate() {
    if (this._activatedRegion) {
      this._activatedRegion.state = RegionState.default;
      this._page.view.$element.removeClass('activated');
      this._activatedRegion = null;
    }
  }

  regionResize(region: Region) {
    this._page.view.repaintMask(region.$element);
  }


  get regionActivated() {
    return !!this._activatedRegion;
  }
}
