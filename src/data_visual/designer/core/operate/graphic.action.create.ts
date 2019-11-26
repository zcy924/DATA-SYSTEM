import * as _ from 'lodash';
import { componentManager, deepClone, Destroyable, IComponentOption } from '@data-studio/shared';
import { regionDefinitionMap } from '../structure/region/region.definition.map';
import { IReportPageInner } from '../structure/page/report/page.interface';
import { Region } from '../structure/region/region';
import { IAction } from './action';

/**
 * 图表创建动作
 *
 *
 */
export class GraphicActionCreate extends Destroyable implements IAction {

  private _region: Region;

  /**
   *
   * @param _pageInner  目标页面
   * @param _graphicPath  图表URI
   * @param _left
   * @param _top
   * @param _configSourceOption 图表选项，譬如新建图片时，传递图片的维度、dataURL
   */
  constructor(private _pageInner: IReportPageInner, private _graphicPath: string,
              private _left: number, private _top: number, private _configSourceOption?: any) {
    super();
    this.onDestroy(() => {
      this._pageInner = this._graphicPath = this._configSourceOption = this._region = null;
      this._left = this._top = null;
    });
  }

  forward() {
    // 是否存在图表的默认定义
    if (componentManager.has(this._graphicPath)) {
      const componentOption: IComponentOption = componentManager.getComponentMeta(this._graphicPath).componentOption,
        { region, graphic } = componentOption;

      // 创建region
      if (regionDefinitionMap.has(region.regionKey)) {
        const regionInstance: Region = new (regionDefinitionMap.get(region.regionKey))(this._pageInner);
        const param = deepClone(graphic);
        if (this._configSourceOption) {
          // 由于用户可能反复执行撤销、重做，所以this_configSourceOption会被重复使用
          _.set(param, 'graphicOption.configSourceOption', deepClone(this._configSourceOption));
        }
        regionInstance.init(Object.assign({}, region.regionOption, {
          left: this._left,
          top: this._top,
        }), param);

        this._region = regionInstance;
        regionInstance.updateTheme(this._pageInner.theme);
        return {
          region: regionInstance,
        };
      }
    }
  }

  backward() {
    if (this._region && this._region.usable) {
      this._region.destroy();
      this._region = null;
    }
  }
}
