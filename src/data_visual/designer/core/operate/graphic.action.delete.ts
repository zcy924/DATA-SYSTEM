import { Region } from '../structure/region/region';
import { IAction } from './action';
import { IReportPageInnerFacade } from '../structure/page/report/page.interface';
import { addGraphicToPage } from './action.utils';

/**
 * 图表删除动作
 */
export class GraphicActionDelete implements IAction {

  private _deletedRegionCache: Array<string> = [];

  constructor(private _pageInnerFacade: IReportPageInnerFacade, private _toDeleteArray: Array<Region>) {
  }

  forward() {
    this._deletedRegionCache = [];
    this._toDeleteArray.forEach((region: Region) => {
      this._deletedRegionCache.push(JSON.stringify(region.getOption()));
      region.destroy();
    });
    this._toDeleteArray = [];
  }

  backward() {
    this._toDeleteArray = [];
    this._deletedRegionCache.forEach((optionStr: string) => {
      const componentOption = JSON.parse(optionStr);
      const { region } = addGraphicToPage(this._pageInnerFacade, componentOption);
      this._toDeleteArray.push(region);
    });
  }
}

