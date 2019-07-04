import { Subscription } from 'rxjs';
import { ConfigSourceComponentRefManager } from '../../config/config.source.component.ref.manager';
import { dataModelManager } from '../../../data/data.model.manager';
import { Region } from '../region/region';

import {
  componentRepositoryManager,
  Destroyable,
  getParameterName,
  GraphicOption, guid,
  IGraphic,
  IGraphicOption,
} from '@barca/shared';
import { ModelSource } from '../../model/model.source';


/**
 *
 */
export class GraphicWrapper extends Destroyable {

  private _modelSource: ModelSource;
  private _graphic: IGraphic;

  private _modelSubscription: Subscription;

  private _optionAccessor: Function;

  constructor(private _region: Region) {
    super();
  }

  get uuid(): string {
    return this._modelSource.graphicOption.graphicId;
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
  init(option: IGraphicOption) {
    const graphicOption = new GraphicOption(option);
    const { graphicId, graphicPath } = graphicOption;
    // 创建graphic对象
    if (componentRepositoryManager.has(graphicPath)) {
      this._graphic = new (componentRepositoryManager.getComponentMeta(graphicPath).graphicDef)();
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
    graphicOption.graphicId = graphicId || guid(10, 16);

    this._modelSource = new ModelSource(this._region.page.configSourceManager, this._region.page.dataSourceManager);
    this._modelSource.init(graphicOption);
    this._modelSubscription = this._graphic.accept(this._modelSource.model$());

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

  /**
   * 切换配置源
   */
  switchConfigSource() {
    this._modelSource.switchConfigSource();
  }

  switchDataSource(dataSourceKey: string) {
    this._modelSource.switchDataSource(dataSourceKey);
  }

  // 激活配置面板
  activateConfig() {
    this._region.page.focusRegion = this._region;

    // 运行时不需要调用此方法
    dataModelManager.switchDataModel(this._modelSource.graphicOption.dataSourceKey, false);
    if (!ConfigSourceComponentRefManager.getInstance().has(this.uuid)) {
      this.switchConfigSource();
    }
    ConfigSourceComponentRefManager.getInstance().activate(this.uuid);
  }

  get optionAccessor() {
    return this._optionAccessor || (() => Object.assign({}, this._modelSource.graphicOption.value));
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
    console.log('graphicWrapper Resize');
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
