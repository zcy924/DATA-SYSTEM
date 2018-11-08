import { combineLatest, Observable, Subscription } from 'rxjs/index';
import { IGraphic } from '@core/node/graphic/graphic';
import { getParameterName, guid } from '@core/node/utils/tools';
import { graphicMap } from '@core/node/config/graphic.map';
import { RegionRuntime } from './region.runtime';
import { IGraphicOption } from '@shared/file/component.option';

export class GraphicWrapperRuntime {
  private _uuid: string;
  private _graphicOption: IGraphicOption;

  private _graphic: IGraphic;
  private _configSource: Observable<any>;
  private _dataSource: Observable<any>;
  private _modelSubscription: Subscription;

  constructor(private _region: RegionRuntime) {

  }

  get $element(): JQuery {
    return this._graphic.$element;
  }

  init(graphicOption: IGraphicOption) {
    this._graphicOption = graphicOption;
    const { graphicId, graphicKey, dataSourceKey, configOption } = graphicOption;
    if (graphicMap.has(graphicKey)) {
      this._graphic = new (graphicMap.get(graphicKey))();
      const paramNameArray = getParameterName(this._graphic.init), map = {
        region: this._region,
        wrapper: this,
      };
      this._graphic.init(...paramNameArray.map((paramName) => {
        return map[paramName];
      }));
    }

    this._uuid = graphicId || guid(10, 16);

    // 有configOption一般粘贴，或者打开新的文件时 会走这条路
    this._configSource = this._region.page
      .getConfigSource({
        graphicId: this._uuid,
        graphicKey,
        configOption,
      });

    this._dataSource = this._region.page.getDataSource(dataSourceKey);

    // 两个组件必须同时打开  不然收不到信息
    this._modelSubscription = this._graphic
      .accept(combineLatest(this._configSource, this._dataSource));
  }

  /**
   * 更新全局样式 目前只有Echart图表使用的到
   * @param {string} theme
   */
  updateTheme(theme: string) {
    if (this._graphic) {
      this._graphic.updateTheme(theme);
    }
  }


  resize() {
    if (this._graphic) {
      this._graphic.resize();
    }
  }

  destroy() {
    if (this._modelSubscription) {
      this._modelSubscription.unsubscribe();
      this._modelSubscription = null;
    }
    if (this._graphic) {
      this._graphic.destroy();
      this._graphic = null;
    }
  }
}
