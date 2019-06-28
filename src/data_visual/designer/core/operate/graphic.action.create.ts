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
              private _x: number, private _y: number, private _configOption?: any) {

  }

  forward() {
    const compRepoManager = ComponentRepositoryManager.getInstance();
    // 是否存在图表的默认定义
    if (compRepoManager.has(this._graphicPath)) {
      const componentOption: IComponentOption = compRepoManager.getComponentMeta(this._graphicPath).componentOption;

      // 创建region
      if (regionDefinitionMap.has(componentOption.region.regionKey)) {
        const region: Region = new (regionDefinitionMap.get(componentOption.region.regionKey))(this._pageInnerFacade);
        region.init(null);
        region.setCoordinates(this._x, this._y);
        if (componentOption.region.regionOption) {
          const { width, height } = componentOption.region.regionOption;
          region.setDimensions(width, height);
        }

        // 创建graphic
        const graphicWrapper = new GraphicWrapper(region);
        if (this._configOption) {
          graphicWrapper.init(
            Object.assign({}, componentOption.graphic, { configOption: deepClone(this._configOption) }),
          );
        } else {
          graphicWrapper.init(deepClone(componentOption.graphic));
        }


        setTimeout(() => {
          graphicWrapper.resize();
        }, 200);

        this._region = region;

        return {
          region, graphicWrapper,
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
