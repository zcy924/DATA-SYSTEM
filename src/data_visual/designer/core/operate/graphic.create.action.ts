import { regionDefinitionMap } from '../../config/region.definition.map';
import { IReportPageInnerFacade } from '../page/report/page.interface';
import { ComponentRepositoryManager } from '../../../shared/core/repository/component.repository.manager';
import { IComponentOption } from '../../../shared/file/component.option';
import { Region } from '../region/region';
import { GraphicWrapper } from '../graphic/graphic.wrapper';
import { IAction } from './action';

/**
 * 图表创建动作
 */
export class GraphicCreateAction implements IAction {

  private _region: Region;

  constructor(private _graphicPath: string, private _page: IReportPageInnerFacade,
              private _x: number, private _y: number, private _configOption?: any) {

  }

  forward() {
    const compRepoManager = ComponentRepositoryManager.getInstance();
    // 是否存在图表的默认定义
    if (compRepoManager.has(this._graphicPath)) {
      const componentOption: IComponentOption = compRepoManager.getComponentMeta(this._graphicPath).componentOption;

      if (regionDefinitionMap.has(componentOption.region.regionKey)) {
        const region: Region = new (regionDefinitionMap.get(componentOption.region.regionKey))(this._page);
        region.init(null);
        region.setCoordinates(this._x, this._y);
        if (componentOption.region.regionOption) {
          const { width, height } = componentOption.region.regionOption;
          region.setDimensions(width, height);
        }

        const graphicWrapper = new GraphicWrapper(region);
        if (this._configOption) {
          graphicWrapper.init(Object.assign({}, componentOption.graphic, { configOption: JSON.parse(JSON.stringify(this._configOption)) }));
        } else {
          graphicWrapper.init(JSON.parse(JSON.stringify(componentOption.graphic)));
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
