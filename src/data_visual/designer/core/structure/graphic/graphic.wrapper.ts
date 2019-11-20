import { Subscription } from 'rxjs';
import {
  Destroyable,
  getParameterName,
  GraphicOption, guid,
  componentManager,
  IGraphic,
  IGraphicOption, IModelSource,
} from '@data-studio/shared';
import { dataModelManager } from '../../../data/data.model.manager';
import { Region } from '../region/region';

/**
 *
 */
export class GraphicWrapper extends Destroyable {


  private _region: Region;
  private _graphic: IGraphic;

  private _modelSource: IModelSource;
  private _modelSubscription: Subscription;

  private _optionAccessor: Function;

  constructor(_region: Region) {
    super();
    this._region = _region;
  }

  get uuid(): string {
    return this._modelSource.id;
  }

  get $element() {
    return this._graphic.$element;
  }

  /**
   * 创建Graphic
   *  $element属性可用
   * 创建ConfigSource
   * 创建DataSource
   * @param graphicOption
   */
  init({ graphicPath, graphicOption }: { graphicPath: string, graphicOption: IGraphicOption }) {
    const graphicOptionWrapper = new GraphicOption(graphicPath, graphicOption);
    const { id } = graphicOptionWrapper;
    // 创建graphic对象
    if (componentManager.has(graphicPath)) {
      this._graphic = componentManager.getGraphicInstance(graphicPath);
      const paramNameArray = getParameterName(this._graphic.init), map = {
        region: this._region,
        wrapper: this,
      };
      this._graphic.init(...paramNameArray.map((paramName) => {
        return map[paramName];
      }));
      this._region.addChild(this);
    }
    this.onDestroy(() => {
      if (this._graphic) {
        this._graphic.destroy();
        this._graphic = null;
      }
    });

    // 创建modelSource
    graphicOption.id = id || guid(10, 16);

    this._modelSource = this._region.page.getModelSource(graphicOptionWrapper);
    this._modelSubscription = this._graphic.accept(this._modelSource.model$);

    this.onDestroy(() => {
      if (this._modelSubscription) {
        this._modelSubscription.unsubscribe();
        this._modelSubscription = null;
      }
      this._modelSource.destroy();

      this._optionAccessor = null;
      this._region = null;
    });
  }

  switchDataSource(dataSourceConfigID: string) {
    this._modelSource.switchDataSource(dataSourceConfigID);
  }

  // 激活配置面板
  activateConfig() {
    this._region.page.focusRegion = this._region;

    // 运行时不需要调用此方法
    dataModelManager.switchDataModel(this._modelSource.dataSourceConfigID, false);
    if (!this._region.page.modelSourceManager.componentRefManager.has(this.uuid)) {
      this._modelSource.switchConfigSource();
    }
    this._region.page.modelSourceManager.componentRefManager.activate(this.uuid);
  }

  get optionAccessor() {
    return this._optionAccessor || (() => Object.assign({}, this._modelSource.value));
  }

  set optionAccessor(value: Function) {
    this._optionAccessor = value;
  }

  getOption() {
    return this.optionAccessor();
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

  // 图标进入交互状态
  activate() {
    if (this._graphic) {
      this._graphic.activate();
    }
  }

  deactivate() {
    if (this._graphic) {
      this._graphic.deactivate();
    }
  }
}
