import { regionDefinitionMap } from '../structure/region/region.definition.map';
import { IReportPageInnerFacade } from '../structure/page/report/page.interface';
import { Region } from '../structure/region/region';
import { GraphicWrapper } from '../structure/graphic/graphic.wrapper';
import { IAction } from './action';
import { ComponentRepositoryManager, deepClone, IComponentOption } from '@barca/shared';

/**
 * 图表创建动作
 */
export class GraphicActionCreate implements IAction {

  private _region: Region;

  constructor(private _pageInnerFacade: IReportPageInnerFacade, private _graphicPath: string,
              private _left: number, private _top: number, private _configOption?: any) {

  }

  forward() {
    const compRepoManager = ComponentRepositoryManager.getInstance();
    // 是否存在图表的默认定义
    if (compRepoManager.has(this._graphicPath)) {
      const componentOption: IComponentOption = compRepoManager.getComponentMeta(this._graphicPath).componentOption;

      // 创建region
      if (regionDefinitionMap.has(componentOption.region.regionKey)) {
        const region: Region = new (regionDefinitionMap.get(componentOption.region.regionKey))(this._pageInnerFacade);
        region.init(Object.assign({}, componentOption.region.regionOption, {
            left: this._left,
            top: this._top,
          }),
          this._configOption ?
            Object.assign({}, componentOption.graphic, { configOption: deepClone(this._configOption) }) :
            deepClone(componentOption.graphic));

        this._region = region;

        return {
          region,
        };
      }
    }
  }

  backward() {
    if (this._region) {
      this._region.destroy();
      this._region = null;
    }
  }
}
