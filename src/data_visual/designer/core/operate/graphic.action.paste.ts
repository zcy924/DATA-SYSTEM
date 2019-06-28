import { regionDefinitionMap } from '../structure/region/region.definition.map';
import { Region } from '../structure/region/region';
import { GraphicWrapper } from '../structure/graphic/graphic.wrapper';
import { IAction } from './action';
import { IReportPageInnerFacade } from '../structure/page/report/page.interface';

/**
 * 图表创建动作
 */
export class GraphicActionPaste implements IAction {

  private _region: Region;

  constructor(private _pageInnerFacade: IReportPageInnerFacade, private _graphicMeta: any, private _x?: number, private  _y?: number) {
  }

  forward() {
    const { region, graphicWrapper } = addGraphicToPage(this._pageInnerFacade, this._graphicMeta, this._x, this._y);
    this._region = region;
  }

  backward() {
    if (this._region) {
      this._region.destroy();
      this._region = null;
    }
  }
}

export function addGraphicToPage(pageInnerFacade: IReportPageInnerFacade, graphicMeta: any, x?: number, y?: number) {
  if (regionDefinitionMap.has(graphicMeta.region.regionKey)) {
    // 创建region
    // 第一步创建region对象
    const region: Region = new (regionDefinitionMap.get(graphicMeta.region.regionKey))(pageInnerFacade);
    // 第二步初始化region
    region.init(graphicMeta.region.regionOption);

    if (Number.isInteger(x) && Number.isInteger(y)) {
      region.setCoordinates(x, y);
    }

    const graphicWrapper = new GraphicWrapper(region);
    graphicWrapper.init(graphicMeta.graphic);

    setTimeout(() => {
      graphicWrapper.resize();
    }, 200);

    return { region, graphicWrapper };
  }
}
