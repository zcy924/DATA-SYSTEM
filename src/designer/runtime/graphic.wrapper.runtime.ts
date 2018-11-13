import { combineLatest, Observable, Subscription } from 'rxjs/index';
import { RegionRuntime } from './region.runtime';
import { GraphicOption, IGraphicOption } from '@shared/file/component.option';
import { IGraphic } from '@shared/core/graphic/graphic';
import { ComponentRepositoryManager } from '@shared/manager/component.repository.manager';
import { getParameterName, guid } from '@shared/core/utils/tools';

export class GraphicWrapperRuntime {
  private _uuid: string;
  private _graphicOption: GraphicOption;

  private _graphic: IGraphic;
  private _configSource: Observable<any>;
  private _dataSource: Observable<any>;
  private _modelSubscription: Subscription;

  constructor(private _region: RegionRuntime) {

  }

  get $element(): JQuery {
    return this._graphic.$element;
  }

  init(option: IGraphicOption) {
    const region = this._region,
      page = region.page,
      graphicOption = this._graphicOption = new GraphicOption(option),
      { graphicId, graphicKey, graphicPath, dataSourceKey, configOption } = graphicOption,
      componentRepositoryManager = ComponentRepositoryManager.getInstance();
    if (componentRepositoryManager.has(graphicPath)) {
      this._graphic = new (componentRepositoryManager.getGraphicDef(graphicPath))();
      const paramNameArray = getParameterName(this._graphic.init), map = {
        region: region,
        wrapper: this,
      };
      this._graphic.init(...paramNameArray.map((paramName) => {
        return map[paramName];
      }));
    }

    this._uuid = graphicId || guid(10, 16);

    this._configSource = page
      .getConfigSource({
        graphicId: this._uuid,
        graphicKey,
        configOption,
      });

    this._dataSource = page.getDataSource(dataSourceKey);

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
