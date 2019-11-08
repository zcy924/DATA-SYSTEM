import * as _ from 'lodash';
import { componentManager, deepClone, IComponentOption } from '@data-studio/shared';
import { regionDefinitionMap } from '../structure/region/region.definition.map';
import { IReportPageInnerFacade } from '../structure/page/report/page.interface';
import { Region } from '../structure/region/region';
import { IAction } from './action';

/**
 * 图表创建动作
 *
 *
 */
export class GraphicActionCreate implements IAction {

  private _region: Region;

  constructor(private _pageInnerFacade: IReportPageInnerFacade, private _graphicPath: string,
              private _left: number, private _top: number, private _configSourceOption?: any) {

  }

  forward() {
    // 是否存在图表的默认定义
    if (componentManager.has(this._graphicPath)) {
      const componentOption: IComponentOption = componentManager.getComponentMeta(this._graphicPath).componentOption,
        { region, graphic } = componentOption;

      // 创建region
      if (regionDefinitionMap.has(region.regionKey)) {
        const regionInstance: Region = new (regionDefinitionMap.get(region.regionKey))(this._pageInnerFacade);
        const param = deepClone(graphic);
        if (this._configSourceOption) {
          _.set(param, 'graphicOption.configSourceOption', deepClone(this._configSourceOption));
        }
        regionInstance.init(Object.assign({}, region.regionOption, {
          left: this._left,
          top: this._top,
        }), param);

        this._region = regionInstance;
        return {
          region: regionInstance,
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
